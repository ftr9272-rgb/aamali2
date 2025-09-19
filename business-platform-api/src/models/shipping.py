from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import json

# استخدام نفس مثيل قاعدة البيانات من user.py
from .user import db

class ShippingCompany(db.Model):
    __tablename__ = 'shipping_companies'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    company_name = db.Column(db.String(100), nullable=False)
    license_number = db.Column(db.String(50), unique=True, nullable=False)
    service_areas = db.Column(db.Text)  # JSON string of service areas
    vehicle_types = db.Column(db.Text)  # JSON string of vehicle types
    pricing_model = db.Column(db.Enum('per_km', 'per_weight', 'fixed', name='pricing_models'), default='per_km')
    base_rate = db.Column(db.Float, default=0.0)
    min_charge = db.Column(db.Float, default=0.0)
    max_weight = db.Column(db.Float, default=1000.0)  # kg
    max_distance = db.Column(db.Float, default=500.0)  # km
    rating = db.Column(db.Float, default=0.0)
    total_deliveries = db.Column(db.Integer, default=0)
    is_verified = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # العلاقات
    shipments = db.relationship('ShippingShipment', backref='shipping_company', lazy=True)
    quotes = db.relationship('ShippingQuote', backref='shipping_company', lazy=True)
    
    def set_service_areas(self, areas):
        self.service_areas = json.dumps(areas)
    
    def get_service_areas(self):
        return json.loads(self.service_areas) if self.service_areas else []
    
    def set_vehicle_types(self, types):
        self.vehicle_types = json.dumps(types)
    
    def get_vehicle_types(self):
        return json.loads(self.vehicle_types) if self.vehicle_types else []
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'company_name': self.company_name,
            'license_number': self.license_number,
            'service_areas': self.get_service_areas(),
            'vehicle_types': self.get_vehicle_types(),
            'pricing_model': self.pricing_model,
            'base_rate': self.base_rate,
            'min_charge': self.min_charge,
            'max_weight': self.max_weight,
            'max_distance': self.max_distance,
            'rating': self.rating,
            'total_deliveries': self.total_deliveries,
            'is_verified': self.is_verified,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class ShippingShipment(db.Model):
    __tablename__ = 'shipping_shipments'
    
    id = db.Column(db.Integer, primary_key=True)
    tracking_number = db.Column(db.String(50), unique=True, nullable=False)
    shipping_company_id = db.Column(db.Integer, db.ForeignKey('shipping_companies.id'), nullable=False)
    merchant_id = db.Column(db.Integer, db.ForeignKey('merchants.id'), nullable=False)
    order_id = db.Column(db.Integer, nullable=True)  # Reference to order
    
    # Pickup details
    pickup_address = db.Column(db.Text, nullable=False)
    pickup_contact_name = db.Column(db.String(100), nullable=False)
    pickup_contact_phone = db.Column(db.String(20), nullable=False)
    pickup_date = db.Column(db.DateTime, nullable=False)
    pickup_time_slot = db.Column(db.String(20))  # e.g., "09:00-12:00"
    
    # Delivery details
    delivery_address = db.Column(db.Text, nullable=False)
    delivery_contact_name = db.Column(db.String(100), nullable=False)
    delivery_contact_phone = db.Column(db.String(20), nullable=False)
    delivery_date = db.Column(db.DateTime)
    delivery_time_slot = db.Column(db.String(20))
    
    # Package details
    package_description = db.Column(db.Text)
    package_weight = db.Column(db.Float)  # kg
    package_dimensions = db.Column(db.String(50))  # e.g., "30x20x15"
    package_value = db.Column(db.Float)  # for insurance
    
    # Pricing
    quoted_price = db.Column(db.Float, nullable=False)
    actual_price = db.Column(db.Float)
    currency = db.Column(db.String(3), default='SAR')
    
    # Status tracking
    status = db.Column(db.Enum('pending', 'confirmed', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'returned', name='shipment_statuses'), default='pending')
    notes = db.Column(db.Text)
    special_instructions = db.Column(db.Text)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    confirmed_at = db.Column(db.DateTime)
    picked_up_at = db.Column(db.DateTime)
    delivered_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # العلاقات
    tracking_updates = db.relationship('ShipmentTracking', backref='shipment', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'tracking_number': self.tracking_number,
            'shipping_company_id': self.shipping_company_id,
            'merchant_id': self.merchant_id,
            'order_id': self.order_id,
            'pickup_address': self.pickup_address,
            'pickup_contact_name': self.pickup_contact_name,
            'pickup_contact_phone': self.pickup_contact_phone,
            'pickup_date': self.pickup_date.isoformat() if self.pickup_date else None,
            'pickup_time_slot': self.pickup_time_slot,
            'delivery_address': self.delivery_address,
            'delivery_contact_name': self.delivery_contact_name,
            'delivery_contact_phone': self.delivery_contact_phone,
            'delivery_date': self.delivery_date.isoformat() if self.delivery_date else None,
            'delivery_time_slot': self.delivery_time_slot,
            'package_description': self.package_description,
            'package_weight': self.package_weight,
            'package_dimensions': self.package_dimensions,
            'package_value': self.package_value,
            'quoted_price': self.quoted_price,
            'actual_price': self.actual_price,
            'currency': self.currency,
            'status': self.status,
            'notes': self.notes,
            'special_instructions': self.special_instructions,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'confirmed_at': self.confirmed_at.isoformat() if self.confirmed_at else None,
            'picked_up_at': self.picked_up_at.isoformat() if self.picked_up_at else None,
            'delivered_at': self.delivered_at.isoformat() if self.delivered_at else None
        }

