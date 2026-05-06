import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { doctorAPI } from '../api';
import { Calendar, Users, Clock, Plus } from 'lucide-react';
import { Button, Card, Badge, Header, useToast, ToastContainer } from '../components';

export const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [slots, setSlots] = useState([]);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('schedule');
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [slotsRes, queueRes] = await Promise.all([
        doctorAPI.getSlots(user?.token),
        doctorAPI.getQueueAppointments(user?.token),
      ]);
      setSlots(slotsRes.data || []);
      setQueue(queueRes.data || []);
    } catch (err) {
      addToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const availableSlots = slots.filter(s => s.status === 'available').length;
  const bookedSlots = slots.filter(s => s.status === 'booked').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <Header
        title="Doctor Dashboard"
        subtitle={`Welcome back, Dr. ${user?.name}`}
        actions={[{ icon: Users, label: 'Queue', onClick: () => setActiveTab('queue') }]}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Available Slots</p>
                <p className="text-4xl font-bold text-primary-600 mt-2">{availableSlots}</p>
              </div>
              <Calendar className="w-12 h-12 text-primary-500 opacity-20" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Booked Slots</p>
                <p className="text-4xl font-bold text-secondary-600 mt-2">{bookedSlots}</p>
              </div>
              <Users className="w-12 h-12 text-secondary-500 opacity-20" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Slots</p>
                <p className="text-4xl font-bold text-slate-600 dark:text-slate-300 mt-2">{slots.length}</p>
              </div>
              <Clock className="w-12 h-12 text-slate-400 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'schedule'
                ? 'bg-primary-500 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            My Schedule
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'queue'
                ? 'bg-primary-500 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Appointment Queue
          </button>
        </div>

        {/* Content */}
        {activeTab === 'schedule' && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Time Slots</h2>
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4" />
                Add Slot
              </Button>
            </div>
            {loading ? (
              <div className="text-center py-8 text-slate-500">Loading...</div>
            ) : slots.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No slots created yet</div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {slots.map((slot) => (
                  <div
                    key={slot._id}
                    className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {new Date(slot.start_time).toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Duration: {slot.duration} minutes
                      </p>
                    </div>
                    <Badge
                      variant={slot.status === 'available' ? 'secondary' : 'neutral'}
                      size="sm"
                    >
                      {slot.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {activeTab === 'queue' && (
          <Card>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Appointment Queue</h2>
            {loading ? (
              <div className="text-center py-8 text-slate-500">Loading...</div>
            ) : queue.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No appointments in queue</div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {queue.map((apt) => (
                  <div
                    key={apt._id}
                    className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {apt.patient_name || 'Patient'}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(apt.slot_start_time).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="primary" size="sm">
                        {apt.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </main>
    </div>
  );
};
