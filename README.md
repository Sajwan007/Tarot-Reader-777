# Tarot Reader 777 - Booking Management System

A complete full-stack booking management system for tarot reading services using Supabase database.

## 🌟 Features

- ✨ Admin dashboard with stats and analytics
- 📅 Interactive calendar view
- 👥 Client management
- ✉️ Email notifications
- 🔐 Secure authentication
- 📊 Booking status tracking
- 💰 Revenue tracking
- 📱 Responsive design
- 🗄️ Supabase database integration

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- Supabase (PostgreSQL)
- JWT Authentication
- Nodemailer
- Bcrypt

### Frontend
- React 18
- Tailwind CSS
- Axios
- React Router
- Lucide Icons

### Database
- Supabase (PostgreSQL)
- Real-time subscriptions
- Row Level Security (RLS)

## 📦 Installation

### Prerequisites
- Node.js 18+
- Supabase account
- npm or yarn

### 1. Set up Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Run the SQL schema from `supabase-schema.sql`
4. Get your Project URL and anon key from Settings > API

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your Supabase credentials
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Update .env with your Supabase credentials
npm run dev
```

## 🔐 Environment Variables

### Backend (.env)
```env
# Supabase Database
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
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

## 🗄️ Database Schema

The system uses three main tables:
- `bookings` - Store all booking information
- `clients` - Store client information
- `admins` - Store admin user accounts

See `supabase-schema.sql` for the complete schema.

## 📄 License

MIT

## 👨‍💻 Author

Sajwan007
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
