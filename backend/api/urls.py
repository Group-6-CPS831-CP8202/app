from django.urls import path
from .views import QueryDetail

urlpatterns = [
    # Other paths...
    path('query', QueryDetail.as_view()),
]
