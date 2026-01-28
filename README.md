# 🔮 Tarot Reader 777

A complete tarot reading booking application with admin dashboard, payment processing, and email notifications.

## ✨ Features

- **Client Booking Interface**: Beautiful, responsive booking form for clients
- **Admin Dashboard**: Comprehensive dashboard for managing bookings and payments
- **Payment Integration**: UPI QR code generation and payment verification
- **Email Notifications**: Automated emails for booking confirmations and payment status
- **Real-time Updates**: Live booking status and payment tracking
- **Mobile Responsive**: Works perfectly on all devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **React Hook Form** for form handling
- **Zustand** for state management
- **Axios** for API calls

### Backend
- **Node.js** with TypeScript
- **Vercel Serverless Functions**
- **Supabase** for database
- **SendGrid** for email services
- **JWT** for authentication
- **bcrypt** for password hashing
- **QRCode** for payment QR generation

### Database
- **PostgreSQL** via Supabase
- **Row Level Security** (RLS)
- **Real-time subscriptions**

## 📁 Project Structure

```
Reader777/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and API clients
│   │   └── App.tsx         # Main app component
│   ├── package.json
│   └── vite.config.ts
├── api/                     # Vercel serverless functions
│   ├── auth/               # Authentication routes
│   ├── bookings/           # Booking management
│   ├── payments/           # Payment processing
│   ├── services/           # Email services
│   └── package.json
├── supabase/               # Database schema
│   └── schema.sql
├── vercel.json            # Vercel configuration
├── .env.example           # Environment variables template
└── README.md
```

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v18 or higher)
2. **Supabase Account** - https://supabase.com
3. **SendGrid Account** - https://sendgrid.com
4. **Vercel Account** - https://vercel.com

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Sajwan007/Tarot-Reader-777.git
cd Tarot-Reader-777
```

2. **Install dependencies**
```bash
# Frontend dependencies
cd frontend
npm install

# API dependencies
cd ../api
npm install
```

3. **Set up environment variables**
```bash
# Copy the example environment file
cp .env.example .env

# Fill in your environment variables
# See Environment Variables section below
```

4. **Set up Supabase database**
```bash
# Go to Supabase dashboard > SQL Editor
# Copy and run the entire content from supabase/schema.sql
```

5. **Run locally**
```bash
# Frontend
cd frontend
npm run dev

# API (in separate terminal)
cd api
npx vercel dev
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# SendGrid Configuration
SENDGRID_API_KEY=SG.your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=Tarot Reader 777

# JWT Configuration
JWT_SECRET=your-super-secret-random-string-min-32-chars

# Payment Configuration
PAYMENT_UPI_ID=your-upi-id@provider
PAYMENT_QR_VALIDITY_HOURS=24

# App Configuration
VITE_APP_URL=http://localhost:5173
```

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
- Go to https://vercel.com
- Click "Add New" → "Project"
- Import your GitHub repository
- Configure environment variables in Vercel dashboard
- Deploy!

### Environment Variables in Vercel

Add these in your Vercel project settings:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SENDGRID_API_KEY=SG.your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=Tarot Reader 777
JWT_SECRET=your-super-secret-random-string-min-32-chars
PAYMENT_UPI_ID=your-upi-id@provider
PAYMENT_QR_VALIDITY_HOURS=24
VITE_APP_URL=https://your-app.vercel.app
```

## 📊 Database Schema

The application uses the following main tables:

- **admins** - Admin user accounts
- **clients** - Client information
- **services** - Tarot reading services
- **bookings** - Booking records
- **availability** - Admin availability
- **email_logs** - Email delivery logs
- **settings** - Application settings

See `supabase/schema.sql` for the complete schema.

## 🔐 Authentication

The application uses JWT-based authentication:

1. **Admin Login** - Email/password with bcrypt hashing
2. **Token Storage** - JWT stored in localStorage
3. **Protected Routes** - Admin dashboard requires authentication
4. **Auto-logout** - Token expiration handling

## 💳 Payment Flow

1. **Client books** a service
2. **QR code generated** with UPI payment details
3. **Client pays** via UPI using the QR code
4. **Admin verifies** payment with transaction ID
5. **Payment confirmed** and booking status updated
6. **Email notifications** sent to client

## 📧 Email Templates

The application includes beautiful email templates for:

- **Booking Confirmation** - With QR code for payment
- **Payment Verified** - Confirmation of successful payment
- **Booking Reminder** - 2 hours before session

All emails are responsive and branded.

## 🎨 Customization

### Branding

Update these files to customize the app:

- **Colors**: `tailwind.config.js`
- **Logo**: Replace in components
- **Text**: Update in page components
- **Emails**: Modify in `api/services/email.ts`

### Adding New Services

1. Add to database via Supabase dashboard
2. Or use the admin interface (if implemented)

### Custom Domain

1. Go to Vercel → Settings → Domains
2. Add your custom domain
3. Update DNS settings
4. Update `VITE_APP_URL` environment variable

## 🐛 Troubleshooting

### Common Issues

1. **Supabase Connection Failed**
   - Check `SUPABASE_URL` and keys
   - Verify RLS policies

2. **Email Not Sending**
   - Verify SendGrid API key
   - Check sender email verification
   - Check SendGrid activity logs

3. **QR Code Not Generating**
   - Check `PAYMENT_UPI_ID` setting
   - Verify QRCode package installation

4. **Admin Login Not Working**
   - Check admin exists in database
   - Verify JWT_SECRET is set
   - Check password hash

## 📱 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Create admin

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings` - Update booking

### Payments
- `GET /api/payments/verify` - Generate QR code
- `POST /api/payments/verify` - Verify payment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you need help:

1. **Documentation**: Check this README
2. **Issues**: Create an issue on GitHub
3. **Email**: Contact the development team

---

**🔮 Tarot Reader 777 - Guiding Your Spiritual Journey**
