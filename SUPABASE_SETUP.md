# Supabase Database Setup for Reader777

This guide will help you set up Supabase database for the Reader777 Tarot application.

## 🚀 Quick Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/login to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Project Name**: `reader777-tarot`
   - **Database Password**: Generate a strong password
   - **Region**: Choose your closest region
6. Click "Create new project"

### 2. Get Your Credentials
Once your project is ready:
1. Go to **Project Settings** (gear icon)
2. Find **API** section
3. Copy these values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ...`)

### 3. Set Up Database Schema
1. In your Supabase project, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase-schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

### 4. Configure Environment Variables
Create a `.env` file in your project root:

```env
# Supabase Database
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Razorpay Payment Gateway
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# SendGrid Email Service
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@yourdomain.com

# Application
NODE_ENV=development
```

Replace the Supabase values with your actual credentials.

### 5. Test the Connection
1. Restart your development server:
   ```bash
   npm run dev
   ```
2. Open browser console
3. Try creating a booking
4. Check console for Supabase connection status

## 📊 Database Tables

### Bookings Table
- Stores all booking information
- Fields: customer details, service info, dates, status
- Status: `pending`, `paid`, `completed`, `cancelled`

### Payments Table
- Stores payment transaction details
- Linked to bookings via foreign key
- Stores Razorpay payment IDs and verification data

## 🔒 Security Features

### Row Level Security (RLS)
- Enabled on both tables
- Anonymous users can create bookings
- Users can only view/update their own bookings
- Payments are restricted to booking owners

### Policies
- `Allow anonymous insert bookings` - Create new bookings
- `Allow anonymous view own bookings` - View own bookings
- `Allow anonymous update own bookings` - Update own bookings
- Similar policies for payments table

## 🛠️ Development Features

### Automatic Fallback
- If Supabase is not configured, app automatically falls back to localStorage
- No errors - seamless development experience
- Console warnings indicate fallback mode

### Database Service
- Centralized database operations in `src/utils/database.ts`
- Type-safe operations with TypeScript interfaces
- Automatic error handling and fallback

## 📝 Usage Examples

### Create a Booking
```typescript
const newBooking = await db.createBooking({
  customer_name: 'John Doe',
  customer_email: 'john@example.com',
  customer_phone: '+1234567890',
  service_id: 'love',
  service_name: 'Love Tarot Reading',
  service_price: '₹999',
  booking_date: '2024-01-15',
  booking_time: '10:00 AM',
  reading_type: 'live',
  status: 'pending'
});
```

### Update Booking Status
```typescript
await db.updateBooking(bookingId, {
  status: 'paid',
  payment_id: 'pay_123456'
});
```

### Create Payment Record
```typescript
await db.createPayment({
  booking_id: bookingId,
  razorpay_payment_id: 'pay_123456',
  razorpay_order_id: 'order_789',
  razorpay_signature: 'signature_abc',
  amount: 99900, // in paise
  currency: 'INR',
  status: 'success'
});
```

## 🔍 Monitoring

### Supabase Dashboard
1. Go to your Supabase project dashboard
2. **Table Editor** - View and manage data
3. **Authentication** - User management
4. **API** - Monitor API usage
5. **Logs** - Debug issues

### Local Development
- Browser console shows database operations
- Fallback to localStorage when Supabase unavailable
- Error logging for debugging

## 🚀 Production Deployment

1. **Environment Variables**: Set production values
2. **RLS Policies**: Review security policies
3. **Database Backups**: Enable automatic backups
4. **Monitoring**: Set up alerts for database issues

## 🐛 Troubleshooting

### Common Issues

**"Supabase credentials not found"**
- Check `.env` file exists
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart development server

**"Permission denied" errors**
- Check RLS policies in SQL Editor
- Verify table permissions
- Check API key validity

**Data not saving**
- Check browser console for errors
- Verify network connectivity
- Check Supabase logs

### Debug Mode
Add this to your code for debugging:
```typescript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase available:', !!supabase);
```

## 📞 Support

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Discord Community**: [discord.gg/supabase](https://discord.gg/supabase)
- **GitHub Issues**: Report issues in this repository
