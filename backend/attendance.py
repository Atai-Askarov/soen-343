from flask import jsonify, request
from account import db
from datetime import datetime
from sqlalchemy import func, case

class Attendance(db.Model):
    """Model for tracking event attendance."""
    __tablename__ = 'attendance'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ticket_id = db.Column(db.Integer, db.ForeignKey('tickets.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    attended = db.Column(db.Boolean, default=False)
    check_in_time = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    ticket = db.relationship('Ticket', backref='attendance', lazy=True)
    event = db.relationship('Event', backref='attendance', lazy=True)

    def __repr__(self):
        return f'<Attendance {self.id} - Ticket: {self.ticket_id}, Event: {self.event_id}>'

def get_attendance_by_event(event_id):
    """Get attendance data for a specific event."""
    try:
        # Get all attendance records for the event
        attendance_records = Attendance.query.filter_by(event_id=event_id).all()
        
        # Get all tickets sold for the event (to calculate total possible attendance)
        from tickets import Ticket
        tickets_sold = Ticket.query.filter_by(eventid=event_id).count()
        
        # Count attended people
        attended_count = sum(1 for record in attendance_records if record.attended)
        
        # Format the data for the frontend
        attendance_data = {
            "total_registered": tickets_sold,
            "total_attended": attended_count,
            "attendance_rate": round(attended_count / tickets_sold * 100, 2) if tickets_sold > 0 else 0,
            "attendance_details": [
                {
                    "ticket_id": record.ticket_id,
                    "attended": record.attended,
                    "check_in_time": record.check_in_time.isoformat() if record.check_in_time else None
                } for record in attendance_records
            ]
        }
        
        return jsonify(attendance_data), 200
    except Exception as e:
        return jsonify({"message": f"Error retrieving attendance data: {str(e)}"}), 500
    
def check_in_attendee():
    """Record a single attendee checking in."""
    data = request.get_json()
    required_fields = ['ticket_id', 'event_id']
    
    if not all(field in data for field in required_fields):
        return jsonify({
            "message": "Missing required fields!",
            "required_fields": required_fields
        }), 400
    
    try:
        # Check if record already exists
        existing = Attendance.query.filter_by(
            ticket_id=data['ticket_id'],
            event_id=data['event_id']
        ).first()
        
        if existing:
            # Update existing record
            existing.attended = True
            existing.check_in_time = datetime.utcnow()
        else:
            # Create new record
            attendance = Attendance(
                ticket_id=data['ticket_id'],
                event_id=data['event_id'],
                attended=True,
                check_in_time=datetime.utcnow()
            )
            db.session.add(attendance)
            
        db.session.commit()
        return jsonify({
            "message": "Check-in recorded successfully!",
            "timestamp": datetime.utcnow().isoformat()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error recording check-in: {str(e)}"}), 500

def batch_check_in():
    """Check in multiple attendees at once."""
    data = request.get_json()
    
    if 'attendees' not in data or not isinstance(data['attendees'], list):
        return jsonify({"message": "Invalid data format! 'attendees' list required"}), 400
    
    results = {"success": [], "errors": []}
    
    try:
        for attendee in data['attendees']:
            if 'ticket_id' not in attendee or 'event_id' not in attendee:
                results["errors"].append({
                    "ticket_id": attendee.get('ticket_id', 'unknown'),
                    "error": "Missing ticket_id or event_id"
                })
                continue
                
            try:
                # Check if record already exists
                existing = Attendance.query.filter_by(
                    ticket_id=attendee['ticket_id'],
                    event_id=attendee['event_id']
                ).first()
                
                if existing:
                    # Update existing record
                    existing.attended = True
                    existing.check_in_time = datetime.utcnow()
                else:
                    # Create new record
                    attendance = Attendance(
                        ticket_id=attendee['ticket_id'],
                        event_id=attendee['event_id'],
                        attended=True,
                        check_in_time=datetime.utcnow()
                    )
                    db.session.add(attendance)
                
                results["success"].append({
                    "ticket_id": attendee['ticket_id'],
                    "checked_in": True
                })
                
            except Exception as e:
                results["errors"].append({
                    "ticket_id": attendee['ticket_id'],
                    "error": str(e)
                })
                
        db.session.commit()
        return jsonify(results), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error processing batch check-in: {str(e)}"}), 500

def update_attendance(attendance_id):
    """Update an attendance record."""
    data = request.get_json()
    
    try:
        attendance = Attendance.query.get(attendance_id)
        if not attendance:
            return jsonify({"message": f"Attendance record {attendance_id} not found"}), 404
            
        if 'attended' in data:
            attendance.attended = data['attended']
            
        if 'check_in_time' in data:
            attendance.check_in_time = datetime.fromisoformat(data['check_in_time']) if data['check_in_time'] else None
            
        db.session.commit()
        return jsonify({"message": "Attendance record updated successfully!"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error updating attendance: {str(e)}"}), 500

def get_attendance_statistics(event_id=None):
    """Get attendance statistics across all events or for a specific event."""
    try:
        if event_id:
            # Get stats for one event
            return get_attendance_by_event(event_id)
        else:
            # Get aggregate stats across all events
            from tickets import Ticket
            
            # Get total tickets sold
            total_tickets = Ticket.query.count()
            
            # Get total attendance records
            total_attendance_records = Attendance.query.count()
            
            # Count attended people
            attended_count = Attendance.query.filter_by(attended=True).count()
            
            # Calculate attendance rate
            attendance_rate = round(attended_count / total_tickets * 100, 2) if total_tickets > 0 else 0
            
            # Get stats by event
            event_stats = db.session.query(
                Attendance.event_id,
                func.count(Attendance.id).label('total_records'),
                func.sum(case([(Attendance.attended == True, 1)], else_=0)).label('attended_count')
            ).group_by(Attendance.event_id).all()
            
            event_data = []
            for stat in event_stats:
                event_id, total, attended = stat
                event_tickets = Ticket.query.filter_by(eventid=event_id).count()
                event_data.append({
                    "event_id": event_id,
                    "total_tickets": event_tickets,
                    "checked_in": attended,
                    "attendance_rate": round(attended / event_tickets * 100, 2) if event_tickets > 0 else 0
                })
            
            return jsonify({
                "total_tickets_sold": total_tickets,
                "total_checked_in": attended_count,
                "overall_attendance_rate": attendance_rate,
                "events": event_data
            }), 200
            
    except Exception as e:
        return jsonify({"message": f"Error getting attendance statistics: {str(e)}"}), 500