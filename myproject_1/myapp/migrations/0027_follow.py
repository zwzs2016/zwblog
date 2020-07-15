# Generated by Django 2.2.5 on 2019-12-08 12:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0026_homemsg_usermsg'),
    ]

    operations = [
        migrations.CreateModel(
            name='Follow',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nickname', models.CharField(blank=True, max_length=20)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.User')),
            ],
        ),
    ]