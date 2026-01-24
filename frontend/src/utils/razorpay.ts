import Razorpay from 'razorpay';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOrderOptions {
  amount: number;
  currency: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const loadRazorpayScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay script'));
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (options: RazorpayOrderOptions) => {
  try {
    // For development, use mock API
    if (process.env.NODE_ENV === 'development') {
      const { mockCreateOrder } = await import('../mocks/api');
      return await mockCreateOrder(options);
    }

    // For production, use real API
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error('Failed to create Razorpay order');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

export const verifyRazorpayPayment = async (paymentResponse: RazorpayPaymentResponse) => {
  try {
    // For development, use mock API
    if (process.env.NODE_ENV === 'development') {
      const { mockVerifyPayment } = await import('../mocks/api');
      return await mockVerifyPayment(paymentResponse);
    }

    // For production, use real API
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentResponse),
    });

    if (!response.ok) {
      throw new Error('Payment verification failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

export const openRazorpayCheckout = (
  orderData: any,
  options: {
    name: string;
    description: string;
    prefill: {
      name: string;
      email: string;
      contact: string;
    };
    theme: {
      color: string;
    };
    handler: (response: RazorpayPaymentResponse) => void;
    modal: {
      ondismiss: () => void;
    };
  }
) => {
  const razorpay = new window.Razorpay({
    key: orderData.keyId,
    order_id: orderData.orderId,
    ...options,
  });

  razorpay.open();
  return razorpay;
};
