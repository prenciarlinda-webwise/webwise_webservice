import logging

from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from accounts.permissions import IsSupervisor

from clients.models import Business
from apps.keywords.models import Keyword, KeywordStatus
from apps.keywords.services import refresh_keyword_metrics

from .models import DiscoveryResult, DiscoveryRun
from .serializers import (
    DiscoveryResultSerializer,
    DiscoveryRunSerializer,
    PromoteKeywordsSerializer,
)

logger = logging.getLogger(__name__)


class DiscoveryRunListView(generics.ListAPIView):
    permission_classes = [IsSupervisor]
    serializer_class = DiscoveryRunSerializer

    def get_queryset(self):
        return DiscoveryRun.objects.filter(business__slug=self.kwargs["business_slug"])


class DiscoveryResultListView(generics.ListAPIView):
    permission_classes = [IsSupervisor]
    serializer_class = DiscoveryResultSerializer
    filterset_fields = ["is_new", "is_interesting", "is_promoted", "source"]
    search_fields = ["keyword_text"]
    ordering_fields = ["search_volume", "rank_absolute", "keyword_difficulty"]

    def get_queryset(self):
        return DiscoveryResult.objects.filter(
            run_id=self.kwargs["run_pk"],
            business__slug=self.kwargs["business_slug"],
        )


class PromoteKeywordsView(APIView):
    permission_classes = [IsSupervisor]
    def post(self, request, business_slug):
        serializer = PromoteKeywordsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        project = Business.objects.get(slug=business_slug)
        keyword_texts = serializer.validated_data["keyword_texts"]
        location_code = serializer.validated_data["location_code"]
        now = timezone.now()
        today = now.date()
        created = 0

        # Get the latest discovery results for these keywords
        latest_run = (
            DiscoveryRun.objects.filter(business=project, status="completed")
            .order_by("-run_date")
            .first()
        )

        for text in keyword_texts:
            discovery_result = None
            if latest_run:
                discovery_result = (
                    DiscoveryResult.objects.filter(run=latest_run, keyword_text=text)
                    .first()
                )

            defaults = {
                "status": KeywordStatus.TRACKED,
                "promoted_at": now,
                "first_discovered_at": today,
            }
            if discovery_result:
                defaults.update({
                    "search_volume": discovery_result.search_volume,
                    "competition": discovery_result.competition,
                    "competition_level": discovery_result.competition_level or "",
                    "cpc": discovery_result.cpc,
                    "keyword_difficulty": discovery_result.keyword_difficulty,
                    "discovery_rank": discovery_result.rank_absolute,
                    # Carry discovery rank into current rank so Dashboard/Tracker show it
                    "current_organic_rank": discovery_result.rank_absolute,
                    "current_organic_url": discovery_result.url or "",
                })

            # Unique key includes location_code so the same word can be tracked at
            # multiple cities without colliding. Using the explicit location_code
            # also avoids the NULL-vs-NULL uniqueness gotcha from earlier.
            keyword, was_created = Keyword.objects.get_or_create(
                business=project,
                keyword_text=text,
                location_code=location_code,
                defaults=defaults,
            )

            if not was_created and keyword.status != KeywordStatus.TRACKED:
                keyword.status = KeywordStatus.TRACKED
                keyword.promoted_at = now
                # Also update rank from discovery if keyword had no rank
                update_fields = ["status", "promoted_at", "updated_at"]
                if keyword.current_organic_rank is None and discovery_result and discovery_result.rank_absolute:
                    keyword.current_organic_rank = discovery_result.rank_absolute
                    keyword.current_organic_url = discovery_result.url or ""
                    update_fields += ["current_organic_rank", "current_organic_url"]
                keyword.save(update_fields=update_fields)

            if was_created:
                created += 1

            # Mark discovery result as promoted
            if discovery_result:
                discovery_result.is_promoted = True
                discovery_result.save(update_fields=["is_promoted"])

        # Auto-fill any volume/KD/CPC the newly tracked keywords are missing.
        # Discovery snapshots cover the obvious metrics, but Labs+Ads often
        # have richer data than the per-domain Labs ranked-keyword call returns.
        try:
            missing = Keyword.objects.filter(
                business=project,
                keyword_text__in=keyword_texts,
                location_code=location_code,
                search_volume__isnull=True,
            )
            if missing.exists():
                refresh_keyword_metrics(list(missing), project)
        except Exception:
            logger.exception("Promotion metrics backfill failed for business=%s", project.domain)

        return Response({"created": created, "total": len(keyword_texts)}, status=status.HTTP_200_OK)
