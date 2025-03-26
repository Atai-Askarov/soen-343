from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    user_type = db.Column(db.String(150), nullable=False)  # Ensure this column is named 'type' or something else
    interests = db.Column(db.String(255), nullable=True)  # Store as comma-separated values

    # @property
    # def interests_list(self):
    #     return self.interests.split(",") if self.interests else []

    # @interests_list.setter
    # def interests_list(self, interests):
    #     self.interests = ",".join(interests)  # Convert list to a comma-separated string


class Attendee(User):
    __tablename__ = 'attendees'
    id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)

class Stakeholder(User):
    __tablename__ = 'stakeholders'
    id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)

class Admin(User):
    __tablename__ = 'admins'
    id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    admin_level = db.Column(db.String(50))  # Reserved for admin levels

def create_user(username, email, password, user_type='user', interests=[]):
    interests_str = ",".join(interests)  # Store as a comma-separated string

    if user_type == 'attendee':
        new_user = Attendee(username=username, email=email, password=password, interests=interests_str)
    elif user_type == 'stakeholder':
        new_user = Stakeholder(username=username, email=email, password=password, interests=interests_str)
    elif user_type == 'admin':
        new_user = Admin(username=username, email=email, password=password, interests=interests_str)
    else:
        new_user = User(username=username, email=email, password=password, interests=interests_str)

    db.session.add(new_user)
    db.session.commit()
    return new_user

@app.route('/api/signUp', methods=['POST'])
def sign_up():
    data = request.get_json()
    username = data.get("username", "User")  # Default username
    email = data.get("email")
    password = data.get("password")
    user_type = data.get("type", "user").lower()
    interests = data.get("interests", [])

    if not email or not password or not user_type:
        return jsonify({"message": "All fields (email, password, user type) are required!"}), 400

    try:
        new_user = create_user(username, email, password, user_type, interests)
        return jsonify({
            "message": "User added successfully!",
            "user": {
                "id": new_user.id,
                "username": new_user.username,
                "email": new_user.email,
                "type": user_type,
                "interests": interests
            }
        }), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
def sign_in():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required!"}), 400

    user = User.query.filter_by(email=email).first()

    if user and user.password == password:  # Ideally, compare hashed passwords
        return jsonify({"message": "Login successful", "user": {"id": user.id, "email": user.email}}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

def get_users():
    users = User.query.all()
    return [{"id": user.id, "username": user.username, "email": user.email} for user in users]


if __name__ == "__main__":
    db.create_all()
    app.run(debug=True)
