const Slot = require('../models/Slot');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// US-P02: Get all active doctors (browsable by patients)
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor', is_active: true }).select('-password_hash');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// US-P03: Get available slots for a specific doctor
exports.getSlots = async (req, res) => {
  try {
    const slots = await Slot.find({ 
      doctor_id: req.params.doctorId, 
      status: 'available',
      end_time: { $gt: new Date() } // Only future slots
    }).sort({ start_time: 1 });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// US-P04: Book an appointment (conflict-safe with soft-lock)
exports.bookAppointment = async (req, res) => {
  const { slot_id } = req.body;
  try {
    const slot = await Slot.findById(slot_id);
    
    if (!slot || slot.status !== 'available') {
      return res.status(400).json({ message: 'Slot unavailable or already booked' });
    }

    // Soft-lock mechanism (3 minutes)
    const lockExpiration = new Date(Date.now() + 3 * 60 * 1000);
    slot.status = 'locked';
    slot.locked_until = lockExpiration;
    await slot.save();

    // Create appointment
    const appointment = await Appointment.create({
      slot_id,
      patient_id: req.user._id,
      doctor_id: slot.doctor_id
    });

    // Unlock the slot and mark as booked
    slot.status = 'booked';
    slot.locked_until = null;
    await slot.save();

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// US-P07: Get patient's appointment history
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient_id: req.user._id })
      .populate('slot_id')
      .populate('doctor_id', 'name')
      .sort({ createdAt: -1 });

    const formatted = appointments.map(apt => ({
      _id: apt._id,
      slot_start_time: apt.slot_id?.start_time,
      doctor_name: apt.doctor_id?.name,
      status: apt.status,
      cancellation_reason: apt.cancellation_reason
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// US-P05: Cancel appointment with reason
exports.cancelAppointment = async (req, res) => {
  const { cancellation_reason } = req.body;
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.patient_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Release the slot
    const slot = await Slot.findById(appointment.slot_id);
    if (slot) {
      slot.status = 'available';
      await slot.save();
    }

    appointment.status = 'cancelled';
    appointment.cancellation_reason = cancellation_reason;
    appointment.cancellation_role = 'patient';
    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};