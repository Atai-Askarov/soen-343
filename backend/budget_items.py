from flask import request, jsonify
from account import db
from sqlalchemy import exc

class BudgetItem(db.Model):
    __tablename__ = 'budget_items'
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    type = db.Column(db.Enum('income', 'expenditure'), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    event = db.relationship('Event', backref='budget_items', lazy=True)

    def __repr__(self):
        return f'<BudgetItem {self.id}: {self.name} - {self.amount} {self.type}>'

# Create a new budget item
def create_budget_item():
    data = request.get_json()
    required_fields = ['event_id', 'name', 'amount', 'type']

    if not all(field in data for field in required_fields):
        return jsonify({
            "message": "All fields are required!",
            "missing_fields": [field for field in required_fields if field not in data]
        }), 400

    try:
        new_item = BudgetItem(
            event_id=data['event_id'],
            name=data['name'],
            amount=data['amount'],
            type=data['type']
        )
        db.session.add(new_item)
        db.session.commit()

        return jsonify({
            "message": "Budget item created successfully!",
            "item_id": new_item.id
        }), 201

    except exc.IntegrityError as e:
        db.session.rollback()
        return jsonify({"message": "Database integrity error!", "error": str(e)}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error creating budget item: {str(e)}"}), 500

# Get all budget items
def get_budget_items():
    try:
        items = BudgetItem.query.all()
        item_list = [{
            'id': item.id,
            'event_id': item.event_id,
            'name': item.name,
            'amount': str(item.amount),
            'type': item.type,
            'created_at': item.created_at
        } for item in items]

        return jsonify({'status': 'success', 'budget_items': item_list}), 200

    except exc.SQLAlchemyError as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Get a single budget item by ID
def get_budget_item_by_id(item_id):
    try:
        item = BudgetItem.query.get(item_id)
        if not item:
            return jsonify({"message": f"Budget item with ID {item_id} not found."}), 404

        item_data = {
            'id': item.id,
            'event_id': item.event_id,
            'name': item.name,
            'amount': str(item.amount),
            'type': item.type,
            'created_at': item.created_at
        }

        return jsonify(item_data), 200

    except Exception as e:
        return jsonify({"message": f"Error retrieving budget item: {str(e)}"}), 500

# Get all budget items for a specific event
def get_budget_items_by_event(event_id):
    try:
        items = BudgetItem.query.filter_by(event_id=event_id).all()
        if not items:
            return jsonify({"message": f"No budget items found for event ID {event_id}."}), 404

        item_list = [{
            'id': item.id,
            'name': item.name,
            'amount': str(item.amount),
            'type': item.type,
            'created_at': item.created_at
        } for item in items]

        return jsonify({"budget_items": item_list}), 200

    except Exception as e:
        return jsonify({"message": f"Error retrieving items for event {event_id}: {str(e)}"}), 500

def delete_budget_item(item_id):
    try:
        item = BudgetItem.query.get(item_id)
        if not item:
            return jsonify({"message": f"Budget item with ID {item_id} not found."}), 404

        db.session.delete(item)
        db.session.commit()

        return jsonify({"message": "Budget item deleted successfully!"}), 200

    except exc.SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"message": "Database integrity error!", "error": str(e)}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error deleting budget item: {str(e)}"}), 500