"""Shared keyword-metrics logic.

One place that knows how to fetch volume / CPC / competition / KD for a list
of keywords, with a Labs → Google Ads fallback chain. Used by:
  - the refresh-metrics API action (manual button on the Rank Tracker)
  - the weekly_scan management command (auto-fills after every scan)
  - the weekly_rank_tracking Celery task (auto-fills nightly run)
  - the discovery PromoteKeywordsView (newly tracked keywords)
  - the KeywordViewSet.perform_create hook (manually added keyword)

Calling everything through one entry point means a hyper-local term that has
no Labs data still gets a Google Ads attempt, regardless of how it entered
the system.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass

from django.conf import settings

from .models import Keyword

logger = logging.getLogger(__name__)


@dataclass
class RefreshResult:
    checked: int
    updated: int
    labs_hits: int
    ads_hits: int
    no_data: int
    api_errors: list = None  # populated when DataForSEO returns 40x/50x

    def __post_init__(self):
        if self.api_errors is None:
            self.api_errors = []

    @property
    def message(self) -> str:
        # API-level failures take priority — these mean the user needs to fix
        # something (balance, credentials, quota) before any refresh works.
        if self.api_errors:
            return "DataForSEO call failed: " + " · ".join(self.api_errors)
        msg = (
            f"Updated {self.updated} of {self.checked} keywords"
            f" (Labs {self.labs_hits}, Google Ads {self.ads_hits})."
        )
        if self.no_data:
            msg += (
                f" {self.no_data} have no volume data in either source"
                " — typical for hyper-local long-tail terms."
            )
        return msg


def _location_for_labs(project) -> int:
    """Labs/Ads need a country code; city codes (>=100000) fall back to US."""
    return project.location_code if project.location_code < 100000 else 2840


def refresh_keyword_metrics(keywords: list[Keyword], project) -> RefreshResult:
    """Backfill metrics for ``keywords``. Modifies them in place + saves.

    Order of attempts per keyword:
      1. DataForSEO Labs ``keyword_overview`` — gives volume + CPC + competition + KD
      2. DataForSEO ``google_ads/search_volume`` — gives volume + CPC for any
         keyword that's been bid on (often catches long-tail terms Labs misses)

    KD is Labs-only (Google Ads doesn't expose it). Competition from Google Ads
    is a string ('LOW'/'MEDIUM'/'HIGH'), so we skip it (model expects float).
    """
    from services.dataforseo import DataForSEOClient, LabsService

    if not keywords:
        return RefreshResult(0, 0, 0, 0, 0)

    api = DataForSEOClient(settings.DATAFORSEO_LOGIN, settings.DATAFORSEO_PASSWORD)
    labs = LabsService(api)
    loc = _location_for_labs(project)
    lang = project.language_code

    updated = labs_hits = ads_hits = 0
    api_errors: list[str] = []

    # Chunk to keep request payloads sane (Labs accepts ~700; Ads similar).
    for chunk_start in range(0, len(keywords), 100):
        chunk = keywords[chunk_start:chunk_start + 100]
        texts = [kw.keyword_text for kw in chunk]

        # Pass 1 — Labs
        labs_by_text: dict[str, dict] = {}
        try:
            res = labs.get_keyword_overview(keywords=texts, location_code=loc, language_code=lang)
            labs_by_text = {item.get("keyword", "").lower(): item for item in res.get("items", [])}
        except Exception as e:
            err = f"Labs: {e}"
            logger.warning("metrics: %s", err)
            if str(e) not in (a.replace("Labs: ", "").replace("Google Ads: ", "") for a in api_errors):
                api_errors.append(err)

        # Pass 2 — Google Ads, only for keywords Labs gave no volume for
        uncovered = [
            kw.keyword_text for kw in chunk
            if not (labs_by_text.get(kw.keyword_text.lower(), {}).get("keyword_info") or {}).get("search_volume")
        ]
        ads_by_text: dict[str, dict] = {}
        if uncovered:
            try:
                res = labs.get_google_ads_search_volume(
                    keywords=uncovered, location_code=loc, language_code=lang,
                )
                ads_by_text = {item.get("keyword", "").lower(): item for item in res.get("items", [])}
            except Exception as e:
                err = f"Google Ads: {e}"
                logger.warning("metrics: %s", err)
                if str(e) not in (a.replace("Labs: ", "").replace("Google Ads: ", "") for a in api_errors):
                    api_errors.append(err)

        for kw in chunk:
            key = kw.keyword_text.lower()
            fields: list[str] = []

            labs_item = labs_by_text.get(key) or {}
            ki = labs_item.get("keyword_info") or {}
            kp = labs_item.get("keyword_properties") or {}

            if ki.get("search_volume") is not None:
                kw.search_volume = ki["search_volume"]
                fields.append("search_volume")
                labs_hits += 1
            if ki.get("cpc") is not None:
                kw.cpc = ki["cpc"]; fields.append("cpc")
            if ki.get("competition") is not None:
                kw.competition = ki["competition"]; fields.append("competition")
            if kp.get("keyword_difficulty") is not None:
                kw.keyword_difficulty = kp["keyword_difficulty"]
                fields.append("keyword_difficulty")

            # Google Ads fallback — only if Labs didn't fill volume
            if "search_volume" not in fields:
                ads_item = ads_by_text.get(key) or {}
                if ads_item.get("search_volume") is not None:
                    kw.search_volume = ads_item["search_volume"]
                    fields.append("search_volume")
                    ads_hits += 1
                if "cpc" not in fields and ads_item.get("cpc") is not None:
                    kw.cpc = ads_item["cpc"]; fields.append("cpc")

            if fields:
                kw.save(update_fields=fields + ["updated_at"])
                updated += 1

    return RefreshResult(
        checked=len(keywords),
        updated=updated,
        labs_hits=labs_hits,
        ads_hits=ads_hits,
        no_data=len(keywords) - updated,
        api_errors=api_errors,
    )


def refresh_missing_for_client(project) -> RefreshResult:
    """Convenience: refresh every keyword for ``project`` that has no volume yet."""
    qs = Keyword.objects.filter(business=project, search_volume__isnull=True)
    return refresh_keyword_metrics(list(qs), project)
