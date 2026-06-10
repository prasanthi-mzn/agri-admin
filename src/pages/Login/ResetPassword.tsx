import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo2.png';

const ResetPassword = () => {
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP, Step 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Simulate sending reset link
    setMessage('OTP has been sent to your email address');
    setStep(2);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    // Simulate OTP verification
    if (otp.length === 6) {
      setMessage('OTP verified successfully. Please enter your new password.');
      setStep(3);
    } else {
      setError('OTP must be 6 digits');
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Simulate password reset
    setMessage('Password reset successful! Redirecting to login...');
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-3 py-6 sm:px-4">
      <div className="max-w-sm w-full bg-white rounded-xl shadow-xl p-5 sm:p-6">
        <div className="text-center mb-7">
          <img src={Logo} alt="Logo" className="w-20 h-20 mx-auto" />
          <h2 className="text-xl font-extrabold text-gray-900 mt-3">Reset Password</h2>
        </div>

        {/* Step 1: Email Verification */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <p className="text-xs text-gray-600 mb-4">
              Enter your email address and we'll send you an OTP to reset your password.
            </p>
            
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 text-left">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="admin@agriapp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && <div className="text-red-600 text-xs bg-red-50 p-2.5 rounded-lg">{error}</div>}
            {message && <div className="text-green-600 text-xs bg-green-50 p-2.5 rounded-lg">{message}</div>}

            <button 
              type="submit"
              className="w-full bg-common-btn-bg hover:bg-common-btn-hover text-white text-sm font-bold py-2.5 rounded-lg transition-colors shadow-lg"
            >
              Send OTP
            </button>

            <button 
              type="button"
              onClick={() => navigate('/login')}
              className="w-full text-green-600 text-xs font-semibold py-1.5 hover:text-green-700 transition-colors"
            >
              Back to Login
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <p className="text-xs text-gray-600 mb-4">
              Enter the 6-digit OTP sent to your email.
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 text-left">OTP</label>
              <input 
                type="text" 
                maxLength="6"
                required
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-center text-xl tracking-widest"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              />
            </div>

            {error && <div className="text-red-600 text-xs bg-red-50 p-2.5 rounded-lg">{error}</div>}
            {message && <div className="text-green-600 text-xs bg-green-50 p-2.5 rounded-lg">{message}</div>}

            <button 
              type="submit"
              className="w-full bg-common-btn-bg hover:bg-common-btn-hover text-white text-sm font-bold py-2.5 rounded-lg transition-colors shadow-lg"
            >
              Verify OTP
            </button>

            <button 
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-green-600 text-xs font-semibold py-1.5 hover:text-green-700 transition-colors"
            >
              Back
            </button>
          </form>
        )}

        {/* Step 3: Password Reset */}
        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <p className="text-xs text-gray-600 mb-4">
              Enter your new password below.
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 text-left">New Password</label>
              <input 
                type="password" 
                required
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 text-left">Confirm Password</label>
              <input 
                type="password" 
                required
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && <div className="text-red-600 text-xs bg-red-50 p-2.5 rounded-lg">{error}</div>}
            {message && <div className="text-green-600 text-xs bg-green-50 p-2.5 rounded-lg">{message}</div>}

            <button 
              type="submit"
              className="w-full bg-common-btn-bg hover:bg-common-btn-hover text-white text-sm font-bold py-2.5 rounded-lg transition-colors shadow-lg"
            >
              Reset Password
            </button>

            <button 
              type="button"
              onClick={() => navigate('/login')}
              className="w-full text-green-600 text-xs font-semibold py-1.5 hover:text-green-700 transition-colors"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
