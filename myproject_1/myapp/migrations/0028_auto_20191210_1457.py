# Generated by Django 2.2.5 on 2019-12-10 06:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0027_follow'),
    ]

    operations = [
        migrations.AlterField(
            model_name='follow',
            name='nickname',
            field=models.CharField(blank=True, max_length=20, unique=True),
        ),
    ]
