import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo2.png';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd validate credentials here
    onLogin();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-10">
             <img src={Logo} className="w-24 h-24 mx-auto" />
         
          {/* <h2 className="text-3xl font-extrabold text-gray-900">AgriApp Admin</h2> */}
          {/* <p className="text-gray-500 mt-2">Please sign in to your account</p> */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="admin@agriapp.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
                type="submit"
                className="w-full bg-common-btn-bg hover:bg-common-btn-hover text-white font-bold py-3 rounded-lg transition-colors shadow-lg  "
                >
  Sign In
</button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate('/reset-password')}
            className="text-sm text-green-600 hover:text-green-700 font-semibold transition-colors"
          >
            Forgot Password?
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-green-600 hover:text-green-700 font-semibold transition-colors"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;