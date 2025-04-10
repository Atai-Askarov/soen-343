# analytics.py
from flask import Blueprint, jsonify
from sponsorship import Sponsorship  # Importing from sponsorship.py

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route("/analytics/sponsor/<int:sponsor_id>", methods=["GET"])
def sponsor_analytics(sponsor_id):
    # Query sponsorships for the given sponsor
    sponsorships = Sponsorship.query.filter_by(sponsor_id=sponsor_id).all()
    total_sponsorships = len(sponsorships)
    
    # Count unique events that this sponsor is linked to
    event_ids = {s.event_id for s in sponsorships}
    total_events_sponsored = len(event_ids)
    
    analytics_data = {
        "total_sponsorships": total_sponsorships,
        "total_events_sponsored": total_events_sponsored
    }
    return jsonify(analytics_data), 200
