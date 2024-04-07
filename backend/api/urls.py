from django.urls import path
from .views import QueryDetail, RegisterView, LoginView, LogoutView, UserQueries

urlpatterns = [
    path('query', QueryDetail.as_view()),
    path('login', LoginView.as_view(), name='login'),
    path('register', RegisterView.as_view(), name='register'),
    path('logout', LogoutView.as_view(), name='logout'),
    path('user/queries', UserQueries.as_view(), name='user-queries')
]
