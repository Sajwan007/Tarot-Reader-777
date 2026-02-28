import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { SEO } from './components/SEO';
import { ScrollToTop as ScrollToTopButton } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { ContactPage } from './pages/ContactPage';
import ThankYouPage from './pages/ThankYouPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';

function CustomScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    const { hash } = location;

    // If URL has a hash like #services, scroll to that element
    if (hash) {
      // wait for page/components to render
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 0);
    } else {
      // normal route change -> go top
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [location.pathname, location.hash, location.key]);

  return null;
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function BookingRedirect() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const service = searchParams.get('service');
  const price = searchParams.get('price');
  
  // Redirect to contact page with service data
  return <Navigate to={`/contact?service=${encodeURIComponent(service || '')}&price=${encodeURIComponent(price || '')}`} replace />;
}

export function App() {
  return (
    <Router>
      <CustomScrollToTop />
      <SEO />
      <div className="min-h-screen bg-cosmic-dark text-white font-inter selection:bg-gold selection:text-cosmic-dark">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
            },
          }}
        />
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/booking" element={<BookingRedirect />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <Footer />
        <ScrollToTopButton />
      </div>
    </Router>
  );
}