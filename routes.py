from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_login import login_required, current_user  # For authentication
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps

# Mock database (replace with real DB in production)
users_db = {
    "admin@example.com": {
        "name": "Admin User",
        "password": generate_password_hash("admin123"),
        "role": "admin"
    }
}

cameras_db = [
    {"id": 1, "name": "Main Entrance", "location": "Building A", "status": "active"},
    {"id": 2, "name": "Parking Lot", "location": "North Side", "status": "active"},
]

incidents_db = [
    {"id": 1, "type": "fight", "camera_id": 1, "time": "2023-05-15 14:30", "confidence": 92},
    {"id": 2, "type": "theft", "camera_id": 2, "time": "2023-05-15 12:45", "confidence": 85},
]

# JWT Secret Key (replace with a secure key in production)
SECRET_KEY = "your-secret-key-here"

# Decorator for token authentication
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "Token is missing!"}), 401
        try:
            data = jwt.decode(token.split()[1], SECRET_KEY, algorithms=["HS256"])
        except:
            return jsonify({"error": "Invalid token!"}), 401
        return f(*args, **kwargs)
    return decorated

def register_routes(app):
    # Health Check
    @app.route('/health')
    def health_check():
        return jsonify({"status": "healthy", "version": "1.0.0"}), 200

    # Authentication
    @app.route('/api/auth/login', methods=['POST'])
    def login():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400

        user = users_db.get(email)
        if not user or not check_password_hash(user['password'], password):
            return jsonify({"error": "Invalid credentials"}), 401

        # Generate JWT token
        token = jwt.encode({
            'email': email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY)

        return jsonify({
            "token": token,
            "user": {
                "name": user['name'],
                "email": email,
                "role": user['role']
            }
        }), 200

    # Camera Management
    @app.route('/api/detection/cameras', methods=['GET'])
    @token_required
    def get_cameras():
        return jsonify(cameras_db), 200

    @app.route('/api/detection/cameras/<int:camera_id>', methods=['GET'])
    @token_required
    def get_camera(camera_id):
        camera = next((c for c in cameras_db if c['id'] == camera_id), None)
        if not camera:
            return jsonify({"error": "Camera not found"}), 404
        return jsonify(camera), 200

    # Incident Reports
    @app.route('/api/detection/incidents', methods=['GET'])
    @token_required
    def get_incidents():
        return jsonify(incidents_db), 200

    @app.route('/api/detection/incidents/<int:incident_id>', methods=['GET'])
    @token_required
    def get_incident(incident_id):
        incident = next((i for i in incidents_db if i['id'] == incident_id), None)
        if not incident:
            return jsonify({"error": "Incident not found"}), 404
        return jsonify(incident), 200

    # Analytics
    @app.route('/api/analytics/trends', methods=['GET'])
    @token_required
    def get_analytics_trends():
        return jsonify({
            "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            "data": [12, 19, 15, 23, 18, 25]
        }), 200

    @app.route('/api/analytics/types', methods=['GET'])
    @token_required
    def get_incident_types():
        return jsonify({
            "labels": ["Fights", "Theft", "Parking", "Suspicious"],
            "data": [12, 8, 15, 5]
        }), 200

    # User Management
    @app.route('/api/users', methods=['GET'])
    @token_required
    def get_users():
        return jsonify([
            {"id": 1, "name": "Admin User", "email": "admin@example.com", "role": "admin"},
            {"id": 2, "name": "Operator 1", "email": "operator1@example.com", "role": "operator"}
        ]), 200