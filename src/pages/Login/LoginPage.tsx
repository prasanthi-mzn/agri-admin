import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../../assets/logo2.png';
import authService from '../../services/authService';
import AppTextField from '../../components/AppTextField';

const getErrorMessage = (err: unknown, fallback: string) => (err instanceof Error ? err.message : fallback);

const LoginPage = ({ onLogin }: { onLogin?: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.login(email, password);
      onLogin?.();
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-3 py-6 sm:px-4">
      <div className="max-w-sm w-full bg-white rounded-xl shadow-xl p-5 sm:p-6">
        <div className="text-center mb-8">
          <img src={Logo} className="w-20 h-20 mx-auto" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AppTextField
            label="Email Address"
            type="email"
            required
            placeholder="admin@agriapp.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <AppTextField
            label="Password"
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="text-red-600 text-xs bg-red-50 p-2.5 rounded-lg">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-common-btn-bg hover:bg-common-btn-hover text-white text-sm font-bold py-2.5 rounded-lg transition-colors shadow-lg"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            to="/reset-password"
            className="text-xs text-green-600 hover:text-green-700 font-semibold transition-colors"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
