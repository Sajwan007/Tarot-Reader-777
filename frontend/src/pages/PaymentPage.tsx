import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Smartphone, AlertCircle, Copy, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { sendPaymentConfirmationEmail } from '../utils/email';
import { LoadingButton } from '../components/LoadingButton';
import { db } from '../utils/database';

// Sample UPI QR code URL - replace with actual QR code image
const SAMPLE_QR_URL = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=mysticaltarot@ybl&pn=Mystical%20Tarot&am=999&cu=INR';
export function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // UPI Payment states
  const [utr, setUtr] = useState('');
  const [payerName, setPayerName] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [paidAt, setPaidAt] = useState(new Date().toISOString().slice(0, 16));
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Sample UPI details - replace with actual values
  const upiId = 'mysticaltarot@ybl';
  const qrImageUrl = SAMPLE_QR_URL;
  
  // In a real app, we'd use this data. For now, defaulting if empty.
  const booking = location.state?.booking || {
    id: 'demo_booking_' + Date.now(),
    service: 'Love Tarot Reading',
    price: '₹999',
    date: '2023-10-24',
    time: '10:00 AM',
    name: '',
    email: '',
    phone: ''
  };

  useEffect(() => {
    // Set default paid amount to booking price
    const numericPrice = booking.price.replace(/[^\d.]/g, '');
    setPaidAmount(numericPrice);
  }, [booking.price]);

  const extractPrice = (priceString: string): number => {
    // Extract numeric value from price string (e.g., "₹999" -> 999)
    const numericValue = priceString.replace(/[^\d.]/g, '');
    return parseFloat(numericValue) || 999;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const validateUtr = (utrValue: string): boolean => {
    // UTR should be at least 12 characters (numeric)
    return utrValue.length >= 12 && /^\d+$/.test(utrValue);
  };

  const isFormValid = validateUtr(utr) && confirmed;

  const handleUpiPayment = async () => {
    console.log('Payment confirmation started');
    console.log('Backend URL: http://localhost:3001/api/payments');
    
    if (!isFormValid) {
      setError('Please enter a valid UTR and confirm the payment details.');
      return;
    }

    setError('');
    setIsProcessing(true);

    // Validate form
    if (!utr.trim()) {
      setError('Please enter UTR number');
      setIsProcessing(false);
      return;
    }

    if (!payerName.trim()) {
      setError('Please enter payer name');
      setIsProcessing(false);
      return;
    }

    // Check for duplicate UTR
    const existingPayments = JSON.parse(localStorage.getItem('upi_payments') || '[]');
    if (existingPayments.some((p: any) => p.utr === utr.trim())) {
      setError('This UTR has already been used');
      setIsProcessing(false);
      return;
    }

    const paymentData = {
      orderId: `ORDER_${booking.id}_${Date.now()}`,
      amount: parseFloat(paidAmount),
      upiId: upiId,
      utr: utr.trim(),
      payerName: payerName.trim(),
      paidAt: paidAt
    };

    console.log('Payment data to send:', paymentData);

    try {
      console.log('Sending request to backend...');
      
      // POST to /api/payments
      const response = await fetch('http://localhost:3001/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error:', errorData);
        throw new Error(errorData.message || `Payment verification failed (${response.status})`);
      }

      const result = await response.json();
      console.log('Payment verification result:', result);

      // Store payment locally for duplicate checking
      existingPayments.push({
        ...paymentData,
        id: result.id || Date.now(),
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('upi_payments', JSON.stringify(existingPayments));

      // Update booking with payment info
      if (booking.id) {
        await db.updateBooking(booking.id, {
          status: 'paid',
          payment_id: utr.trim(),
          order_id: result.orderId || `UPI_${Date.now()}`
        });

        // Create payment record
        await db.createPayment({
          booking_id: booking.id,
          razorpay_payment_id: utr.trim(),
          razorpay_order_id: result.orderId || `UPI_${Date.now()}`,
          razorpay_signature: 'UPI_PAYMENT',
          amount: extractPrice(booking.price) * 100,
          currency: 'INR',
          status: 'success'
        });
      }

      // Send payment confirmation email
      try {
        await sendPaymentConfirmationEmail({
          customerName: booking.name || 'Guest User',
          customerEmail: booking.email || 'guest@example.com',
          serviceName: booking.serviceName || booking.service,
          date: booking.date,
          time: booking.time,
          price: booking.price,
          bookingId: booking.id || 'Unknown',
          paymentId: utr.trim(),
          orderId: result.orderId || `UPI_${Date.now()}`,
          paidAt: new Date().toISOString()
        });
      } catch (emailError) {
        console.error('Payment confirmation email failed:', emailError);
      }

      setSuccess(true);
      
      // Navigate to confirmation after delay
      setTimeout(() => {
        navigate('/confirmation', {
          state: {
            booking: {
              ...booking,
              paymentId: utr.trim(),
              orderId: result.orderId || `UPI_${Date.now()}`,
              status: 'paid',
              paidAt: new Date().toISOString()
            }
          }
        });
      }, 2000);

    } catch (err: any) {
      console.error('UPI payment error:', err);
      setError(err.message || 'Payment verification failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  return <div className="min-h-screen pt-24 pb-12 px-4 bg-cosmic-dark flex items-center justify-center">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
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
            <span>₹999</span>
          </div>
        </div>

        {/* UPI Payment */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-cinzel font-bold text-white mb-6">
            UPI Payment
          </h2>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-cinzel font-bold text-white mb-2">
                Payment Verified!
              </h3>
              <p className="text-white/70">Redirecting to confirmation...</p>
            </motion.div>
          ) : (
            <>
              {/* QR Code Section */}
              <div className="bg-white/10 rounded-xl p-6 mb-6">
                <div className="flex flex-col items-center">
                  <img 
                    src={qrImageUrl} 
                    alt="UPI QR Code" 
                    className="w-48 h-48 mb-4 rounded-lg"
                  />
                  <div className="text-center">
                    <div className="text-gold font-bold text-lg mb-2">{booking.price}</div>
                    <div className="flex items-center gap-2 text-white/80 mb-2">
                      <span className="font-mono">{upiId}</span>
                      <button
                        onClick={() => copyToClipboard(upiId)}
                        className="p-1 hover:text-gold transition-colors"
                        title="Copy UPI ID"
                      >
                        {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="text-xs text-white/50">Scan QR or copy UPI ID</div>
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Payment Instructions
                </h3>
                <ol className="text-sm text-white/80 space-y-1 list-decimal list-inside">
                  <li>Scan the QR code or copy the UPI ID</li>
                  <li>Pay the exact amount: {booking.price}</li>
                  <li>Complete the payment in your UPI app</li>
                  <li>Note the 12-digit transaction reference number (UTR)</li>
                  <li>Enter the UTR below to verify your payment</li>
                </ol>
              </div>

              {/* UTR Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gold mb-2">
                    Transaction Reference (UTR) *
                  </label>
                  <input
                    type="text"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    placeholder="Enter 12-digit UTR number"
                    className={`w-full bg-white/5 border rounded-lg p-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none ${
                      utr && !validateUtr(utr) ? 'border-red-400' : 'border-white/20'
                    }`}
                    maxLength={20}
                  />
                  {utr && !validateUtr(utr) && (
                    <div className="flex items-center gap-2 text-red-400 text-xs mt-1">
                      <AlertCircle className="w-3 h-3" />
                      UTR must be at least 12 digits
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gold mb-2">
                    Payer Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    placeholder="Your name as appears in UPI app"
                    className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gold mb-2">
                    Paid Amount
                  </label>
                  <input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gold mb-2">
                    Payment Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={paidAt}
                    onChange={(e) => setPaidAt(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                  />
                </div>

                {/* Confirmation Checkbox */}
                <label className="flex items-start gap-3 p-3 bg-white/5 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-1 text-gold focus:ring-gold rounded"
                  />
                  <span className="text-sm text-white/80">
                    I confirm that I have completed the UPI payment of {booking.price} and the UTR provided is correct.
                  </span>
                </label>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm p-3 bg-red-400/10 rounded-lg border border-red-400/20">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-white/40 mb-6 justify-center">
                <ShieldCheck className="w-4 h-4" />
                Payments are secure and encrypted
              </div>

              <LoadingButton 
                fullWidth 
                onClick={handleUpiPayment} 
                size="lg"
                loadingDelay={400}
                disabled={!isFormValid || isProcessing}
              >
                {isProcessing ? (
                  <>
                    Verifying Payment...
                  </>
                ) : (
                  <>
                    Verify UPI Payment
                  </>
                )}
              </LoadingButton>
            </>
          )}
        </div>
      </motion.div>
    </div>;
}