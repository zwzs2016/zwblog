# Generated by Django 2.2.5 on 2019-11-23 05:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0019_auto_20191123_1311'),
    ]

    operations = [
        migrations.AlterField(
            model_name='homemsg',
            name='likenum',
            field=models.IntegerField(),
        ),
    ]
