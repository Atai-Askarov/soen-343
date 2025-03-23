from flask_sqlalchemy import SQLAlchemy
from flask import request, jsonify

# Initialize database
db = SQLAlchemy()

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)

# Function to create a new user
def create_user(username, email, password):
    new_user = User(username=username, email=email, password=password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User added successfully!"})


# Function to get all users
def get_users():
    users = User.query.all()
    user_list = [{"id": user.id, "username": user.username, "email": user.email} for user in users]
    return jsonify(user_list)

# Function to handle user sign up (create a user through POST request)
def sign_in():
    data = request.get_json()  # Get data from the request (as JSON)
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    
    if not username or not email or not password:
        return jsonify({"message": "All fields (username, email, password) are required!"}), 400
    
    return create_user(username, email, password)
