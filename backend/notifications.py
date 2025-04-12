from flask import request, jsonify
from account import db
from sqlalchemy import exc
from datetime import datetime


class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Foreign key to users table
    message = db.Column(db.Text, nullable=False)
    link = db.Column(db.String(255))  # Optional link
    read_notif = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Notification {self.id} for User {self.user_id}>'


def create_notification():
    """Create a new notification for a specific user"""
    data = request.get_json()

    required_fields = ['user_id', 'message']

    if not all(field in data for field in required_fields):
        return jsonify({
            "message": "Missing required fields!",
            "missing_fields": [field for field in required_fields if field not in data]
        }), 400

    try:
        new_notification = Notification(
            user_id=data['user_id'],
            message=data['message'],
            link=data.get('link', None)  # Optional link, defaults to None if not provided
        )

        db.session.add(new_notification)
        db.session.commit()

        return jsonify({
            "message": "Notification created successfully!",
            "notification_id": new_notification.id,
            "user_id": new_notification.user_id,
            "message": new_notification.message,
            "link": new_notification.link
        }), 201

    except exc.IntegrityError as e:
        db.session.rollback()
        return jsonify({"message": "Database integrity error!", "error": str(e)}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error creating notification: {str(e)}"}), 500


def get_notifications_for_user(user_id):
    """Fetch all notifications for a specific user"""
    try:
        notifications = Notification.query.filter_by(user_id=user_id).all()
        notification_list = []

        for notification in notifications:
            notification_list.append({
                'id': notification.id,
                'message': notification.message,
                'link': notification.link,
                'read_notif': notification.read_notif,
                'created_at': notification.created_at.strftime('%Y-%m-%d %H:%M:%S')
            })

        return jsonify({'status': 'success', 'notifications': notification_list})

    except exc.SQLAlchemyError as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


def get_notification_by_id(notification_id):
    """Fetch a single notification by its ID"""
    try:
        notification = Notification.query.get(notification_id)

        if not notification:
            return jsonify({"message": f"Notification with ID {notification_id} not found."}), 404

        notification_data = {
            'id': notification.id,
            'message': notification.message,
            'link': notification.link,
            'read_notif': notification.read_notif,
            'created_at': notification.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }

        return jsonify(notification_data), 200

    except Exception as e:
        return jsonify({"message": f"Error retrieving notification: {str(e)}"}), 500


def mark_notification_as_read(notification_id):
    """Mark a specific notification as read"""
    try:
        notification = Notification.query.get(notification_id)

        if not notification:
            return jsonify({"message": f"Notification with ID {notification_id} not found."}), 404

        notification.read_notif = True
        db.session.commit()

        return jsonify({
            "message": "Notification marked as read",
            "notification_id": notification.id,
            "read_notif": notification.read_notif
        }), 200

    except exc.SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error marking notification as read: {str(e)}"}), 500

