from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Query(models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='query')

    # fields
    resource_id = models.CharField(max_length=100, default='fac950c0-00d5-4ec1-a4d3-9cbebf98a305') # default contracts over 10k dataset
    filters = models.JSONField(null=True, blank=True)
    search = models.TextField() # called 'q' in the API
    distinct = models.BooleanField(default=True)
    plain = models.BooleanField(default=False)
    language = models.CharField(max_length=30, default='english')
    limit = models.IntegerField(default=10)
    offset = models.IntegerField(default=0)
    fields = models.JSONField(null=True, blank=True)
    sort = models.JSONField(null=True, blank=True)
    include_total = models.BooleanField(default=False)
    records_format = models.CharField(choices=[('objects', 'objects'), ('lists', 'lists'), ('csv', 'csv'), ('tsv', 'tsv')], default='csv', max_length=7)

    
    
    def __str__(self):
        return self.reference_number