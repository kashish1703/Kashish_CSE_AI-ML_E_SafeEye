// DOM Elements
const authContainer = document.getElementById('auth-container');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');
const themeToggle = document.getElementById('theme-toggle');
const notificationBadge = document.getElementById('notification-badge');
const notificationsDropdown = document.getElementById('notifications-dropdown');
const logoutBtn = document.getElementById('logout-btn');
const cameraGrid = document.getElementById('camera-grid');
const cameraSingle = document.getElementById('camera-single');
const backToGrid = document.getElementById('back-to-grid');
const singleCameraTitle = document.getElementById('single-camera-title');
const cameraNamePlaceholder = document.getElementById('camera-name-placeholder');
const dashboardView = document.getElementById('dashboard-view');
const incidentsView = document.getElementById('incidents-view');
const analyticsView = document.getElementById('analytics-view');
const usersView = document.getElementById('users-view');
const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
const incidentList = document.querySelector('.incident-list');
const cameraSearch = document.getElementById('camera-search');
const crimeAlert = document.getElementById('crime-alert');
const alertMessage = document.getElementById('alert-message');
const closeAlert = document.getElementById('close-alert');
const settingsPanel = document.getElementById('settings-panel');
const settingsBtn = document.getElementById('settings-btn');
const closeSettings = document.querySelector('.close-settings');
const settingsTabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

// Default credentials
const DEFAULT_EMAIL = "admin@safeeye.com";
const DEFAULT_PASSWORD = "admin123";

// Sample Data
const cameras = [
    { id: 1, name: 'Main Entrance', location: 'Building A', status: 'active', type: 'entrance' },
    { id: 2, name: 'Parking Lot', location: 'North Side', status: 'active', type: 'parking' },
    { id: 3, name: 'Lobby Area', location: 'Ground Floor', status: 'active', type: 'indoor' },
    { id: 4, name: 'Back Entrance', location: 'Building B', status: 'inactive', type: 'entrance' },
    { id: 5, name: 'Warehouse', location: 'East Wing', status: 'active', type: 'indoor' },
    { id: 6, name: 'Loading Dock', location: 'South Side', status: 'warning', type: 'outdoor' }
];

const incidents = [
    { id: 1, type: 'fight', camera: 'Main Entrance', time: '2023-05-15 14:30', confidence: '92%', status: 'new' },
    { id: 2, type: 'theft', camera: 'Warehouse', time: '2023-05-15 12:45', confidence: '85%', status: 'in-progress' },
    { id: 3, type: 'parking', camera: 'Parking Lot', time: '2023-05-15 11:20', confidence: '78%', status: 'resolved' },
    { id: 4, type: 'suspicious', camera: 'Back Entrance', time: '2023-05-15 09:15', confidence: '65%', status: 'new' },
    { id: 5, type: 'fight', camera: 'Lobby Area', time: '2023-05-14 18:30', confidence: '88%', status: 'resolved' }
];

const users = [
    { id: 1, name: 'Admin User', email: DEFAULT_EMAIL, role: 'Administrator', status: 'Active' },
    { id: 2, name: 'Operator 1', email: 'operator1@crimedetect.com', role: 'Operator', status: 'Active' },
    { id: 3, name: 'Operator 2', email: 'operator2@crimedetect.com', role: 'Operator', status: 'Inactive' },
    { id: 4, name: 'Viewer 1', email: 'viewer1@crimedetect.com', role: 'Viewer', status: 'Active' },
    { id: 5, name: 'Viewer 2', email: 'viewer2@crimedetect.com', role: 'Viewer', status: 'Active' }
];

// Initialize the app
function initApp() {
    // Check if user is logged in (in a real app, this would check localStorage/session)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        showDashboard();
    } else {
        showAuth();
    }
    
    // Auto-fill the default email for convenience
    if (document.getElementById('login-email')) {
        document.getElementById('login-email').value = DEFAULT_EMAIL;
    }
    
    // Render cameras
    renderCameras();
    
    // Render incidents
    renderIncidents();
    
    // Render users
    renderUsers();
    
    // Initialize charts
    initCharts();
    
    // Set up event listeners
    setupEventListeners();
}

