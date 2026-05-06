const express = require('express');
const router = express.Router();
const { getDoctors, getSlots, bookAppointment, getAppointments, cancelAppointment } = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/doctors', getDoctors);
router.get('/doctors/:doctorId/slots', getSlots);
router.post('/book', authorize('patient'), bookAppointment);
router.get('/appointments', authorize('patient'), getAppointments);
router.post('/appointments/:appointmentId/cancel', authorize('patient'), cancelAppointment);

module.exports = router;