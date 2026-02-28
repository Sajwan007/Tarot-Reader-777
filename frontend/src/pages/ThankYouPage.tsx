import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, Mail, Phone, Star } from 'lucide-react';

const ThankYouPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-cosmic-dark bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            className="mb-8"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          {/* Main Message */}
          <h1 className="text-5xl font-bold text-white mb-4">
            Thank You! <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">✨</span>
          </h1>
          
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Your message has been received successfully. We'll get back to you within 24 hours.
          </p>

          {/* What Happens Next */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-purple-400 border-opacity-30"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">What Happens Next?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-purple-300" />
                </div>
                <h3 className="text-white font-medium mb-2">Email Confirmation</h3>
                <p className="text-purple-200 text-sm">You'll receive a confirmation email shortly</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-purple-300" />
                </div>
                <h3 className="text-white font-medium mb-2">We Review Your Message</h3>
                <p className="text-purple-200 text-sm">Our team carefully reviews every inquiry</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-purple-300" />
                </div>
                <h3 className="text-white font-medium mb-2">Personal Response</h3>
                <p className="text-purple-200 text-sm">We'll respond via your preferred contact method</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-purple-400 border-opacity-30"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Need Immediate Assistance?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:scdcacademy@gmail.com" 
                className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
              >
                <Mail className="w-4 h-4" />
                Email Us
              </a>
              <div className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 bg-opacity-20 text-purple-200 rounded-lg">
                <Phone className="w-4 h-4" />
                Response within 24 hours
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
            
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white bg-opacity-10 hover:bg-opacity-20 text-white font-semibold rounded-lg border border-purple-400 border-opacity-30 transition"
            >
              <Mail className="w-5 h-5" />
              Send Another Message
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-purple-300 text-sm">
              While you wait, explore our <Link to="/" className="text-purple-400 hover:text-purple-300 underline">tarot reading services</Link> or read our <Link to="/about" className="text-purple-400 hover:text-purple-300 underline">customer testimonials</Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ThankYouPage;
