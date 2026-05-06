import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, Loader, Heart, Mail, Lock } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      login(data, data.token);
      navigate(`/${data.role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
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
          <p className="text-blue-100 text-lg">Healthcare Management Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back</h2>
          <p className="text-gray-600 mb-6">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                <AlertCircle size={20} className="flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

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

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? <Loader size={20} className="animate-spin" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{' '}
            <button onClick={() => navigate('/register')} className="text-blue-600 hover:text-blue-700 font-bold transition">
              Create one now
            </button>
          </p>

          {/* Demo Accounts Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-3 font-semibold">DEMO ACCOUNTS</p>
            <div className="space-y-2 text-xs">
              <p className="text-gray-600"><span className="font-semibold">Patient:</span> patient@example.com</p>
              <p className="text-gray-600"><span className="font-semibold">Doctor:</span> doctor@example.com</p>
              <p className="text-gray-600"><span className="font-semibold">Admin:</span> admin@example.com</p>
              <p className="text-gray-500 mt-2">Password for all: <span className="font-mono">password123</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};