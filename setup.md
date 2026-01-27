#!/bin/bash

# ============================================
# GitHub Deployment Guide for Tarot Reader 777
# Repository: Sajwan007/Tarot-Reader-777
# ============================================

# STEP 1: Clone your existing repository
# ============================================
git clone https://github.com/Sajwan007/Tarot-Reader-777.git
cd Tarot-Reader-777

# STEP 2: Create the project structure
# ============================================

# Create backend directory structure
mkdir -p backend/{config,controllers,middleware,models,routes,utils}

# Create frontend directory structure
mkdir -p frontend/src/{components/{admin,common,forms},context,hooks,pages,services,utils}
mkdir -p frontend/public

# Create database directory
mkdir -p database

# STEP 3: Create Backend Files
# ============================================

# backend/package.json
cat > backend/package.json << 'EOF'
{
  "name": "tarot-reader-backend",
  "version": "1.0.0",
  "description": "Backend for Tarot Reader 777 booking system",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.6.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "nodemailer": "^6.9.7",
    "express-validator": "^7.0.1",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.7.0"
  }
}
EOF

# backend/.env.example
cat > backend/.env.example << 'EOF'
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/tarot-reader

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Admin Credentials
ADMIN_EMAIL=admin@tarot777.com
ADMIN_PASSWORD=admin123

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Tarot Reader 777 <noreply@tarot777.com>

# Frontend URL
FRONTEND_URL=http://localhost:3000
EOF

# backend/server.js
cat > backend/server.js << 'EOF'
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const bookingRoutes = require('./routes/bookings');
const clientRoutes = require('./routes/clients');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/clients', clientRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
EOF

# backend/models/Booking.js
cat > backend/models/Booking.js << 'EOF'
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  time: {
    type: String,
    required: [true, 'Booking time is required']
  },
  service: {
    type: String,
    required: [true, 'Service type is required'],
    enum: [
      'Full Tarot Reading',
      'Quick Reading',
      'Relationship Reading',
      'Career Reading',
      'Past Life Reading'
    ]
  },
  duration: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  reminderSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

bookingSchema.index({ date: 1, time: 1 });
bookingSchema.index({ email: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
EOF

# backend/models/Client.js
cat > backend/models/Client.js << 'EOF'
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  lastBooking: {
    type: Date
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Client', clientSchema);
EOF

# backend/models/Admin.js
cat > backend/models/Admin.js << 'EOF'
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'super-admin'],
    default: 'admin'
  }
}, {
  timestamps: true
});

adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
EOF

# backend/controllers/bookingController.js
cat > backend/controllers/bookingController.js << 'EOF'
const Booking = require('../models/Booking');
const Client = require('../models/Client');
const { sendEmail } = require('../utils/emailService');

