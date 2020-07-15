from django.shortcuts import render
from django.http import HttpResponse,HttpResponseRedirect
from myapp.models import User,Message,Notenotice,ShareNote,Homemsg,Leaveword,Follow
from django.db import connection
from .function import stmp,keyrandom
import  django.utils.timezone as timezone
from django.views.decorators.csrf import csrf_protect
from  django.db.models import Q,Sum
from django.core.mail import send_mail
import json
from bs4 import BeautifulSoup
# Create your views here.
@csrf_protect
def homepage(request):
    homepagedict={"contents":[]}
    try:
        searchcontents=request.session['searchcontents']
        homepagedict=searchcontents
        print(homepagedict)
        return render(request, 'homepage.html', homepagedict)
    except KeyError:
        pass
    homemsg = Homemsg.objects.all()
    for h in homemsg:
        homepagedict["contents"].append([h.type,h.title,h.content,h.usermsg,str(h.createtime)[:-6],h.likenum,h.looknum])
    return render(request,'homepage.html',homepagedict)
def look_homepage(request):
    title=request.POST.get("title")
    nickname=request.POST.get("nickname")
    print("title:"+str(title))
    # 允许访客查看
    # try:
    #     loginuser = request.session['loginuser']
    # except:
    #     return HttpResponse("0")
    homemsg=Homemsg.objects.filter(title=title)
    if homemsg.exists():
        print("存在")
        content=''
        for h in homemsg:
            content=h.content
            look_num=h.looknum
        homemsg.update(looknum=look_num + 1)
        print("looknum次数+1")
        return HttpResponse(content)
    else:
        request.session['nickname'] = nickname
        request.session['title'] = title
        request.session['leaveword'] = False
        print(title, nickname)
        #允许访客查看
        # try:
        #     loginuser = request.session['loginuser']
        # except:
        #     return HttpResponse("0")
        contents = {}
        user = User.objects.get(nickname=nickname)
        username_id = user.id
        sharenote = ShareNote.objects.get(sharetitle=title, username_id=username_id)
        contents = sharenote.sharecontent
        #looknum次数加1
        sharenote.looknum+=1
        sharenote.save()
        print("looknum加一")
        return HttpResponse(contents)
@csrf_protect
def login(request):
    c={}
    return render(request,'logon.html',c)
@csrf_protect
def loginok(request):
    username=request.POST.get("username")
    psd=request.POST.get("psd")
    print(username,psd)
    isuser=User.objects.filter(username=username)
    print(isuser)
    if isuser.exists():
        for user in isuser:
            if user.islock==False:
                if user.username==username:
                    if user.psd==keyrandom.psdmd5(psd):
                        print('用户信息正确')
                        request.session['loginuser']=username
                        request.session.set_expiry(600)
                        print(request.session['loginuser'])
                        return HttpResponse("1")
                    else:
                        print('密码错误')
                        return HttpResponse("0")
            else:
                return HttpResponse("-2")
    else:
        return HttpResponse("-1") #无此用户
def islogin(request):
    try:
        if request.session['loginuser']:
            return HttpResponse("1")
    except:
        print('返回用户未登录')
        return HttpResponse("0")
def logout(request):
    try:
        del request.session['loginuser']
        # del request.session['like']
        # del request.session['searchcontents']
        # del request.session['liketitle']
        request.session.clear()
        return HttpResponse("1")#注销成功
    except KeyError:
        print("没有此keyError")
        return HttpResponse("0")#已经注销
@csrf_protect
def register(request):
    c={}
    return render(request,'register.html',c)
def isregister(request):
    email=request.POST.get("email")
    psd=request.POST.get("psd")
    #emailbool=User.objects.raw("select * from myapp_user where username='%s'" % email)
    emailbool=User.objects.filter(username=email)
    print(emailbool)
    print(email, psd)
    key = keyrandom.keyvalue()
    if emailbool:
        print('no')
        return HttpResponse("0")
    else:
        print('yes')
        return HttpResponse(key)
