from flask import redirect, render_template, request,jsonify
from flask_login import current_user, login_user, logout_user
from app import app, db
from app.models import Student
from werkzeug.security import generate_password_hash, check_password_hash

from app.utils import student_dict

@app.route('/')
def home_page():
    if current_user.is_authenticated:
        return render_template('index.html', current_user=current_user)
    return redirect("/login")

@app.route('/login')
def login_page():
    return render_template('login.html')

@app.route("/register")
def register_page():
    return render_template('register.html')

@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    full_name = data.get("full_name")
    matric_number = data.get("matric_number")
    password = data.get("password")
    gender = data.get("gender")

    if not full_name or not password or not gender or not matric_number:
        return jsonify({"message": "All fields are required"}), 400
    if Student.query.filter_by(matric_number=matric_number).first():
        return jsonify({"message": "Student already exists"}), 409

    password_hash = generate_password_hash(password)
    student = Student(full_name=full_name, password=password_hash, gender=gender, matric_number=matric_number)
    db.session.add(student)
    db.session.commit()
    return jsonify({"message": "Student created successfully"}), 201

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    matric_number = data.get('matric_number')
    password = data.get('password')

    if not matric_number or not password:
        return jsonify({"message": "Matric Number and Password is required"}), 400
    
    student = Student.query.filter_by(matric_number=matric_number).first()

    if not student or not check_password_hash(student.password, password):
        return jsonify({"message": "Incorrect Credentials"}), 400
    
    login_user(student)
    return jsonify({"message": " Student logged in successfully"}), 200

@app.route("/api/logout")
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"})

@app.route("/api/users", methods=["GET"])
def students_api():
    students = Student.query.all()
    return jsonify([student_dict(student) for student in students]), 200

@app.route("/api/users/<int:student_id>", methods=["GET", "PUT", "DELETE"])
def student_api(student_id):

    student = Student.query.filter_by(id=student_id).first()

    if not student:
        return jsonify({"message": "Student does not exist"}), 404

    if request.method == "GET":
        return jsonify(student_dict(student)), 200
    elif request.method == "PUT":
        data = request.json
        full_name = data.get("full_name")
        matric_number = data.get("matric_number")
        password = data.get("password")
        gender = data.get("gender")
        level = data.get("level")
        department = data.get("department")
        hostel = data.get("hostel")
        room = data.get("room")

        if full_name:
            student.full_name = full_name
        if matric_number:
            if matric_number != student.matric_number and Student.query.filter_by(matric_number=matric_number).first():
                return jsonify({"message": "Matric number already exists"}), 409
            student.matric_number = matric_number
        if password:
            student.password = password
        if gender:
            student.gender = gender
        if level:
            student.level = level
        if department:
            student.department = department
        if hostel:
            student.hostel = hostel
        if  room:
            student.room = room

        db.session.commit()
        return jsonify({"message": "Student updated successfully"}), 200
    else:
        db.session.delete(student)
        db.session.commit()
        return jsonify({"message": "Student deleted successfully"}), 200


