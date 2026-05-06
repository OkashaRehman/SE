import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { Button, Input, Card, useToast, ToastContainer } from '../components';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { toasts, addToast, removeToast } = useToast();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    return newErrors;
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
      const { data } = await authAPI.login({ email, password });
      login(data, data.token);
      addToast(`Welcome back, ${data.name}!`, 'success');
      
      setTimeout(() => {
        navigate(`/${data.role}/dashboard`);
      }, 500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
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
          <p className="text-slate-600 dark:text-slate-400 mt-2">Healthcare Management System</p>
        </div>

        {/* Login Form Card */}
        <Card className="shadow-xl">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Welcome Back</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              error={errors.email}
              icon={Mail}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              error={errors.password}
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
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <p className="text-xs text-blue-900 dark:text-blue-200">
            <span className="font-semibold">Demo Credentials:</span>
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
            Email: demo@email.com | Password: password123
          </p>
        </div>
      </div>
    </div>
  );
};