def registerok(request):
    email = request.POST.get("text1")
    psd = request.POST.get("password")
    print(psd)
    sender='1025444565@qq.com'
    key=request.POST.get("key")
    request.session['key']=key
    print(key)
    url="http://127.0.0.1/registerlock?username=%s&key=%s" % (email,key)
    # stmp.stmpemail(sender,email,url)
    subject = '旺享笔记注册'
    message='感谢您注册旺享笔记,这是您的注册激活链接:%s' % url
    print(message)
    sender = 'www.123fen.com@foxmail.com'
    receivers = [email]
    try:
        send_mail(subject,message,sender,receivers,fail_silently=False)
        print("发送成功!")
    except:
        return render(request, 'registerfail.html')
    user = User(username=email, psd=keyrandom.psdmd5(psd), islock=True, time=timezone.now())
    user.save()
    return render(request,'registerok.html')
def registerlock(request):
    username=request.GET.get("username")
    try:
        getkey = request.GET.get("key")
        key=request.session['key']
    except KeyError:
        return HttpResponse('<h1>请使用同一设备激活</h1>')
    print(username,key)
    if key==getkey:
        user=User.objects.filter(username=username)
        print(user)
        user.update(islock=False)
        user_id=''
        for u in user:
            user_id=u.id
        print('ok',user_id)
        request.session.clear()
        user=User.objects.get(id=user_id)
        notenotice=Notenotice(username=user,notemessage='感谢您使用旺享笔记,网站功能还有许多不足和缺陷，部分功能未进行及时的说明,还请您自行尝试,实属抱歉,在后续的时间会逐渐完善')
        notenotice.save()
        return HttpResponse("激活成功,<a href='http://127.0.0.1/login'>立即登录</a>")
    else:
        return HttpResponse("激活失败")

@csrf_protect
def mynotes(request):
    c={}
    try:
        loginuser=request.session['loginuser']
        type="分享"
        user=User.objects.filter(username=loginuser)
        username_id=''
        for u in user:
            username_id=u.id
        user=User.objects.get(username=loginuser)
        sharenote=ShareNote.objects.filter(username=username_id)
        likenum=sharenote.aggregate(Sum('likenum'))
        if likenum['likenum__sum']==None:
            likenum['likenum__sum']=0
        print(likenum)
        sharenum=sharenote.count
        c['nickname']=user.nickname
        c['sharenum']=sharenum
        c['likenum']=likenum
        c['follownum']=user.follownum
        c['likednum']=user.likenum
    except KeyError:
        print('未登录!')
    return render(request,'mynotes.html',c)
def isnickname(request):
    loginuser=request.session['loginuser']
    isnickname=User.objects.filter(username=loginuser)
    for user in isnickname:
        print(user.nickname)
        if not user.nickname:
            return HttpResponse("0") #说明没有nickname
        else:
            return HttpResponse("1") #说明有nickname
@csrf_protect
def nickname(request):
    loginuser=request.session['loginuser']
    nickname=request.POST.get("nickname")
    if loginuser:
        try:
            user=User.objects.get(nickname=nickname)
            print('已经存在笔名')
            return HttpResponse("0")
        except:
            User.objects.filter(username=loginuser).update(nickname=nickname)
            print('设置笔名成功!')
            user = User.objects.get(nickname=nickname)
            return HttpResponse("1")
def handbook(request):
    try:
        if request.session['loginuser']:
            return render(request,'handbook.html')
    except:
        return HttpResponse("0") #未登录
def isnotice(request):
    if request.session['loginuser']:
        username=request.session['loginuser']
        user=User.objects.filter(username=username)
        user_id=''
        for u in user:
            user_id=u.id
        noticelist=Notenotice.objects.filter(username=user_id)
        notice = {username:[],"datetime":[]}
        if noticelist.exists():
            for u in noticelist:
                notice[username].append(u.notemessage)
                notice["datetime"].append(str(u.createtime))
            return HttpResponse(json.dumps(notice),content_type="application/json")
        else:
            return HttpResponse("0")
    else:
        return HttpResponse("-1")
def record_events(request):
    loginuser=request.session['loginuser']
    if loginuser:
        user=User.objects.filter(username=loginuser)
        user_id=''
        for u in user:
            user_id=u.id
        print(user_id)
        message=Message.objects.filter(username_id=user_id)
        if message.exists():
            message_list=[]
            for u in message:
                message_list.append([u.type,u.title,u.content,str(u.createtime)])
            return HttpResponse(json.dumps(message_list),content_type="application/json")
        else:
            return HttpResponse("0")
    else:
        return HttpResponse("-1")
