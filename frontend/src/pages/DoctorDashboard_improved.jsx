import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { doctorAPI } from '../api';
import { LogOut, Plus, AlertCircle, Calendar, Users, Briefcase, Clock, Heart, CheckCircle, XCircle } from 'lucide-react';

export const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useContext(AuthContext);
  const [tab, setTab] = useState('schedule');
  const [slots, setSlots] = useState([]);
  const [queue, setQueue] = useState([]);
  const [substitutionBoard, setSubstitutionBoard] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // New slot form
  const [newSlotStartTime, setNewSlotStartTime] = useState('');
  const [newSlotEndTime, setNewSlotEndTime] = useState('');

  // Leave request form
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [slotsRes, queueRes, boardRes] = await Promise.all([
        doctorAPI.getSlots(token),
        doctorAPI.getQueueAppointments(token),
        doctorAPI.getSubstitutionBoard(token),
      ]);
      setSlots(slotsRes.data);
      setQueue(queueRes.data);
      setSubstitutionBoard(boardRes.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSlot = async () => {
    if (!newSlotStartTime || !newSlotEndTime) {
      setError('Please fill all slot details');
      return;
    }
    try {
      await doctorAPI.createSlots({ start_time: newSlotStartTime, end_time: newSlotEndTime }, token);
      setNewSlotStartTime('');
      setNewSlotEndTime('');
      alert('Slot created successfully!');
      fetchData();
    } catch (err) {
      setError('Failed to create slot');
    }
  };

  const handleSubmitLeave = async () => {
    if (!leaveStartDate || !leaveEndDate || !leaveReason) {
      setError('Please fill all leave details');
      return;
    }
    try {
      await doctorAPI.submitLeaveRequest(
        { start_date: leaveStartDate, end_date: leaveEndDate, reason: leaveReason },
        token
      );
      setLeaveStartDate('');
      setLeaveEndDate('');
      setLeaveReason('');
      alert('Leave request submitted!');
      fetchData();
    } catch (err) {
      setError('Failed to submit leave request');
    }
  };

  const handleVolunteerAsSubstitute = async (appointmentId) => {
    try {
      await doctorAPI.volunteerAsSubstitute(appointmentId, token);
      alert('You volunteered as a substitute!');
      fetchData();
    } catch (err) {
      setError('Failed to volunteer as substitute');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalSlots = slots.length;
  const bookedSlots = slots.filter(s => s.status === 'booked').length;
  const todayQueue = queue.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Professional Header */}
      <header className="bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2">
                <Briefcase className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">SmartClinic</h1>
                <p className="text-xs text-blue-600 font-semibold">Doctor Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">Dr. {user?.name}</p>
                <p className="text-xs text-gray-500">{user?.doctor_profile?.specialty}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-semibold transition"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle size={20} className="flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-blue-100 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total Slots</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{totalSlots}</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <Calendar className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-green-100 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Booked Slots</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{bookedSlots}</p>
              </div>
              <div className="bg-green-100 rounded-lg p-3">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-purple-100 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Today's Queue</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{todayQueue}</p>
              </div>
              <div className="bg-purple-100 rounded-lg p-3">
                <Users className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'schedule', label: 'My Schedule', icon: Calendar },
            { id: 'queue', label: 'Patient Queue', icon: Users },
            { id: 'leave', label: 'Leave Request', icon: Clock },
            { id: 'substitution', label: 'Substitution Board', icon: Heart }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 whitespace-nowrap ${
                tab === id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        {/* Schedule Tab */}
        {tab === 'schedule' && (
          <div className="space-y-6">
            {/* Add Slot Card */}
            <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Plus className="text-blue-600" size={24} />
                Add New Time Slot
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                  <input
                    type="datetime-local"
                    value={newSlotStartTime}
                    onChange={(e) => setNewSlotStartTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                  <input
                    type="datetime-local"
                    value={newSlotEndTime}
                    onChange={(e) => setNewSlotEndTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleCreateSlot}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-105"
                  >
                    <Plus className="inline mr-2" size={20} />
                    Add Slot
                  </button>
                </div>
              </div>
            </div>

            {/* Slots List */}
            <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Your Slots</h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : slots.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No slots created yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {slots.map((slot) => (
                    <div key={slot._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">
                          {new Date(slot.start_time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(slot.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.end_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                        slot.status === 'available' ? 'bg-green-100 text-green-700' :
                        slot.status === 'booked' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Patient Queue Tab */}
        {tab === 'queue' && (
          <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Users size={24} className="text-blue-600" />
              Today's Patient Queue
            </h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : queue.length === 0 ? (
              <div className="text-center py-8">
                <Users size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No appointments today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {queue.map((apt, index) => (
                  <div key={apt._id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                    <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center font-bold text-blue-600">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{apt.patient_name}</p>
                      <p className="text-sm text-gray-600">{apt.patient_email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">
                        {new Date(apt.slot_start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-sm text-gray-500">Appointment</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Leave Request Tab */}
        {tab === 'leave' && (
          <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Clock className="text-blue-600" size={24} />
              Submit Leave Request
            </h2>

            <div className="max-w-2xl mb-8 p-6 bg-blue-50 rounded-lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={leaveStartDate}
                    onChange={(e) => setLeaveStartDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={leaveEndDate}
                    onChange={(e) => setLeaveEndDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Reason</label>
                  <textarea
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    rows="4"
                    placeholder="Enter your leave reason..."
                  />
                </div>
                <button
                  onClick={handleSubmitLeave}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-lg transition transform hover:scale-105"
                >
                  Submit Leave Request
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Substitution Board Tab */}
        {tab === 'substitution' && (
          <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Heart size={24} className="text-blue-600" />
              Substitution Board
            </h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : substitutionBoard.length === 0 ? (
              <div className="text-center py-8">
                <Heart size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No uncovered appointments</p>
              </div>
            ) : (
              <div className="space-y-4">
                {substitutionBoard.map((item) => (
                  <div key={item._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">Dr. {item.original_doctor_name}</p>
                      <p className="text-sm text-gray-600">Patient: {item.patient_name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(item.appointment_time).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleVolunteerAsSubstitute(item.appointment_id)}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-6 py-2 rounded-lg transition"
                    >
                      Volunteer
                    </button>
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
