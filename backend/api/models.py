from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Query(models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='query', default=None)
    name = models.CharField(max_length=100, default='My Query')

    limit = models.IntegerField(default=10)
    offset = models.IntegerField(default=0)