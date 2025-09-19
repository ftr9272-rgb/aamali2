from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from src.models.user import db, User
from src.models.shipping import (
    ShippingCompany, ShippingShipment, ShipmentTracking,
    ShippingQuote, ShippingDriver
)
from src.models.merchant import Merchant
import uuid
from src.utils.jwt_utils import decode_token

shipping_bp = Blueprint('shipping', __name__)


# ===== Shipping Company Management =====


@shipping_bp.route('/companies', methods=['GET'])
def get_shipping_companies():
    try:
        companies = ShippingCompany.query.filter_by(is_active=True).all()
        return jsonify([company.to_dict() for company in companies])
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def require_shipping_company():
    """Ensure the caller is an authenticated shipping company (session or Bearer token)"""
    # session first
    from flask import session, request, jsonify
    if 'user_id' in session and session.get('user_type') == 'shipping':
        user = User.query.get(session['user_id'])
        if not user or not user.shipping:
            return jsonify({'error': 'ملف شركة الشحن غير موجود'}), 404
        return user.shipping

    # then check bearer token
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
    if user_type != 'shipping':
        return jsonify({'error': 'هذه الخدمة متاحة لشركات الشحن فقط'}), 403
    user = User.query.get(user_id)
    if not user or not user.shipping:
        return jsonify({'error': 'ملف شركة الشحن غير موجود'}), 404
    return user.shipping


