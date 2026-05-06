const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);