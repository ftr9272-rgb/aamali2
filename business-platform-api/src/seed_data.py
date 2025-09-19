"""
ملف لإدخال بيانات تجريبية لاختبار النظام
"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.models.supplier import *
from datetime import datetime, date, timedelta
import uuid

def create_sample_data():
    """إنشاء بيانات تجريبية للنظام"""
    
    # إنشاء مستخدم مورد تجريبي
    user = User(
        username='supplier_demo',
        email='supplier@demo.com',
        full_name='شركة الإمدادات المتقدمة',
        phone='+966501234567',
        user_type='supplier',
        is_active=True
    )
    user.set_password('123456')
    db.session.add(user)
    db.session.flush()
    
    # إنشاء ملف المورد
    supplier = Supplier(
        user_id=user.id,
        company_name='شركة الإمدادات المتقدمة',
        company_address='الرياض، المملكة العربية السعودية',
        tax_number='123456789',
        business_license='CR-12345',
        description='شركة متخصصة في توريد المواد الغذائية والمنتجات الاستهلاكية',
        rating=4.5,
        total_orders=150
    )
    db.session.add(supplier)
    db.session.flush()
    
    # إنشاء منتجات تجريبية
    products_data = [
        {
            'name': 'أرز بسمتي فاخر',
            'description': 'أرز بسمتي عالي الجودة من الهند',
            'category': 'مواد غذائية',
            'price': 25.50,
            'stock_quantity': 500,
            'unit': 'كيس 5 كيلو'
        },
        {
            'name': 'زيت زيتون بكر ممتاز',
            'description': 'زيت زيتون طبيعي 100% من إسبانيا',
            'category': 'مواد غذائية',
            'price': 45.00,
            'stock_quantity': 200,
            'unit': 'زجاجة 500 مل'
        },
        {
            'name': 'عسل طبيعي',
            'description': 'عسل طبيعي من المناحل المحلية',
            'category': 'مواد غذائية',
            'price': 80.00,
            'stock_quantity': 100,
            'unit': 'برطمان 1 كيلو'
        },
        {
            'name': 'تمر مجهول فاخر',
            'description': 'تمر مجهول طازج من المدينة المنورة',
            'category': 'مواد غذائية',
            'price': 120.00,
            'stock_quantity': 75,
            'unit': 'علبة 2 كيلو'
        },
        {
            'name': 'قهوة عربية مطحونة',
            'description': 'قهوة عربية أصيلة مطحونة طازجة',
            'category': 'مشروبات',
            'price': 35.00,
            'stock_quantity': 300,
            'unit': 'كيس 500 جرام'
        }
    ]
    
    products = []
    for product_data in products_data:
        product = Product(
            supplier_id=supplier.id,
            **product_data
        )
        db.session.add(product)
        products.append(product)
    
    db.session.flush()
    
    # إنشاء عروض أسعار تجريبية
    quotations_data = [
        {
            'title': 'عرض سعر للمواد الغذائية الأساسية',
            'description': 'عرض شامل للمواد الغذائية الأساسية للمطاعم',
            'status': 'sent',
            'valid_until': date.today() + timedelta(days=30),
            'items': [
                {'product': products[0], 'quantity': 50, 'unit_price': 25.50},
                {'product': products[1], 'quantity': 30, 'unit_price': 45.00},
                {'product': products[4], 'quantity': 20, 'unit_price': 35.00}
            ]
        },
        {
            'title': 'عرض سعر للمنتجات الفاخرة',
            'description': 'عرض خاص للمنتجات الفاخرة والعضوية',
            'status': 'draft',
            'valid_until': date.today() + timedelta(days=15),
            'items': [
                {'product': products[2], 'quantity': 25, 'unit_price': 80.00},
                {'product': products[3], 'quantity': 15, 'unit_price': 120.00}
            ]
        }
    ]
    
    for quotation_data in quotations_data:
        quotation_number = f"Q-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        
        total_amount = sum([item['quantity'] * item['unit_price'] for item in quotation_data['items']])
        
        quotation = Quotation(
            supplier_id=supplier.id,
            quotation_number=quotation_number,
            title=quotation_data['title'],
            description=quotation_data['description'],
            total_amount=total_amount,
            status=quotation_data['status'],
            valid_until=quotation_data['valid_until']
        )
        db.session.add(quotation)
        db.session.flush()
        
        for item_data in quotation_data['items']:
            item = QuotationItem(
                quotation_id=quotation.id,
                product_id=item_data['product'].id,
                product_name=item_data['product'].name,
                quantity=item_data['quantity'],
                unit_price=item_data['unit_price'],
                total_price=item_data['quantity'] * item_data['unit_price']
            )
            db.session.add(item)
    
    # إنشاء طلبات تجريبية
    orders_data = [
        {
            'status': 'confirmed',
            'total_amount': 2625.00,
            'shipping_address': 'الرياض، حي الملك فهد، شارع الملك عبدالعزيز',
            'delivery_date': date.today() + timedelta(days=3)
        },
        {
            'status': 'shipped',
            'total_amount': 3800.00,
            'shipping_address': 'جدة، حي الروضة، شارع التحلية',
            'delivery_date': date.today() + timedelta(days=2)
        },
        {
            'status': 'delivered',
            'total_amount': 1575.00,
            'shipping_address': 'الدمام، حي الفيصلية، شارع الأمير محمد بن فهد',
            'delivery_date': date.today() - timedelta(days=1)
        }
    ]
    
    for i, order_data in enumerate(orders_data):
        order_number = f"ORD-{datetime.now().strftime('%Y%m%d')}-{str(i+1).zfill(3)}"
        
        order = Order(
            order_number=order_number,
            supplier_id=supplier.id,
            merchant_id=100 + i,  # معرف تاجر وهمي
            **order_data
        )
        db.session.add(order)
        db.session.flush()
        
        # إنشاء شحنة للطلب
        tracking_number = f"TRK-{uuid.uuid4().hex[:8].upper()}"
        
        shipment_status = 'delivered' if order.status == 'delivered' else 'in_transit'
        
        shipment = Shipment(
            order_id=order.id,
            tracking_number=tracking_number,
            pickup_address='مستودع شركة الإمدادات المتقدمة، الرياض',
            delivery_address=order.shipping_address,
            status=shipment_status,
            shipping_cost=50.00,
            estimated_delivery=datetime.combine(order.delivery_date, datetime.min.time()) if order.delivery_date else None
        )
        
        if order.status == 'delivered':
            shipment.delivery_date = datetime.combine(order.delivery_date, datetime.min.time())
        
        db.session.add(shipment)
    
    # إنشاء سائقين تجريبيين
    drivers_data = [
        {
            'name': 'أحمد محمد السعيد',
            'phone': '+966501111111',
            'email': 'ahmed.driver@demo.com',
            'license_number': 'DL-123456',
            'vehicle_type': 'شاحنة صغيرة',
            'vehicle_plate': 'أ ب ج 1234',
            'rating': 4.8,
            'total_deliveries': 45
        },
        {
            'name': 'محمد عبدالله الأحمد',
            'phone': '+966502222222',
            'email': 'mohammed.driver@demo.com',
            'license_number': 'DL-789012',
            'vehicle_type': 'فان',
            'vehicle_plate': 'د هـ و 5678',
            'rating': 4.6,
            'total_deliveries': 38
        },
        {
            'name': 'عبدالرحمن صالح المطيري',
            'phone': '+966503333333',
            'license_number': 'DL-345678',
            'vehicle_type': 'شاحنة متوسطة',
            'vehicle_plate': 'ز ح ط 9012',
            'rating': 4.9,
            'total_deliveries': 52
        }
    ]
    
    for driver_data in drivers_data:
        driver = Driver(
            supplier_id=supplier.id,
            **driver_data
        )
        db.session.add(driver)
    
    # إنشاء شركاء تجريبيين
    partners_data = [
        {
            'partner_name': 'شركة الشحن السريع',
            'partner_type': 'shipping_company',
            'contact_person': 'خالد العتيبي',
            'phone': '+966504444444',
            'email': 'contact@fastshipping.com',
            'address': 'الرياض، المنطقة الصناعية الثانية',
            'contract_start': date.today() - timedelta(days=365),
            'contract_end': date.today() + timedelta(days=365)
        },
        {
            'partner_name': 'مستودعات الخليج',
            'partner_type': 'warehouse',
            'contact_person': 'سعد الدوسري',
            'phone': '+966505555555',
            'email': 'info@gulfwarehouses.com',
            'address': 'جدة، المنطقة الاقتصادية',
            'contract_start': date.today() - timedelta(days=180),
            'contract_end': date.today() + timedelta(days=545)
        }
    ]
    
    for partner_data in partners_data:
        partner = Partner(
            supplier_id=supplier.id,
            **partner_data
        )
        db.session.add(partner)
    
    # إنشاء تقارير تجريبية
    reports_data = [
        {
            'report_type': 'sales',
            'title': 'تقرير المبيعات الشهري',
            'description': 'تقرير شامل للمبيعات خلال الشهر الماضي',
            'date_from': date.today() - timedelta(days=30),
            'date_to': date.today(),
            'data': {
                'total_orders': 25,
                'total_revenue': 45000.00,
                'average_order_value': 1800.00,
                'top_products': ['أرز بسمتي فاخر', 'زيت زيتون بكر ممتاز']
            }
        },
        {
            'report_type': 'inventory',
            'title': 'تقرير المخزون الحالي',
            'description': 'حالة المخزون لجميع المنتجات',
            'date_from': date.today(),
            'date_to': date.today(),
            'data': {
                'total_products': 5,
                'low_stock_products': 1,
                'out_of_stock_products': 0,
                'total_value': 125000.00
            }
        }
    ]
    
    for report_data in reports_data:
        report = Report(
            supplier_id=supplier.id,
            **{k: v for k, v in report_data.items() if k != 'data'}
        )
        report.set_data(report_data['data'])
        db.session.add(report)
    
    # إنشاء إعدادات تجريبية
    settings_data = [
        {'setting_key': 'notifications_email', 'setting_value': 'true', 'setting_type': 'boolean'},
        {'setting_key': 'notifications_sms', 'setting_value': 'false', 'setting_type': 'boolean'},
        {'setting_key': 'default_currency', 'setting_value': 'SAR', 'setting_type': 'string'},
        {'setting_key': 'auto_accept_orders', 'setting_value': 'false', 'setting_type': 'boolean'},
        {'setting_key': 'working_hours', 'setting_value': '{"start": "08:00", "end": "18:00"}', 'setting_type': 'json'}
    ]
    
    for setting_data in settings_data:
        setting = Setting(
            user_id=user.id,
            **setting_data
        )
        db.session.add(setting)
    
    # إنشاء إشعارات تجريبية
    notifications_data = [
        {
            'title': 'طلب جديد',
            'message': 'تم استلام طلب جديد برقم ORD-20250906-001',
            'type': 'info',
            'is_read': False
        },
        {
            'title': 'تم تأكيد الطلب',
            'message': 'تم تأكيد الطلب ORD-20250906-002 من قبل التاجر',
            'type': 'success',
            'is_read': True
        },
        {
            'title': 'تحديث الشحنة',
            'message': 'تم تحديث حالة الشحنة TRK-ABC12345 إلى "في الطريق"',
            'type': 'info',
            'is_read': False
        }
    ]
    
    for notification_data in notifications_data:
        notification = Notification(
            user_id=user.id,
            **notification_data
        )
        db.session.add(notification)
    
    # حفظ جميع البيانات
    db.session.commit()
    print("تم إنشاء البيانات التجريبية بنجاح!")
    print(f"اسم المستخدم: {user.username}")
    print(f"كلمة المرور: 123456")
    print(f"البريد الإلكتروني: {user.email}")

if __name__ == '__main__':
    from src.main import app
    
    with app.app_context():
        # حذف البيانات الموجودة وإعادة إنشاء الجداول
        db.drop_all()
        db.create_all()
        
        # إنشاء البيانات التجريبية
        create_sample_data()

