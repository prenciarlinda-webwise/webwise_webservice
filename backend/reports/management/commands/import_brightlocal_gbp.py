"""Import BrightLocal "GMB insights (Performance Report)" CSV exports.

Reads every CSV under ``src/brighlocal/`` (or a custom path), parses the
month from the filename, matches each row to a Business by name, and
upserts a GBPMetrics record with the absolute counts. Derived fields
(profile_views, total_interactions, the four platform %s, and prior-month
%change) are computed exactly from the absolute counts — no rounding drift.

Usage:
    python manage.py import_brightlocal_gbp                # all CSVs in default dir
    python manage.py import_brightlocal_gbp --dir ./data   # custom dir
    python manage.py import_brightlocal_gbp --dry-run      # parse + match, no writes
"""
from __future__ import annotations

import csv
import datetime as dt
import re
from decimal import Decimal
from pathlib import Path

from django.core.management.base import BaseCommand
from django.db import transaction

from clients.models import Business
from reports.models import GBPMetrics


DEFAULT_DIR = Path(__file__).resolve().parents[4] / 'src' / 'brighlocal'

# BrightLocal "Business name" → our Business slug. Names that don't appear
# here are skipped with a warning (no GBP tracked or not a current client).
NAME_TO_SLUG = {
    '904 Dumpster - Dumpster Rental Jacksonville': '904-dumpster',
    'Paint-Techs LLC - Painting Company': 'paint-techs-llc',
    "Gimo's Roofing": 'gimos-roofing',
    'Northstar Home Improvement': 'northstar-home-improvement',
    'Albros Premium Car Detailing LLC': 'albros-premium-car-detailing-llc',
    'Illyrian Plumber': 'illyrian-plumber',
    'Punime Gipsi - Torra Gips': 'torra-gips',
    # Skipped: AAA Remodels, Zelo Flooring (no GBP in BrightLocal export).
}


# Filename pattern: "GMB insights (Performance Report) - 2026-1-1 - 2026-1-31 - <hash>.csv"
DATE_RE = re.compile(r'(\d{4})-(\d{1,2})-1\s*-\s*(\d{4})-(\d{1,2})-')


def _to_int(s: str) -> int:
    s = (s or '').strip()
    if not s:
        return 0
    try:
        return int(s)
    except ValueError:
        return 0


def parse_month_from_filename(name: str) -> dt.date | None:
    """Extracts the first-of-month date from the file name."""
    m = DATE_RE.search(name)
    if not m:
        return None
    year, month = int(m.group(1)), int(m.group(2))
    try:
        return dt.date(year, month, 1)
    except ValueError:
        return None


def pct_change_exact(current: int, prior: int | None) -> Decimal | None:
    """Exact %change from prior to current. Returns None if prior is missing
    or zero (math undefined). Result rounded to 1 decimal place."""
    if prior is None or prior == 0:
        return None
    return (
        (Decimal(current) - Decimal(prior)) * Decimal(100) / Decimal(prior)
    ).quantize(Decimal('0.1'))


