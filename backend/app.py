from flask import Flask, jsonify
from flask_migrate import Migrate
from account import db, User, sign_in, get_users
from event import create_event, register_for_event

app = Flask(__name__)

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

if __name__ == "__main__":
    app.run(debug=True)