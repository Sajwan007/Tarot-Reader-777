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
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
        setTimeout(() => scrollToSection(path), 100);
      }
    }
    setIsMobileMenuOpen(false);
  };

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-cosmic-dark/80 backdrop-blur-lg border-b border-white/10 py-3' : 'bg-transparent py-6'}`}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Moon className="w-8 h-8 text-gold group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.8)] transition-all" />
              <motion.div
                className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"
                animate={{
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }} />

            </div>
            <span className="text-2xl font-cinzel font-bold text-white tracking-wider">
              Mystic<span className="text-gold">Tarot</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              if (link.path.startsWith('/#')) {
                return (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.path)}
                    className="text-white/80 hover:text-gold font-inter transition-colors text-sm tracking-wide uppercase bg-transparent border-none cursor-pointer">
                    {link.name}
                  </button>
                );
              }
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-white/80 hover:text-gold font-inter transition-colors text-sm tracking-wide uppercase">
                  {link.name}
                </Link>
              );
            })}
            <Link to="/contact">
              <Button variant="primary" size="sm">
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu">

            {isMobileMenuOpen ?
            <X className="w-6 h-6" /> :

            <Menu className="w-6 h-6" />
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen &&
        <motion.div
          initial={{
            opacity: 0,
            height: 0
          }}
          animate={{
            opacity: 1,
            height: 'auto'
          }}
          exit={{
            opacity: 0,
            height: 0
          }}
          className="md:hidden bg-cosmic-purple/95 backdrop-blur-xl border-b border-white/10 overflow-hidden">

            <div className="px-4 py-6 space-y-4 flex flex-col items-center">
              {navLinks.map((link) => {
                if (link.path.startsWith('/#')) {
                  return (
                    <button
                      key={link.name}
                      onClick={() => handleNavClick(link.path)}
                      className="text-white/90 hover:text-gold font-cinzel text-lg bg-transparent border-none cursor-pointer">
                      {link.name}
                    </button>
                  );
                }
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-white/90 hover:text-gold font-cinzel text-lg">
                    {link.name}
                  </Link>
                );
              })}
              <Link to="/contact" className="w-full max-w-xs pt-4">
                <Button variant="primary" fullWidth>
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </nav>);

}