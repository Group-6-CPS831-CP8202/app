from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

# Create your tests here.

class QueryDetailTests(APITestCase):
    def test_get_query(self):
        url = '/api/query' + '?limit=10&offset=0'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['result']['resource_id'], 'fac950c0-00d5-4ec1-a4d3-9cbebf98a305')

class RegisterEndPointTests(APITestCase):
    def test_register_endpoint(self):
        url = '/api/register'
        data = {
            'username': 'test',
            'password': 'test',
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, {'message': 'success'})