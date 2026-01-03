from rest_framework import serializers
from .models import Keyword, KeywordRanking


class KeywordRankingSerializer(serializers.ModelSerializer):
    """Serializer for KeywordRanking model."""

    class Meta:
        model = KeywordRanking
        fields = ['id', 'position', 'recorded_date', 'search_engine', 'created_at']
        read_only_fields = ['id', 'created_at']


class KeywordSerializer(serializers.ModelSerializer):
    """Serializer for Keyword model."""
    client_name = serializers.CharField(source='client.company_name', read_only=True)
    latest_position = serializers.SerializerMethodField()
    rankings = KeywordRankingSerializer(many=True, read_only=True)

    class Meta:
        model = Keyword
        fields = [
            'id', 'client', 'client_name', 'keyword', 'target_url',
            'search_volume', 'difficulty', 'is_primary',
            'latest_position', 'rankings', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_latest_position(self, obj):
        latest = obj.latest_ranking
        return latest.position if latest else None


class KeywordListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing keywords."""
    client_name = serializers.CharField(source='client.company_name', read_only=True)
    latest_position = serializers.SerializerMethodField()

    class Meta:
        model = Keyword
        fields = [
            'id', 'client', 'client_name', 'keyword', 'target_url',
            'search_volume', 'difficulty', 'is_primary', 'latest_position'
        ]

    def get_latest_position(self, obj):
        latest = obj.latest_ranking
        return latest.position if latest else None


class KeywordCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating keywords."""

    class Meta:
        model = Keyword
        fields = [
            'client', 'keyword', 'target_url',
            'search_volume', 'difficulty', 'is_primary'
        ]


class BulkRankingSerializer(serializers.Serializer):
    """Serializer for bulk ranking updates."""
    rankings = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        )
    )

    def validate_rankings(self, value):
        """Validate each ranking entry."""
        for entry in value:
            if 'keyword_id' not in entry:
                raise serializers.ValidationError('keyword_id is required')
            if 'position' not in entry:
                raise serializers.ValidationError('position is required')
            if 'recorded_date' not in entry:
                raise serializers.ValidationError('recorded_date is required')
        return value


class ClientKeywordSerializer(serializers.ModelSerializer):
    """Serializer for client viewing their own keywords."""
    latest_position = serializers.SerializerMethodField()
    position_change = serializers.SerializerMethodField()
    recent_rankings = serializers.SerializerMethodField()

    class Meta:
        model = Keyword
        fields = [
            'id', 'keyword', 'target_url', 'search_volume',
            'difficulty', 'is_primary', 'latest_position',
            'position_change', 'recent_rankings'
        ]

    def get_latest_position(self, obj):
        latest = obj.latest_ranking
        return latest.position if latest else None

    def get_position_change(self, obj):
        """Get position change from previous recording."""
        rankings = obj.rankings.all()[:2]
        if len(rankings) < 2:
            return None
        # Positive change means improvement (lower position number)
        return rankings[1].position - rankings[0].position

    def get_recent_rankings(self, obj):
        """Get last 10 rankings for chart."""
        rankings = obj.rankings.all()[:10]
        return [
            {
                'date': r.recorded_date.isoformat(),
                'position': r.position
            }
            for r in reversed(rankings)
        ]
