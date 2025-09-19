#!/usr/bin/env python
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask
from src.models.user import db, User
from src.models.shipping import ShippingCompany

# Create temporary Flask app for database operations
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), '..', 'src', 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

def create_sample_data():
    with app.app_context():
        try:
            # Create sample shipping companies without user relationships for marketplace display
            sample_companies = [
                {
                    'user_id': 1,  # Will use dummy user ID
                    'company_name': 'شركة السرعة للنقل',
                    'license_number': 'SP001',
                    'service_areas': ['الرياض', 'جدة', 'الدمام'],
                    'vehicle_types': ['شاحنة صغيرة', 'فان'],
                    'rating': 4.8,
                    'total_deliveries': 1250,
                    'is_active': True
                },
                {
                    'user_id': 2,
                    'company_name': 'مؤسسة الأمان للشحن',
                    'license_number': 'AM002',
                    'service_areas': ['الرياض', 'المدينة المنورة', 'مكة المكرمة'],
                    'vehicle_types': ['شاحنة كبيرة', 'نقل ثقيل'],
                    'rating': 4.5,
                    'total_deliveries': 890,
                    'is_active': True
                },
                {
                    'user_id': 3,
                    'company_name': 'شركة الوفاء اللوجستية',
                    'license_number': 'WF003',
                    'service_areas': ['جدة', 'الطائف', 'الباحة'],
                    'vehicle_types': ['فان', 'دراجة نارية'],
                    'rating': 4.2,
                    'total_deliveries': 2100,
                    'is_active': True
                }
            ]
            
            for company_data in sample_companies:
                # Check if company already exists
                existing = ShippingCompany.query.filter_by(license_number=company_data['license_number']).first()
                if not existing:
                    company = ShippingCompany(
                        user_id=company_data['user_id'],
                        company_name=company_data['company_name'],
                        license_number=company_data['license_number'],
                        rating=company_data['rating'],
                        total_deliveries=company_data['total_deliveries'],
                        is_active=company_data['is_active']
                    )
                    company.set_service_areas(company_data['service_areas'])
                    company.set_vehicle_types(company_data['vehicle_types'])
                    
                    db.session.add(company)
                    print(f"✅ Added: {company_data['company_name']}")
                else:
                    print(f"⚠️  Already exists: {company_data['company_name']}")
            
            db.session.commit()
            print("✅ Sample shipping companies created successfully!")
            
        except Exception as e:
            print(f"❌ Error: {e}")
            db.session.rollback()

if __name__ == '__main__':
    create_sample_data()