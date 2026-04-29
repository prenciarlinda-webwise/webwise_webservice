"""
Weekly scan: discovery + rank tracking (desktop, mobile, maps, local finder, competitors)
for all active clients.

Usage:
    python manage.py weekly_scan              # all active clients
    python manage.py weekly_scan --project 7   # single project by ID
    python manage.py weekly_scan --no-screenshots  # skip screenshots (faster)
"""
import logging
from datetime import date

from django.conf import settings
from django.core.management.base import BaseCommand

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Run weekly discovery + rank tracking for all active clients"

    def add_arguments(self, parser):
        parser.add_argument("--project", type=int, help="Run for a specific project ID only")
        parser.add_argument("--no-screenshots", action="store_true", help="Skip screenshot capture (faster)")
        parser.add_argument("--no-discovery", action="store_true", help="Skip keyword discovery")
        parser.add_argument("--no-metrics", action="store_true", help="Skip volume/KD metrics refresh")

    def handle(self, *args, **options):
        from clients.models import Project
        from apps.competitors.models import CompetitorKeywordOverlap
        from apps.discovery.tasks import _discover_keywords_for_client
        from apps.keywords.models import Keyword, KeywordStatus
        from apps.rankings.models import LocalFinderResult, MapsRankResult, SERPResult
        from apps.rankings.tasks import _check_keyword_rankings
        from services.dataforseo import (
            DataForSEOClient,
            LocalFinderService,
            MapsService,
            SERPService,
        )
        from services.dataforseo.screenshots import ScreenshotService

        api_client = DataForSEOClient(
            login=settings.DATAFORSEO_LOGIN,
            password=settings.DATAFORSEO_PASSWORD,
        )
        serp_service = SERPService(api_client)
        maps_service = MapsService(api_client)
        local_finder_service = LocalFinderService(api_client)
        screenshot_service = None if options["no_screenshots"] else ScreenshotService(api_client)

        today = date.today()

        if options["project"]:
            clients = Project.objects.filter(id=options["project"], status='active')
        else:
            clients = Project.objects.filter(status='active')

        if not clients.exists():
            self.stdout.write(self.style.WARNING("No active clients found."))
            return

        from apps.keywords.services import refresh_missing_for_client

        for project in clients:
            self.stdout.write(self.style.HTTP_INFO(
                f"\n{'='*60}\n{project.name} ({project.domain}) — {project.location_name}\n{'='*60}"
            ))

            # ── Discovery ──
            if not options["no_discovery"] and project.discovery_enabled:
                self.stdout.write("  Running keyword discovery...")
                try:
                    result = _discover_keywords_for_client(project)
                    self.stdout.write(self.style.SUCCESS(
                        f"  Discovery: {result.get('total', 0)} keywords, {result.get('new', 0)} new"
                    ))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"  Discovery failed: {e}"))

            # ── Rank tracking ──
            keywords = Keyword.objects.filter(project=project, status=KeywordStatus.TRACKED)
            kw_count = keywords.count()

            if kw_count == 0:
                self.stdout.write(self.style.WARNING("  No tracked keywords — skipping rank tracking."))
                continue

            self.stdout.write(f"  Checking {kw_count} keywords...")
            success = 0
            failed = 0

            for kw in keywords:
                try:
                    _check_keyword_rankings(
                        keyword=kw,
                        project=project,
                        today=today,
                        serp_service=serp_service,
                        maps_service=maps_service,
                        screenshot_service=screenshot_service,
                        local_finder_service=local_finder_service,
                    )
                    success += 1
                    kw.refresh_from_db()
                    d = kw.current_organic_rank or "--"
                    m = kw.current_mobile_rank or "--"
                    mp = kw.current_maps_rank or "--"
                    self.stdout.write(f"    OK  desk={d} mob={m} maps={mp} | {kw.keyword_text}")
                except Exception as e:
                    failed += 1
                    self.stdout.write(self.style.ERROR(f"    FAIL | {kw.keyword_text} | {e}"))

            self.stdout.write(self.style.SUCCESS(
                f"  Done: {success} ok, {failed} failed out of {kw_count}"
            ))

            # ── Metrics refresh (volume / KD / CPC for keywords still missing them) ──
            if not options["no_metrics"]:
                try:
                    res = refresh_missing_for_client(project)
                    if res.checked > 0:
                        self.stdout.write(self.style.SUCCESS(f"  Metrics: {res.message}"))
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f"  Metrics refresh skipped: {e}"))

        self.stdout.write(self.style.SUCCESS(f"\nWeekly scan complete for {clients.count()} project(s)."))
