import json
try:
    from src.models.supplier import db, User
    from src.main import app

    with app.app_context():
        users = User.query.all()
        print(json.dumps([{'id':u.id,'username':u.username,'email':u.email,'user_type':getattr(u,'user_type',None),'is_active':getattr(u,'is_active',None)} for u in users], ensure_ascii=False))
except Exception as e:
    import traceback, sys
    traceback.print_exc()
    sys.exit(1)
