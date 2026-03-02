# 🔮 Tarot Reader 777

Modern tarot reading website with a production-ready admin panel, real Supabase data, and Vercel serverless APIs.

## ✨ Features

- **Beautiful UI**: Modern, responsive design with Tailwind CSS and Framer Motion
- **Contact Flow**: Multi-step contact form with inline validation and email notifications
- **Admin Panel**: Secure login + dashboards for bookings, clients, payments, and contact messages
- **Real Data**: Bookings, clients, and contact submissions stored in Supabase (no dummy data)
- **Mobile Optimized**: Polished navigation and layout on phones and tablets

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for bundling
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for routing
- **Lucide React** for icons

### Backend / Data
- **Vercel Serverless Functions** in `api/`
- **Supabase** (Postgres + `@supabase/supabase-js`) for persistent data
  - Tables: `admins`, `bookings`, `clients`, `contact_submissions`, `availability`, `services`, `settings`, `email_logs`
- **Nodemailer** for transactional email
- **JWT** for admin auth (optional but recommended)

## 📁 Project Structure

```txt
Reader777/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # UI + admin components
│   │   ├── pages/            # Public + admin pages
│   │   ├── lib/api.ts        # Axios API client
│   │   └── App.tsx
│   └── package.json
├── api/                      # Vercel serverless functions
│   ├── auth/                 # /api/auth/login, /register
│   ├── utils/                # emailService, supabaseClient
│   ├── bookings.js           # /api/bookings (Supabase-backed)
│   ├── clients.js            # /api/clients  (Supabase-backed)
│   ├── contact.js            # /api/contact  (Supabase + email + rate-limit)
│   ├── server.js             # Local dev Express wrapper (not used on Vercel)
│   ├── package.json
│   └── .env.example
├── vercel.json               # Deployment config for frontend + API
├── package.json              # Root scripts (build/dev)
└── README.md
```

## 🚀 Quick Start (Local)

### Prerequisites

- **Node.js** v18+
- Supabase project (URL + service role key)

### Install & run

```bash
git clone https://github.com/Sajwan007/Tarot-Reader-777.git
cd Tarot-Reader-777

# Install root + frontend + api deps
npm install
cd api && npm install && cd ../frontend && npm install && cd ..

# Copy API env template
cp api/.env.example api/.env.local

# Start both frontend (Vite) and API (Express dev server wrapper)
npm run dev
```

Defaults:
- Frontend: `http://localhost:5173`
- API dev server: `http://localhost:3001`

## 🔧 Environment Variables (API)

Create `api/.env.local` (for local) and the same keys in Vercel (for production).

```env
# Supabase (required for real data)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Admin login (checked in /api/auth/login)
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=strong-password-here
JWT_SECRET=your-long-random-jwt-secret

# Email configuration (Nodemailer)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password

# Optional
NODE_ENV=development
```

### Gmail App Password

1. Enable 2FA on your Gmail account  
2. Visit `https://myaccount.google.com/apppasswords`  
3. Generate an app password and use it as `EMAIL_PASS`

## 🌐 Deployment (Vercel)

1. Push to GitHub:

```bash
git add .
git commit -m "Deploy Tarot Reader 777"
git push origin main
```

2. In Vercel:
- Import the repo as a new project
- Build is handled by `vercel.json` (builds frontend, serves `frontend/dist`)
- Ensure all env vars from the previous section are added in **Project → Settings → Environment Variables**

3. Deploy – Vercel will build the frontend and deploy serverless functions under `/api/*`.

## 📧 Main API Endpoints

- `POST /api/contact` – Public contact form (saves to `contact_submissions`, sends email, spam-protected)
- `GET /api/contact` – Admin: list of contact submissions (Supabase)
- `POST /api/auth/login` – Admin login using `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- `GET /api/bookings` – Admin: list bookings (`bookings` table)
- `GET /api/bookings?stats=1` – Admin dashboard stats (counts + revenue)
- `POST /api/bookings` / `PUT /api/bookings?id=...` / `DELETE /api/bookings?id=...`
- `GET /api/clients` – Admin: list clients (`clients` table)

## 🎨 Implemented Features (Summary)

- **Public site**
  - Responsive layout, hero, services, testimonials
  - Multi-step contact flow with inline errors and thank-you page
- **Admin panel**
  - Protected `/admin` route (token in localStorage)
  - Dashboard stats (bookings + revenue)
  - Bookings and clients lists with update/delete actions
  - Contact submissions view backed by Supabase

## 🐛 Troubleshooting

- **Contact form 500 / 404**
  - Check `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and email env vars in Vercel.
- **Admin login fails for correct credentials**
  - Verify `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `JWT_SECRET` are set in the API environment.
- **Supabase data not appearing in admin**
  - Confirm tables exist (`bookings`, `clients`, `contact_submissions`) and your service role key has access.

## 📄 License

This project is licensed under the MIT License.

---

**🔮 Tarot Reader 777 – Guiding Your Spiritual Journey**