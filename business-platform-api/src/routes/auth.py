from flask import Blueprint, request, jsonify, session, current_app
from src.models.supplier import db, User, Supplier
from werkzeug.security import generate_password_hash
import uuid
from datetime import datetime
from src.utils.jwt_utils import generate_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # التحقق من البيانات المطلوبة
        required_fields = ['username', 'email', 'password', 'full_name', 'user_type']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'حقل {field} مطلوب'}), 400
        
        # التحقق من عدم وجود المستخدم مسبقاً
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'اسم المستخدم موجود مسبقاً'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'البريد الإلكتروني موجود مسبقاً'}), 400
        
        # إنشاء المستخدم الجديد
        user = User(
            username=data['username'],
            email=data['email'],
            full_name=data['full_name'],
            phone=data.get('phone'),
            user_type=data['user_type']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # إنشاء ملف المورد إذا كان النوع مورد
        if data['user_type'] == 'supplier':
            supplier = Supplier(
                user_id=user.id,
                company_name=data.get('company_name', user.full_name),
                company_address=data.get('company_address'),
                tax_number=data.get('tax_number'),
                business_license=data.get('business_license'),
                description=data.get('description')
            )
            db.session.add(supplier)
            db.session.commit()
        
        return jsonify({
            'message': 'تم إنشاء الحساب بنجاح',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if 'username' not in data or 'password' not in data:
            return jsonify({'error': 'اسم المستخدم وكلمة المرور مطلوبان'}), 400
        
        user = User.query.filter_by(username=data['username']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'اسم المستخدم أو كلمة المرور غير صحيحة'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'الحساب غير مفعل'}), 401
        
        # حفظ معلومات المستخدم في الجلسة (للتوافق)
        session['user_id'] = user.id
        session['user_type'] = user.user_type

        # إنشاء رمز JWT
        token = generate_token(user.id, user.user_type)

        response_data = {
            'message': 'تم تسجيل الدخول بنجاح',
            'user': user.to_dict(),
            'token': token
        }
        
        # إضافة معلومات المورد إذا كان المستخدم مورد
        if user.user_type == 'supplier' and user.supplier:
            response_data['supplier'] = user.supplier.to_dict()
        
        return jsonify(response_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'تم تسجيل الخروج بنجاح'}), 200

@auth_bp.route('/profile', methods=['GET'])
def get_profile():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'يجب تسجيل الدخول أولاً'}), 401
        
        user = User.query.get(session['user_id'])
        if not user:
            return jsonify({'error': 'المستخدم غير موجود'}), 404
        
        response_data = {
            'user': user.to_dict()
        }
        
        if user.user_type == 'supplier' and user.supplier:
            response_data['supplier'] = user.supplier.to_dict()
        
        return jsonify(response_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['PUT'])
def update_profile():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'يجب تسجيل الدخول أولاً'}), 401
        
        user = User.query.get(session['user_id'])
        if not user:
            return jsonify({'error': 'المستخدم غير موجود'}), 404
        
        data = request.get_json()
        
        # تحديث بيانات المستخدم
        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'phone' in data:
            user.phone = data['phone']
        if 'email' in data:
            # التحقق من عدم وجود البريد الإلكتروني لمستخدم آخر
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user and existing_user.id != user.id:
                return jsonify({'error': 'البريد الإلكتروني موجود مسبقاً'}), 400
            user.email = data['email']
        
        user.updated_at = datetime.utcnow()
        
        # تحديث بيانات المورد إذا كان المستخدم مورد
        if user.user_type == 'supplier' and user.supplier:
            supplier = user.supplier
            if 'company_name' in data:
                supplier.company_name = data['company_name']
            if 'company_address' in data:
                supplier.company_address = data['company_address']
            if 'tax_number' in data:
                supplier.tax_number = data['tax_number']
            if 'business_license' in data:
                supplier.business_license = data['business_license']
            if 'description' in data:
                supplier.description = data['description']
            if 'logo_url' in data:
                supplier.logo_url = data['logo_url']
        
        db.session.commit()
        
        response_data = {
            'message': 'تم تحديث الملف الشخصي بنجاح',
            'user': user.to_dict()
        }
        
        if user.user_type == 'supplier' and user.supplier:
            response_data['supplier'] = user.supplier.to_dict()
        
        return jsonify(response_data), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/change-password', methods=['POST'])
def change_password():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'يجب تسجيل الدخول أولاً'}), 401
        
        user = User.query.get(session['user_id'])
        if not user:
            return jsonify({'error': 'المستخدم غير موجود'}), 404
        
        data = request.get_json()
        
        if 'current_password' not in data or 'new_password' not in data:
            return jsonify({'error': 'كلمة المرور الحالية والجديدة مطلوبتان'}), 400
        
        if not user.check_password(data['current_password']):
            return jsonify({'error': 'كلمة المرور الحالية غير صحيحة'}), 400
        
        if len(data['new_password']) < 6:
            return jsonify({'error': 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل'}), 400
        
        user.set_password(data['new_password'])
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'message': 'تم تغيير كلمة المرور بنجاح'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

