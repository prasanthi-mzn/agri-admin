import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-3 py-6 sm:px-4">
      <div className="max-w-sm w-full bg-white rounded-xl shadow-xl p-5 sm:p-6">
        <div className="text-center mb-8">
             <img src={Logo} className="w-20 h-20 mx-auto" />
         
          {/* <h2 className="text-3xl font-extrabold text-gray-900">AgriApp Admin</h2> */}
          {/* <p className="text-gray-500 mt-2">Please sign in to your account</p> */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 text-left">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
                type="submit"
                className="w-full bg-common-btn-bg hover:bg-common-btn-hover text-white text-sm font-bold py-2.5 rounded-lg transition-colors shadow-lg  "
                >
  Sign In
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

        <div className="mt-4 pt-4 border-t border-gray-200 text-center text-xs">
          <p className="text-gray-600 mb-2">Don't have an account?</p>
            <Link
              to="/signup"
              className="text-green-600 hover:text-green-700 font-semibold transition-colors"
            >
              Sign up here
            </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
