# SmartClinic Project Setup Guide

## Complete Walkthrough - From Zero to Running

This guide will walk you through setting up and running the complete SmartClinic project.

## Step 1: MongoDB Atlas Setup (10 minutes)

1. **Create MongoDB Account**:
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free (no credit card needed for M0 cluster)
   - Create a new project called "SmartClinic"

2. **Create a Cluster**:
   - Click "Create" for a new cluster
   - Choose "M0 Free" tier
   - Select your region
   - Click "Create Cluster" (wait 2-3 minutes for setup)

3. **Create Database User**:
   - Go to "Security" > "Database Access"
   - Click "Add New Database User"
   - Set Username: `smartclinic_user`
   - Set Password: (generate secure one)
   - Save these credentials!

4. **Get Connection String**:
   - Go to "Clusters"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the MongoDB URI
   - Format: `mongodb+srv://smartclinic_user:<password>@<cluster>.mongodb.net/smartclinic?retryWrites=true&w=majority`

5. **Whitelist IP** (Important):
   - Go to "Security" > "Network Access"
   - Click "Add IP Address"
   - Choose "Allow access from anywhere" (0.0.0.0/0) for development
   - Or add your specific IP

## Step 2: Backend Configuration

1. **Update Backend .env File**:
   ```bash
   cd backend
   # Edit .env with your MongoDB connection string
   nano .env  # or use your editor
   ```

   Example `.env`:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://smartclinic_user:YourSecurePassword@cluster0.mongodb.net/smartclinic?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_USER=your_mailtrap_user
   EMAIL_PASS=your_mailtrap_password
   ```

2. **Install Backend Dependencies**:
   ```bash
   npm install
   ```

3. **Verify Backend Starts**:
   ```bash
   npm start
   ```

   Expected output:
   ```
   Successfully connected to MongoDB
   Server running on port 5000
   ```

   Press `Ctrl+C` to stop for now.

## Step 3: Frontend Configuration

1. **Frontend is Pre-configured**:
   ```bash
   cd ../frontend
   ```

   The frontend is already set to communicate with `http://localhost:5000/api`

2. **Verify Dependencies**:
   ```bash
   npm install
   ```

## Step 4: Running the Application

### Option A: Two Terminal Windows (Recommended)

**Terminal 1 - Start Backend**:
```bash
cd backend
npm start
# Output: Server running on port 5000
```

**Terminal 2 - Start Frontend**:
```bash
cd frontend
npm run dev
# Output: Local: http://localhost:5173/
```

### Option B: Using Package Managers

**With npm-run-all** (run both concurrently):
```bash
npm install -g npm-run-all
cd smart-clinic
npm run all
```

## Step 5: Test the Application

### Access the Application
- Open browser: `http://localhost:5173/`

### Test User Accounts

Create these via the Registration page, or manually insert in MongoDB:

1. **Patient Account**:
   - Name: John Doe
   - Email: patient@example.com
   - Password: password123
   - Role: Patient

2. **Doctor Account**:
   - Name: Dr. Ahmed Khan
   - Email: doctor@example.com
   - Password: password123
   - Role: Doctor
   - Specialty: Cardiology

3. **Admin Account**:
   - Name: Zara Admin
   - Email: admin@example.com
   - Password: password123
   - Role: Admin

### Test Workflows

**Patient Flow**:
1. Login as patient
2. Browse doctors
3. Select a doctor
4. View available slots
5. Book appointment
6. View booked appointments

**Doctor Flow**:
1. Login as doctor
2. Create new time slots
3. View patient queue
4. Submit leave request
5. Check substitution board

**Admin Flow**:
1. Login as admin
2. View all users
3. Create new user
4. Approve/reject leave requests
5. View cancellations
6. Assign substitute doctor

## Step 6: Verify Database

### MongoDB Atlas Console

1. Go to https://cloud.mongodb.com/
2. Click on your cluster
3. Click "Collections"
4. You should see these collections:
   - `users`
   - `slots`
   - `appointments`
   - `leaverequests`
   - `substitutionboards`

