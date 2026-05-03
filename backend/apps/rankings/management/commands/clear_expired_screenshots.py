"""Blank out screenshot URLs that point at DataforSEO's CDN.

These URLs expire after 30-60 days and 404 in the browser. They were
stored either by old code (before persist_screenshot existed) or as a
fallback when persist_screenshot failed (the old code returned the
remote URL on failure — fixed). Re-fetching them is impossible since
the CDN purged them. The cleanest move is to clear them so the UI
hides the screenshot column for those rows.
"""
from django.core.management.base import BaseCommand

from apps.rankings.models import LocalFinderResult, MapsRankResult, SERPResult


CDN_NEEDLE = "api.dataforseo.com/cdn/"


class Command(BaseCommand):
    help = "Clear DataforSEO CDN screenshot URLs from SERP/Maps/LocalFinder rows."

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true", help="Report counts without writing.")

    def handle(self, *args, **opts):
        dry = opts["dry_run"]

        # SERPResult — has both screenshot_url AND screenshot_urls (JSON list).
        serp_qs = SERPResult.objects.filter(screenshot_url__contains=CDN_NEEDLE)
        serp_single = serp_qs.count()

        # JSON-list field — can't filter via __contains on dict items, so iterate.
        serp_multi_qs = SERPResult.objects.exclude(screenshot_urls=[]).exclude(screenshot_urls__isnull=True)
        serp_multi_to_fix = []
        for r in serp_multi_qs:
            cleaned = [s for s in (r.screenshot_urls or []) if isinstance(s, dict) and CDN_NEEDLE not in (s.get("url") or "")]
            if cleaned != (r.screenshot_urls or []):
                serp_multi_to_fix.append((r.id, cleaned))

        maps_qs = MapsRankResult.objects.filter(screenshot_url__contains=CDN_NEEDLE)
        maps_count = maps_qs.count()
        finder_qs = LocalFinderResult.objects.filter(screenshot_url__contains=CDN_NEEDLE)
        finder_count = finder_qs.count()

        total = serp_single + len(serp_multi_to_fix) + maps_count + finder_count
        self.stdout.write(self.style.WARNING(
            f"Found {total} rows with expired CDN screenshot URLs:"
            f"\n  SERPResult.screenshot_url:    {serp_single}"
            f"\n  SERPResult.screenshot_urls:   {len(serp_multi_to_fix)}"
            f"\n  MapsRankResult.screenshot_url: {maps_count}"
            f"\n  LocalFinderResult.screenshot_url: {finder_count}"
        ))

        if dry:
            self.stdout.write(self.style.NOTICE("(dry-run — no changes written)"))
            return

        serp_qs.update(screenshot_url="")
        for row_id, cleaned in serp_multi_to_fix:
            SERPResult.objects.filter(id=row_id).update(screenshot_urls=cleaned)
        maps_qs.update(screenshot_url="")
        finder_qs.update(screenshot_url="")

        self.stdout.write(self.style.SUCCESS(f"Cleared {total} expired screenshot URLs."))
