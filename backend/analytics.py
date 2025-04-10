# analytics.py
from flask import Blueprint, jsonify
from sponsorship import Sponsorship  # Ensure your Sponsorship model is imported correctly

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route("/analytics/sponsor/<int:sponsor_id>", methods=["GET"])
def sponsor_analytics(sponsor_id):
    try:
        # Retrieve all sponsorships for the given sponsor_id from the Sponsorship model.
        sponsorships = Sponsorship.query.filter_by(sponsor_id=sponsor_id).all()
        total_sponsorships = len(sponsorships)
        
        # Create a set of event IDs to determine the unique events
        unique_events = {s.event_id for s in sponsorships}
        total_events_sponsored = len(unique_events)
        
        return jsonify({
            "total_sponsorships": total_sponsorships,
            "total_events_sponsored": total_events_sponsored
        }), 200
    except Exception as e:
        return jsonify({"message": f"Server error: {str(e)}"}), 500
