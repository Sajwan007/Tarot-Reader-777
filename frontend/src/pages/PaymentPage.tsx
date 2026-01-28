import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { paymentsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { ShieldCheck, CreditCard, Smartphone, QrCode, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
export function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [booking, setBooking] = useState(location.state?.booking || {
    id: null,
    service: 'Love Tarot Reading',
    price: 999,
    date: '2023-10-24',
    time: '10:00 AM',
    payment_qr_code: null
  });

  const handleQRPayment = async () => {
    if (!booking.id) {
      toast.error('Booking information not found');
      return;
    }

    setLoading(true);
    try {
      // Generate QR code for payment
      const response = await paymentsAPI.generateQR(booking.id);
      
      if (response.data.qrCode) {
        // Update booking with QR code data
        setBooking(prev => ({
          ...prev,
          payment_qr_code: response.data.qrCode
        }));
        setShowQR(true);
        toast.success('QR code generated successfully!');
      }
    } catch (error) {
      toast.error('Failed to generate QR code');
      console.error('QR generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      navigate('/confirmation', {
        state: {
          booking
        }
      });
    }, 1500);
  };
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-cosmic-dark flex items-center justify-center">
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Order Summary */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 h-fit">
          <h2 className="text-2xl font-cinzel font-bold text-white mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between py-3 border-b border-white/10">
              <span className="text-white/60">Service</span>
              <span className="text-white font-medium capitalize">
                {booking.service || 'Tarot Reading'}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-white/10">
              <span className="text-white/60">Date</span>
              <span className="text-white font-medium">{booking.date}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-white/10">
              <span className="text-white/60">Time</span>
              <span className="text-white font-medium">{booking.time}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-white/10">
              <span className="text-white/60">Duration</span>
              <span className="text-white font-medium">45 Minutes</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-xl font-bold font-cinzel text-gold">
            <span>Total</span>
            <span>₹{booking.price}</span>
          </div>
        </div>

        {/* QR Code Display */}
        {showQR && booking.payment_qr_code && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-6"
          >
            <h3 className="text-xl font-cinzel font-bold text-white mb-4 text-center">
              Scan QR Code to Pay
            </h3>
            <div className="flex justify-center mb-4">
              <img 
                src={booking.payment_qr_code} 
                alt="Payment QR Code" 
                className="bg-white p-4 rounded-xl max-w-xs"
              />
            </div>
            <p className="text-center text-white/60 text-sm">
              Scan with any UPI app to complete payment
            </p>
          </motion.div>
        )}

        {/* Payment Methods */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-cinzel font-bold text-white mb-6">
            Payment Method
          </h2>

          <div className="space-y-4 mb-8">
            <label className="flex items-center gap-4 p-4 rounded-xl border border-gold/50 bg-gold/10 cursor-pointer transition-all">
              <input
                type="radio"
                name="payment"
                defaultChecked
                className="text-gold focus:ring-gold" />

              <QrCode className="text-gold" />
              <div className="flex-1">
                <div className="font-bold text-white">UPI / QR Code</div>
                <div className="text-xs text-white/50">
                  Scan QR with any UPI app
                </div>
              </div>
            </label>

            <label className="flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:bg-white/5 cursor-pointer transition-all">
              <input
                type="radio"
                name="payment"
                className="text-gold focus:ring-gold" />

              <CreditCard className="text-white/70" />
              <div className="flex-1">
                <div className="font-bold text-white">Credit / Debit Card</div>
                <div className="text-xs text-white/50">
                  Secure Stripe Checkout
                </div>
              </div>
            </label>

            <label className="flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:bg-white/5 cursor-pointer transition-all">
              <input
                type="radio"
                name="payment"
                className="text-gold focus:ring-gold" />

              <Smartphone className="text-white/70" />
              <div className="flex-1">
                <div className="font-bold text-white">Net Banking</div>
                <div className="text-xs text-white/50">All major banks</div>
              </div>
            </label>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/40 mb-6 justify-center">
            <ShieldCheck className="w-4 h-4" />
            Payments are secure and encrypted
          </div>

          <Button fullWidth onClick={handleQRPayment} disabled={loading} size="lg">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Generating QR Code...
              </>
            ) : (
              <>
                Generate QR Code for Payment
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>);

}