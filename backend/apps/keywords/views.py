import logging
from collections import defaultdict

from django.db.models import Avg, Count, Q, Sum
from django.utils import timezone

logger = logging.getLogger(__name__)
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Keyword, KeywordStatus
from .serializers import BulkStatusSerializer, KeywordSerializer


class KeywordViewSet(viewsets.ModelViewSet):
    serializer_class = KeywordSerializer
    search_fields = ["keyword_text", "group_name"]
    filterset_fields = ["status", "is_branded", "is_primary", "maps_enabled", "intent"]
    ordering_fields = [
        "keyword_text", "search_volume", "current_organic_rank",
        "current_maps_rank", "rank_change", "created_at",
    ]

    def get_queryset(self):
        return Keyword.objects.filter(
            project__slug=self.kwargs["project_slug"]
        ).prefetch_related("tags")

    def perform_create(self, serializer):
        from clients.models import Project
        from .services import refresh_keyword_metrics
        project = Project.objects.get(slug=self.kwargs["project_slug"])
        keyword = serializer.save(project=project)
        # Auto-fetch volume/KD via the shared Labs+Ads fallback chain.
        if keyword.search_volume is None:
            try:
                refresh_keyword_metrics([keyword], project)
            except Exception:
                logger.exception("perform_create metrics backfill failed for kw=%s", keyword.keyword_text)

    @action(detail=False, methods=["post"], url_path="bulk-status")
    def bulk_status(self, request, project_slug=None):
        serializer = BulkStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        keyword_ids = serializer.validated_data["keyword_ids"]
        new_status = serializer.validated_data["status"]

        update_fields = {"status": new_status, "updated_at": timezone.now()}
        if new_status == KeywordStatus.TRACKED:
            update_fields["promoted_at"] = timezone.now()

        updated = Keyword.objects.filter(
            project__slug=project_slug,
            id__in=keyword_ids,
        ).update(**update_fields)

        return Response({"updated": updated})

    @action(detail=False, methods=["post"], url_path="refresh-metrics")
    def refresh_metrics(self, request, project_slug=None):
        """Backfill search_volume / CPC / competition / KD via the shared service.

        Targets keywords missing ``search_volume`` by default. Pass
        ``{"keyword_ids": [...]}`` to limit to a specific set, or
        ``{"all": true}`` to refresh every keyword (overwrites existing values).
        """
        from clients.models import Project
        from .services import refresh_keyword_metrics

        try:
            project = Project.objects.get(slug=project_slug)
        except Project.DoesNotExist:
            return Response({"detail": "project not found"}, status=status.HTTP_404_NOT_FOUND)

        keyword_ids = request.data.get("keyword_ids") or []
        do_all = bool(request.data.get("all"))

        qs = Keyword.objects.filter(project=project)
        if keyword_ids:
            qs = qs.filter(id__in=keyword_ids)
        elif not do_all:
            qs = qs.filter(search_volume__isnull=True)

        kws = list(qs)
        if not kws:
            return Response({
                "updated": 0, "checked": 0, "no_data": 0,
                "message": "No keywords needed refresh.",
            })

        result = refresh_keyword_metrics(kws, project)
        return Response({
            "updated": result.updated,
            "checked": result.checked,
            "labs_hits": result.labs_hits,
            "ads_hits": result.ads_hits,
            "no_data": result.no_data,
            "message": result.message,
        })

    @action(detail=False, methods=["post"], url_path="bulk-location")
    def bulk_location(self, request, project_slug=None):
        """Set the targeting location_code on multiple keywords at once."""
        keyword_ids = request.data.get("keyword_ids") or []
        location_code = request.data.get("location_code")
        if not isinstance(keyword_ids, list) or not keyword_ids:
            return Response({"detail": "keyword_ids required"}, status=status.HTTP_400_BAD_REQUEST)
        if location_code is None:
            return Response({"detail": "location_code required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            location_code = int(location_code)
        except (TypeError, ValueError):
            return Response({"detail": "location_code must be an integer"}, status=status.HTTP_400_BAD_REQUEST)

        updated = Keyword.objects.filter(
            project__slug=project_slug,
            id__in=keyword_ids,
        ).update(location_code=location_code, updated_at=timezone.now())

        return Response({"updated": updated, "location_code": location_code})


class PagesView(APIView):
    """URL-centric view: group tracked keywords by their ranking URL.
    Includes traffic estimates and plan references."""

    def get(self, request, project_slug):
        keywords = Keyword.objects.filter(
            project__slug=project_slug,
            status=KeywordStatus.TRACKED,
            current_organic_url__gt="",
        ).order_by("current_organic_url")

        # Group by URL
        url_map = defaultdict(list)
        for kw in keywords:
            url_map[kw.current_organic_url].append(kw)

        pages = []
        for url, kws in sorted(url_map.items(), key=lambda x: -len(x[1])):
            ranks = [kw.current_organic_rank for kw in kws if kw.current_organic_rank is not None]
            volumes = [kw.search_volume for kw in kws if kw.search_volume is not None]
            changes = [kw.rank_change for kw in kws if kw.rank_change is not None]
            traffics = [kw.estimated_traffic for kw in kws if kw.estimated_traffic is not None]

            pages.append({
                "url": url,
                "total_keywords": len(kws),
                "avg_position": round(sum(ranks) / len(ranks), 1) if ranks else None,
                "best_position": min(ranks) if ranks else None,
                "total_volume": sum(volumes) if volumes else 0,
                "total_traffic": round(sum(traffics), 1) if traffics else None,
                "keywords_improved": sum(1 for c in changes if c > 0),
                "keywords_declined": sum(1 for c in changes if c < 0),
                "keywords": [
                    {
                        "keyword_id": kw.id,
                        "keyword_text": kw.keyword_text,
                        "rank": kw.current_organic_rank,
                        "rank_change": kw.rank_change,
                        "search_volume": kw.search_volume,
                        "maps_rank": kw.current_maps_rank,
                        "estimated_traffic": kw.estimated_traffic,
                    }
                    for kw in sorted(kws, key=lambda k: k.current_organic_rank or 999)
                ],
            })

        # Compute totals
        all_traffic = sum(p["total_traffic"] or 0 for p in pages)

        return Response({
            "pages": pages,
            "total_pages": len(pages),
            "total_traffic": round(all_traffic, 1),
        })


