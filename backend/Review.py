from flask import request, jsonify
from account import db
from sqlalchemy import exc
from datetime import datetime
from flask import Blueprint

review_bp = Blueprint("Review", __name__)

class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    value = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String(500))  # New field

    __table_args__ = (
        db.UniqueConstraint('event_id', 'user_id', name='unique_review'),
        {'extend_existing': True}
    )

    event = db.relationship('Event', backref='reviews', lazy=True)
    user = db.relationship('User', backref='reviews', lazy=True)

    def __repr__(self):
        return f'<Review by User {self.user_id} on Event {self.event_id}: {self.value}>'

    def serialize(self):
        return {
            "id": self.id,
            "event_id": self.event_id,
            "user_id": self.user_id,
            "value": self.value,
            "comment": self.comment  # Included in output
        }

# --- CRUD endpoints below ---

review_bp.route("/create-review", methods=["POST"])
def create_review():
    data = request.get_json()
    required_fields = ['event_id', 'user_id', 'value']
    print("Clock1")
    if not all(field in data for field in required_fields):
        return jsonify({
            "message": "Missing required fields",
            "missing_fields": [f for f in required_fields if f not in data]
        }), 400

    try:
        review = Review.query.filter_by(
            event_id=data['event_id'],
            user_id=data['user_id']
        ).first()
        print("Clock2")
        if review:
            return jsonify({"message": "Review already exists", "review": review.serialize()}), 200

        new_review = Review(
            event_id=data['event_id'],
            user_id=data['user_id'],
            value=data['value'],
            comment=data.get('comment')  # Optional
        )
        print("Clock3")
        db.session.add(new_review)
        db.session.commit()
        return jsonify({
            "message": "Review created successfully",
            "review": new_review.serialize()
        }), 201

    except exc.IntegrityError as e:
        db.session.rollback()
        return jsonify({"message": "Integrity error", "error": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating review", "error": str(e)}), 500
review_bp.route("/get-reviews", methods=["GET"])
def get_reviews():
    try:
        reviews = Review.query.all()
        if not reviews:
            return jsonify({"message": "No reviews found"}), 404

        return jsonify([review.serialize() for review in reviews]), 200
    except Exception as e:
        return jsonify({"message": f"Error retrieving reviews: {str(e)}"}), 500
review_bp.route("/get-review-by-id/<int:review_id>", methods=["GET"])
def get_review_by_id(review_id):
    try:
        review = Review.query.get(review_id)
        if not review:
            return jsonify({"message": f"Review with ID {review_id} not found"}), 404

        return jsonify(review.serialize()), 200
    except Exception as e:
        return jsonify({"message": f"Error retrieving review: {str(e)}"}), 500
review_bp.route("/update-review/<int:review_id>", methods=["PUT"])
def update_review(review_id):
    data = request.get_json() or {}
    try:
        review = Review.query.get(review_id)
        if not review:
            return jsonify({"message": "Review not found"}), 404

        review.value = data.get('value', review.value)
        review.comment = data.get('comment', review.comment)  # Update comment if provided
        db.session.commit()
        return jsonify({"message": "Review updated", "review": review.serialize()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error updating review: {str(e)}"}), 500
review_bp.route("/delete-review/<int:review_id>", methods=["DELETE"])
def delete_review(review_id):
    try:
        review = Review.query.get(review_id)
        if not review:
            return jsonify({"message": "Review not found"}), 404

        db.session.delete(review)
        db.session.commit()
        return jsonify({"message": "Review deleted"}), 200
    except exc.IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Integrity error, cannot delete review"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error deleting review: {str(e)}"}), 500
