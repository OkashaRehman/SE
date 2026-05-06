const API_BASE_URL = 'http://localhost:5000/api';

class APIClient {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[API Error]', error);
      throw error;
    }
  }

  // Auth endpoints
  auth = {
    register: (data) => this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    login: (data) => this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  };

  // Patient endpoints
  patient = {
    getDoctors: () => this.request('/patient/doctors'),
    getSlots: (doctorId) => this.request(`/patient/doctors/${doctorId}/slots`),
    bookAppointment: (data) => this.request('/patient/book', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getAppointments: () => this.request('/patient/appointments'),
    cancelAppointment: (appointmentId) => this.request(`/patient/appointments/${appointmentId}/cancel`, {
      method: 'POST',
    }),
  };

  // Doctor endpoints
  doctor = {
    createSlots: (data) => this.request('/doctor/slots', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getSlots: () => this.request('/doctor/slots'),
    updateSlot: (slotId, data) => this.request(`/doctor/slots/${slotId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    getQueueAppointments: () => this.request('/doctor/queue'),
    submitLeaveRequest: (data) => this.request('/doctor/leave-request', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getSubstitutionBoard: () => this.request('/doctor/substitution-board'),
    volunteerAsSubstitute: (appointmentId) => this.request(`/doctor/volunteer/${appointmentId}`, {
      method: 'POST',
    }),
  };

  // Admin endpoints
  admin = {
    getUsers: () => this.request('/admin/users'),
    createUser: (data) => this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    editUser: (userId, data) => this.request(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    deactivateUser: (userId) => this.request(`/admin/users/${userId}/deactivate`, {
      method: 'POST',
    }),
    getAggregatedCalendar: () => this.request('/admin/calendar'),
    getLeaveRequests: () => this.request('/admin/leave-requests'),
    approveLeaveRequest: (leaveId) => this.request(`/admin/leave-requests/${leaveId}/approve`, {
      method: 'POST',
    }),
    rejectLeaveRequest: (leaveId) => this.request(`/admin/leave-requests/${leaveId}/reject`, {
      method: 'POST',
    }),
    getCancellations: () => this.request('/admin/cancellations'),
    assignSubstitute: (appointmentId, data) => this.request(`/admin/assign-substitute/${appointmentId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  };
}

export const api = new APIClient();
