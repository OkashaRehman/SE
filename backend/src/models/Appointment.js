const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  slot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true, unique: true },
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['confirmed', 'cancelled', 'completed'], 
    default: 'confirmed' 
  },
  cancellation_reason: { type: String, default: null },
  cancellation_role: { type: String, enum: ['patient', 'doctor', 'admin'], default: null }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);