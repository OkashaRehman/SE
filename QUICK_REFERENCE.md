# SmartClinic - Quick Reference Guide

A quick reference for developers on the SmartClinic team.

## 🚀 Quick Start (30 seconds)

```bash
# Terminal 1: Start Backend
cd backend
npm start

# Terminal 2: Start Frontend
cd frontend
npm run dev

# Open browser: http://localhost:5173
```

## 📂 Important File Locations

### Backend
- **Main Server**: `backend/src/server.js`
- **Controllers**: `backend/src/controllers/*.js`
- **Routes**: `backend/src/routes/*.js`
- **Models**: `backend/src/models/*.js`
- **Auth Middleware**: `backend/src/middleware/auth.js`
- **Config**: `backend/.env`
- **Dependencies**: `backend/package.json`

### Frontend
- **Main App**: `frontend/src/App.jsx`
- **API Client**: `frontend/src/api.js`
- **Auth Context**: `frontend/src/context/AuthContext.jsx`
- **Pages**: `frontend/src/pages/*.jsx`
- **Styles**: `frontend/src/index.css` (Tailwind)
- **Config**: `frontend/package.json`

## 🔑 API Base URL

```javascript
// Frontend
const API_BASE = 'http://localhost:5000/api';

// All requests need Authorization header:
headers: { Authorization: `Bearer ${token}` }
```

## 👤 Test Accounts

Login at http://localhost:5173

| Role | Email | Password |
|------|-------|----------|
| Patient | patient@example.com | password123 |
| Doctor | doctor@example.com | password123 |
| Admin | admin@example.com | password123 |

(Create via registration page)

## 📋 Common Tasks

### Add New Backend Endpoint

1. **Create Controller Method** (`controllers/patientController.js`):
```javascript
exports.myNewFunction = async (req, res) => {
  try {
    // Your logic here
    res.json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
};
```

2. **Add Route** (`routes/patientRoutes.js`):
```javascript
router.get('/my-endpoint', protect, authorize('patient'), myNewFunction);
```

3. **Test with Postman**:
```
GET http://localhost:5000/api/patient/my-endpoint
Header: Authorization: Bearer <your-jwt-token>
```

### Add New Frontend Page

1. **Create Component** (`pages/MyPage.jsx`):
```javascript
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const MyPage = () => {
  const { user, token } = useContext(AuthContext);
  
  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
};
```

2. **Add Route** (`App.jsx`):
```javascript
<Route
  path="/my-page"
  element={<ProtectedRoute><MyPage /></ProtectedRoute>}
/>
```

### Call API from Frontend

```javascript
import { patientAPI } from '../api';

const MyComponent = () => {
  const { token } = useContext(AuthContext);
  
  const fetchData = async () => {
    try {
      const { data } = await patientAPI.getDoctors(token);
      console.log(data);
    } catch (error) {
      console.error(error.response?.data?.message);
    }
  };
};
```

### Debug MongoDB Query

```javascript
// In controller
const result = await User.find({ role: 'doctor' });
console.log(JSON.stringify(result, null, 2));
```

## 🔒 Authentication Flow

```
1. User registers/logs in
2. Backend returns { _id, name, email, role, token }
3. Frontend stores token in localStorage
4. Token sent in Authorization header: "Bearer <token>"
5. Middleware extracts user from JWT
6. User available as req.user in controller
7. Logout clears token from localStorage
```

## 🚨 Error Handling Pattern

### Backend
```javascript
try {
  // Your code
} catch (error) {
  res.status(500).json({ 
    message: 'User-friendly error message',
    error: error.message 
  });
}
```

### Frontend
```javascript
try {
  const { data } = await someAPI.call(token);
} catch (error) {
  const errorMsg = error.response?.data?.message || 'Unknown error';
  setError(errorMsg);
}
```

## 🗄️ MongoDB Schema Reference

### User
```javascript
{
  name: String,
  email: String (unique),
  password_hash: String,
  role: 'patient' | 'doctor' | 'admin',
  is_active: Boolean,
  doctor_profile: { specialty, language, gender, consultation_fee },
  createdAt, updatedAt
}
```

