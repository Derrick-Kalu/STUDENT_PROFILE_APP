from flask_login import UserMixin
from app import db

class Student(db.Model, UserMixin):
    __tablename__ = 'students'
    id=db.Column(db.Integer, primary_key=True)
    full_name=db.Column(db.String(50), nullable=False)
    matric_number=db.Column(db.String(20), nullable=False, unique=True)
    password=db.Column(db.String(256), nullable=False)
    gender=db.Column(db.String(10), nullable=False)
    level=db.Column(db.Integer)
    department=db.Column(db.String(50))
    hostel=db.Column(db.String(20))
    room=db.Column(db.String(50))