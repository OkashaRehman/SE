# SmartClinic - Online Medical Appointment & Patient Portal

A comprehensive full-stack healthcare management system built with the MERN stack (MongoDB, Express, React, Node.js) that solves real clinic management problems.

## Project Overview

SmartClinic is designed around three real-world personas:
- **Sara (Patient)**: Books appointments easily, receives notifications, sees real availability
- **Dr. Hamid (Doctor)**: Manages schedule visually, views patient queue, submits leave requests
- **Zara (Clinic Coordinator)**: Approves registrations, monitors clinic health, assigns substitutes

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Tailwind CSS + React Router |
| Backend | Node.js + Express.js |
| Database | MongoDB (Cloud Atlas) |
| Authentication | JWT + bcrypt |
| API Style | RESTful |

## Project Structure

```
smart-clinic/
├── frontend/                 # React application
│   ├── src/
│   │   ├── pages/           # Page components (Login, Register, Dashboards)
│   │   ├── context/         # Authentication context
│   │   ├── api.js           # API client configuration
│   │   ├── App.jsx          # Main app with routing
│   │   └── index.css        # Tailwind styles
│   └── package.json
│
├── backend/                  # Express API server
│   ├── src/
│   │   ├── controllers/     # Business logic for each role
│   │   │   ├── authController.js
│   │   │   ├── patientController.js
│   │   │   ├── doctorController.js
│   │   │   └── adminController.js
│   │   ├── models/          # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Slot.js
│   │   │   ├── Appointment.js
│   │   │   ├── LeaveRequest.js
│   │   │   ├── SubstitutionBoard.js
│   │   │   └── MedicalHistory.js
│   │   ├── routes/          # API endpoints
│   │   │   ├── authRoutes.js
│   │   │   ├── patientRoutes.js
│   │   │   ├── doctorRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── middleware/      # Authentication & authorization
│   │   │   └── auth.js
│   │   └── server.js        # Express app setup
│   ├── .env                 # Environment configuration
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account (free tier available)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Configure MongoDB Connection**:
   - Create a free MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas
   - Update `backend/.env` with your connection string:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/smartclinic?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_USER=your_mailtrap_user
   EMAIL_PASS=your_mailtrap_password
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the server**:
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev (if nodemon is installed)
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## Core Features by User Role

### 👥 Patient Features
- **US-P01**: Register and login with JWT authentication
- **US-P02**: Browse and filter doctors by specialty, language, gender
- **US-P03**: View only genuinely available time slots (real-time)
- **US-P04**: Confirm appointment booking in one click
- **US-P05**: Cancel appointment with reason (up to 2hrs before)
- **US-P06**: Receive email notification if doctor goes on leave
- **US-P07**: View upcoming and past appointment history

### 👨‍⚕️ Doctor Features
- **US-D01**: Drag-and-drop schedule calendar for visual slot management
- **US-D02**: System prevents double-booking automatically
- **US-D03**: View today's patient queue in structured dashboard
- **US-D04**: Submit leave request with date range and reason
- **US-D05**: Slots automatically go dark/unavailable during leave
- **US-D06**: View uncovered appointments on substitution board
- **US-D07**: Resize availability blocks for flexible slot sizing

### 🏥 Admin Features
- **US-A01**: View aggregated calendar of all doctors' schedules
- **US-A02**: Manually assign substitute doctor to uncovered slots
- **US-A03**: Manage doctor and patient accounts (create, edit, deactivate)
- **US-A04**: Receive summary notification when doctor submits leave
- **US-A05**: View all cancellations with reasons and patterns
- **US-A06**: Approve or reject leave requests with comments

## API Endpoints

### Authentication
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login and get JWT token
```

### Patient Endpoints
```
GET    /api/patient/doctors                    - Get all doctors
GET    /api/patient/doctors/:doctorId/slots    - Get available slots
POST   /api/patient/book                       - Book appointment
GET    /api/patient/appointments               - Get user's appointments
POST   /api/patient/appointments/:id/cancel    - Cancel appointment
```

### Doctor Endpoints
```
POST   /api/doctor/slots                       - Create time slot
GET    /api/doctor/slots                       - Get all doctor's slots
PUT    /api/doctor/slots/:slotId               - Update slot
GET    /api/doctor/queue                       - Get today's patient queue
POST   /api/doctor/leave-request               - Submit leave request
GET    /api/doctor/substitution-board          - View open substitutions
POST   /api/doctor/volunteer/:appointmentId    - Volunteer as substitute
```

