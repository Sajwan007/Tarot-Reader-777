// Express API route for UPI payments
// In-memory storage for demo purposes (replace with database in production)
let payments = [];

export async function POST(request) {
  try {
    const { orderId, amount, upiId, utr, payerName, paidAmount, paidAt } = await request.json();

    // Validation
    if (!orderId || !amount || !upiId || !utr) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Missing required fields: orderId, amount, upiId, utr' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // UTR validation (should be at least 12 digits)
    if (!/^\d{12,}$/.test(utr)) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Invalid UTR format. UTR must be at least 12 digits.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check for duplicate UTR
    const existingPayment = payments.find(p => p.utr === utr);
    if (existingPayment) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'This UTR has already been used for a payment.' 
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Amount validation
    if (paidAmount && parseFloat(paidAmount) !== amount) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: `Paid amount (${paidAmount}) does not match required amount (${amount}).` 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create payment record
    const payment = {
      id: `upi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderId,
      amount,
      upiId,
      utr,
      payerName: payerName || 'Anonymous',
      paidAmount: paidAmount || amount,
      paidAt: paidAt || new Date().toISOString(),
      status: 'verified',
      createdAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString()
    };

    // Store payment (in-memory for demo)
    payments.push(payment);

    console.log('UPI Payment Verified:', {
      id: payment.id,
      orderId,
      utr,
      amount,
      status: payment.status
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Payment verified successfully',
      payment: {
        id: payment.id,
        orderId: payment.orderId,
        utr: payment.utr,
        status: payment.status,
        verifiedAt: payment.verifiedAt
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('UPI Payment API Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Internal server error during payment verification' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// GET endpoint for retrieving payment status
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const utr = url.searchParams.get('utr');
    const orderId = url.searchParams.get('orderId');

    if (utr) {
      // Find payment by UTR
      const payment = payments.find(p => p.utr === utr);
      if (payment) {
        return new Response(JSON.stringify({ 
          success: true, 
          payment 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } else if (orderId) {
      // Find payments by order ID
      const orderPayments = payments.filter(p => p.orderId === orderId);
      return new Response(JSON.stringify({ 
        success: true, 
        payments: orderPayments 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Payment not found' 
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('UPI Payment GET Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// DELETE endpoint for clearing payments (for testing)
export async function DELETE() {
  payments = [];
  return new Response(JSON.stringify({ 
    success: true, 
    message: 'All payments cleared' 
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
