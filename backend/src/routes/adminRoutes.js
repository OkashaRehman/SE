const express = require('express');
const router = express.Router();
const { getUsers, createUser, editUser, deactivateUser, getAggregatedCalendar, getLeaveRequests, approveLeaveRequest, rejectLeaveRequest, getCancellations, assignSubstitute } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:userId', editUser);
router.post('/users/:userId/deactivate', deactivateUser);

router.get('/calendar', getAggregatedCalendar);
router.get('/leave-requests', getLeaveRequests);
router.post('/leave-requests/:leaveId/approve', approveLeaveRequest);
router.post('/leave-requests/:leaveId/reject', rejectLeaveRequest);

router.get('/cancellations', getCancellations);
router.post('/assign-substitute/:appointmentId', assignSubstitute);

module.exports = router;