from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS, cross_origin
from account import db, sign_in, get_users, log_in,get_users_by_role, get_all_user_emails, User
from event import create_event, get_events, get_event_by_id,get_events_by_organizer, fetch_event_by_id #register_for_event
from ticketdescription import create_ticket_description, get_ticket_desc, get_ticket_descriptions_by_event
from venue import create_venue, get_venues
from tickets import get_tickets
from flask import Flask, request, jsonify
from sendEmail import Director, Builder, send_email
import os
from dotenv import load_dotenv
from flask_socketio import SocketIO, join_room, leave_room, emit
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app, support_credentials=True)


# Configure CORS to allow all routes from your React app
CORS(app, resources={
   r"/*": {
       "origins": ["http://localhost:3000"],
       "methods": ["GET", "POST", "PUT", "DELETE"],
       "allow_headers": ["Content-Type"]
    }
})

# Database Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+mysqlconnector://sql5770341:mP8Mx9h2IU@sql5.freesqldatabase.com:3306/sql5770341"
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

@app.route('/create_venue', methods=['POST'])
@cross_origin(origin='http://localhost:3000')
def create_venue_route():
    return create_venue()

@app.route('/venues', methods=['GET'])
@cross_origin(origin='http://localhost:3000')
def get_venues_route():
    return get_venues()


@app.route('/users/by_role', methods=['GET'])
@cross_origin(origin='http://localhost:3000')
def get_users_by_role_route():
    role = request.args.get('role')  # Get role from query parameters
    if not role:
        return jsonify({"message": "Role parameter is required!"}), 400
    
    users = get_users_by_role(role)
    if not users:
        return jsonify({"message": f"No users found with the role: {role}"}), 404
    
    return jsonify({"users": users}), 200

@app.route('/events/organizer/<int:organizer_id>', methods=['GET'])
@cross_origin(origin='http://localhost:3000')
def fetch_events_by_organizer(organizer_id):
    return get_events_by_organizer(organizer_id)


@app.route("/login", methods=["POST"])
@cross_origin(origin='http://localhost:3000')
def login():
    return log_in()  # Call log_in function from account.py

from flask import jsonify, request
from flask_cors import cross_origin

@app.route("/emailSending", methods=["GET"])
@cross_origin(origin='http://localhost:3000')
def send_email_via_blast():
    try:
        event_id = request.args.get('eventId')
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
        "eventOrganizer": event["organizerid"],  # You could join with user table for name
        "eventImg": event["event_img"],
        "socialMediaLink": event["social_media_link"]
        }

        director = Director(event_data)
        builder = Builder()
        email_html = director.construct(builder)

        print("✅ Email HTML generated")

        useremails = get_all_user_emails()
        print("✅ User emails:", useremails)

        subject = event.get("eventname")
        print("✅ Email subject:", subject)

        # Make sure all components are not None
        if not all([email_html, subject, useremails]):
            return jsonify({"error": "Missing email data"}), 500

        send_email(useremails, subject, email_html)

        return jsonify({"message": "✅ Email campaign sent successfully."}), 200

    except Exception as e:
        print(f"❌ Error in /emailSending: {e}")
        return jsonify({"error": str(e)}), 500


    

# SocketIO Event Handlers for Real-Time Chat
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

@socketio.on('connect')
def handle_connect():
    print('Client connected:', request.sid)

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected:', request.sid)

@socketio.on('join')
def handle_join(data):
    room = data['room']
    user_id = data.get('userId')
    username = data.get('username', 'Guest')
    join_room(room)
    with app.app_context():
        user = db.session.query(User).filter_by(id=user_id).first()
        if user:
            # Validate username
            if user.username != username:
                print(f'Username mismatch for user ID {user_id}: expected {user.username}, got {username}')
                emit('receiveMessage', {'user': 'System', 'message': 'Invalid user'}, room=room)
                return
            print(f'Client {request.sid} (User ID: {user_id}, Username: {username}) joined room: {room}')
            emit('receiveMessage', {'user': 'System', 'message': f'{username} has joined the room!'}, room=room)
        else:
            print(f'Client (invalid user ID: {user_id}) joined room: {room}')
            emit('receiveMessage', {'user': 'System', 'message': 'A user has joined the room!'}, room=room)

@socketio.on('leave')
def handle_leave(data):
    room = data['room']
    user_id = data.get('userId')
    username = data.get('username', 'Guest')
    leave_room(room)
    with app.app_context():
        user = db.session.query(User).filter_by(id=user_id).first()
        if user and user.username == username:
            print(f'Client {request.sid} (User ID: {user_id}, Username: {username}) left room: {room}')
            emit('receiveMessage', {'user': 'System', 'message': f'{username} has left the room!'}, room=room)
        else:
            print(f'Client (invalid user ID: {user_id}) left room: {room}')
            emit('receiveMessage', {'user': 'System', 'message': 'A user has left the room!'}, room=room)

@socketio.on('sendMessage')
def handle_send_message(data):
    room = data['room']
    message = data['message']
    user_id = data.get('userId')
    username = data.get('username', 'Guest')
    with app.app_context():
        user = db.session.query(User).filter_by(id=user_id).first()
        if user:
            # Validate username
            if user.username != username:
                print(f'Username mismatch for user ID {user_id}: expected {user.username}, got {username}')
                emit('receiveMessage', {'user': 'System', 'message': 'Invalid user'}, room=room)
                return
            print(f'Message from {username} in room {room}: {message}')
            emit('receiveMessage', {'user': username, 'message': message}, room=room)
        else:
            print(f'Message from invalid user ID {user_id} in room {room}: {message}')
            emit('receiveMessage', {'user': 'Guest', 'message': message}, room=room)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create tables if they don't exist
    socketio.run(app, debug=True, host="0.0.0.0", port=5000)