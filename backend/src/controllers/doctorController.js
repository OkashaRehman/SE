const Slot = require('../models/Slot');
const LeaveRequest = require('../models/LeaveRequest');
const SubstitutionBoard = require('../models/SubstitutionBoard');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// US-D01: Doctor creates/manages available time slots
exports.createSlots = async (req, res) => {
  const { start_time, end_time } = req.body;
  try {
    if (new Date(start_time) >= new Date(end_time)) {
      return res.status(400).json({ message: 'Start time must be before end time' });
    }

    const slot = await Slot.create({
      doctor_id: req.user._id,
      start_time,
      end_time,
      status: 'available'
    });

    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get doctor's slots
exports.getSlots = async (req, res) => {
  try {
    const slots = await Slot.find({ doctor_id: req.user._id })
      .sort({ start_time: 1 });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update slot (resize, change status)
exports.updateSlot = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.slotId);
    
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    if (slot.doctor_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    Object.assign(slot, req.body);
    await slot.save();
    res.json(slot);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// US-D03: Get today's patient queue
exports.getQueueAppointments = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await Appointment.find({
      doctor_id: req.user._id,
      status: 'confirmed'
    })
      .populate('slot_id')
      .populate('patient_id', 'name')
      .sort({ 'slot_id.start_time': 1 });

    const todayApts = appointments.filter(apt => {
      const aptDate = new Date(apt.slot_id.start_time);
      return aptDate >= today && aptDate < tomorrow;
    });

    const formatted = todayApts.map(apt => ({
      _id: apt._id,
      patient_name: apt.patient_id.name,
      appointment_time: apt.slot_id.start_time
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// US-D04: Submit leave request
exports.submitLeaveRequest = async (req, res) => {
  const { start_date, end_date, reason } = req.body;
  try {
    if (new Date(start_date) >= new Date(end_date)) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }

    const leaveRequest = await LeaveRequest.create({
      doctor_id: req.user._id,
      start_date,
      end_date,
      reason,
      status: 'pending'
    });

    res.status(201).json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// US-D06: View substitution board (uncovered appointments)
exports.getSubstitutionBoard = async (req, res) => {
  try {
    const board = await SubstitutionBoard.find({ status: 'open' })
      .populate('appointment_id')
      .populate('original_doctor_id', 'name');

    const formatted = board.map(b => ({
      _id: b._id,
      appointment_id: b.appointment_id._id,
      patient_name: b.appointment_id.patient_name,
      appointment_time: b.appointment_id.appointment_time,
      original_doctor_name: b.original_doctor_id.name
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Doctor volunteers as substitute
exports.volunteerAsSubstitute = async (req, res) => {
  try {
    const board = await SubstitutionBoard.findOne({ appointment_id: req.params.appointmentId });
    
    if (!board) {
      return res.status(404).json({ message: 'Substitution request not found' });
    }

    const appointment = await Appointment.findById(board.appointment_id);
    appointment.doctor_id = req.user._id;
    await appointment.save();

    board.status = 'covered';
    await board.save();

    res.json({ message: 'Volunteered as substitute successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};