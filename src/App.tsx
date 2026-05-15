import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/Login/LoginPage';
import SignupPage from './pages/Login/SignupPage';
import ResetPassword from './pages/Login/ResetPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import DealerAppSettings from './pages/DealerAppSettings/DealerAppSettings';

// Mock Dashboard Components

const Inventory = () => <h2 className="text-2xl font-bold">Inventory Management</h2>;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Login Route */}
          <Route 
            path="/login" 
            element={<LoginPage onLogin={() => setIsAuthenticated(true)} />} 
          />

          {/* Signup Route */}
          <Route 
            path="/signup" 
            element={<SignupPage />} 
          />

          {/* Reset Password Route */}
          <Route 
            path="/reset-password" 
            element={<ResetPassword />} 
          />

          {/* Protected Dashboard Routes */}
          <Route 
            path="/" 
            element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
          >
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="dealer-app-settings" element={<DealerAppSettings />} />
            {/* Add other sub-routes here */}
          </Route>

          {/* Redirect any unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;