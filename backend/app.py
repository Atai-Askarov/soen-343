from flask import Flask, render_template, jsonify, request, send_from_directory, redirect
from flask_migrate import Migrate
from flask_cors import CORS, cross_origin
from account import db, sign_in, get_users, log_in,get_users_by_role, get_all_user_emails, User
from event import create_event, get_events, get_event_by_id,get_events_by_organizer, fetch_event_by_id #register_for_event
from ticketdescription import create_ticket_description, get_ticket_desc, get_ticket_descriptions_by_event
from venue import create_venue, get_venues, get_venue_by_id
from tickets import get_tickets, get_tickets_by_user, create_ticket
from budget_items import create_budget_item, get_budget_items_by_event, delete_budget_item
from flask import Flask, request, jsonify
from sendEmail import Director, Builder, send_email
from datetime import datetime
import os
from dotenv import load_dotenv
from flask_socketio import SocketIO, join_room, leave_room, emit
from dotenv import load_dotenv
from attendance import get_attendance_by_event


from stripe.error import StripeError, CardError, InvalidRequestError, AuthenticationError, APIConnectionError, RateLimitError


# Import the sponsorship blueprint
from sponsorship import sponsorship_bp, create_sponsorship

# ───── ENVIRONMENT & APP INITIALIZATION ─────────────────────────
load_dotenv()
import stripe
import json
import os
from dotenv import load_dotenv, find_dotenv


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

# Initialize the database and migration
db.init_app(app)
migrate = Migrate(app, db)



# Fetch the Checkout Session to display the JSON result on the success page
@app.route('/checkout-session', methods=['GET'])
def get_checkout_session():
    id = request.args.get('sessionId')
    checkout_session = stripe.checkout.Session.retrieve(id)
    return jsonify(checkout_session)


@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        data = request.get_json()
        product_type = data.get("product_type")
        price_id = None
        
        # Handle ticket or sponsorship data
        if product_type == "ticket":
            ticket_response = create_ticket()
            if ticket_response[1] != 201:
                return jsonify({"error": "Ticket creation failed"}), 400
            ticket_data = ticket_response[0].json
            price_id = ticket_data.get("price_id")
        else:
            sponsorship_response = create_sponsorship()
            if sponsorship_response[1] != 201:
                return jsonify({"error": "Sponsorship creation failed"}), 400
            sponsorship_data = sponsorship_response[0].get_json()
            price_id = sponsorship_data.get("sponsorship", {}).get("stripe_price_id") if product_type != "ticket" else product.get("ticket", {}).get("stripe_price_id")
        
        # Extract the price_id depending on the product type
        
        if not price_id:
            return jsonify({"error": "Price ID missing for the product"}), 400
        
        # Create the Stripe Checkout session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': price_id,
                'quantity': 1,
            }],
            mode='payment',
            success_url='http://localhost:3000/success',
            cancel_url='http://localhost:3000/canceled',
        )
        
        # Return the URL for redirection
        return jsonify({'url': checkout_session.url}), 200
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.data
    sig_header = request.headers.get('Stripe-Signature')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, stripe.api_key
        )
    except ValueError as e:
        return 'Invalid payload', 400
    except stripe.error.SignatureVerificationError as e:
        return 'Invalid signature', 400

    if event['type'] == 'checkout.session.expired':
        session = event['data']['object']
        product_id = session['metadata']['product_id']
        
        try:
            # Archive the product
            stripe.Product.modify(
                product_id,
                active=False
            )
        except Exception as e:
            print(f"Error archiving product: {str(e)}")

    return '', 200

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

@app.route('/get_tickets_by_user/<int:user_id>', methods=['GET'])
@cross_origin(origin='http://localhost:3000')
def get_tickets_by_user_route(user_id):
    return get_tickets_by_user(user_id)


@app.route('/get_ticket_desc', methods=['GET'])
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

## ENDPOINT FOR ANALYTICS
@app.route('/tickets/<int:event_id>', methods=['GET'])
@cross_origin(origin='http://localhost:3000')
def tickets_by_event(event_id):
    """Get all tickets for a specific event."""
    return get_tickets_by_event(event_id)

@app.route('/attendance/<int:event_id>', methods=['GET'])
@cross_origin(origin='http://localhost:3000')
def attendance_by_event(event_id):
    """Get attendance data for a specific event."""
    return get_attendance_by_event(event_id)

