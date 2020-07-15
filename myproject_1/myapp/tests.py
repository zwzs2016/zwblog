from django.test import TestCase
import hashlib
# Create your tests here.
possword=hashlib.md5('123'.encode(encoding='utf-8'))
print(possword.hexdigest())

s="sdsdddsdsdsdsdd"
print(s[0:2])