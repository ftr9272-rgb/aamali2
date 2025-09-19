from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

# استيراد النماذج الموجودة
from src.models.user import db, User
from src.models.supplier import Supplier, Product, Quotation, QuotationItem, Order, Shipment, Driver, Partner, Report, Setting, Notification
from src.models.shipping import ShippingCompany, ShippingQuote

class Merchant(db.Model):
    __tablename__ = 'merchants'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    store_name = db.Column(db.String(100), nullable=False)
    store_address = db.Column(db.Text)
    store_type = db.Column(db.String(50))  # سوبر ماركت، مطعم، كافيه، إلخ
    tax_number = db.Column(db.String(50))
    commercial_license = db.Column(db.String(100))
    description = db.Column(db.Text)
    logo_url = db.Column(db.String(255))
    rating = db.Column(db.Numeric(3, 2), default=0.00)
    total_purchases = db.Column(db.Integer, default=0)
    total_spent = db.Column(db.Numeric(12, 2), default=0.00)
    preferred_payment_method = db.Column(db.String(50), default='bank_transfer')
    credit_limit = db.Column(db.Numeric(12, 2), default=0.00)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # العلاقات
    purchase_orders = db.relationship('PurchaseOrder', backref='merchant', cascade='all, delete-orphan')
    quotation_requests = db.relationship('QuotationRequest', backref='merchant', cascade='all, delete-orphan')
    favorite_suppliers = db.relationship('FavoriteSupplier', backref='merchant', cascade='all, delete-orphan')
    merchant_reports = db.relationship('MerchantReport', backref='merchant', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'store_name': self.store_name,
            'store_address': self.store_address,
            'store_type': self.store_type,
            'tax_number': self.tax_number,
            'commercial_license': self.commercial_license,
            'description': self.description,
            'logo_url': self.logo_url,
            'rating': float(self.rating) if self.rating else 0.0,
            'total_purchases': self.total_purchases,
            'total_spent': float(self.total_spent) if self.total_spent else 0.0,
            'preferred_payment_method': self.preferred_payment_method,
            'credit_limit': float(self.credit_limit) if self.credit_limit else 0.0,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class QuotationRequest(db.Model):
    __tablename__ = 'quotation_requests'
    
    id = db.Column(db.Integer, primary_key=True)
    merchant_id = db.Column(db.Integer, db.ForeignKey('merchants.id'), nullable=False)
    request_number = db.Column(db.String(50), unique=True, nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    delivery_date_required = db.Column(db.Date)
    delivery_address = db.Column(db.Text)
    status = db.Column(db.Enum('draft', 'sent', 'received_quotes', 'closed', name='request_status'), default='draft')
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # العلاقات
    items = db.relationship('QuotationRequestItem', backref='request', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'merchant_id': self.merchant_id,
            'request_number': self.request_number,
            'title': self.title,
            'description': self.description,
            'delivery_date_required': self.delivery_date_required.isoformat() if self.delivery_date_required else None,
            'delivery_address': self.delivery_address,
            'status': self.status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'items': [item.to_dict() for item in self.items]
        }

class QuotationRequestItem(db.Model):
    __tablename__ = 'quotation_request_items'
    
    id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.Integer, db.ForeignKey('quotation_requests.id'), nullable=False)
    product_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    quantity_needed = db.Column(db.Integer, nullable=False)
    unit = db.Column(db.String(20), default='piece')
    max_price = db.Column(db.Numeric(10, 2))  # أقصى سعر مقبول
    specifications = db.Column(db.Text)  # مواصفات خاصة
    
    def to_dict(self):
        return {
            'id': self.id,
            'request_id': self.request_id,
            'product_name': self.product_name,
            'description': self.description,
            'quantity_needed': self.quantity_needed,
            'unit': self.unit,
            'max_price': float(self.max_price) if self.max_price else None,
            'specifications': self.specifications
        }

class PurchaseOrder(db.Model):
    __tablename__ = 'purchase_orders'
    
    id = db.Column(db.Integer, primary_key=True)
    merchant_id = db.Column(db.Integer, db.ForeignKey('merchants.id'), nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=False)
    quotation_id = db.Column(db.Integer, db.ForeignKey('quotations.id'))
    order_number = db.Column(db.String(50), unique=True, nullable=False)
    total_amount = db.Column(db.Numeric(12, 2), nullable=False)
    currency = db.Column(db.String(3), default='SAR')
    status = db.Column(db.Enum('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', name='purchase_order_status'), default='pending')
    payment_status = db.Column(db.Enum('pending', 'partial', 'paid', 'overdue', name='payment_status'), default='pending')
    payment_method = db.Column(db.String(50))
    delivery_address = db.Column(db.Text)
    delivery_date_requested = db.Column(db.Date)
    delivery_date_confirmed = db.Column(db.Date)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # العلاقات
    items = db.relationship('PurchaseOrderItem', backref='purchase_order', cascade='all, delete-orphan')
    payments = db.relationship('Payment', backref='purchase_order', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'merchant_id': self.merchant_id,
            'supplier_id': self.supplier_id,
            'quotation_id': self.quotation_id,
            'order_number': self.order_number,
            'total_amount': float(self.total_amount) if self.total_amount else 0.0,
            'currency': self.currency,
            'status': self.status,
            'payment_status': self.payment_status,
            'payment_method': self.payment_method,
            'delivery_address': self.delivery_address,
            'delivery_date_requested': self.delivery_date_requested.isoformat() if self.delivery_date_requested else None,
            'delivery_date_confirmed': self.delivery_date_confirmed.isoformat() if self.delivery_date_confirmed else None,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'items': [item.to_dict() for item in self.items],
            'payments': [payment.to_dict() for payment in self.payments]
        }

class PurchaseOrderItem(db.Model):
    __tablename__ = 'purchase_order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    purchase_order_id = db.Column(db.Integer, db.ForeignKey('purchase_orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    product_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    total_price = db.Column(db.Numeric(12, 2), nullable=False)
    received_quantity = db.Column(db.Integer, default=0)
    
    def to_dict(self):
        return {
            'id': self.id,
            'purchase_order_id': self.purchase_order_id,
            'product_id': self.product_id,
            'product_name': self.product_name,
            'description': self.description,
            'quantity': self.quantity,
            'unit_price': float(self.unit_price) if self.unit_price else 0.0,
            'total_price': float(self.total_price) if self.total_price else 0.0,
            'received_quantity': self.received_quantity
        }

class Payment(db.Model):
    __tablename__ = 'payments'
    
    id = db.Column(db.Integer, primary_key=True)
    purchase_order_id = db.Column(db.Integer, db.ForeignKey('purchase_orders.id'), nullable=False)
    payment_number = db.Column(db.String(50), unique=True, nullable=False)
    amount = db.Column(db.Numeric(12, 2), nullable=False)
    currency = db.Column(db.String(3), default='SAR')
    payment_method = db.Column(db.String(50), nullable=False)
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.Enum('pending', 'completed', 'failed', 'refunded', name='payment_status'), default='pending')
    transaction_id = db.Column(db.String(100))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'purchase_order_id': self.purchase_order_id,
            'payment_number': self.payment_number,
            'amount': float(self.amount) if self.amount else 0.0,
            'currency': self.currency,
            'payment_method': self.payment_method,
            'payment_date': self.payment_date.isoformat() if self.payment_date else None,
            'status': self.status,
            'transaction_id': self.transaction_id,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class FavoriteSupplier(db.Model):
    __tablename__ = 'favorite_suppliers'
    
    id = db.Column(db.Integer, primary_key=True)
    merchant_id = db.Column(db.Integer, db.ForeignKey('merchants.id'), nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=False)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('merchant_id', 'supplier_id'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'merchant_id': self.merchant_id,
            'supplier_id': self.supplier_id,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }



class MerchantReport(db.Model):
    __tablename__ = 'merchant_reports'
    
    id = db.Column(db.Integer, primary_key=True)
    merchant_id = db.Column(db.Integer, db.ForeignKey('merchants.id'), nullable=False)
    report_type = db.Column(db.Enum('purchases', 'payments', 'suppliers', 'inventory', 'profit_loss', name='merchant_report_types'), nullable=False)
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
            'merchant_id': self.merchant_id,
            'report_type': self.report_type,
            'title': self.title,
            'description': self.description,
            'date_from': self.date_from.isoformat() if self.date_from else None,
            'date_to': self.date_to.isoformat() if self.date_to else None,
            'data': self.get_data(),
            'file_path': self.file_path,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

