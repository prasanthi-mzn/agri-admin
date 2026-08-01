import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import authService from './services/authService';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/Login/LoginPage';
import ResetPassword from './pages/Login/ResetPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import DealerAppSettings from './pages/DealerAppSettings/DealerAppSettings';
import DealerManagement from './pages/DealerManagement/DealerManagement';
import Orders from './pages/Orders/Orders';
import Payments from './pages/Payments/Payments';
import Inventory from './pages/Inventory/Inventory';
import UsersFeedbacks from './pages/UsersFeedbacks/UsersFeedbacks';
import ReportedErrors from './pages/ReportedErrors/ReportedErrors';
import Reports from './pages/Reports/Reports';
import { HashRouter } from 'react-router-dom';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!authService.getAuthToken());

  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          {/* Login Route */}
          <Route
            path="/login"
            element={<LoginPage onLogin={() => setIsAuthenticated(true)} />}
          />

          {/* Signup removed: no signup route */}

          {/* Reset Password Route */}
          <Route 
            path="/reset-password" 
            element={<ResetPassword />} 
          />

          {/* Protected Dashboard Routes */}
          <Route
            path="/"
            element={isAuthenticated ? (
              <Layout onLogout={() => { authService.logout(); setIsAuthenticated(false); }} />
            ) : (
              <Navigate to="/login" />
            )}
          >
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="dealers" element={<DealerManagement />} />
            <Route path="orders" element={<Orders />} />
            <Route path="payments" element={<Payments />} />
            <Route path="reports" element={<Reports />} />
            <Route path="users-feedbacks" element={<UsersFeedbacks />} />
            <Route path="reported-errors" element={<ReportedErrors />} />
            <Route path="dealer-app-settings" element={<DealerAppSettings />} />
            {/* Add other sub-routes here */}
          </Route>

          {/* Redirect any unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </HashRouter>
      <ToastContainer position="top-right" autoClose={3000} />
    </ThemeProvider>
  );
}

export default App;
