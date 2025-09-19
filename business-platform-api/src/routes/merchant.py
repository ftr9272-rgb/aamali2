from flask import Blueprint, request, jsonify, session
from src.utils.jwt_utils import decode_token
from src.models.supplier import db, User, Supplier, Product, Quotation, QuotationItem
from src.models.merchant import Merchant, QuotationRequest, QuotationRequestItem, PurchaseOrder, PurchaseOrderItem, Payment, FavoriteSupplier, ShippingCompany, ShippingQuote, MerchantReport
from datetime import datetime, date, timedelta
import uuid
import json

merchant_bp = Blueprint('merchant', __name__)

def require_merchant():
    """تحقق من أن المستخدم تاجر ومسجل دخول"""
    # First check session (legacy)
    if 'user_id' in session and session.get('user_type') == 'merchant':
        user = User.query.get(session['user_id'])
        if not user or not user.merchant:
            return jsonify({'error': 'ملف التاجر غير موجود'}), 404
        return user.merchant

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
    if user_type != 'merchant':
        return jsonify({'error': 'هذه الخدمة متاحة للتجار فقط'}), 403

    user = User.query.get(user_id)
    if not user or not user.merchant:
        return jsonify({'error': 'ملف التاجر غير موجود'}), 404

    return user.merchant

