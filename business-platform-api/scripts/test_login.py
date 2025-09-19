import requests

login_url = 'http://127.0.0.1:5000/api/auth/login'
dashboard_url = 'http://127.0.0.1:5000/api/merchant/dashboard'

resp = requests.post(login_url, json={'username':'merchant_demo','password':'123456'})
print('LOGIN_STATUS', resp.status_code)
print(resp.json())

if resp.status_code == 200:
    token = resp.json().get('token')
    headers = {'Authorization': f'Bearer {token}'}
    d = requests.get(dashboard_url, headers=headers)
    print('DASH_STATUS', d.status_code)
    print(d.json())
else:
    print('Login failed')
