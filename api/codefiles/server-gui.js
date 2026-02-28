#!/usr/bin/env node

/**
 * 🖥️ GUI Server Dashboard for Local Development
 * Provides a web interface to manage and test your API
 */

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import open from 'open';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env.local') });

const app = express();
const PORT = process.env.GUI_PORT || 3002;

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// GUI Routes
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔮 Tarot Reader 777 - Local API Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%);
            color: #ffffff; min-height: 100vh;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { 
            text-align: center; margin-bottom: 30px; 
            background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px;
            backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);
        }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .header p { opacity: 0.8; font-size: 1.1em; }
        .dashboard { 
            display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 20px; margin-bottom: 30px; 
        }
        .card { 
            background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(212,175,55,0.3); }
        .card h3 { color: #d4af37; margin-bottom: 15px; font-size: 1.3em; }
        .status { 
            display: inline-block; padding: 5px 15px; border-radius: 20px; 
            font-size: 0.9em; font-weight: bold; margin: 10px 0;
        }
        .status.online { background: #10b981; color: white; }
        .status.offline { background: #ef4444; color: white; }
        .btn { 
            background: #d4af37; color: #1a1a2e; border: none; padding: 12px 24px; 
            border-radius: 8px; cursor: pointer; font-size: 1em; font-weight: bold;
            text-decoration: none; display: inline-block; margin: 10px 5px;
            transition: all 0.3s ease;
        }
        .btn:hover { background: #f59e0b; transform: translateY(-2px); }
        .btn.secondary { background: #6b7280; }
        .btn.secondary:hover { background: #9ca3af; }
        .endpoint-list { max-height: 200px; overflow-y: auto; }
        .endpoint-item { 
            display: flex; justify-content: space-between; align-items: center;
            padding: 10px; margin: 5px 0; background: rgba(255,255,255,0.02);
            border-radius: 5px; font-family: monospace;
        }
        .logs { 
            background: #000000; padding: 15px; border-radius: 10px; 
            font-family: monospace; font-size: 0.9em; max-height: 300px; 
            overflow-y: auto; color: #00ff00;
        }
        .metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .metric { text-align: center; padding: 15px; }
        .metric-number { font-size: 2em; font-weight: bold; color: #d4af37; }
        .metric-label { opacity: 0.7; margin-top: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔮 Tarot Reader 777</h1>
            <p>Local API Development Dashboard</p>
            <p><strong>API Server:</strong> http://localhost:3001</p>
            <p><strong>GUI Dashboard:</strong> http://localhost:${PORT}</p>
        </div>

        <div class="dashboard">
            <div class="card">
                <h3>🚀 Server Status</h3>
                <div id="serverStatus" class="status offline">Checking...</div>
                <button class="btn" onclick="checkServerStatus()">Refresh Status</button>
                <button class="btn secondary" onclick="window.open('http://localhost:3001/api/health')">Health Check</button>
            </div>

            <div class="card">
                <h3>🔗 API Endpoints</h3>
                <div class="endpoint-list">
                    <div class="endpoint-item">
                        <span>GET /api/health</span>
                        <button class="btn" onclick="testEndpoint('health')">Test</button>
                    </div>
                    <div class="endpoint-item">
                        <span>POST /api/auth/login</span>
                        <button class="btn" onclick="testEndpoint('login')">Test</button>
                    </div>
                    <div class="endpoint-item">
                        <span>POST /api/contact</span>
                        <button class="btn" onclick="testEndpoint('contact')">Test</button>
                    </div>
                    <div class="endpoint-item">
                        <span>GET /api/bookings</span>
                        <button class="btn" onclick="testEndpoint('bookings')">Test</button>
                    </div>
                </div>
            </div>

            <div class="card">
                <h3>📊 Database Metrics</h3>
                <div class="metrics">
                    <div class="metric">
                        <div class="metric-number" id="contactCount">-</div>
                        <div class="metric-label">Contact Submissions</div>
                    </div>
                    <div class="metric">
                        <div class="metric-number" id="bookingCount">-</div>
                        <div class="metric-label">Total Bookings</div>
                    </div>
                </div>
                <button class="btn" onclick="refreshMetrics()">Refresh Metrics</button>
            </div>

            <div class="card">
                <h3>🌐 Quick Links</h3>
                <button class="btn" onclick="window.open('http://localhost:3001/api/health')">🏥 Health Check</button>
                <button class="btn" onclick="window.open('http://localhost:3001/api/test-email')">📧 Test Email</button>
                <button class="btn secondary" onclick="window.open('https://app.supabase.com')">🗄️ Supabase Dashboard</button>
                <button class="btn secondary" onclick="window.open('https://app.postman.com/')">📮 Postman</button>
            </div>

            <div class="card">
                <h3>📝 Server Logs</h3>
                <div class="logs" id="serverLogs">
                    Loading logs...
                </div>
                <button class="btn" onclick="refreshLogs()">Refresh Logs</button>
                <button class="btn secondary" onclick="clearLogs()">Clear Logs</button>
            </div>
        </div>
    </div>

    <script>
        let logs = [];

        async function checkServerStatus() {
            try {
                const response = await fetch('http://localhost:3001/api/health');
                const data = await response.json();
                
                const statusEl = document.getElementById('serverStatus');
                if (response.ok) {
                    statusEl.textContent = '🟢 Online';
                    statusEl.className = 'status online';
                    addLog('✅ Server is online and responding');
                } else {
                    statusEl.textContent = '🔴 Offline';
                    statusEl.className = 'status offline';
                    addLog('❌ Server is not responding');
                }
            } catch (error) {
                const statusEl = document.getElementById('serverStatus');
                statusEl.textContent = '🔴 Offline';
                statusEl.className = 'status offline';
                addLog('❌ Cannot connect to server: ' + error.message);
            }
        }

        async function testEndpoint(endpoint) {
            const urls = {
                health: 'http://localhost:3001/api/health',
                login: 'http://localhost:3001/api/auth/login',
                contact: 'http://localhost:3001/api/contact',
                bookings: 'http://localhost:3001/api/bookings'
            };

            try {
                const options = {
                    method: endpoint === 'health' ? 'GET' : 'POST',
                    headers: { 'Content-Type': 'application/json' }
                };

                if (endpoint === 'login') {
                    options.body = JSON.stringify({
                        email: 'admin@tarot777.com',
                        password: 'admin123'
                    });
                } else if (endpoint === 'contact') {
                    options.body = JSON.stringify({
                        name: 'Test User',
                        email: 'test@example.com',
                        reason: 'general',
                        preferredContact: 'email',
                        message: 'This is a test message from GUI dashboard'
                    });
                }

                const response = await fetch(urls[endpoint], options);
                const data = await response.json();
                
                addLog(\`✅ \${endpoint.toUpperCase()} test successful: \${JSON.stringify(data)}\`);
            } catch (error) {
                addLog(\`❌ \${endpoint.toUpperCase()} test failed: \${error.message}\`);
            }
        }

        async function refreshMetrics() {
            try {
                // Get contact submissions count
                const { data: contacts } = await supabase
                    .from('contact_submissions')
                    .select('id', { count: 'exact' });

                // Get bookings count
                const { data: bookings } = await supabase
                    .from('bookings')
                    .select('id', { count: 'exact' });

                document.getElementById('contactCount').textContent = contacts || 0;
                document.getElementById('bookingCount').textContent = bookings || 0;
                
                addLog(\`📊 Metrics updated: \${contacts} contacts, \${bookings} bookings\`);
            } catch (error) {
                addLog('❌ Failed to fetch metrics: ' + error.message);
            }
        }

        function addLog(message) {
            const timestamp = new Date().toLocaleTimeString();
            const logMessage = \`[\${timestamp}] \${message}\`;
            logs.unshift(logMessage);
            
            // Keep only last 50 logs
            if (logs.length > 50) logs = logs.slice(0, 50);
            
            updateLogsDisplay();
        }

        function updateLogsDisplay() {
            const logsEl = document.getElementById('serverLogs');
            logsEl.innerHTML = logs.join('\\n');
        }

        function refreshLogs() {
            updateLogsDisplay();
            addLog('📝 Logs refreshed');
        }

        function clearLogs() {
            logs = [];
            updateLogsDisplay();
            addLog('🗑️ Logs cleared');
        }

        // Auto-check status every 30 seconds
        setInterval(checkServerStatus, 30000);
        
        // Initial load
        window.onload = function() {
            checkServerStatus();
            refreshMetrics();
            addLog('🚀 GUI Dashboard loaded successfully');
        };
    </script>
</body>
</html>
  `);
});

// API endpoint for GUI data
app.get('/api/gui-status', async (req, res) => {
  try {
    // Get database metrics
    const { data: contacts } = await supabase
      .from('contact_submissions')
      .select('id', { count: 'exact' });

    const { data: bookings } = await supabase
      .from('bookings')
      .select('id', { count: 'exact' });

    res.json({
      success: true,
      data: {
        contacts: contacts || 0,
        bookings: bookings || 0,
        server: 'running',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start GUI server
app.listen(PORT, async () => {
  console.log(`\n🖥️ GUI Dashboard started on http://localhost:${PORT}`);
  console.log(`📊 API Server should be running on http://localhost:3001`);
  console.log(`\n💡 GUI Features:`);
  console.log(`   - Server status monitoring`);
  console.log(`   - API endpoint testing`);
  console.log(`   - Database metrics`);
  console.log(`   - Real-time logs`);
  console.log(`   - Quick access links`);
  console.log(`\n🌐 Open GUI: http://localhost:${PORT}`);
  
  // Auto-open browser
  try {
    await open(`http://localhost:${PORT}`);
    console.log('🌐 GUI opened in default browser');
  } catch (error) {
    console.log('💡 Manually open: http://localhost:' + PORT);
  }
});