def savenotes(request):
    type=request.POST.get("type")
    title=request.POST.get("title")
    content=request.POST.get("content")
    createtime=request.POST.get("createtime")
    print(type,title,content,createtime)
    u_id=''
    try:
        loginuser = request.session['loginuser']
        istitle=Message.objects.filter(title=title)
        if istitle.exists():
            # istitle.update(type=type,content=content,createtime=createtime)
            return HttpResponse("2")
        else:
            username=User.objects.get(username=loginuser)
            Message(username=username,title=title,type=type,content=content,createtime=createtime).save()
            return HttpResponse("1")
    except:
        return HttpResponse("0")
def editnotes(request):
    try:
        loginuser=request.session['loginuser']
        title=request.POST.get("title")
        print("editnotes-title"+title)
        content=Message.objects.filter(title=title)
        if content.exists():
            for u in content:
                content=u.content
            return HttpResponse(json.dumps(content),content_type='application/json')
        else:
            return HttpResponse("0")
    except KeyError:
        return HttpResponse("-1") #not loginuser
def deletenote(request):
    title=request.POST.get("title")
    print (title)
    loginuser=request.session['loginuser']
    username=User.objects.filter(username=loginuser)
    username_id=''
    for u in username:
        username_id=u.id
    if loginuser:
        type=''
        isdelete=Message.objects.get(title=title)
        type=isdelete.type
        print(type)
        print (isdelete)
        isdelete.delete()
        print(0)
        if type!='保存':
            sharenote=ShareNote.objects.get(sharetitle=title,username_id=username_id)
            leaveword=Leaveword.objects.filter(sharenote_id=sharenote.id)
            sharenote.delete()
            if leaveword:
                leaveword.delete()
                print(1)
            print(2)
        return HttpResponse('1') #delete ok
    else:
        return HttpResponse("-1")
def sharenote(request):
    try:
        loginuser = request.session['loginuser']
    except:
        return HttpResponse("-1")
    if loginuser:
        sharefamily = request.POST.get("sharefamily")
        type = request.POST.get("type")
        title = request.POST.get("title")
        sharecontent = request.POST.get("sharecontent")
        sharetime = request.POST.get("sharetime")
        # print (type,title,sharecontent,sharefamily,sharetime)
        username = User.objects.get(username=loginuser)
        sharemsg=Message.objects.filter(title=title)
        if sharemsg.exists():
            msgtype=''
            for u in sharemsg:
                msgtype=u.type
            if  msgtype=='保存':
                msgtype = type
                sharemsg.update(type=msgtype, content=sharecontent,createtime=sharetime)
                ShareNote(username=username,sharefamily=sharefamily,sharetitle=title,sharecontent=sharecontent,sharetime=sharetime).save()
                return HttpResponse("1")
            else:
                return HttpResponse("0") #已经存在分享的标题
        else:
            Message(username=username,title=title,type=type, content=sharecontent, createtime=sharetime).save()
            ShareNote(username=username, sharefamily=sharefamily, sharetitle=title, sharecontent=sharecontent,sharetime=sharetime).save()
            return HttpResponse("1")
    else:
        return HttpResponse("-1")
def share(request):
    try:
        sharefamily=request.GET.get("sharefamily")
        print(sharefamily)
    except:
        pass
    if not sharefamily==None:
        share=ShareNote.objects.filter(sharefamily=sharefamily).order_by('-likenum')
    else:
        share=ShareNote.objects.filter(Q(sharefamily='知识') | Q(sharefamily='心情') | Q(sharefamily='文章')).order_by('-likenum')
    sharedict={'share':[]}
    for u in share:
        user =User.objects.filter(id=u.username_id)
        username=''
        for u1 in user:
            username=u1.nickname
        soup = BeautifulSoup(u.sharecontent, "html.parser")
        sharecontent=soup.get_text(strip=True)
        if len(sharecontent)>436:
            sharecontent=sharecontent[:436]+"..."
        sharedict['share'].append([username,u.sharefamily,u.sharetitle,sharecontent,str(u.sharetime)[:-6],u.likenum,u.looknum])
    return render(request,'share.html',sharedict)
