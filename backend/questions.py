from flask import request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import cross_origin
from datetime import datetime

# Import your database connection
from account import db

class Question(db.Model):
    __tablename__ = 'questions'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    username = db.Column(db.String(50), nullable=False)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=True)
    answered = db.Column(db.Boolean, default=False)
    question_timestamp = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())
    answer_timestamp = db.Column(db.DateTime, nullable=True)
    answered_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    answered_by_username = db.Column(db.String(50), nullable=True)
    
    def __repr__(self):
        return f'<Question {self.id}>'

def create_question():
    """Create a new question for an event"""
    try:
        data = request.get_json()
        required_fields = ['event_id', 'user_id', 'username', 'question']
        
        if not all(field in data for field in required_fields):
            return jsonify({
                "message": "Missing required fields!",
                "required_fields": required_fields
            }), 400
        
        try:
            # Set the current time explicitly
            current_time = datetime.utcnow()
            
            new_question = Question(
                event_id=data['event_id'],
                user_id=data['user_id'],
                username=data['username'],
                question=data['question'],
                question_timestamp=current_time  # Set time explicitly
            )
            
            db.session.add(new_question)
            db.session.commit()
            
            return jsonify({
                "message": "Question submitted successfully!",
                "question": {
                    "id": new_question.id,
                    "eventId": new_question.event_id,
                    "userId": new_question.user_id,
                    "userName": new_question.username,
                    "question": new_question.question,
                    "timestamp": current_time.isoformat(),  # Use our explicit time
                    "answered": new_question.answered,
                    "answer": None,
                    "answeredBy": None,
                    "answerTimestamp": None
                }
            }), 201
            
        except Exception as e:
            db.session.rollback()
            print(f"Database error: {str(e)}")
            return jsonify({"message": f"Database error: {str(e)}"}), 500
    
    except Exception as e:
        print(f"General error: {str(e)}")
        return jsonify({"message": f"Error submitting question: {str(e)}"}), 500

def get_questions_by_event(event_id):
    """Get all questions for a specific event"""
    try:
        questions = Question.query.filter_by(event_id=event_id).all()
        
        questions_list = [{
            'id': q.id,
            'eventId': q.event_id,
            'userId': q.user_id,
            'userName': q.username,
            'question': q.question,
            'timestamp': q.question_timestamp.isoformat(),
            'answered': q.answered,
            'answer': q.answer,
            'answeredBy': q.answered_by_username,
            'answerTimestamp': q.answer_timestamp.isoformat() if q.answer_timestamp else None
        } for q in questions]
        
        return jsonify({"questions": questions_list}), 200
    
    except Exception as e:
        return jsonify({"message": f"Error retrieving questions: {str(e)}"}), 500

def answer_question(question_id):
    """Answer a specific question"""
    data = request.get_json()
    required_fields = ['answer', 'answered_by', 'answered_by_username']
    
    if not all(field in data for field in required_fields):
        return jsonify({
            "message": "Missing required fields!",
            "required_fields": required_fields
        }), 400
    
    try:
        question = Question.query.get(question_id)
        if not question:
            return jsonify({"message": f"Question with ID {question_id} not found."}), 404
        
        question.answer = data['answer']
        question.answered = True
        question.answer_timestamp = datetime.utcnow()
        question.answered_by = data['answered_by']
        question.answered_by_username = data['answered_by_username']
        
        db.session.commit()
        
        return jsonify({
            "message": "Question answered successfully!",
            "question": {
                "id": question.id,
                "eventId": question.event_id,
                "userId": question.user_id,
                "userName": question.username,
                "question": question.question,
                "timestamp": question.question_timestamp.isoformat(),
                "answered": question.answered,
                "answer": question.answer,
                "answeredBy": question.answered_by_username,
                "answerTimestamp": question.answer_timestamp.isoformat()
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error answering question: {str(e)}"}), 500