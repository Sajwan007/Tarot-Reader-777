import React from 'react';
import { Calendar, TrendingUp, Users, Clock } from 'lucide-react';

const Dashboard = ({ bookings, stats }) => {
  const upcomingBookings = bookings
    .filter(b => new Date(b.booking_date) >= new Date() && b.status === 'confirmed')
    .slice(0, 5);

  const recentBookings = bookings
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <div className="bg-purple-600 bg-opacity-20 rounded-lg p-6 border border-purple-400 border-opacity-30">
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Upcoming Sessions
          </h3>
          <div className="space-y-3">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map(booking => (
                <div key={booking.id} className="bg-white bg-opacity-10 rounded p-3">
                  <p className="text-white font-medium">{booking.client_name}</p>
                  <p className="text-purple-300 text-sm">
                    {new Date(booking.booking_date).toLocaleDateString()} at {booking.booking_time}
                  </p>
                  <p className="text-purple-200 text-sm">{booking.service}</p>
                </div>
              ))
            ) : (
              <p className="text-purple-300 text-center py-4">No upcoming sessions</p>
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-pink-600 bg-opacity-20 rounded-lg p-6 border border-pink-400 border-opacity-30">
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <Clock size={20} />
            Recent Bookings
          </h3>
          <div className="space-y-3">
            {recentBookings.length > 0 ? (
              recentBookings.map(booking => (
                <div key={booking.id} className="bg-white bg-opacity-10 rounded p-3">
                  <p className="text-white font-medium">{booking.client_name}</p>
                  <p className="text-pink-300 text-sm">{booking.service}</p>
                  <p className="text-pink-200 text-sm">
                    Status: <span className="font-semibold capitalize">{booking.status}</span>
                  </p>
                </div>
              ))
            ) : (
              <p className="text-pink-300 text-center py-4">No bookings yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 bg-opacity-20 rounded-lg p-6 border border-purple-400 border-opacity-30">
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <TrendingUp size={20} />
          Quick Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{stats?.totalBookings || 0}</p>
            <p className="text-purple-300 text-sm">Total Bookings</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{stats?.confirmed || 0}</p>
            <p className="text-purple-300 text-sm">Confirmed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{stats?.pending || 0}</p>
            <p className="text-purple-300 text-sm">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">₹{stats?.revenue || 0}</p>
            <p className="text-purple-300 text-sm">Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
