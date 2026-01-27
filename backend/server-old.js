// Simple Express server for UPI payments
// Run with: node server.js

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for demo purposes (replace with database in production)
let payments = [];

// POST /api/payments - UPI payment verification
app.post('/api/payments', (req, res) => {
  try {
    const { orderId, amount, upiId, utr, payerName, paidAmount, paidAt } = req.body;

    // Validation
    if (!orderId || !amount || !upiId || !utr) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: orderId, amount, upiId, utr' 
      });
    }

    // UTR validation (should be at least 12 digits)
    if (!/^\d{12,}$/.test(utr)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid UTR format. UTR must be at least 12 digits.' 
      });
    }

    // Check for duplicate UTR
    const existingPayment = payments.find(p => p.utr === utr);
    if (existingPayment) {
      return res.status(409).json({ 
        success: false, 
        message: 'This UTR has already been used for a payment.' 
      });
    }

    // Amount validation
    if (paidAmount && parseFloat(paidAmount) !== amount) {
      return res.status(400).json({ 
        success: false, 
        message: `Paid amount (${paidAmount}) does not match required amount (${amount}).` 
      });
    }

    // Create payment record
    const payment = {
      id: `upi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderId,
      amount,
      upiId,
      utr,
      payerName: payerName || 'Anonymous',
      paidAmount: paidAmount || amount,
      paidAt: paidAt || new Date().toISOString(),
      status: 'verified',
      createdAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString()
    };

    // Store payment (in-memory for demo)
    payments.push(payment);

    console.log('UPI Payment Verified:', {
      id: payment.id,
      orderId,
      utr,
      amount,
      status: payment.status
    });

    res.json({ 
      success: true, 
      message: 'Payment verified successfully',
      payment: {
        id: payment.id,
        orderId: payment.orderId,
        utr: payment.utr,
        status: payment.status,
        verifiedAt: payment.verifiedAt
      }
    });

  } catch (error) {
    console.error('UPI Payment API Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error during payment verification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/payments - Retrieve payment status
app.get('/api/payments', (req, res) => {
  try {
    const { utr, orderId } = req.query;

    if (utr) {
      // Find payment by UTR
      const payment = payments.find(p => p.utr === utr);
      if (payment) {
        return res.json({ 
          success: true, 
          payment 
        });
      }
    } else if (orderId) {
      // Find payments by order ID
      const orderPayments = payments.filter(p => p.orderId === orderId);
      return res.json({ 
        success: true, 
        payments: orderPayments 
      });
    }

    res.status(404).json({ 
      success: false, 
      message: 'Payment not found' 
    });

  } catch (error) {
    console.error('UPI Payment GET Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/payments - Clear all payments (for testing)
app.delete('/api/payments', (req, res) => {
  payments = [];
  res.json({ 
    success: true, 
    message: 'All payments cleared' 
  });
});

// GET /api/payments/stats - Payment statistics
app.get('/api/payments/stats', (req, res) => {
  try {
    const stats = {
      total: payments.length,
      verified: payments.filter(p => p.status === 'verified').length,
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      recentPayments: payments.slice(-5).reverse()
    };
    
    res.json({ 
      success: true, 
      stats 
    });
  } catch (error) {
    console.error('Stats API Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    payments: payments.length 
  });
});

// Serve static files from Vite build (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`UPI Payment Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoint: http://localhost:${PORT}/api/payments`);
});

export default app;
