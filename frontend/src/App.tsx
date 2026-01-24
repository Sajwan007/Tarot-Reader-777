import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { PageLoader } from './components/PageLoader';
import { HomePage } from './pages/HomePage';
import { BookingPage } from './pages/BookingPage';
import { PaymentPage } from './pages/PaymentPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
function ScrollToTop() {
  const {
    pathname
  } = useLocation();
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 500); // Simulate page load time

    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <PageLoader isLoading={isPageLoading} />
      {null}
    </>
  );
}

export function App() {
  return <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-cosmic-dark text-white font-inter selection:bg-gold selection:text-cosmic-dark">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>;
}