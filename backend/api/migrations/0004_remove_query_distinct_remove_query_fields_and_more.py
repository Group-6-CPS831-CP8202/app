# Generated by Django 5.0.2 on 2024-04-07 19:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_query_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='query',
            name='distinct',
        ),
        migrations.RemoveField(
            model_name='query',
            name='fields',
        ),
        migrations.RemoveField(
            model_name='query',
            name='filters',
        ),
        migrations.RemoveField(
            model_name='query',
            name='include_total',
        ),
        migrations.RemoveField(
            model_name='query',
            name='language',
        ),
        migrations.RemoveField(
            model_name='query',
            name='plain',
        ),
        migrations.RemoveField(
            model_name='query',
            name='records_format',
        ),
        migrations.RemoveField(
            model_name='query',
            name='resource_id',
        ),
        migrations.RemoveField(
            model_name='query',
            name='search',
        ),
        migrations.RemoveField(
            model_name='query',
            name='sort',
        ),
    ]
