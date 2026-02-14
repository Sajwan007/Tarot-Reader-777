export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // In a real app, this would store in a database
  // For demo, we'll use in-memory storage
  let submissions = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      reason: 'love',
      preferredContact: 'email',
      message: 'I need help with my love life',
      selectedService: 'Love Reading',
      servicePrice: 1200,
      status: 'new',
      createdAt: '2024-02-14T10:00:00Z'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '9876543211',
      reason: 'career',
      preferredContact: 'phone',
      message: 'Want to know about my career prospects',
      selectedService: 'Career Reading',
      servicePrice: 1500,
      status: 'new',
      createdAt: '2024-02-14T11:00:00Z'
    }
  ];

  if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      data: submissions
    });
  } else if (req.method === 'POST') {
    // Add new submission from contact form
    const newSubmission = {
      id: String(submissions.length + 1),
      ...req.body,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    
    submissions.push(newSubmission);
    
    res.status(201).json({
      success: true,
      data: newSubmission
    });
  } else if (req.method === 'PUT') {
    // Update submission status
    const submissionId = req.query.id;
    const updatedSubmission = { ...req.body, id: submissionId };
    
    res.status(200).json({
      success: true,
      data: updatedSubmission
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
