import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { CheckCircle, Calendar, Home, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
export function ConfirmationPage() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-cosmic-dark relative overflow-hidden">
      {/* Celebration Confetti Effect (CSS/SVG) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) =>
        <motion.div
          key={i}
          className="absolute bg-gold rounded-full opacity-50"
          initial={{
            top: '50%',
            left: '50%',
            width: 4,
            height: 4,
            opacity: 1
          }}
          animate={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: 0
          }}
          transition={{
            duration: 2,
            ease: 'easeOut'
          }} />

        )}
      </div>

      <motion.div
        initial={{
          scale: 0.9,
          opacity: 0
        }}
        animate={{
          scale: 1,
          opacity: 1
        }}
        className="max-w-lg w-full mx-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 text-center relative z-10 shadow-[0_0_50px_rgba(212,175,55,0.1)]">

        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>

        <h1 className="text-3xl font-cinzel font-bold text-white mb-4">
          Booking Confirmed!
        </h1>

        <p className="text-white/70 mb-8 leading-relaxed">
          Your journey to clarity has begun. A confirmation email with session
          details has been sent to your inbox.
        </p>

        <div className="bg-cosmic-purple/50 rounded-xl p-6 mb-8 border border-white/5">
          <div className="flex items-center gap-3 mb-2 text-gold">
            <Sparkles className="w-5 h-5" />
            <span className="font-cinzel font-bold">Upcoming Session</span>
          </div>
          <p className="text-white/90 text-lg">Love Tarot Reading</p>
          <p className="text-white/50 text-sm">Friday, Oct 24 • 10:00 AM</p>
        </div>

        <div className="flex flex-col gap-4">
          <Button variant="outline" fullWidth>
            <span className="flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" /> Add to Calendar
            </span>
          </Button>

          <Link to="/">
            <Button fullWidth>
              <span className="flex items-center justify-center gap-2">
                <Home className="w-4 h-4" /> Return Home
              </span>
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>);

}