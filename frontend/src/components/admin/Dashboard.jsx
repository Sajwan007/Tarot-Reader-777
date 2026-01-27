import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, DollarSign, Search, Filter, Download, Plus, Edit2, Trash2, CheckCircle, XCircle, Eye, LogOut, Mail, Phone, User, CreditCard, Save, X } from 'lucide-react';

const TarotBookingSystem = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('bookings');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showNewBookingForm, setShowNewBookingForm] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [currentView, setCurrentView] = useState('month');

  // Initialize bookings from storage
  const [bookings, setBookings] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from storage on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const bookingsData = await window.storage.get('tarot_bookings');
      const clientsData = await window.storage.get('tarot_clients');
      
      if (bookingsData) {
        setBookings(JSON.parse(bookingsData.value));
      } else {
        // Initialize with sample data
        const sampleBookings = [
          {
            id: Date.now() + 1,
            clientName: 'Sarah Johnson',
            email: 'sarah.j@email.com',
            phone: '+1 234-567-8900',
            date: '2026-01-28',
            time: '10:00',
            service: 'Full Tarot Reading',
            duration: '60',
            price: 75,
            status: 'confirmed',
            notes: 'First time client, interested in career guidance',
            createdAt: new Date().toISOString()
          },
          {
            id: Date.now() + 2,
            clientName: 'Michael Chen',
            email: 'mchen@email.com',
            phone: '+1 234-567-8901',
            date: '2026-01-28',
            time: '14:00',
            service: 'Quick Reading',
            duration: '30',
            price: 45,
            status: 'pending',
            notes: 'Returning client',
            createdAt: new Date().toISOString()
          }
        ];
        setBookings(sampleBookings);
        await window.storage.set('tarot_bookings', JSON.stringify(sampleBookings));
      }

      if (clientsData) {
        setClients(JSON.parse(clientsData.value));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setBookings([]);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const saveBookings = async (updatedBookings) => {
    try {
      await window.storage.set('tarot_bookings', JSON.stringify(updatedBookings));
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Error saving bookings:', error);
      alert('Failed to save bookings. Please try again.');
    }
  };

  const [newBooking, setNewBooking] = useState({
    clientName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    service: 'Full Tarot Reading',
    duration: '60',
    price: 75,
    status: 'pending',
    notes: ''
  });

  // Calculate stats
  const stats = {
    totalBookings: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    revenue: bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.price, 0)
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple authentication (in production, use proper auth)
    if (loginEmail === 'admin@tarot777.com' && loginPassword === 'admin123') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials. Use admin@tarot777.com / admin123');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginEmail('');
    setLoginPassword('');
  };

  const updateBookingStatus = async (id, newStatus) => {
    const updatedBookings = bookings.map(b => 
      b.id === id ? { ...b, status: newStatus } : b
    );
    await saveBookings(updatedBookings);
  };

  const deleteBooking = async (id) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      const updatedBookings = bookings.filter(b => b.id !== id);
      await saveBookings(updatedBookings);
      setSelectedBooking(null);
    }
  };

  const handleNewBookingSubmit = async (e) => {
    e.preventDefault();
    const booking = {
      ...newBooking,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    const updatedBookings = [...bookings, booking];
    await saveBookings(updatedBookings);
    
    // Reset form
    setNewBooking({
      clientName: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      service: 'Full Tarot Reading',
      duration: '60',
      price: 75,
      status: 'pending',
      notes: ''
    });
    setShowNewBookingForm(false);
  };

  const handleServiceChange = (service) => {
    const serviceDetails = {
      'Full Tarot Reading': { duration: '60', price: 75 },
      'Quick Reading': { duration: '30', price: 45 },
      'Relationship Reading': { duration: '45', price: 60 },
      'Career Reading': { duration: '45', price: 60 },
      'Past Life Reading': { duration: '90', price: 100 }
    };
    
    setNewBooking({
      ...newBooking,
      service,
      duration: serviceDetails[service].duration,
      price: serviceDetails[service].price
    });
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Client Name', 'Email', 'Phone', 'Date', 'Time', 'Service', 'Duration', 'Price', 'Status', 'Notes'];
    const rows = bookings.map(b => [
      b.id, b.clientName, b.email, b.phone, b.date, b.time, b.service, b.duration, b.price, b.status, b.notes
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tarot_bookings_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Get unique clients
  const uniqueClients = Array.from(new Map(
    bookings.map(b => [b.email, { name: b.clientName, email: b.email, phone: b.phone }])
  ).values());

  // Calendar helper functions
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const getBookingsForDate = (date) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return bookings.filter(b => b.date === dateStr);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border border-purple-400 border-opacity-20"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayBookings = getBookingsForDate(day);
      const isToday = day === new Date().getDate() && 
                     currentMonth === new Date().getMonth() && 
                     currentYear === new Date().getFullYear();
      
      days.push(
        <div key={day} className={`p-2 border border-purple-400 border-opacity-20 min-h-24 ${isToday ? 'bg-purple-600 bg-opacity-30' : ''}`}>
          <div className="font-semibold text-white mb-1">{day}</div>
          {dayBookings.map(booking => (
            <div key={booking.id} className={`text-xs p-1 mb-1 rounded ${getStatusColor(booking.status)} cursor-pointer`}
                 onClick={() => setSelectedBooking(booking)}>
              {booking.time} - {booking.clientName}
            </div>
          ))}
        </div>
      );
    }

    return days;
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 flex items-center justify-center p-4">
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-8 max-w-md w-full border border-purple-400 border-opacity-30">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-2">
              ✨ Tarot Reader 777
            </h1>
            <p className="text-purple-300">Admin Portal</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-purple-300 mb-2">Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-400 border-opacity-30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="admin@tarot777.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-purple-300 mb-2">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-400 border-opacity-30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition font-semibold"
            >
              Sign In
            </button>
            
            <p className="text-center text-purple-300 text-sm mt-4">
              Demo credentials: admin@tarot777.com / admin123
            </p>
          </form>
        </div>
      </div>
    );
  }

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
            <div className="flex gap-3">
              <button 
                onClick={exportToCSV}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex items-center gap-2">
                <Download size={18} />
                Export
              </button>
              <button 
                onClick={() => setShowNewBookingForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition flex items-center gap-2 font-semibold">
                <Plus size={18} />
                New Booking
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition flex items-center gap-2">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-purple-400 border-opacity-30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Total Bookings</p>
                <p className="text-white text-3xl font-bold mt-1">{stats.totalBookings}</p>
              </div>
              <Calendar className="text-purple-400" size={40} />
            </div>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-green-400 border-opacity-30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm">Confirmed</p>
                <p className="text-white text-3xl font-bold mt-1">{stats.confirmed}</p>
              </div>
              <CheckCircle className="text-green-400" size={40} />
            </div>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-yellow-400 border-opacity-30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm">Pending</p>
                <p className="text-white text-3xl font-bold mt-1">{stats.pending}</p>
              </div>
              <Clock className="text-yellow-400" size={40} />
            </div>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-pink-400 border-opacity-30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-300 text-sm">Revenue</p>
                <p className="text-white text-3xl font-bold mt-1">${stats.revenue}</p>
              </div>
              <DollarSign className="text-pink-400" size={40} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl border border-purple-400 border-opacity-30 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-purple-400 border-opacity-30">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'bookings'
                  ? 'bg-purple-600 bg-opacity-50 text-white border-b-2 border-purple-400'
                  : 'text-purple-300 hover:bg-purple-600 hover:bg-opacity-20'
              }`}
            >
              Bookings
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'calendar'
                  ? 'bg-purple-600 bg-opacity-50 text-white border-b-2 border-purple-400'
                  : 'text-purple-300 hover:bg-purple-600 hover:bg-opacity-20'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'clients'
                  ? 'bg-purple-600 bg-opacity-50 text-white border-b-2 border-purple-400'
                  : 'text-purple-300 hover:bg-purple-600 hover:bg-opacity-20'
              }`}
            >
              Clients
            </button>
          </div>

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="p-6">
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

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-purple-400 border-opacity-30">
                      <th className="text-left py-3 px-4 text-purple-300 font-semibold">Client</th>
                      <th className="text-left py-3 px-4 text-purple-300 font-semibold">Date & Time</th>
                      <th className="text-left py-3 px-4 text-purple-300 font-semibold">Service</th>
                      <th className="text-left py-3 px-4 text-purple-300 font-semibold">Price</th>
                      <th className="text-left py-3 px-4 text-purple-300 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-purple-300 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-purple-400 border-opacity-20 hover:bg-white hover:bg-opacity-5">
                        <td className="py-4 px-4">
                          <div className="text-white font-medium">{booking.clientName}</div>
                          <div className="text-purple-300 text-sm">{booking.email}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-white">{booking.date}</div>
                          <div className="text-purple-300 text-sm">{booking.time}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-white">{booking.service}</div>
                          <div className="text-purple-300 text-sm">{booking.duration} min</div>
                        </td>
                        <td className="py-4 px-4 text-white font-semibold">${booking.price}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedBooking(booking)}
                              className="p-2 text-blue-400 hover:bg-blue-400 hover:bg-opacity-20 rounded-lg transition"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            {booking.status === 'pending' && (
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                className="p-2 text-green-400 hover:bg-green-400 hover:bg-opacity-20 rounded-lg transition"
                                title="Confirm"
                              >
                                <CheckCircle size={18} />
                              </button>
                            )}
                            <button
                              onClick={() => deleteBooking(booking.id)}
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
              </div>
            </div>
          )}

          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {monthNames[currentMonth]} {currentYear}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (currentMonth === 0) {
                        setCurrentMonth(11);
                        setCurrentYear(currentYear - 1);
                      } else {
                        setCurrentMonth(currentMonth - 1);
                      }
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => {
                      setCurrentMonth(new Date().getMonth());
                      setCurrentYear(new Date().getFullYear());
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => {
                      if (currentMonth === 11) {
                        setCurrentMonth(0);
                        setCurrentYear(currentYear + 1);
                      } else {
                        setCurrentMonth(currentMonth + 1);
                      }
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-purple-300 font-semibold py-2">
                    {day}
                  </div>
                ))}
                {renderCalendar()}
              </div>
            </div>
          )}

          {/* Clients Tab */}
          {activeTab === 'clients' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Client Directory</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uniqueClients.map((client, index) => {
                  const clientBookings = bookings.filter(b => b.email === client.email);
                  return (
                    <div key={index} className="bg-white bg-opacity-10 border border-purple-400 border-opacity-30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-purple-600 rounded-full p-3">
                          <User className="text-white" size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{client.name}</h3>
                          <p className="text-purple-300 text-sm flex items-center gap-1 mt-1">
                            <Mail size={14} /> {client.email}
                          </p>
                          <p className="text-purple-300 text-sm flex items-center gap-1 mt-1">
                            <Phone size={14} /> {client.phone}
                          </p>
                          <p className="text-purple-200 text-sm mt-2">
                            {clientBookings.length} booking{clientBookings.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Booking Modal */}
      {showNewBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl p-6 max-w-2xl w-full border border-purple-400 my-8">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-white">New Booking</h3>
              <button
                onClick={() => setShowNewBookingForm(false)}
                className="text-purple-300 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleNewBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 mb-2">Client Name *</label>
                  <input
                    type="text"
                    value={newBooking.clientName}
                    onChange={(e) => setNewBooking({...newBooking, clientName: e.target.value})}
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-400 border-opacity-30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter client name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-purple-300 mb-2">Email *</label>
                  <input
                    type="email"
                    value={newBooking.email}
                    onChange={(e) => setNewBooking({...newBooking, email: e.target.value})}
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-400 border-opacity-30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="client@email.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-purple-300 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={newBooking.phone}
                    onChange={(e) => setNewBooking({...newBooking, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-400 border-opacity-30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="+1 234-567-8900"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-purple-300 mb-2">Service *</label>
                  <select
                    value={newBooking.service}
                    onChange={(e) => handleServiceChange(e.target.value)}
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-400 border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Full Tarot Reading">Full Tarot Reading</option>
                    <option value="Quick Reading">Quick Reading</option>
                    <option value="Relationship Reading">Relationship Reading</option>
                    <option value="Career Reading">Career Reading</option>
                    <option value="Past Life Reading">Past Life Reading</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-purple-300 mb-2">Date *</label>
                  <input
                    type="date"
                    value={newBooking.date}
                    onChange={(e) => setNewBooking({...newBooking, date: e.target.value})}
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-400 border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-purple-300 mb-2">Time *</label>
                  <select
                    value={newBooking.time}
                    onChange={(e) => setNewBooking({...newBooking, time: e.target.value})}
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-400 border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select time</option>
                    {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'].map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-purple-300 mb-2">Notes</label>
                <textarea
                  value={newBooking.notes}
                  onChange={(e) => setNewBooking({...newBooking, notes: e.target.value})}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-400 border-opacity-30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="Additional notes about the booking..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewBookingForm(false)}
                  className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition font-semibold"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl p-6 max-w-md w-full border border-purple-400">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">Booking Details</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-purple-300 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-purple-300 text-sm">Client</p>
                <p className="text-white font-medium">{selectedBooking.clientName}</p>
                <p className="text-purple-300 text-sm">{selectedBooking.email}</p>
                <p className="text-purple-300 text-sm">{selectedBooking.phone}</p>
              </div>
              
              <div>
                <p className="text-purple-300 text-sm">Service</p>
                <p className="text-white font-medium">{selectedBooking.service}</p>
                <p className="text-purple-300 text-sm">{selectedBooking.duration} minutes</p>
              </div>
              
              <div>
                <p className="text-purple-300 text-sm">Date & Time</p>
                <p className="text-white font-medium">{selectedBooking.date} at {selectedBooking.time}</p>
              </div>
              
              <div>
                <p className="text-purple-300 text-sm">Price</p>
                <p className="text-white font-medium">${selectedBooking.price}</p>
              </div>
              
              <div>
                <p className="text-purple-300 text-sm">Status</p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </span>
              </div>
              
              {selectedBooking.notes && (
                <div>
                  <p className="text-purple-300 text-sm">Notes</p>
                  <p className="text-white">{selectedBooking.notes}</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              {selectedBooking.status === 'pending' && (
                <button
                  onClick={() => {
                    updateBookingStatus(selectedBooking.id, 'confirmed');
                    setSelectedBooking(null);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                >
                  Confirm Booking
                </button>
              )}
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TarotBookingSystem;
