import jwt
from datetime import datetime, timedelta
from flask import current_app

def generate_token(user_id, user_type, expires_minutes=60*24):
    """Generate JWT token with user id and type"""
    payload = {
        'sub': user_id,
        'type': user_type,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(minutes=expires_minutes)
    }
    secret = current_app.config.get('SECRET_KEY')
    token = jwt.encode(payload, secret, algorithm='HS256')
    return token


def decode_token(token):
    secret = current_app.config.get('SECRET_KEY')
    try:
        payload = jwt.decode(token, secret, algorithms=['HS256'])
        return payload
    except Exception:
        return None
