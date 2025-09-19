import requests
r = requests.post('http://127.0.0.1:5000/api/auth/login', json={'username':'supplier_demo','password':'123456'})
print('LOGIN', r.status_code)
if r.status_code==200:
    token = r.json().get('token')
    headers = {'Authorization': f'Bearer {token}'}
    q = requests.get('http://127.0.0.1:5000/api/supplier/quotations', headers=headers)
    print('QUOTATIONS', q.status_code)
    print(q.text[:2000])
else:
    print('login failed')
