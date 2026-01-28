import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
interface ServiceCardProps {
  title: string;
  price: string;
  description: string;
  icon?: React.ReactNode;
  delay?: number;
}
export function ServiceCard({
  title,
  price,
  description,
  icon,
  delay = 0
}: ServiceCardProps) {
  return (
    <motion.div
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
        duration: 0.5,
        delay
      }}
      whileHover={{
        y: -8,
        boxShadow: '0 0 30px rgba(212, 175, 55, 0.15)'
      }}
      className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col h-full overflow-hidden">

      {/* Decorative gradient blob */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/10 rounded-full blur-3xl group-hover:bg-gold/20 transition-all duration-500" />

      <div className="relative z-10 flex-1">
        <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-gold/20 to-transparent border border-gold/30 text-gold">
          {icon || <Sparkles className="w-6 h-6" />}
        </div>

        <h3 className="text-2xl font-cinzel font-bold text-white mb-2 group-hover:text-gold transition-colors">
          {title}
        </h3>

        <div className="text-xl font-medium text-gold/90 mb-4 font-cinzel">
          {price}
        </div>

        <p className="text-white/70 leading-relaxed mb-6 font-inter text-sm">
          {description}
        </p>
      </div>

      <div className="relative z-10 mt-auto">
        <Link to="/booking">
          <Button
            variant="secondary"
            fullWidth
            className="group-hover:bg-gold group-hover:text-cosmic-dark group-hover:border-gold">

            <span className="flex items-center gap-2">
              Book Now <ArrowRight className="w-4 h-4" />
            </span>
          </Button>
        </Link>
      </div>
    </motion.div>);

}