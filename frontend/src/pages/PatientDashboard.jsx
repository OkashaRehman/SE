import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { patientAPI } from '../api';
import { LogOut, Search, Calendar, AlertCircle, Heart, Clock, User } from 'lucide-react';

export const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('book');

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data } = await patientAPI.getDoctors(token);
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (err) {
      setError('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data } = await patientAPI.getAppointments(token);
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load appointments');
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredDoctors(doctors);
    } else {
      setFilteredDoctors(
        doctors.filter(doc =>
          doc.name.toLowerCase().includes(term.toLowerCase()) ||
          doc.doctor_profile?.specialty?.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
  };

  const handleSelectDoctor = async (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedSlot(null);
    try {
      const { data } = await patientAPI.getSlots(doctor._id, token);
      setSlots(data.filter(slot => slot.status === 'available'));
    } catch (err) {
      setError('Failed to load slots');
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      setError('Please select a time slot');
      return;
    }
    try {
      await patientAPI.bookAppointment(selectedSlot._id, token);
      alert('Appointment booked successfully!');
      setSelectedDoctor(null);
      setSelectedSlot(null);
      setTab('appointments');
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    const reason = prompt('Enter cancellation reason:');
    if (!reason) return;
    try {
      await patientAPI.cancelAppointment(appointmentId, { reason }, token);
      alert('Appointment cancelled successfully!');
      fetchAppointments();
    } catch (err) {
      setError('Failed to cancel appointment');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabStyle = (isActive) => isActive 
    ? 'border-blue-600 text-blue-600' 
    : 'border-transparent text-gray-600 hover:text-blue-600';

  const doctorButtonStyle = (isSelected) => isSelected
    ? 'border-blue-500 bg-blue-50'
    : 'border-gray-200 bg-white hover:border-blue-300';

  const slotButtonStyle = (isSelected) => isSelected
    ? 'border-blue-500 bg-blue-50'
    : 'border-gray-200 bg-white hover:border-blue-300';

  const statusBadgeStyle = (status) => {
    if (status === 'confirmed') return 'bg-green-100 text-green-700';
    if (status === 'cancelled') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <Heart size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">SmartClinic</h1>
              <p className="text-blue-100 text-sm">Patient Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-blue-100 text-sm">Patient</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Doctors</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{doctors.length}</p>
              </div>
              <User size={24} className="text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Upcoming Appointments</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {appointments.filter(a => a.status === 'confirmed').length}
                </p>
              </div>
              <Calendar size={24} className="text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Appointments</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{appointments.length}</p>
              </div>
              <Clock size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          <button
            onClick={() => setTab('book')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold transition border-b-2 ${tabStyle(tab === 'book')}`}
          >
            <Calendar size={18} /> Book Appointment
          </button>
          <button
            onClick={() => setTab('appointments')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold transition border-b-2 ${tabStyle(tab === 'appointments')}`}
          >
            <Clock size={18} /> My Appointments
          </button>
        </div>

        {/* Book Tab */}
        {tab === 'book' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Find a Doctor</h2>
                <div className="mb-4 relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name or specialty..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {loading && <p className="text-gray-500">Loading doctors...</p>}
                  {!loading && filteredDoctors.length === 0 && <p className="text-gray-500">No doctors found</p>}
                  {filteredDoctors.map(doctor => (
                    <button
                      key={doctor._id}
                      onClick={() => handleSelectDoctor(doctor)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition ${doctorButtonStyle(selectedDoctor?._id === doctor._id)}`}
                    >
                      <p className="font-semibold text-gray-800">{doctor.name}</p>
                      <p className="text-sm text-gray-600">{doctor.doctor_profile?.specialty || 'General'}</p>
                      <p className="text-sm text-green-600 font-semibold">Rs. {doctor.doctor_profile?.consultation_fee || 500}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Select Time Slot</h2>
                {selectedDoctor ? (
                  <>
                    <p className="text-gray-600 mb-4">Dr. {selectedDoctor.name}</p>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {slots.length === 0 && <p className="text-gray-500">No available slots</p>}
                      {slots.map(slot => (
                        <button
                          key={slot._id}
                          onClick={() => setSelectedSlot(slot)}
                          className={`w-full p-3 rounded-lg border-2 transition text-left ${slotButtonStyle(selectedSlot?._id === slot._id)}`}
                        >
                          <p className="font-semibold text-gray-800">{new Date(slot.start_time).toLocaleString()}</p>
                          <p className="text-sm text-green-600">Available</p>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleBookAppointment}
                      disabled={!selectedSlot}
                      className="w-full mt-6 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition"
                    >
                      Confirm Booking
                    </button>
                  </>
                ) : (
                  <p className="text-gray-500">Select a doctor first</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {tab === 'appointments' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">My Appointments</h2>
            {appointments.length === 0 ? (
              <p className="text-gray-500">No appointments yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {appointments.map(apt => (
                  <div key={apt._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-gray-800">Dr. {apt.doctor_name || 'Unknown'}</p>
                        <p className="text-sm text-gray-600">{new Date(apt.slot_start_time).toLocaleString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadgeStyle(apt.status)}`}>
                        {apt.status}
                      </span>
                    </div>
                    {apt.status === 'cancelled' && apt.cancellation_reason && (
                      <p className="text-sm text-gray-600 mb-3">Reason: {apt.cancellation_reason}</p>
                    )}
                    {apt.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancelAppointment(apt._id)}
                        className="w-full text-red-600 hover:text-red-700 font-semibold py-2 rounded transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
