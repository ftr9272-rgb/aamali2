#!/usr/bin/env python
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask
from src.models.user import db, User
from src.models.shipping import ShippingCompany

# إنشاء تطبيق Flask مؤقت لقاعدة البيانات
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), '..', 'src', 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

def create_shipping_user():
    with app.app_context():
        # التحقق من وجود المستخدم مسبقاً
        existing_user = User.query.filter_by(username='shipping_test').first()
        if existing_user:
            print("مستخدم شركة الشحن موجود مسبقاً")
            if existing_user.shipping:
                print("شركة الشحن مربوطة بالمستخدم بنجاح")
            else:
                print("المستخدم موجود لكن شركة الشحن غير مربوطة")
            return

        # إنشاء مستخدم جديد لشركة الشحن
        user = User(
            username='shipping_test',
            email='shipping@test.com',
            full_name='شركة الشحن التجريبية',
            phone='0501234567',
            user_type='shipping'
        )
        user.set_password('123456')
        
        db.session.add(user)
        db.session.flush()  # للحصول على user.id
        
        # إنشاء شركة الشحن
        shipping_company = ShippingCompany(
            user_id=user.id,
            company_name='شركة الشحن السريع',
            license_number='SH123456',
            pricing_model='per_km',
            base_rate=5.0,
            min_charge=10.0,
            max_weight=1000.0,
            max_distance=500.0,
            is_verified=True,
            is_active=True
        )
        shipping_company.set_service_areas(['الرياض', 'جدة', 'الدمام'])
        shipping_company.set_vehicle_types(['شاحنة صغيرة', 'فان', 'دراجة نارية'])
        
        db.session.add(shipping_company)
        db.session.commit()
        
        print("تم إنشاء مستخدم شركة الشحن بنجاح!")
        print(f"Username: {user.username}")
        print(f"Company: {shipping_company.company_name}")
        print(f"User ID: {user.id}")
        print(f"Shipping Company ID: {shipping_company.id}")

if __name__ == '__main__':
    create_shipping_user()