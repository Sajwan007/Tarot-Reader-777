import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env.local') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Import and use Vercel functions
import loginHandler from './auth/login.js';
import bookingsHandler from './bookings/index.js';
import clientsHandler from './clients/index.js';
import paymentsHandler from './payments/index.js';
import servicesHandler from './services/index.js';

// Routes - wrap Vercel handlers to work with Express
app.post('/api/auth/login', (req, res) => {
  // Mock Vercel request/response objects
  const vercelReq = {
    method: 'POST',
    body: req.body,
    headers: req.headers
  };
  
  loginHandler(vercelReq, {
    status: (code) => {
      res.status(code);
      return {
        json: (data) => res.json(data),
        end: () => res.end()
      };
    },
    json: (data) => res.json(data),
    setHeader: (name, value) => res.setHeader(name, value)
  });
});

app.get('/api/bookings', (req, res) => {
  const vercelReq = {
    method: 'GET',
    query: req.query,
    headers: req.headers
  };
  
  bookingsHandler(vercelReq, {
    status: (code) => {
      res.status(code);
      return {
        json: (data) => res.json(data),
        end: () => res.end()
      };
    },
    json: (data) => res.json(data),
    setHeader: (name, value) => res.setHeader(name, value)
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/auth/login`);
});
