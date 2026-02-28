import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Star, Heart, Briefcase, Compass } from 'lucide-react';

export function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is tarot reading and how does it work?",
      answer: "Tarot reading is an ancient divination practice that uses a deck of cards to gain insight into past, present, and future events. As your tarot reader, I interpret the cards based on your question and energy, providing guidance and clarity for your life journey.",
      icon: <Star className="w-5 h-5" />
    },
    {
      question: "How accurate are tarot readings?",
      answer: "Tarot readings provide guidance and insight rather than fixed predictions. The accuracy depends on the connection between the reader and seeker, as well as the openness of the person receiving the reading. My readings focus on empowering you to make informed decisions.",
      icon: <Compass className="w-5 h-5" />
    },
    {
      question: "What types of questions can I ask?",
      answer: "You can ask about any area of your life - love and relationships, career and finances, personal growth, life path decisions, or specific situations. The more specific your question, the more focused and helpful the reading will be.",
      icon: <HelpCircle className="w-5 h-5" />
    },
    {
      question: "How long does a reading take?",
      answer: "Most readings take 10 minutes for the basic session. The Yes/No Reading is 5 minutes for quick answers. Additional time may be required for complex questions, which will be discussed with you beforehand.",
      icon: <Heart className="w-5 h-5" />
    },
    {
      question: "How do I receive my reading?",
      answer: "All readings are delivered via email for your convenience and privacy. After your contact form submission, I'll respond within 24-48 hours to schedule your reading and then deliver the detailed reading via email.",
      icon: <Briefcase className="w-5 h-5" />
    },
    {
      question: "What if I'm not satisfied with my reading?",
      answer: "Customer satisfaction is very important. If you have concerns about your reading, please reach out within 24 hours, and I'll be happy to clarify or address any issues to ensure you receive the guidance you need.",
      icon: <Star className="w-5 h-5" />
    },
    {
      question: "Is my information kept confidential?",
      answer: "Absolutely. All personal information and reading details are kept completely confidential. Your privacy and trust are paramount, and no information is ever shared with third parties.",
      icon: <Heart className="w-5 h-5" />
    },
    {
      question: "Do I need to prepare anything for my reading?",
      answer: "Just come with an open mind and clear questions. It's helpful to think about what you'd like guidance on beforehand, but no special preparation is required. I'll guide you through the entire process.",
      icon: <Compass className="w-5 h-5" />
    }
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-cosmic-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cosmic-violet/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-cinzel font-bold text-white mb-4">
            Frequently Asked <span className="text-gold">Questions</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Everything you need to know about tarot readings and how they can help guide your journey.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                    {faq.icon}
                  </div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </h3>
                </div>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-gold"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-6 pb-4 pl-16 sm:pl-20">
                      <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-white/60 mb-6">
            Still have questions?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-cosmic-dark rounded-full font-semibold hover:bg-gold-light transition-colors"
          >
            Contact Us
            <HelpCircle className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
