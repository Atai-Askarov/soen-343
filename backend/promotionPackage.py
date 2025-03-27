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
def create_promotion():
    data = request.json
    new_promotion = Promotion(
        width=data['width'],
        length=data['length'],
        promotion_stripe_id=data['promotion_stripe_id']
    )
    db.session.add(new_promotion)
    db.session.commit()
    return jsonify({"message": "Promotion created", "id": new_promotion.id}), 201

# Read (all promotions)
def get_all_promotions():
    promotions = Promotion.query.all()
    return jsonify([{
        "id": promotion.id,
        "width": promotion.width,
        "length": promotion.length,
        "promotion_stripe_id": promotion.promotion_stripe_id
    } for promotion in promotions]), 200

# Read (single promotion)
def get_promotion(promotion_id):
    promotion = Promotion.query.get_or_404(promotion_id)
    return jsonify({
        "id": promotion.id,
        "width": promotion.width,
        "length": promotion.length,
        "promotion_stripe_id": promotion.promotion_stripe_id
    }), 200

# Update
def update_promotion(promotion_id):
    promotion = Promotion.query.get_or_404(promotion_id)
    data = request.json
    promotion.width = data.get('width', promotion.width)
    promotion.length = data.get('length', promotion.length)
    promotion.promotion_stripe_id = data.get('promotion_stripe_id', promotion.promotion_stripe_id)
    db.session.commit()
    return jsonify({"message": "Promotion updated"}), 200

# Delete
def delete_promotion(promotion_id):
    promotion = Promotion.query.get_or_404(promotion_id)
    db.session.delete(promotion)
    db.session.commit()
    return jsonify({"message": "Promotion deleted"}), 200