import json
from http.server import BaseHTTPRequestHandler

class LoginHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
            email = data.get('email', '')
            password = data.get('password', '')
            
            # Demo credentials
            if email == 'admin@tarot777.com' and password == 'admin123':
                token = f'demo-token-{int(__import__("time").time())}'
                admin_user = {
                    'id': 1,
                    'email': 'admin@tarot777.com',
                    'name': 'Admin User'
                }
                
                response = {
                    'success': True,
                    'data': {
                        'token': token,
                        'admin': admin_user
                    }
                }
            else:
                response = {
                    'success': False,
                    'error': 'Invalid credentials'
                }
                
        except Exception as e:
            response = {
                'success': False,
                'error': str(e)
            }
        
        self.send_response(200 if response.get('success') else 401)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode('utf-8'))

def handler(request):
    return LoginHandler()(request)