def sharelike(request):
    title=request.POST.get("title")
    nickname=request.POST.get("nickname")
    imgsrc=request.POST.get("imgsrc")
    try:
        loginuser=request.session['loginuser']
    except KeyError:
        return HttpResponse("1")
    try:
        titlelist=request.session['liketitle']
    except KeyError:
        print('ok')
        request.session['liketitle']=[]
        user=User.objects.get(nickname=nickname)
        username_id=user.id
        message=Message.objects.get(username_id=username_id,title=title)
        share = ShareNote.objects.get(username_id=username_id, sharetitle=title)
        message.likenum += 1
        share.likenum += 1
        request.session['liketitle'].append(title)
        message.save()
        share.save()
        return HttpResponse("1")
    else:
        print(titlelist)
        for l in titlelist:
            if l==title:
                return HttpResponse("0")
        user = User.objects.get(nickname=nickname)
        username_id = user.id
        print(title, username_id)
        message = Message.objects.get(username_id=username_id, title=title)
        share = ShareNote.objects.get(username_id=username_id, sharetitle=title)
        message.likenum += 1
        share.likenum += 1
        request.session['liketitle'].append(title)
        message.save()
        share.save()
        return HttpResponse("1")
    # if request.session['liketitle']==title:
    #     return HttpResponse("0")
    # else:
    #     if imgsrc != 'dzan-end.png':
    #         message.likenum += 1
    #         share.likenum += 1
    #         request.session['liketitle'] = title
    #         message.save()
    #         share.save()
    #         return HttpResponse("1")
    #     else:
    #         message.likenum -= 1
    #         share.likenum -= 1
    #         del request.session['liketitle']
    #         message.save()
    #         share.save()
def look_share(request):
    title=request.POST.get("title")
    nickname = request.POST.get("nickname")
    sharefamily=request.POST.get("sharefamily")
    request.session['nickname']=nickname
    request.session['sharefamily']=sharefamily
    request.session['title']=title
    request.session['leaveword']=False
    print(title,nickname,sharefamily)
    # 允许游客身份访问
    # try:
    #     loginuser=request.session['loginuser']
    # except:
    #     return HttpResponse("0")
    contents={}
    user=User.objects.get(nickname=nickname)
    username_id=user.id
    sharenote=ShareNote.objects.get(sharetitle=title,username_id=username_id,sharefamily=sharefamily)
    # print(sharenote.sharecontent)
    contents=sharenote.sharecontent
    # soup = BeautifulSoup(contents, "html.parser")
    # contents=soup.get_text(strip=True)
    #查看次数加一
    sharenote.looknum+=1
    sharenote.save()
    print("looknum次数加1")
    return HttpResponse(contents)
def study(request):
    share = ShareNote.objects.filter(Q(sharefamily='语言') | Q(sharefamily='理学') | Q(sharefamily='文学')).order_by('-likenum')
    sharedict = {'share': []}
    for u in share:
        user = User.objects.filter(id=u.username_id)
        username = ''
        for u1 in user:
            username = u1.nickname
        soup = BeautifulSoup(u.sharecontent, "html.parser")
        sharecontent = soup.get_text(strip=True)
        if len(sharecontent)>436:
            sharecontent=sharecontent[:436]+"..."
        sharedict['share'].append([username, u.sharefamily, u.sharetitle, sharecontent, str(u.sharetime)[:-6], u.likenum,u.looknum])
    return render(request,'study.html', sharedict)
def leaveword(request):
    try:
        isleaveword=request.session['leaveword']
        if isleaveword==True:
            return HttpResponse("0")
    except:
        pass
    content=request.POST.get("content")
    try:
        sharetitle=request.session['title']
        loginuser=request.session['loginuser']
        nickname=request.session['nickname']
    except KeyError:
        return HttpResponse("-1")
    user=User.objects.get(nickname=nickname)
    username_id=user.id
    share = ShareNote.objects.get(sharetitle=sharetitle,username_id=username_id)
    share_id=share.id
    leaveword=Leaveword(content=content,sharenote=share,user=user)
    leaveword.save()
    request.session['leaveword']=True
    return HttpResponse("1")
