from django.contrib import admin

# Register your models here.
from .models import Query

class QueryAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at', 'updated_at', 'limit', 'offset', 'search', 'sort', 'filters', 'fields')

admin.site.register(Query, QueryAdmin)