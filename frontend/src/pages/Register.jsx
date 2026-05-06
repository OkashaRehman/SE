import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, AlertCircle, Heart, Briefcase } from 'lucide-react';
import { Button, Input, Card, useToast, ToastContainer } from '../components';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    specialty: 'General',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { toasts, addToast, removeToast } = useToast();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { data } = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        specialty: formData.specialty,
      });
      login(data, data.token);
      addToast('Account created successfully! Welcome to SmartClinic', 'success');
      setTimeout(() => {
        navigate(`/${data.role}/dashboard`);
      }, 500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      addToast(errorMessage, 'error');
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-xl shadow-lg mb-4">
            <span className="text-2xl font-bold text-white">SC</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">SmartClinic</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Create Your Account</p>
        </div>

        {/* Register Form Card */}
        <Card className="shadow-xl">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Get Started</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">Join our healthcare platform</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              icon={User}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={Mail}
              required
            />

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Account Type <span className="text-medical-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['patient', 'doctor'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleChange({ target: { name: 'role', value: r } })}
                    className={`p-4 rounded-lg border-2 transition text-center ${
                      formData.role === r
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      {r === 'patient' && <Heart size={24} className="text-medical-500" />}
                      {r === 'doctor' && <Briefcase size={24} className="text-primary-600" />}
                    </div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize">{r}</p>
                  </button>
                ))}
              </div>
            </div>

            {formData.role === 'doctor' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Medical Specialty
                </label>
                <select
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
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

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={Lock}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={Lock}
              required
            />

            {errors.submit && (
              <div className="p-4 bg-medical-50 dark:bg-medical-900 border border-medical-200 dark:border-medical-700 rounded-lg text-medical-700 dark:text-medical-200 text-sm font-semibold flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {errors.submit}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
