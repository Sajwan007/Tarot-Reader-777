import React, { useState } from 'react';
import { bookingsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Calendar, Clock, DollarSign, User, Mail, Phone, MessageSquare, CreditCard, Loader2 } from 'lucide-react';

const ClientBooking = () => {
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [formData, setFormData] = useState({
    client_name: '',
    email: '',
    phone: '',
    booking_date: '',
    booking_time: '',
    service: 'Full Tarot Reading',
    duration: 60,
    price: 75,
    notes: ''
  });

  const services = {
    'Full Tarot Reading': { duration: 60, price: 75 },
    'Quick Reading': { duration: 30, price: 45 },
    'Relationship Reading': { duration: 45, price: 60 },
    'Career Reading': { duration: 45, price: 60 },
    'Past Life Reading': { duration: 90, price: 100 }
  };

  const handleServiceChange = (service) => {
    setFormData({
      ...formData,
      service,
      duration: services[service].duration,
      price: services[service].price
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await bookingsAPI.create(formData);
      
      if (response.data.success) {
        setQrData(response.data.data);
        setShowQR(true);
        toast.success('Booking created! Check your email for QR code.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (showQR && qrData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 p-4">
        <div className="max-w-2xl mx-auto py-12">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-8 border border-purple-400 border-opacity-30">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h2>
              <p className="text-purple-300">Complete payment to finalize your session</p>
            </div>

            <div className="bg-white rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-purple-900 mb-4 text-center">Scan QR Code to Pay</h3>
              <div className="flex justify-center mb-4">
                <img 
                  src={qrData.payment_qr_code} 
                  alt="Payment QR Code" 
                  className="max-w-xs rounded-lg shadow-lg"
                />
              </div>
              <div className="text-center text-gray-700">
                <p className="font-semibold text-lg">Amount: ₹{qrData.price}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Valid until: {new Date(qrData.qr_expires_at).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-purple-600 bg-opacity-20 rounded-lg p-6 border border-purple-400 border-opacity-30">
              <h4 className="text-white font-semibold mb-3">Booking Details:</h4>
              <div className="space-y-2 text-purple-200">
                <p><strong>Service:</strong> {qrData.service}</p>
                <p><strong>Date:</strong> {new Date(qrData.booking_date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {qrData.booking_time}</p>
                <p><strong>Duration:</strong> {qrData.duration} minutes</p>
                <p><strong>Email:</strong> {qrData.email}</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-purple-300 text-sm mb-4">
                A confirmation email with payment details has been sent to {qrData.email}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
              >
                Book Another Session
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 p-4">
      <div className="max-w-4xl mx-auto py-12">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">✨🔮✨</div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-4">
            Tarot Reader 777
          </h1>
          <p className="text-xl text-purple-300">Book Your Mystical Journey</p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-8 border border-purple-400 border-opacity-30">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-purple-300 mb-2 font-medium">
                  <User size={18} /> Full Name *
                </label>
                <input
                  type="text"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-400 border-opacity-30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-purple-300 mb-2 font-medium">
                  <Mail size={18} /> Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-400 border-opacity-30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-purple-300 mb-2 font-medium">
                  <Phone size={18} /> Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-400 border-opacity-30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-purple-300 mb-2 font-medium">
                  <CreditCard size={18} /> Reading Type *
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-400 border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {Object.keys(services).map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-purple-300 mb-2 font-medium">
                  <Calendar size={18} /> Preferred Date *
                </label>
                <input
                  type="date"
                  value={formData.booking_date}
                  onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-400 border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-purple-300 mb-2 font-medium">
                  <Clock size={18} /> Preferred Time *
                </label>
                <input
                  type="time"
                  value={formData.booking_time}
                  onChange={(e) => setFormData({ ...formData, booking_time: e.target.value })}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-400 border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-purple-300 mb-2 font-medium">
                <MessageSquare size={18} /> Special Requests (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-400 border-opacity-30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="4"
                placeholder="Any specific areas you'd like to focus on? (love, career, health, etc.)"
              ></textarea>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-600 bg-opacity-20 rounded-lg p-6 border border-purple-400 border-opacity-30">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-purple-300 text-sm">Session Duration</p>
                  <p className="text-white text-2xl font-bold">{formData.duration} minutes</p>
                </div>
                <div className="text-right">
                  <p className="text-purple-300 text-sm">Total Amount</p>
                  <p className="text-white text-3xl font-bold flex items-center gap-1">
                    <DollarSign size={28} />₹{formData.price}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Processing...
                </>
              ) : (
                <>
                  Book My Reading ✨
                </>
              )}
            </button>

            <p className="text-center text-purple-300 text-sm">
              By booking, you agree to receive a payment QR code via email
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientBooking;
