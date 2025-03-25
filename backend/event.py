from flask import request, jsonify
from account import db, User
from sqlalchemy import exc
from sqlalchemy.sql import func
from datetime import datetime

class Event(db.Model):
    __tablename__ = 'events'
    
    eventid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    eventname = db.Column(db.String(100), nullable=False)
    eventdate = db.Column(db.String(50), nullable=False)
    eventlocation = db.Column(db.String(100), nullable=False)
    eventdescription = db.Column(db.String(255), nullable=True)
    
    tickets = db.relationship('Ticket', backref='event', lazy=True)

    def __repr__(self):
        return f'<Event {self.eventname}>'

class Ticket(db.Model):
    __tablename__ = 'tickets'

    ticketid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    eventid = db.Column(db.Integer, db.ForeignKey('events.eventid'), nullable=False)
    userid = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # Making nullable temporarily
    user_email = db.Column(db.String(100), db.ForeignKey('users.email'), nullable=True)  # New column
    
    # Add this if you want to maintain a relationship without foreign key constraint
    # user = db.relationship('User', 
    #           primaryjoin="Ticket.user_email == User.email",
    #           backref='tickets',
    #           viewonly=True)

    def __repr__(self):
        return f'<Ticket {self.ticketid}>'

def create_event():
    """Create a new event"""
    data = request.get_json()
    
    required_fields = ['eventname', 'eventdate', 'eventlocation']
    if not all(field in data for field in required_fields):
        return jsonify({"message": "Event name, date, and location are required!"}), 400
    
    try:
        new_event = Event(
            eventname=data['eventname'],
            eventdate=data['eventdate'],
            eventlocation=data['eventlocation'],
            eventdescription=data.get('eventdescription')
        )
        db.session.add(new_event)
        db.session.commit()
        
        return jsonify({
            "message": "Event created successfully!",
            "eventid": new_event.eventid,
            "eventname": new_event.eventname
        }), 201
        
    except exc.IntegrityError as e:
        db.session.rollback()
        return jsonify({"message": "Database integrity error!"}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error creating event: {str(e)}"}), 500

def register_for_event():
    """Register a user for an event using email"""
    data = request.get_json()
    
    if 'email' not in data or 'eventid' not in data:
        return jsonify({"message": "Email and Event ID are required!"}), 400
    
    try:
        # Verify user exists
        user = User.query.filter_by(email=data['email']).first()
        if not user:
            return jsonify({"message": "User not found!"}), 404
        
        # Verify event exists
        event = Event.query.get(data['eventid'])
        if not event:
            return jsonify({"message": "Event not found!"}), 404
        
        # Check for existing registration
        existing = db.session.query(Ticket).filter(
            Ticket.user_email == data['email'],
            Ticket.eventid == data['eventid']
        ).first()
        
        if existing:
            return jsonify({
                "message": "Already registered for this event!",
                "ticketid": existing.ticketid
            }), 409

        # Create ticket
        ticket = Ticket(
            eventid=data['eventid'],
            user_email=data['email']
        )
        
        db.session.add(ticket)
        db.session.commit()
        
        return jsonify({
            "message": "Registration successful!",
            "ticketid": ticket.ticketid,
            "event": event.eventname,
            "user": user.username,
            "timestamp": datetime.utcnow().isoformat()
        }), 201
        
    except exc.IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Database error during registration"}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Registration error: {str(e)}"}), 500

def migrate_database():
    """Helper function to migrate existing database"""
    with app.app_context():
        try:
            # Add user_email column if it doesn't exist
            db.engine.execute("""
                ALTER TABLE tickets 
                ADD COLUMN IF NOT EXISTS user_email VARCHAR(100)
            """)
            print("Database migration completed successfully")
        except Exception as e:
            print(f"Migration error: {str(e)}")