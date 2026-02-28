# 🖥️ GUI Setup Guide - Run Backend Model Locally

## 📋 **Prerequisites**

### **Required Software:**
- **Node.js** (v18+) - [Download Here](https://nodejs.org/)
- **Git** - [Download Here](https://git-scm.com/)
- **Code Editor** - VS Code recommended

### **Database Setup:**
- **Supabase Account** - [Create Free Account](https://supabase.com/)
- **SendGrid Account** - [Create Free Account](https://sendgrid.com/)

---

## 🚀 **Method 1: VS Code Terminal GUI (Recommended)**

### **Step 1: Open Project in VS Code**
```bash
# Navigate to project directory
cd d:\abhisheksajwan\project\2reader\Reader777

# Open in VS Code
code .
```

### **Step 2: Setup Environment**
```bash
# Copy environment file
cd api
cp .env.example .env

# Edit .env file with your credentials
# Click on .env file in VS Code to edit
```

### **Step 3: Install Dependencies**
```bash
# Open VS Code terminal (Ctrl+`)
cd api
npm install
```

### **Step 4: Start Server**
```bash
# In VS Code terminal
npm run dev
```

**VS Code will show:**
```
🚀 Development API server running on http://localhost:3001
📊 Health check: http://localhost:3001/api/health
🔐 Login endpoint: http://localhost:3001/api/auth/login
```

---

## 🖥️ **Method 2: Postman GUI (API Testing)**

### **Step 1: Install Postman**
- Download: [https://www.postman.com/downloads/](https://www.postman.com/downloads/)
- Create account (optional)

### **Step 2: Import Collection**
Create a new collection with these endpoints:

#### **Health Check:**
```json
{
  "name": "Health Check",
  "request": {
    "method": "GET",
    "header": [],
    "url": {
      "raw": "http://localhost:3001/api/health"
    }
  }
}
```

#### **Login:**
```json
{
  "name": "Admin Login",
  "request": {
    "method": "POST",
    "header": [
      {
        "key": "Content-Type",
        "value": "application/json"
      }
    ],
    "body": {
      "mode": "raw",
      "raw": "{\n  \"email\": \"admin@tarot777.com\",\n  \"password\": \"admin123\"\n}"
    },
    "url": {
      "raw": "http://localhost:3001/api/auth/login"
    }
  }
}
```

#### **Contact Form:**
```json
{
  "name": "Submit Contact",
  "request": {
    "method": "POST",
    "header": [
      {
        "key": "Content-Type",
        "value": "application/json"
      }
    ],
    "body": {
      "mode": "raw",
      "raw": "{\n  \"name\": \"Test User\",\n  \"email\": \"test@example.com\",\n  \"phone\": \"1234567890\",\n  \"reason\": \"general\",\n  \"preferredContact\": \"email\",\n  \"message\": \"This is a test message\"\n}"
    },
    "url": {
      "raw": "http://localhost:3001/api/contact"
    }
  }
}
```

### **Step 3: Test API**
1. Start local server (see Method 1)
2. Send requests in Postman
3. View responses in GUI

---

## 🌐 **Method 3: Browser GUI (Web Interface)**

### **Step 1: Start Server**
```bash
cd d:\abhisheksajwan\project\2reader\Reader777\api
npm run dev
```

### **Step 2: Open Browser GUIs**

#### **Health Check:**
```
Open: http://localhost:3001/api/health
```

#### **Email Test:**
```
Open: http://localhost:3001/api/test-email
```

#### **API Documentation:**
```
Install: npm install -g swagger-ui-express
Then visit: http://localhost:3001/api-docs
```

---

## 🛠️ **Method 4: Insomnia GUI (Alternative to Postman)**

### **Step 1: Install Insomnia**
- Download: [https://insomnia.rest/download](https://insomnia.rest/download/)

### **Step 2: Setup Workspace**
1. Create new workspace
2. Add environment variables:
   - `BASE_URL`: `http://localhost:3001`
3. Import requests using same JSON as Postman

---

## 📊 **Method 5: Database GUI (Supabase Dashboard)**

### **Step 1: Access Supabase Dashboard**
```
Go to: https://app.supabase.com
Login with your account
```

### **Step 2: View Data**
1. Click on your project
2. Navigate to **Table Editor**
3. View tables:
   - `admins`
   - `bookings`
   - `clients`
   - `contact_submissions`

### **Step 3: SQL GUI**
```sql
-- Run queries directly in dashboard
SELECT * FROM contact_submissions ORDER BY created_at DESC;
SELECT * FROM bookings WHERE status = 'pending';
```

---

## 🔧 **Environment Configuration**

### **Create .env file:**
```bash
# Navigate to API directory
cd d:\abhisheksajwan\project\2reader\Reader777\api

# Copy example file
copy .env.example .env

# Edit with your credentials
notepad .env
```

### **Required Variables:**
```env
# Get from Supabase Project Settings
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Create any secure string
JWT_SECRET=your-super-secret-jwt-key

# Get from SendGrid API Settings
SENDGRID_API_KEY=SG.your-sendgrid-key
FROM_EMAIL=noreply@yourdomain.com
```

---

## 🐛 **GUI Debugging Tools**

### **VS Code Debug GUI:**
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug API",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/api/dev-server.js",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "restart": true,
      "runtimeExecutable": "node"
    }
  ]
}
```

### **Chrome DevTools GUI:**
1. Start server
2. Open Chrome DevTools (F12)
3. Network tab to see API calls
4. Console tab for logs

---

## 📱 **Mobile GUI Testing**

### **React Native GUI:**
```bash
# Install Expo CLI
npm install -g @expo/cli

