import React from 'react';
import { motion } from 'framer-motion';
import { Award, Clock, Users } from 'lucide-react';
export function AboutReader() {
  return (
    <section id="about" className="py-24 bg-cosmic-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{
              opacity: 0,
              x: -50
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true
            }}
            className="relative">

            <div className="relative z-10 rounded-2xl overflow-hidden border-2 border-gold/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Tarot Reader"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" />

              <div className="absolute inset-0 bg-gradient-to-t from-cosmic-dark/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-2xl font-cinzel font-bold text-white">
                  Elena Mystica
                </h3>
                <p className="text-gold">Intuitive Tarot Reader</p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -left-10 w-full h-full border-2 border-gold/10 rounded-2xl -z-10" />
            <div className="absolute -bottom-10 -right-10 w-full h-full bg-cosmic-violet/20 rounded-2xl -z-10" />
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{
              opacity: 0,
              x: 50
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true
            }}>

            <h2 className="text-3xl md:text-4xl font-cinzel font-bold text-white mb-6">
              Guiding Souls Toward <span className="text-gold">Light</span>
            </h2>

            <p className="text-white/70 mb-6 leading-relaxed">
              With over a decade of experience in tarot reading and spiritual
              counseling, I help seekers find clarity in the chaos. My readings
              are compassionate, non-judgmental, and deeply rooted in intuition.
            </p>

            <p className="text-white/70 mb-8 leading-relaxed">
              I believe that tarot is not just about predicting the future, but
              about empowering you to create it. Together, we will uncover the
              hidden influences in your life and illuminate the path to your
              highest potential.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                <Clock className="w-8 h-8 text-gold mx-auto mb-2" />
                <div className="text-2xl font-bold text-white font-cinzel">
                  10+
                </div>
                <div className="text-xs text-white/50 uppercase tracking-wider">
                  Years Experience
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                <Users className="w-8 h-8 text-gold mx-auto mb-2" />
                <div className="text-2xl font-bold text-white font-cinzel">
                  5k+
                </div>
                <div className="text-xs text-white/50 uppercase tracking-wider">
                  Clients Helped
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                <Award className="w-8 h-8 text-gold mx-auto mb-2" />
                <div className="text-2xl font-bold text-white font-cinzel">
                  Cert.
                </div>
                <div className="text-xs text-white/50 uppercase tracking-wider">
                  Master Reader
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>);

}