# Additional attendance endpoints to implement
@app.route('/attendance/checkin', methods=['POST'])
@cross_origin(origin='http://localhost:3000')
def checkin_attendee():
    """Record an attendee checking in to an event."""
    from attendance import check_in_attendee
    return check_in_attendee()

@app.route('/attendance/batch-checkin', methods=['POST'])
@cross_origin(origin='http://localhost:3000')
def batch_checkin():
    """Check in multiple attendees at once."""
    from attendance import batch_check_in
    return batch_check_in()

@app.route('/attendance/<int:attendance_id>', methods=['PUT'])
@cross_origin(origin='http://localhost:3000')
def update_attendance_record(attendance_id):
    """Update an attendance record."""
    from attendance import update_attendance
    return update_attendance(attendance_id)

@app.route('/attendance/stats', methods=['GET'])
@cross_origin(origin='http://localhost:3000')
def attendance_statistics():
    """Get attendance statistics across events."""
    event_id = request.args.get('event_id')
    from attendance import get_attendance_statistics
    return get_attendance_statistics(event_id)


@app.route('/create_venue', methods=['POST'])
@cross_origin(origin='http://localhost:3000')
def create_venue_route():
    return create_venue()

@app.route("/venues", methods=["GET"])
@cross_origin(origin='http://localhost:3000')
def get_venues_route():
    return get_venues()

@app.route('/venues/<int:venue_id>', methods=['GET'])
@cross_origin(origin='http://localhost:3000')
def get_venue_by_id_route(venue_id):
    return get_venue_by_id(venue_id)

@app.route('/users/by_role', methods=['GET'])
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

@app.route('/create_budget_item', methods=['POST'])
@cross_origin(origin='http://localhost:3000')
def create_budget_item_route():
    return create_budget_item()

@app.route('/budget_items/<int:event_id>', methods=['GET'])
@cross_origin(origin='http://localhost:3000')
def fetch_budget_items_by_event(event_id):
    return get_budget_items_by_event(event_id)

@app.route('/delete_budget_item/<int:item_id>', methods=['DELETE'])
@cross_origin(origin='http://localhost:3000')
def delete_budget_item_route(item_id):
    return delete_budget_item(item_id)



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


# FOR QUESTIONS
from questions import Question, create_question, get_questions_by_event, answer_question
@app.route('/questions', methods=['POST'])
@cross_origin(origin='http://localhost:3000')
def submit_question():
    """Create a new question"""
    return create_question()

@app.route('/questions/<int:event_id>', methods=['GET'])
@cross_origin(origin='http://localhost:3000')
def get_event_questions(event_id):
    """Get all questions for an event"""
    return get_questions_by_event(event_id)

@app.route('/questions/answer/<int:question_id>', methods=['POST'])
@cross_origin(origin='http://localhost:3000')
def post_answer(question_id):
    """Answer a question"""
    return answer_question(question_id)

# For findint users with similar interests
@app.route('/events/<int:event_id>/similar-interests/<int:user_id>', methods=['GET'])
@cross_origin(origin='http://localhost:3000')
def find_similar_interest_attendees(event_id, user_id):
    """Find attendees with similar interests for an event"""
    try:
        # Get the current user's interests
        current_user = User.query.get(user_id)
        if not current_user or not current_user.interests:
            return jsonify({"message": "User not found or has no interests", "similar_attendees": []}), 200
            
        user_interests = current_user.interests.lower().split(',')
        
        # Find tickets for this event
        from tickets import Ticket
        ticket_users = db.session.query(Ticket.userid).filter_by(eventid=event_id).distinct().all()
        user_ids = [t[0] for t in ticket_users]
        
        # Find users with similar interests who are attending this event
        similar_attendees = []
        for uid in user_ids:
            if uid == user_id:  # Skip the current user
                continue
                
            attendee = User.query.get(uid)
            if not attendee or not attendee.interests:
                continue
                
            attendee_interests = attendee.interests.lower().split(',')
            shared_interests = set(user_interests) & set(attendee_interests)
            
            if shared_interests:
                similar_attendees.append({
                    "id": attendee.id,
                    "username": attendee.username,
                    "sharedInterest": list(shared_interests)[0].capitalize()  # Just use the first shared interest
                })
                
        return jsonify({"similar_attendees": similar_attendees}), 200
        
    except Exception as e:
        print(f"Error finding similar attendees: {str(e)}")
        return jsonify({"message": f"Error: {str(e)}", "similar_attendees": []}), 500

if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create tables if they don't exist
    socketio.run(app, debug=True, host="0.0.0.0", port=5000)