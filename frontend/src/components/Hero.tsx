import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { Link } from 'react-router-dom';
import { Sparkles, Star, Moon } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
      {/* Full-width background wrapper */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-gradient" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay" />
        
        {/* Animated Stars */}
        {[...Array(20)].map((_, i) =>
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 3 + 1 + 'px',
            height: Math.random() * 3 + 1 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%'
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }} />
        )}
      </div>

      {/* Content container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-2 max-[375px]:px-3 max-[320px]:px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-[375px]:gap-6 sm:gap-8 lg:gap-12 items-center min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]">
          {/* Text Content */}
          <motion.div
            initial={{
              opacity: 0,
              x: -50
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut'
            }}
            className="text-center lg:text-left">

          <div className="inline-flex items-center gap-1 max-[375px]:gap-2 px-2 max-[375px]:px-3 py-1 sm:py-1.5 max-[375px]:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-3 max-[375px]:mb-4 sm:mb-6">
            <Sparkles className="w-2 max-[375px]:w-3 h-2 max-[375px]:h-3 sm:w-4 sm:h-4 text-gold" />
            <span className="text-gold text-xs max-[375px]:text-xs sm:text-sm font-medium tracking-wider uppercase">
              Unlock Your Destiny
            </span>
          </div>

          <h1 className="text-xl max-[375px]:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-cinzel font-bold text-white mb-2 max-[375px]:mb-3 sm:mb-4 md:mb-6 leading-tight">
            Discover Your Path Through{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light">
              Tarot
            </span>
          </h1>

          <p className="text-xs max-[375px]:text-sm sm:text-base md:text-lg lg:text-xl text-white/70 mb-4 max-[375px]:mb-6 sm:mb-8 max-w-xs max-[375px]:max-w-sm mx-auto lg:mx-0 font-inter leading-relaxed">
            Gain clarity on love, career, and life's biggest questions with
            personalized readings that illuminate way forward.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 max-[375px]:gap-2 sm:gap-3 md:gap-4 justify-center lg:justify-start">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link to="/contact">
                <Button size="lg" className="min-w-[100px] max-[375px]:min-w-[120px] sm:min-w-[140px] md:min-w-[180px] text-xs max-[375px]:text-sm sm:text-base shadow-lg hover:shadow-xl hover:shadow-gold/20 transition-all duration-300">
                  Book a Reading
                </Button>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <a href="#services">
                <Button variant="secondary" size="lg" className="min-w-[100px] max-[375px]:min-w-[120px] sm:min-w-[140px] md:min-w-[180px] text-xs max-[375px]:text-sm sm:text-base hover:bg-gold/10 transition-all duration-300">
                  Explore Services
                </Button>
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* Visual Content */}
        <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] flex items-center justify-center hidden lg:flex">
          {/* Main Floating Card */}
          <motion.div
            animate={{
              y: [0, -20, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="relative z-20 w-64 h-96 rounded-2xl bg-gradient-to-br from-cosmic-purple to-cosmic-dark border-2 border-gold/50 shadow-[0_0_50px_rgba(212,175,55,0.2)] flex items-center justify-center overflow-hidden group">

            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1630342978016-46481c039274?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-60 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 border-[1px] border-gold/30 m-2 rounded-xl" />
            <Moon className="w-16 h-16 text-gold drop-shadow-lg relative z-10" />
          </motion.div>

          {/* Background Floating Cards */}
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: -15
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1
            }}
            className="absolute left-20 top-20 w-48 h-72 rounded-xl bg-cosmic-violet/80 border border-white/10 backdrop-blur-sm z-10 transform -rotate-12" />

          <motion.div
            animate={{
              y: [0, -25, 0],
              rotate: 15
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5
            }}
            className="absolute right-20 bottom-20 w-48 h-72 rounded-xl bg-cosmic-violet/80 border border-white/10 backdrop-blur-sm z-10 transform rotate-12" />


          {/* Glowing Orb */}
          <div className="absolute inset-0 bg-gold/5 blur-[100px] rounded-full z-0" />
        </div>
      </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 flex flex-col items-center gap-2"
        animate={{
          opacity: [0.5, 1, 0.5],
          y: [0, 5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity
        }}>

        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-gold to-transparent" />
      </motion.div>
    </section>);

}