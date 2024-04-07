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
import csv, os


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
        csv_file_path = 'api/data/contracts.csv'
        total_limit = int(request.query_params.get('limit', '100'))  # Total number of records to return
        valid_records = []

        try:
            with open(csv_file_path, mode='r', encoding='utf-8') as file:
                # Create a CSV reader object
                csv_reader = csv.DictReader(file)
                records = list(csv_reader)  # Convert the reader object to a list for sorting
                
                # Convert contract_value to float for sorting, handling None or empty strings
                for record in records:
                    try:
                        record['contract_value'] = float(record.get('contract_value', 0))
                    except ValueError:
                        record['contract_value'] = 0

                # Sort the records by contract_value in descending order
                sorted_records = sorted(records, key=lambda x: x['contract_value'], reverse=True)

                # Filter out records with contract_value of 0 (which were initially None or empty)
                # and limit the number of records according to total_limit
                for record in sorted_records:
                    if record['contract_value'] > 0:
                        valid_records.append(record)
                        if len(valid_records) == total_limit:
                            break
        except FileNotFoundError:
            return Response({"error": "CSV file not found"}, status=404)
        except Exception as e:
            return Response({"error": "An error occurred while processing the CSV file", "details": str(e)}, status=500)

        return JsonResponse({"records": valid_records}, safe=False, status=200)
        

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