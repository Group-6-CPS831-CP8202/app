import requests
import json
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Query
from .serializers import QuerySerializer, UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.conf import settings


class QueryDetail(APIView):
    permission_classes = [AllowAny]
    def get(self, request, format=None):
        # Initialize all parameters, setting explicit None defaults for fields without defaults in the model
        query_data = {
            'resource_id': request.query_params.get('resource_id', 'fac950c0-00d5-4ec1-a4d3-9cbebf98a305'),
            'distinct': request.query_params.get('distinct', 'false').lower() in ['true', '1'],
            'plain': request.query_params.get('plain', 'true').lower() in ['true', '1'],
            'language': request.query_params.get('language', 'english'),
            'limit': 1000, # number of records to fetch per request, not the total returned limit
            'offset': int(request.query_params.get('offset', '0')),
            'include_total': request.query_params.get('include_total', 'true').lower() in ['true', '1'],
            'records_format': request.query_params.get('records_format', 'objects'),
            'filters': None,  # Explicitly set to None if not provided
            'search': None,  # Explicitly set to None if not provided
            'fields': None,  # Explicitly set to None if not provided
            'sort': request.query_params.get('sort', 'contract_value desc'),
            'name': request.query_params.get('name', 'My Query'),
        }


        if request.user.is_authenticated:
            query_data['user'] = request.user.id
        

        # Optional JSON fields handling
        if 'filters' in request.query_params and request.query_params['filters']:
            try:
                query_data['filters'] = json.loads(request.query_params['filters'])
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON format for filters'}, status=status.HTTP_400_BAD_REQUEST)

        if 'search' in request.query_params:
            query_data['q'] = request.query_params['search']  # 'search' parameter is known as 'q' in the API

        if 'fields' in request.query_params:
            query_data['fields'] = request.query_params['fields']

        if 'sort' in request.query_params:
            query_data['sort'] = request.query_params['sort']

        # Serialize data (to save/update Query object, if needed)
        serializer = QuerySerializer(data=query_data)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Prepare fields and sort for the external API request

        # Remove None values from query_data, and the custom data
        query_data.pop('user', None)
        query_data.pop('name', None)
        query_data = {k: v for k, v in query_data.items() if v is not None or k in ['filters', 'search', 'fields', 'sort']}

        # Make the external API request
        external_api_url = 'https://open.canada.ca/data/api/action/datastore_search'

        total_limit = int(request.query_params.get('limit', 10))
        valid_records = []
        
        while len(valid_records) < total_limit:
            print(len(valid_records))
            response = requests.get(external_api_url, params=query_data)
            if response.status_code != 200:
                # If the API request fails, return the error
                return Response(response.text, status=response.status_code)
            
            data = response.json().get('result', {})
            records = data.get('records', [])
            for record in records:
                if record.get('contract_value') is not None:
                    valid_records.append(record)
                if len(valid_records) == total_limit:
                    # If we have enough valid records, break out of the loop
                    break

            if len(records) < query_data['limit'] or len(valid_records) == total_limit:
                # If we received fewer records than requested, assume we've reached the end of the dataset
                break

            query_data['offset'] += query_data['limit']  # Update the offset for the next batch

        if len(valid_records) < total_limit:
            # If not enough valid records were found, you can choose to return what you have or an error
            return Response({"error": "Not enough records with non-null contract values found", "records": valid_records}, status=status.HTTP_200_OK)

        return Response({"records": valid_records}, status=status.HTTP_200_OK)
        

class UserQueries(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        queries = Query.objects.filter(user=request.user)
        serializer = QuerySerializer(queries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            response = Response({"message": "success"}, status=status.HTTP_201_CREATED)
            # Set the HTTP-only cookie
            response.set_cookie(
                key='auth_token',
                value=token.key,
                httponly=True,
                samesite='Lax',
                secure=not settings.DEBUG,  # False if DEBUG is True, True otherwise
            )
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            response = Response({"message": "success"}, status=status.HTTP_200_OK)
            # Set the HTTP-only cookie
            response.set_cookie(
                key='auth_token',
                value=token.key,
                httponly=True,
                samesite='Lax',
                secure=not settings.DEBUG,  # False if DEBUG is True, True otherwise
            )
            return response
        else:
            return Response({"error": "invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        
class LogoutView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        response = Response({"message": "success"}, status=status.HTTP_200_OK)
        response.delete_cookie('auth_token')
        return response