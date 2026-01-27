import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import ClientBooking from './pages/ClientBooking';
import Header from './components/common/Header';
import Loading from './components/common/Loading';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/admin" replace />} 
        />
        <Route 
          path="/admin/*" 
          element={user?.type === 'admin' ? <AdminPanel /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/booking" 
          element={<ClientBooking />} 
        />
        <Route 
          path="/" 
          element={<Navigate to="/booking" replace />} 
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
