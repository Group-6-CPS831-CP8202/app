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
            'limit': int(request.query_params.get('limit', 10)), # number of records to fetch per request, not the total returned limit
            'offset': int(request.query_params.get('offset', '0')),
            'name': request.query_params.get('name', 'My Query'),
        }
        print("Running Query..")


        if request.user.is_authenticated:
            query_data['user'] = request.user.id

        # Serialize data (to save/update Query object, if needed)
        serializer = QuerySerializer(data=query_data)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Prepare fields and sort for the external API request
        csv_file_path = 'api/data/contracts.csv'
        total_limit = query_data['limit']
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
                sorted_and_filtered_records = [record for record in sorted_records if record['contract_value'] > 0]

                # Apply offset and limit
                offset = int(request.query_params.get('offset', '0'))

                # Calculate the end index for slicing, ensuring it doesn't exceed the list length
                end_index = offset + total_limit if (offset + total_limit <= len(sorted_and_filtered_records)) else len(sorted_and_filtered_records)

                # Now apply the slicing to get the records you want to return
                valid_records = sorted_and_filtered_records[offset:end_index]
                

        except FileNotFoundError:
            return Response({"error": "CSV file not found"}, status=404)
        except Exception as e:
            return Response({"error": "An error occurred while processing the CSV file", "details": str(e)}, status=500)

        return JsonResponse({"records": valid_records}, safe=False, status=200)
    
class FilteredContractsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        query_detail_url = request.build_absolute_uri('/api/query')

        # Convert query parameters received by FilteredContractsView to a dictionary
        # and pass them directly to QueryDetail as params in the GET request.
        query_params = request.query_params.dict()

        # Make a GET request to QueryDetail, including any query parameters it's expecting.
        response = requests.get(query_detail_url, params=query_params)

        if response.status_code == 200:
            records = response.json().get('records', [])
            filtered_records = [{
                "contractor": record["vendor_name"],
                # Use a function to safely convert values to float
                "contract_value": self.safe_float_convert(record.get("contract_value")),
                "amendment_value": self.safe_float_convert(record.get("amendment_value")),
            } for record in records if 'vendor_name' in record]

            return Response(filtered_records)
        else:
            return Response({"error": "Failed to retrieve data from QueryDetail view."}, status=response.status_code)

    def safe_float_convert(self, value):
        """Safely converts a value to float. Defaults to 0.0 if conversion fails."""
        try:
            return float(value)
        except (TypeError, ValueError):
            return 0.0


        

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