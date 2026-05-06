const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], required: true },
  is_active: { type: Boolean, default: true },
  
  // Doctor specific fields (only populated if role is 'doctor')
  doctor_profile: {
    specialty: { type: String },
    language: { type: String, default: 'English' },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    consultation_fee: { type: Number, default: 0.00 }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);