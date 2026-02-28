import React from 'react';
import { Hero } from '../components/Hero';
import { ServicesSection } from '../components/ServicesSection';
import { HowItWorks } from '../components/HowItWorks';
import { AboutReader } from '../components/AboutReader';
import { Testimonials } from '../components/Testimonials';
import { FAQSection } from '../components/FAQSection';
import { motion } from 'framer-motion';
export function HomePage() {
  return (
    <motion.main
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      exit={{
        opacity: 0
      }}
      transition={{
        duration: 0.5
      }}>

      <Hero />
      <ServicesSection />
      <HowItWorks />
      <AboutReader />
      <Testimonials />
      <FAQSection />
    </motion.main>
  );
}