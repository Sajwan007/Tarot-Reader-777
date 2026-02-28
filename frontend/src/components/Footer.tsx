import { Moon, Instagram, Youtube, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-cosmic-dark border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Moon className="w-6 h-6 text-gold" />
              <span className="text-xl font-cinzel font-bold text-white">
                Mystic<span className="text-gold">Tarot</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Illuminating your path through ancient wisdom and cosmic guidance.
              Discover what the stars have in store for you.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gold font-cinzel font-bold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-white/60 hover:text-gold transition-colors text-sm">

                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/#services"
                  className="text-white/60 hover:text-gold transition-colors text-sm">

                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/#about"
                  className="text-white/60 hover:text-gold transition-colors text-sm">

                  About Reader
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-white/60 hover:text-gold transition-colors text-sm">

                  Book Reading
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-gold font-cinzel font-bold mb-4">Readings</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/contact?service=Love%20Tarot%20Reading&price=299"
                  className="text-white/60 hover:text-gold transition-colors text-sm">

                  Love & Relationships
                </Link>
              </li>
              <li>
                <Link
                  to="/contact?service=Career%20Guidance&price=279"
                  className="text-white/60 hover:text-gold transition-colors text-sm">

                  Career & Finance
                </Link>
              </li>
              <li>
                <Link
                  to="/contact?service=Life%20Path%20Reading&price=349"
                  className="text-white/60 hover:text-gold transition-colors text-sm">

                  Life Path
                </Link>
              </li>
              <li>
                <Link
                  to="/contact?service=Yes/No%20Reading&price=199"
                  className="text-white/60 hover:text-gold transition-colors text-sm">

                  Yes/No Questions
                </Link>
              </li>
              <li>
                <Link
                  to="/contact?service=Remedy%20for%20Healing&price=349"
                  className="text-white/60 hover:text-gold transition-colors text-sm">

                  Remedy for Healing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gold font-cinzel font-bold mb-4">Connect</h4>
            <div className="flex gap-4 mb-6">
              <a
                href="https://www.instagram.com/tarot_reader_777"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-gold transition-colors">

                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/@tarotreade"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-gold transition-colors">

                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <a
              href="mailto:scdcacademy@gmail.com"
              className="flex items-center gap-2 text-white/60 hover:text-gold transition-colors text-sm">

              <Mail className="w-4 h-4" />
              scdcacademy@gmail.com
            </a>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center">
          <p className="text-white/40 text-xs">
            {new Date().getFullYear()} | Mystic Tarot. All rights reserved.
          </p>
        </div>
      </div>
    </footer>);

}