from src.models.shipping import db, ShippingCompany, Shipment, ShippingQuote, Driver, ShipmentTracking
from src.models.supplier import User
from src.models.merchant import Merchant
from datetime import datetime, timedelta
import uuid

def seed_shipping_data():
    """إنشاء بيانات تجريبية لشركات الشحن"""
    
    # التحقق من وجود بيانات شحن مسبقاً
    if ShippingCompany.query.first():
        print("بيانات الشحن موجودة مسبقاً")
        return
    
    try:
        # إنشاء شركة شحن تجريبية
        shipping_company = ShippingCompany(
            user_id=3,  # shipping user from previous seed
            company_name='شركة التوصيل السريع',
            license_number='SH-2024-001',
            pricing_model='per_km',
            base_rate=5.0,
            min_charge=25.0,
            max_weight=500.0,
            max_distance=1000.0,
            rating=4.7,
            total_deliveries=156,
            is_verified=True,
            is_active=True
        )
        
        # إعداد مناطق الخدمة وأنواع المركبات
        shipping_company.set_service_areas([
            'الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة',
            'الطائف', 'تبوك', 'بريدة', 'خميس مشيط', 'حائل'
        ])
        
        shipping_company.set_vehicle_types([
            'شاحنة صغيرة', 'فان', 'دراجة نارية', 'سيارة صغيرة'
        ])
        
        db.session.add(shipping_company)
        db.session.flush()  # للحصول على ID
        
        # إنشاء سائقين
        drivers_data = [
            {
                'driver_name': 'محمد أحمد الغامدي',
                'driver_phone': '+966551234567',
                'driver_license': 'DL-001-2024',
                'vehicle_type': 'شاحنة صغيرة',
                'vehicle_plate': 'أ ب ج 1234',
                'vehicle_capacity': 1000.0,
                'current_location': 'الرياض',
                'rating': 4.8,
                'total_deliveries': 89
            },
            {
                'driver_name': 'عبدالله سعد المطيري',
                'driver_phone': '+966552345678',
                'driver_license': 'DL-002-2024',
                'vehicle_type': 'فان',
                'vehicle_plate': 'د هـ و 5678',
                'vehicle_capacity': 500.0,
                'current_location': 'جدة',
                'rating': 4.6,
                'total_deliveries': 67
            }
        ]
        
        for driver_data in drivers_data:
            driver = Driver(
                shipping_company_id=shipping_company.id,
                **driver_data
            )
            db.session.add(driver)
        
        # إنشاء شحنات تجريبية
        shipments_data = [
            {
                'tracking_number': f"SH{datetime.now().strftime('%Y%m%d')}001",
                'merchant_id': 2,  # merchant user
                'order_id': 1,
                'pickup_address': 'الرياض، حي النخيل، شارع الملك فهد، مبنى 123',
                'pickup_contact_name': 'أحمد محمد',
                'pickup_contact_phone': '+966501234567',
                'pickup_date': datetime.now() + timedelta(days=1),
                'pickup_time_slot': '09:00-12:00',
                'delivery_address': 'جدة، حي الصفا، شارع التحلية، مبنى 456',
                'delivery_contact_name': 'فاطمة علي',
                'delivery_contact_phone': '+966502345678',
                'delivery_date': datetime.now() + timedelta(days=3),
                'delivery_time_slot': '14:00-17:00',
                'package_description': 'أجهزة إلكترونية',
                'package_weight': 15.5,
                'package_dimensions': '50x40x30',
                'package_value': 5000.0,
                'quoted_price': 150.0,
                'actual_price': 150.0,
                'status': 'in_transit',
                'notes': 'يرجى التعامل بحذر - أجهزة حساسة',
                'special_instructions': 'التسليم للمستلم شخصياً فقط'
            },
            {
                'tracking_number': f"SH{datetime.now().strftime('%Y%m%d')}002",
                'merchant_id': 2,
                'order_id': 2,
                'pickup_address': 'الدمام، حي الفيصلية، شارع الأمير محمد، مبنى 789',
                'pickup_contact_name': 'سعد أحمد',
                'pickup_contact_phone': '+966503456789',
                'pickup_date': datetime.now() - timedelta(days=2),
                'pickup_time_slot': '10:00-13:00',
                'delivery_address': 'الرياض، حي العليا، شارع التخصصي، مبنى 321',
                'delivery_contact_name': 'نورا سعد',
                'delivery_contact_phone': '+966504567890',
                'delivery_date': datetime.now() - timedelta(days=1),
                'delivery_time_slot': '15:00-18:00',
                'package_description': 'أثاث مكتبي',
                'package_weight': 45.0,
                'package_dimensions': '120x80x75',
                'package_value': 3000.0,
                'quoted_price': 200.0,
                'actual_price': 200.0,
                'status': 'delivered',
                'notes': 'تم التسليم بنجاح',
                'delivered_at': datetime.now() - timedelta(days=1)
            }
        ]
        
        for shipment_data in shipments_data:
            shipment = Shipment(
                shipping_company_id=shipping_company.id,
                **shipment_data
            )
            db.session.add(shipment)
            db.session.flush()
            
            # إضافة تتبع للشحنة
            if shipment.status == 'in_transit':
                tracking_updates = [
                    {
                        'status': 'pending',
                        'description': 'تم إنشاء الشحنة',
                        'timestamp': shipment.created_at,
                        'created_by': 'system'
                    },
                    {
                        'status': 'confirmed',
                        'description': 'تم تأكيد الشحنة',
                        'timestamp': shipment.created_at + timedelta(hours=1),
                        'created_by': 'shipping_company'
                    },
                    {
                        'status': 'picked_up',
                        'location': 'الرياض',
                        'description': 'تم استلام الشحنة من المرسل',
                        'timestamp': shipment.pickup_date,
                        'created_by': 'driver'
                    },
                    {
                        'status': 'in_transit',
                        'location': 'على الطريق إلى جدة',
                        'description': 'الشحنة في الطريق',
                        'timestamp': datetime.now() - timedelta(hours=2),
                        'created_by': 'driver'
                    }
                ]
            else:  # delivered
                tracking_updates = [
                    {
                        'status': 'pending',
                        'description': 'تم إنشاء الشحنة',
                        'timestamp': shipment.created_at,
                        'created_by': 'system'
                    },
                    {
                        'status': 'confirmed',
                        'description': 'تم تأكيد الشحنة',
                        'timestamp': shipment.created_at + timedelta(hours=1),
                        'created_by': 'shipping_company'
                    },
                    {
                        'status': 'picked_up',
                        'location': 'الدمام',
                        'description': 'تم استلام الشحنة من المرسل',
                        'timestamp': shipment.pickup_date,
                        'created_by': 'driver'
                    },
                    {
                        'status': 'in_transit',
                        'location': 'على الطريق إلى الرياض',
                        'description': 'الشحنة في الطريق',
                        'timestamp': shipment.pickup_date + timedelta(hours=4),
                        'created_by': 'driver'
                    },
                    {
                        'status': 'out_for_delivery',
                        'location': 'الرياض - مركز التوزيع',
                        'description': 'الشحنة خرجت للتوصيل',
                        'timestamp': shipment.delivery_date - timedelta(hours=2),
                        'created_by': 'driver'
                    },
                    {
                        'status': 'delivered',
                        'location': 'الرياض، حي العليا',
                        'description': 'تم تسليم الشحنة بنجاح',
                        'timestamp': shipment.delivered_at,
                        'created_by': 'driver'
                    }
                ]
            
            for tracking_data in tracking_updates:
                tracking = ShipmentTracking(
                    shipment_id=shipment.id,
                    **tracking_data
                )
                db.session.add(tracking)
        
        # إنشاء عروض أسعار شحن
        quotes_data = [
            {
                'quote_number': f"SQ{datetime.now().strftime('%Y%m%d')}001",
                'merchant_id': 2,
                'pickup_city': 'الرياض',
                'delivery_city': 'جدة',
                'distance': 950.0,
                'package_weight': 25.0,
                'package_dimensions': '60x40x40',
                'package_type': 'إلكترونيات',
                'service_type': 'express',
                'pickup_date': (datetime.now() + timedelta(days=2)).date(),
                'delivery_date': (datetime.now() + timedelta(days=3)).date(),
                'quoted_price': 180.0,
                'valid_until': datetime.now() + timedelta(days=7),
                'status': 'sent',
                'notes': 'خدمة سريعة - التسليم خلال 24 ساعة',
                'sent_at': datetime.now() - timedelta(hours=2)
            },
            {
                'quote_number': f"SQ{datetime.now().strftime('%Y%m%d')}002",
                'merchant_id': 2,
                'pickup_city': 'الدمام',
                'delivery_city': 'الرياض',
                'distance': 400.0,
                'package_weight': 10.0,
                'package_dimensions': '30x30x20',
                'package_type': 'وثائق',
                'service_type': 'standard',
                'pickup_date': (datetime.now() + timedelta(days=1)).date(),
                'delivery_date': (datetime.now() + timedelta(days=2)).date(),
                'quoted_price': 75.0,
                'valid_until': datetime.now() + timedelta(days=5),
                'status': 'pending',
                'notes': 'شحنة عادية'
            }
        ]
        
        for quote_data in quotes_data:
            quote = ShippingQuote(
                shipping_company_id=shipping_company.id,
                **quote_data
            )
            db.session.add(quote)
        
        db.session.commit()
        print("تم إنشاء بيانات الشحن التجريبية بنجاح")
        
    except Exception as e:
        db.session.rollback()
        print(f"خطأ في إنشاء بيانات الشحن: {e}")

if __name__ == '__main__':
    from src.main import app
    with app.app_context():
        seed_shipping_data()

