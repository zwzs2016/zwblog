# Generated by Django 2.2.5 on 2019-11-15 11:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0009_auto_20191115_1950'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='nickname',
            field=models.CharField(blank=True, max_length=20),
        ),
    ]