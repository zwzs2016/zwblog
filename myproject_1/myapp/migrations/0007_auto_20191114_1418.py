# Generated by Django 2.2.5 on 2019-11-14 06:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0006_auto_20191113_2117'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='username',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.User'),
        ),
    ]
