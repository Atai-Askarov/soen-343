from flask import request, jsonify
from account import db
from sqlalchemy import exc

class Ticket(db.Model):
    __tablename__ = 'tickets'
    __table_args__ = {'extend_existing': True}  # Prevent duplicate definition
    
   #*** FIELD REQUIRED FOR ANALYTICS: 
    purchase_date = db.Column(db.DateTime(timezone=True), default=db.func.current_timestamp())
   #***
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userid = db.Column(db.Integer, nullable=False)
    eventid = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    descid = db.Column(db.Integer, db.ForeignKey('ticket_desc.id'), nullable=False)
    product_stripe_id = db.Column(db.String(255), nullable=False)
    price_stripe_id = db.Column(db.String(255), nullable=False)
    
    event = db.relationship('Event', backref='tickets', lazy=True)
    description = db.relationship('TicketDescription', backref='tickets', lazy=True)

    
    def __repr__(self):
        return f'<Ticket {self.id}>'

def create_ticket():
    """Create a new ticket"""
    data = request.get_json()
    
    required_fields = ['userid', 'eventid', 'descid', 'product_stripe_id', 'price_stripe_id']
    
    if not all(field in data for field in required_fields):
        return jsonify({
            "message": "All fields are required!",
            "missing_fields": [field for field in required_fields if field not in data]
        }), 400
    
    try:
        # Always set purchase_date to current time if not provided
        if 'purchase_date' not in data or data['purchase_date'] is None:
            from datetime import datetime
            purchase_date = datetime.utcnow()
        else:
            purchase_date = data['purchase_date']
        
        new_ticket = Ticket(
            userid=data['userid'],
            eventid=data['eventid'],
            descid=data['descid'],
            product_stripe_id=data['product_stripe_id'],
            price_stripe_id=data['price_stripe_id'],
            purchase_date=purchase_date
        )
        
        db.session.add(new_ticket)
        db.session.commit()
        
        return jsonify({
            "message": "Ticket created successfully!",
            "ticket_id": new_ticket.id,
            "purchase_date": new_ticket.purchase_date.isoformat()
        }), 201
        
    except exc.IntegrityError as e:
        db.session.rollback()
        return jsonify({"message": "Database integrity error!", "error": str(e)}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error creating ticket: {str(e)}"}), 500
def get_tickets():
    try:
        tickets = Ticket.query.all()
        
        ticket_list = [{
            'id': ticket.id,
            'userid': ticket.userid,
            'eventid': ticket.eventid,
            'descid': ticket.descid,
            'product_stripe_id': ticket.product_stripe_id,
            'price_stripe_id': ticket.price_stripe_id,
            'purchase_date': ticket.purchase_date.isoformat() if ticket.purchase_date else None
        } for ticket in tickets]
        
        return jsonify({'status': 'success', 'tickets': ticket_list})
    except exc.SQLAlchemyError as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

def get_ticket_by_id(ticket_id):
    try:
        ticket = Ticket.query.get(ticket_id)
        if not ticket:
            return jsonify({"message": f"Ticket with ID {ticket_id} not found."}), 404
        
        ticket_data = {
            'id': ticket.id,
            'userid': ticket.userid,
            'eventid': ticket.eventid,
            'descid': ticket.descid,
            'product_stripe_id': ticket.product_stripe_id,
            'price_stripe_id': ticket.price_stripe_id,
            'purchase_date': ticket.purchase_date.isoformat() if ticket.purchase_date else None
        }
        
        return jsonify(ticket_data), 200
    except Exception as e:
        return jsonify({"message": f"Error retrieving ticket: {str(e)}"}), 500

def get_tickets_by_event(event_id):
    try:
        tickets = Ticket.query.filter_by(eventid=event_id).all()
        if not tickets:
            return jsonify({"tickets": []}), 200  # Return empty array instead of 404 for analytics
        
        ticket_list = [{
            'id': ticket.id,
            'userid': ticket.userid,
            'descid': ticket.descid,
            'product_stripe_id': ticket.product_stripe_id,
            'price_stripe_id': ticket.price_stripe_id,
            'purchase_date': ticket.purchase_date.isoformat() if ticket.purchase_date else None
        } for ticket in tickets]
        
        return jsonify({"tickets": ticket_list}), 200
    except Exception as e:
        return jsonify({"message": f"Error retrieving tickets for event {event_id}: {str(e)}"}), 500
