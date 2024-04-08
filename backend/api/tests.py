from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

# Create your tests here.

class QueryDetailTests(APITestCase):
    def test_get_query(self):
        url = '/api/query' + '?limit=10&offset=0'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()['records']), 10)

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

#unit test
from django.test import TestCase
from myapp.serializers import MyModelSerializer

class MyModelSerializerTest(TestCase):
    def test_serializer_valid_data(self):
        data = {'field1': 'value1', 'field2': 'value2'}
        serializer = MyModelSerializer(data=data)
        self.assertTrue(serializer.is_valid())


#integration test
from myapp.models import MyModel

class MyModelAPITest(APITestCase):
    def setUp(self):
        MyModel.objects.create(user='value1', name='value2')

    def test_get_my_model_list(self):
        url = '/api/mymodel/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        #authentication test
from django.contrib.auth.models import User
from myapp.models import MyModel

class MyModelAPITest(APITestCase):
    def setUp(self):
        user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=user)

    def test_authenticated_user_can_create_model(self):
        url = '/api/mymodel/'
        data = {'field1': 'value1', 'field2': 'value2'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