// Initialize charts
function initCharts() {
    // Crime Trend Chart
    const trendCtx = document.getElementById('crime-trend-chart').getContext('2d');
    new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Incidents',
                data: [12, 19, 15, 23, 18, 25],
                borderColor: 'var(--primary)',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
    
    // Incident Type Chart
    const typeCtx = document.getElementById('incident-type-chart').getContext('2d');
    new Chart(typeCtx, {
        type: 'doughnut',
        data: {
            labels: ['Fights', 'Theft', 'Parking', 'Suspicious'],
            datasets: [{
                data: [12, 8, 15, 5],
                backgroundColor: [
                    'var(--danger)',
                    'var(--warning)',
                    'var(--primary)',
                    '#9b59b6'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            cutout: '70%'
        }
    });

    // Location Chart
    const locationCtx = document.getElementById('location-chart').getContext('2d');
    new Chart(locationCtx, {
        type: 'bar',
        data: {
            labels: ['Entrances', 'Parking', 'Indoor', 'Outdoor'],
            datasets: [{
                label: 'Incidents by Location',
                data: [18, 12, 8, 5],
                backgroundColor: [
                    'rgba(67, 97, 238, 0.7)',
                    'rgba(67, 97, 238, 0.7)',
                    'rgba(67, 97, 238, 0.7)',
                    'rgba(67, 97, 238, 0.7)'
                ],
                borderColor: [
                    'var(--primary)',
                    'var(--primary)',
                    'var(--primary)',
                    'var(--primary)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });

    // Time Distribution Chart
    const timeCtx = document.getElementById('time-chart').getContext('2d');
    new Chart(timeCtx, {
        type: 'polarArea',
        data: {
            labels: ['Morning', 'Afternoon', 'Evening', 'Night'],
            datasets: [{
                label: 'Incidents by Time',
                data: [8, 15, 12, 5],
                backgroundColor: [
                    'rgba(67, 97, 238, 0.7)',
                    'rgba(247, 37, 133, 0.7)',
                    'rgba(247, 127, 0, 0.7)',
                    'rgba(76, 201, 240, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Show crime alert
function showAlert(type, location) {
    alertMessage.textContent = `${type} detected at ${location}`;
    crimeAlert.style.display = 'flex';
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        crimeAlert.style.display = 'none';
    }, 10000);
}

// Show authentication forms
function showAuth() {
    authContainer.style.display = 'flex';
    dashboard.style.display = 'none';
    localStorage.removeItem('isLoggedIn');
}

// Show dashboard
function showDashboard() {
    authContainer.style.display = 'none';
    dashboard.style.display = 'block';
    localStorage.setItem('isLoggedIn', 'true');
}

// Render cameras to the grid
function renderCameras() {
    cameraGrid.innerHTML = '';
    
    cameras.forEach(camera => {
        const cameraItem = document.createElement('div');
        cameraItem.className = 'camera-item';
        cameraItem.dataset.id = camera.id;
        
        let statusClass = 'success';
        if (camera.status === 'inactive') statusClass = 'danger';
        if (camera.status === 'warning') statusClass = 'warning';
        
        cameraItem.innerHTML = `
            <div class="camera-header">
                <div class="camera-name">
                    <i class="fas fa-video"></i>
                    <span>${camera.name}</span>
                </div>
                <div class="camera-status ${statusClass}">${camera.status}</div>
            </div>
            <div class="camera-feed">
                <div class="video-placeholder">
                    <i class="fas fa-video"></i> ${camera.name} Feed
                </div>
            </div>
            <div class="camera-footer">
                <div class="camera-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${camera.location}</span>
                </div>
                <div class="camera-actions">
                    <button class="camera-btn view-camera-btn" data-id="${camera.id}">
                        <i class="fas fa-expand"></i>
                    </button>
                    <button class="camera-btn">
                        <i class="fas fa-cog"></i>
                    </button>
                </div>
            </div>
        `;
        
        cameraGrid.appendChild(cameraItem);
    });
    
    // Add event listeners to view buttons
    document.querySelectorAll('.view-camera-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const cameraId = e.currentTarget.dataset.id;
            showSingleCamera(cameraId);
        });
    });
}

// Show single camera view
function showSingleCamera(cameraId) {
    const camera = cameras.find(c => c.id == cameraId);
    if (!camera) return;
    
    dashboardView.style.display = 'none';
    incidentsView.style.display = 'none';
    analyticsView.style.display = 'none';
    usersView.style.display = 'none';
    cameraSingle.style.display = 'block';
    
    singleCameraTitle.innerHTML = `<i class="fas fa-video"></i> ${camera.name}`;
    cameraNamePlaceholder.textContent = camera.name;
}

// Render incidents to the list
function renderIncidents() {
    incidentList.innerHTML = '';
    
    incidents.forEach(incident => {
        const incidentItem = document.createElement('div');
        incidentItem.className = 'incident-item';
        
        let typeText = '';
        if (incident.type === 'fight') typeText = 'Fight';
        if (incident.type === 'theft') typeText = 'Theft';
        if (incident.type === 'parking') typeText = 'Illegal Parking';
        if (incident.type === 'suspicious') typeText = 'Suspicious';
        
        incidentItem.innerHTML = `
            <div class="incident-type ${incident.type}">${typeText}</div>
            <div class="incident-details">
                <div class="incident-camera">
                    <i class="fas fa-video"></i>
                    <span>${incident.camera}</span>
                </div>
                <div class="incident-time">
                    <i class="far fa-clock"></i>
                    <span>${incident.time}</span>
                </div>
                <div class="incident-confidence">
                    Confidence: <span>${incident.confidence}</span>
                </div>
            </div>
            <div class="incident-actions">
                <button class="view-incident-btn">View</button>
            </div>
        `;
        
        incidentList.appendChild(incidentItem);
    });
}

// Render users to the table
function renderUsers() {
    const usersTable = document.querySelector('.users-table tbody');
    usersTable.innerHTML = '';
    
    users.forEach(user => {
        const userRow = document.createElement('tr');
        
        let statusClass = 'online';
        if (user.status === 'Inactive') statusClass = 'offline';
        
        userRow.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td><span class="status-badge ${statusClass}">${user.status}</span></td>
            <td>
                <button class="users-action-btn"><i class="fas fa-edit"></i></button>
                <button class="users-action-btn"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        usersTable.appendChild(userRow);
    });
}

// Set up event listeners
function setupEventListeners() {
    // Toggle between login and signup forms
    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    });
    
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    });
    
    // Login form submission with default credentials check
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                // Store token and user data
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Redirect to dashboard
                window.location.href = "/";
            } else {
                showLoginError(data.error || 'Login failed');
            }
        } catch (error) {
            showLoginError('Network error - please try again');
            console.error('Login error:', error);
        }
    });
    
    // Signup form submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const role = document.getElementById('signup-role').value;
        
        // In a real app, this would validate with a server
        if (name && email && password && confirmPassword && role) {
            if (password === confirmPassword) {
                showDashboard();
            } else {
                alert('Passwords do not match!');
            }
        }
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        
        if (document.body.classList.contains('light-mode')) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
    
    // Notifications dropdown
    notificationBadge.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationsDropdown.classList.toggle('active');
    });
    
    // Close notifications when clicking outside
    document.addEventListener('click', (e) => {
        if (!notificationBadge.contains(e.target)) {
            notificationsDropdown.classList.remove('active');
        }
    });
    
    // Mark all as read
    document.querySelector('.mark-all-read').addEventListener('click', () => {
        document.querySelectorAll('.notification-item.unread').forEach(item => {
            item.classList.remove('unread');
        });
        document.querySelector('.notification-count').textContent = '0';
    });
    
    // Logout
    logoutBtn.addEventListener('click', () => {
        showAuth();
    });
    
    // Back to grid view
    backToGrid.addEventListener('click', () => {
        dashboardView.style.display = 'block';
        incidentsView.style.display = 'none';
        analyticsView.style.display = 'none';
        usersView.style.display = 'none';
        cameraSingle.style.display = 'none';
    });
    
    // Sidebar navigation
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            const view = link.dataset.view;
            if (view) {
                // Hide all views
                dashboardView.style.display = 'none';
                incidentsView.style.display = 'none';
                analyticsView.style.display = 'none';
                usersView.style.display = 'none';
                cameraSingle.style.display = 'none';
                
                // Show selected view
                if (view === 'dashboard-view') {
                    dashboardView.style.display = 'block';
                } else if (view === 'cameras-view') {
                    dashboardView.style.display = 'block';
                } else if (view === 'incidents-view') {
                    incidentsView.style.display = 'block';
                } else if (view === 'analytics-view') {
                    analyticsView.style.display = 'block';
                } else if (view === 'users-view') {
                    usersView.style.display = 'block';
                }
            }
            
            // Special case for logout
            if (link.id === 'logout-btn') {
                showAuth();
            }
        });
    });
    
    // Camera search
    cameraSearch.addEventListener('input', function(e) {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.camera-item').forEach(camera => {
            const name = camera.querySelector('.camera-name span').textContent.toLowerCase();
            camera.style.display = name.includes(term) ? 'block' : 'none';
        });
    });
    
    // Close crime alert
    closeAlert.addEventListener('click', () => {
        crimeAlert.style.display = 'none';
    });
    
    // Show crime alert (demo)
    setTimeout(() => {
        showAlert('Fight', 'Main Entrance');
    }, 5000);
    
    // Settings panel toggle
    settingsBtn.addEventListener('click', () => {
        settingsPanel.classList.add('active');
    });
    
    closeSettings.addEventListener('click', () => {
        settingsPanel.classList.remove('active');
    });
    
    // Settings tabs
    settingsTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            settingsTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const tabName = tab.dataset.tab;
            document.querySelector(`.tab-content[data-tab="${tabName}"]`).classList.add('active');
        });
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);