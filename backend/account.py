from flask_sqlalchemy import SQLAlchemy
from flask import request, jsonify

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)

class Attendee(User):
    __tablename__ = 'attendees'
    id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    organization = db.Column(db.String(100))

class Learner(Attendee):
    __tablename__ = 'learners'
    id = db.Column(db.Integer, db.ForeignKey('attendees.id'), primary_key=True)
    student_id = db.Column(db.String(50))
    institution = db.Column(db.String(100))

def create_user(username, email, password, user_type='user', **kwargs):
    if user_type == 'learner':
        new_user = Learner(
            username=username,
            email=email,
            password=password,
            student_id=kwargs.get('student_id'),
            institution=kwargs.get('institution'),
            organization=kwargs.get('organization')
        )
    elif user_type == 'attendee':
        new_user = Attendee(
            username=username,
            email=email,
            password=password,
            organization=kwargs.get('organization')
        )
    else:
        new_user = User(
            username=username,
            email=email,
            password=password
        )
    
    db.session.add(new_user)
    db.session.commit()
    return new_user

def get_users():
    users = User.query.all()
    return [{"id": user.id, "username": user.username, "email": user.email} for user in users]

def sign_in():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    user_type = data.get("type", "user")
    
    if not username or not email or not password:
        return jsonify({"message": "All fields (username, email, password) are required!"}), 400
    
    try:
        new_user = create_user(
            username, email, password, user_type,
            student_id=data.get("student_id"),
            institution=data.get("institution"),
            organization=data.get("organization")
        )
        return jsonify({
            "message": "User added successfully!",
            "user": {
                "id": new_user.id,
                "username": new_user.username,
                "email": new_user.email,
                "type": user_type
            }
        }), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 400