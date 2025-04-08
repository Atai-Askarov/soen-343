from flask import request, jsonify
from account import db
from sqlalchemy import exc


class Venue(db.Model):
    __tablename__ = 'venue'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    address = db.Column(db.Text, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    price_per_hour_rented = db.Column(db.Numeric(10, 2), nullable=False)

    def __repr__(self):
        return f'<Venue {self.name}>'


def create_venue():
    """Create a new venue entry"""
    data = request.get_json()

    required_fields = ['name', 'address', 'capacity', 'price_per_hour_rented']

    if not all(field in data for field in required_fields):
        return jsonify({
            "message": "Missing required fields!",
            "missing_fields": [field for field in required_fields if field not in data]
        }), 400

    try:
        new_venue = Venue(
            name=data['name'],
            address=data['address'],
            capacity=data['capacity'],
            price_per_hour_rented=data['price_per_hour_rented']
        )

        db.session.add(new_venue)
        db.session.commit()

        return jsonify({
            "message": "Venue created successfully!",
            "venue_id": new_venue.id,
            "name": new_venue.name,
            "capacity": new_venue.capacity,
            "price_per_hour_rented": str(new_venue.price_per_hour_rented)
        }), 201

    except exc.IntegrityError as e:
        db.session.rollback()
        return jsonify({"message": "Database integrity error!", "error": str(e)}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error creating venue: {str(e)}"}), 500

def get_venues():
    try:
        venues = Venue.query.all()
        venue_list = []

        for venue in venues:
            venue_list.append({
                'id': venue.id,
                'name': venue.name,
                'address': venue.address,
                'capacity': venue.capacity,
                'price_per_hour_rented': str(venue.price_per_hour_rented)
            })

        return jsonify({'status': 'success', 'venues': venue_list})

    except exc.SQLAlchemyError as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


def get_venue_by_id(venue_id):
    try:
        venue = Venue.query.get(venue_id)

        if not venue:
            return jsonify({"message": f"Venue with ID {venue_id} not found."}), 404

        venue_data = {
            'id': venue.id,
            'name': venue.name,
            'address': venue.address,
            'capacity': venue.capacity,
            'price_per_hour_rented': str(venue.price_per_hour_rented)
        }

        return jsonify(venue_data), 200

    except Exception as e:
        return jsonify({"message": f"Error retrieving venue: {str(e)}"}), 500
