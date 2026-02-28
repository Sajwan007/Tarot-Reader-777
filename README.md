# 🔮 Tarot Reader 777

A modern, responsive tarot reading website with contact form submissions and beautiful UX animations.

## ✨ Features

- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Smooth Animations**: Framer Motion interactions throughout
- **Contact Form**: Working contact submissions with email notifications
- **Mobile Optimized**: Perfect responsive design for all devices
- **Interactive Elements**: Hover effects, micro-interactions, and smooth transitions
- **Professional UX**: Thoughtful user experience design

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Node.js** with ES Modules
- **Express.js** for API server
- **Nodemailer** for email notifications
- **JWT** for authentication
- **CORS** for cross-origin requests

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
├── api/                     # Node.js API
│   ├── auth/               # Authentication handlers
│   ├── bookings/           # Booking management
│   ├── utils/              # Utility functions (email service)
│   ├── services/           # Service definitions
│   ├── server.js           # Main server file
│   ├── vercel.json         # Vercel configuration
│   ├── package.json        # Dependencies
│   └── codefiles/         # Archive of old files
├── .gitignore
├── README.md
└── package.json           # Root dependencies
```

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** or **yarn** package manager

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
# Copy example environment file
cp api/.env.example api/.env.local

# Fill in your environment variables
# See Environment Variables section below
```

4. **Run locally**
```bash
# Frontend (in terminal 1)
cd frontend
npm run dev

# API (in terminal 2)
cd api
node server.js
```

Applications will be available at:
- Frontend: http://localhost:5173
- API: http://localhost:3001

## 🔧 Environment Variables

Create a `api/.env.local` file:

```env
# Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@example.com

# Optional: SendGrid (fallback to Gmail if not set)
SENDGRID_API_KEY=SG.your-sendgrid-api-key

# JWT Configuration
JWT_SECRET=your-super-secret-random-string-min-32-chars

# Development
NODE_ENV=development
```

### Gmail Setup for Email

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character App Password (not your regular password)

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Connect to Vercel**
- Go to https://vercel.com
- Click "Add New" → "Project"
- Import your GitHub repository
- Configure environment variables in Vercel dashboard

3. **Environment Variables in Vercel**
Add these in your Vercel project settings:

```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@example.com
SENDGRID_API_KEY=SG.your-sendgrid-api-key
JWT_SECRET=your-super-secret-random-string
NODE_ENV=production
```

4. **Deploy!**
Vercel will automatically deploy on push to main branch.

## 📧 API Endpoints

### Contact
- `POST /api/contact` - Contact form submission with email notifications

### Health Check
- `GET /api/health` - API health status

## � Email Service

The API uses Nodemailer with Gmail service:
- Professional HTML email templates
- Automatic fallback to Gmail if SendGrid fails
- Error handling and logging
- Environment variable validation

## 🎨 Features Implemented

### ✅ Frontend
- [x] Responsive design for all screen sizes
- [x] Smooth animations and micro-interactions
- [x] Contact form with validation
- [x] Navigation with mobile menu
- [x] Hero section with animated elements
- [x] Services section with interactive cards
- [x] How it works section with step animations
- [x] Testimonials with hover effects
- [x] Scroll-to-top button
- [x] Professional typography and spacing

### ✅ Backend
- [x] Express.js server with ES modules
- [x] Contact form processing
- [x] Email notifications via Nodemailer
- [x] CORS configuration
- [x] Environment variable management
- [x] Error handling and logging
- [x] Vercel deployment configuration

## 🐛 Troubleshooting

### Common Issues

1. **Email Not Sending**
   - Verify Gmail App Password setup
   - Check environment variables
   - Ensure 2FA is enabled on Gmail

2. **Module Type Error**
   - Added `"type": "module"` to package.json
   - Using ES6 import/export syntax

3. **CORS Issues**
   - Check frontend URL in development
   - Verify CORS configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**🔮 Tarot Reader 777 - Guiding Your Spiritual Journey**
"src": "/(.*)", "dest": "/frontend/$1" }