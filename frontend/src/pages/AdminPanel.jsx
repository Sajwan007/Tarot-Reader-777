import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../components/admin/Dashboard';
import BookingsList from '../components/admin/BookingsList';
import Calendar from '../components/admin/Calendar';
import ClientsList from '../components/admin/ClientsList';
import StatsCards from '../components/admin/StatsCards';

const AdminPanel = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <div className="p-4">
            <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
          </div>
          <nav className="mt-4">
            <a href="/admin/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">
              Dashboard
            </a>
            <a href="/admin/bookings" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">
              Bookings
            </a>
            <a href="/admin/calendar" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">
              Calendar
            </a>
            <a href="/admin/clients" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">
              Clients
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bookings" element={<BookingsList />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/clients" element={<ClientsList />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
