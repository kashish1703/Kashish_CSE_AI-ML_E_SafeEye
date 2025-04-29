from flask import Flask, send_from_directory, abort
from flask_mongoengine import MongoEngine
from flask_socketio import SocketIO
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from app.utils.config import Config
import os

# Initialize extensions
db = MongoEngine()
socketio = SocketIO()
jwt = JWTManager()
cors = CORS()

def create_app(config_class=Config):
    # Create Flask app with static file configuration
    app = Flask(__name__, 
                static_folder='../static', 
                static_url_path='')
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/*": {"origins": "*"}})
    
    # Configure Socket.IO
    socketio.init_app(
        app,
        cors_allowed_origins="*",
        async_mode='eventlet',
        logger=True,
        engineio_logger=True
    )
    
    # Register routes and blueprints
    with app.app_context():
        # Register main routes
        from app.routes import register_routes
        register_routes(app)
        
        # Register blueprints
        from app.auth.routes import auth_bp
        from app.detection.routes import detection_bp
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        app.register_blueprint(detection_bp, url_prefix='/api/detection')
    
    # Create upload directory
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    # Create upload directory
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    
    # Create default admin user if not exists
    with app.app_context():
        from app.models.user import User
        admin_email = "admin@crimedetect.com"
        if not User.objects(email=admin_email).first():
            admin_user = User(
                name="Admin User",
                email=admin_email,
                role="admin",
                is_active=True
            )
            admin_user.set_password("admin123")
            admin_user.save()
            print(f"Created default admin user: {admin_email} / admin123")
    
    # Serve frontend files
    @app.route('/')
    def serve_index():
        return send_from_directory(app.static_folder, 'index.html')
    
    @app.route('/<path:path>')
    def serve_any(path):
        if path.startswith('api/'):  # Don't interfere with API routes
            abort(404)
        try:
            return send_from_directory(app.static_folder, path)
        except:
            return send_from_directory(app.static_folder, 'index.html')
    
    return app