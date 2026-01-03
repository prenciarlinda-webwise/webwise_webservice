from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import models

from apps.accounts.permissions import IsAdmin, IsClient
from .models import Keyword, KeywordRanking
from .serializers import (
    KeywordSerializer,
    KeywordListSerializer,
    KeywordCreateSerializer,
    KeywordRankingSerializer,
    BulkRankingSerializer,
    ClientKeywordSerializer,
)


class AdminKeywordViewSet(viewsets.ModelViewSet):
    """Admin viewset for managing keywords."""
    queryset = Keyword.objects.select_related('client').prefetch_related('rankings').all()
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_serializer_class(self):
        if self.action == 'list':
            return KeywordListSerializer
        if self.action == 'create':
            return KeywordCreateSerializer
        return KeywordSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        # Filter by client
        client_id = self.request.query_params.get('client')
        if client_id:
            queryset = queryset.filter(client_id=client_id)
        # Filter by primary only
        is_primary = self.request.query_params.get('is_primary')
        if is_primary is not None:
            queryset = queryset.filter(is_primary=is_primary.lower() == 'true')
        return queryset

    @action(detail=True, methods=['post'])
    def add_ranking(self, request, pk=None):
        """Add a ranking entry to a keyword."""
        keyword = self.get_object()
        serializer = KeywordRankingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        ranking = KeywordRanking.objects.create(
            keyword=keyword,
            **serializer.validated_data
        )
        return Response(
            KeywordRankingSerializer(ranking).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['post'])
    def bulk_rankings(self, request):
        """Bulk update rankings for multiple keywords."""
        serializer = BulkRankingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        created = []
        errors = []

        for entry in serializer.validated_data['rankings']:
            try:
                keyword = Keyword.objects.get(id=entry['keyword_id'])
                ranking, was_created = KeywordRanking.objects.update_or_create(
                    keyword=keyword,
                    recorded_date=entry['recorded_date'],
                    search_engine=entry.get('search_engine', 'google'),
                    defaults={'position': int(entry['position'])}
                )
                created.append({
                    'keyword_id': keyword.id,
                    'keyword': keyword.keyword,
                    'position': ranking.position,
                    'recorded_date': str(ranking.recorded_date),
                    'created': was_created
                })
            except Keyword.DoesNotExist:
                errors.append({
                    'keyword_id': entry['keyword_id'],
                    'error': 'Keyword not found'
                })
            except Exception as e:
                errors.append({
                    'keyword_id': entry.get('keyword_id'),
                    'error': str(e)
                })

        return Response({
            'created': created,
            'errors': errors
        })


class ClientKeywordListView(generics.ListAPIView):
    """Client view for listing their own keywords."""
    serializer_class = ClientKeywordSerializer
    permission_classes = [IsAuthenticated, IsClient]

    def get_queryset(self):
        return Keyword.objects.filter(
            client=self.request.user.client_profile
        ).prefetch_related('rankings').order_by('-is_primary', 'keyword')
