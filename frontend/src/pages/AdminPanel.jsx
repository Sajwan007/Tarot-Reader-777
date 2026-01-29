import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingsAPI, clientsAPI } from '../services/api';
import toast from 'react-hot-toast';
import Dashboard from '../components/admin/Dashboard';
import BookingsList from '../components/admin/BookingsList';
import ClientsList from '../components/admin/ClientsList';
import PaymentVerification from '../components/admin/PaymentVerification';
import ContactSubmissions from '../components/admin/ContactSubmissions';
import { Calendar, Users, DollarSign, Clock, LogOut, Menu, X, MessageCircle } from 'lucide-react';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, clientsRes, statsRes] = await Promise.all([
        bookingsAPI.getAll(),
        clientsAPI.getAll(),
        bookingsAPI.getStats()
      ]);

      setBookings(bookingsRes.data.data || []);
      setClients(clientsRes.data.data || []);
      setStats(statsRes.data.data || {});
    } catch (error) {
      toast.error('Failed to load data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Calendar },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'payments', label: 'Verify Payments', icon: DollarSign },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'contact', label: 'Contact Messages', icon: MessageCircle },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800">
      {/* Header */}
      <div className="bg-black bg-opacity-30 backdrop-blur-sm border-b border-purple-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                ✨ Tarot Reader 777
              </h1>
              <p className="text-purple-300 text-sm mt-1">Admin Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-white"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <button
                onClick={handleLogout}
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-purple-400 border-opacity-30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm">Total Bookings</p>
                  <p className="text-white text-3xl font-bold mt-1">{stats.totalBookings || 0}</p>
                </div>
                <Calendar className="text-purple-400" size={40} />
              </div>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-green-400 border-opacity-30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm">Confirmed</p>
                  <p className="text-white text-3xl font-bold mt-1">{stats.confirmed || 0}</p>
                </div>
                <Clock className="text-green-400" size={40} />
              </div>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-yellow-400 border-opacity-30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-300 text-sm">Pending</p>
                  <p className="text-white text-3xl font-bold mt-1">{stats.pending || 0}</p>
                </div>
                <Clock className="text-yellow-400" size={40} />
              </div>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-pink-400 border-opacity-30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-300 text-sm">Revenue</p>
                  <p className="text-white text-3xl font-bold mt-1">₹{stats.revenue || 0}</p>
                </div>
                <DollarSign className="text-pink-400" size={40} />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl border border-purple-400 border-opacity-30 overflow-hidden">
          <div className="flex border-b border-purple-400 border-opacity-30 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-semibold transition flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-purple-600 bg-opacity-50 text-white border-b-2 border-purple-400'
                      : 'text-purple-300 hover:bg-purple-600 hover:bg-opacity-20'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {activeTab === 'dashboard' && <Dashboard bookings={bookings} stats={stats} />}
            {activeTab === 'bookings' && <BookingsList bookings={bookings} onUpdate={loadData} />}
            {activeTab === 'payments' && <PaymentVerification bookings={bookings} onUpdate={loadData} />}
            {activeTab === 'clients' && <ClientsList clients={clients} />}
            {activeTab === 'contact' && <ContactSubmissions />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
