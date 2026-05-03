import logging
import threading
from concurrent.futures import ThreadPoolExecutor
from datetime import date

from celery import shared_task
from django.conf import settings
from django.db import connection as default_db_connection

logger = logging.getLogger(__name__)

# Per-keyword scans are I/O-bound on DataforSEO API calls (~10s each), so
# fan them out across a thread pool. 4 workers gives ~4x speedup without
# stressing SQLite (which serializes writes) or DataforSEO rate limits.
SCAN_WORKERS = 4


@shared_task(bind=True)
def weekly_rank_tracking(self, project_id=None):
    """Check SERP + Maps rankings for tracked keywords.

    Emits Celery PROGRESS state after each keyword so the polling endpoint
    can show "Checking 12 / 40" in real time.

    Args:
        project_id: Optional — if provided, only check this business.
                   Otherwise check all active clients.
    """
    from clients.models import Business
    from apps.keywords.models import Keyword, KeywordStatus
    from apps.keywords.services import refresh_missing_for_client
    from services.dataforseo import DataForSEOClient, LocalFinderService, MapsService, SERPService
    from services.dataforseo.screenshots import ScreenshotService

    api_client = DataForSEOClient(
        login=settings.DATAFORSEO_LOGIN,
        password=settings.DATAFORSEO_PASSWORD,
    )
    serp_service = SERPService(api_client)
    maps_service = MapsService(api_client)
    local_finder_service = LocalFinderService(api_client)
    screenshot_service = ScreenshotService(api_client)

    today = date.today()
    clients = list(Business.objects.filter(status='active'))
    if project_id:
        clients = [b for b in clients if b.id == project_id]

    # Pre-compute total tracked keywords across all selected businesses so the
    # progress meta has a stable denominator for the UI ("12 of 40").
    total = sum(
        Keyword.objects.filter(business=b, status=KeywordStatus.TRACKED).count()
        for b in clients
    )

    counts = {"checked": 0, "failed": 0}
    api_errors: list[str] = []  # surface DataForSEO failures (balance, auth, quota) to caller
    state_lock = threading.Lock()

    def _emit(current_kw: str, current_biz: str):
        try:
            self.update_state(state='PROGRESS', meta={
                'checked': counts["checked"],
                'failed': counts["failed"],
                'total': total,
                'current_keyword': current_kw,
                'current_business': current_biz,
                'api_errors': list(api_errors),
            })
        except Exception:
            # update_state failure must never crash the task — just log.
            logger.warning("update_state failed (non-fatal)")

    for business in clients:
        keywords = list(Keyword.objects.filter(
            business=business,
            status=KeywordStatus.TRACKED,
        ))
        if not keywords:
            continue

        def _scan_one(keyword, business=business):
            try:
                _check_keyword_rankings(
                    keyword=keyword,
                    business=business,
                    today=today,
                    serp_service=serp_service,
                    maps_service=maps_service,
                    screenshot_service=screenshot_service,
                    local_finder_service=local_finder_service,
                )
                with state_lock:
                    counts["checked"] += 1
                    _emit(keyword.keyword_text, business.domain)
            except Exception as e:
                err_str = str(e)
                with state_lock:
                    counts["failed"] += 1
                    # Capture meaningful API errors so the polling endpoint can
                    # show "Insufficient balance" / "Auth failed" instead of a
                    # vague success when nothing actually updated.
                    if ("DataForSEO API error" in err_str or "Payment Required" in err_str) and err_str not in api_errors:
                        api_errors.append(err_str)
                    _emit(keyword.keyword_text, business.domain)
                logger.exception(
                    "Failed to check rankings for keyword=%s business=%s",
                    keyword.keyword_text, business.domain,
                )
            finally:
                # Each thread gets its own DB connection — release it so we
                # don't leak (Django uses thread-local connection pools).
                default_db_connection.close()

        with ThreadPoolExecutor(max_workers=SCAN_WORKERS) as pool:
            list(pool.map(_scan_one, keywords))

        try:
            refresh_missing_for_client(business)
        except Exception as e:
            err_str = str(e)
            if "DataForSEO API error" in err_str and err_str not in api_errors:
                api_errors.append(err_str)
            logger.exception("Metrics refresh failed for business=%s", business.domain)

    total_checked = counts["checked"]
    failures = counts["failed"]

    logger.info("Rank tracking complete: %d keywords checked", total_checked)
    result = {
        "keywords_checked": total_checked,
        "keywords_failed": failures,
        "total": total,
    }
    if api_errors:
        # Returned via Celery's result backend → polling endpoint shows it.
        result["api_errors"] = api_errors
        result["status"] = "error"
    return result


