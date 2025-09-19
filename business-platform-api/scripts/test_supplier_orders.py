import requests

# login as supplier_demo
r = requests.post('http://127.0.0.1:5000/api/auth/login', json={'username':'supplier_demo','password':'123456'})
print('LOGIN', r.status_code)
print(r.text)
if r.status_code==200:
    token = r.json().get('token')
    headers = {'Authorization': f'Bearer {token}'}
    d = requests.get('http://127.0.0.1:5000/api/supplier/orders', headers=headers)
    print('ORDERS', d.status_code)
    print(d.text[:2000])
else:
    print('login failed')