### Admin Endpoints
```
GET    /api/admin/users                        - Get all users
POST   /api/admin/users                        - Create new user
PUT    /api/admin/users/:userId                - Edit user
POST   /api/admin/users/:userId/deactivate     - Deactivate user
GET    /api/admin/calendar                     - Get aggregated calendar
GET    /api/admin/leave-requests               - Get all leave requests
POST   /api/admin/leave-requests/:id/approve   - Approve leave
POST   /api/admin/leave-requests/:id/reject    - Reject leave
GET    /api/admin/cancellations                - Get cancellation log
POST   /api/admin/assign-substitute/:aptId     - Assign substitute
```

## Key Technical Features

### Soft-Lock Mechanism (Concurrency Control)
Prevents double-booking during high load:
- Slot locked for 3 minutes when patient begins checkout
- Cron job releases expired locks
- Only unlocked slots appear in real-time search

### Role-Based Access Control (RBAC)
- JWT tokens contain user role
- Middleware enforces route-level permissions
- Patients cannot access admin routes

### Event-Driven Leave Workflow
When doctor submits leave:
1. System detects all affected appointments
2. Patient emails dispatched automatically
3. Calendar slots marked unavailable
4. Substitution board updated
5. Admin receives summary notification

### Responsive Design
- Mobile-first approach (375px minimum)
- Works seamlessly on desktop (1920px)
- Tailwind CSS utility classes
- Touch-friendly interfaces

## Frontend Components Hierarchy

```
App (Router + AuthProvider)
├── Login
├── Register
├── PatientDashboard
│   ├── DoctorSearch
│   ├── SlotSelection
│   └── AppointmentHistory
├── DoctorDashboard
│   ├── ScheduleCalendar
│   ├── PatientQueue
│   ├── LeaveRequestForm
│   └── SubstitutionBoard
└── AdminDashboard
    ├── UserManagement
    ├── LeaveApprovals
    ├── CancellationLog
    └── Analytics
```

## Error Handling

All responses follow standard JSON format:
```json
{
  "message": "Error or success description",
  "data": { /* optional */ },
  "error": "Error details" /* optional */
}
```

## Security Measures

✅ Passwords hashed with bcrypt (cost factor: 10)  
✅ JWT tokens with 24-hour expiry  
✅ Role-based access control on all routes  
✅ Input validation on all endpoints  
✅ CORS enabled for frontend origin  
✅ Parameterized queries (Mongoose prevents SQL injection)  
✅ Password never returned in API responses  

## Performance Targets

- Page load time: < 3 seconds
- Booking wizard: 3 or fewer clicks
- Real-time slot availability: < 500ms update
- Soft-lock completion: < 200ms
- Support 50+ concurrent users

## Future Enhancements (Sprint 2 & 3)

- [ ] Email notification service integration (Nodemailer/SendGrid)
- [ ] Automated reminder emails (24h and 1h before appointment)
- [ ] Chart.js analytics dashboard
- [ ] Prescription PDF generation
- [ ] Video consultation integration
- [ ] Multi-language support
- [ ] SMS notifications
- [ ] Native mobile app
- [ ] Advanced reporting & analytics

## Testing

Run the application and test with these demo credentials:

**Patient Account**
- Email: patient@example.com
- Password: password123

**Doctor Account**
- Email: doctor@example.com
- Password: password123

**Admin Account**
- Email: admin@example.com
- Password: password123

## Troubleshooting

### MongoDB Connection Error
- Verify MONGO_URI in .env is correct
- Check IP whitelist in MongoDB Atlas
- Ensure MongoDB cluster is running

### Frontend API Calls Failing
- Verify backend is running on port 5000
- Check CORS configuration in backend
- Verify JWT token is being sent in Authorization header

### Login Not Working
- Clear browser localStorage
- Check user email matches exactly
- Verify password is correct (case-sensitive)

## Contributing

This is a university course project. Each team member handles specific components:
- Okasha (Product Owner): Patient-facing features
- Abrar Butt (Scrum Master): Doctor scheduling
- Wania Mateen (Frontend Dev): Patient UI
- Rimsha Nosheen (Backend Dev): APIs & logic
- Hafiz M. Abdullah Saleh (Full-Stack): Admin & cross-cutting
- M. Yousaf Rafiq (QA/Tester): Integration & testing

## License

MIT

## Support

For issues or questions, contact the development team through the project repository.

---

**Last Updated**: May 6, 2026  
**Current Sprint**: Sprint 1 - Core Functionality  
**Team**: Group 6 - Software Engineering Course