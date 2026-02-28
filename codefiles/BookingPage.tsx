import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { bookingsAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  Calendar,
  Clock,
  Check,
  ChevronRight,
  ChevronLeft,
  Heart,
  Briefcase,
  HelpCircle,
  Compass,
  Star } from
'lucide-react';
// Mock Data
const services = [
{
  id: 'bebeced9-d4d8-41eb-8e05-f70e9be59cb9', // Love Tarot Reading UUID
  title: 'Love Tarot Reading',
  price: 299,
  duration: 10,
  icon: <Heart className="w-5 h-5" />
},
{
  id: '03e6cb75-0ba3-4bf0-923e-422d12ec092a', // Career Guidance UUID
  title: 'Career Guidance',
  price: 279,
  duration: 10,
  icon: <Briefcase className="w-5 h-5" />
},
{
  id: '95394508-7f76-4249-8010-58d7b48368d7', // Yes/No Reading UUID
  title: 'Yes/No Reading',
  price: 199,
  duration: 5,
  icon: <HelpCircle className="w-5 h-5" />
},
{
  id: '9c77bcbb-0add-4562-8a67-f0d2dc501db0', // Life Path Reading UUID
  title: 'Life Path Reading',
  price: 349,
  duration: 10,
  icon: <Compass className="w-5 h-5" />
},
{
  id: 'ecd0c639-8aa0-4ebd-908c-75fd21f54c52', // Custom Question UUID
  title: 'Custom Question',
  price: 499,
  duration: 10,
  icon: <Star className="w-5 h-5" />
},
{
  id: 'a1b2c3d4-e5f6-4789-9abc-def123456789', // Remedy for Healing UUID
  title: 'Remedy for Healing',
  price: 349,
  duration: 10,
  icon: <Star className="w-5 h-5" />
}];

const readingTypes = [
{
  id: 'email',
  label: 'Email',
  desc: 'Detailed Email Report'
}];

const timeSlots = [
'10:00 AM',
'11:00 AM',
'02:00 PM',
'03:00 PM',
'05:00 PM',
'07:00 PM'];

