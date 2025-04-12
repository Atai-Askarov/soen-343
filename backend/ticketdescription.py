from flask import request, jsonify
from account import db
from sqlalchemy import exc
from datetime import datetime

class TicketDescription(db.Model):
    __tablename__ = 'ticket_desc'
    
    # Column definitions based on the updated table structure
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    active = db.Column(db.Boolean, default=True)
    ticketlimit = db.Column(db.Integer, nullable=False)
    eventid = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)  # ForeignKey to events table
    
    # Relationship to Event (backref allows access to ticket descriptions from event)
    event = db.relationship('Event', backref='ticket_descriptions', lazy=True)
    
    def __repr__(self):
        return f'<TicketDescription {self.name}>'

def create_ticket_description():
    """Create a new ticket description"""
    data = request.get_json()
    
    required_fields = ['price', 'name', 'ticketlimit', 'eventid']
    
    if not all(field in data for field in required_fields):
        return jsonify({
            "message": "Price, name, ticket limit, and event ID are required!",
            "missing_fields": [field for field in required_fields if field not in data]
        }), 400
    
    try:
        new_ticket_desc = TicketDescription(
            price=data['price'],
            name=data['name'],
            description=data.get('description'),
            active=data.get('active', True),
            ticketlimit=data['ticketlimit'],
            eventid=data['eventid']
        )
        
        db.session.add(new_ticket_desc)
        db.session.commit()
        
        return jsonify({
            "message": "Ticket description created successfully!",
            "ticket_desc_id": new_ticket_desc.id,
            "name": new_ticket_desc.name,
            "price": str(new_ticket_desc.price),
            "ticketlimit": new_ticket_desc.ticketlimit,
            "eventid": new_ticket_desc.eventid
        }), 201
        
    except exc.IntegrityError as e:
        db.session.rollback()
        return jsonify({"message": "Database integrity error!", "error": str(e)}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error creating ticket description: {str(e)}"}), 500

def get_ticket_desc():
    try:
        # Query to get all ticket descriptions
        tickets = TicketDescription.query.all()
        
        # Convert to a list of dictionaries for JSON response
        ticket_list = []
        for ticket in tickets:
            ticket_list.append({
                'id': ticket.id,
                'price': str(ticket.price),  # Convert price to string for JSON compatibility
                'name': ticket.name,
                'description': ticket.description,
                'active': ticket.active,
                'ticketlimit': ticket.ticketlimit,
                'eventid': ticket.eventid
            })
        
        return jsonify({'status': 'success', 'tickets': ticket_list})
    
    except exc.SQLAlchemyError as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
def get_ticket_description_by_id(ticket_desc_id):
    """Retrieve a ticket description by its ID from the database."""
    try:
        # Fetch the ticket description by its ID
        ticket_desc = TicketDescription.query.get(ticket_desc_id)
        
        if not ticket_desc:
            return jsonify({"message": f"Ticket description with ID {ticket_desc_id} not found."}), 404
        
        # Serialize the ticket description into a dictionary
        ticket_desc_data = {
            "id": ticket_desc.id,
            "name": ticket_desc.name,
            "price": str(ticket_desc.price),
            "description": ticket_desc.description,
            "active": ticket_desc.active,
            "ticketlimit": ticket_desc.ticketlimit,
            "eventid": ticket_desc.eventid
        }
        
        # Return the ticket description data as a JSON response
        return jsonify(ticket_desc_data), 200
        
    except Exception as e:
        return jsonify({"message": f"Error retrieving ticket description: {str(e)}"}), 500

def get_ticket_descriptions_by_event(event_id):
    """Retrieve ticket descriptions based on the event ID."""
    try:
        # Fetch ticket descriptions by event_id
        ticket_descs = TicketDescription.query.filter_by(eventid=event_id).all()
        
        if not ticket_descs:
            return jsonify({"message": f"No ticket descriptions found for event ID {event_id}."}), 404
        
        # Serialize ticket descriptions into a list of dictionaries
        ticket_desc_list = []
        for ticket_desc in ticket_descs:
            ticket_desc_list.append({
                "id": ticket_desc.id,
                "name": ticket_desc.name,
                "price": str(ticket_desc.price),
                "description": ticket_desc.description,
                "active": ticket_desc.active,
                "ticketlimit": ticket_desc.ticketlimit,
                "eventid": ticket_desc.eventid
            })
        
        # Return the ticket descriptions data as a JSON response
        return jsonify({"ticket_descriptions": ticket_desc_list}), 200
    
    except Exception as e:
        return jsonify({"message": f"Error retrieving ticket descriptions for event {event_id}: {str(e)}"}), 500
    
if __name__ == "__main__":
    # This code will only run if the file is executed directly
    # id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # price = db.Column(db.Numeric(10, 2), nullable=False)
    # name = db.Column(db.String(255), nullable=False)
    # description = db.Column(db.Text, nullable=True)
    # active = db.Column(db.Boolean, default=True)
    # ticketlimit = db.Column(db.Integer, nullable=False)
    # eventid = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False) 


    desc = "go habs go"
    create_ticket_description(20.00, "Habs discount", desc, 40, 1 )
    