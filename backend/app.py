from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from account import db, User, sign_in, get_users, log_in
from event import create_event, register_for_event
from flask import Flask, request, jsonify


app = Flask(__name__)

# Configure CORS to allow all routes from your React app
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
})

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

@app.route("/login", methods=["POST"])
def login():
    return log_in()  # Call log_in function from account.py

# Add to your Flask app
@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found!"}), 404
    
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "user_type": user.user_type,
        "interests": user.interests
    }), 200




if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create tables if they don't exist
    app.run(debug=True, host="0.0.0.0", port=5000)