SafeEye : Real Time Crime Detection System

Course : B.tech CSE (AI/ML) 

Team Members : 
Kashish - 2301730294 
Anmol Nagal - 2301730283
Mehak - 2301730307
Shubham - 2301730291

Project Description :
The Real-Time Crime Detection System is an AI-based solution designed to monitor live CCTV footage and detect suspicious activities such as theft, fights, illegal parking, and unauthorized access. It uses advanced machine learning models like YOLOv8 for object detection and OpenCV for motion tracking. When unusual behavior is identified, the system generates real-time alerts with video snippets and timestamps, notifying authorities via a secure web dashboard. This enhances public safety by enabling faster response and reducing reliance on manual surveillance.

Project Vedio Presentation : 

Technologies Used : 
✅ Machine Learning / Computer Vision
1. YOLOv8 (You Only Look Once):
For real-time object detection (e.g., people, vehicles, weapons).
2. OpenCV:
For motion tracking and detecting abnormal behaviors based on movement patterns.

✅ Programming Languages
1. Python:
Used for backend logic, machine learning integration, and video processing.
2. HTML, CSS, JavaScript:
For building the frontend interface of the web dashboard.

✅ Backend Development
1. Flask (Python Framework):
Used to build the web server, handle API endpoints, process video input, and integrate with the ML models.

✅ Frontend Development
1. HTML/CSS:
Structure and styling of the dashboard.
JavaScript:
2. For interactive elements and dynamic UI updates.

✅ Database (Optional if included)
1. MongoDB or PostgreSQL:
For storing incident logs, user credentials, timestamps, and system configurations.

✅ Real-Time Communication & Notifications
1. Socket.IO:
For real-time alert updates and dashboard synchronization.
2. Twilio API:
For sending SMS alerts to concerned authorities.
3.  Email API (SMTP or a service like SendGrid):
For sending email reports with incident summaries and video evidence.

How to Run the Project :
1. Set up Virtual Environment:
   python -m venv .venv
   .venv\Scripts\activate

2. Install Required Dependencies :
   pip install -r requirements.txt

3. Run the system :
   python app.py

4. Output :
   Running on http://127.0.0.1:5000/







