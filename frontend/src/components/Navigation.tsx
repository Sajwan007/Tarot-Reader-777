import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Menu, X } from 'lucide-react';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const cleanId = sectionId.replace('/#', '').replace('#', '');
    
    // Try multiple times to find the element (in case DOM is still loading)
    const attemptScroll = (attempts = 0) => {
      const element = document.getElementById(cleanId);
      
      if (element) {
        const offset = 80; // Account for fixed navbar height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else if (attempts < 5) {
        // Try again after a short delay
        setTimeout(() => attemptScroll(attempts + 1), 200);
      } else {
        // Fallback: try direct hash navigation
        window.location.hash = cleanId;
      }
    };
    
    attemptScroll();
  };

  // Handle navigation click
  const handleNavClick = (path: string) => {
    if (path.startsWith('/#')) {
      // Handle hash navigation on same page
      if (location.pathname === '/') {
        scrollToSection(path);
      } else {
        // Navigate to home first, then scroll
        navigate('/');
        // Also set the hash in the URL for backup
        window.location.hash = path.replace('/#', '');
        setTimeout(() => scrollToSection(path), 500); // Increased timeout
      }
    } else {
      navigate(path);
    }
    setIsMobileMenuOpen(false);
  };

  // Handle direct hash changes in URL
  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [location.hash]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  const navLinks = [
  {
    name: 'Home',
    path: '/'
  },
  {
    name: 'Services',
    path: '/#services'
  },
  {
    name: 'About',
    path: '/#about'
  },
  {
    name: 'Testimonials',
    path: '/#testimonials'
  },
  {
    name: 'Contact Us',
    path: '/contact'
  }];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 overflow-x-clip ${
        isScrolled
          ? 'bg-cosmic-dark/80 backdrop-blur-lg border-b border-white/10 py-3'
          : 'bg-transparent py-6'
      }`}>

      <div className="max-w-7xl mx-auto px-2 max-[375px]:px-3 max-[320px]:px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-1 max-[375px]:gap-2 max-[320px]:gap-1">
          {/* Logo (can shrink safely) */}
          <Link to="/" className="flex items-center gap-1 max-[375px]:gap-2 max-[320px]:gap-1 min-w-0 flex-1 overflow-hidden">
            <div className="relative flex-shrink-0">
              <Moon className="w-5 h-5 max-[375px]:w-6 max-[375px]:h-6 max-[320px]:w-5 max-[320px]:h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gold" />
              <motion.div
                className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            {/* IMPORTANT: min-w-0 + truncate prevents overflow */}
            <span className="min-w-0 truncate text-base max-[375px]:text-lg max-[320px]:text-base sm:text-xl md:text-2xl font-cinzel font-bold text-white max-[375px]:tracking-normal max-[320px]:tracking-tight sm:tracking-wider">
              Mystic<span className="text-gold">Tarot</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              if (link.path.startsWith('/#')) {
                return (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.path)}
                    className="text-white/80 hover:text-gold font-inter transition-colors text-xs sm:text-sm tracking-wide uppercase bg-transparent border-none cursor-pointer">
                    {link.name}
                  </button>
                );
              }
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-white/80 hover:text-gold font-inter transition-colors text-xs sm:text-sm tracking-wide uppercase">
                  {link.name}
                </Link>
              );
            })}
            <Link to="/contact">
              <Button variant="primary" size="sm" className="text-xs sm:text-sm">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hamburger (outside container - never shrinks) */}
      <motion.button
        type="button"
        className="md:hidden absolute top-1/2 right-2 transform -translate-y-1/2 text-white p-1.5 max-[375px]:p-2 flex-shrink-0 rounded-lg hover:bg-white/10 transition-colors duration-200"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <motion.div
          animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5 max-[375px]:w-6 max-[375px]:h-6" /> : <Menu className="w-5 h-5 max-[375px]:w-6 max-[375px]:h-6" />}
        </motion.div>
      </motion.button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen &&
        <motion.div
          initial={{
            opacity: 0,
            height: 0,
            y: -20
          }}
          animate={{
            opacity: 1,
            height: 'auto',
            y: 0
          }}
          exit={{
            opacity: 0,
            height: 0,
            y: -20
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut"
          }}
          className="md:hidden bg-cosmic-purple/95 backdrop-blur-xl border-b border-white/10 overflow-hidden">

            <div className="px-4 py-6 space-y-4 flex flex-col items-center">
              {navLinks.map((link, index) => {
                if (link.path.startsWith('/#')) {
                  return (
                    <motion.button
                      key={link.name}
                      onClick={() => handleNavClick(link.path)}
                      className="text-white/90 hover:text-gold font-cinzel text-lg bg-transparent border-none cursor-pointer w-full text-center py-3 px-4 rounded-lg hover:bg-white/5 transition-all duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {link.name}
                    </motion.button>
                  );
                }
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-center"
                  >
                    <Link
                      to={link.path}
                      className="text-white/90 hover:text-gold font-cinzel text-lg w-full text-center py-3 px-4 rounded-lg hover:bg-white/5 transition-all duration-200 block">
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full max-w-xs pt-4"
              >
                <Link to="/contact">
                  <Button variant="primary" fullWidth className="hover:scale-105 transition-transform duration-200">
                    Contact Us
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </nav>

  );
}