# Test API from mobile
npx create-expo-app api-test
```

### **Progressive Web App GUI:**
```bash
# Install PWA tools
npm install -g @angular/cli
ng new api-test-gui
```

---

## 🎯 **Quick Start Commands**

### **One-Command Setup:**
```bash
# Clone and setup everything
git clone <your-repo>
cd Reader777/api
npm install
cp .env.example .env
npm run dev
```

### **GUI Testing Commands:**
```bash
# Health check
curl http://localhost:3001/api/health

# Test login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tarot777.com","password":"admin123"}'

# Test contact
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","reason":"general","preferredContact":"email","message":"Hello"}'
```

---

## 🔍 **GUI Monitoring**

### **Process Monitor (Windows):**
```bash
# Task Manager GUI
Ctrl+Shift+Esc

# Resource Monitor
perfmon /res
```

### **Log Viewer GUI:**
```bash
# Windows Event Viewer
eventvwr.msc

# Or use VS Code terminal output
```

---

## 📞 **Troubleshooting GUI Issues**

### **Port Already in Use:**
```bash
# Check what's using port 3001
netstat -ano | findstr :3001

# Kill process
taskkill /PID <PID> /F
```

### **Environment Variables Not Loading:**
1. Verify `.env` file exists in `/api` directory
2. Check file name (no .env.txt extension)
3. Restart VS Code

### **Database Connection Issues:**
1. Check Supabase URL in `.env`
2. Verify service role key
3. Test connection in Supabase dashboard

---

## 🎉 **Success Indicators**

### **Server Running Successfully:**
```
🚀 Development API server running on http://localhost:3001
📊 Health check: http://localhost:3001/api/health
🔐 Login endpoint: http://localhost:3001/api/auth/login
📅 Bookings endpoint: http://localhost:3001/api/bookings
📧 Email test: http://localhost:3001/api/test-email
```

### **GUI Access Points:**
- **API Base URL:** http://localhost:3001
- **Health Check:** http://localhost:3001/api/health
- **Admin Login:** http://localhost:3001/api/auth/login
- **Contact Form:** http://localhost:3001/api/contact
- **Database:** https://app.supabase.com

Choose your preferred GUI method and start developing! 🚀