# ===== لوحة التحكم الرئيسية =====
@merchant_bp.route('/dashboard', methods=['GET'])
def dashboard():
    try:
        merchant = require_merchant()
        if isinstance(merchant, tuple):  # خطأ
            return merchant
        
        # إحصائيات عامة
        total_orders = PurchaseOrder.query.filter_by(merchant_id=merchant.id).count()
        total_spent = db.session.query(db.func.sum(PurchaseOrder.total_amount)).filter_by(merchant_id=merchant.id).scalar() or 0
        pending_orders = PurchaseOrder.query.filter_by(merchant_id=merchant.id, status='pending').count()
        favorite_suppliers_count = FavoriteSupplier.query.filter_by(merchant_id=merchant.id).count()
        
        # الطلبات الحديثة
        recent_orders = PurchaseOrder.query.filter_by(merchant_id=merchant.id).order_by(PurchaseOrder.created_at.desc()).limit(5).all()
        
        # طلبات عروض الأسعار النشطة
        active_quotation_requests = QuotationRequest.query.filter_by(
            merchant_id=merchant.id,
            status='sent'
        ).limit(5).all()
        
        # عروض الأسعار المستلمة حديثاً
        recent_quotations = Quotation.query.filter_by(merchant_id=merchant.id).order_by(Quotation.created_at.desc()).limit(5).all()
        
        # المدفوعات المعلقة
        pending_payments = PurchaseOrder.query.filter_by(
            merchant_id=merchant.id,
            payment_status='pending'
        ).limit(5).all()
        
        return jsonify({
            'stats': {
                'total_orders': total_orders,
                'total_spent': float(total_spent),
                'pending_orders': pending_orders,
                'favorite_suppliers': favorite_suppliers_count
            },
            'recent_orders': [order.to_dict() for order in recent_orders],
            'active_quotation_requests': [req.to_dict() for req in active_quotation_requests],
            'recent_quotations': [quotation.to_dict() for quotation in recent_quotations],
            'pending_payments': [order.to_dict() for order in pending_payments]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===== تصفح المنتجات والموردين =====
@merchant_bp.route('/suppliers', methods=['GET'])
def get_suppliers():
    try:
        merchant = require_merchant()
        if isinstance(merchant, tuple):
            return merchant
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        search = request.args.get('search', '')
        category = request.args.get('category')
        
        query = Supplier.query.join(User).filter(User.is_active == True)
        
        if search:
            query = query.filter(
                db.or_(
                    Supplier.company_name.contains(search),
                    Supplier.description.contains(search)
                )
            )
        
        suppliers = query.order_by(Supplier.rating.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # إضافة معلومات المفضلة
        favorite_supplier_ids = [fs.supplier_id for fs in FavoriteSupplier.query.filter_by(merchant_id=merchant.id).all()]
        
        suppliers_data = []
        for supplier in suppliers.items:
            supplier_dict = supplier.to_dict()
            supplier_dict['is_favorite'] = supplier.id in favorite_supplier_ids
            supplier_dict['user'] = supplier.user.to_dict()
            suppliers_data.append(supplier_dict)
        
        return jsonify({
            'suppliers': suppliers_data,
            'total': suppliers.total,
            'pages': suppliers.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@merchant_bp.route('/suppliers/<int:supplier_id>/products', methods=['GET'])
def get_supplier_products(supplier_id):
    try:
        merchant = require_merchant()
        if isinstance(merchant, tuple):
            return merchant
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', '')
        category = request.args.get('category')
        
        query = Product.query.filter_by(supplier_id=supplier_id, is_active=True)
        
        if search:
            query = query.filter(
                db.or_(
                    Product.name.contains(search),
                    Product.description.contains(search)
                )
            )
        
        if category:
            query = query.filter_by(category=category)
        
        products = query.order_by(Product.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'products': [product.to_dict() for product in products.items],
            'total': products.total,
            'pages': products.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@merchant_bp.route('/products/search', methods=['GET'])
def search_products():
    try:
        merchant = require_merchant()
        if isinstance(merchant, tuple):
            return merchant
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', '')
        category = request.args.get('category')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        
        query = Product.query.filter_by(is_active=True)
        
        if search:
            query = query.filter(
                db.or_(
                    Product.name.contains(search),
                    Product.description.contains(search)
                )
            )
        
        if category:
            query = query.filter_by(category=category)
        
        if min_price:
            query = query.filter(Product.price >= min_price)
        
        if max_price:
            query = query.filter(Product.price <= max_price)
        
        products = query.order_by(Product.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # إضافة معلومات المورد لكل منتج
        products_data = []
        for product in products.items:
            product_dict = product.to_dict()
            product_dict['supplier'] = product.supplier.to_dict()
            products_data.append(product_dict)
        
        return jsonify({
            'products': products_data,
            'total': products.total,
            'pages': products.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===== إدارة المفضلة =====
@merchant_bp.route('/favorites/suppliers', methods=['GET'])
def get_favorite_suppliers():
    try:
        merchant = require_merchant()
        if isinstance(merchant, tuple):
            return merchant
        
        favorites = FavoriteSupplier.query.filter_by(merchant_id=merchant.id).all()
        
        favorites_data = []
        for favorite in favorites:
            favorite_dict = favorite.to_dict()
            favorite_dict['supplier'] = favorite.supplier.to_dict()
            favorite_dict['supplier']['user'] = favorite.supplier.user.to_dict()
            favorites_data.append(favorite_dict)
        
        return jsonify({
            'favorites': favorites_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@merchant_bp.route('/favorites/suppliers/<int:supplier_id>', methods=['POST'])
def add_favorite_supplier(supplier_id):
    try:
        merchant = require_merchant()
        if isinstance(merchant, tuple):
            return merchant
        
        # التحقق من وجود المورد
        supplier = Supplier.query.get(supplier_id)
        if not supplier:
            return jsonify({'error': 'المورد غير موجود'}), 404
        
        # التحقق من عدم وجود المورد في المفضلة مسبقاً
        existing = FavoriteSupplier.query.filter_by(
            merchant_id=merchant.id,
            supplier_id=supplier_id
        ).first()
        
        if existing:
            return jsonify({'error': 'المورد موجود في المفضلة مسبقاً'}), 400
        
        data = request.get_json() or {}
        
        favorite = FavoriteSupplier(
            merchant_id=merchant.id,
            supplier_id=supplier_id,
            notes=data.get('notes')
        )
        
        db.session.add(favorite)
        db.session.commit()
        
        return jsonify({
            'message': 'تم إضافة المورد إلى المفضلة',
            'favorite': favorite.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@merchant_bp.route('/favorites/suppliers/<int:supplier_id>', methods=['DELETE'])
def remove_favorite_supplier(supplier_id):
    try:
        merchant = require_merchant()
        if isinstance(merchant, tuple):
            return merchant
        
        favorite = FavoriteSupplier.query.filter_by(
            merchant_id=merchant.id,
            supplier_id=supplier_id
        ).first()
        
        if not favorite:
            return jsonify({'error': 'المورد غير موجود في المفضلة'}), 404
        
        db.session.delete(favorite)
        db.session.commit()
        
        return jsonify({'message': 'تم إزالة المورد من المفضلة'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ===== طلبات عروض الأسعار =====
@merchant_bp.route('/quotation-requests', methods=['GET'])
def get_quotation_requests():
    try:
        merchant = require_merchant()
        if isinstance(merchant, tuple):
            return merchant
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status')
        
        query = QuotationRequest.query.filter_by(merchant_id=merchant.id)
        if status:
            query = query.filter_by(status=status)
        
        requests = query.order_by(QuotationRequest.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'requests': [req.to_dict() for req in requests.items],
            'total': requests.total,
            'pages': requests.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@merchant_bp.route('/quotation-requests', methods=['POST'])
def create_quotation_request():
    try:
        merchant = require_merchant()
        if isinstance(merchant, tuple):
            return merchant
        
        data = request.get_json()
        
        required_fields = ['title', 'items']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'حقل {field} مطلوب'}), 400
        
        # إنشاء رقم طلب عرض السعر
        request_number = f"RFQ-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        
        quotation_request = QuotationRequest(
            merchant_id=merchant.id,
            request_number=request_number,
            title=data['title'],
            description=data.get('description'),
            delivery_date_required=datetime.strptime(data['delivery_date_required'], '%Y-%m-%d').date() if data.get('delivery_date_required') else None,
            delivery_address=data.get('delivery_address'),
            notes=data.get('notes')
        )
        
        db.session.add(quotation_request)
        db.session.flush()  # للحصول على ID
        
        # إضافة العناصر
        for item_data in data['items']:
            item = QuotationRequestItem(
                request_id=quotation_request.id,
                product_name=item_data['product_name'],
                description=item_data.get('description'),
                quantity_needed=item_data['quantity_needed'],
                unit=item_data.get('unit', 'piece'),
                max_price=item_data.get('max_price'),
                specifications=item_data.get('specifications')
            )
            db.session.add(item)
        
        db.session.commit()
        
        return jsonify({
            'message': 'تم إنشاء طلب عرض السعر بنجاح',
            'request': quotation_request.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@merchant_bp.route('/quotation-requests/<int:request_id>/status', methods=['PUT'])
def update_quotation_request_status(request_id):
    try:
        merchant = require_merchant()
        if isinstance(merchant, tuple):
            return merchant
        
        quotation_request = QuotationRequest.query.filter_by(
            id=request_id,
            merchant_id=merchant.id
        ).first()
        
        if not quotation_request:
            return jsonify({'error': 'طلب عرض السعر غير موجود'}), 404
        
        data = request.get_json()
        if 'status' not in data:
            return jsonify({'error': 'حالة الطلب مطلوبة'}), 400
        
        quotation_request.status = data['status']
        quotation_request.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'تم تحديث حالة طلب عرض السعر',
            'request': quotation_request.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ===== عروض الأسعار المستلمة =====
@merchant_bp.route('/quotations/received', methods=['GET'])
def get_received_quotations():
    try:
        merchant = require_merchant()
        if isinstance(merchant, tuple):
            return merchant
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status')
        
        query = Quotation.query.filter_by(merchant_id=merchant.id)
        if status:
            query = query.filter_by(status=status)
        
        quotations = query.order_by(Quotation.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # إضافة معلومات المورد
        quotations_data = []
        for quotation in quotations.items:
            quotation_dict = quotation.to_dict()
            quotation_dict['supplier'] = quotation.supplier.to_dict()
            quotations_data.append(quotation_dict)
        
        return jsonify({
            'quotations': quotations_data,
            'total': quotations.total,
            'pages': quotations.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@merchant_bp.route('/quotations/<int:quotation_id>/accept', methods=['POST'])
def accept_quotation(quotation_id):
    try:
        merchant = require_merchant()
        if isinstance(merchant, tuple):
            return merchant
        
        quotation = Quotation.query.filter_by(
            id=quotation_id,
            merchant_id=merchant.id
        ).first()
        
        if not quotation:
            return jsonify({'error': 'عرض السعر غير موجود'}), 404
        
        if quotation.status != 'sent':
            return jsonify({'error': 'لا يمكن قبول عرض السعر في هذه الحالة'}), 400
        
        data = request.get_json() or {}
        
        # إنشاء طلب شراء من عرض السعر
        order_number = f"PO-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        
        purchase_order = PurchaseOrder(
            merchant_id=merchant.id,
            supplier_id=quotation.supplier_id,
            quotation_id=quotation.id,
            order_number=order_number,
            total_amount=quotation.total_amount,
            currency=quotation.currency,
            payment_method=data.get('payment_method', 'bank_transfer'),
            delivery_address=data.get('delivery_address'),
            delivery_date_requested=datetime.strptime(data['delivery_date_requested'], '%Y-%m-%d').date() if data.get('delivery_date_requested') else None,
            notes=data.get('notes')
        )
        
        db.session.add(purchase_order)
        db.session.flush()
        
        # إضافة عناصر الطلب
        for quotation_item in quotation.items:
            order_item = PurchaseOrderItem(
                purchase_order_id=purchase_order.id,
                product_id=quotation_item.product_id,
                product_name=quotation_item.product_name,
                description=quotation_item.description,
                quantity=quotation_item.quantity,
                unit_price=quotation_item.unit_price,
                total_price=quotation_item.total_price
            )
            db.session.add(order_item)
        
        # تحديث حالة عرض السعر
        quotation.status = 'accepted'
        quotation.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'تم قبول عرض السعر وإنشاء طلب الشراء',
            'purchase_order': purchase_order.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ===== إدارة طلبات الشراء =====
@merchant_bp.route('/purchase-orders', methods=['GET'])
def get_purchase_orders():
    try:
        merchant = require_merchant()
        if isinstance(merchant, tuple):
            return merchant
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status')
        
        query = PurchaseOrder.query.filter_by(merchant_id=merchant.id)
        if status:
            query = query.filter_by(status=status)
        
        orders = query.order_by(PurchaseOrder.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # إضافة معلومات المورد
        orders_data = []
        for order in orders.items:
            order_dict = order.to_dict()
            order_dict['supplier'] = Supplier.query.get(order.supplier_id).to_dict()
            orders_data.append(order_dict)
        
        return jsonify({
            'orders': orders_data,
            'total': orders.total,
            'pages': orders.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@merchant_bp.route('/purchase-orders/<int:order_id>', methods=['GET'])
def get_purchase_order(order_id):
    try:
        merchant = require_merchant()
        if isinstance(merchant, tuple):
            return merchant
        
        order = PurchaseOrder.query.filter_by(
            id=order_id,
            merchant_id=merchant.id
        ).first()
        
        if not order:
            return jsonify({'error': 'طلب الشراء غير موجود'}), 404
        
        order_dict = order.to_dict()
        order_dict['supplier'] = Supplier.query.get(order.supplier_id).to_dict()
        
        return jsonify({'order': order_dict}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===== إدارة المدفوعات =====
@merchant_bp.route('/payments', methods=['GET'])
def get_payments():
    try:
        merchant = require_merchant()
        if isinstance(merchant, tuple):
            return merchant
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        payments = Payment.query.join(PurchaseOrder).filter(
            PurchaseOrder.merchant_id == merchant.id
        ).order_by(Payment.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'payments': [payment.to_dict() for payment in payments.items],
            'total': payments.total,
            'pages': payments.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@merchant_bp.route('/payments', methods=['POST'])
def create_payment():
    try:
        merchant = require_merchant()
        if isinstance(merchant, tuple):
            return merchant
        
        data = request.get_json()
        
        required_fields = ['purchase_order_id', 'amount', 'payment_method']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'حقل {field} مطلوب'}), 400
        
        # التحقق من وجود طلب الشراء
        purchase_order = PurchaseOrder.query.filter_by(
            id=data['purchase_order_id'],
            merchant_id=merchant.id
        ).first()
        
        if not purchase_order:
            return jsonify({'error': 'طلب الشراء غير موجود'}), 404
        
        # إنشاء رقم الدفعة
        payment_number = f"PAY-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        
        payment = Payment(
            purchase_order_id=purchase_order.id,
            payment_number=payment_number,
            amount=data['amount'],
            currency=data.get('currency', 'SAR'),
            payment_method=data['payment_method'],
            transaction_id=data.get('transaction_id'),
            notes=data.get('notes')
        )
        
        db.session.add(payment)
        
        # تحديث حالة الدفع في طلب الشراء
        total_paid = db.session.query(db.func.sum(Payment.amount)).filter_by(
            purchase_order_id=purchase_order.id,
            status='completed'
        ).scalar() or 0
        
        total_paid += float(data['amount'])
        
        if total_paid >= float(purchase_order.total_amount):
            purchase_order.payment_status = 'paid'
        elif total_paid > 0:
            purchase_order.payment_status = 'partial'
        
        db.session.commit()
        
        return jsonify({
            'message': 'تم إنشاء الدفعة بنجاح',
            'payment': payment.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ===== شركات الشحن وعروض الشحن =====
@merchant_bp.route('/shipping-companies', methods=['GET'])
def get_shipping_companies():
    try:
        merchant = require_merchant()
        if isinstance(merchant, tuple):
            return merchant
        
        companies = ShippingCompany.query.join(User).filter(User.is_active == True).all()
        
        companies_data = []
        for company in companies:
            company_dict = company.to_dict()
            company_dict['user'] = company.user.to_dict()
            companies_data.append(company_dict)
        
        return jsonify({
            'companies': companies_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@merchant_bp.route('/shipping-quotes/request', methods=['POST'])
def request_shipping_quote():
    try:
        merchant = require_merchant()
        if isinstance(merchant, tuple):
            return merchant
        
        data = request.get_json()
        
        required_fields = ['shipping_company_id', 'pickup_address', 'delivery_address', 'package_details']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'حقل {field} مطلوب'}), 400
        
        # إنشاء رقم طلب عرض الشحن
        quote_number = f"SQ-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        
        shipping_quote = ShippingQuote(
            shipping_company_id=data['shipping_company_id'],
            merchant_id=merchant.id,
            purchase_order_id=data.get('purchase_order_id'),
            quote_number=quote_number,
            pickup_address=data['pickup_address'],
            delivery_address=data['delivery_address'],
            service_type=data.get('service_type', 'standard'),
            notes=data.get('notes'),
            valid_until=datetime.utcnow() + timedelta(days=7)  # صالح لمدة أسبوع
        )
        
        shipping_quote.set_package_details(data['package_details'])
        
        db.session.add(shipping_quote)
        db.session.commit()
        
        return jsonify({
            'message': 'تم إرسال طلب عرض الشحن بنجاح',
            'quote': shipping_quote.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@merchant_bp.route('/shipping-quotes', methods=['GET'])
def get_shipping_quotes():
    try:
        merchant = require_merchant()
        if isinstance(merchant, tuple):
            return merchant
        
        quotes = ShippingQuote.query.filter_by(merchant_id=merchant.id).order_by(ShippingQuote.created_at.desc()).all()
        
        quotes_data = []
        for quote in quotes:
            quote_dict = quote.to_dict()
            quote_dict['shipping_company'] = ShippingCompany.query.get(quote.shipping_company_id).to_dict()
            quotes_data.append(quote_dict)
        
        return jsonify({
            'quotes': quotes_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===== التقارير =====
@merchant_bp.route('/reports', methods=['GET'])
def get_reports():
    try:
        merchant = require_merchant()
        if isinstance(merchant, tuple):
            return merchant
        
        reports = MerchantReport.query.filter_by(merchant_id=merchant.id).order_by(MerchantReport.created_at.desc()).all()
        
        return jsonify({
            'reports': [report.to_dict() for report in reports]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@merchant_bp.route('/reports/generate', methods=['POST'])
def generate_report():
    try:
        merchant = require_merchant()
        if isinstance(merchant, tuple):
            return merchant
        
        data = request.get_json()
        
        required_fields = ['report_type', 'title']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'حقل {field} مطلوب'}), 400
        
        # إنشاء بيانات التقرير حسب النوع
        report_data = {}
        
        if data['report_type'] == 'purchases':
            # تقرير المشتريات
            orders = PurchaseOrder.query.filter_by(merchant_id=merchant.id).all()
            report_data = {
                'total_orders': len(orders),
                'total_spent': sum([float(order.total_amount) for order in orders]),
                'orders_by_status': {},
                'top_suppliers': []
            }
            
        elif data['report_type'] == 'payments':
            # تقرير المدفوعات
            payments = Payment.query.join(PurchaseOrder).filter(
                PurchaseOrder.merchant_id == merchant.id
            ).all()
            report_data = {
                'total_payments': len(payments),
                'total_amount_paid': sum([float(payment.amount) for payment in payments]),
                'payments_by_method': {},
                'payments_by_status': {}
            }
        
        report = MerchantReport(
            merchant_id=merchant.id,
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

