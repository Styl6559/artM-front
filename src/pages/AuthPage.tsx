import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GoogleSignIn from '../components/auth/GoogleSignIn';
import { ArrowRight, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'verify'>('signin');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  
  const { login, register, verifyEmail, resendOTP, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Handle URL error parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const error = urlParams.get('error');
    if (error === 'oauth_failed') {
      setError('Google sign-in failed. Please try again.');
    }
  }, [location]);

  // OTP timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (mode === 'signup') {
      if (!formData.name.trim()) {
        setError('Name is required');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (mode !== 'verify' && !formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    if (mode === 'verify' && !formData.otp.trim()) {
      setError('OTP is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'signup') {
        const result = await register(formData.name, formData.email, formData.password);
        setSuccess('Registration successful! Please check your email for verification code.');
        setMode('verify');
        setOtpTimer(900); // 15 minutes
      } else if (mode === 'signin') {
        const result = await login(formData.email, formData.password);
        if (result.requiresVerification) {
          setMode('verify');
          setOtpTimer(900);
        } else {
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
          }, 1000);
        }
      } else if (mode === 'verify') {
        const result = await verifyEmail(formData.email, formData.otp);
        setSuccess('Email verified successfully! Redirecting...');
        setTimeout(() => {
          const from = location.state?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      if (err.message?.includes('verify your email')) {
        setMode('verify');
        setOtpTimer(900);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (otpTimer > 0) return;
    
    setLoading(true);
    try {
      await resendOTP(formData.email);
      setSuccess('Verification code sent successfully!');
      setOtpTimer(900);
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: '', color: '' };
    if (password.length < 6) return { strength: 1, text: 'Weak', color: 'text-red-600' };
    if (password.length < 8) return { strength: 2, text: 'Fair', color: 'text-yellow-600' };
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { strength: 2, text: 'Fair', color: 'text-yellow-600' };
    return { strength: 3, text: 'Strong', color: 'text-green-600' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="w-full max-w-md">
        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {mode === 'signin' && 'Welcome back'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'verify' && 'Verify Email'}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {mode === 'verify' 
                ? `Enter the code sent to ${formData.email}`
                : mode === 'signin'
                  ? 'Sign in to continue'
                  : 'Join us today'
              }
            </p>
          </div>

          {/* Mode Selector */}
          {mode !== 'verify' && (
            <div className="flex mb-6">
              <div className="inline-flex w-full rounded-lg bg-gray-100 p-1">
                <button
                  className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all ${
                    mode === 'signin' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setMode('signin')}
                >
                  Sign In
                </button>
                <button
                  className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all ${
                    mode === 'signup' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setMode('signup')}
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}

          {/* Google Sign In */}
          {mode !== 'verify' && (
            <div className="mb-6">
              <GoogleSignIn text={mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'} />
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">or</span>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>
            )}

            {mode !== 'verify' && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>
            )}

            {mode !== 'verify' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="password"
                    required
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === 'signup' && formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full transition-all ${
                            passwordStrength.strength === 1 ? 'bg-red-500 w-1/3' :
                            passwordStrength.strength === 2 ? 'bg-yellow-500 w-2/3' :
                            passwordStrength.strength === 3 ? 'bg-green-500 w-full' : 'w-0'
                          }`}
                        />
                      </div>
                      <span className={`text-xs font-medium ${passwordStrength.color}`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    id="confirmPassword"
                    required
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'verify' && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  name="otp"
                  id="otp"
                  required
                  maxLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center text-lg font-mono tracking-wider"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="000000"
                />
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {otpTimer > 0 ? `Expires in ${formatTime(otpTimer)}` : 'Code expired'}
                  </span>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={otpTimer > 0 || loading}
                    className="text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    Resend Code
                  </button>
                </div>
              </div>
            )}

            {/* Error/Success Messages */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>
                    {mode === 'signin' ? 'Sign In' : 
                     mode === 'signup' ? 'Create Account' : 
                     'Verify Email'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center text-sm">
            {mode === 'signin' && (
              <div className="space-y-2">
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  Forgot password?
                </a>
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <button 
                    onClick={() => setMode('signup')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            )}

            {mode === 'signup' && (
              <p className="text-gray-600">
                Already have an account?{' '}
                <button 
                  onClick={() => setMode('signin')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in
                </button>
              </p>
            )}

            {mode === 'verify' && (
              <button
                onClick={() => setMode('signin')}
                className="text-blue-600 hover:text-blue-700"
              >
                ← Back to Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
