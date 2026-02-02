# Employee Management System

A comprehensive web-based employee management system built with Python (backend) and JavaScript (frontend). This application allows organizations to manage employees, departments, payroll, complaints, and generate reports with a modern dark-themed interface.

## Features

- **Employee Management**: Add, update, delete, and view employee information
- **Department Management**: Organize employees by departments
- **Payroll Processing**: Calculate and manage employee salaries
- **Complaint System**: Handle employee complaints with employee tracking
- **Employee Directory & Reports**: Unified view with profile modals and export capabilities
- **Modern UI/UX**: Dark theme with skeleton loading, micro-animations, and hover effects
- **Export Functionality**: Export data to CSV and PDF formats
- **RESTful API**: Backend API for easy integration

## Project Structure

```
employee-management-/
├── app.py                 # Main application entry point
├── router.py              # URL routing configuration
├── controllers/           # Business logic controllers
│   ├── complaint.py
│   ├── department.py
│   ├── employee.py
│   └── payroll.py
├── services/              # Service layer for data operations
│   ├── complaint_service.py
│   ├── department_service.py
│   ├── employee_service.py
│   └── payroll_service.py
├── database/              # Database connection and queries
│   ├── connection.py
│   ├── queries.py
│   └── complaintstable.py
├── core/                  # Core utilities and middleware
│   ├── middleware.py
│   ├── request.py
│   ├── responses.py
│   └── static.py
├── frontend/              # Frontend application
│   ├── pages/             # HTML pages
│   │   ├── index.html     # Main layout with navigation
│   │   ├── home.html      # Dashboard with statistics
│   │   ├── employees.html # Employee management
│   │   ├── departments.html # Department management
│   │   ├── payroll.html   # Payroll processing
│   │   ├── complaints.html # Complaint system with employee tracking
│   │   ├── reports.html   # Employee directory & reports with profiles
│   │   └── 404.html       # Error page
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css  # Dark theme with animations
│   │   └── js/
│   │       ├── app.js     # Main application entry
│   │       ├── components/ # Reusable UI components
│   │       ├── controllers/ # Page controllers
│   │       ├── router/     # Frontend routing
│   │       ├── services/   # API services
│   │       ├── state/      # State management
│   │       └── utils/      # Utilities (skeleton, export, etc.)
│   └── env.js             # Environment configuration
├── tests/                 # Unit and integration tests
│   ├── test_api_smoke.py
│   └── test_db_basic.py
└── README.md
```

## How It Works - Application Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Opens    │    │  Frontend Loads │    │ Backend Server  │
│   Web Browser   │───▶│   HTML/CSS/JS   │───▶│   Starts (app.py)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Navigation    │    │  Page Controllers│    │   API Routes    │
│   Menu Clicked  │───▶│   Handle Actions │───▶│  (router.py)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Data Display  │    │  Business Logic │    │   Database      │
│   (Tables/Forms)│◀───│  (Controllers)  │◀───│   Operations    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Step-by-Step User Journey:

1. **Start Application**: Run `python app.py` → Server starts on localhost:5000
2. **Access Website**: Open browser → Navigate to localhost:5000 → Main page loads
3. **Navigate Pages**: Click menu items → JavaScript router loads different pages
4. **Perform Actions**: 
   - Add Employee → Form submission → API call → Database insert
   - View Reports → Data fetch → API response → Table display
   - Process Payroll → Calculate salaries → Store in database
   - Submit Complaint → Select employee → Save complaint record
5. **Export Data**: Click export buttons → Generate CSV/PDF → Download file

### Data Flow Example (Adding an Employee):
```
User fills form → JavaScript validates → POST /api/employees → 
Controller processes → Service layer → Database saves → 
Success response → UI updates → Employee appears in list
```

## Installation

### Prerequisites

- Python 3.8 or higher
- A database system (e.g., SQLite, PostgreSQL, MySQL)
- Node.js (optional, for frontend development)

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/siddharthsahu1211-ops/employee-management-.git
   cd employee-management-
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure the database:
   - Update `database/connection.py` with your database credentials
   - Run database migrations if needed

5. Run the application:
   ```bash
   python app.py
   ```

The application will start on `http://localhost:5000` (or your configured port).

### Frontend Setup

The frontend is served statically by the backend. No additional setup is required if you're running the Python application.

For development:
1. Open `frontend/pages/index.html` in your browser
2. Or use a local server:
   ```bash
   cd frontend
   python -m http.server 8000
   ```

## Usage

1. Start the application as described in Installation
2. Open your browser and navigate to `http://localhost:5000`
3. Use the navigation menu to access different sections:
   - **Home**: Dashboard with statistics and overview
   - **Employees**: Manage employee records with CRUD operations
   - **Departments**: Organize and manage departments
   - **Payroll**: Process and manage employee payroll
   - **Complaints**: Handle employee complaints with employee tracking
   - **Reports**: Employee directory with profile viewing and export options

## API Endpoints

The application provides RESTful API endpoints:

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `GET /api/employees/{id}` - Get employee by ID
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create new department
- `GET /api/departments/{id}` - Get department by ID
- `PUT /api/departments/{id}` - Update department
- `DELETE /api/departments/{id}` - Delete department

### Payroll
- `GET /api/payroll` - Get payroll records
- `POST /api/payroll` - Process payroll

### Complaints
- `GET /api/complaints` - Get all complaints
- `POST /api/complaints` - Submit new complaint
- `PUT /api/complaints/{id}` - Update complaint status

## Testing

Run the test suite:

```bash
python -m pytest tests/
```

Or run specific tests:
```bash
python tests/test_api_smoke.py
python tests/test_db_basic.py
```

## Recent Updates

- **Enhanced UI/UX**: Implemented dark theme with skeleton loading animations and micro-interactions
- **Merged Profile & Reports**: Combined employee profiles into the reports page for better user experience
- **Complaint Tracking**: Added employee selection to track which employee made each complaint
- **Export Features**: Added CSV and PDF export functionality for employee data
- **Performance Improvements**: Optimized loading states and data rendering

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
