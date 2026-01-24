# Reader777 - Mystical Tarot Reading Platform

A modern, responsive tarot reading platform with UPI payment integration and Supabase database.

## 🏗️ Project Structure

```
Reader777/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   └── hooks/          # Custom React hooks
│   ├── public/             # Static assets
│   ├── package.json         # Frontend dependencies
│   └── vercel.json        # Vercel deployment config
├── backend/                 # Express.js backend API
│   ├── api/               # API route handlers
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── vercel.json        # Backend deployment config
├── .env                   # Environment variables
├── supabase-schema.sql     # Database schema
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for database)
- SendGrid account (for emails)

### Installation

1. **Clone and install frontend:**
   ```bash
   cd frontend
   npm install
   ```

2. **Install backend:**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual credentials
   ```

### Development

1. **Start backend:**
   ```bash
   cd backend
   npm run dev
   # Backend runs on http://localhost:3001
   ```

2. **Start frontend (in another terminal):**
   ```bash
   cd frontend
   npm run dev
   # Frontend runs on http://localhost:5174
   ```

## 🌐 Deployment

### Frontend (Vercel)

1. **Deploy frontend:**
   ```bash
   cd frontend
   npm run build
   vercel --prod
   ```

2. **Configure environment variables in Vercel:**
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `SENDGRID_API_KEY`: Your SendGrid API key
   - `EMAIL_FROM`: Your email address

### Backend (Vercel)

1. **Deploy backend:**
   ```bash
   cd backend
   vercel --prod
   ```

2. **Configure environment variables in Vercel:**
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon key
   - `SENDGRID_API_KEY`: Your SendGrid API key
   - `EMAIL_FROM`: Your email address

## 💳 Payment System

### UPI Payment Flow
1. User selects service and completes booking
2. QR code displayed with payment amount
3. User pays via any UPI app
4. User enters UTR (transaction reference)
5. System verifies payment and updates booking

### API Endpoints
- `POST /api/payments` - Verify UPI payment
- `GET /api/payments?utr=xxx` - Get payment status
- `GET /api/payments/stats` - Payment statistics

## 🗄️ Database Setup

1. **Create Supabase project**
2. **Run SQL schema:**
   ```bash
   # Copy contents of supabase-schema.sql
   # Paste in Supabase SQL Editor
   # Execute to create tables
   ```

### Tables
- `bookings` - Customer booking information
- `payments` - Payment transaction details

## 📧 Email Integration

### SendGrid Setup
1. **Create SendGrid account**
2. **Generate API key**
3. **Configure sender email**
4. **Set environment variables**

### Email Templates
- Booking confirmation
- Payment confirmation
- Payment failure notifications

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Supabase JS** - Database client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Supabase** - Database
- **SendGrid** - Email service

### Deployment
- **Vercel** - Hosting platform
- **GitHub** - Version control

## 🔧 Configuration

### Environment Variables

```env
# Supabase Database
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# SendGrid Email Service
SENDGRID_API_KEY=your_sendgrid_key
EMAIL_FROM=noreply@yourdomain.com

# Application
NODE_ENV=production
```

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run lint        # Code linting
npm run build      # Production build
npm run preview     # Preview build
```

### Backend Testing
```bash
cd backend
npm start           # Production mode
npm run dev         # Development mode
```

### API Testing
```bash
# Health check
curl http://localhost:3001/health

# Payment verification
curl -X POST http://localhost:3001/api/payments \
  -H "Content-Type: application/json" \
  -d '{"orderId":"test","amount":999,"utr":"123456789012"}'
```

## 🔍 Troubleshooting

### Common Issues

**Frontend not loading:**
- Check if backend is running on port 3001
- Verify environment variables are set
- Check browser console for errors

**Payment verification failing:**
- Verify UTR format (12+ digits)
- Check backend logs for errors
- Ensure Supabase connection is working

**Emails not sending:**
- Verify SendGrid API key
- Check sender email is verified
- Review email templates

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev
```

## 📞 Support

For technical support:
1. Check browser console for JavaScript errors
2. Review backend logs for API errors
3. Verify environment variables are correct
4. Test with different browsers/devices

## 📄 License

This project is licensed under the ISC License.

---

**Built with ❤️ for mystical tarot readings**
