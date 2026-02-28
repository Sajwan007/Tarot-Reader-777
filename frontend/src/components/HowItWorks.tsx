import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, Clock, Mail } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Choose Service',
      description: 'Select the tarot reading that aligns with your questions.'
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Contact Us',
      description: 'Fill out our contact form with your details and questions.'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Quick Response',
      description: 'We\'ll respond within 24-48 hours to discuss your reading.'
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Receive Insight',
      description: 'Get your personalized reading via email with detailed guidance.'
    }
  ];

  return (
    <section className="py-12 max-[375px]:py-16 sm:py-20 lg:py-24 bg-cosmic-purple/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-[375px]:w-[400px] sm:w-[800px] h-[600px] max-[375px]:h-[400px] sm:h-[800px] bg-cosmic-violet/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-2 max-[375px]:px-3 max-[320px]:px-2 sm:px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 max-[375px]:mb-12 sm:mb-16">
          <h2 className="text-xl max-[375px]:text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold text-white mb-2 max-[375px]:mb-3">
            How It <span className="text-gold">Works</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-xs max-[375px]:text-sm sm:text-base">
            Your journey to clarity is simple and seamless.
          </p>
        </div>

        <div className="grid grid-cols-1 max-[375px]:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-[375px]:gap-4 sm:gap-6 md:gap-8">
          {steps.map((step, index) =>
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              delay: index * 0.2
            }}
            className="relative">

              {/* Connector Line (Desktop) */}
              {index < steps.length - 1 &&
            <div className="hidden lg:block absolute top-10 left-1/2 w-full h-[2px] bg-gradient-to-r from-gold/50 to-transparent -z-10" />
            }

              <div className="flex flex-col items-center text-center">
                <motion.div 
                  className="w-12 h-12 max-[375px]:w-16 max-[375px]:h-16 sm:w-20 sm:h-20 rounded-full bg-cosmic-dark border border-gold/30 flex items-center justify-center text-gold mb-4 max-[375px]:mb-6 shadow-[0_0_20px_rgba(212,175,55,0.15)] relative group cursor-pointer"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-gold/10 scale-0 group-hover:scale-110 transition-transform duration-500" 
                  />
                  <motion.div 
                    className="w-4 h-4 max-[375px]:w-6 max-[375px]:h-6 sm:w-8 sm:h-8 flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    {step.icon}
                  </motion.div>
                  <div className="absolute -top-2 -right-2 w-4 h-4 max-[375px]:w-6 max-[375px]:h-6 sm:w-8 sm:h-8 rounded-full bg-gold text-cosmic-dark font-bold flex items-center justify-center text-xs max-[375px]:text-xs sm:text-sm">
                    {index + 1}
                  </div>
                </motion.div>

                <motion.h3 
                  className="text-base max-[375px]:text-lg sm:text-xl font-cinzel font-bold text-white mb-2 max-[375px]:mb-3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {step.title}
                </motion.h3>
                <p className="text-white/60 text-xs max-[375px]:text-sm sm:text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );

}