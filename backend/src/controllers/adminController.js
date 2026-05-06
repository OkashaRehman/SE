const User = require('../models/User');
const Appointment = require('../models/Appointment');
const LeaveRequest = require('../models/LeaveRequest');
const Slot = require('../models/Slot');
const bcrypt = require('bcrypt');

// US-A03: Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password_hash');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// US-A03: Create new user (Admin creates accounts)
exports.createUser = async (req, res) => {
  const { name, email, password, role, specialty } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const userData = { name, email, password_hash, role };
    if (role === 'doctor') {
      userData.doctor_profile = { specialty: specialty || 'General' };
    }

    const user = await User.create(userData);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// US-A03: Edit user
exports.editUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    Object.assign(user, req.body);
    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// US-A03: Deactivate user
exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.is_active = false;
    await user.save();
    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// US-A01: Get aggregated calendar for all doctors
exports.getAggregatedCalendar = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor', is_active: true });
    const slots = await Slot.find();

    const calendar = {};
    doctors.forEach(doc => {
      calendar[doc._id] = {
        doctor_name: doc.name,
        specialty: doc.doctor_profile?.specialty,
        slots: slots.filter(s => s.doctor_id.toString() === doc._id.toString())
      };
    });

    res.json(calendar);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// US-A06: Get all leave requests
exports.getLeaveRequests = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find()
      .populate('doctor_id', 'name')
      .sort({ createdAt: -1 });

    const formatted = leaves.map(l => ({
      _id: l._id,
      doctor_name: l.doctor_id.name,
      start_date: l.start_date,
      end_date: l.end_date,
      reason: l.reason,
      status: l.status
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// US-A06: Approve leave request
exports.approveLeaveRequest = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.leaveId);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leave.status = 'approved';
    await leave.save();

    // Mark affected slots as unavailable
    await Slot.updateMany(
      {
        doctor_id: leave.doctor_id,
        start_time: { $gte: leave.start_date, $lte: leave.end_date }
      },
      { status: 'unavailable' }
    );

    res.json({ message: 'Leave request approved' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// US-A06: Reject leave request
exports.rejectLeaveRequest = async (req, res) => {
  const { comment } = req.body;
  try {
    const leave = await LeaveRequest.findById(req.params.leaveId);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leave.status = 'rejected';
    await leave.save();

    res.json({ message: 'Leave request rejected', comment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// US-A05: Get cancellations log
exports.getCancellations = async (req, res) => {
  try {
    const cancellations = await Appointment.find({ status: 'cancelled' })
      .populate('patient_id', 'name')
      .populate('doctor_id', 'name')
      .sort({ createdAt: -1 });

    const formatted = cancellations.map(c => ({
      _id: c._id,
      patient_name: c.patient_id?.name,
      doctor_name: c.doctor_id?.name,
      cancellation_reason: c.cancellation_reason,
      cancellation_role: c.cancellation_role,
      createdAt: c.createdAt
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// US-A02: Manually assign substitute doctor
exports.assignSubstitute = async (req, res) => {
  const { doctor_id } = req.body;
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.doctor_id = doctor_id;
    await appointment.save();

    res.json({ message: 'Substitute assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};