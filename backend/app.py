from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS, cross_origin
from account import db, sign_in, get_users, log_in
from event import create_event, get_events, get_event_by_id #register_for_event
from ticketdescription import create_ticket_description, get_ticket_desc, get_ticket_descriptions_by_event 
from tickets import get_tickets
from flask import Flask, request, jsonify


app = Flask(__name__)
CORS(app, support_credentials=True)


# Configure CORS to allow all routes from your React app
#CORS(app, resources={
   # r"/*": {
    #    "origins": ["http://localhost:3000"],
     #   "methods": ["GET", "POST", "PUT", "DELETE"],
      #  "allow_headers": ["Content-Type"]
    #}
#})

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
@cross_origin(origin='http://localhost:3000')
def add_user():
    return sign_in()

@app.route("/users", methods=["GET"])
@cross_origin(origin='http://localhost:3000')
def users():
    return jsonify(get_users())


@app.route("/create_event", methods=["POST"])
@cross_origin(origin='http://localhost:3000')
def create_new_event():
    return create_event()

@app.route("/events", methods=["GET"])
@cross_origin(origin='http://localhost:3000')
def get_all_events():
    return get_events()

@app.route('/events/<int:event_id>', methods=['GET'])
@cross_origin(origin='http://localhost:3000')
def event_by_id(event_id):
    return get_event_by_id(event_id)


@app.route('/get_tickets', methods=['GET'])
@cross_origin(origin='http://localhost:3000')
def get_all_tickets():
    return get_tickets()

@app.route('/get_ticket_desc', methods=['GET'])
@cross_origin(origin='http://localhost:3000')
def fetch_ticket_descriptions():
    return get_ticket_desc()


@app.route('/create_ticket_description', methods=['POST'])
@cross_origin(origin='http://localhost:3000')
def create_ticket_desc():
    return create_ticket_description()

@app.route('/ticket-descriptions/<int:event_id>', methods=['GET'])
@cross_origin(origin='http://localhost:3000')
def ticket_description_by_id(event_id):
    return get_ticket_descriptions_by_event(event_id)

# @app.route("/register_event", methods=["POST"])
# def register_event():
#     return register_for_event()

@app.route("/login", methods=["POST"])
@cross_origin(origin='http://localhost:3000')
def login():
    return log_in()  # Call log_in function from account.py

if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create tables if they don't exist
    app.run(debug=True, host="0.0.0.0", port=5000)
    
@app.route('/emailSending', methods=['GET'])
@cross_origin(origin='http://localhost:3000')
def get_all_ticket_desc():
    return get_ticket_desc()