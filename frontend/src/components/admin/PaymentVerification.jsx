import React, { useState } from 'react';
import { paymentsAPI, bookingsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Camera, Upload } from 'lucide-react';

const PaymentVerification = ({ bookings, onUpdate }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [verifying, setVerifying] = useState(false);

  const pendingPayments = bookings.filter(
    b => b.payment_status === 'pending' && b.status !== 'cancelled'
  );

  const handleVerifyPayment = async () => {
    if (!transactionId.trim()) {
      toast.error('Please enter transaction ID');
      return;
    }

    setVerifying(true);
    try {
      await paymentsAPI.verify({
        bookingId: selectedBooking.id,
        transactionId,
        screenshot: null
      });

      toast.success('Payment verified successfully!');
      setShowModal(false);
      setTransactionId('');
      onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleQRScan = (data) => {
    setTransactionId(data);
    setShowScanner(false);
    toast.success('QR Code scanned successfully');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Pending Payments</h2>
      
      {pendingPayments.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="mx-auto text-green-400 mb-4" size={64} />
          <p className="text-white text-xl font-semibold">All Caught Up!</p>
          <p className="text-purple-300 mt-2">No pending payments to verify</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingPayments.map((booking) => (
            <div 
              key={booking.id}
              className="bg-white bg-opacity-10 border border-purple-400 border-opacity-30 rounded-xl p-6 hover:bg-opacity-20 transition cursor-pointer"
              onClick={() => {
                setSelectedBooking(booking);
                setShowModal(true);
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">{booking.client_name}</h3>
                  <p className="text-purple-300 text-sm">{booking.email}</p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                  Pending
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-300">Service:</span>
                  <span className="text-white font-medium">{booking.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Date:</span>
                  <span className="text-white">{new Date(booking.booking_date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Amount:</span>
                  <span className="text-white font-bold text-lg">₹{booking.price}</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBooking(booking);
                  setShowModal(true);
                }}
                className="w-full mt-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-semibold"
              >
                Verify Payment
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Verification Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl p-6 max-w-2xl w-full border border-purple-400">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-white">Verify Payment</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setTransactionId('');
                }}
                className="text-purple-300 hover:text-white"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="bg-white bg-opacity-10 rounded-lg p-6 mb-6">
              <h4 className="text-white font-semibold mb-4">Booking Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-purple-300">Client</p>
                  <p className="text-white font-semibold">{selectedBooking.client_name}</p>
                </div>
                <div>
                  <p className="text-purple-300">Service</p>
                  <p className="text-white">{selectedBooking.service}</p>
                </div>
                <div>
                  <p className="text-purple-300">Date</p>
                  <p className="text-white">{new Date(selectedBooking.booking_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-purple-300">Amount</p>
                  <p className="text-white font-bold text-xl">₹{selectedBooking.price}</p>
                </div>
              </div>
            </div>

            {selectedBooking.payment_qr_code && (
              <div className="bg-white rounded-lg p-4 mb-6">
                <p className="text-gray-700 font-semibold mb-2 text-center">Expected Payment QR</p>
                <img 
                  src={selectedBooking.payment_qr_code} 
                  alt="Payment QR" 
                  className="max-w-xs mx-auto"
                />
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-purple-300 mb-2 font-medium">Transaction ID / Reference Number</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-400 border-opacity-30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter transaction ID from payment screenshot"
                />
              </div>

              <button
                onClick={() => setShowScanner(true)}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-semibold flex items-center justify-center gap-2"
              >
                <Camera size={20} />
                Scan Payment QR Code
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setTransactionId('');
                  }}
                  className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyPayment}
                  disabled={verifying || !transactionId.trim()}
                  className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {verifying ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Verify & Confirm
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentVerification;
