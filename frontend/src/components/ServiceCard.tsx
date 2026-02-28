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
  // Create contact URL with service data
  const contactUrl = `/contact?service=${encodeURIComponent(title)}&price=${encodeURIComponent(price)}`;

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
      className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 max-[375px]:p-4 sm:p-6 lg:p-8 flex flex-col h-full overflow-hidden max-w-full"
    >
      {/* Decorative gradient blob */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/10 rounded-full blur-3xl group-hover:bg-gold/20 transition-all duration-500" />

      <div className="relative z-10 flex-1">
        <div className="mb-4 max-[375px]:mb-6 inline-flex items-center justify-center w-10 max-[375px]:w-12 h-10 max-[375px]:h-12 rounded-full bg-gradient-to-br from-gold/20 to-transparent border border-gold/30 text-gold">
          {icon || <Sparkles className="w-4 max-[375px]:w-5 h-4 max-[375px]:h-5" />}
        </div>

        <h3 className="text-base max-[375px]:text-lg sm:text-xl lg:text-2xl font-cinzel font-bold text-white mb-2 group-hover:text-gold transition-colors">
          {title}
        </h3>

        <div className="text-base max-[375px]:text-lg font-medium text-gold/90 mb-4 font-cinzel">
          {price}
        </div>

        <p className="text-white/70 leading-relaxed mb-6 font-inter text-xs max-[375px]:text-sm">
          {description}
        </p>
      </div>

      <div className="relative z-10 mt-auto">
        <Link to={contactUrl}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              variant="secondary"
              fullWidth
              className="group-hover:bg-gold group-hover:text-cosmic-dark group-hover:border-gold transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                Book Now 
                <motion.div
                  animate={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </span>
            </Button>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
}