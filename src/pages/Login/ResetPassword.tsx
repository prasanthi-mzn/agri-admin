import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppTextField from '../../components/AppTextField';
import Logo from '../../assets/logo2.png';
import authService from '../../services/authService';

const getErrorMessage = (err: unknown, fallback: string) => (err instanceof Error ? err.message : fallback);

const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      const res = await authService.requestPasswordReset(email);
      setMessage(res.message || 'OTP has been sent to your email address');
      if (res.otp) setOtp(res.otp);
      setStep(2);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to request OTP'));
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    if (otp.length === 6) {
      setMessage('OTP verified. Please enter your new password.');
      setStep(3);
    } else {
      setError('OTP must be 6 digits');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
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

    try {
      const res = await authService.resetPasswordWithOtp(email, otp, newPassword);
      setMessage(res.message || 'Password reset successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to reset password'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-3 py-6 sm:px-4">
      <div className="max-w-sm w-full bg-white rounded-xl shadow-xl p-5 sm:p-6">
        <div className="text-center mb-7">
          <img src={Logo} alt="Logo" className="w-20   mx-auto" />
          <h2 className="text-xl font-extrabold text-gray-900 mt-3">Reset Password</h2>
        </div>

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <p className="text-xs text-gray-600 mb-4" style={{ marginBottom:"10px" }}>
              Enter your email address and we'll send you an OTP to reset your password.
            </p>
<div className="mb-4">
            <AppTextField
              label="Email Address"
              type="email"
              required
              placeholder="admin@agriapp.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
</div>
            {error && <div className="text-red-600 text-xs bg-red-50 p-2.5 rounded-lg">{error}</div>}
            {message && <div className="text-green-600 text-xs bg-green-50 p-2.5 rounded-lg">{message}</div>}

            <button type="submit" className="w-full bg-common-btn-bg hover:bg-common-btn-hover text-white text-sm font-bold py-2.5 rounded-lg transition-colors shadow-lg">
              Send OTP
            </button>

            <button type="button" onClick={() => navigate('/login')} className="w-full text-green-600 text-xs font-semibold py-1.5 hover:text-green-700 transition-colors">
              Back to Login
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <p className="text-xs text-gray-600 mb-4" style={{ marginBottom:"10px" }}>Enter the 6-digit OTP sent to your email.</p>

            <AppTextField
              label="OTP"
              type="text"
              required
              inputProps={{ maxLength: 6 }}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              sx={{
                '& .MuiInputBase-input': {
                  textAlign: 'center',
                  fontSize: '1.25rem',
                  letterSpacing: '0.25em',
                },
              }}
            />

            {error && <div className="text-red-600 text-xs bg-red-50 p-2.5 rounded-lg">{error}</div>}
            {message && <div className="text-green-600 text-xs bg-green-50 p-2.5 rounded-lg">{message}</div>}

            <button type="submit" className="w-full bg-common-btn-bg hover:bg-common-btn-hover text-white text-sm font-bold py-2.5 rounded-lg transition-colors shadow-lg">
              Verify OTP
            </button>

            <button type="button" onClick={() => setStep(1)} className="w-full text-green-600 text-xs font-semibold py-1.5 hover:text-green-700 transition-colors">
              Back
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <p className="text-xs text-gray-600 mb-4">Enter your new password below.</p>

            <AppTextField
              label="New Password"
              type="password"
              required
              placeholder="Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <AppTextField
              label="Confirm Password"
              type="password"
              required
              placeholder="Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {error && <div className="text-red-600 text-xs bg-red-50 p-2.5 rounded-lg">{error}</div>}
            {message && <div className="text-green-600 text-xs bg-green-50 p-2.5 rounded-lg">{message}</div>}

            <button type="submit" className="w-full bg-common-btn-bg hover:bg-common-btn-hover text-white text-sm font-bold py-2.5 rounded-lg transition-colors shadow-lg">
              Reset Password
            </button>

            <button type="button" onClick={() => navigate('/login')} className="w-full text-green-600 text-xs font-semibold py-1.5 hover:text-green-700 transition-colors">
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
