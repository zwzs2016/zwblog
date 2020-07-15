# Generated by Django 2.2.5 on 2019-11-26 11:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0024_sharenote_leaveword'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='sharenote',
            name='leaveword',
        ),
        migrations.CreateModel(
            name='leaveword',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.CharField(max_length=300)),
                ('likenum', models.IntegerField(default=0)),
                ('sharenote', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.ShareNote')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.User')),
            ],
        ),
    ]