# sponsorship.py
from flask import Blueprint, request, jsonify
from account import db

# Create a Blueprint for sponsorship and package operations
sponsorship_bp = Blueprint('sponsorship', __name__)

# ─── MODELS ───────────────────────────────────────────────
class SponsorshipPackage(db.Model):
    __tablename__ = 'packages'  # Table name is "packages"
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    width = db.Column(db.String(20), nullable=False)
    height = db.Column(db.String(20), nullable=False)
    price = db.Column(db.Float, nullable=False)

    def __init__(self, event_id, name, width, height, price):
        self.event_id = event_id
        self.name = name
        self.width = width
        self.height = height
        self.price = price

class Sponsorship(db.Model):
    __tablename__ = 'sponsorships'
    id = db.Column(db.Integer, primary_key=True)
    sponsor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    package_id = db.Column(db.Integer, db.ForeignKey('packages.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)

    def __init__(self, sponsor_id, package_id, event_id):
        self.sponsor_id = sponsor_id
        self.package_id = package_id
        self.event_id = event_id

# ─── ROUTES ───────────────────────────────────────────────
# Create a sponsorship package (for an event organizer)
@sponsorship_bp.route("/packages", methods=["POST"])
def create_package():
    data = request.get_json()
    required_fields = ['event_id', 'name', 'width', 'height', 'price']
    if not all(field in data for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400
    try:
        pkg = SponsorshipPackage(
            event_id=data['event_id'],
            name=data['name'],
            width=data['width'],
            height=data['height'],
            price=float(data['price'])
        )
        db.session.add(pkg)
        db.session.commit()
        return jsonify({
            "message": "Package created successfully",
            "package": {
                "id": pkg.id,
                "event_id": pkg.event_id,
                "name": pkg.name,
                "width": pkg.width,
                "height": pkg.height,
                "price": pkg.price
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Server error: {str(e)}"}), 500

# Get packages for a specific event
@sponsorship_bp.route("/packages/<int:event_id>", methods=["GET"])
def get_packages_by_event(event_id):
    try:
        packages = SponsorshipPackage.query.filter_by(event_id=event_id).all()
        packages_list = [{
            "id": pkg.id,
            "event_id": pkg.event_id,
            "name": pkg.name,
            "width": pkg.width,
            "height": pkg.height,
            "price": pkg.price
        } for pkg in packages]
        return jsonify({"packages": packages_list}), 200
    except Exception as e:
        return jsonify({"message": f"Server error: {str(e)}"}), 500

# Create a sponsorship (when sponsor selects a package)
@sponsorship_bp.route("/sponsorship", methods=["POST"])
def create_sponsorship():
    data = request.get_json()
    required_fields = ['sponsor_id', 'event_id', 'package_id']
    if not all(field in data for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400
    try:
        # Check if the sponsor has already sponsored this package for the event
        existing = Sponsorship.query.filter_by(
            sponsor_id=data['sponsor_id'],
            package_id=data['package_id'],
            event_id=data['event_id']
        ).first()
        if existing:
            return jsonify({"message": "You have already sponsored this package for this event"}), 409

        sponsorship = Sponsorship(
            sponsor_id=data['sponsor_id'],
            package_id=data['package_id'],
            event_id=data['event_id']
        )
        db.session.add(sponsorship)
        db.session.commit()
        return jsonify({"message": "Sponsorship recorded successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Server error: {str(e)}"}), 500
