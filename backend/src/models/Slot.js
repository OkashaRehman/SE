const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['available', 'locked', 'booked', 'unavailable'], 
    default: 'available' 
  },
  locked_until: { type: Date, default: null } // Soft lock mechanism (3 minutes)
}, { timestamps: true });

module.exports = mongoose.model('Slot', slotSchema);