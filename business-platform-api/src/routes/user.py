from flask import Blueprint, jsonify, request
from src.models.supplier import User, db, Supplier

user_bp = Blueprint('user', __name__)

@user_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.json
    user = User(
        username=data['username'], 
        email=data['email'],
        full_name=data.get('full_name', ''),
        phone=data.get('phone', ''),
        user_type=data.get('user_type', 'merchant')
    )
    if 'password' in data:
        user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.json
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    user.full_name = data.get('full_name', user.full_name)
    user.phone = data.get('phone', user.phone)
    user.user_type = data.get('user_type', user.user_type)
    if 'password' in data:
        user.set_password(data['password'])
    db.session.commit()
    return jsonify(user.to_dict())

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return '', 204

@user_bp.route('/users/suppliers', methods=['GET'])
def get_suppliers():
    """
    Get a list of all suppliers with their details for the marketplace.
    """
    # Querying both User and Supplier, and joining them.
    # This allows access to both user info (like email, phone) and supplier info (company_name, etc.)
    suppliers_query = db.session.query(User, Supplier).join(Supplier, User.id == Supplier.user_id).filter(User.user_type == 'supplier').all()
    
    supplier_list = []
    for user, supplier in suppliers_query:
        # Using to_dict() methods from the models
        user_data = user.to_dict()
        supplier_data = supplier.to_dict()
        
        # Merging the dictionaries.
        # We can create a new dictionary with the fields needed for the frontend.
        # This gives us more control over the exposed data.
        supplier_info = {
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'full_name': user.full_name,
            'phone': user.phone,
            'supplier_id': supplier.id,
            'company_name': supplier.company_name,
            'company_address': supplier.company_address,
            'description': supplier.description,
            'rating': supplier.rating,
            'total_orders': supplier.total_orders,
            # Add any other fields from Supplier or User model that are needed
        }
        supplier_list.append(supplier_info)

    return jsonify(supplier_list)
