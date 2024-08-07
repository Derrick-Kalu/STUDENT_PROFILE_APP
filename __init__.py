from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from config import Config

app = Flask(__name__)
db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    app.config.from_object(Config)
    db.init_app(app)
    login_manager.init_app(app)

    with app.app_context():
        db.create_all()

        from .models import Student

    @login_manager.user_loader
    def load_student(user_id):
        return Student.query.get(int(user_id))

    return app


from app import routes