exports.getAllBookings = async (req, res) => {
  try {
    const { status, date, search } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (date) {
      query.date = new Date(date);
    }

    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const bookings = await Booking.find(query).sort({ date: -1, time: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    await Client.findOneAndUpdate(
      { email: booking.email },
      {
        name: booking.clientName,
        phone: booking.phone,
        $inc: { totalBookings: 1 },
        lastBooking: booking.date
      },
      { upsert: true, new: true }
    );

    await sendEmail({
      to: booking.email,
      subject: 'Booking Confirmation - Tarot Reader 777',
      html: `
        <h2>Your booking has been received!</h2>
        <p>Hi ${booking.clientName},</p>
        <p>Your ${booking.service} is scheduled for:</p>
        <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${booking.time}</p>
        <p><strong>Duration:</strong> ${booking.duration} minutes</p>
        <p><strong>Price:</strong> $${booking.price}</p>
      `
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmed = await Booking.countDocuments({ status: 'confirmed' });
    const pending = await Booking.countDocuments({ status: 'pending' });
    const completed = await Booking.countDocuments({ status: 'completed' });
    
    const revenue = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalBookings,
        confirmed,
        pending,
        completed,
        revenue: revenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
EOF

# backend/controllers/clientController.js
cat > backend/controllers/clientController.js << 'EOF'
const Client = require('../models/Client');
const Booking = require('../models/Booking');

exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ lastBooking: -1 });
    res.json({ success: true, data: clients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    const bookings = await Booking.find({ email: client.email });
    res.json({ success: true, data: { ...client.toObject(), bookings } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.json({ success: true, data: client });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.json({ success: true, message: 'Client deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
EOF

# backend/controllers/authController.js
cat > backend/controllers/authController.js << 'EOF'
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(admin._id);

    res.json({
      success: true,
      data: {
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const adminExists = await Admin.findOne({ email });
    
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists'
      });
    }

    const admin = await Admin.create({ email, password, name });
    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      data: {
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
EOF

# backend/routes/bookings.js
cat > backend/routes/bookings.js << 'EOF'
const express = require('express');
const router = express.Router();
const {
  getAllBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  getStats
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getAllBookings).post(createBooking);
router.get('/stats', protect, getStats);
router.route('/:id').get(protect, getBooking).put(protect, updateBooking).delete(protect, deleteBooking);

module.exports = router;
EOF

# backend/routes/clients.js
cat > backend/routes/clients.js << 'EOF'
const express = require('express');
const router = express.Router();
const {
  getAllClients,
  getClient,
  updateClient,
  deleteClient
} = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getAllClients);
router.route('/:id').get(protect, getClient).put(protect, updateClient).delete(protect, deleteClient);

module.exports = router;
EOF

# backend/routes/auth.js
cat > backend/routes/auth.js << 'EOF'
const express = require('express');
const router = express.Router();
const { login, register, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/register', register);
router.get('/me', protect, getMe);

module.exports = router;
EOF

# backend/middleware/authMiddleware.js
cat > backend/middleware/authMiddleware.js << 'EOF'
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};
EOF

# backend/middleware/errorHandler.js
cat > backend/middleware/errorHandler.js << 'EOF'
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
EOF

# backend/utils/emailService.js
cat > backend/utils/emailService.js << 'EOF'
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};
EOF

# backend/Dockerfile
cat > backend/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
EOF

# STEP 4: Create Frontend Files
# ============================================

# frontend/package.json
cat > frontend/package.json << 'EOF'
{
  "name": "tarot-reader-frontend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2",
    "lucide-react": "^0.294.0",
    "react-hot-toast": "^2.4.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "tailwindcss": "^3.3.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
EOF

# frontend/vite.config.js
cat > frontend/vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
EOF

# frontend/tailwind.config.js
cat > frontend/tailwind.config.js << 'EOF'
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

# frontend/postcss.config.js
cat > frontend/postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# frontend/index.html
cat > frontend/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tarot Reader 777 - Admin Panel</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF

# frontend/.env.example
cat > frontend/.env.example << 'EOF'
VITE_API_URL=http://localhost:5000/api
EOF

# frontend/Dockerfile
cat > frontend/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
EOF

# STEP 5: Create root configuration files
# ============================================

# .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment variables
.env
.env.local
.env.production

# Build outputs
dist/
build/
.vite/

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Testing
coverage/
EOF

# docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: tarot-mongodb
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
      MONGO_INITDB_DATABASE: tarot-reader
    volumes:
      - mongodb_data:/data/db

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: tarot-backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://admin:password123@mongodb:27017/tarot-reader?authSource=admin
      - JWT_SECRET=your_jwt_secret_change_in_production
      - PORT=5000
    depends_on:
      - mongodb

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: tarot-frontend
    restart: always
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:5000/api
    depends_on:
      - backend

volumes:
  mongodb_data:
EOF

# README.md
cat > README.md << 'EOF'
# Tarot Reader 777 - Booking Management System

A complete full-stack booking management system for tarot reading services.

## 🌟 Features

- ✨ Admin dashboard with stats and analytics
- 📅 Interactive calendar view
- 👥 Client management
- ✉️ Email notifications
- 🔐 Secure authentication
- 📊 Booking status tracking
- 💰 Revenue tracking
- 📱 Responsive design

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Nodemailer
- Bcrypt

### Frontend
- React 18
- Tailwind CSS
- Axios
- React Router
- Lucide Icons

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your values
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 🐳 Docker Setup

```bash
docker-compose up -d
```

## 🔐 Default Credentials

- Email: admin@tarot777.com
- Password: admin123

## 📚 API Endpoints

### Authentication
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

### Bookings
- GET `/api/bookings`
- POST `/api/bookings`
- PUT `/api/bookings/:id`
- DELETE `/api/bookings/:id`
- GET `/api/bookings/stats`

### Clients
- GET `/api/clients`
- GET `/api/clients/:id`
- PUT `/api/clients/:id`
- DELETE `/api/clients/:id`

## 📄 License

MIT

## 👨‍💻 Author

Sajwan007
EOF

# STEP 6: Git commands to push to repository
# ============================================

echo "
# ============================================
# ALL FILES CREATED SUCCESSFULLY!
# ============================================

Now run these commands to push to GitHub:

# 1. Add all files
git add .

# 2. Commit changes
git commit -m 'Initial commit: Complete booking management system with backend and frontend'

# 3. Push to GitHub
git push origin main

# If you encounter issues, you may need to set the upstream:
git push -u origin main

# Or if your default branch is 'master':
git push origin master

# ============================================
# NEXT STEPS AFTER PUSHING:
# ============================================

1. Setup MongoDB:
   - Local: Install MongoDB
   - Cloud: Create MongoDB Atlas account

2. Configure Environment Variables:
   cd backend
   cp .env.example .env
   # Edit .env with your actual values

3. Install Dependencies:
   cd backend && npm install
   cd ../frontend && npm install

4. Run the Application:
   # Backend
   cd backend && npm run dev
   
   # Frontend (in new terminal)
   cd frontend && npm run dev

5. Create First Admin:
   curl -X POST http://localhost:5000/api/auth/register \\
     -H 'Content-Type: application/json' \\
     -d '{
       \"email\": \"admin@tarot777.com\",
       \"password\": \"admin123\",
       \"name\": \"Admin User\"
     }'

6. Access the Application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

7. Optional - Use Docker:
   docker-compose up -d

# ============================================
"
EOF

chmod +x github_deployment_guide.sh