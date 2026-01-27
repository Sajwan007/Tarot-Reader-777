import { useState, useEffect } from 'react';
import { api } from '../services/api';

export const useBookings = (filters = {}) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/bookings', { params: filters });
      setBookings(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/bookings', bookingData);
      setBookings(prev => [response.data.data, ...prev]);
      return { success: true, data: response.data.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create booking';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (id, updateData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(`/bookings/${id}`, updateData);
      setBookings(prev => 
        prev.map(booking => 
          booking.id === id ? response.data.data : booking
        )
      );
      return { success: true, data: response.data.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update booking';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/bookings/${id}`);
      setBookings(prev => prev.filter(booking => booking.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to delete booking';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [JSON.stringify(filters)]);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    updateBooking,
    deleteBooking
  };
};
