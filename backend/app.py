from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_cors import CORS
from account import db, User, sign_in, get_users
from event import create_event, register_for_event

import logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)
# Database Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+mysqlconnector://sql5768901:EDshaBtW7e@sql5.freesqldatabase.com/sql5768901"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize the database
db.init_app(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Define Routes
@app.route("/")
def hello_world():
    return "<p>Event Registration System</p>"

@app.route("/add_user", methods=["POST"])
def add_user():
    return sign_in()

@app.route("/users", methods=["GET"])
def users():
    return jsonify(get_users())

@app.route("/create_event", methods=["POST"])
def create_new_event():
    return create_event()

@app.route("/register_event", methods=["POST"])
def register_event():
    return register_for_event()

@app.route("/api/signUp", methods=["POST"])
def sign_up():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    user_type = data.get("type")
    interests = data.get("interests", "")

    if not email or not password or not user_type:
        return jsonify({"error": "Missing required fields"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Email already exists"}), 409

    new_user = User(email=email, password=password, user_type=user_type, interests=interests)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201


if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create tables if they don't exist
    app.run(debug=True, host="0.0.0.0", port=5000)
