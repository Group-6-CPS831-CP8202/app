from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Query
from .serializers import QuerySerializer
from rest_framework.permissions import AllowAny
import requests

class QueryDetail(APIView):
    permission_classes = [AllowAny]  # Adjust based on your auth requirements

    def get(self, request, format=None):
        # Extract parameters from request.query_params
        # and prepare them to be used for object creation.
        query_data = {
            'resource_id': request.query_params.get('resource_id', 'fac950c0-00d5-4ec1-a4d3-9cbebf98a305'),
            'filters': request.query_params.get('filters', None),
            'search': request.query_params.get('search', None),
            'distinct': request.query_params.get('distinct', True) in ['True', 'true', '1'],
            'plain': request.query_params.get('plain', False) in ['True', 'true', '1'],
            'language': request.query_params.get('language', 'english'),
            'limit': int(request.query_params.get('limit', 10)),
            'offset': int(request.query_params.get('offset', 0)),
            'fields': request.query_params.get('fields', None),
            'sort': request.query_params.get('sort', None),
            'include_total': request.query_params.get('include_total', False) in ['True', 'true', '1'],
            'records_format': request.query_params.get('records_format', 'csv'),
        }

        # Deserialize data to create a new Query object
        serializer = QuerySerializer(data=query_data)
        if serializer.is_valid():
            query_obj = serializer.save()  # Save the object to DB
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
