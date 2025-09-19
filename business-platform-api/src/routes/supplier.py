from flask import Blueprint, request, jsonify, session
from src.utils.jwt_utils import decode_token
from src.models.supplier import db, User, Supplier, Product, Quotation, QuotationItem, Order, Shipment, Driver, Partner, Report, Setting, Notification
from datetime import datetime, date
import uuid
import json

supplier_bp = Blueprint('supplier', __name__)

def require_supplier():
    """تحقق من أن المستخدم مورد إما عبر الجلسة أو عبر توكن JWT"""
    # First check session (legacy)
    if 'user_id' in session and session.get('user_type') == 'supplier':
        user = User.query.get(session['user_id'])
        if not user or not user.supplier:
            return jsonify({'error': 'ملف المورد غير موجود'}), 404
        return user.supplier

    # Then check Authorization: Bearer <token>
    auth = request.headers.get('Authorization', None)
    if not auth:
        return jsonify({'error': 'يجب تسجيل الدخول أولاً'}), 401

    parts = auth.split()
    if parts[0].lower() != 'bearer' or len(parts) != 2:
        return jsonify({'error': 'رأس Authorization غير صالح'}), 401

    token = parts[1]
    payload = decode_token(token)
    if not payload:
        return jsonify({'error': 'Token غير صالح أو منتهي'}), 401

    user_id = payload.get('sub')
    user_type = payload.get('type')
    if user_type != 'supplier':
        return jsonify({'error': 'هذه الخدمة متاحة للموردين فقط'}), 403

    user = User.query.get(user_id)
    if not user or not user.supplier:
        return jsonify({'error': 'ملف المورد غير موجود'}), 404

    return user.supplier

