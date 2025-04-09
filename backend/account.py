from flask_sqlalchemy import SQLAlchemy
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    user_type = db.Column(db.String(150), nullable=False)  # String type for user role
    interests = db.Column(db.String(255), nullable=True)  # Optional field

def create_user(username, email, password, user_type='user', interests=None):
    new_user = User(
        username=username,
        email=email,
        password=password,
        user_type=user_type,
        interests=interests
    )
    
    db.session.add(new_user)
    db.session.commit()
    return new_user

def get_users():
    users = User.query.all()
    return [{
        "id": user.id, 
        "username": user.username, 
        "email": user.email, 
        "user_type": user.user_type, 
        "interests": user.interests
    } for user in users]

def get_users_by_role(role):
    users = User.query.filter_by(user_type=role).all()
    return [{
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "user_type": user.user_type,
        "interests": user.interests
    } for user in users]

def get_all_user_emails():
    users = User.query.all()
    return [user.email for user in users]
def sign_in():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    user_type = data.get("user_type", "user")
    interests = data.get("interests")

    if not username or not email or not password:
        return jsonify({"message": "All fields (username, email, password) are required!"}), 400
    
    try:
        new_user = create_user(username, email, password, user_type, interests)
        return jsonify({
            "message": "User added successfully!",
            "user": {
                "id": new_user.id,
                "username": new_user.username,
                "email": new_user.email,
                "password": new_user.password,
                "user_type": new_user.user_type,
                "interests": new_user.interests
            }
        }), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 400

def log_in():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required!"}), 400

    user = User.query.filter_by(email=email).first()
    if user:
        if user.password == password:  # Direct comparison for plain text passwords
            
            return jsonify({
                "message": "Login successful!",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "user_type": user.user_type,
                    "interests": user.interests
                }
            }), 200
        else:
            return jsonify({"message": "Invalid password!"}), 401
    else:
        return jsonify({"message": "User not found!"}), 404


