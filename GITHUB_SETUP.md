# GitHub Setup Instructions

## 🚀 Push to GitHub

### Step 1: Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click "+" → "New repository"
3. Repository name: `Reader777` (or your preferred name)
4. Description: `Tarot Reader 777 - Full Stack Application`
5. Make it **Public** (for Vercel free tier)
6. **DO NOT** initialize with README, .gitignore, or license (we already have them)
7. Click "Create repository"

### Step 2: Add Remote and Push
Copy the repository URL and run these commands:

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/Reader777.git

# Push to GitHub
git push -u origin master
```

### Step 3: Verify
- Go to your GitHub repository
- You should see all the files
- Check that `.env` is NOT pushed (should be in .gitignore)

## 🔗 Next Steps for Vercel Deployment

Once pushed to GitHub:

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Vercel will auto-detect the configuration**
5. **Add environment variables** from `.env.example`
6. **Deploy!**

## 📋 Environment Variables for Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key  
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `SENDGRID_API_KEY`: Your SendGrid API key
- `SENDGRID_FROM_EMAIL`: `abhisheksajwan458@gmail.com`
- `JWT_SECRET`: Your JWT secret
- `PAYMENT_UPI_ID`: Your UPI payment ID

## 🎯 Quick Commands

```bash
# Check current status
git status

# Add remote (replace with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/Reader777.git

# Push to GitHub
git push -u origin master

# Check remote
git remote -v
```

Your code is ready and committed! Just create the GitHub repository and push! 🚀
