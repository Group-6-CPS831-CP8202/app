from django.urls import path
from .views import QueryDetail, RegisterView, LoginView

urlpatterns = [
    # Other paths...
    path('query', QueryDetail.as_view()),
    path('login', LoginView.as_view(), name='login'),
    path('register', RegisterView.as_view(), name='register'),
]
