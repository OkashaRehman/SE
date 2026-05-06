import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { patientAPI } from '../api';
import { Search, Calendar, AlertCircle, User, Clock, MapPin, Phone } from 'lucide-react';
import { Button, Card, Badge, Input, Modal, useToast, ToastContainer, Header } from '../components';

export const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [doctorsData, appointmentsData] = await Promise.all([
        patientAPI.getDoctors(user?.token),
        patientAPI.getAppointments(user?.token),
      ]);
      setDoctors(doctorsData.data);
      setFilteredDoctors(doctorsData.data);
      setAppointments(appointmentsData.data || []);
    } catch (err) {
      addToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = doctors.filter(doc =>
      doc.name.toLowerCase().includes(term.toLowerCase()) ||
      (doc.doctor_profile?.specialty || '').toLowerCase().includes(term.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  const handleSelectDoctor = async (doctor) => {
    setSelectedDoctor(doctor);
    try {
      const { data } = await patientAPI.getSlots(doctor._id, user?.token);
      setSlots(data.filter(slot => slot.status === 'available'));
      setShowBookingModal(true);
    } catch (err) {
      addToast('Failed to load slots', 'error');
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      addToast('Please select a time slot', 'error');
      return;
    }
    try {
      await patientAPI.bookAppointment(selectedSlot._id, user?.token);
      addToast('Appointment booked successfully!', 'success');
      setShowBookingModal(false);
      setSelectedDoctor(null);
      setSelectedSlot(null);
      fetchData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to book appointment', 'error');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await patientAPI.cancelAppointment(appointmentId, { reason: 'User cancelled' }, user?.token);
      addToast('Appointment cancelled', 'success');
      fetchData();
    } catch (err) {
      addToast('Failed to cancel appointment', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <Header
        title="Patient Dashboard"
        subtitle={`Welcome back, ${user?.name}`}
        actions={[{ icon: User, label: 'Profile', onClick: () => {} }]}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Doctors</p>
                <p className="text-4xl font-bold text-primary-600 mt-2">{doctors.length}</p>
              </div>
              <User className="w-12 h-12 text-primary-500 opacity-20" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Upcoming</p>
                <p className="text-4xl font-bold text-secondary-600 mt-2">{confirmedCount}</p>
              </div>
              <Calendar className="w-12 h-12 text-secondary-500 opacity-20" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Appointments</p>
                <p className="text-4xl font-bold text-slate-600 dark:text-slate-300 mt-2">{appointments.length}</p>
              </div>
              <Clock className="w-12 h-12 text-slate-400 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Find Doctor */}
          <div className="lg:col-span-1">
            <Card>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Find a Doctor</h2>
              <Input
                placeholder="Search by name or specialty"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                icon={Search}
              />
              <div className="space-y-2 mt-4 max-h-96 overflow-y-auto">
                {loading ? (
                  <p className="text-slate-500 text-center py-8">Loading doctors...</p>
                ) : filteredDoctors.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No doctors found</p>
                ) : (
                  filteredDoctors.map((doctor) => (
                    <button
                      key={doctor._id}
                      onClick={() => handleSelectDoctor(doctor)}
                      className="w-full text-left p-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition"
                    >
                      <p className="font-semibold text-slate-900 dark:text-white">{doctor.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {doctor.doctor_profile?.specialty || 'General'}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Appointments */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">My Appointments</h2>
              {appointments.length === 0 ? (
                <div className="py-12 text-center">
                  <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">No appointments yet</p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                    Find and book a doctor from the list
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <div
                      key={apt._id}
                      className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            Dr. {apt.doctor_name || 'Unknown'}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mt-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(apt.slot_start_time).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge
                          variant={apt.status === 'confirmed' ? 'secondary' : 'neutral'}
                          size="sm"
                        >
                          {apt.status}
                        </Badge>
                      </div>
                      {apt.status === 'confirmed' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancelAppointment(apt._id)}
                        >
                          Cancel Appointment
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedDoctor(null);
          setSelectedSlot(null);
        }}
        title={selectedDoctor ? `Book with Dr. ${selectedDoctor.name}` : 'Select a Time Slot'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowBookingModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleBookAppointment}
              disabled={!selectedSlot}
            >
              Confirm Booking
            </Button>
          </>
        }
      >
        {selectedDoctor && (
          <div className="space-y-6">
            <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
              <p className="text-sm text-slate-600 dark:text-slate-400">Dr. {selectedDoctor.name}</p>
              <p className="font-semibold text-slate-900 dark:text-white mt-1">
                {selectedDoctor.doctor_profile?.specialty || 'General Practice'}
              </p>
            </Card>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Available Slots</h3>
              {slots.length === 0 ? (
                <p className="text-slate-600 dark:text-slate-400">No available slots</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {slots.map((slot) => (
                    <button
                      key={slot._id}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-lg border-2 transition text-left ${
                        selectedSlot?._id === slot._id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-slate-300 dark:border-slate-600 hover:border-primary-500'
                      }`}
                    >
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">
                        {new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {new Date(slot.start_time).toLocaleDateString()}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
