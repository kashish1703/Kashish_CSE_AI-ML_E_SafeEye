# Project: SafeEye-Inspired Security Monitoring System (No DB)

# === Project Structure ===
# - app.py (Flask server)
# - templates/
#     - login.html
#     - signup.html
#     - dashboard.html
#     - cameras.html
#     - incidents.html
#     - analytics.html
#     - users.html
#     - alerts.html
#     - settings.html
#     - base.html
# - static/
#     - styles.css
#     - scripts.js
#     - logo.png (optional)
#     - placeholder images/icons

# === app.py ===
from flask import Flask, render_template, request, redirect, session, Response, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from yolov8_detector import detect_objects

app = Flask(__name__)
app.secret_key = 'secret-key'

# Simulated in-memory data
users = {}
incidents = [
    {"id": 1, "type": "Theft", "status": "New", "date": "2025-04-08"},
    {"id": 2, "type": "Fights", "status": "In Progress", "date": "2025-04-07"},
    {"id": 3, "type": "Suspicious Activity", "status": "Resolved", "date": "2025-04-06"},
]

@app.route('/')
def home():
    return redirect('/login')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = users.get(email)

        if user and check_password_hash(user['password'], password):
            session['user'] = email
            session['role'] = user['role']
            session['name'] = user['name']
            return redirect('/dashboard')
        return "Invalid Credentials"
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.form['email']
        password = generate_password_hash(request.form['password'])
        role = request.form['role']
        name = request.form['name']
        users[email] = {'password': password, 'role': role, 'name': name}
        return redirect('/login')
    return render_template('signup.html')

@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect('/login')

    stats = {
        'active_cameras': 4,
        'daily_incidents': len(incidents),
        'resolved_alerts': sum(1 for i in incidents if i['status'] == 'Resolved'),
        'system_status': 'Operational'
    }
    return render_template('dashboard.html', name=session['name'], role=session['role'], stats=stats)

@app.route('/cameras')
def cameras():
    return render_template('cameras.html')

@app.route('/incidents')
def incidents_view():
    return render_template('incidents.html', incidents=incidents)

@app.route('/analytics')
def analytics():
    return render_template('analytics.html')

@app.route('/users')
def user_management():
    return render_template('users.html', users=users)

@app.route('/alerts')
def alerts():
    return render_template('alerts.html')

@app.route('/settings')
def settings():
    return render_template('settings.html')

@app.route('/video_feed')
def video_feed():
    return Response(detect_objects(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/login')

if __name__ == '__main__':
    app.run(debug=True)
