import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Boxes, 
  Users, 
  ShoppingCart, 
  CreditCard, 
  User, 
  Settings, 
  LogOut,
  ChevronDown 
} from 'lucide-react';
import { SideMenu } from '../Sidemenu';
import { ThemeSelector } from '../ThemeSelector';

const Layout = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();



  return (
    <div className="flex h-screen bg-gray-100">
     
    <SideMenu/>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="flex items-center">
            {/* Logo placeholder */}
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>

          <ThemeSelector />

          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 focus:outline-none"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={18} className="text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Admin User</span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {/* User Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Settings size={16} className="mr-3" /> Settings
                </button>
                <hr className="my-1" />
              <button 
                onClick={() => {
                    // setIsAuthenticated(false); // You should pass this setter down via context or props
                    navigate('/login');
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                <LogOut size={16} className="mr-3" /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;