# app.py
from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_cors import CORS, cross_origin
from account import db, sign_in, get_users, log_in, get_users_by_role, get_all_user_emails
from event import create_event, get_events, get_event_by_id, get_events_by_organizer, fetch_event_by_id
from ticketdescription import create_ticket_description, get_ticket_desc, get_ticket_descriptions_by_event
from venue import create_venue, get_venues
from tickets import get_tickets
from sendEmail import Director, Builder, send_email
from datetime import datetime
import os
from dotenv import load_dotenv

# Import the sponsorship blueprint
from sponsorship import sponsorship_bp

# ───── ENVIRONMENT & APP INITIALIZATION ─────────────────────────
load_dotenv()
app = Flask(__name__)
CORS(app, support_credentials=True)

# ───── DATABASE CONFIGURATION ─────────────────────────────────────
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+mysqlconnector://sql5770341:mP8Mx9h2IU@sql5.freesqldatabase.com:3306/sql5770341"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize the database and migration
db.init_app(app)
migrate = Migrate(app, db)

# Register the sponsorship blueprint (it handles /packages and /sponsorship endpoints)
app.register_blueprint(sponsorship_bp)

# ───── ROUTES ─────────────────────────────────────────────────────
@app.route("/")
def home():
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

@app.route("/events/<int:event_id>", methods=["GET"])
@cross_origin(origin='http://localhost:3000')
def event_by_id(event_id):
    return get_event_by_id(event_id)

@app.route("/get_tickets", methods=["GET"])
@cross_origin(origin='http://localhost:3000')
def get_all_tickets():
    return get_tickets()

@app.route("/get_ticket_desc", methods=["GET"])
@cross_origin(origin='http://localhost:3000')
def fetch_ticket_descriptions():
    return get_ticket_desc()

@app.route("/create_ticket_description", methods=["POST"])
@cross_origin(origin='http://localhost:3000')
def create_ticket_desc():
    return create_ticket_description()

@app.route("/ticket-descriptions/<int:event_id>", methods=["GET"])
@cross_origin(origin='http://localhost:3000')
def ticket_description_by_id(event_id):
    return get_ticket_descriptions_by_event(event_id)

@app.route("/create_venue", methods=["POST"])
@cross_origin(origin='http://localhost:3000')
def create_venue_route():
    return create_venue()

@app.route("/venues", methods=["GET"])
@cross_origin(origin='http://localhost:3000')
def get_venues_route():
    return get_venues()

@app.route("/users/by_role", methods=["GET"])
@cross_origin(origin='http://localhost:3000')
def get_users_by_role_route():
    role = request.args.get("role")
    if not role:
        return jsonify({"message": "Role parameter is required!"}), 400
    users_list = get_users_by_role(role)
    if not users_list:
        return jsonify({"message": f"No users found with the role: {role}"}), 404
    return jsonify({"users": users_list}), 200

@app.route("/events/organizer/<int:organizer_id>", methods=["GET"])
@cross_origin(origin='http://localhost:3000')
def fetch_events_by_organizer(organizer_id):
    return get_events_by_organizer(organizer_id)

@app.route("/login", methods=["POST"])
@cross_origin(origin='http://localhost:3000')
def login():
    return log_in()

@app.route("/emailSending", methods=["GET"])
@cross_origin(origin='http://localhost:3000')
def send_email_via_blast():
    try:
        event_id = request.args.get("eventId")
        if not event_id:
            return jsonify({"error": "Missing eventId"}), 400

        event = fetch_event_by_id(event_id)
        if not event:
            return jsonify({"error": f"No event found for ID {event_id}"}), 404

        event_data = {
            "eventId": event["eventid"],
            "eventName": event["eventname"],
            "eventDate": event["eventdate"].strftime("%B %d, %Y"),
            "eventStartTime": event["eventstarttime"].strftime("%I:%M %p"),
            "eventEndTime": event["eventendtime"].strftime("%I:%M %p"),
            "eventLocation": event["eventlocation"],
            "eventType": event["event_type"],
            "eventDescription": event["eventdescription"],
            "eventOrganizer": event["organizerid"],
            "eventImg": event["event_img"],
            "socialMediaLink": event["social_media_link"]
        }

        director = Director(event_data)
        builder = Builder()
        email_html = director.construct(builder)
        useremails = get_all_user_emails()
        subject = event.get("eventname")

        if not all([email_html, subject, useremails]):
            return jsonify({"error": "Missing email data"}), 500

        send_email(useremails, subject, email_html)
        return jsonify({"message": "✅ Email campaign sent successfully."}), 200

    except Exception as e:
        print(f"❌ Error in /emailSending: {e}")
        return jsonify({"error": str(e)}), 500

# ───── MAIN ─────────────────────────────────────────────────────
if __name__ == "__main__":
    with app.app_context():
        # For development, create tables if they do not exist.
        db.create_all()
    app.run(debug=True, host="0.0.0.0", port=5000)