def showword(request):
    try:
        sharetitle=request.session['title']
        nickname = request.session['nickname']
        loginuser= request.session['loginuser']
    except KeyError:
        return HttpResponse("0")
    user=User.objects.get(nickname=nickname)
    username_id=user.id
    print(sharetitle,username_id)
    sharenote=ShareNote.objects.get(sharetitle=sharetitle,username_id=username_id)
    leaveword=Leaveword.objects.filter(sharenote=sharenote)
    contents={"leaveword":[]}
    for l in leaveword:
        contents['leaveword'].append(l.content)
    return HttpResponse(json.dumps(contents),content_type='application/json')
def search(request):
    searchtext=request.GET.get("searchtext")
    try:
        loginuser=request.session['loginuser']
    except KeyError:
        return HttpResponse("-1")
    sharenote=ShareNote.objects.filter(sharetitle__contains=searchtext)
    searchcontents = {'contents': []}
    if sharenote:
        for s in sharenote:
            username_id=s.username_id
            user = User.objects.get(id=username_id)
            nickname=user.nickname
            soup = BeautifulSoup(s.sharecontent, "html.parser")
            sharecontent=soup.get_text(strip=True)
            searchcontents['contents'].append([s.sharefamily,s.sharetitle,sharecontent,nickname,str(s.sharetime)[:-6],s.likenum,s.looknum])
        try:
            del request.session['searchcontents']
        except:
            pass
        request.session['searchcontents']=searchcontents
        return HttpResponse("1")

    else:
        user=User.objects.filter(nickname=searchtext)
        if not user:
            return HttpResponse('0')
        else:
            for u in user:
                username_id=u.id
                sharenote=ShareNote.objects.filter(username_id=username_id)
                for s in sharenote:
                    nickname=searchtext
                    soup = BeautifulSoup(s.sharecontent, "html.parser")
                    sharecontent = soup.get_text(strip=True)
                    searchcontents['contents'].append([s.sharefamily,s.sharetitle,sharecontent,nickname,str(s.sharetime)[:-6],s.likenum,s.looknum])
            try:
                del request.session['searchcontents']
            except:
                pass
            request.session['searchcontents'] = searchcontents
            return HttpResponse("1")
def homemsglike(request):
    title=request.POST.get("title")
    try:
        loginuser=request.session['loginuser']
    except KeyError:
        return HttpResponse("-1")
    try:
        liketitle=request.session['liketitle']
    except KeyError:
        request.session['liketitle']=[]
        homemsg=Homemsg.objects.get(title=title)
        homemsg.likenum+=1
        homemsg.save()
        request.session['liketitle'].append(title)
        return HttpResponse("1")
    else:
        for l in liketitle:
            if l==title:
                return HttpResponse("0")
        title = request.POST.get("title")
        homemsg = Homemsg.objects.get(title=title)
        homemsg.likenum += 1
        request.session['liketitle'] = title
        homemsg.save()
        return HttpResponse("1")
def myfollow(request):
    try:
        loginuser=request.session['loginuser']
    except KeyError:
        return HttpResponse("<script>if(confirm('您还未登录,现在登录吗?')){window.location.href='http://127.0.0.1/login';}</script>")
    sharelist = {"share": []}
    user=User.objects.get(username=loginuser)
    nickname=user.nickname
    followuser=request.GET.get("followuser")
    follow = Follow.objects.filter(nickname=nickname)
    user_idlist = []
    nicknamelist = []
    if not followuser:
        user=User.objects.get(username=loginuser)
        sharelist['loginuser'] =user.nickname
        for f in follow:
            user_idlist.append(f.user_id)
        for u in user_idlist:
            user=User.objects.get(id=u)
            nickname=user.nickname
            nicknamelist.append(nickname)
            username_id=u
            share=ShareNote.objects.filter(username_id=username_id).order_by('-likenum')
            for s in share:
                soup=BeautifulSoup(s.sharecontent,"html.parser")
                sharecontent=soup.get_text(strip=True)
                if len(sharecontent) > 436:
                    sharecontent = sharecontent[:436] + "..."
                sharelist['share'].append([s.sharefamily,s.sharetitle,sharecontent,nickname,str(s.sharetime)[:-6],s.likenum,s.looknum])
        sharelist["nickname"]=nicknamelist
        request.session['followuser']=nicknamelist
        print(sharelist['loginuser'])
    else:
        try:
            nicknamelist=request.session['followuser']
        except KeyError:
            return HttpResponse("<script>alert('链接错误!');</script>")
        user=User.objects.get(nickname=followuser)
        username_id=user.id
        share=ShareNote.objects.filter(username_id=username_id)
        for s in share:
            soup = BeautifulSoup(s.sharecontent, "html.parser")
            sharecontent = soup.get_text(strip=True)
            if len(sharecontent) > 436:
                sharecontent = sharecontent[:436] + "..."
            sharelist['share'].append([s.sharefamily, s.sharetitle, sharecontent, followuser, str(s.sharetime)[:-6], s.likenum])
        sharelist['nickname']=nicknamelist
    return render(request,'myfollow.html',sharelist)
