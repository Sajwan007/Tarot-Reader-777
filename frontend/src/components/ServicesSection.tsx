import React from 'react';
import { Heart, Briefcase, HelpCircle, Compass, Star } from 'lucide-react';
import { ServiceCard } from './ServiceCard';
export function ServicesSection() {
  const services = [
  {
    title: 'Love Tarot Reading',
    price: '₹999',
    description:
    'Discover insights about your romantic path, soulmate connections, and relationship dynamics.',
    icon: <Heart className="w-6 h-6" />,
    delay: 0.1
  },
  {
    title: 'Career Guidance',
    price: '₹1,299',
    description:
    'Navigate your professional journey, uncover hidden opportunities, and find your true calling.',
    icon: <Briefcase className="w-6 h-6" />,
    delay: 0.2
  },
  {
    title: 'Yes/No Reading',
    price: '₹499',
    description:
    'Quick, direct answers to your most pressing questions when you need immediate clarity.',
    icon: <HelpCircle className="w-6 h-6" />,
    delay: 0.3
  },
  {
    title: 'Life Path Reading',
    price: '₹1,799',
    description:
    "A deep dive into your life's purpose, spiritual lessons, and the grand design of your destiny.",
    icon: <Compass className="w-6 h-6" />,
    delay: 0.4
  },
  {
    title: 'Custom Question',
    price: '₹899',
    description:
    'Personalized reading focused entirely on a specific situation or topic of your choice.',
    icon: <Star className="w-6 h-6" />,
    delay: 0.5
  }];

  return (
    <section id="services" className="py-24 relative bg-cosmic-dark">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-cinzel font-bold text-white mb-4">
            Sacred <span className="text-gold">Services</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Choose the reading that resonates with your current journey. Each
            session is conducted with deep care and spiritual intention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) =>
          <ServiceCard key={index} {...service} />
          )}
        </div>
      </div>
    </section>);

}