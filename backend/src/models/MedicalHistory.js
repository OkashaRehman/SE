const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  diagnosis: { type: String },
  prescription: { type: String },
  allergies: { type: String },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('MedicalHistory', medicalHistorySchema);