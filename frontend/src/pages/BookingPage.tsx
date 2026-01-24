import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Check, ChevronRight, ChevronLeft, Heart, Briefcase, HelpCircle, Compass, Star, AlertCircle } from 'lucide-react';
import { sendBookingConfirmationEmail } from '../utils/email';
import { LottieAnimationLoader } from '../components/LottieAnimationLoader';
import { LoadingButton } from '../components/LoadingButton';
import { db } from '../utils/database';

// Mock Data
const services = [{
  id: 'love',
  title: 'Love Tarot Reading',
  price: '₹999',
  icon: <Heart className="w-5 h-5" />
}, {
  id: 'career',
  title: 'Career Guidance',
  price: '₹1,299',
  icon: <Briefcase className="w-5 h-5" />
}, {
  id: 'yesno',
  title: 'Yes/No Reading',
  price: '₹499',
  icon: <HelpCircle className="w-5 h-5" />
}, {
  id: 'life',
  title: 'Life Path Reading',
  price: '₹1,799',
  icon: <Compass className="w-5 h-5" />
}, {
  id: 'custom',
  title: 'Custom Question',
  price: '₹899',
  icon: <Star className="w-5 h-5" />
}];
const readingTypes = [{
  id: 'live',
  label: 'Live Video Call',
  desc: 'Zoom/Google Meet'
}, {
  id: 'recorded',
  label: 'Recorded Video',
  desc: 'Sent via Email'
}, {
  id: 'chat',
  label: 'Live Chat',
  desc: 'WhatsApp/Telegram'
}, {
  id: 'email',
  label: 'Detailed Email',
  desc: 'Written Report'
}];
const timeSlots = ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '05:00 PM', '07:00 PM'];
export function BookingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');
  
    
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    type: '',
    name: '',
    email: '',
    phone: '',
    question: ''
  });

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({
        ...prev,
        [key]: ''
      }));
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!formData.service) {
          newErrors.service = 'Please select a service';
        }
        break;
      case 2:
        if (!formData.date) {
          newErrors.date = 'Please select a date';
        }
        if (!formData.time) {
          newErrors.time = 'Please select a time slot';
        }
        // Validate date is not in the past
        if (formData.date && new Date(formData.date) < new Date(new Date().setHours(0,0,0,0))) {
          newErrors.date = 'Please select a future date';
        }
        break;
      case 3:
        if (!formData.type) {
          newErrors.type = 'Please select a reading type';
        }
        break;
      case 4:
        if (!formData.name.trim()) {
          newErrors.name = 'Name is required';
        }
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email';
        }
        if (!formData.phone.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
          newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  
  const handleSubmit = async () => {
    console.log('handleSubmit called, current step:', step);
    console.log('Form data:', formData);
    
    if (!validateStep(4)) {
      console.log('Validation failed for step 4');
      console.log('Current errors:', errors);
      return;
    }
    
    console.log('Validation passed, proceeding with booking submission...');
    
    try {
      console.log('Starting booking submission...');
      
      // Get service info first
      const service = services.find(s => s.id === formData.service);
      console.log('Service found:', service);
      
      // Store booking data using database service
      const bookingData = {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        service_id: formData.service,
        service_name: service?.title || formData.service,
        service_price: service?.price || '₹999',
        booking_date: formData.date,
        booking_time: formData.time,
        reading_type: formData.type,
        question: formData.question || undefined,
        status: 'pending' as const
      };
      
      console.log('Creating booking with data:', bookingData);
      
      try {
        const newBooking = await db.createBooking(bookingData);
        console.log('Booking created:', newBooking);
        setBookingId(newBooking.id);
      } catch (dbError) {
        console.warn('Database failed, using localStorage fallback:', dbError);
        // Create a fallback booking ID
        const fallbackId = 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
        setBookingId(fallbackId);
        
        // Store in localStorage as backup
        const fallbackBooking = {
          id: fallbackId,
          ...bookingData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        localStorage.setItem(`booking_${fallbackId}`, JSON.stringify(fallbackBooking));
      }
      
      // Send booking confirmation email
      try {
        await sendBookingConfirmationEmail({
          customerName: formData.name,
          customerEmail: formData.email,
          serviceName: service?.title || formData.service,
          date: formData.date,
          time: formData.time,
          price: service?.price || '₹999',
          bookingId: bookingId || 'Unknown',
          readingType: formData.type,
          question: formData.question || undefined
        });
        console.log('Email sent successfully');
      } catch (emailError) {
        console.warn('Email failed but continuing:', emailError);
      }
      
      setBookingSuccess(true);
      console.log('Booking success set to true');
      
      // Navigate to payment page after a short delay
      setTimeout(() => {
        console.log('Navigating to payment page...');
        navigate('/payment', {
          state: {
            booking: {
              ...bookingData,
              id: bookingId
            }
          }
        });
      }, 2000);
      
    } catch (error) {
      console.error('Booking failed:', error);
      setErrors({ submit: `Failed to create booking: ${(error as Error).message || 'Unknown error'}` });
      // Explicitly stop loading by setting a timeout
      setTimeout(() => {
        setErrors({});
      }, 3000);
    }
  };
  return <div className="min-h-screen pt-24 pb-12 px-4 bg-cosmic-dark bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {['Service', 'Date & Time', 'Type', 'Details'].map((label, idx) => <span key={idx} className={`text-xs font-cinzel font-bold ${step > idx ? 'text-gold' : 'text-white/30'}`}>
                {label}
              </span>)}
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gold" initial={{
            width: 0
          }} animate={{
            width: `${step / 4 * 100}%`
          }} transition={{
            duration: 0.3
          }} />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            {/* Step 1: Service Selection */}
            {step === 1 && <motion.div key="step1" initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: -20
          }} className="space-y-6">
                <h2 className="text-2xl font-cinzel font-bold text-white mb-6">
                  Choose Your Reading
                </h2>
                <div className="grid gap-4">
                  {services.map(s => <button key={s.id} onClick={() => updateForm('service', s.id)} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${formData.service === s.id ? 'bg-gold/20 border-gold text-white' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${formData.service === s.id ? 'bg-gold text-cosmic-dark' : 'bg-white/10 text-gold'}`}>
                          {s.icon}
                        </div>
                        <div className="text-left">
                          <div className="font-bold font-cinzel">{s.title}</div>
                          <div className="text-sm opacity-70">{s.price}</div>
                        </div>
                      </div>
                      {formData.service === s.id && <Check className="text-gold" />}
                    </button>)}
                </div>
                {errors.service && (
                  <div className="flex items-center gap-2 text-red-400 text-sm mt-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.service}
                  </div>
                )}
                <div className="flex justify-end mt-8">
                  <Button onClick={nextStep} disabled={!formData.service}>
                    Next Step <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>}

            {/* Step 2: Date & Time */}
            {step === 2 && <motion.div key="step2" initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: -20
          }} className="space-y-6">
                <h2 className="text-2xl font-cinzel font-bold text-white mb-6">
                  Select Date & Time
                </h2>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gold mb-2">
                    Select Date
                  </label>
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full bg-white/5 border rounded-lg p-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none ${errors.date ? 'border-red-400' : 'border-white/20'}`} 
                    onChange={e => updateForm('date', e.target.value)} 
                    value={formData.date} 
                  />
                  {errors.date && (
                    <div className="flex items-center gap-2 text-red-400 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.date}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gold mb-2">
                    Available Slots
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {timeSlots.map(time => <button key={time} onClick={() => updateForm('time', time)} className={`py-2 px-4 rounded-lg border text-sm transition-all ${formData.time === time ? 'bg-gold text-cosmic-dark border-gold font-bold' : 'bg-white/5 border-white/20 text-white/70 hover:border-gold/50'}`}>
                        {time}
                      </button>)}
                  </div>
                  {errors.time && (
                    <div className="flex items-center gap-2 text-red-400 text-sm mt-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.time}
                    </div>
                  )}
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="secondary" onClick={prevStep}>
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button onClick={nextStep} disabled={!formData.date || !formData.time}>
                    Next Step <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>}

            {/* Step 3: Reading Type */}
            {step === 3 && <motion.div key="step3" initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: -20
          }} className="space-y-6">
                <h2 className="text-2xl font-cinzel font-bold text-white mb-6">
                  Reading Format
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {readingTypes.map(type => <button key={type.id} onClick={() => updateForm('type', type.id)} className={`p-6 rounded-xl border text-left transition-all ${formData.type === type.id ? 'bg-gold/20 border-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                      <div className={`font-bold font-cinzel mb-1 ${formData.type === type.id ? 'text-gold' : 'text-white'}`}>
                        {type.label}
                      </div>
                      <div className="text-sm text-white/60">{type.desc}</div>
                    </button>)}
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="secondary" onClick={prevStep}>
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button onClick={nextStep} disabled={!formData.type}>
                    Next Step <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>}

            {/* Step 4: Details */}
            {step === 4 && <motion.div key="step4" initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: -20
          }}>
                <h2 className="text-2xl font-cinzel font-bold text-white mb-6">
                  Your Details
                </h2>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gold mb-1">
                        Name
                      </label>
                      <input required type="text" className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:border-gold outline-none" value={formData.name} onChange={e => updateForm('name', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm text-gold mb-1">
                        Phone
                      </label>
                      <input required type="tel" className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:border-gold outline-none" value={formData.phone} onChange={e => updateForm('phone', e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gold mb-1">
                      Email
                    </label>
                    <input required type="email" className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:border-gold outline-none" value={formData.email} onChange={e => updateForm('email', e.target.value)} />
                  </div>

                  <div>
                    <label className="block text-sm text-gold mb-1">
                      Your Question / Focus Area (Optional)
                    </label>
                    <textarea rows={4} className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:border-gold outline-none resize-none" value={formData.question} onChange={e => updateForm('question', e.target.value)} placeholder="What would you like the cards to reveal?" />
                  </div>

                  <div className="flex justify-between mt-8">
                    <LoadingButton 
                    variant="secondary" 
                    onClick={prevStep}
                    loadingDelay={200}
                  >
                      <ChevronLeft className="w-4 h-4 mr-2" /> Back
                    </LoadingButton>
                    <LoadingButton 
                    onClick={handleSubmit}
                    loadingDelay={300}
                  >
                      Proceed to Payment{' '}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </LoadingButton>
                  </div>
                </form>
              </motion.div>}
          </AnimatePresence>

        {bookingSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md mx-4 text-center"
            >
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-2xl font-cinzel font-bold text-white mb-2">
                Booking Confirmed!
              </h3>
              <p className="text-white/70 mb-4">
                Your booking ID: <span className="text-gold font-mono">{bookingId}</span>
              </p>
              <p className="text-white/60 text-sm">
                Redirecting to payment page...
              </p>
              <div className="mt-6">
                <LottieAnimationLoader 
                  animationPath="/animations/Sandy Loading.json"
                  width={80}
                  height={80}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
        </div>
      </div>
    </div>;
}