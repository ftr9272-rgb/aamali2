"""
ملف لإدخال بيانات تجريبية للتاجر
"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.models.supplier import *
from src.models.merchant import *
from datetime import datetime, date, timedelta
import uuid

def create_merchant_sample_data():
    """إنشاء بيانات تجريبية للتاجر"""
    
    # إنشاء مستخدم تاجر تجريبي
    merchant_user = User(
        username='merchant_demo',
        email='merchant@demo.com',
        full_name='متجر الأسواق الحديثة',
        phone='+966502345678',
        user_type='merchant',
        is_active=True
    )
    merchant_user.set_password('123456')
    db.session.add(merchant_user)
    db.session.flush()
    
    # إنشاء ملف التاجر
    merchant = Merchant(
        user_id=merchant_user.id,
        store_name='متجر الأسواق الحديثة',
        store_address='الرياض، حي العليا، شارع الملك فهد',
        store_type='سوبر ماركت',
        tax_number='987654321',
        commercial_license='CR-54321',
        description='متجر حديث يقدم جميع المواد الغذائية والاستهلاكية',
        rating=4.3,
        total_purchases=85,
        total_spent=125000.00,
        preferred_payment_method='bank_transfer',
        credit_limit=50000.00
    )
    db.session.add(merchant)
    db.session.flush()
    
    # إنشاء مستخدم شركة شحن تجريبية
    shipping_user = User(
        username='shipping_demo',
        email='shipping@demo.com',
        full_name='شركة التوصيل السريع',
        phone='+966503456789',
        user_type='shipping',
        is_active=True
    )
    shipping_user.set_password('123456')
    db.session.add(shipping_user)
    db.session.flush()
    
    # إنشاء ملف شركة الشحن
    shipping_company = ShippingCompany(
        user_id=shipping_user.id,
        company_name='شبكة التوصيل السريع',
        license_number='SL-12345',
        rating=4.7,
        total_deliveries=1250,
        pricing_model='per_km',
        base_rate=25.0,
        min_charge=2.0
    )

    # إعداد مناطق التغطية وأنواع المركبات (يُخزنان كـ JSON عبر الدوال المساعدة)
    shipping_company.set_service_areas(['الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة'])
    shipping_company.set_vehicle_types(['شاحنة صغيرة', 'شاحنة متوسطة', 'شاحنة كبيرة'])
    
    db.session.add(shipping_company)
    db.session.flush()
    
    # الحصول على المورد الموجود
    supplier = Supplier.query.first()
    if not supplier:
        print("لا يوجد مورد في قاعدة البيانات. يرجى تشغيل seed_data.py أولاً")
        return
    
    # إضافة المورد إلى المفضلة
    favorite_supplier = FavoriteSupplier(
        merchant_id=merchant.id,
        supplier_id=supplier.id,
        notes='مورد موثوق وجودة عالية'
    )
    db.session.add(favorite_supplier)
    
    # إنشاء طلبات عروض أسعار تجريبية
    quotation_requests_data = [
        {
            'title': 'طلب عرض سعر للمواد الغذائية الأساسية',
            'description': 'نحتاج عرض سعر شامل للمواد الغذائية الأساسية لتجديد مخزون المتجر',
            'delivery_date_required': date.today() + timedelta(days=10),
            'delivery_address': 'متجر الأسواق الحديثة، الرياض، حي العليا',
            'status': 'sent',
            'items': [
                {
                    'product_name': 'أرز بسمتي فاخر',
                    'description': 'أرز بسمتي عالي الجودة',
                    'quantity_needed': 100,
                    'unit': 'كيس 5 كيلو',
                    'max_price': 30.00,
                    'specifications': 'يفضل الأرز الهندي الأصلي'
                },
                {
                    'product_name': 'زيت زيتون بكر ممتاز',
                    'description': 'زيت زيتون طبيعي 100%',
                    'quantity_needed': 50,
                    'unit': 'زجاجة 500 مل',
                    'max_price': 50.00,
                    'specifications': 'يفضل المنشأ الإسباني أو الإيطالي'
                }
            ]
        },
        {
            'title': 'طلب عرض سعر للمنتجات العضوية',
            'description': 'طلب عرض سعر للمنتجات العضوية والطبيعية',
            'delivery_date_required': date.today() + timedelta(days=15),
            'delivery_address': 'متجر الأسواق الحديثة، الرياض، حي العليا',
            'status': 'draft',
            'items': [
                {
                    'product_name': 'عسل طبيعي',
                    'description': 'عسل طبيعي من المناحل المحلية',
                    'quantity_needed': 30,
                    'unit': 'برطمان 1 كيلو',
                    'max_price': 90.00,
                    'specifications': 'يجب أن يكون العسل طبيعي 100% مع شهادة جودة'
                }
            ]
        }
    ]
    
    for req_data in quotation_requests_data:
        request_number = f"RFQ-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        
        quotation_request = QuotationRequest(
            merchant_id=merchant.id,
            request_number=request_number,
            title=req_data['title'],
            description=req_data['description'],
            delivery_date_required=req_data['delivery_date_required'],
            delivery_address=req_data['delivery_address'],
            status=req_data['status']
        )
        db.session.add(quotation_request)
        db.session.flush()
        
        for item_data in req_data['items']:
            item = QuotationRequestItem(
                request_id=quotation_request.id,
                **item_data
            )
            db.session.add(item)
    
    # إنشاء طلبات شراء تجريبية
    purchase_orders_data = [
        {
            'total_amount': 3500.00,
            'status': 'confirmed',
            'payment_status': 'paid',
            'payment_method': 'bank_transfer',
            'delivery_address': 'متجر الأسواق الحديثة، الرياض، حي العليا',
            'delivery_date_requested': date.today() + timedelta(days=5),
            'delivery_date_confirmed': date.today() + timedelta(days=5),
            'items': [
                {'product_name': 'أرز بسمتي فاخر', 'quantity': 50, 'unit_price': 25.50},
                {'product_name': 'زيت زيتون بكر ممتاز', 'quantity': 30, 'unit_price': 45.00},
                {'product_name': 'قهوة عربية مطحونة', 'quantity': 25, 'unit_price': 35.00}
            ]
        },
        {
            'total_amount': 2800.00,
            'status': 'shipped',
            'payment_status': 'partial',
            'payment_method': 'credit_card',
            'delivery_address': 'متجر الأسواق الحديثة، الرياض، حي العليا',
            'delivery_date_requested': date.today() + timedelta(days=3),
            'delivery_date_confirmed': date.today() + timedelta(days=3),
            'items': [
                {'product_name': 'عسل طبيعي', 'quantity': 20, 'unit_price': 80.00},
                {'product_name': 'تمر مجهول فاخر', 'quantity': 10, 'unit_price': 120.00}
            ]
        },
        {
            'total_amount': 1575.00,
            'status': 'pending',
            'payment_status': 'pending',
            'payment_method': 'bank_transfer',
            'delivery_address': 'متجر الأسواق الحديثة، الرياض، حي العليا',
            'delivery_date_requested': date.today() + timedelta(days=7),
            'items': [
                {'product_name': 'أرز بسمتي فاخر', 'quantity': 25, 'unit_price': 25.50},
                {'product_name': 'قهوة عربية مطحونة', 'quantity': 30, 'unit_price': 35.00}
            ]
        }
    ]
    
    for i, order_data in enumerate(purchase_orders_data):
        order_number = f"PO-{datetime.now().strftime('%Y%m%d')}-{str(i+1).zfill(3)}"
        
        items_data = order_data.pop('items')
        
        purchase_order = PurchaseOrder(
            merchant_id=merchant.id,
            supplier_id=supplier.id,
            order_number=order_number,
            **order_data
        )
        db.session.add(purchase_order)
        db.session.flush()
        
        # إضافة عناصر الطلب
        for item_data in items_data:
            order_item = PurchaseOrderItem(
                purchase_order_id=purchase_order.id,
                product_name=item_data['product_name'],
                quantity=item_data['quantity'],
                unit_price=item_data['unit_price'],
                total_price=item_data['quantity'] * item_data['unit_price']
            )
            db.session.add(order_item)
        
        # إنشاء دفعات للطلبات المدفوعة
        if purchase_order.payment_status in ['paid', 'partial']:
            payment_amount = purchase_order.total_amount
            if purchase_order.payment_status == 'partial':
                payment_amount = purchase_order.total_amount * 0.6  # 60% من المبلغ
            
            payment_number = f"PAY-{datetime.now().strftime('%Y%m%d')}-{str(i+1).zfill(3)}"
            
            payment = Payment(
                purchase_order_id=purchase_order.id,
                payment_number=payment_number,
                amount=payment_amount,
                payment_method=purchase_order.payment_method,
                status='completed',
                transaction_id=f"TXN-{uuid.uuid4().hex[:8].upper()}"
            )
            db.session.add(payment)
    
    # إنشاء عروض شحن تجريبية
    shipping_quotes_data = [
        {
            'pickup_address': f'مستودع {supplier.company_name}، الرياض',
            'delivery_address': 'متجر الأسواق الحديثة، الرياض، حي العليا',
            'estimated_cost': 75.00,
            'estimated_delivery_time': '2-3 أيام',
            'service_type': 'standard',
            'status': 'pending',
            'package_details': {
                'weight': 150,
                'dimensions': {'length': 100, 'width': 80, 'height': 60},
                'fragile': False,
                'description': 'مواد غذائية متنوعة'
            }
        },
        {
            'pickup_address': f'مستودع {supplier.company_name}، الرياض',
            'delivery_address': 'متجر الأسواق الحديثة، الرياض، حي العليا',
            'estimated_cost': 120.00,
            'estimated_delivery_time': '1-2 أيام',
            'service_type': 'express',
            'status': 'accepted',
            'package_details': {
                'weight': 80,
                'dimensions': {'length': 60, 'width': 40, 'height': 30},
                'fragile': True,
                'description': 'عسل طبيعي وتمور'
            }
        }
    ]
    
    for i, quote_data in enumerate(shipping_quotes_data):
        quote_number = f"SQ-{datetime.now().strftime('%Y%m%d')}-{str(i+1).zfill(3)}"
        
        package_details = quote_data.pop('package_details')

        # Map seed fields to ShippingQuote model fields
        # pickup_city / delivery_city: use provided addresses (seed uses city names or addresses)
        pickup_city = quote_data.get('pickup_address')
        delivery_city = quote_data.get('delivery_address')
        distance = quote_data.get('distance', 0.0)

        # package details
        weight = package_details.get('weight')
        dims = package_details.get('dimensions', {})
        package_dimensions = f"{dims.get('length','') }x{dims.get('width','') }x{dims.get('height','') }".strip('x')
        package_type = 'general'

        shipping_quote = ShippingQuote(
            shipping_company_id=shipping_company.id,
            merchant_id=merchant.id,
            quote_number=quote_number,
            pickup_city=pickup_city or '',
            delivery_city=delivery_city or '',
            distance=distance,
            package_weight=weight or 0.0,
            package_dimensions=package_dimensions or None,
            package_type=package_type,
            service_type=quote_data.get('service_type', 'standard'),
            pickup_date=datetime.utcnow().date(),
            delivery_date=None,
            quoted_price=quote_data.get('estimated_cost', 0.0),
            currency='SAR',
            valid_until=datetime.utcnow() + timedelta(days=7),
            status=quote_data.get('status', 'pending'),
            notes=package_details.get('description')
        )

        db.session.add(shipping_quote)
    
    # إنشاء تقارير تجريبية للتاجر
    merchant_reports_data = [
        {
            'report_type': 'purchases',
            'title': 'تقرير المشتريات الشهري',
            'description': 'تقرير شامل للمشتريات خلال الشهر الماضي',
            'date_from': date.today() - timedelta(days=30),
            'date_to': date.today(),
            'data': {
                'total_orders': 15,
                'total_spent': 52500.00,
                'average_order_value': 3500.00,
                'top_suppliers': [supplier.company_name],
                'orders_by_status': {
                    'delivered': 8,
                    'shipped': 4,
                    'pending': 3
                }
            }
        },
        {
            'report_type': 'payments',
            'title': 'تقرير المدفوعات الشهري',
            'description': 'تقرير المدفوعات والمستحقات',
            'date_from': date.today() - timedelta(days=30),
            'date_to': date.today(),
            'data': {
                'total_payments': 12,
                'total_amount_paid': 45000.00,
                'pending_payments': 7500.00,
                'payments_by_method': {
                    'bank_transfer': 8,
                    'credit_card': 4
                }
            }
        }
    ]
    
    for report_data in merchant_reports_data:
        report = MerchantReport(
            merchant_id=merchant.id,
            **{k: v for k, v in report_data.items() if k != 'data'}
        )
        report.set_data(report_data['data'])
        db.session.add(report)
    
    # إنشاء إعدادات تجريبية للتاجر
    merchant_settings_data = [
        {'setting_key': 'auto_approve_quotes', 'setting_value': 'false', 'setting_type': 'boolean'},
        {'setting_key': 'preferred_delivery_time', 'setting_value': 'morning', 'setting_type': 'string'},
        {'setting_key': 'max_order_amount', 'setting_value': '10000', 'setting_type': 'number'},
        {'setting_key': 'notification_preferences', 'setting_value': '{"email": true, "sms": false, "push": true}', 'setting_type': 'json'}
    ]
    
    for setting_data in merchant_settings_data:
        setting = Setting(
            user_id=merchant_user.id,
            **setting_data
        )
        db.session.add(setting)
    
    # إنشاء إشعارات تجريبية للتاجر
    merchant_notifications_data = [
        {
            'title': 'عرض سعر جديد',
            'message': f'تم استلام عرض سعر جديد من {supplier.company_name}',
            'type': 'info',
            'is_read': False
        },
        {
            'title': 'تم تأكيد الطلب',
            'message': 'تم تأكيد طلب الشراء PO-20250906-001',
            'type': 'success',
            'is_read': True
        },
        {
            'title': 'عرض شحن جديد',
            'message': f'تم استلام عرض شحن من {shipping_company.company_name}',
            'type': 'info',
            'is_read': False
        },
        {
            'title': 'تذكير دفع',
            'message': 'يوجد فاتورة مستحقة الدفع بقيمة 1575 ريال',
            'type': 'warning',
            'is_read': False
        }
    ]
    
    for notification_data in merchant_notifications_data:
        notification = Notification(
            user_id=merchant_user.id,
            **notification_data
        )
        db.session.add(notification)
    
    # حفظ جميع البيانات
    db.session.commit()
    print("تم إنشاء البيانات التجريبية للتاجر بنجاح!")
    print(f"اسم المستخدم للتاجر: {merchant_user.username}")
    print(f"كلمة المرور: 123456")
    print(f"البريد الإلكتروني: {merchant_user.email}")
    print(f"اسم المستخدم لشركة الشحن: {shipping_user.username}")
    print(f"كلمة المرور: 123456")
    print(f"البريد الإلكتروني: {shipping_user.email}")

if __name__ == '__main__':
    from src.main import app
    
    with app.app_context():
        # إنشاء البيانات التجريبية للتاجر
        create_merchant_sample_data()

