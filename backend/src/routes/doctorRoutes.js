const express = require('express');
const router = express.Router();
const { createSlots, getSlots, updateSlot, getQueueAppointments, submitLeaveRequest, getSubstitutionBoard, volunteerAsSubstitute } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('doctor'));

router.post('/slots', createSlots);
router.get('/slots', getSlots);
router.put('/slots/:slotId', updateSlot);
router.get('/queue', getQueueAppointments);
router.post('/leave-request', submitLeaveRequest);
router.get('/substitution-board', getSubstitutionBoard);
router.post('/volunteer/:appointmentId', volunteerAsSubstitute);

module.exports = router;