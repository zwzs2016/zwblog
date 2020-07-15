from django.db import models
from datetime import date
import django.utils.timezone as timezone


# Create your models here.
class User(models.Model):
    username = models.EmailField(max_length=30, unique=True)
    psd = models.CharField(max_length=50)
    time = models.DateTimeField()
    nickname = models.CharField(max_length=20, blank=True)
    likenum = models.IntegerField(default=0)
    follownum = models.IntegerField(default=0)
    sharenum = models.IntegerField(default=0)
    islock = models.BooleanField(default=False)
    isdelete = models.BooleanField(default=False)


class Message(models.Model):
    username = models.ForeignKey('User', on_delete=models.CASCADE)
    type = models.CharField(max_length=30)
    title = models.CharField(max_length=50, unique=True)
    content = models.TextField()
    createtime = models.DateTimeField()
    likenum = models.IntegerField(default=0)
    islock = models.BooleanField(default=False)


class Notenotice(models.Model):
    username = models.ForeignKey('User', on_delete=models.CASCADE)
    notemessage = models.TextField()
    createtime = models.DateTimeField(auto_now=True)


class ShareNote(models.Model):
    username = models.ForeignKey('User', on_delete=models.CASCADE)
    sharefamily = models.CharField(max_length=30)
    sharetitle = models.CharField(max_length=50)
    sharecontent = models.TextField()
    sharetime = models.DateTimeField()
    likenum = models.IntegerField(default=0)
    looknum = models.IntegerField(default=0)
    islock = models.BooleanField(default=False)


class Homemsg(models.Model):
    type = models.CharField(max_length=30)
    title = models.CharField(max_length=50, unique=True)
    usermsg = models.CharField(max_length=20)
    content = models.TextField()
    createtime = models.DateTimeField()
    likenum = models.IntegerField(default=0)
    looknum = models.IntegerField(default=0)
    islock = models.BooleanField(default=False)


class Leaveword(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    sharenote = models.ForeignKey('ShareNote', on_delete=models.CASCADE)
    content = models.CharField(max_length=300)
    likenum = models.IntegerField(default=0)


class Follow(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    nickname = models.CharField(max_length=20, blank=True)


# class UserPictures(models.Model):
#     uploadImg=models.ImageField(max_length=104857600)
