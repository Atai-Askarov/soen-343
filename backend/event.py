from flask import request, jsonify
from flask_sqlalchemy import SQLAlchemy

# Initialize the database
db = SQLAlchemy()

# Event Model
class Event(db.Model):
    __tablename__ = 'events'
    
    eventid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    eventname = db.Column(db.String(100), nullable=False)
    eventdate = db.Column(db.String(50), nullable=False)
    eventlocation = db.Column(db.String(100), nullable=False)
    eventdescription = db.Column(db.String(255), nullable=True)

    def __init__(self, eventname, eventdate, eventlocation, eventdescription):
        self.eventname = eventname
        self.eventdate = eventdate
        self.eventlocation = eventlocation
        self.eventdescription = eventdescription

# Function to create a new event
def create_event():
    data = request.get_json()  # Get data from the request (as JSON)
    
    eventname = data.get("eventname")
    eventdate = data.get("eventdate")
    eventlocation = data.get("eventlocation")
    eventdescription = data.get("eventdescription")
    
    # Validate required fields
    if not eventname or not eventdate or not eventlocation:
        return jsonify({"message": "Event name, date, and location are required!"}), 400
    
    # Create the event and add it to the database
    new_event = Event(eventname=eventname, eventdate=eventdate, eventlocation=eventlocation, eventdescription=eventdescription)
    db.session.add(new_event)
    db.session.commit()
    
    return jsonify({"message": "Event created successfully!"}), 201
