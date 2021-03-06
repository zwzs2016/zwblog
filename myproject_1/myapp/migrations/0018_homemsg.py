# Generated by Django 2.2.5 on 2019-11-23 05:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0017_auto_20191120_1919'),
    ]

    operations = [
        migrations.CreateModel(
            name='Homemsg',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(max_length=30)),
                ('title', models.CharField(max_length=50, unique=True)),
                ('content', models.TextField()),
                ('likenum', models.IntegerField(default=0)),
                ('islock', models.BooleanField(default=False)),
                ('islike', models.BooleanField(default=False)),
            ],
        ),
    ]