def follow(request):
    try:
        loginuser=request.session['loginuser']
    except KeyError:
        return HttpResponse("-1")
    nickname = request.GET.get("nickname")
    print(nickname)
    user = User.objects.get(nickname=nickname)    #被关注者
    followuser = User.objects.get(username=loginuser) #关注者
    follow=Follow.objects.filter(Q(nickname=followuser.nickname) & Q(user_id=user.id))
    if follow:
        return HttpResponse("0")
    else:
        user.likenum += 1
        followuser.follownum+=1
        user.save()
        followuser.save()
        Follow(nickname=followuser.nickname, user_id=user.id).save()
        return HttpResponse("1")
    # try:
    #     followed=request.session['followed']
    # except KeyError:
    #     request.session['followed']=[]
    #     user.likenum += 1
    #     followuser.follownum+=1
    #     if follow:
    #         return HttpResponse("0")
    #     else:
    #         Follow(nickname=followuser.nickname, user_id=user.id).save()
    #     user.save()
    #     followuser.save()
    #     request.session['followed'].append(nickname)
    #     return HttpResponse("1")
    # else:
    #     for f in followed:
    #         if f==nickname:
    #             return HttpResponse("0")
    #     user.likenum += 1
    #     followuser.follownum+=1
    #     if follow:
    #         return HttpResponse("0")
    #     else:
    #         Follow(nickname=followuser.nickname, user_id=user.id).save()
    #     user.save()
    #     followuser.save()
    #     request.session['followed'].append(nickname)
    #     return HttpResponse("1")
def nofollow(request):
    try:
        loginuser=request.session['loginuser']
    except KeyError:
        return HttpResponse("-1")
    nickname=request.GET.get("nickname")
    print(nickname)
    user=User.objects.get(nickname=nickname) #被取消关注者
    nofollowuser=User.objects.get(username=loginuser) #取消关注者
    user.likenum-=1
    nofollowuser.follownum-=1
    print(nofollowuser.nickname,user.id)
    follow=Follow.objects.filter(Q(nickname=nofollowuser.nickname) & Q(user_id=user.id))
    if follow:
        follow.delete()
    else:
        return HttpResponse("0")
    user.save()
    nofollowuser.save()
    return HttpResponse(nofollowuser.nickname)
def publish(request):
    try:
        loginuser = request.session['loginuser']
    except KeyError:
        return HttpResponse(
            "<script>if(confirm('您还未登录,现在登录吗?')){window.location.href='http://127.0.0.1/login';}</script>")
    sharedict={}
    user=User.objects.get(username=loginuser)
    nickname=user.nickname
    username_id=user.id
    sharenote=ShareNote.objects.filter(username_id=username_id).order_by('-likenum')
    sharedict = {'share': []}
    for s in sharenote:
        soup = BeautifulSoup(s.sharecontent, "html.parser")
        sharecontent=soup.get_text(strip=True)
        if len(sharecontent)>436:
            sharecontent=sharecontent[:436]+"..."
        sharedict['share'].append([s.sharefamily, s.sharetitle, sharecontent, nickname, str(s.sharetime)[:-6], s.likenum,s.looknum])
    return render(request,'publish.html',sharedict)








