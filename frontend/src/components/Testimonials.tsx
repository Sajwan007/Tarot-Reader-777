import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export function Testimonials() {
  const reviews = [
    {
      name: 'Priya Sharma',
      text: "The most accurate reading I've ever had. She knew things about my situation that I hadn't told anyone. Truly gifted.",
      rating: 5
    },
    {
      name: 'Ayush Mourya',
      text: 'I was skeptical at first, but the career guidance I received was spot on. It gave me the confidence to start my own business.',
      rating: 5
    },
    {
      name: 'Mamta Tamang',
      text: 'Such a calming and healing energy. The session felt like therapy but with spiritual insight. Highly recommend!',
      rating: 5
    }
  ];

  return (
    <section
      id="testimonials"
      className="py-16 max-[375px]:py-20 sm:py-24 bg-gradient-to-b from-cosmic-dark to-cosmic-purple relative overflow-hidden"
    >

      {/* Background stars */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />

      <div className="max-w-7xl mx-auto px-2 max-[375px]:px-3 max-[320px]:px-2 sm:px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 max-[375px]:mb-16 sm:mb-20">
          <h2 className="text-xl max-[375px]:text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold text-white mb-3 max-[375px]:mb-4">
            What <span className="text-gold">Clients</span> Say
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-xs max-[375px]:text-sm sm:text-base">
            Real experiences from people who found clarity through our tarot readings.
          </p>
        </div>

        <div className="grid grid-cols-1 max-[375px]:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-[375px]:gap-6 sm:gap-8">
          {reviews.map((review, index) =>
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                scale: 0.9
              }}
              whileInView={{
                opacity: 1,
                scale: 1
              }}
              whileHover={{
                y: -8,
                boxShadow: '0 0 30px rgba(212, 175, 55, 0.15)'
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: index * 0.2
              }}
              className="bg-white/5 backdrop-blur-md border border-white/10 p-4 max-[375px]:p-4 sm:p-6 lg:p-8 rounded-2xl relative cursor-pointer group"
            >
              <motion.div 
                className="absolute top-6 right-6 w-8 h-8 text-gold/20"
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Quote />
              </motion.div>
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) =>
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.2, rotate: 180 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Star className="w-4 h-4 text-gold fill-gold" />
                  </motion.div>
                )}
              </div>

              <p className="text-white/80 italic mb-6 leading-relaxed">
                "{review.text}"
              </p>

              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-cosmic-violet flex items-center justify-center text-white font-bold font-cinzel"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {review.name.charAt(0)}
                </motion.div>
                <span className="text-gold font-medium font-cinzel">
                  {review.name}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}