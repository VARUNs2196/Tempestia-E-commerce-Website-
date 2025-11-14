import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import { AuthProvider } from './auth/AuthContext';
import Register from './pages/register';
import UserDashboard from './pages/UserDashboard';
import LandingPage from './pages/landingPage';
import { ThemeProvider } from './components/ThemeContext';
import VendorDashboard from './pages/vendorDashboard';
import AdminDashboard from './pages/adminDashboard';
import VendorStore from './pages/vendorStore';

function App() {
  return (
    <ThemeProvider >
    <AuthProvider>
    <Router>
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/category/:type" element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path="/user" element={<UserDashboard isLoggedIn={true} />} />
        <Route path='/register' element={<Register />} />
        <Route path='/vendor' element={<VendorDashboard />} />
        <Route path="/store/:vendorId" element={<VendorStore />} />
        <Route path='/admin' element={<AdminDashboard />} />
      </Routes>
    </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;