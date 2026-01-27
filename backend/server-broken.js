const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Health Check - Move this before routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    database: 'Supabase'
  });
});

// Routes (wrapped in try-catch to prevent crashes)
try {
  const bookingRoutes = require('./routes/bookings-supabase');
  const clientRoutes = require('./routes/clients-supabase');
  const authRoutes = require('./routes/auth-supabase');
  const errorHandler = require('./middleware/errorHandler-supabase');

  app.use('/api/auth', authRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/clients', clientRoutes);
  app.use(errorHandler);
} catch (error) {
  console.error('Error loading routes:', error.message);
  // Continue without routes if they fail
}

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🗄️  Using Supabase database`);
});

module.exports = app;
