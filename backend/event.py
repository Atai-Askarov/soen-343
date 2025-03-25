from flask import request, jsonify
from account import db, User
from sqlalchemy import exc
from datetime import datetime

class Event(db.Model):
    __tablename__ = 'events'
    
    eventid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    eventname = db.Column(db.String(100), nullable=False)
    eventdate = db.Column(db.String(50), nullable=False)
    eventlocation = db.Column(db.String(100), nullable=False)
    eventdescription = db.Column(db.String(500), nullable=True)
    speaker = db.Column(db.String(100), nullable=True)
    stakeholder = db.Column(db.String(100), nullable=True)
    organizer = db.Column(db.String(100), nullable=False)
    event_type = db.Column(db.String(50), nullable=False)
    
    tickets = db.relationship('Ticket', backref='event', lazy=True)

    def __repr__(self):
        return f'<Event {self.eventname}>'

class Ticket(db.Model):
    __tablename__ = 'tickets'

    ticketid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    eventid = db.Column(db.Integer, db.ForeignKey('events.eventid'), nullable=False)
    userid = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    user_email = db.Column(db.String(100), db.ForeignKey('users.email'), nullable=True)

    def __repr__(self):
        return f'<Ticket {self.ticketid}>'

def create_event():
    """Create a new event with all fields"""
    data = request.get_json()
    
    required_fields = [
        'eventname', 'eventdate', 'eventlocation',
        'organizer', 'event_type'
    ]
    if not all(field in data for field in required_fields):
        return jsonify({
            "message": "Event name, date, location, organizer and type are required!",
            "missing_fields": [field for field in required_fields if field not in data]
        }), 400
    
    try:
        new_event = Event(
            eventname=data['eventname'],
            eventdate=data['eventdate'],
            eventlocation=data['eventlocation'],
            eventdescription=data.get('eventdescription'),
            speaker=data.get('speaker'),
            stakeholder=data.get('stakeholder'),
            organizer=data['organizer'],
            event_type=data['event_type']
        )
        
        db.session.add(new_event)
        db.session.commit()
        
        return jsonify({
            "message": "Event created successfully!",
            "eventid": new_event.eventid,
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

def register_for_event():
    """Register a user for an event using email"""
    data = request.get_json()
    
    if 'email' not in data or 'eventid' not in data:
        return jsonify({"message": "Email and Event ID are required!"}), 400
    
    try:
        user = User.query.filter_by(email=data['email']).first()
        if not user:
            return jsonify({"message": "User not found!"}), 404
        
        event = Event.query.get(data['eventid'])
        if not event:
            return jsonify({"message": "Event not found!"}), 404
        
        existing = db.session.query(Ticket).filter(
            Ticket.user_email == data['email'],
            Ticket.eventid == data['eventid']
        ).first()
        
        if existing:
            return jsonify({
                "message": "Already registered for this event!",
                "ticketid": existing.ticketid
            }), 409

        ticket = Ticket(
            eventid=data['eventid'],
            user_email=data['email'],
            userid=user.id
        )
        
        db.session.add(ticket)
        db.session.commit()
        
        return jsonify({
            "message": "Registration successful!",
            "ticketid": ticket.ticketid,
            "event": event.eventname,
            "user": user.username,
            "email": user.email,
            "timestamp": datetime.utcnow().isoformat()
        }), 201
        
    except exc.IntegrityError as e:
        db.session.rollback()
        return jsonify({"message": "Database error during registration", "error": str(e)}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Registration error: {str(e)}"}), 500

def migrate_database():
    """Helper function to migrate existing database"""
    with app.app_context():
        try:
            # Add new columns to events table
            db.engine.execute("""
                ALTER TABLE events 
                ADD COLUMN IF NOT EXISTS speaker VARCHAR(100)
            """)
            db.engine.execute("""
                ALTER TABLE events 
                ADD COLUMN IF NOT EXISTS stakeholder VARCHAR(100)
            """)
            db.engine.execute("""
                ALTER TABLE events 
                ADD COLUMN IF NOT EXISTS organizer VARCHAR(100) NOT NULL
            """)
            db.engine.execute("""
                ALTER TABLE events 
                ADD COLUMN IF NOT EXISTS event_type VARCHAR(50) NOT NULL
            """)
            print("Database migration completed successfully")
        except Exception as e:
            print(f"Migration error: {str(e)}")