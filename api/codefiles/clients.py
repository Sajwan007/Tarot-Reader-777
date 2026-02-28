import json
from http.server import BaseHTTPRequestHandler

class ClientsHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        # Demo data for clients
        demo_clients = [
            {
                'id': '1',
                'name': 'John Doe',
                'email': 'john@example.com',
                'phone': '9876543210',
                'totalBookings': 3,
                'totalSpent': 4500,
                'lastBooking': '2024-02-15',
                'createdAt': '2024-01-15T10:00:00Z'
            },
            {
                'id': '2',
                'name': 'Jane Smith',
                'email': 'jane@example.com',
                'phone': '9876543211',
                'totalBookings': 2,
                'totalSpent': 2400,
                'lastBooking': '2024-02-16',
                'createdAt': '2024-01-20T14:00:00Z'
            },
            {
                'id': '3',
                'name': 'Mike Johnson',
                'email': 'mike@example.com',
                'phone': '9876543212',
                'totalBookings': 1,
                'totalSpent': 1500,
                'lastBooking': '2024-02-10',
                'createdAt': '2024-02-01T09:00:00Z'
            }
        ]
        
        response = {'success': True, 'data': demo_clients}
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode('utf-8'))

    def do_POST(self):
        # Create new client
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
            new_client = {
                'id': str(len(demo_clients) + 1),
                **data,
                'totalBookings': 0,
                'totalSpent': 0,
                'createdAt': f'{__import__("datetime").datetime.now().isoformat()}Z'
            }
            
            response = {'success': True, 'data': new_client}
            
        except Exception as e:
            response = {'success': False, 'error': str(e)}
        
        self.send_response(201)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode('utf-8'))

def handler(request):
    return ClientsHandler()(request)
