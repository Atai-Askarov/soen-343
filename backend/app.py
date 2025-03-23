from flask import Flask, jsonify
from account import db, User, sign_in, get_users
from event import create_event, db  # Import create_event function and db

app = Flask(__name__)

# Database Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+mysqlconnector://sql5768901:EDshaBtW7e@sql5.freesqldatabase.com/sql5768901"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize the database
db.init_app(app)

# Create Database Tables
with app.app_context():
    db.create_all()

# Define Routes
@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

# Route to add a new user (sign up)
@app.route("/add_user", methods=["POST"])
def add_user():
    return sign_in()  # Calls the sign_in function to create a new user

# Route to get all users
@app.route("/users", methods=["GET"])
def users():
    return get_users()  # Get users from the account.py


# Route to create a new event
@app.route("/create_event", methods=["POST"])
def create_new_event():
    return create_event()  # Calls the create_event function from event.py to create an event

if __name__ == "__main__":
    app.run(debug=True)
