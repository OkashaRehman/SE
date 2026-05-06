import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const authAPI = {
  register: (data) => axios.post(`${API_BASE}/auth/register`, data),
  login: (data) => axios.post(`${API_BASE}/auth/login`, data),
};

export const patientAPI = {
  getDoctors: (token) => axios.get(`${API_BASE}/patient/doctors`, { headers: { Authorization: `Bearer ${token}` } }),
  getSlots: (doctorId, token) => axios.get(`${API_BASE}/patient/doctors/${doctorId}/slots`, { headers: { Authorization: `Bearer ${token}` } }),
  bookAppointment: (data, token) => axios.post(`${API_BASE}/patient/book`, data, { headers: { Authorization: `Bearer ${token}` } }),
  getAppointments: (token) => axios.get(`${API_BASE}/patient/appointments`, { headers: { Authorization: `Bearer ${token}` } }),
  cancelAppointment: (appointmentId, data, token) => axios.post(`${API_BASE}/patient/appointments/${appointmentId}/cancel`, data, { headers: { Authorization: `Bearer ${token}` } }),
};

export const doctorAPI = {
  createSlots: (data, token) => axios.post(`${API_BASE}/doctor/slots`, data, { headers: { Authorization: `Bearer ${token}` } }),
  updateSlots: (slotId, data, token) => axios.put(`${API_BASE}/doctor/slots/${slotId}`, data, { headers: { Authorization: `Bearer ${token}` } }),
  getSlots: (token) => axios.get(`${API_BASE}/doctor/slots`, { headers: { Authorization: `Bearer ${token}` } }),
  getQueueAppointments: (token) => axios.get(`${API_BASE}/doctor/queue`, { headers: { Authorization: `Bearer ${token}` } }),
  submitLeaveRequest: (data, token) => axios.post(`${API_BASE}/doctor/leave-request`, data, { headers: { Authorization: `Bearer ${token}` } }),
  getSubstitutionBoard: (token) => axios.get(`${API_BASE}/doctor/substitution-board`, { headers: { Authorization: `Bearer ${token}` } }),
  volunteerAsSubstitute: (appointmentId, token) => axios.post(`${API_BASE}/doctor/volunteer/${appointmentId}`, {}, { headers: { Authorization: `Bearer ${token}` } }),
};

export const adminAPI = {
  getAggregatedCalendar: (token) => axios.get(`${API_BASE}/admin/calendar`, { headers: { Authorization: `Bearer ${token}` } }),
  getUsers: (token) => axios.get(`${API_BASE}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
  createUser: (data, token) => axios.post(`${API_BASE}/admin/users`, data, { headers: { Authorization: `Bearer ${token}` } }),
  editUser: (userId, data, token) => axios.put(`${API_BASE}/admin/users/${userId}`, data, { headers: { Authorization: `Bearer ${token}` } }),
  deactivateUser: (userId, token) => axios.post(`${API_BASE}/admin/users/${userId}/deactivate`, {}, { headers: { Authorization: `Bearer ${token}` } }),
  getLeaveRequests: (token) => axios.get(`${API_BASE}/admin/leave-requests`, { headers: { Authorization: `Bearer ${token}` } }),
  approveLeaveRequest: (leaveId, token) => axios.post(`${API_BASE}/admin/leave-requests/${leaveId}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } }),
  rejectLeaveRequest: (leaveId, data, token) => axios.post(`${API_BASE}/admin/leave-requests/${leaveId}/reject`, data, { headers: { Authorization: `Bearer ${token}` } }),
  assignSubstitute: (appointmentId, data, token) => axios.post(`${API_BASE}/admin/assign-substitute/${appointmentId}`, data, { headers: { Authorization: `Bearer ${token}` } }),
  getCancellations: (token) => axios.get(`${API_BASE}/admin/cancellations`, { headers: { Authorization: `Bearer ${token}` } }),
};