# Generated by Django 2.2.5 on 2019-11-13 13:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0004_auto_20191110_1139'),
    ]

    operations = [
        migrations.CreateModel(
            name='message',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uername', models.EmailField(max_length=30, unique=True)),
                ('nickname', models.CharField(max_length=20)),
                ('title', models.CharField(max_length=50)),
                ('content', models.TextField()),
                ('createtime', models.DateTimeField()),
                ('likenum', models.IntegerField(default=0)),
                ('islock', models.BooleanField(default=False)),
            ],
        ),
    ]
