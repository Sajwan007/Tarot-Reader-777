export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Demo data for clients
  const demoClients = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      totalBookings: 3,
      totalSpent: 4500,
      lastBooking: '2024-02-15',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '9876543211',
      totalBookings: 2,
      totalSpent: 2400,
      lastBooking: '2024-02-16',
      createdAt: '2024-01-20T14:00:00Z'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '9876543212',
      totalBookings: 1,
      totalSpent: 1500,
      lastBooking: '2024-02-10',
      createdAt: '2024-02-01T09:00:00Z'
    }
  ];

  if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      data: demoClients
    });
  } else if (req.method === 'POST') {
    // Create new client
    const newClient = {
      id: String(demoClients.length + 1),
      ...req.body,
      totalBookings: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json({
      success: true,
      data: newClient
    });
  } else if (req.method === 'PUT') {
    // Update client
    const clientId = req.query.id;
    const updatedClient = { ...req.body, id: clientId };
    
    res.status(200).json({
      success: true,
      data: updatedClient
    });
  } else if (req.method === 'DELETE') {
    // Delete client
    res.status(200).json({
      success: true,
      message: 'Client deleted successfully'
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
