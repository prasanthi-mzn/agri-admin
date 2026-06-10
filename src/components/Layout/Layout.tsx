import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  LogOut,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { SideMenu } from '../Sidemenu';
import { ThemeSelector } from '../ThemeSelector';

const Layout = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const getIsDesktop = () => window.innerWidth >= 1024;
  const [isDesktop, setIsDesktop] = useState(getIsDesktop);
  const [isSidebarOpen, setIsSidebarOpen] = useState(getIsDesktop);
  const navigate = useNavigate();

  // Handle window resize events
  useEffect(() => {
    const handleResize = () => {
      const nextIsDesktop = getIsDesktop();
      setIsDesktop(nextIsDesktop);

      if (nextIsDesktop) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 responsive-layout">
      {/* Sidebar */}
      <div
        className={`sidebar-container ${isSidebarOpen ? 'open' : 'closed'}`}
        style={!isDesktop ? { transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)' } : undefined}
      >
        <SideMenu />
      </div>

      {/* Mobile Overlay */}
      {!isDesktop && isSidebarOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="min-h-16 bg-white border-b border-gray-200 flex items-center justify-between gap-3 px-3 sm:px-4 md:px-6 lg:px-8 header-responsive">
          <div className="flex min-w-10 items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
              className={`menu-toggle lg:hidden ${isSidebarOpen ? 'menu-toggle-open' : ''}`}
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div className="min-w-0 flex-1 sm:flex-none">
            <ThemeSelector />
          </div>

          <div className="relative user-menu">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 md:space-x-3 focus:outline-none user-button"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={18} className="text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">Admin User</span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {/* User Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 dropdown-menu">
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Settings size={16} className="mr-3" /> Settings
                </button>
                <hr className="my-1" />
                <button 
                  onClick={() => {
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
        <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8 main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