class ShipmentTracking(db.Model):
    __tablename__ = 'shipping_tracking'
    
    id = db.Column(db.Integer, primary_key=True)
    shipment_id = db.Column(db.Integer, db.ForeignKey('shipping_shipments.id'), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(200))
    description = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.String(50))  # system, driver, admin
    
    def to_dict(self):
        return {
            'id': self.id,
            'shipment_id': self.shipment_id,
            'status': self.status,
            'location': self.location,
            'description': self.description,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'created_by': self.created_by
        }

class ShippingQuote(db.Model):
    __tablename__ = 'shipping_quotes'
    
    id = db.Column(db.Integer, primary_key=True)
    quote_number = db.Column(db.String(50), unique=True, nullable=False)
    shipping_company_id = db.Column(db.Integer, db.ForeignKey('shipping_companies.id'), nullable=False)
    merchant_id = db.Column(db.Integer, db.ForeignKey('merchants.id'), nullable=False)
    
    # Route details
    pickup_city = db.Column(db.String(100), nullable=False)
    delivery_city = db.Column(db.String(100), nullable=False)
    distance = db.Column(db.Float)  # km
    
    # Package details
    package_weight = db.Column(db.Float, nullable=False)  # kg
    package_dimensions = db.Column(db.String(50))
    package_type = db.Column(db.String(50))  # fragile, electronics, etc.
    
    # Service details
    service_type = db.Column(db.Enum('standard', 'express', 'overnight', name='service_types'), default='standard')
    pickup_date = db.Column(db.Date, nullable=False)
    delivery_date = db.Column(db.Date)
    
    # Pricing
    quoted_price = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), default='SAR')
    valid_until = db.Column(db.DateTime, nullable=False)
    
    # Status
    status = db.Column(db.Enum('pending', 'sent', 'accepted', 'rejected', 'expired', name='quote_statuses'), default='pending')
    notes = db.Column(db.Text)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    sent_at = db.Column(db.DateTime)
    responded_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'quote_number': self.quote_number,
            'shipping_company_id': self.shipping_company_id,
            'merchant_id': self.merchant_id,
            'pickup_city': self.pickup_city,
            'delivery_city': self.delivery_city,
            'distance': self.distance,
            'package_weight': self.package_weight,
            'package_dimensions': self.package_dimensions,
            'package_type': self.package_type,
            'service_type': self.service_type,
            'pickup_date': self.pickup_date.isoformat() if self.pickup_date else None,
            'delivery_date': self.delivery_date.isoformat() if self.delivery_date else None,
            'quoted_price': self.quoted_price,
            'currency': self.currency,
            'valid_until': self.valid_until.isoformat() if self.valid_until else None,
            'status': self.status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'sent_at': self.sent_at.isoformat() if self.sent_at else None,
            'responded_at': self.responded_at.isoformat() if self.responded_at else None
        }

class ShippingDriver(db.Model):
    __tablename__ = 'shipping_drivers'
    
    id = db.Column(db.Integer, primary_key=True)
    shipping_company_id = db.Column(db.Integer, db.ForeignKey('shipping_companies.id'), nullable=False)
    driver_name = db.Column(db.String(100), nullable=False)
    driver_phone = db.Column(db.String(20), nullable=False)
    driver_license = db.Column(db.String(50), nullable=False)
    vehicle_type = db.Column(db.String(50), nullable=False)
    vehicle_plate = db.Column(db.String(20), nullable=False)
    vehicle_capacity = db.Column(db.Float)  # kg
    is_active = db.Column(db.Boolean, default=True)
    current_location = db.Column(db.String(200))
    rating = db.Column(db.Float, default=0.0)
    total_deliveries = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'shipping_company_id': self.shipping_company_id,
            'driver_name': self.driver_name,
            'driver_phone': self.driver_phone,
            'driver_license': self.driver_license,
            'vehicle_type': self.vehicle_type,
            'vehicle_plate': self.vehicle_plate,
            'vehicle_capacity': self.vehicle_capacity,
            'is_active': self.is_active,
            'current_location': self.current_location,
            'rating': self.rating,
            'total_deliveries': self.total_deliveries,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

