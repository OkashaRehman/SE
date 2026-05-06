import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, Loader, User, Mail, Lock, Heart, Briefcase } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [specialty, setSpecialty] = useState('General');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { data } = await authAPI.register({ name, email, password, role, specialty });
      login(data, data.token);
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = () => {
    switch(role) {
      case 'patient': return <Heart className="text-red-500" size={20} />;
      case 'doctor': return <Briefcase className="text-blue-500" size={20} />;
      case 'admin': return <Lock className="text-purple-500" size={20} />;
      default: return <User size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full opacity-10 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full opacity-10 blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-white rounded-full p-3">
              <Heart className="text-blue-600" size={32} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">SmartClinic</h1>
          <p className="text-blue-100 text-lg">Join Our Healthcare Platform</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Create Account</h2>
          <p className="text-gray-600 mb-6">Get started in just a few minutes</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                <AlertCircle size={20} className="flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Account Type</label>
              <div className="grid grid-cols-3 gap-3">
                {['patient', 'doctor', 'admin'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`p-3 rounded-lg border-2 transition text-center ${
                      role === r
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-center mb-1">
                      {r === 'patient' && <Heart size={20} className="text-red-500" />}
                      {r === 'doctor' && <Briefcase size={20} className="text-blue-500" />}
                      {r === 'admin' && <Lock size={20} className="text-purple-500" />}
                    </div>
                    <p className="text-xs font-semibold text-gray-700 capitalize">{r}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Specialty Field (for doctors) */}
            {role === 'doctor' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Medical Specialty</label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white"
                >
                  <option>General Practice</option>
                  <option>Cardiology</option>
                  <option>Neurology</option>
                  <option>Orthopedics</option>
                  <option>Pediatrics</option>
                  <option>Dermatology</option>
                  <option>Psychiatry</option>
                  <option>Oncology</option>
                </select>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? <Loader size={20} className="animate-spin" /> : null}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-blue-600 hover:text-blue-700 font-bold transition">
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};