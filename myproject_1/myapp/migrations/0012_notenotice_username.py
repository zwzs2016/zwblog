# Generated by Django 2.2.5 on 2019-11-17 04:54

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0011_notenotice'),
    ]

    operations = [
        migrations.AddField(
            model_name='notenotice',
            name='username',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='myapp.User'),
            preserve_default=False,
        ),
    ]
