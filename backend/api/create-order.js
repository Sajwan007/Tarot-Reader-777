// This would typically be a server-side API route
// For Vite development, we'll simulate this with a mock response
// In production, you'd use a proper backend server

export async function POST(request) {
  try {
    const { amount, currency = 'INR', receipt, notes } = await request.json();
    
    // Mock order creation - in production, this would call Razorpay API
    const mockOrder = {
      orderId: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: amount * 100, // Convert to paise
      currency,
      receipt,
      notes,
      keyId: 'rzp_test_1234567890', // Test key - replace with actual key
      createdAt: new Date().toISOString()
    };

    return new Response(JSON.stringify(mockOrder), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create order' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
