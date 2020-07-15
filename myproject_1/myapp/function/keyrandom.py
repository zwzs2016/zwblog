import random,string,hashlib
def keyvalue():
    num=string.ascii_letters+string.digits
    key="".join(random.sample(num,20))
    return key
def psdmd5(psd):
    possword=hashlib.md5(psd.encode(encoding='utf-8'))
    return possword.hexdigest()