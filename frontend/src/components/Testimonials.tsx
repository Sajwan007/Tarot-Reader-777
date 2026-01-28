import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
export function Testimonials() {
  const reviews = [
  {
    name: 'Sarah J.',
    text: "The most accurate reading I've ever had. She knew things about my situation that I hadn't told anyone. Truly gifted.",
    rating: 5
  },
  {
    name: 'Michael R.',
    text: 'I was skeptical at first, but the career guidance I received was spot on. It gave me the confidence to start my own business.',
    rating: 5
  },
  {
    name: 'Priya K.',
    text: 'Such a calming and healing energy. The session felt like therapy but with spiritual insight. Highly recommend!',
    rating: 5
  }];

  return (
    <section
      id="testimonials"
      className="py-24 bg-gradient-to-b from-cosmic-dark to-cosmic-purple relative overflow-hidden">

      {/* Background stars */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-cinzel font-bold text-white mb-4">
            Voices of <span className="text-gold">Experience</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Hear from those who have found clarity and direction through our
            sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            viewport={{
              once: true
            }}
            transition={{
              delay: index * 0.2
            }}
            className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl relative">

              <Quote className="absolute top-6 right-6 w-8 h-8 text-gold/20" />

              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) =>
              <Star key={i} className="w-4 h-4 text-gold fill-gold" />
              )}
              </div>

              <p className="text-white/80 italic mb-6 leading-relaxed">
                "{review.text}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-cosmic-violet flex items-center justify-center text-white font-bold font-cinzel">
                  {review.name.charAt(0)}
                </div>
                <span className="text-gold font-medium font-cinzel">
                  {review.name}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}