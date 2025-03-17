from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

#Database Configuration with SQLAlchemy


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
