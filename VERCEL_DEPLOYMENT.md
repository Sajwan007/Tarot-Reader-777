# Vercel Deployment Guide - Tarot Reader 777

This guide will help you deploy your Tarot Reader 777 application to Vercel with Supabase backend.

## 🚀 Deployment Overview

We'll deploy:
1. **Backend API** to Vercel Serverless Functions
2. **Frontend** to Vercel Static Hosting
3. **Supabase** as the database (already configured)

## 📋 Prerequisites

- Vercel account ([vercel.com](https://vercel.com))
- Supabase project configured
- GitHub repository with your code

## 🗄️ Step 1: Supabase Setup

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create new project: `reader777-tarot`
   - Wait for project to be ready

2. **Run Database Schema:**
   - Go to SQL Editor in your Supabase project
   - Copy contents of `supabase-schema.sql`
   - Paste and run the schema

3. **Get Supabase Credentials:**
   - Go to Settings > API
   - Copy **Project URL** and **anon public** key
   - Save these for Vercel environment variables

## 🔧 Step 2: Backend Deployment

### 2.1 Deploy Backend to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Deploy Backend:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select **backend** folder as root directory
   - Framework Preset: **Other**
   - Build Command: `npm install`
   - Output Directory: `.` (root)
   - Install Command: `npm install`

3. **Set Backend Environment Variables:**
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=noreply@yourdomain.com
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

4. **Deploy and Get Backend URL:**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `reader777-backend.vercel.app`)

## 🎨 Step 3: Frontend Deployment

### 3.1 Update Frontend Configuration

1. **Update frontend/vercel.json:**
   - Replace `reader777-backend.vercel.app` with your actual backend URL

### 3.2 Deploy Frontend to Vercel

1. **Deploy Frontend:**
   - Go to Vercel dashboard
   - Click "New Project"
   - Import the same GitHub repository
   - Select **frontend** folder as root directory
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

2. **Set Frontend Environment Variables:**
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=https://your-backend-url.vercel.app/api
   ```

3. **Deploy and Get Frontend URL:**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note your frontend URL

## 🔐 Step 4: Final Configuration

### 4.1 Update Backend CORS

1. **Update backend .env or Vercel env:**
   ```
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

### 4.2 Create Admin User

After backend deployment, create your first admin:

```bash
curl -X POST https://your-backend-url.vercel.app/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@tarot777.com",
    "password": "admin123",
    "name": "Admin User"
  }'
```

## 🧪 Step 5: Testing

1. **Test Backend:**
   ```bash
   curl https://your-backend-url.vercel.app/api/health
   ```

2. **Test Frontend:**
   - Visit your frontend URL
   - Try logging in with admin credentials
   - Create a test booking

3. **Test Database:**
   - Check Supabase dashboard for new records
   - Verify bookings and clients are created

## 🔄 Step 6: Custom Domain (Optional)

1. **Add Custom Domain:**
   - In Vercel dashboard, go to project settings
   - Click "Domains"
   - Add your custom domain
   - Update DNS records as instructed

2. **Update Environment Variables:**
   - Update FRONTEND_URL in backend
   - Update VITE_API_URL in frontend if needed

## 📊 Monitoring

1. **Vercel Analytics:**
   - Enable Vercel Analytics for performance monitoring
   - Monitor serverless function usage

2. **Supabase Monitoring:**
   - Monitor database performance
   - Check API usage limits

## 🚨 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Ensure FRONTEND_URL is correctly set in backend
   - Check Vercel rewrites are working

2. **Database Connection:**
   - Verify Supabase URL and keys are correct
   - Check Supabase project is active

3. **Build Failures:**
   - Check package.json dependencies
   - Verify all environment variables are set

4. **Authentication Issues:**
   - Ensure JWT_SECRET is set
   - Check token expiration settings

## 📝 Environment Variables Summary

### Backend:
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Frontend:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://your-backend-url.vercel.app/api
```

## 🎉 Deployment Complete!

Your Tarot Reader 777 application is now live on Vercel with Supabase backend!

- **Frontend:** https://your-frontend-domain.vercel.app
- **Backend API:** https://your-backend-domain.vercel.app/api
- **Database:** Supabase Dashboard

**Default Login:** admin@tarot777.com / admin123
