import smtplib
from email.mime.text import MIMEText
from email.header import Header
def stmpemail(sender,receivers,url):
	# sender = '1025444565@qq.com'
	receivers = [receivers]  # 接收邮件，可设置为你的QQ邮箱或者其他邮箱
	# 三个参数：第一个为文本内容，第二个 plain 设置文本格式，第三个 utf-8 设置编码
	message = MIMEText('感谢您注册旺享笔记,这是您的注册激活链接:%s' % url, 'plain', 'utf-8')
	message['From'] = Header("旺享", 'utf-8')   # 发送者
	message['To'] =  Header(''.join(receivers[0]),'utf-8')  # 接收者 
	subject = '旺享笔记注册'
	message['Subject'] = Header(subject, 'utf-8')
	mail_host='smtp.qq.com'
	mail_user='1025444565@qq.com'
	mail_psd='lnlcbhnnbmpibfaa' 
	port='25'
	try:
		smtpObj = smtplib.SMTP(mail_host,port)
		# smtpObj.connect('stmp.qq.com',25)
		smtpObj.login(sender,mail_psd)
		smtpObj.sendmail(sender,receivers,message.as_string())
		print("邮件发送成功")
		smtpObj.quit()
	except smtplib.SMTPException:
		print("Error: 无法发送邮件")
if __name__ == '__main__':
	pass
	# sender = '1025444565@qq.com'
	# receivers='3175974121@q1.com'
	# url='http://127.0.0.1/registerlock?username='
	# stmpemail(sender,receivers,url)