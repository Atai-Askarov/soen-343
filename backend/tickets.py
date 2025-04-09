from flask import request, jsonify
from account import db
from sqlalchemy import exc
import PaymentProcessing.stripe_setup as pp
import requests
import json
class Ticket(db.Model):
    __tablename__ = 'tickets'
    __table_args__ = {'extend_existing': True}  # Prevent duplicate definition
    
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
    data = request.get_json()
    required_fields = ['userid', 'eventid', 'descid', 'name', 'description', 'price']
    if not all(field in data for field in required_fields):
        return jsonify({
            "message": "All fields are required!",
            "missing_fields": [field for field in required_fields if field not in data]
        }), 400
    
    try:
        product_id = pp.create_ticket_product(event_name=data["name"], event_description=data["description"])
        price_id = pp.create_ticket_price(int(float(data["price"]) * 100), data["name"], product_id)
         
        new_ticket = Ticket(
            userid=data['userid'],
            eventid=data['eventid'],
            descid=data['descid'],
            product_stripe_id=product_id,
            price_stripe_id=price_id
        )
        db.session.add(new_ticket)
        db.session.commit()
        
        return jsonify({
            "message": "Ticket created successfully!",
            "ticket_id": new_ticket.id,
            "product_id": product_id,
            "price_id": price_id
        }), 201
        
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
            'price_stripe_id': ticket.price_stripe_id
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
            'price_stripe_id': ticket.price_stripe_id
        }
        
        return jsonify(ticket_data), 200
    except Exception as e:
        return jsonify({"message": f"Error retrieving ticket: {str(e)}"}), 500

def get_tickets_by_event(event_id):
    try:
        tickets = Ticket.query.filter_by(eventid=event_id).all()
        if not tickets:
            return jsonify({"message": f"No tickets found for event ID {event_id}."}), 404
        
        ticket_list = [{
            'id': ticket.id,
            'userid': ticket.userid,
            'descid': ticket.descid,
            'product_stripe_id': ticket.product_stripe_id,
            'price_stripe_id': ticket.price_stripe_id
        } for ticket in tickets]
        
        return jsonify({"tickets": ticket_list}), 200
    except Exception as e:
        return jsonify({"message": f"Error retrieving tickets for event {event_id}: {str(e)}"}), 500
