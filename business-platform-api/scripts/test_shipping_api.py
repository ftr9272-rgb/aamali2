import requests
import json

# اختبار إنشاء مستخدم شركة شحن عبر API
def test_shipping_user():
    base_url = "http://localhost:5000/api"
    
    # 1. إنشاء مستخدم
    user_data = {
        "username": "shipping_demo",
        "email": "shipping_demo@test.com",
        "password": "123456",
        "full_name": "شركة الشحن التجريبية",
        "phone": "0501234567",
        "user_type": "shipping"
    }
    
    try:
        # إنشاء المستخدم
        response = requests.post(f"{base_url}/user", json=user_data)
        print(f"إنشاء المستخدم: {response.status_code}")
        if response.status_code == 201:
            user_info = response.json()
            print(f"تم إنشاء المستخدم: {user_info}")
            
            # إنشاء شركة الشحن
            shipping_data = {
                "user_id": user_info["id"],
                "company_name": "شركة الشحن السريع",
                "license_number": "SH123456",
                "pricing_model": "per_km",
                "base_rate": 5.0,
                "min_charge": 10.0,
                "service_areas": ["الرياض", "جدة", "الدمام"],
                "vehicle_types": ["شاحنة صغيرة", "فان"]
            }
            
            shipping_response = requests.post(f"{base_url}/shipping/companies", json=shipping_data)
            print(f"إنشاء شركة الشحن: {shipping_response.status_code}")
            if shipping_response.status_code == 201:
                print(f"تم إنشاء شركة الشحن: {shipping_response.json()}")
            else:
                print(f"خطأ في إنشاء شركة الشحن: {shipping_response.text}")
        else:
            print(f"خطأ في إنشاء المستخدم: {response.text}")
            
    except Exception as e:
        print(f"خطأ في الاتصال: {e}")

if __name__ == "__main__":
    test_shipping_user()