# ===== لوحة التحكم الرئيسية =====
@supplier_bp.route('/dashboard', methods=['GET'])
def dashboard():
    """Return a small dashboard summary for the authenticated supplier.
    Uses the helper require_supplier() (session or Bearer token).
    """
    try:
        supplier = require_supplier()
        if isinstance(supplier, tuple):
            return supplier

        # Basic stats
        total_products = Product.query.filter_by(supplier_id=supplier.id).count()
        total_quotations = Quotation.query.filter_by(supplier_id=supplier.id).count()
        total_orders = Order.query.filter_by(supplier_id=supplier.id).count()

        recent_products = Product.query.filter_by(supplier_id=supplier.id).order_by(Product.id.desc()).limit(5).all()

        return jsonify({
            'supplier': supplier.to_dict(),
            'total_products': total_products,
            'total_quotations': total_quotations,
            'total_orders': total_orders,
            'recent_products': [p.to_dict() for p in recent_products]
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@supplier_bp.route('/products', methods=['GET'])
def get_products():
    try:
        supplier = require_supplier()
        if isinstance(supplier, tuple):
            return supplier
        
        products = Product.query.filter_by(supplier_id=supplier.id).order_by(Product.name).all()
        
        return jsonify([p.to_dict() for p in products]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@supplier_bp.route('/products', methods=['POST'])
def create_product():
    try:
        supplier = require_supplier()
        if isinstance(supplier, tuple):
            return supplier
        
        data = request.get_json()
        
        required_fields = ['name', 'price']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'حقل {field} مطلوب'}), 400
        
        product = Product(
            supplier_id=supplier.id,
            name=data['name'],
            description=data.get('description'),
            category=data.get('category'),
            price=data['price'],
            stock_quantity=data.get('stock_quantity', 0),
            min_order_quantity=data.get('min_order_quantity', 1),
            unit=data.get('unit', 'piece')
        )
        
        if 'images' in data:
            product.set_images(data['images'])
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify({
            'message': 'تم إضافة المنتج بنجاح',
            'product': product.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@supplier_bp.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    try:
        supplier = require_supplier()
        if isinstance(supplier, tuple):
            return supplier
        
        product = Product.query.filter_by(id=product_id, supplier_id=supplier.id).first()
        if not product:
            return jsonify({'error': 'المنتج غير موجود'}), 404
        
        data = request.get_json()
        
        if 'name' in data:
            product.name = data['name']
        if 'description' in data:
            product.description = data['description']
        if 'category' in data:
            product.category = data['category']
        if 'price' in data:
            product.price = data['price']
        if 'stock_quantity' in data:
            product.stock_quantity = data['stock_quantity']
        if 'min_order_quantity' in data:
            product.min_order_quantity = data['min_order_quantity']
        if 'unit' in data:
            product.unit = data['unit']
        if 'images' in data:
            product.set_images(data['images'])
        if 'is_active' in data:
            product.is_active = data['is_active']
        
        product.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'تم تحديث المنتج بنجاح',
            'product': product.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@supplier_bp.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        supplier = require_supplier()
        if isinstance(supplier, tuple):
            return supplier
        
        product = Product.query.filter_by(id=product_id, supplier_id=supplier.id).first()
        if not product:
            return jsonify({'error': 'المنتج غير موجود'}), 404
        
        db.session.delete(product)
        db.session.commit()
        
        return jsonify({'message': 'تم حذف المنتج بنجاح'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ===== إدارة عروض الأسعار =====
@supplier_bp.route('/quotations', methods=['GET'])
def get_quotations():
    try:
        supplier = require_supplier()
        if isinstance(supplier, tuple):
            return supplier
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status')
        
        query = Quotation.query.filter_by(supplier_id=supplier.id)
        if status:
            query = query.filter_by(status=status)
        
        quotations = query.order_by(Quotation.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'quotations': [quotation.to_dict() for quotation in quotations.items],
            'total': quotations.total,
            'pages': quotations.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@supplier_bp.route('/quotations', methods=['POST'])
def create_quotation():
    try:
        supplier = require_supplier()
        if isinstance(supplier, tuple):
            return supplier
        
        data = request.get_json()
        
        required_fields = ['title', 'items']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'حقل {field} مطلوب'}), 400
        
        # إنشاء رقم عرض السعر
        quotation_number = f"Q-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        
        # حساب المجموع الكلي
        total_amount = 0
        for item in data['items']:
            total_amount += float(item['quantity']) * float(item['unit_price'])
        
        quotation = Quotation(
            supplier_id=supplier.id,
            quotation_number=quotation_number,
            title=data['title'],
            description=data.get('description'),
            total_amount=total_amount,
            currency=data.get('currency', 'SAR'),
            valid_until=datetime.strptime(data['valid_until'], '%Y-%m-%d').date() if data.get('valid_until') else None,
            notes=data.get('notes'),
            merchant_id=data.get('merchant_id')
        )
        
        db.session.add(quotation)
        db.session.flush()  # للحصول على ID
        
        # إضافة العناصر
        for item_data in data['items']:
            item = QuotationItem(
                quotation_id=quotation.id,
                product_id=item_data.get('product_id'),
                product_name=item_data['product_name'],
                description=item_data.get('description'),
                quantity=item_data['quantity'],
                unit_price=item_data['unit_price'],
                total_price=float(item_data['quantity']) * float(item_data['unit_price'])
            )
            db.session.add(item)
        
        db.session.commit()
        
        return jsonify({
            'message': 'تم إنشاء عرض السعر بنجاح',
            'quotation': quotation.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@supplier_bp.route('/quotations/<int:quotation_id>/status', methods=['PUT'])
def update_quotation_status(quotation_id):
    try:
        supplier = require_supplier()
        if isinstance(supplier, tuple):
            return supplier
        
        quotation = Quotation.query.filter_by(id=quotation_id, supplier_id=supplier.id).first()
        if not quotation:
            return jsonify({'error': 'عرض السعر غير موجود'}), 404
        
        data = request.get_json()
        if 'status' not in data:
            return jsonify({'error': 'حالة عرض السعر مطلوبة'}), 400
        
        quotation.status = data['status']
        quotation.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'تم تحديث حالة عرض السعر بنجاح',
            'quotation': quotation.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ===== إدارة الطلبات والشحنات =====
@supplier_bp.route('/orders', methods=['GET'])
def get_orders():
    try:
        supplier = require_supplier()
        if isinstance(supplier, tuple):
            return supplier
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status')
        
        query = Order.query.filter_by(supplier_id=supplier.id)
        if status:
            query = query.filter_by(status=status)
        
        orders = query.order_by(Order.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'orders': [order.to_dict() for order in orders.items],
            'total': orders.total,
            'pages': orders.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@supplier_bp.route('/orders/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    try:
        supplier = require_supplier()
        if isinstance(supplier, tuple):
            return supplier
        
        order = Order.query.filter_by(id=order_id, supplier_id=supplier.id).first()
        if not order:
            return jsonify({'error': 'الطلب غير موجود'}), 404
        
        data = request.get_json()
        if 'status' not in data:
            return jsonify({'error': 'حالة الطلب مطلوبة'}), 400
        
        order.status = data['status']
        order.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'تم تحديث حالة الطلب بنجاح',
            'order': order.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@supplier_bp.route('/shipments', methods=['GET'])
def get_shipments():
    try:
        supplier = require_supplier()
        if isinstance(supplier, tuple):
            return supplier
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        shipments = Shipment.query.join(Order).filter(
            Order.supplier_id == supplier.id
        ).order_by(Shipment.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'shipments': [shipment.to_dict() for shipment in shipments.items],
            'total': shipments.total,
            'pages': shipments.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@supplier_bp.route('/shipments/<int:shipment_id>', methods=['PUT'])
def update_shipment(shipment_id):
    try:
        supplier = require_supplier()
        if isinstance(supplier, tuple):
            return supplier
        
        shipment = Shipment.query.join(Order).filter(
            Shipment.id == shipment_id,
            Order.supplier_id == supplier.id
        ).first()
        
        if not shipment:
            return jsonify({'error': 'الشحنة غير موجودة'}), 404
        
        data = request.get_json()
        
        if 'status' in data:
            shipment.status = data['status']
        if 'driver_id' in data:
            shipment.driver_id = data['driver_id']
        if 'pickup_date' in data:
            shipment.pickup_date = datetime.fromisoformat(data['pickup_date'])
        if 'delivery_date' in data:
            shipment.delivery_date = datetime.fromisoformat(data['delivery_date'])
        if 'estimated_delivery' in data:
            shipment.estimated_delivery = datetime.fromisoformat(data['estimated_delivery'])
        if 'notes' in data:
            shipment.notes = data['notes']
        
        shipment.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'تم تحديث الشحنة بنجاح',
            'shipment': shipment.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ===== إدارة السائقين =====
@supplier_bp.route('/drivers', methods=['GET'])
def get_drivers():
    try:
        supplier = require_supplier()
        if isinstance(supplier, tuple):
            return supplier
        
        drivers = Driver.query.filter_by(supplier_id=supplier.id).all()
        
        return jsonify({
            'drivers': [driver.to_dict() for driver in drivers]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@supplier_bp.route('/drivers', methods=['POST'])
def create_driver():
    try:
        supplier = require_supplier()
        if isinstance(supplier, tuple):
            return supplier
        
        data = request.get_json()
        
        required_fields = ['name', 'phone']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'حقل {field} مطلوب'}), 400
        
        driver = Driver(
            supplier_id=supplier.id,
            name=data['name'],
            phone=data['phone'],
            email=data.get('email'),
            license_number=data.get('license_number'),
            vehicle_type=data.get('vehicle_type'),
            vehicle_plate=data.get('vehicle_plate')
        )
        
        db.session.add(driver)
        db.session.commit()
        
        return jsonify({
            'message': 'تم إضافة السائق بنجاح',
            'driver': driver.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@supplier_bp.route('/drivers/<int:driver_id>', methods=['PUT'])
def update_driver(driver_id):
    try:
        supplier = require_supplier()
        if isinstance(supplier, tuple):
            return supplier
        
        driver = Driver.query.filter_by(id=driver_id, supplier_id=supplier.id).first()
        if not driver:
            return jsonify({'error': 'السائق غير موجود'}), 404
        
        data = request.get_json()
        
        if 'name' in data:
            driver.name = data['name']
        if 'phone' in data:
            driver.phone = data['phone']
        if 'email' in data:
            driver.email = data['email']
        if 'license_number' in data:
            driver.license_number = data['license_number']
        if 'vehicle_type' in data:
            driver.vehicle_type = data['vehicle_type']
        if 'vehicle_plate' in data:
            driver.vehicle_plate = data['vehicle_plate']
        if 'is_active' in data:
            driver.is_active = data['is_active']
        
        driver.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'تم تحديث بيانات السائق بنجاح',
            'driver': driver.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ===== إدارة الشركاء =====
@supplier_bp.route('/partners', methods=['GET'])
def get_partners():
    try:
        supplier = require_supplier()
        if isinstance(supplier, tuple):
            return supplier
        
        partners = Partner.query.filter_by(supplier_id=supplier.id).all()
        
        return jsonify({
            'partners': [partner.to_dict() for partner in partners]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@supplier_bp.route('/partners', methods=['POST'])
def create_partner():
    try:
        supplier = require_supplier()
        if isinstance(supplier, tuple):
            return supplier
        
        data = request.get_json()
        
        required_fields = ['partner_name', 'partner_type']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'حقل {field} مطلوب'}), 400
        
        partner = Partner(
            supplier_id=supplier.id,
            partner_name=data['partner_name'],
            partner_type=data['partner_type'],
            contact_person=data.get('contact_person'),
            phone=data.get('phone'),
            email=data.get('email'),
            address=data.get('address'),
            contract_start=datetime.strptime(data['contract_start'], '%Y-%m-%d').date() if data.get('contract_start') else None,
            contract_end=datetime.strptime(data['contract_end'], '%Y-%m-%d').date() if data.get('contract_end') else None,
            notes=data.get('notes')
        )
        
        db.session.add(partner)
        db.session.commit()
        
        return jsonify({
            'message': 'تم إضافة الشريك بنجاح',
            'partner': partner.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ===== التقارير =====
@supplier_bp.route('/reports', methods=['GET'])
def get_reports():
    try:
        supplier = require_supplier()
        if isinstance(supplier, tuple):
            return supplier
        
        reports = Report.query.filter_by(supplier_id=supplier.id).order_by(Report.created_at.desc()).all()
        
        return jsonify({
            'reports': [report.to_dict() for report in reports]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@supplier_bp.route('/reports/generate', methods=['POST'])
def generate_report():
    try:
        supplier = require_supplier()
        if isinstance(supplier, tuple):
            return supplier
        
        data = request.get_json()
        
        required_fields = ['report_type', 'title']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'حقل {field} مطلوب'}), 400
        
        # إنشاء بيانات التقرير حسب النوع
        report_data = {}
        
        if data['report_type'] == 'sales':
            # تقرير المبيعات
            orders = Order.query.filter_by(supplier_id=supplier.id).all()
            report_data = {
                'total_orders': len(orders),
                'total_revenue': sum([float(order.total_amount) for order in orders]),
                'orders_by_status': {}
            }
            
        elif data['report_type'] == 'inventory':
            # تقرير المخزون
            products = Product.query.filter_by(supplier_id=supplier.id).all()
            report_data = {
                'total_products': len(products),
                'low_stock_products': len([p for p in products if p.stock_quantity < 10]),
                'out_of_stock_products': len([p for p in products if p.stock_quantity == 0])
            }
        
        report = Report(
            supplier_id=supplier.id,
            report_type=data['report_type'],
            title=data['title'],
            description=data.get('description'),
            date_from=datetime.strptime(data['date_from'], '%Y-%m-%d').date() if data.get('date_from') else None,
            date_to=datetime.strptime(data['date_to'], '%Y-%m-%d').date() if data.get('date_to') else None
        )
        report.set_data(report_data)
        
        db.session.add(report)
        db.session.commit()
        
        return jsonify({
            'message': 'تم إنشاء التقرير بنجاح',
            'report': report.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ===== الإعدادات =====
@supplier_bp.route('/settings', methods=['GET'])
def get_settings():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'يجب تسجيل الدخول أولاً'}), 401
        
        settings = Setting.query.filter_by(user_id=session['user_id']).all()
        
        settings_dict = {}
        for setting in settings:
            settings_dict[setting.setting_key] = setting.get_value()
        
        return jsonify({'settings': settings_dict}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@supplier_bp.route('/settings', methods=['POST'])
def update_settings():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'يجب تسجيل الدخول أولاً'}), 401
        
        data = request.get_json()
        
        for key, value in data.items():
            setting = Setting.query.filter_by(user_id=session['user_id'], setting_key=key).first()
            
            if setting:
                setting.set_value(value)
                setting.updated_at = datetime.utcnow()
            else:
                setting = Setting(
                    user_id=session['user_id'],
                    setting_key=key,
                    setting_type='string'
                )
                setting.set_value(value)
                db.session.add(setting)
        
        db.session.commit()
        
        return jsonify({'message': 'تم تحديث الإعدادات بنجاح'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ===== الإشعارات =====
@supplier_bp.route('/notifications', methods=['GET'])
def get_notifications():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'يجب تسجيل الدخول أولاً'}), 401
        
        notifications = Notification.query.filter_by(user_id=session['user_id']).order_by(Notification.created_at.desc()).limit(20).all()
        
        return jsonify({
            'notifications': [notification.to_dict() for notification in notifications]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@supplier_bp.route('/notifications/<int:notification_id>/read', methods=['PUT'])
def mark_notification_read(notification_id):
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'يجب تسجيل الدخول أولاً'}), 401
        
        notification = Notification.query.filter_by(id=notification_id, user_id=session['user_id']).first()
        if not notification:
            return jsonify({'error': 'الإشعار غير موجود'}), 404
        
        notification.is_read = True
        db.session.commit()
        
        return jsonify({'message': 'تم تحديد الإشعار كمقروء'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