export function BookingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    type: 'email',
    name: '',
    email: '',
    phone: '',
    question: ''
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

    try {
      // Find selected service details
      const selectedService = services.find(s => s.id === formData.service);
      
      // Prepare booking data for API
      const bookingData = {
        client_name: formData.name,
        client_email: formData.email,
        client_phone: formData.phone,
        service_id: formData.service, // This should be the service ID
        booking_date: formData.date,
        booking_time: formData.time,
        notes: formData.question
      };

      // Create booking via API
      const response = await bookingsAPI.create(bookingData);
      
      if (response.data.booking) {
        toast.success('Booking created successfully!');
        
        // Navigate to payment page with booking data
        navigate('/payment', {
          state: {
            booking: {
              ...formData,
              ...response.data.booking,
              id: response.data.booking.id,
              service: selectedService?.title || 'Tarot Reading',
              price: selectedService?.price || 999,
              payment_qr_code: null // Will be generated on payment page
            }
          }
        });
      } else {
        toast.error('Failed to create booking');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
      console.error('Booking error:', error);
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
            {['Service', 'Date & Time', 'Type', 'Details'].map((label, idx) =>
            <span
              key={idx}
              className={`text-xs font-cinzel font-bold ${step > idx ? 'text-gold' : 'text-white/30'}`}>

                {label}
              </span>
            )}
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gold"
              initial={{
                width: 0
              }}
              animate={{
                width: `${step / 4 * 100}%`
              }}
              transition={{
                duration: 0.3
              }} />

          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            {/* Step 1: Service Selection */}
            {step === 1 &&
            <motion.div
              key="step1"
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{
                opacity: 0,
                x: -20
              }}
              className="space-y-6">

                <h2 className="text-2xl font-cinzel font-bold text-white mb-6">
                  Choose Your Reading
                </h2>
                <div className="grid gap-4">
                  {services.map((s) =>
                <button
                  key={s.id}
                  onClick={() => updateForm('service', s.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${formData.service === s.id ? 'bg-gold/20 border-gold text-white' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}>

                      <div className="flex items-center gap-4">
                        <div
                      className={`p-2 rounded-full ${formData.service === s.id ? 'bg-gold text-cosmic-dark' : 'bg-white/10 text-gold'}`}>

                          {s.icon}
                        </div>
                        <div className="text-left">
                          <div className="font-bold font-cinzel">{s.title}</div>
                          <div className="text-sm opacity-70">₹{s.price} • {s.duration} mins</div>
                          {s.title === 'Yes/No Reading' ? (
                            <div className="text-xs opacity-50 text-gold">Additional charges may apply after 5 mins</div>
                          ) : (
                            <div className="text-xs opacity-50 text-gold">Additional charges may apply after 10 mins</div>
                          )}
                        </div>
                      </div>
                      {formData.service === s.id &&
                  <Check className="text-gold" />
                  }
                    </button>
                )}
                </div>
                <div className="flex justify-end mt-8">
                  <Button onClick={nextStep} disabled={!formData.service}>
                    Next Step <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            }

            {/* Step 2: Date & Time */}
            {step === 2 &&
            <motion.div
              key="step2"
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{
                opacity: 0,
                x: -20
              }}
              className="space-y-6">

                <h2 className="text-2xl font-cinzel font-bold text-white mb-6">
                  Select Date & Time
                </h2>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gold mb-2">
                    Select Date
                  </label>
                  <input
                  type="date"
                  className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                  onChange={(e) => updateForm('date', e.target.value)}
                  value={formData.date} />

                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gold mb-2">
                    Available Slots
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {timeSlots.map((time) =>
                  <button
                    key={time}
                    onClick={() => updateForm('time', time)}
                    className={`py-2 px-4 rounded-lg border text-sm transition-all ${formData.time === time ? 'bg-gold text-cosmic-dark border-gold font-bold' : 'bg-white/5 border-white/20 text-white/70 hover:border-gold/50'}`}>

                        {time}
                      </button>
                  )}
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="secondary" onClick={prevStep}>
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button
                  onClick={nextStep}
                  disabled={!formData.date || !formData.time}>

                    Next Step <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            }

            {/* Step 3: Reading Type */}
            {step === 3 &&
            <motion.div
              key="step3"
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{
                opacity: 0,
                x: -20
              }}
              className="space-y-6">

                <h2 className="text-2xl font-cinzel font-bold text-white mb-6">
                  Reading Format
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {readingTypes.map((type) =>
                <button
                  key={type.id}
                  onClick={() => updateForm('type', type.id)}
                  className={`p-6 rounded-xl border text-left transition-all ${formData.type === type.id ? 'bg-gold/20 border-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>

                      <div
                    className={`font-bold font-cinzel mb-1 ${formData.type === type.id ? 'text-gold' : 'text-white'}`}>

                        {type.label}
                      </div>
                      <div className="text-sm text-white/60">{type.desc}</div>
                    </button>
                )}
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="secondary" onClick={prevStep}>
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button onClick={nextStep} disabled={!formData.type}>
                    Next Step <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            }

            {/* Step 4: Details */}
            {step === 4 &&
            <motion.div
              key="step4"
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{
                opacity: 0,
                x: -20
              }}>

                <h2 className="text-2xl font-cinzel font-bold text-white mb-6">
                  Your Details
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                      onChange={(e) => updateForm('name', e.target.value)} />

                    </div>
                    <div>
                      <label className="block text-sm text-gold mb-1">
                        Phone
                      </label>
                      <input
                      required
                      type="tel"
                      className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:border-gold outline-none"
                      value={formData.phone}
                      onChange={(e) => updateForm('phone', e.target.value)} />

                    </div>
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
                    onChange={(e) => updateForm('email', e.target.value)} />

                  </div>

                  <div>
                    <label className="block text-sm text-gold mb-1">
                      Your Question / Focus Area (Optional)
                    </label>
                    <textarea
                    rows={4}
                    className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:border-gold outline-none resize-none"
                    value={formData.question}
                    onChange={(e) => updateForm('question', e.target.value)}
                    placeholder="What would you like the cards to reveal?" />

                  </div>

                  <div className="flex justify-between mt-8">
                    <Button
                    type="button"
                    variant="secondary"
                    onClick={prevStep}>

                      <ChevronLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Creating Booking...
                        </>
                      ) : (
                        <>
                          Proceed to Payment{' '}
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>
    </div>);

}