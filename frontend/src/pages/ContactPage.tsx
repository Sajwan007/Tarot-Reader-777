import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';
import { contactAPI } from '../lib/api';
import {
  Mail,
  MessageCircle,
  Send,
  Clock,
  Star,
  Heart,
  Briefcase,
  HelpCircle,
  Compass
} from 'lucide-react';

const contactReasons = [
  {
    id: 'general',
    title: 'General Inquiry',
    icon: <MessageCircle className="w-5 h-5" />,
    description: 'Questions about services or general information',
    price: 0
  },
  {
    id: 'love',
    title: 'Love Reading',
    icon: <Heart className="w-5 h-5" />,
    description: 'Questions about love and relationship readings',
    price: 1200
  },
  {
    id: 'career',
    title: 'Career Guidance',
    icon: <Briefcase className="w-5 h-5" />,
    description: 'Questions about career and life path readings',
    price: 1500
  },
  {
    id: 'yesno',
    title: 'Quick Question',
    icon: <HelpCircle className="w-5 h-5" />,
    description: 'Yes/No questions and quick guidance',
    price: 500
  },
  {
    id: 'lifepath',
    title: 'Life Path Reading',
    icon: <Compass className="w-5 h-5" />,
    description: 'Deep life path and spiritual guidance',
    price: 2000
  },
  {
    id: 'custom',
    title: 'Custom Question',
    icon: <Star className="w-5 h-5" />,
    description: 'Personalized tarot reading for specific questions',
    price: 2500
  }
];

const contactMethods = [
  {
    id: 'email',
    label: 'Email',
    desc: 'info@tarotreader777.com',
    icon: <Mail className="w-5 h-5" />
  }
];

export function ContactPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    name: '',
    email: '',
    phone: '',
    preferredContact: '',
    message: '',
    selectedService: '',
    servicePrice: 0
  });
  
  const updateForm = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
  };
  
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('Form data being submitted:', formData);

    try {
      // Submit to API
      const response = await contactAPI.submitContact(formData);
      
      if (response.data.success) {
        // Redirect to thank you page instead of showing toast
        navigate('/thank-you');
      } else {
        toast.error('Failed to send message. Please try again.');
      }
      
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-cosmic-dark bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {['Reason', 'Contact Info', 'Message'].map((label, idx) =>
              <span
                key={idx}
                className={`text-xs font-cinzel font-bold ${step > idx ? 'text-gold' : 'text-white/30'}`}
              >
                {label}
              </span>
            )}
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gold"
              initial={{ width: 0 }}
              animate={{ width: `${step / 3 * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            {/* Step 1: Contact Reason */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-cinzel font-bold text-white mb-6">
                  What would you like to know?
                </h2>
                <div className="grid gap-4">
                  {contactReasons.map((reason) => (
                    <button
                      key={reason.id}
                      onClick={() => {
  updateForm('reason', reason.id);
  updateForm('selectedService', reason.title);
  updateForm('servicePrice', String(reason.price || 0));
}}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        formData.reason === reason.id 
                          ? 'bg-gold/20 border-gold text-white' 
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${
                          formData.reason === reason.id 
                            ? 'bg-gold text-cosmic-dark' 
                            : 'bg-white/10 text-gold'
                        }`}>
                          {reason.icon}
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-bold font-cinzel">{reason.title}</div>
                          <div className="text-sm opacity-70">{reason.description}</div>
                          {reason.price > 0 && (
                            <div className="text-gold font-bold mt-1">₹{reason.price}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {reason.price > 0 && (
                          <span className="text-gold text-sm font-bold">₹{reason.price}</span>
                        )}
                        {formData.reason === reason.id && (
                          <Star className="text-gold" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end mt-8">
                  <Button onClick={nextStep} disabled={!formData.reason}>
                    Next Step
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Contact Information */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-cinzel font-bold text-white mb-6">
                  Your Contact Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gold mb-1">
                      Name
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:border-gold outline-none"
                      value={formData.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gold mb-1">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:border-gold outline-none"
                      value={formData.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gold mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:border-gold outline-none"
                    value={formData.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gold mb-2">
                    Preferred Contact Method
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {contactMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => updateForm('preferredContact', method.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          formData.preferredContact === method.id 
                            ? 'bg-gold/20 border-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className={`font-bold font-cinzel mb-1 ${
                          formData.preferredContact === method.id ? 'text-gold' : 'text-white'
                        }`}>
                          {method.label}
                        </div>
                        <div className="text-sm text-white/60">{method.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="secondary" onClick={prevStep}>
                    Back
                  </Button>
                  <Button onClick={nextStep} disabled={!formData.name || !formData.email}>
                    Next Step
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Message */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-cinzel font-bold text-white mb-6">
                  Your Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gold mb-1">
                      Tell us more about your question
                    </label>
                    <textarea
                      required
                      rows={6}
                      className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:border-gold outline-none resize-none"
                      value={formData.message}
                      onChange={(e) => updateForm('message', e.target.value)}
                      placeholder="Share your question or what you'd like guidance on..."
                    />
                  </div>

                  <div className="bg-gold/10 border border-gold/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-gold" />
                      <span className="text-sm font-cinzel text-gold">Response Time</span>
                    </div>
                    <p className="text-sm text-white/80">
                      We typically respond within 24-48 hours. For urgent matters, please call us directly.
                    </p>
                  </div>

                  <div className="flex justify-between mt-8">
                    <Button type="button" variant="secondary" onClick={prevStep}>
                      Back
                    </Button>
                    <Button type="submit" disabled={loading || !formData.name || !formData.email || !formData.reason || !formData.preferredContact || !formData.message}>
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message <Send className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {/* Honeypot field for bot detection - hidden from users */}
                  <input
                    type="text"
                    name="bot_field"
                    className="absolute -left-[9999px] opacity-0"
                    tabIndex={-1}
                    autoComplete="off"
                    onChange={(e) => updateForm('bot_field', e.target.value)}
                  />
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Contact Information Section */}
        <div className="mt-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
          <h3 className="text-xl font-cinzel font-bold text-white mb-6 text-center">
            Other Ways to Reach Us
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <div className="text-center">
              <div className="bg-gold/20 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Mail className="w-6 h-6 text-gold" />
              </div>
              <h4 className="font-cinzel font-bold text-white mb-2">Email Us</h4>
              <p className="text-white/70 text-sm">info@tarotreader777.com</p>
              <p className="text-white/50 text-xs mt-1">24/7 Response</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
