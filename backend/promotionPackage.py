from flask_sqlalchemy import SQLAlchemy
from flask import request, jsonify

db = SQLAlchemy()

class Promotion(db.Model):
    __tablename__ = 'promotion'
    id = db.Column(db.Integer, primary_key=True)
    width = db.Column(db.String(50), nullable=False)
    length = db.Column(db.String(50), nullable=False)
    promotion_stripe_id = db.Column(db.String(50), nullable=False)

# Create
def create_user():
    data = request.json
    new_user = Promotion(
        width=data['width'],
        length=data['length'],
        promotion_stripe_id=data['promotion_stripe_id']
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Promotion created", "id": new_user.id}), 201

# Read (all users)
def get_all_users():
    users = Promotion.query.all()
    return jsonify([{
        "id": user.id,
        "width": user.width,
        "length": user.length,
        "promotion_stripe_id": user.promotion_stripe_id
    } for user in users]), 200

# Read (single user)
def get_user(user_id):
    user = Promotion.query.get_or_404(user_id)
    return jsonify({
        "id": user.id,
        "width": user.width,
        "length": user.length,
        "promotion_stripe_id": user.promotion_stripe_id
    }), 200

# Update
def update_user(user_id):
    user = Promotion.query.get_or_404(user_id)
    data = request.json
    user.width = data.get('width', user.width)
    user.length = data.get('length', user.length)
    user.promotion_stripe_id = data.get('promotion_stripe_id', user.promotion_stripe_id)
    db.session.commit()
    return jsonify({"message": "Promotion updated"}), 200

# Delete
def delete_user(user_id):
    user = Promotion.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Promotion deleted"}), 200