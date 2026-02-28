import json
from http.server import BaseHTTPRequestHandler

class ContactSubmissionsHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        # Demo data for contact submissions
        demo_submissions = [
            {
                'id': '1',
                'name': 'John Doe',
                'email': 'john@example.com',
                'phone': '9876543210',
                'reason': 'love',
                'preferredContact': 'email',
                'message': 'I need help with my love life',
                'selectedService': 'Love Reading',
                'servicePrice': '1200',
                'status': 'new',
                'createdAt': '2024-02-14T10:00:00Z'
            },
            {
                'id': '2',
                'name': 'Jane Smith',
                'email': 'jane@example.com',
                'phone': '9876543211',
                'reason': 'career',
                'preferredContact': 'phone',
                'message': 'Want to know about my career prospects',
                'selectedService': 'Career Guidance',
                'servicePrice': '1500',
                'status': 'new',
                'createdAt': '2024-02-14T11:00:00Z'
            }
        ]
        
        response = {'success': True, 'data': demo_submissions}
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode('utf-8'))

    def do_POST(self):
        # Add new submission
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
            new_submission = {
                'id': str(len(demo_submissions) + 1),
                **data,
                'status': 'new',
                'createdAt': f'{__import__("datetime").datetime.now().isoformat()}Z'
            }
            
            response = {'success': True, 'data': new_submission}
            
        except Exception as e:
            response = {'success': False, 'error': str(e)}
        
        self.send_response(201)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode('utf-8'))

def handler(request):
    return ContactSubmissionsHandler()(request)
