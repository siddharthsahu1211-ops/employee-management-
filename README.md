# Employee Management System

A comprehensive web-based employee management system built with Python (backend) and JavaScript (frontend). This application allows organizations to manage employees, departments, payroll, complaints, and generate reports.

## Features

- **Employee Management**: Add, update, delete, and view employee information
- **Department Management**: Organize employees by departments
- **Payroll Processing**: Calculate and manage employee salaries
- **Complaint System**: Handle employee complaints and resolutions
- **Reports**: Generate various reports on employees and departments
- **User-Friendly Interface**: Modern web interface with responsive design
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
│   │   ├── index.html
│   │   ├── home.html
│   │   ├── employees.html (implied)
│   │   ├── departments.html
│   │   ├── payroll.html
│   │   ├── complaints.html
│   │   ├── reports.html
│   │   └── 404.html
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css
│   │   └── js/
│   │       ├── app.js
│   │       ├── components/  # Reusable UI components
│   │       ├── controllers/ # Frontend controllers
│   │       ├── router/      # Frontend routing
│   │       ├── services/    # Frontend services
│   │       ├── state/       # State management
│   │       └── utils/       # Utility functions
│   └── env.js              # Environment configuration
├── tests/                 # Unit and integration tests
│   ├── test_api_smoke.py
│   └── test_db_basic.py
└── README.md
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
   - **Home**: Dashboard overview
   - **Employees**: Manage employee records
   - **Departments**: Organize departments
   - **Payroll**: Process payroll
   - **Complaints**: Handle employee complaints
   - **Reports**: View reports

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
