# Generated by Django 2.2.5 on 2019-11-17 04:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0010_auto_20191115_1954'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notenotice',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('notemessage', models.TextField()),
                ('createtime', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]