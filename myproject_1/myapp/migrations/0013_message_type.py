# Generated by Django 2.2.5 on 2019-11-18 04:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0012_notenotice_username'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='type',
            field=models.CharField(default=1, max_length=30),
            preserve_default=False,
        ),
    ]
