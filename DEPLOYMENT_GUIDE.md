# 🚀 Deployment Guide - Reader777

Complete guide for deploying Reader777 tarot platform to production with Vercel.

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository** - Push code to GitHub
3. **Environment Variables** - Have all required credentials ready
4. **Supabase Project** - Database set up and running
5. **SendGrid Account** - Email service configured

## 🌐 Frontend Deployment

### Step 1: Connect to Vercel

1. **Login to Vercel Dashboard**
2. **Click "Add New..." → "Project"**
3. **Import Git Repository** - Select your Reader777 repo
4. **Configure Project** - Vercel will auto-detect settings

### Step 2: Configure Frontend

1. **Root Directory**: Set to `frontend`
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Framework**: Vite (auto-detected)

### Step 3: Set Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@yourdomain.com
NODE_ENV=production
```

### Step 4: Deploy

1. **Click "Deploy"** - Vercel will build and deploy
2. **Wait for deployment** - Usually takes 2-3 minutes
3. **Visit your URL** - `https://your-app.vercel.app`

## 🔧 Backend Deployment

### Step 1: Create Backend Project

1. **Go to Vercel Dashboard**
2. **Click "Add New..." → "Project"**
3. **Import Same Repository** - Select Reader777 again
4. **Name it**: `reader777-backend`

### Step 2: Configure Backend

1. **Root Directory**: Set to `backend`
2. **Build Command**: Leave empty (Node.js doesn't need build)
3. **Output Directory**: Leave empty
4. **Runtime**: Node.js (auto-detected)

### Step 3: Backend Environment Variables

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@yourdomain.com
NODE_ENV=production
```

### Step 4: Deploy Backend

1. **Click "Deploy"**
2. **Note the backend URL**: `https://reader777-backend.vercel.app`

## 🔄 Update Frontend API Routes

After deploying both frontend and backend, update the frontend's API calls to use the production backend URL.

### Option 1: Update vercel.json (Recommended)

Edit `frontend/vercel.json`:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://reader777-backend.vercel.app/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_SUPABASE_URL": "@supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@supabase_anon_key",
    "SENDGRID_API_KEY": "@sendgrid_api_key",
    "EMAIL_FROM": "@email_from"
  }
}
```

### Option 2: Update API URLs in Code

Update `frontend/src/pages/PaymentPage.tsx`:

```typescript
// Change this:
const response = await fetch('/api/payments', {

// To this (for production):
const response = await fetch('https://reader777-backend.vercel.app/api/payments', {
```

## 🧪 Testing Production Deployment

### 1. Frontend Testing

```bash
# Test frontend locally with production variables
cd frontend
npm run build
npm run preview
```

### 2. Backend Testing

```bash
# Test backend health
curl https://reader777-backend.vercel.app/health

# Test payment endpoint
curl -X POST https://reader777-backend.vercel.app/api/payments \
  -H "Content-Type: application/json" \
  -d '{"orderId":"test","amount":999,"utr":"123456789012"}'
```

### 3. End-to-End Testing

1. **Visit frontend URL**
2. **Complete a booking**
3. **Test UPI payment flow**
4. **Check email delivery**
5. **Verify database updates**

## 🔍 Monitoring and Logs

### Vercel Logs

1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Click "Logs" tab**
4. **View real-time logs** for debugging

### Database Monitoring

1. **Go to Supabase Dashboard**
2. **Check "Authentication" logs**
3. **Review "Database" activity**
4. **Monitor API usage**

### Email Monitoring

1. **Go to SendGrid Dashboard**
2. **Check "Email Activity"**
3. **Monitor delivery rates**
4. **Review bounce reports**

## 🚨 Common Deployment Issues

### Frontend Issues

**Build fails:**
- Check `frontend/package.json` scripts
- Verify all dependencies are installed
- Review build logs in Vercel

**Environment variables not working:**
- Verify variable names match exactly
- Check Vercel environment variables section
- Restart deployment after adding variables

**API calls failing:**
- Ensure backend is deployed and running
- Check API routing in vercel.json
- Verify CORS settings in backend

### Backend Issues

**Server not starting:**
- Check `backend/package.json` main field
- Verify Node.js version compatibility
- Review server.js for syntax errors

**Database connection failing:**
- Verify Supabase credentials
- Check RLS policies in Supabase
- Review network connectivity

**Emails not sending:**
- Verify SendGrid API key
- Check sender email verification
- Review email templates for errors

## 🔄 Continuous Deployment

### Automatic Deployments

Set up automatic deployments when pushing to main branch:

1. **Go to Vercel project settings**
2. **Click "Git Integration"**
3. **Select your GitHub repository**
4. **Choose branch** (usually `main`)
5. **Enable auto-deployment**

### Deployment Workflow

```bash
# Make changes
git add .
git commit -m "Update payment flow"
git push origin main

# Vercel will automatically deploy both frontend and backend
```

## 📊 Performance Optimization

### Frontend Optimization

1. **Enable Vercel Analytics**
2. **Configure custom domain** (optional)
3. **Enable edge functions** if needed
4. **Optimize images and assets**

### Backend Optimization

1. **Enable caching headers**
2. **Monitor API response times**
3. **Set up error tracking**
4. **Configure rate limiting**

## 🔒 Security Considerations

### Environment Variables

- **Never commit** `.env` files to Git
- **Use Vercel's encrypted** environment variables
- **Rotate API keys** regularly
- **Use different keys** for development/production

### API Security

- **Enable HTTPS** (automatic on Vercel)
- **Set up rate limiting**
- **Validate all inputs**
- **Monitor for suspicious activity**

### Database Security

- **Use Supabase RLS** policies
- **Limit database access**
- **Regular backups**
- **Monitor query performance**

## 📞 Support

### Vercel Support
- **Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Status Page**: [vercel-status.com](https://vercel-status.com)
- **Support**: support@vercel.com

### Common Debugging Steps

1. **Check Vercel build logs**
2. **Verify environment variables**
3. **Test API endpoints directly**
4. **Review browser console errors**
5. **Check network requests in dev tools**

---

**🎉 Your Reader777 platform is now live and ready for mystical tarot readings!**