@shipping_bp.route('/public-list', methods=['GET'])
def get_public_shipping_companies():
    """
    Get a public list of all active shipping companies for the marketplace.
    """
    try:
        companies = ShippingCompany.query.filter_by(is_active=True).all()
        public_list = [
            {
                "id": company.id,
                "company_name": company.company_name,
                "rating": company.rating,
                "service_areas": company.get_service_areas(),
                "vehicle_types": company.get_vehicle_types(),
                "total_deliveries": company.total_deliveries,
                "is_active": company.is_active
            }
            for company in companies
        ]
        return jsonify(public_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@shipping_bp.route('/companies', methods=['GET'])
def get_all_shipping_companies():
    """
    Get all shipping companies (public endpoint for marketplace).
    """
    try:
        companies = ShippingCompany.query.filter_by(is_active=True).all()
        return jsonify([company.to_dict() for company in companies])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@shipping_bp.route('/companies/<int:company_id>', methods=['GET'])
def get_shipping_company(company_id):
    try:
        company = ShippingCompany.query.get_or_404(company_id)
        return jsonify(company.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@shipping_bp.route('/companies', methods=['POST'])
def create_shipping_company():
    try:
        data = request.json
        company = ShippingCompany(
            user_id=data['user_id'],
            company_name=data['company_name'],
            license_number=data['license_number'],
            pricing_model=data.get('pricing_model', 'per_km'),
            base_rate=data.get('base_rate', 0.0),
            min_charge=data.get('min_charge', 0.0),
            max_weight=data.get('max_weight', 1000.0),
            max_distance=data.get('max_distance', 500.0)
        )
        if 'service_areas' in data:
            company.set_service_areas(data['service_areas'])
        if 'vehicle_types' in data:
            company.set_vehicle_types(data['vehicle_types'])
        db.session.add(company)
        db.session.commit()
        return jsonify(company.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@shipping_bp.route('/companies/<int:company_id>', methods=['PUT'])
def update_shipping_company(company_id):
    try:
        company = ShippingCompany.query.get_or_404(company_id)
        data = request.json
        for field in ['company_name', 'license_number', 'pricing_model', 'base_rate', 'min_charge', 'max_weight', 'max_distance']:
            if field in data:
                setattr(company, field, data[field])
        if 'service_areas' in data:
            company.set_service_areas(data['service_areas'])
        if 'vehicle_types' in data:
            company.set_vehicle_types(data['vehicle_types'])
        company.updated_at = datetime.utcnow()
        db.session.commit()
        return jsonify(company.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ===== Shipment Management =====


@shipping_bp.route('/shipments', methods=['GET'])
def get_shipments():
    try:
        company_id = request.args.get('company_id')
        merchant_id = request.args.get('merchant_id')
        status = request.args.get('status')
        query = ShippingShipment.query
        if company_id:
            query = query.filter_by(shipping_company_id=company_id)
        if merchant_id:
            query = query.filter_by(merchant_id=merchant_id)
        if status:
            query = query.filter_by(status=status)
        shipments = query.order_by(ShippingShipment.created_at.desc()).all()
        return jsonify([shipment.to_dict() for shipment in shipments])
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@shipping_bp.route('/shipments/<int:shipment_id>', methods=['GET'])
def get_shipment(shipment_id):
    try:
        shipment = ShippingShipment.query.get_or_404(shipment_id)
        shipment_data = shipment.to_dict()
        tracking = ShipmentTracking.query.filter_by(shipment_id=shipment_id).order_by(ShipmentTracking.timestamp.desc()).all()
        shipment_data['tracking_history'] = [track.to_dict() for track in tracking]
        return jsonify(shipment_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@shipping_bp.route('/shipments', methods=['POST'])
def create_shipment():
    try:
        data = request.json
        tracking_number = f"SH{datetime.now().strftime('%Y%m%d')}{str(uuid.uuid4())[:8].upper()}"
        shipment = ShippingShipment(
            tracking_number=tracking_number,
            shipping_company_id=data['shipping_company_id'],
            merchant_id=data['merchant_id'],
            order_id=data.get('order_id'),
            pickup_address=data['pickup_address'],
            pickup_contact_name=data['pickup_contact_name'],
            pickup_contact_phone=data['pickup_contact_phone'],
            pickup_date=datetime.fromisoformat(data['pickup_date']),
            pickup_time_slot=data.get('pickup_time_slot'),
            delivery_address=data['delivery_address'],
            delivery_contact_name=data['delivery_contact_name'],
            delivery_contact_phone=data['delivery_contact_phone'],
            package_description=data.get('package_description'),
            package_weight=data.get('package_weight'),
            package_dimensions=data.get('package_dimensions'),
            package_value=data.get('package_value'),
            quoted_price=data['quoted_price'],
            currency=data.get('currency', 'SAR'),
            notes=data.get('notes'),
            special_instructions=data.get('special_instructions')
        )
        if 'delivery_date' in data and data['delivery_date']:
            shipment.delivery_date = datetime.fromisoformat(data['delivery_date'])
        db.session.add(shipment)
        db.session.flush()
        tracking = ShipmentTracking(
            shipment_id=shipment.id,
            status='pending',
            description='تم إنشاء الشحنة',
            created_by='system'
        )
        db.session.add(tracking)
        db.session.commit()
        return jsonify(shipment.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@shipping_bp.route('/shipments/<int:shipment_id>/status', methods=['PUT'])
def update_shipment_status(shipment_id):
    try:
        shipment = ShippingShipment.query.get_or_404(shipment_id)
        data = request.json
        old_status = shipment.status
        new_status = data['status']
        shipment.status = new_status
        if new_status == 'confirmed':
            shipment.confirmed_at = datetime.utcnow()
        elif new_status == 'picked_up':
            shipment.picked_up_at = datetime.utcnow()
        elif new_status == 'delivered':
            shipment.delivered_at = datetime.utcnow()
        shipment.updated_at = datetime.utcnow()
        tracking = ShipmentTracking(
            shipment_id=shipment_id,
            status=new_status,
            location=data.get('location'),
            description=data.get('description', f'تم تحديث الحالة إلى {new_status}'),
            created_by=data.get('created_by', 'system')
        )
        db.session.add(tracking)
        db.session.commit()
        return jsonify(shipment.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@shipping_bp.route('/shipments/<int:shipment_id>/tracking', methods=['POST'])
def add_tracking_update(shipment_id):
    try:
        data = request.json
        tracking = ShipmentTracking(
            shipment_id=shipment_id,
            status=data['status'],
            location=data.get('location'),
            description=data['description'],
            created_by=data.get('created_by', 'system')
        )
        db.session.add(tracking)
        db.session.commit()
        return jsonify(tracking.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ===== Shipping Quotes =====


@shipping_bp.route('/quotes', methods=['GET'])
def get_shipping_quotes():
    try:
        company_id = request.args.get('company_id')
        merchant_id = request.args.get('merchant_id')
        status = request.args.get('status')
        query = ShippingQuote.query
        if company_id:
            query = query.filter_by(shipping_company_id=company_id)
        if merchant_id:
            query = query.filter_by(merchant_id=merchant_id)
        if status:
            query = query.filter_by(status=status)
        quotes = query.order_by(ShippingQuote.created_at.desc()).all()
        return jsonify([quote.to_dict() for quote in quotes])
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@shipping_bp.route('/quotes', methods=['POST'])
def create_shipping_quote():
    try:
        data = request.json
        quote_number = f"SQ{datetime.now().strftime('%Y%m%d')}{str(uuid.uuid4())[:6].upper()}"
        quote = ShippingQuote(
            quote_number=quote_number,
            shipping_company_id=data['shipping_company_id'],
            merchant_id=data['merchant_id'],
            pickup_city=data['pickup_city'],
            delivery_city=data['delivery_city'],
            distance=data.get('distance'),
            package_weight=data['package_weight'],
            package_dimensions=data.get('package_dimensions'),
            package_type=data.get('package_type'),
            service_type=data.get('service_type', 'standard'),
            pickup_date=datetime.fromisoformat(data['pickup_date']).date(),
            quoted_price=data['quoted_price'],
            currency=data.get('currency', 'SAR'),
            valid_until=datetime.fromisoformat(data['valid_until']),
            notes=data.get('notes')
        )
        if 'delivery_date' in data and data['delivery_date']:
            quote.delivery_date = datetime.fromisoformat(data['delivery_date']).date()
        db.session.add(quote)
        db.session.commit()
        return jsonify(quote.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@shipping_bp.route('/quotes/<int:quote_id>/send', methods=['PUT'])
def send_shipping_quote(quote_id):
    try:
        quote = ShippingQuote.query.get_or_404(quote_id)
        quote.status = 'sent'
        quote.sent_at = datetime.utcnow()
        db.session.commit()
        return jsonify(quote.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@shipping_bp.route('/quotes/<int:quote_id>/respond', methods=['PUT'])
def respond_to_quote(quote_id):
    try:
        quote = ShippingQuote.query.get_or_404(quote_id)
        data = request.json
        quote.status = data['status']
        quote.responded_at = datetime.utcnow()
        if 'notes' in data:
            quote.notes = data['notes']
        db.session.commit()
        return jsonify(quote.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ===== Driver Management =====


@shipping_bp.route('/companies/<int:company_id>/drivers', methods=['GET'])
def get_company_drivers(company_id):
    try:
        drivers = ShippingDriver.query.filter_by(shipping_company_id=company_id).all()
        return jsonify([driver.to_dict() for driver in drivers])
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@shipping_bp.route('/drivers', methods=['POST'])
def create_driver():
    try:
        data = request.json
        driver = ShippingDriver(
            shipping_company_id=data['shipping_company_id'],
            driver_name=data['driver_name'],
            driver_phone=data['driver_phone'],
            driver_license=data['driver_license'],
            vehicle_type=data['vehicle_type'],
            vehicle_plate=data['vehicle_plate'],
            vehicle_capacity=data.get('vehicle_capacity'),
            current_location=data.get('current_location')
        )
        db.session.add(driver)
        db.session.commit()
        return jsonify(driver.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@shipping_bp.route('/drivers/<int:driver_id>', methods=['PUT'])
def update_driver(driver_id):
    try:
        driver = ShippingDriver.query.get_or_404(driver_id)
        data = request.json
        for field in ['driver_name', 'driver_phone', 'driver_license', 'vehicle_type', 'vehicle_plate', 'vehicle_capacity', 'current_location', 'is_active']:
            if field in data:
                setattr(driver, field, data[field])
        db.session.commit()
        return jsonify(driver.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ===== Dashboard and Statistics =====


@shipping_bp.route('/dashboard', methods=['GET'])
def get_my_dashboard():
    """
    Get dashboard data for the currently authenticated shipping company.
    """
    company = require_shipping_company()
    if isinstance(company, tuple):
        return company
    
    return get_company_dashboard(company.id)

@shipping_bp.route('/companies/<int:company_id>/dashboard', methods=['GET'])
def get_company_dashboard(company_id):
    try:
        total_shipments = ShippingShipment.query.filter_by(shipping_company_id=company_id).count()
        pending_shipments = ShippingShipment.query.filter_by(shipping_company_id=company_id, status='pending').count()
        in_transit_shipments = ShippingShipment.query.filter_by(shipping_company_id=company_id, status='in_transit').count()
        delivered_shipments = ShippingShipment.query.filter_by(shipping_company_id=company_id, status='delivered').count()
        revenue_result = db.session.query(db.func.sum(ShippingShipment.actual_price)).filter_by(shipping_company_id=company_id, status='delivered').scalar()
        total_revenue = revenue_result or 0
        active_quotes = ShippingQuote.query.filter_by(shipping_company_id=company_id, status='sent').count()
        active_drivers = ShippingDriver.query.filter_by(shipping_company_id=company_id, is_active=True).count()
        dashboard_data = {
            'total_shipments': total_shipments,
            'pending_shipments': pending_shipments,
            'in_transit_shipments': in_transit_shipments,
            'delivered_shipments': delivered_shipments,
            'total_revenue': total_revenue,
            'active_quotes': active_quotes,
            'active_drivers': active_drivers
        }
        return jsonify(dashboard_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ===== Public Tracking =====


@shipping_bp.route('/track/<tracking_number>', methods=['GET'])
def track_shipment(tracking_number):
    try:
        shipment = ShippingShipment.query.filter_by(tracking_number=tracking_number).first()
        if not shipment:
            return jsonify({'error': 'رقم التتبع غير صحيح'}), 404
        tracking = ShipmentTracking.query.filter_by(shipment_id=shipment.id).order_by(ShipmentTracking.timestamp.asc()).all()
        tracking_data = {
            'tracking_number': shipment.tracking_number,
            'status': shipment.status,
            'pickup_date': shipment.pickup_date.isoformat() if shipment.pickup_date else None,
            'delivery_date': shipment.delivery_date.isoformat() if shipment.delivery_date else None,
            'tracking_history': [track.to_dict() for track in tracking]
        }
        return jsonify(tracking_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


