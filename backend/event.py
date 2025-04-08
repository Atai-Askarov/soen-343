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
    social_media_link = db.Column(db.String(200), nullable=True)
    event_img = db.Column(db.String(255), nullable=True, default="/images/default.jpg") 
    venue_id = db.Column(db.Integer, db.ForeignKey('venue.id'), nullable=True)


    __table_args__ = (
        db.UniqueConstraint('eventname', 'eventdate', 'eventlocation', name='unique_event'),
        {'extend_existing': True} )
    
    # Relationships for speaker and organizer
    speaker = db.relationship('User', foreign_keys=[speakerid], backref='events_as_speaker', lazy=True)
    organizer = db.relationship('User', foreign_keys=[organizerid], backref='events_as_organizer', lazy=True)
    venue = db.relationship('Venue', backref='events', lazy=True)

    def __repr__(self):
        return f'<Event {self.eventname}>'

    # Singleton method
    @classmethod
    def get_instance(cls, eventname, eventdate, eventlocation, **kwargs):
        try:
            existing_event = cls.query.filter_by(
                eventname=eventname,
                eventdate=eventdate,
                eventlocation=eventlocation
            ).first()

            if existing_event:
                print(f"✅ Event already exists: {existing_event}")
                return existing_event

            print("🚀 Creating new event")
            new_event = cls(eventname=eventname, eventdate=eventdate, eventlocation=eventlocation, **kwargs)
            db.session.add(new_event)
            db.session.commit()
            return new_event
        
        except exc.IntegrityError as e:
            db.session.rollback()
            print(f"⚠️ Integrity Error: {e}")
            raise e
        except Exception as e:
            db.session.rollback()
            print(f"❗ Error Creating Event: {e}")
            raise e


def create_event():
    data = request.get_json()
    
    required_fields = [
        'eventname', 'eventdate', 'eventstarttime', 'eventendtime',
        'eventlocation', 'organizerid', 'event_type', 'speakerid', 'venue_id'
    ]
    
    if not all(field in data for field in required_fields):
        return jsonify({
            "message": "Missing required fields!",
            "missing_fields": [field for field in required_fields if field not in data]
        }), 400
    
    try:
        # Convert string inputs to date and datetime
        data['eventdate'] = datetime.strptime(data['eventdate'], "%Y-%m-%d").date()
        data['eventstarttime'] = datetime.strptime(data['eventstarttime'], "%Y-%m-%d %H:%M:%S")
        data['eventendtime'] = datetime.strptime(data['eventendtime'], "%Y-%m-%d %H:%M:%S")

        # Use singleton to check or create event
        new_event = Event.get_instance(
            eventname=data['eventname'],
            eventdate=data['eventdate'],
            eventstarttime=data['eventstarttime'],
            eventendtime=data['eventendtime'],
            eventlocation=data['eventlocation'],
            eventdescription=data.get('eventdescription'),
            speakerid=data['speakerid'],
            organizerid=data['organizerid'],
            event_type=data['event_type'],
            social_media_link=data.get('social_media_link'),
            event_img=data.get('event_img', "/images/default.jpg"),
            venue_id=data.get('venue_id')
        )
        
        return jsonify({
            "message": "Event created or retrieved successfully!",
            "eventid": new_event.id,
            "eventname": new_event.eventname
        }), 201
        
    except ValueError as e:
        return jsonify({"message": f"Invalid date or time format: {e}"}), 400
    except exc.IntegrityError as e:
        db.session.rollback()
        return jsonify({"message": "Database error!", "error": str(e)}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error: {str(e)}"}), 500


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
                "event_type": event.event_type,
                "event_img": event.event_img,
                "social_media_link": event.social_media_link,
                "venue_id": event.venue_id
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
            "event_type": event.event_type,
            "social_media_link": event.social_media_link,
            "event_img": event.event_img,
            "venue_id": event.venue_id
        }
        
        # Return the event data as a JSON response
        return jsonify(event_data), 200
        
    except Exception as e:
        return jsonify({"message": f"Error retrieving event: {str(e)}"}), 500

def fetch_event_by_id(event_id):
    try:
        event = Event.query.get(event_id)
        if not event:
            return None

        return {
            "eventid": event.id,
            "eventname": event.eventname,
            "eventdate": event.eventdate,
            "eventstarttime": event.eventstarttime,
            "eventendtime": event.eventendtime,
            "eventlocation": event.eventlocation,
            "eventdescription": event.eventdescription,
            "speakerid": event.speakerid,
            "organizerid": event.organizerid,
            "event_type": event.event_type,
            "social_media_link": event.social_media_link,
            "event_img": event.event_img,
            "venue_id": event.venue_id
        }
    except Exception as e:
        return {"message": f"Error retrieving event: {str(e)}"}, 500

def get_events_by_organizer(organizer_id):
    """Retrieve events for a specific organizer (user) from the database."""
    try:
        # Fetch events for the specific organizer from the database
        events = Event.query.filter_by(organizerid=organizer_id).all()
        
        # If no events are found, return an empty list
        if not events:
            return {"message": "No events found for this organizer."}, 404
        
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
                "event_type": event.event_type,
                "event_img": event.event_img,
                "social_media_link": event.social_media_link,
                "venue_id": event.venue_id
            })
        
        # Return the events list as a dictionary, which Flask will automatically jsonify
        return {"events": events_list}, 200
        
    except Exception as e:
        return {"message": f"Error retrieving events for this organizer: {str(e)}"}, 500
