import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CreditCard, MessageCircle, Sparkles } from 'lucide-react';
export function HowItWorks() {
  const steps = [
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: 'Choose Service',
    description: 'Select the tarot reading that aligns with your questions.'
  },
  {
    icon: <Calendar className="w-8 h-8" />,
    title: 'Book Session',
    description: 'Pick a date and time that works for your schedule.'
  },
  {
    icon: <CreditCard className="w-8 h-8" />,
    title: 'Secure Payment',
    description: 'Complete your booking with our secure payment system.'
  },
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: 'Receive Insight',
    description: 'Get your personalized reading via your chosen method.'
  }];

  return (
    <section className="py-24 bg-cosmic-purple/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cosmic-violet/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-cinzel font-bold text-white mb-4">
            How It <span className="text-gold">Works</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Your journey to clarity is simple and seamless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                <div className="w-20 h-20 rounded-full bg-cosmic-dark border border-gold/30 flex items-center justify-center text-gold mb-6 shadow-[0_0_20px_rgba(212,175,55,0.15)] relative group">
                  <div className="absolute inset-0 rounded-full bg-gold/10 scale-0 group-hover:scale-110 transition-transform duration-500" />
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gold text-cosmic-dark font-bold flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-xl font-cinzel font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}