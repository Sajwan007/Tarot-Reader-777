export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Demo data for bookings
  const demoBookings = [
    {
      id: '1',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '9876543210',
      service: 'Tarot Reading',
      date: '2024-02-15',
      time: '10:00 AM',
      status: 'confirmed',
      paymentStatus: 'paid',
      amount: 1500,
      createdAt: '2024-02-10T10:00:00Z'
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      customerPhone: '9876543211',
      service: 'Love Reading',
      date: '2024-02-16',
      time: '2:00 PM',
      status: 'pending',
      paymentStatus: 'pending',
      amount: 1200,
      createdAt: '2024-02-11T14:00:00Z'
    }
  ];

  // Demo stats
  const demoStats = {
    totalBookings: demoBookings.length,
    confirmed: demoBookings.filter(b => b.status === 'confirmed').length,
    pending: demoBookings.filter(b => b.status === 'pending').length,
    revenue: demoBookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.amount, 0)
  };

  if (req.method === 'GET') {
    if (req.query.stats) {
      // Return stats
      res.status(200).json({
        success: true,
        data: demoStats
      });
    } else {
      // Return all bookings
      res.status(200).json({
        success: true,
        data: demoBookings
      });
    }
  } else if (req.method === 'POST') {
    // Create new booking
    const newBooking = {
      id: String(demoBookings.length + 1),
      ...req.body,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json({
      success: true,
      data: newBooking
    });
  } else if (req.method === 'PUT') {
    // Update booking
    const bookingId = req.query.id;
    const updatedBooking = { ...req.body, id: bookingId };
    
    res.status(200).json({
      success: true,
      data: updatedBooking
    });
  } else if (req.method === 'DELETE') {
    // Delete booking
    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