### Slot
```javascript
{
  doctor_id: ObjectId,
  start_time: Date,
  end_time: Date,
  status: 'available' | 'locked' | 'booked' | 'unavailable',
  locked_until: Date,
  createdAt, updatedAt
}
```

### Appointment
```javascript
{
  slot_id: ObjectId,
  patient_id: ObjectId,
  doctor_id: ObjectId,
  status: 'confirmed' | 'cancelled' | 'completed',
  cancellation_reason: String,
  cancellation_role: 'patient' | 'doctor' | 'admin',
  createdAt, updatedAt
}
```

## 🎨 Tailwind CSS Classes Quick Reference

```javascript
// Layout
<div className="max-w-6xl mx-auto px-4 py-8">

// Buttons
className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"

// Forms
className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"

// Cards
className="bg-white rounded-lg shadow p-6"

// Grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

// Status Badge
className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold"
```

## 🧪 Testing Checklist

- [ ] Can register new user
- [ ] Can login with correct credentials
- [ ] Cannot login with wrong password
- [ ] Can view doctors list
- [ ] Can see available slots only
- [ ] Can book appointment
- [ ] Appointment appears in history
- [ ] Can cancel appointment
- [ ] Doctor can create slots
- [ ] Doctor can see patient queue
- [ ] Doctor can submit leave request
- [ ] Admin can create user
- [ ] Admin can see all users
- [ ] Admin can approve leave
- [ ] Admin can view cancellations

## 🔍 Common Debugging Tips

### Check if MongoDB Connected
- Look at terminal: "Successfully connected to MongoDB"
- Check MongoDB Atlas: Collections should exist

### Check if JWT Token Valid
- Console in browser: `localStorage.getItem('token')`
- Decode at jwt.io to verify content

### Check API Response
- Browser DevTools > Network tab
- Look at Response for actual data returned

### Check Component State
- Add `console.log()` in useEffect
- Use React DevTools extension

## 📦 Install New Package

```bash
# Backend
cd backend
npm install package-name

# Frontend
cd frontend
npm install package-name
```

## 🔄 Git Workflow

```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Feature: Add new feature description"

# View history
git log --oneline
```

## 📊 File Size Limits

- Database: Unlimited (cloud)
- Session: 24 hours
- JWT Token: ~1KB
- File uploads: Not implemented yet

## 🔐 Security Checklist

Before production:
- [ ] Change JWT_SECRET
- [ ] Enable HTTPS
- [ ] Set CORS_ORIGIN to specific domain
- [ ] Configure password hashing cost
- [ ] Set up database backups
- [ ] Monitor error logs
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Use environment-specific configs

## 🚀 Performance Tips

1. **Frontend**: Use React DevTools Profiler
2. **Backend**: Add indexes to MongoDB: `db.collection.createIndex({ email: 1 })`
3. **Database**: Monitor slow queries in Atlas
4. **Images**: Optimize before uploading
5. **API**: Cache frequently accessed data

## 📞 Quick Help

**Backend not starting?**
- Check `npm install` ran successfully
- Verify MONGO_URI in .env
- Check port 5000 not already in use

**Frontend not loading?**
- Check backend is running
- Clear browser cache
- Verify correct URL (http://localhost:5173)

**Database errors?**
- Check MongoDB Atlas status
- Verify connection string
- Check user credentials in Atlas

## 🎯 Sprint Goals

**Sprint 1** (Complete):
- ✅ Core auth system
- ✅ Patient booking workflow
- ✅ Doctor schedule management
- ✅ Admin user management

**Sprint 2** (TODO):
- Email notifications
- Analytics dashboard
- Prescription PDFs
- Improved UI/UX

**Sprint 3** (TODO):
- Video consultations
- Mobile app
- Advanced reporting
- API optimization

## 📞 Team Contacts

- **Questions?** Check documentation first
- **Bugs?** Create GitHub issue with details
- **Suggestions?** Discuss in team meetings

---

**Pro Tips**:
1. Always check documentation before asking
2. Test locally before pushing
3. Write clear commit messages
4. Add comments for complex logic
5. Follow existing code style
6. Update tests when changing code

---

**Happy Coding! 🚀**