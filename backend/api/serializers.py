from rest_framework import serializers
from api.models import Query

class QuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Query
        fields = ['id', 'user', 'resource_id', 'filters', 'search', 'distinct', 'plain', 'language', 'limit', 'offset', 'fields', 'sort', 'include_total', 'records_format']