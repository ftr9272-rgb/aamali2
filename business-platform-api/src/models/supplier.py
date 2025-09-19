from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import json

# استيراد قاعدة البيانات ونموذج User من user.py
from .user import db, User

class Supplier(db.Model):
    __tablename__ = 'suppliers'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    company_name = db.Column(db.String(100), nullable=False)
    company_address = db.Column(db.Text)
    tax_number = db.Column(db.String(50))
    business_license = db.Column(db.String(100))
    description = db.Column(db.Text)
    logo_url = db.Column(db.String(255))
    rating = db.Column(db.Numeric(3, 2), default=0.00)
    total_orders = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # العلاقات
    products = db.relationship('Product', backref='supplier', cascade='all, delete-orphan')
    quotations = db.relationship('Quotation', backref='supplier', cascade='all, delete-orphan')
    orders = db.relationship('Order', backref='supplier', cascade='all, delete-orphan')
    drivers = db.relationship('Driver', backref='supplier', cascade='all, delete-orphan')
    partners = db.relationship('Partner', backref='supplier', cascade='all, delete-orphan')
    reports = db.relationship('Report', backref='supplier', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'company_name': self.company_name,
            'company_address': self.company_address,
            'tax_number': self.tax_number,
            'business_license': self.business_license,
            'description': self.description,
            'logo_url': self.logo_url,
            'rating': float(self.rating) if self.rating else 0.0,
            'total_orders': self.total_orders,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    price = db.Column(db.Numeric(10, 2), nullable=False)
    stock_quantity = db.Column(db.Integer, default=0)
    min_order_quantity = db.Column(db.Integer, default=1)
    unit = db.Column(db.String(20), default='piece')
    images = db.Column(db.Text)  # JSON array
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def get_images(self):
        if self.images:
            try:
                return json.loads(self.images)
            except:
                return []
        return []
    
    def set_images(self, images_list):
        self.images = json.dumps(images_list)
    
    def to_dict(self):
        return {
            'id': self.id,
            'supplier_id': self.supplier_id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'price': float(self.price) if self.price else 0.0,
            'stock_quantity': self.stock_quantity,
            'min_order_quantity': self.min_order_quantity,
            'unit': self.unit,
            'images': self.get_images(),
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Quotation(db.Model):
    __tablename__ = 'quotations'
    
    id = db.Column(db.Integer, primary_key=True)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=False)
    merchant_id = db.Column(db.Integer)
    quotation_number = db.Column(db.String(50), unique=True, nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    total_amount = db.Column(db.Numeric(12, 2), nullable=False)
    currency = db.Column(db.String(3), default='SAR')
    status = db.Column(db.Enum('draft', 'sent', 'accepted', 'rejected', 'expired', name='quotation_status'), default='draft')
    valid_until = db.Column(db.Date)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # العلاقات
    items = db.relationship('QuotationItem', backref='quotation', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'supplier_id': self.supplier_id,
            'merchant_id': self.merchant_id,
            'quotation_number': self.quotation_number,
            'title': self.title,
            'description': self.description,
            'total_amount': float(self.total_amount) if self.total_amount else 0.0,
            'currency': self.currency,
            'status': self.status,
            'valid_until': self.valid_until.isoformat() if self.valid_until else None,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'items': [item.to_dict() for item in self.items]
        }

class QuotationItem(db.Model):
    __tablename__ = 'quotation_items'
    
    id = db.Column(db.Integer, primary_key=True)
    quotation_id = db.Column(db.Integer, db.ForeignKey('quotations.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    product_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    total_price = db.Column(db.Numeric(12, 2), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'quotation_id': self.quotation_id,
            'product_id': self.product_id,
            'product_name': self.product_name,
            'description': self.description,
            'quantity': self.quantity,
            'unit_price': float(self.unit_price) if self.unit_price else 0.0,
            'total_price': float(self.total_price) if self.total_price else 0.0
        }

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=False)
    merchant_id = db.Column(db.Integer, nullable=False)
    quotation_id = db.Column(db.Integer, db.ForeignKey('quotations.id'))
    total_amount = db.Column(db.Numeric(12, 2), nullable=False)
    currency = db.Column(db.String(3), default='SAR')
    status = db.Column(db.Enum('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', name='order_status'), default='pending')
    shipping_address = db.Column(db.Text)
    delivery_date = db.Column(db.Date)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # العلاقات
    shipment = db.relationship('Shipment', backref='order', uselist=False, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'order_number': self.order_number,
            'supplier_id': self.supplier_id,
            'merchant_id': self.merchant_id,
            'quotation_id': self.quotation_id,
            'total_amount': float(self.total_amount) if self.total_amount else 0.0,
            'currency': self.currency,
            'status': self.status,
            'shipping_address': self.shipping_address,
            'delivery_date': self.delivery_date.isoformat() if self.delivery_date else None,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'shipment': self.shipment.to_dict() if self.shipment else None
        }

class Shipment(db.Model):
    __tablename__ = 'shipments'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    shipping_company_id = db.Column(db.Integer)
    driver_id = db.Column(db.Integer, db.ForeignKey('drivers.id'))
    tracking_number = db.Column(db.String(100), unique=True)
    pickup_address = db.Column(db.Text)
    delivery_address = db.Column(db.Text)
    pickup_date = db.Column(db.DateTime)
    delivery_date = db.Column(db.DateTime)
    estimated_delivery = db.Column(db.DateTime)
    status = db.Column(db.Enum('pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', name='shipment_status'), default='pending')
    shipping_cost = db.Column(db.Numeric(10, 2))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'shipping_company_id': self.shipping_company_id,
            'driver_id': self.driver_id,
            'tracking_number': self.tracking_number,
            'pickup_address': self.pickup_address,
            'delivery_address': self.delivery_address,
            'pickup_date': self.pickup_date.isoformat() if self.pickup_date else None,
            'delivery_date': self.delivery_date.isoformat() if self.delivery_date else None,
            'estimated_delivery': self.estimated_delivery.isoformat() if self.estimated_delivery else None,
            'status': self.status,
            'shipping_cost': float(self.shipping_cost) if self.shipping_cost else 0.0,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Driver(db.Model):
    __tablename__ = 'drivers'
    
    id = db.Column(db.Integer, primary_key=True)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100))
    license_number = db.Column(db.String(50))
    vehicle_type = db.Column(db.String(50))
    vehicle_plate = db.Column(db.String(20))
    is_active = db.Column(db.Boolean, default=True)
    rating = db.Column(db.Numeric(3, 2), default=0.00)
    total_deliveries = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'supplier_id': self.supplier_id,
            'name': self.name,
            'phone': self.phone,
            'email': self.email,
            'license_number': self.license_number,
            'vehicle_type': self.vehicle_type,
            'vehicle_plate': self.vehicle_plate,
            'is_active': self.is_active,
            'rating': float(self.rating) if self.rating else 0.0,
            'total_deliveries': self.total_deliveries,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Partner(db.Model):
    __tablename__ = 'partners'
    
    id = db.Column(db.Integer, primary_key=True)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=False)
    partner_name = db.Column(db.String(100), nullable=False)
    partner_type = db.Column(db.Enum('shipping_company', 'logistics', 'warehouse', 'other', name='partner_types'), nullable=False)
    contact_person = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    email = db.Column(db.String(100))
    address = db.Column(db.Text)
    contract_start = db.Column(db.Date)
    contract_end = db.Column(db.Date)
    is_active = db.Column(db.Boolean, default=True)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'supplier_id': self.supplier_id,
            'partner_name': self.partner_name,
            'partner_type': self.partner_type,
            'contact_person': self.contact_person,
            'phone': self.phone,
            'email': self.email,
            'address': self.address,
            'contract_start': self.contract_start.isoformat() if self.contract_start else None,
            'contract_end': self.contract_end.isoformat() if self.contract_end else None,
            'is_active': self.is_active,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Report(db.Model):
    __tablename__ = 'reports'
    
    id = db.Column(db.Integer, primary_key=True)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=False)
    report_type = db.Column(db.Enum('sales', 'inventory', 'shipping', 'financial', 'custom', name='report_types'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    date_from = db.Column(db.Date)
    date_to = db.Column(db.Date)
    data = db.Column(db.Text)  # JSON data
    file_path = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def get_data(self):
        if self.data:
            try:
                return json.loads(self.data)
            except:
                return {}
        return {}
    
    def set_data(self, data_dict):
        self.data = json.dumps(data_dict)
    
    def to_dict(self):
        return {
            'id': self.id,
            'supplier_id': self.supplier_id,
            'report_type': self.report_type,
            'title': self.title,
            'description': self.description,
            'date_from': self.date_from.isoformat() if self.date_from else None,
            'date_to': self.date_to.isoformat() if self.date_to else None,
            'data': self.get_data(),
            'file_path': self.file_path,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Setting(db.Model):
    __tablename__ = 'settings'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    setting_key = db.Column(db.String(100), nullable=False)
    setting_value = db.Column(db.Text)
    setting_type = db.Column(db.Enum('string', 'number', 'boolean', 'json', name='setting_types'), default='string')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('user_id', 'setting_key'),)
    
    def get_value(self):
        if self.setting_type == 'number':
            try:
                return float(self.setting_value)
            except:
                return 0
        elif self.setting_type == 'boolean':
            return self.setting_value.lower() in ['true', '1', 'yes']
        elif self.setting_type == 'json':
            try:
                return json.loads(self.setting_value)
            except:
                return {}
        return self.setting_value
    
    def set_value(self, value):
        if self.setting_type == 'json':
            self.setting_value = json.dumps(value)
        else:
            self.setting_value = str(value)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'setting_key': self.setting_key,
            'setting_value': self.get_value(),
            'setting_type': self.setting_type,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.Enum('info', 'success', 'warning', 'error', name='notification_types'), default='info')
    is_read = db.Column(db.Boolean, default=False)
    action_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'message': self.message,
            'type': self.type,
            'is_read': self.is_read,
            'action_url': self.action_url,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

