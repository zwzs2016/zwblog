# Generated by Django 2.2.5 on 2019-11-20 06:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0015_sharenote'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='follownum',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='user',
            name='likenum',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='user',
            name='sharenum',
            field=models.IntegerField(default=0),
        ),
    ]