### View Data

- Click on "users" collection
- You should see your created accounts

## Troubleshooting

### Issue: "Cannot find module 'mongoose'"
**Solution**: Run `npm install` in backend folder

### Issue: "MONGO_URI is not defined"
**Solution**: Make sure `.env` file exists in backend folder with MONGO_URI

### Issue: "Illegal operation on a directory"
**Solution**: Make sure you're in correct directory (check with `pwd` or `cd`)

### Issue: "Port 5000 already in use"
**Solution**: 
```bash
# Find what's using port 5000
netstat -tlnp | grep 5000  # On Linux/Mac
netstat -ano | findstr :5000  # On Windows

# Kill the process or use different port
# Edit PORT in backend/.env
```

### Issue: "Cannot POST /api/auth/login"
**Solution**: 
- Verify backend is running on port 5000
- Check CORS is enabled in server.js
- Verify MongoDB is connected

### Issue: "Frontend shows blank page"
**Solution**:
- Check browser console (F12) for errors
- Clear localStorage: `localStorage.clear()`
- Try incognito/private mode
- Verify backend API URL in api.js matches your backend

## Database Schema

Once running, MongoDB will auto-create these collections:

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password_hash: String,
  role: "patient" | "doctor" | "admin",
  is_active: Boolean,
  doctor_profile: {
    specialty: String,
    language: String,
    gender: String,
    consultation_fee: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Slots Collection
```javascript
{
  doctor_id: ObjectId (ref: User),
  start_time: Date,
  end_time: Date,
  status: "available" | "locked" | "booked" | "unavailable",
  locked_until: Date (for soft-lock mechanism)
}
```

### Appointments Collection
```javascript
{
  slot_id: ObjectId (ref: Slot),
  patient_id: ObjectId (ref: User),
  doctor_id: ObjectId (ref: User),
  status: "confirmed" | "cancelled" | "completed",
  cancellation_reason: String,
  cancellation_role: "patient" | "doctor" | "admin"
}
```

## API Testing with Postman

1. **Install Postman**: https://www.postman.com/downloads/
2. **Set up Environment Variable**:
   - Create new environment
   - Variable: `token` (will store JWT)
   - Variable: `base_url` = `http://localhost:5000/api`

3. **Test Login Endpoint**:
   ```
   POST http://localhost:5000/api/auth/login
   Body (JSON):
   {
     "email": "patient@example.com",
     "password": "password123"
   }
   ```

4. **Store JWT Token**:
   - In response, copy `token` value
   - Set environment variable: `token = <copied_value>`

5. **Test Protected Endpoint**:
   ```
   GET http://localhost:5000/api/patient/doctors
   Header:
   Authorization: Bearer {{token}}
   ```

## Development Tips

### Hot Reload
- Frontend already has hot reload (changes auto-reflect)
- Backend: Install nodemon for auto-restart
  ```bash
  npm install --save-dev nodemon
  npm run dev  # instead of npm start
  ```

### Debug Mode
- Add `console.log()` in backend files
- Check browser console (F12) in frontend
- Check Network tab to inspect API calls

### Common Git Commands
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial SmartClinic setup"

# View status
git status
```

## Next Steps

1. **Customize Email Notifications**: Set up Mailtrap account for email testing
2. **Add Chart.js**: Install for analytics dashboard (Sprint 2)
3. **Deploy**: Use Heroku/Render for backend, Vercel for frontend
4. **Security**: Change JWT_SECRET before production
5. **Testing**: Write unit tests with Jest

## Resources

- **MongoDB Docs**: https://docs.mongodb.com/
- **Express API**: https://expressjs.com/
- **React Docs**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **Mongoose**: https://mongoosejs.com/

## Support

If you encounter issues:
1. Check the README.md in project root
2. Review error messages carefully
3. Check .env configuration
4. Verify MongoDB connection in Atlas console
5. Check browser console for frontend errors
6. Check terminal for backend logs

---

**Setup Complete!** 🎉

Your SmartClinic application is now ready for development and testing.