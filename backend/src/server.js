const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patient', require('./routes/patientRoutes'));
app.use('/api/doctor', require('./routes/doctorRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the SmartClinic API' });
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
