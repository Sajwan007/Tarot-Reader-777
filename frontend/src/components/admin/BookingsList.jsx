import React, { useState } from 'react';
import { bookingsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Search, Eye, Trash2, CheckCircle, XCircle, Edit } from 'lucide-react';

const BookingsList = ({ bookings, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    const colors = {
      'confirmed': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-blue-100 text-blue-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      'paid': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'refunded': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await bookingsAPI.update(id, { status });
      toast.success('Status updated successfully');
      onUpdate();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    
    try {
      await bookingsAPI.delete(id);
      toast.success('Booking deleted successfully');
      onUpdate();
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to delete booking');
    }
  };

  const viewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  return (
    <div>
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white bg-opacity-10 border border-purple-400 border-opacity-30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-white bg-opacity-10 border border-purple-400 border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-purple-400 border-opacity-30">
              <th className="text-left py-3 px-4 text-purple-300 font-semibold">Client</th>
              <th className="text-left py-3 px-4 text-purple-300 font-semibold">Date & Time</th>
              <th className="text-left py-3 px-4 text-purple-300 font-semibold">Service</th>
              <th className="text-left py-3 px-4 text-purple-300 font-semibold">Price</th>
              <th className="text-left py-3 px-4 text-purple-300 font-semibold">Status</th>
              <th className="text-left py-3 px-4 text-purple-300 font-semibold">Payment</th>
              <th className="text-left py-3 px-4 text-purple-300 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="border-b border-purple-400 border-opacity-20 hover:bg-white hover:bg-opacity-5">
                <td className="py-4 px-4">
                  <div className="text-white font-medium">{booking.client_name}</div>
                  <div className="text-purple-300 text-sm">{booking.email}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-white">{new Date(booking.booking_date).toLocaleDateString()}</div>
                  <div className="text-purple-300 text-sm">{booking.booking_time}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-white">{booking.service}</div>
                  <div className="text-purple-300 text-sm">{booking.duration} min</div>
                </td>
                <td className="py-4 px-4 text-white font-semibold">₹{booking.price}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(booking.payment_status)}`}>
                    {booking.payment_status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => viewBooking(booking)}
                      className="p-2 text-blue-400 hover:bg-blue-400 hover:bg-opacity-20 rounded-lg transition"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                        className="p-2 text-green-400 hover:bg-green-400 hover:bg-opacity-20 rounded-lg transition"
                        title="Confirm"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="p-2 text-red-400 hover:bg-red-400 hover:bg-opacity-20 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12 text-purple-300">
            No bookings found
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl p-6 max-w-2xl w-full border border-purple-400 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-white">Booking Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-purple-300 hover:text-white"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-purple-300 text-sm">Client Name</p>
                <p className="text-white font-semibold">{selectedBooking.client_name}</p>
              </div>
              <div>
                <p className="text-purple-300 text-sm">Email</p>
                <p className="text-white">{selectedBooking.email}</p>
              </div>
              <div>
                <p className="text-purple-300 text-sm">Phone</p>
                <p className="text-white">{selectedBooking.phone}</p>
              </div>
              <div>
                <p className="text-purple-300 text-sm">Service</p>
                <p className="text-white font-semibold">{selectedBooking.service}</p>
              </div>
              <div>
                <p className="text-purple-300 text-sm">Date</p>
                <p className="text-white">{new Date(selectedBooking.booking_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-purple-300 text-sm">Time</p>
                <p className="text-white">{selectedBooking.booking_time}</p>
              </div>
              <div>
                <p className="text-purple-300 text-sm">Duration</p>
                <p className="text-white">{selectedBooking.duration} minutes</p>
              </div>
              <div>
                <p className="text-purple-300 text-sm">Price</p>
                <p className="text-white font-semibold text-xl">₹{selectedBooking.price}</p>
              </div>
              <div>
                <p className="text-purple-300 text-sm mb-2">Booking Status</p>
                <select
                  value={selectedBooking.status}
                  onChange={(e) => {
                    handleUpdateStatus(selectedBooking.id, e.target.value);
                    setSelectedBooking({ ...selectedBooking, status: e.target.value });
                  }}
                  className="w-full px-4 py-2 bg-white bg-opacity-10 border border-purple-400 border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <p className="text-purple-300 text-sm">Payment Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(selectedBooking.payment_status)}`}>
                  {selectedBooking.payment_status}
                </span>
              </div>
              {selectedBooking.payment_transaction_id && (
                <div className="md:col-span-2">
                  <p className="text-purple-300 text-sm">Transaction ID</p>
                  <p className="text-white font-mono">{selectedBooking.payment_transaction_id}</p>
                </div>
              )}
            </div>

            {selectedBooking.notes && (
              <div className="mt-4">
                <p className="text-purple-300 text-sm mb-2">Notes</p>
                <p className="text-white bg-white bg-opacity-10 p-4 rounded-lg">{selectedBooking.notes}</p>
              </div>
            )}

            {selectedBooking.payment_qr_code && (
              <div className="mt-4">
                <p className="text-purple-300 text-sm mb-2">Payment QR Code</p>
                <img 
                  src={selectedBooking.payment_qr_code} 
                  alt="Payment QR" 
                  className="max-w-xs mx-auto bg-white p-4 rounded-lg"
                />
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
              >
                Close
              </button>
              <button 
                onClick={() => handleDelete(selectedBooking.id)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsList;