def _store_competitor_positions(business, keyword, task_result, serp_service, today):
    """Extract competitor positions from full SERP data and store in CompetitorKeywordOverlap."""
    from apps.competitors.models import Competitor, CompetitorKeywordOverlap
    from urllib.parse import urlparse

    competitors = Competitor.objects.filter(business=business)
    if not competitors.exists():
        return

    # Build lookup: clean_domain -> competitor
    comp_lookup = {}
    for comp in competitors:
        parsed = urlparse(comp.domain if "://" in comp.domain else f"https://{comp.domain}")
        clean = (parsed.hostname or comp.domain).lower().replace("www.", "").rstrip("/")
        comp_lookup[clean] = comp

    # Extract ALL domain positions from the SERP result
    all_positions = serp_service.extract_all_positions(task_result)

    for clean_domain, comp in comp_lookup.items():
        rank = all_positions.get(clean_domain)
        CompetitorKeywordOverlap.objects.update_or_create(
            business=business,
            competitor=comp,
            date=today,
            keyword_text=keyword.keyword_text,
            defaults={
                "search_volume": keyword.search_volume,
                "client_rank": keyword.current_organic_rank,
                "competitor_rank": rank,
            },
        )


def _check_keyword_rankings(keyword, business, today, serp_service, maps_service, screenshot_service=None, local_finder_service=None):
    """Check organic (and optionally Maps/Local Finder) rankings for a single keyword."""
    from apps.rankings.models import LocalFinderResult, MapsRankResult, SERPResult

    location_code = keyword.effective_location_code
    language_code = keyword.effective_language_code

    # Organic SERP check
    if business.track_organic:
        task_result = serp_service.check_organic(
            keyword=keyword.keyword_text,
            location_code=location_code,
            language_code=language_code,
        )

        if not task_result:
            logger.warning(
                "Empty SERP result for keyword=%s business=%s",
                keyword.keyword_text,
                business.domain,
            )
            task_result = {}

        position = serp_service.find_domain_position(task_result, business.domain)

        # Get previous result for change tracking
        previous = (
            SERPResult.objects.filter(keyword=keyword, device="desktop")
            .exclude(checked_at=today)
            .order_by("-checked_at")
            .first()
        )

        rank_change = None
        url_changed = False
        previous_rank = None
        previous_url = ""
        if previous and previous.rank_absolute and position["rank_absolute"]:
            previous_rank = previous.rank_absolute
            rank_change = previous_rank - position["rank_absolute"]  # positive = improved
            url_changed = previous.url != position["url"]
            previous_url = previous.url
        elif previous and previous.rank_absolute and not position["rank_absolute"]:
            previous_rank = previous.rank_absolute
        elif previous and not previous.rank_absolute and position["rank_absolute"]:
            pass

        serp_result, _ = SERPResult.objects.update_or_create(
            keyword=keyword,
            checked_at=today,
            device="desktop",
            defaults={
                "business": business,
                "rank_absolute": position["rank_absolute"],
                "rank_group": position["rank_group"],
                "serp_page": position["serp_page"],
                "is_found": position["is_found"],
                "url": position["url"],
                "title": position["title"],
                "description": position["description"],
                "breadcrumb": position["breadcrumb"],
                "cache_url": position["cache_url"],
                "rank_change": rank_change,
                "previous_rank": previous_rank,
                "url_changed": url_changed,
                "previous_url": previous_url,
                "featured_snippet_present": position["featured_snippet_present"],
                "local_pack_present": position["local_pack_present"],
                "knowledge_panel_present": position["knowledge_panel_present"],
                "people_also_ask_present": position["people_also_ask_present"],
                "video_results_present": position["video_results_present"],
                "images_present": position["images_present"],
                "shopping_present": position["shopping_present"],
                "ai_overview_present": position["ai_overview_present"],
                "total_results_count": position["total_results_count"],
                "top_competitors": position["top_competitors"],
                "serp_url": position.get("check_url", ""),
                "dataforseo_task_id": task_result.get("id", ""),
                "dataforseo_cost": task_result.get("cost"),
                "raw_response": task_result,
            },
        )

        # Capture SERP screenshot(s) — multi-page when rank requires it
        if screenshot_service and task_result.get("id"):
            try:
                rank = position["rank_absolute"]
                if rank:
                    screenshots = screenshot_service.capture_serp_pages(
                        task_id=task_result["id"],
                        rank_position=rank,
                        keyword=keyword.keyword_text,
                        location_code=location_code,
                        language_code=language_code,
                        device="desktop",
                    )
                else:
                    page1 = screenshot_service.capture_serp_screenshot(task_result["id"])
                    screenshots = [{"page": 1, "url": page1}] if page1 else []

                if screenshots:
                    from apps.rankings.storage import persist_screenshot
                    persisted = [{"page": s["page"], "url": persist_screenshot(s["url"], "serp")} for s in screenshots]
                    serp_result.screenshot_url = persisted[0]["url"]
                    serp_result.screenshot_urls = persisted
                    serp_result.save(update_fields=["screenshot_url", "screenshot_urls"])
            except Exception:
                logger.warning("Failed to capture SERP screenshots for keyword=%s", keyword.keyword_text)

        # Update denormalized fields on Keyword.
        # previous_rank comes from the SERPResult lookup (most recent scan
        # before today) — same source as rank_change — so the two stay
        # consistent even on same-day re-scans.
        # System-level data-integrity check — warn loudly if the scan looks
        # suspicious so we catch bad data BEFORE it shows up in the dashboard.
        new_rank = position["rank_absolute"]
        if new_rank and previous_rank and abs(new_rank - previous_rank) > 25:
            logger.warning(
                "Rank jump >25 positions for kw=%s business=%s (%s → %s) — verify location_code=%s is correct",
                keyword.keyword_text, business.domain, previous_rank, new_rank, location_code,
            )
        if new_rank and not position.get("rank_group"):
            logger.warning(
                "Got rank_absolute=%s but no rank_group for kw=%s — UI will fall back to absolute",
                new_rank, keyword.keyword_text,
            )

        keyword.previous_organic_rank = previous_rank
        keyword.current_organic_rank = position["rank_absolute"]
        keyword.current_organic_rank_group = position.get("rank_group")
        keyword.current_organic_url = position["url"]
        keyword.rank_change = rank_change
        keyword.last_checked_at = today
        keyword.save(update_fields=[
            "previous_organic_rank", "current_organic_rank", "current_organic_rank_group",
            "current_organic_url", "rank_change", "last_checked_at",
            "updated_at",
        ])

        # Extract and store competitor positions from the same SERP data
        _store_competitor_positions(
            business=business,
            keyword=keyword,
            task_result=task_result,
            serp_service=serp_service,
            today=today,
        )

    # Mobile organic SERP check
    if business.track_organic and business.track_mobile:
        mobile_task_result = serp_service.check_organic(
            keyword=keyword.keyword_text,
            location_code=location_code,
            language_code=language_code,
            device="mobile",
        )

        if not mobile_task_result:
            logger.warning(
                "Empty mobile SERP result for keyword=%s business=%s",
                keyword.keyword_text,
                business.domain,
            )
            mobile_task_result = {}

        mobile_position = serp_service.find_domain_position(mobile_task_result, business.domain)

        # Get previous mobile result for change tracking
        mobile_previous = (
            SERPResult.objects.filter(keyword=keyword, device="mobile")
            .exclude(checked_at=today)
            .order_by("-checked_at")
            .first()
        )

        mobile_rank_change = None
        mobile_url_changed = False
        mobile_previous_rank = None
        mobile_previous_url = ""
        if mobile_previous and mobile_previous.rank_absolute and mobile_position["rank_absolute"]:
            mobile_previous_rank = mobile_previous.rank_absolute
            mobile_rank_change = mobile_previous_rank - mobile_position["rank_absolute"]
            mobile_url_changed = mobile_previous.url != mobile_position["url"]
            mobile_previous_url = mobile_previous.url
        elif mobile_previous and mobile_previous.rank_absolute and not mobile_position["rank_absolute"]:
            mobile_previous_rank = mobile_previous.rank_absolute
        elif mobile_previous and not mobile_previous.rank_absolute and mobile_position["rank_absolute"]:
            pass

        mobile_serp_result, _ = SERPResult.objects.update_or_create(
            keyword=keyword,
            checked_at=today,
            device="mobile",
            defaults={
                "business": business,
                "rank_absolute": mobile_position["rank_absolute"],
                "rank_group": mobile_position["rank_group"],
                "serp_page": mobile_position["serp_page"],
                "is_found": mobile_position["is_found"],
                "url": mobile_position["url"],
                "title": mobile_position["title"],
                "description": mobile_position["description"],
                "breadcrumb": mobile_position["breadcrumb"],
                "cache_url": mobile_position["cache_url"],
                "rank_change": mobile_rank_change,
                "previous_rank": mobile_previous_rank,
                "url_changed": mobile_url_changed,
                "previous_url": mobile_previous_url,
                "featured_snippet_present": mobile_position["featured_snippet_present"],
                "local_pack_present": mobile_position["local_pack_present"],
                "knowledge_panel_present": mobile_position["knowledge_panel_present"],
                "people_also_ask_present": mobile_position["people_also_ask_present"],
                "video_results_present": mobile_position["video_results_present"],
                "images_present": mobile_position["images_present"],
                "shopping_present": mobile_position["shopping_present"],
                "ai_overview_present": mobile_position["ai_overview_present"],
                "total_results_count": mobile_position["total_results_count"],
                "top_competitors": mobile_position["top_competitors"],
                "serp_url": mobile_position.get("check_url", ""),
                "dataforseo_task_id": mobile_task_result.get("id", ""),
                "dataforseo_cost": mobile_task_result.get("cost"),
                "raw_response": mobile_task_result,
            },
        )

        # Capture mobile SERP screenshot(s)
        if screenshot_service and mobile_task_result.get("id"):
            try:
                rank = mobile_position["rank_absolute"]
                if rank:
                    screenshots = screenshot_service.capture_serp_pages(
                        task_id=mobile_task_result["id"],
                        rank_position=rank,
                        keyword=keyword.keyword_text,
                        location_code=location_code,
                        language_code=language_code,
                        device="mobile",
                    )
                else:
                    page1 = screenshot_service.capture_serp_screenshot(mobile_task_result["id"])
                    screenshots = [{"page": 1, "url": page1}] if page1 else []

                if screenshots:
                    from apps.rankings.storage import persist_screenshot
                    persisted = [{"page": s["page"], "url": persist_screenshot(s["url"], "serp-mobile")} for s in screenshots]
                    mobile_serp_result.screenshot_url = persisted[0]["url"]
                    mobile_serp_result.screenshot_urls = persisted
                    mobile_serp_result.save(update_fields=["screenshot_url", "screenshot_urls"])
            except Exception:
                logger.warning("Failed to capture mobile SERP screenshots for keyword=%s", keyword.keyword_text)

        # Update denormalized mobile fields on Keyword.
        # See desktop branch above — previous_rank from SERPResult lookup keeps
        # previous_mobile_rank and mobile_rank_change in sync.
        keyword.previous_mobile_rank = mobile_previous_rank
        keyword.current_mobile_rank = mobile_position["rank_absolute"]
        keyword.current_mobile_rank_group = mobile_position.get("rank_group")
        keyword.current_mobile_url = mobile_position["url"]
        keyword.mobile_rank_change = mobile_rank_change
        keyword.save(update_fields=[
            "previous_mobile_rank", "current_mobile_rank", "current_mobile_rank_group",
            "current_mobile_url", "mobile_rank_change",
            "updated_at",
        ])

    # Maps check
    if business.track_maps and keyword.maps_enabled:
        task_result = maps_service.check_maps(
            keyword=keyword.keyword_text,
            location_code=location_code,
            language_code=language_code,
        )

        if not task_result:
            logger.warning(
                "Empty Maps result for keyword=%s business=%s",
                keyword.keyword_text,
                business.domain,
            )
            task_result = {}

        position = maps_service.find_business_position(
            task_result,
            domain=business.domain,
            place_id=business.google_place_id,
            business_name=business.google_business_name,
        )

        previous = (
            MapsRankResult.objects.filter(keyword=keyword)
            .exclude(checked_at=today)
            .order_by("-checked_at")
            .first()
        )

        maps_rank_change = None
        maps_previous_rank = None
        rating_change = None
        review_count_change = None

        if previous:
            maps_previous_rank = previous.rank_group
            if previous.rank_group and position["rank_group"]:
                maps_rank_change = previous.rank_group - position["rank_group"]
            if previous.rating_value and position["rating_value"]:
                rating_change = position["rating_value"] - previous.rating_value
            if previous.rating_count and position["rating_count"]:
                review_count_change = position["rating_count"] - previous.rating_count

        maps_result, _ = MapsRankResult.objects.update_or_create(
            keyword=keyword,
            checked_at=today,
            defaults={
                "business": business,
                "rank_group": position["rank_group"],
                "rank_absolute": position["rank_absolute"],
                "is_found": position["is_found"],
                "title": position["title"],
                "domain": position["domain"],
                "url": position["url"],
                "phone": position["phone"],
                "address": position["address"],
                "latitude": position["latitude"],
                "longitude": position["longitude"],
                "place_id": position["place_id"],
                "cid": position["cid"],
                "feature_id": position["feature_id"],
                "rating_value": position["rating_value"],
                "rating_count": position["rating_count"],
                "rating_change": rating_change,
                "review_count_change": review_count_change,
                "category": position["category"],
                "work_hours": position["work_hours"],
                "is_claimed": position["is_claimed"],
                "rank_change": maps_rank_change,
                "previous_rank": maps_previous_rank,
                "serp_url": position.get("check_url", ""),
                "top_competitors": position["top_competitors"],
                "dataforseo_task_id": task_result.get("id", ""),
                "dataforseo_cost": task_result.get("cost"),
                "raw_response": task_result,
            },
        )

        # Capture Maps screenshot
        if screenshot_service and position.get("check_url"):
            try:
                maps_screenshot = screenshot_service.capture_maps_screenshot(
                    position["check_url"],
                )
                if maps_screenshot:
                    from apps.rankings.storage import persist_screenshot
                    maps_result.screenshot_url = persist_screenshot(maps_screenshot, "maps")
                    maps_result.save(update_fields=["screenshot_url"])
            except Exception:
                logger.warning(
                    "Failed to capture Maps screenshot for keyword=%s",
                    keyword.keyword_text,
                )

        # See desktop branch — previous_rank from MapsRankResult lookup so
        # previous_maps_rank stays consistent across same-day re-scans.
        keyword.previous_maps_rank = maps_previous_rank
        keyword.current_maps_rank = position["rank_group"]
        keyword.save(update_fields=[
            "previous_maps_rank", "current_maps_rank", "updated_at",
        ])

    # Local Finder check
    if business.track_maps and keyword.maps_enabled and local_finder_service:
        task_result = local_finder_service.check_local_finder(
            keyword=keyword.keyword_text,
            location_code=location_code,
            language_code=language_code,
        )

        if not task_result:
            logger.warning(
                "Empty Local Finder result for keyword=%s business=%s",
                keyword.keyword_text,
                business.domain,
            )
            task_result = {}

        position = local_finder_service.find_business_position(
            task_result,
            domain=business.domain,
            place_id=business.google_place_id,
            business_name=business.google_business_name,
        )

        previous = (
            LocalFinderResult.objects.filter(keyword=keyword)
            .exclude(checked_at=today)
            .order_by("-checked_at")
            .first()
        )

        finder_rank_change = None
        finder_previous_rank = None

        if previous:
            finder_previous_rank = previous.rank
            if previous.rank and position["rank"]:
                finder_rank_change = previous.rank - position["rank"]

        finder_result, _ = LocalFinderResult.objects.update_or_create(
            keyword=keyword,
            checked_at=today,
            defaults={
                "business": business,
                "rank": position["rank"],
                "is_found": position["is_found"],
                "title": position["title"],
                "domain": position["domain"],
                "url": position["url"],
                "phone": position["phone"],
                "address": position["address"],
                "place_id": position["place_id"],
                "cid": position["cid"],
                "rating_value": position["rating_value"],
                "rating_count": position["rating_count"],
                "category": position["category"],
                "serp_url": position.get("check_url", ""),
                "rank_change": finder_rank_change,
                "previous_rank": finder_previous_rank,
                "dataforseo_task_id": task_result.get("id", ""),
                "dataforseo_cost": task_result.get("cost"),
                "raw_response": task_result,
            },
        )

        # Capture Local Finder screenshot
        if screenshot_service and position.get("check_url"):
            try:
                finder_screenshot = screenshot_service.capture_maps_screenshot(
                    position["check_url"],
                )
                if finder_screenshot:
                    finder_result.screenshot_url = finder_screenshot
                    finder_result.save(update_fields=["screenshot_url"])
            except Exception:
                logger.warning(
                    "Failed to capture Local Finder screenshot for keyword=%s",
                    keyword.keyword_text,
                )
