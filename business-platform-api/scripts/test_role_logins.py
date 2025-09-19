import requests

roles = [
    ('merchant_demo', '123456', 'http://127.0.0.1:5000/api/merchant/dashboard'),
    ('shipping_demo', '123456', 'http://127.0.0.1:5000/api/shipping/companies/1/dashboard' ),
    ('supplier_demo', '123456', 'http://127.0.0.1:5000/api/supplier/dashboard')
]

for username, password, dashboard_url in roles:
    try:
        print('\n--', username)
        r = requests.post('http://127.0.0.1:5000/api/auth/login', json={'username': username, 'password': password})
        print('LOGIN', r.status_code, r.text)
        if r.status_code == 200:
            token = r.json().get('token')
            headers = {'Authorization': f'Bearer {token}'}
            d = requests.get(dashboard_url, headers=headers)
            print('DASH', d.status_code, d.text[:1000])
    except Exception as e:
        print('ERR', e)
