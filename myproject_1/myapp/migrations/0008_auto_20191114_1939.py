# Generated by Django 2.2.5 on 2019-11-14 11:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0007_auto_20191114_1418'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='message',
            name='nickname',
        ),
        migrations.AddField(
            model_name='user',
            name='nickname',
            field=models.CharField(default=None, max_length=20),
        ),
    ]