class Command(BaseCommand):
    help = 'Import BrightLocal GMB performance CSVs into GBPMetrics.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dir', default=str(DEFAULT_DIR),
            help=f'Directory of CSV files (default: {DEFAULT_DIR}).',
        )
        parser.add_argument(
            '--dry-run', action='store_true',
            help='Parse and match without writing to the DB.',
        )

    @transaction.atomic
    def handle(self, *args, **opts):
        directory = Path(opts['dir'])
        dry = opts['dry_run']

        if not directory.is_dir():
            self.stderr.write(self.style.ERROR(f'Not a directory: {directory}'))
            return

        csvs = sorted(p for p in directory.glob('*.csv') if 'GMB insights' in p.name)
        if not csvs:
            self.stderr.write(self.style.ERROR(f'No GMB insights CSVs in {directory}.'))
            return

        self.stdout.write(self.style.HTTP_INFO(
            f'Found {len(csvs)} CSV file(s).' + (' [dry-run]' if dry else '')
        ))

        # First pass: parse + upsert in chronological order so prior-month
        # lookups for %change always find data.
        files_with_dates = []
        for path in csvs:
            month = parse_month_from_filename(path.name)
            if not month:
                self.stdout.write(self.style.WARNING(
                    f'  ⚠ Skipping {path.name}: could not parse month.'
                ))
                continue
            files_with_dates.append((month, path))
        files_with_dates.sort()

        total_imported = 0
        total_skipped = 0

        for month, path in files_with_dates:
            self.stdout.write('')
            self.stdout.write(self.style.HTTP_INFO(f'▸ {month:%B %Y} — {path.name}'))

            with path.open(newline='', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                # First data row in BrightLocal export is a "column descriptions"
                # row — detect by checking if the Calls column is non-numeric.
                rows = list(reader)
                if rows and not str(rows[0].get('Calls', '')).strip().isdigit() \
                        and 'Number' in (rows[0].get('Calls') or ''):
                    rows = rows[1:]

                for row in rows:
                    name = (row.get('Business name') or '').strip()
                    if not name:
                        continue
                    slug = NAME_TO_SLUG.get(name)
                    if not slug:
                        self.stdout.write(f'    ↺ skip (not in mapping): {name}')
                        total_skipped += 1
                        continue
                    try:
                        biz = Business.objects.get(slug=slug)
                    except Business.DoesNotExist:
                        self.stdout.write(self.style.WARNING(
                            f'    ⚠ Business slug not found: {slug} (CSV name: {name})'
                        ))
                        total_skipped += 1
                        continue

                    payload = {
                        'gbp_store_code': (row.get('Store code') or '').strip(),
                        'search_mobile_views': _to_int(row.get('Google Search - Mobile')),
                        'search_desktop_views': _to_int(row.get('Google Search - Desktop')),
                        'maps_mobile_views': _to_int(row.get('Google Maps - Mobile')),
                        'maps_desktop_views': _to_int(row.get('Google Maps - Desktop')),
                        'calls': _to_int(row.get('Calls')),
                        'chat_clicks': _to_int(row.get('Messages')),
                        'bookings': _to_int(row.get('Bookings')),
                        'direction_clicks': _to_int(row.get('Directions')),
                        'website_clicks': _to_int(row.get('Website clicks')),
                    }

                    if dry:
                        self.stdout.write(
                            f'    [dry] {biz.name}: views='
                            f'{sum([payload["search_mobile_views"], payload["search_desktop_views"], payload["maps_mobile_views"], payload["maps_desktop_views"]])}, '
                            f'calls={payload["calls"]}, dir={payload["direction_clicks"]}, '
                            f'web={payload["website_clicks"]}'
                        )
                        continue

                    obj, _ = GBPMetrics.objects.get_or_create(
                        business=biz, month=month, defaults=payload,
                    )
                    for k, v in payload.items():
                        setattr(obj, k, v)
                    obj.recompute_derived()

                    # Exact %change vs prior-month record (same business).
                    prior = (
                        GBPMetrics.objects
                        .filter(business=biz, month__lt=month)
                        .order_by('-month')
                        .first()
                    )
                    obj.profile_views_change_pct = pct_change_exact(
                        obj.profile_views,
                        prior.profile_views if prior else None,
                    )
                    obj.interactions_change_pct = pct_change_exact(
                        obj.total_interactions,
                        prior.total_interactions if prior else None,
                    )
                    obj.save()
                    total_imported += 1

                    self.stdout.write(
                        f'    ✓ {biz.name}: '
                        f'views={obj.profile_views} '
                        f'({obj.profile_views_change_pct:+}% vs prior)'
                        if obj.profile_views_change_pct is not None
                        else f'    ✓ {biz.name}: views={obj.profile_views} (no prior)'
                    )

        self.stdout.write('')
        msg = f'{total_imported} record(s) imported, {total_skipped} skipped.'
        if dry:
            self.stdout.write(self.style.NOTICE(f'[dry-run] {msg}'))
            transaction.set_rollback(True)
        else:
            self.stdout.write(self.style.SUCCESS(msg))
