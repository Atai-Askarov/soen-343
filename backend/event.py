from flask import request, jsonify
from account import db, User
from sqlalchemy import exc
from datetime import datetime

class Event(db.Model):
    __tablename__ = 'events'
    
    # Column names updated to match the database schema
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Changed to 'id' as per your schema
    eventname = db.Column(db.String(100), nullable=False)
    eventdate = db.Column(db.Date, nullable=False)
    eventstarttime = db.Column(db.DateTime, nullable=False)
    eventendtime = db.Column(db.DateTime, nullable=False)
    eventlocation = db.Column(db.String(100), nullable=False)
    eventdescription = db.Column(db.String(500), nullable=True)
    speakerid = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    organizerid = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_type = db.Column(db.String(50), nullable=False)
    
    # Relationships for speaker and organizer
    speaker = db.relationship('User', foreign_keys=[speakerid], backref='events_as_speaker', lazy=True)
    organizer = db.relationship('User', foreign_keys=[organizerid], backref='events_as_organizer', lazy=True)
    
    tickets = db.relationship('Ticket', backref='event', lazy=True)

    def __repr__(self):
        return f'<Event {self.eventname}>'

class Ticket(db.Model):
    __tablename__ = 'tickets'

    ticketid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    eventid = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)  # Changed to 'id' to match events table
    userid = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    user_email = db.Column(db.String(100), db.ForeignKey('users.email'), nullable=True)

    def __repr__(self):
        return f'<Ticket {self.ticketid}>'

def create_event():
    """Create a new event with all fields"""
    data = request.get_json()
    
    required_fields = [
        'eventname', 'eventdate', 'eventstarttime', 'eventendtime',
        'eventlocation', 'organizerid', 'event_type', 'speakerid'
    ]
    
    if not all(field in data for field in required_fields):
        return jsonify({
            "message": "Event name, date, start time, end time, location, organizer, type, and speaker are required!",
            "missing_fields": [field for field in required_fields if field not in data]
        }), 400
    
    try:
        new_event = Event(
            eventname=data['eventname'],
            eventdate=data['eventdate'],
            eventstarttime=data['eventstarttime'],
            eventendtime=data['eventendtime'],
            eventlocation=data['eventlocation'],
            eventdescription=data.get('eventdescription'),
            speakerid=data['speakerid'],
            organizerid=data['organizerid'],
            event_type=data['event_type']
        )
        
        db.session.add(new_event)
        db.session.commit()
        
        return jsonify({
            "message": "Event created successfully!",
            "eventid": new_event.id,  # Use 'id' instead of 'eventid'
            "eventname": new_event.eventname,
            "details": {
                "date": new_event.eventdate,
                "location": new_event.eventlocation,
                "type": new_event.event_type
            }
        }), 201
        
    except exc.IntegrityError as e:
        db.session.rollback()
        return jsonify({"message": "Database integrity error!", "error": str(e)}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error creating event: {str(e)}"}), 500

def get_events():
    """Retrieve all events from the database."""
    try:
        # Fetch all events from the database
        events = Event.query.all()
        
        # If no events are found, return an empty list
        if not events:
            return {"message": "No events found."}, 404
        
        # Serialize events into a list of dictionaries
        events_list = []
        for event in events:
            events_list.append({
                "eventid": event.id,  # Use 'id' instead of 'eventid'
                "eventname": event.eventname,
                "eventdate": event.eventdate,
                "eventstarttime": event.eventstarttime,
                "eventendtime": event.eventendtime,
                "eventlocation": event.eventlocation,
                "eventdescription": event.eventdescription,
                "speakerid": event.speakerid,
                "organizerid": event.organizerid,
                "event_type": event.event_type
            })
        
        # Return events as a dictionary, which Flask will automatically jsonify
        return {"events": events_list}, 200
        
    except Exception as e:
        return {"message": f"Error retrieving events: {str(e)}"}, 500

def get_event_by_id(event_id):
    """Retrieve an event by its ID from the database."""
    try:
        # Fetch the event by its ID
        event = Event.query.get(event_id)
        
        # If event is not found, return a 404 response
        if not event:
            return jsonify({"message": f"Event with ID {event_id} not found."}), 404
        
        # Serialize the event into a dictionary
        event_data = {
            "eventid": event.id,
            "eventname": event.eventname,
            "eventdate": event.eventdate,
            "eventstarttime": event.eventstarttime,
            "eventendtime": event.eventendtime,
            "eventlocation": event.eventlocation,
            "eventdescription": event.eventdescription,
            "speakerid": event.speakerid,
            "organizerid": event.organizerid,
            "event_type": event.event_type
        }
        
        # Return the event data as a JSON response
        return jsonify(event_data), 200
        
    except Exception as e:
        return jsonify({"message": f"Error retrieving event: {str(e)}"}), 500



# def register_for_event():
#     """Register a user for an event using email"""
#     data = request.get_json()
    
#     if 'email' not in data or 'eventid' not in data:
#         return jsonify({"message": "Email and Event ID are required!"}), 400
    
#     try:
#         user = User.query.filter_by(email=data['email']).first()
#         if not user:
#             return jsonify({"message": "User not found!"}), 404
        
#         event = Event.query.get(data['eventid'])
#         if not event:
#             return jsonify({"message": "Event not found!"}), 404
        
#         existing = db.session.query(Ticket).filter(
#             Ticket.user_email == data['email'],
#             Ticket.eventid == data['eventid']
#         ).first()
        
#         if existing:
#             return jsonify({
#                 "message": "Already registered for this event!",
#                 "ticketid": existing.ticketid
#             }), 409

#         ticket = Ticket(
#             eventid=data['eventid'],
#             user_email=data['email'],
#             userid=user.id
#         )
        
#         db.session.add(ticket)
#         db.session.commit()
        
#         return jsonify({
#             "message": "Registration successful!",
#             "ticketid": ticket.ticketid,
#             "event": event.eventname,
#             "user": user.username,
#             "email": user.email,
#             "timestamp": datetime.utcnow().isoformat()
#         }), 201
        
#     except exc.IntegrityError as e:
#         db.session.rollback()
#         return jsonify({"message": "Database error during registration", "error": str(e)}), 500
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"message": f"Registration error: {str(e)}"}), 500

