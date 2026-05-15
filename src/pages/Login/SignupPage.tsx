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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-10">
          <img src={Logo} alt="Logo" className="w-24 h-24 mx-auto" />
          <h2 className="text-2xl font-extrabold text-gray-900 mt-4">Create Account</h2>
          <p className="text-gray-500 text-sm mt-2">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">Full Name</label>
            <input 
              type="text" 
              name="fullName"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">Email Address</label>
            <input 
              type="email" 
              name="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="admin@agriapp.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">Password</label>
            <input 
              type="password" 
              name="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}
          {message && <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg">{message}</div>}

          <button 
            type="submit"
            className="w-full bg-common-btn-bg hover:bg-common-btn-hover text-white font-bold py-3 rounded-lg transition-colors shadow-lg"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
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
