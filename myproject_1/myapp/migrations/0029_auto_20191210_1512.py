# Generated by Django 2.2.5 on 2019-12-10 07:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0028_auto_20191210_1457'),
    ]

    operations = [
        migrations.AlterField(
            model_name='follow',
            name='nickname',
            field=models.CharField(blank=True, max_length=20),
        ),
    ]