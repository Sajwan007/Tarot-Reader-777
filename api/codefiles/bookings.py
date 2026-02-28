import json
from http.server import BaseHTTPRequestHandler

class BookingsHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        # Demo data for bookings
        demo_bookings = [
            {
                'id': '1',
                'customerName': 'John Doe',
                'customerEmail': 'john@example.com',
                'customerPhone': '9876543210',
                'service': 'Tarot Reading',
                'date': '2024-02-15',
                'time': '10:00 AM',
                'status': 'confirmed',
                'paymentStatus': 'paid',
                'amount': 1500,
                'createdAt': '2024-02-10T10:00:00Z'
            },
            {
                'id': '2',
                'customerName': 'Jane Smith',
                'customerEmail': 'jane@example.com',
                'customerPhone': '9876543211',
                'service': 'Love Reading',
                'date': '2024-02-16',
                'time': '2:00 PM',
                'status': 'pending',
                'paymentStatus': 'pending',
                'amount': 1200,
                'createdAt': '2024-02-11T14:00:00Z'
            }
        ]
        
        # Demo stats
        demo_stats = {
            'totalBookings': len(demo_bookings),
            'confirmed': len([b for b in demo_bookings if b['status'] == 'confirmed']),
            'pending': len([b for b in demo_bookings if b['status'] == 'pending']),
            'revenue': sum([b['amount'] for b in demo_bookings if b['paymentStatus'] == 'paid'])
        }
        
        # Check if requesting stats
        if self.path.endswith('/stats'):
            response = {'success': True, 'data': demo_stats}
        else:
            response = {'success': True, 'data': demo_bookings}
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode('utf-8'))

    def do_POST(self):
        # Create new booking
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
            new_booking = {
                'id': str(len(demo_bookings) + 1),
                **data,
                'status': 'pending',
                'paymentStatus': 'pending',
                'createdAt': f'{__import__("datetime").datetime.now().isoformat()}Z'
            }
            
            response = {'success': True, 'data': new_booking}
            
        except Exception as e:
            response = {'success': False, 'error': str(e)}
        
        self.send_response(201)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode('utf-8'))

def handler(request):
    return BookingsHandler()(request)
