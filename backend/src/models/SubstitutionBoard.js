const mongoose = require('mongoose');

const substitutionBoardSchema = new mongoose.Schema({
  appointment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  original_doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['open', 'covered'], 
    default: 'open' 
  }
}, { timestamps: true });

module.exports = mongoose.model('SubstitutionBoard', substitutionBoardSchema);