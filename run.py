import eventlet
eventlet.monkey_patch()

from app import create_app, socketio
from app.utils.config import Config

app = create_app(Config)

# Debug: Print all routes
print("\n=== REGISTERED ROUTES ===")
for rule in app.url_map.iter_rules():
    print(f"{rule.rule} -> {rule.endpoint}")

if __name__ == '__main__':
    socketio.run(
        app,
        host='127.0.0.1',
        port=5000,
        debug=True
    )