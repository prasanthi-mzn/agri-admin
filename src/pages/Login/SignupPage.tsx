import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo2.png';

const SignupPage = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validation
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Simulate signup
    setMessage('Account created successfully! Redirecting to login...');
    setTimeout(() => {
      onSignup?.();
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-3 py-6 sm:px-4">
      <div className="max-w-sm w-full bg-white rounded-xl shadow-xl p-5 sm:p-6">
        <div className="text-center mb-7">
          <img src={Logo} alt="Logo" className="w-20 h-20 mx-auto" />
          <h2 className="text-xl font-extrabold text-gray-900 mt-3">Create Account</h2>
          <p className="text-gray-500 text-xs mt-1.5">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 text-left">Full Name</label>
            <input 
              type="text" 
              name="fullName"
              required
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 text-left">Email Address</label>
            <input 
              type="email" 
              name="email"
              required
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="admin@agriapp.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 text-left">Password</label>
            <input 
              type="password" 
              name="password"
              required
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 text-left">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              required
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {error && <div className="text-red-600 text-xs bg-red-50 p-2.5 rounded-lg">{error}</div>}
          {message && <div className="text-green-600 text-xs bg-green-50 p-2.5 rounded-lg">{message}</div>}

          <button 
            type="submit"
            className="w-full bg-common-btn-bg hover:bg-common-btn-hover text-white text-sm font-bold py-2.5 rounded-lg transition-colors shadow-lg"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center text-xs">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-green-600 hover:text-green-700 font-semibold transition-colors"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
