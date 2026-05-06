import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { adminAPI } from '../api';
import { LogOut, AlertCircle, Users, Calendar, BarChart3, CheckCircle, XCircle, Shield, Trash2 } from 'lucide-react';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useContext(AuthContext);
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [cancellations, setCancellations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // New user form
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('patient');
  const [newUserSpecialty, setNewUserSpecialty] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, leaveRes, cancelRes] = await Promise.all([
        adminAPI.getUsers(token),
        adminAPI.getLeaveRequests(token),
        adminAPI.getCancellations(token),
      ]);
      setUsers(usersRes.data);
      setLeaveRequests(leaveRes.data);
      setCancellations(cancelRes.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUserName || !newUserEmail || !newUserPassword) {
      setError('Please fill all required fields');
      return;
    }
    try {
      await adminAPI.createUser(
        { name: newUserName, email: newUserEmail, password: newUserPassword, role: newUserRole, specialty: newUserSpecialty },
        token
      );
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('patient');
      setNewUserSpecialty('');
      alert('User created successfully!');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await adminAPI.deactivateUser(userId, token);
        alert('User deactivated successfully!');
        fetchData();
      } catch (err) {
        setError('Failed to deactivate user');
      }
    }
  };

  const handleApproveLeave = async (leaveId) => {
    try {
      await adminAPI.approveLeaveRequest(leaveId, token);
      alert('Leave request approved!');
      fetchData();
    } catch (err) {
      setError('Failed to approve leave request');
    }
  };

  const handleRejectLeave = async (leaveId) => {
    const comment = prompt('Enter rejection comment (optional):');
    try {
      await adminAPI.rejectLeaveRequest(leaveId, { comment: comment || '' }, token);
      alert('Leave request rejected!');
      fetchData();
    } catch (err) {
      setError('Failed to reject leave request');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">SmartClinic - Admin Portal</h1>
            <p className="text-gray-600">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="flex items-center gap-2 p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          {['users', 'leave', 'cancellations', 'analytics'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                tab === t
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t === 'users' && 'User Management'}
              {t === 'leave' && 'Leave Requests'}
              {t === 'cancellations' && 'Cancellations'}
              {t === 'analytics' && <><BarChart3 size={18} /> Analytics</>}
            </button>
          ))}
        </div>

        {/* User Management Tab */}
        {tab === 'users' && (
          <div className="space-y-6">
            {/* Create User Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-6">Create New User</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                {newUserRole === 'doctor' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                    <input
                      type="text"
                      value={newUserSpecialty}
                      onChange={(e) => setNewUserSpecialty(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Cardiology"
                    />
                  </div>
                )}
                <div className="flex items-end">
                  <button
                    onClick={handleCreateUser}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> Create User
                  </button>
                </div>
              </div>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-6">All Users</h2>
              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : users.length === 0 ? (
                <p className="text-gray-500">No users found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-3 px-4 font-semibold">Name</th>
                        <th className="text-left py-3 px-4 font-semibold">Email</th>
                        <th className="text-left py-3 px-4 font-semibold">Role</th>
                        <th className="text-left py-3 px-4 font-semibold">Specialty</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4">{u.name}</td>
                          <td className="py-3 px-4">{u.email}</td>
                          <td className="py-3 px-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">{u.doctor_profile?.specialty || '-'}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                u.is_active
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {u.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {u.is_active && (
                              <button
                                onClick={() => handleDeactivateUser(u._id)}
                                className="text-red-600 hover:text-red-700 font-semibold"
                              >
                                Deactivate
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Leave Requests Tab */}
        {tab === 'leave' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">Leave Requests</h2>
            {leaveRequests.length === 0 ? (
              <p className="text-gray-500">No leave requests</p>
            ) : (
              <div className="space-y-4">
                {leaveRequests.map((req) => (
                  <div key={req._id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-lg">Dr. {req.doctor_name}</p>
                        <p className="text-gray-600">Reason: {req.reason}</p>
                        <p className="text-sm text-gray-600">
                          From {new Date(req.start_date).toLocaleDateString()} to{' '}
                          {new Date(req.end_date).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          req.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : req.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                    {req.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveLeave(req._id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectLeave(req._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cancellations Tab */}
        {tab === 'cancellations' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">Appointment Cancellations</h2>
            {cancellations.length === 0 ? (
              <p className="text-gray-500">No cancellations recorded</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-3 px-4 font-semibold">Patient</th>
                      <th className="text-left py-3 px-4 font-semibold">Doctor</th>
                      <th className="text-left py-3 px-4 font-semibold">Cancelled By</th>
                      <th className="text-left py-3 px-4 font-semibold">Reason</th>
                      <th className="text-left py-3 px-4 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cancellations.map((c) => (
                      <tr key={c._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4">{c.patient_name}</td>
                        <td className="py-3 px-4">Dr. {c.doctor_name}</td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                            {c.cancellation_role}
                          </span>
                        </td>
                        <td className="py-3 px-4">{c.cancellation_reason || 'No reason provided'}</td>
                        <td className="py-3 px-4">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {tab === 'analytics' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">Clinic Analytics</h2>
            <p className="text-gray-600">
              Analytics dashboard will display:
              <br />- Total appointments this week
              <br />- Busiest doctors
              <br />- Peak hours
              <br />- Cancellation rate breakdown
            </p>
            <p className="text-gray-500 mt-4">
              (Full charting implementation with Chart.js coming in Sprint 2)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};