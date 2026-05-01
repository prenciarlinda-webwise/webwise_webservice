"""Show, for every active project, how complete the rank-tracker data is.

For each project lists tracked keyword counts vs. how many are missing:
  - location code (no targeting set → scans use country fallback)
  - search volume (Labs + Google Ads both have nothing)
  - keyword difficulty
  - a recent SERPResult (= scan happened in the last N days)
  - a screenshot on the latest SERPResult

Use it to spot which clients need a "Run Check" or "Refresh metrics".

    python manage.py coverage_report
    python manage.py coverage_report --recent-days 14
    python manage.py coverage_report --project illyrian-plumber
"""

from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from clients.models import Business
from apps.keywords.models import Keyword, KeywordStatus
from apps.rankings.models import SERPResult


class Command(BaseCommand):
    help = "Per-project coverage report for keyword data + screenshots."

    def add_arguments(self, parser):
        parser.add_argument("--recent-days", type=int, default=7,
                            help="Treat scans newer than this as 'recent' (default 7).")
        parser.add_argument("--project", help="Only show this project slug.")

    def handle(self, *args, **options):
        days = options["recent_days"]
        cutoff = timezone.now().date() - timedelta(days=days)

        qs = Business.objects.filter(status='active').order_by("name")
        if options["project"]:
            qs = qs.filter(slug=options["project"])

        if not qs.exists():
            self.stdout.write(self.style.WARNING("No matching active clients."))
            return

        # Header
        cols = ("project", "tracked", "no_loc", "no_vol", "no_kd", "no_recent_scan", "no_screenshot")
        self.stdout.write(self.style.HTTP_INFO(
            f"{cols[0]:<28} {cols[1]:>8} {cols[2]:>7} {cols[3]:>7} {cols[4]:>6} {cols[5]:>16} {cols[6]:>14}"
        ))
        self.stdout.write("-" * 95)

        for project in qs:
            kws = Keyword.objects.filter(business=project, status=KeywordStatus.TRACKED)
            tracked = kws.count()
            if tracked == 0:
                self.stdout.write(f"{project.slug:<28} {0:>8}  (no tracked keywords)")
                continue

            no_loc = kws.filter(location_code__isnull=True).count()
            no_vol = kws.filter(search_volume__isnull=True).count()
            no_kd = kws.filter(keyword_difficulty__isnull=True).count()
            no_recent = kws.filter(last_checked_at__lt=cutoff).count() + kws.filter(last_checked_at__isnull=True).count()

            # Screenshot completeness on most recent desktop SERPResult per keyword
            kw_ids = list(kws.values_list("id", flat=True))
            seen, no_shot = set(), 0
            for r in SERPResult.objects.filter(keyword_id__in=kw_ids, device="desktop").order_by("-checked_at"):
                if r.keyword_id in seen:
                    continue
                seen.add(r.keyword_id)
                if not r.screenshot_url:
                    no_shot += 1
            no_shot += tracked - len(seen)  # keywords that never had a SERPResult

            def _fmt(n, total):
                if n == 0:
                    return self.style.SUCCESS(f"{n:>5}  ")
                pct = round(100 * n / total)
                return f"{n:>5} ({pct:>2}%)"

            line = (
                f"{project.slug:<28} {tracked:>8}  "
                f"{_fmt(no_loc, tracked):>10}  "
                f"{_fmt(no_vol, tracked):>10}  "
                f"{_fmt(no_kd, tracked):>10}  "
                f"{_fmt(no_recent, tracked):>10}  "
                f"{_fmt(no_shot, tracked):>10}"
            )
            self.stdout.write(line)

        self.stdout.write("")
        self.stdout.write(self.style.HTTP_INFO("Legend:"))
        self.stdout.write("  no_loc          → keywords with no targeting location set (scans use country)")
        self.stdout.write("  no_vol / no_kd  → no volume / KD data (Labs + Google Ads both empty)")
        self.stdout.write(f"  no_recent_scan  → no scan in the last {days} day(s)")
        self.stdout.write("  no_screenshot   → most recent scan didn't capture a screenshot")
