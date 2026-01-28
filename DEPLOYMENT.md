# Vercel Deployment Guide

## 🚀 Dynamic Configuration

The application is configured to work automatically in both development and production environments.

### 📍 API Base URL Logic

```typescript
const API_BASE_URL = import.meta.env.VITE_APP_URL || 
  (typeof window !== 'undefined' && window.location.origin) || 
  'http://localhost:3000';
```

**Priority Order:**
1. `VITE_APP_URL` environment variable
2. `window.location.origin` (automatic in production)
3. `http://localhost:3000` (fallback for development)

## 🔧 Environment Setup

### Development (.env)
```env
VITE_APP_URL=http://localhost:3001
```

### Production (Vercel Environment Variables)
Set these in Vercel Dashboard → Settings → Environment Variables:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `SENDGRID_API_KEY`: Your SendGrid API key
- `SENDGRID_FROM_EMAIL`: Your from email
- `JWT_SECRET`: Your JWT secret
- `PAYMENT_UPI_ID`: Your UPI payment ID
- `VITE_APP_URL`: Your deployed app URL (optional - auto-detected)

## 📦 Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration

### 3. Configure Environment Variables
In Vercel Dashboard:
- Go to Project → Settings → Environment Variables
- Add all required variables from `.env.example`

### 4. Deploy
- Click "Deploy"
- Vercel will build and deploy automatically

## 🌐 How It Works

### Development
- Frontend: `http://localhost:5174`
- API: `http://localhost:3001`
- Uses `.env` file for configuration

### Production (Vercel)
- Frontend & API: Same domain (e.g., `https://your-app.vercel.app`)
- API routes: `/api/*` automatically routed to serverless functions
- Uses Vercel environment variables
- `window.location.origin` automatically points to deployed URL

## 🔍 Automatic URL Detection

In production, the API base URL automatically uses the deployed domain:
- If deployed to `https://tarot-reader.vercel.app`
- API base URL becomes `https://tarot-reader.vercel.app`
- No manual configuration needed!

## 🛠️ Troubleshooting

### API Not Working in Production
1. Check Vercel environment variables
2. Verify API functions are deployed
3. Check Vercel function logs

### CORS Issues
- CORS headers are built into all API endpoints
- Should work automatically in production

### Environment Variables Not Loading
- Restart Vercel deployment after adding variables
- Check variable names match exactly

## 📱 Testing Production

1. Visit your deployed URL
2. Test booking creation
3. Test QR code generation
4. Test admin login

The application should work seamlessly without any configuration changes!
