// Mock API handlers for development
// In production, these would be actual server endpoints

export const mockCreateOrder = async (options: any) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    orderId: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    amount: options.amount * 100, // Convert to paise
    currency: options.currency || 'INR',
    receipt: options.receipt,
    notes: options.notes,
    keyId: 'rzp_test_1234567890abcdef', // Test key - replace with actual
    createdAt: new Date().toISOString()
  };
};

export const mockVerifyPayment = async (paymentResponse: any) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock verification - always succeed for demo
  return {
    success: true,
    orderId: paymentResponse.razorpay_order_id,
    paymentId: paymentResponse.razorpay_payment_id,
    status: 'paid',
    verifiedAt: new Date().toISOString()
  };
};
