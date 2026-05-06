import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { adminAPI } from '../api';
import { Users, Calendar, AlertCircle, Plus } from 'lucide-react';
import { Button, Card, Badge, Header, useToast, ToastContainer } from '../components';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [cancellations, setCancellations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, leaveRes, cancelRes] = await Promise.all([
        adminAPI.getUsers(user?.token),
        adminAPI.getLeaveRequests(user?.token),
        adminAPI.getCancellations(user?.token),
      ]);
      setUsers(usersRes.data || []);
      setLeaveRequests(leaveRes.data || []);
      setCancellations(cancelRes.data || []);
    } catch (err) {
      addToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveLeave = async (leaveId) => {
    try {
      await adminAPI.approveLeaveRequest(leaveId, user?.token);
      addToast('Leave request approved', 'success');
      fetchData();
    } catch (err) {
      addToast('Failed to approve leave request', 'error');
    }
  };

  const handleRejectLeave = async (leaveId) => {
    try {
      await adminAPI.rejectLeaveRequest(leaveId, {}, user?.token);
      addToast('Leave request rejected', 'success');
      fetchData();
    } catch (err) {
      addToast('Failed to reject leave request', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeUsers = users.filter(u => u.is_active).length;
  const inactiveUsers = users.filter(u => !u.is_active).length;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <Header
        title="Admin Dashboard"
        subtitle={`Welcome back, ${user?.name}`}
        actions={[{ icon: Users, label: 'Users', onClick: () => setActiveTab('users') }]}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Users</p>
                <p className="text-4xl font-bold text-primary-600 mt-2">{users.length}</p>
              </div>
              <Users className="w-12 h-12 text-primary-500 opacity-20" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active Users</p>
                <p className="text-4xl font-bold text-secondary-600 mt-2">{activeUsers}</p>
              </div>
              <Users className="w-12 h-12 text-secondary-500 opacity-20" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Pending Leaves</p>
                <p className="text-4xl font-bold text-medical-600 mt-2">{pendingLeaves}</p>
              </div>
              <Calendar className="w-12 h-12 text-medical-500 opacity-20" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Cancellations</p>
                <p className="text-4xl font-bold text-slate-600 dark:text-slate-300 mt-2">
                  {cancellations.length}
                </p>
              </div>
              <AlertCircle className="w-12 h-12 text-slate-400 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'users'
                ? 'bg-primary-500 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('leaves')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'leaves'
                ? 'bg-primary-500 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Leave Requests
          </button>
          <button
            onClick={() => setActiveTab('cancellations')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'cancellations'
                ? 'bg-primary-500 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Cancellations
          </button>
        </div>

        {/* Content */}
        {activeTab === 'users' && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">User Management</h2>
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4" />
                Add User
              </Button>
            </div>
            {loading ? (
              <div className="text-center py-8 text-slate-500">Loading...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No users found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        Role
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr
                        key={u._id}
                        className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <td className="py-3 px-4 text-slate-900 dark:text-white">{u.name}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                        <td className="py-3 px-4">
                          <Badge variant="primary" size="sm">
                            {u.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={u.is_active ? 'secondary' : 'danger'}
                            size="sm"
                          >
                            {u.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {activeTab === 'leaves' && (
          <Card>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Leave Requests
            </h2>
            {loading ? (
              <div className="text-center py-8 text-slate-500">Loading...</div>
            ) : leaveRequests.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No leave requests</div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {leaveRequests.map((leave) => (
                  <div
                    key={leave._id}
                    className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          Dr. {leave.doctor_name || 'Doctor'}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(leave.start_date).toLocaleDateString()} -{' '}
                          {new Date(leave.end_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          leave.status === 'pending'
                            ? 'warning'
                            : leave.status === 'approved'
                              ? 'secondary'
                              : 'danger'
                        }
                        size="sm"
                      >
                        {leave.status}
                      </Badge>
                    </div>
                    {leave.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleApproveLeave(leave._id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRejectLeave(leave._id)}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {activeTab === 'cancellations' && (
          <Card>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Appointment Cancellations
            </h2>
            {loading ? (
              <div className="text-center py-8 text-slate-500">Loading...</div>
            ) : cancellations.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No cancellations</div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {cancellations.map((cancel) => (
                  <div
                    key={cancel._id}
                    className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {cancel.patient_name || 'Patient'} - Dr. {cancel.doctor_name || 'Doctor'}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {cancel.cancellation_reason || 'No reason provided'}
                    </p>
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
