import React from 'react';
import { Heart, Briefcase, HelpCircle, Compass, Star } from 'lucide-react';
import { ServiceCard } from './ServiceCard';

export function ServicesSection() {
  const services = [
    {
      title: 'Love Tarot Reading',
      price: '₹299',
      description:
        'Discover insights about your romantic path, soulmate connections, and relationship dynamics.',
      icon: <Heart className="w-6 h-6" />,
      delay: 0.1
    },
    {
      title: 'Career Guidance',
      price: '₹279',
      description:
        'Navigate your professional journey, uncover hidden opportunities, and find your true calling.',
      icon: <Briefcase className="w-6 h-6" />,
      delay: 0.2
    },
    {
      title: 'Yes/No Reading',
      price: '₹199 (5 mins)',
      description:
        'Quick, direct answers to your most pressing questions when you need immediate clarity.',
      icon: <HelpCircle className="w-6 h-6" />,
      delay: 0.3
    },
    {
      title: 'Life Path Reading',
      price: '₹349',
      description:
        "A deep dive into your life's purpose, spiritual lessons, and the grand design of your destiny.",
      icon: <Compass className="w-6 h-6" />,
      delay: 0.4
    },
    {
      title: 'Custom Question',
      price: '₹499',
      description:
        'Personalized reading focused entirely on a specific situation or topic of your choice.',
      icon: <Star className="w-6 h-6" />,
      delay: 0.5
    },
    {
      title: 'Remedy for Healing',
      price: '₹349',
      description:
        'Spiritual remedies and healing guidance to restore balance and harmony to your life journey.',
      icon: <Star className="w-6 h-6" />,
      delay: 0.6
    }
  ];

  return (
    <section id="services" className="py-12 max-[375px]:py-16 sm:py-20 lg:py-24 relative bg-cosmic-dark">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-2 max-[375px]:px-3 max-[320px]:px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 max-[375px]:mb-12 sm:mb-16">
          <h2 className="text-xl max-[375px]:text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold text-white mb-2 max-[375px]:mb-3">
            Sacred <span className="text-gold">Services</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-xs max-[375px]:text-sm sm:text-base">
            Choose the reading that resonates with your current journey. Each
            session is conducted with deep care and spiritual intention.
          </p>
        </div>

        <div className="grid grid-cols-1 max-[375px]:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-[375px]:gap-8 sm:gap-6 md:gap-8 lg:gap-8">
          {services.map((service, index) =>
          <ServiceCard key={index} {...service} />
          )}
        </div>
      </div>
    </section>
  );
}