import { APIError, ErrorHandler, RetryHandler, ResponseValidator } from './errorHandler';

// API service with error handling and retry logic
export class APIService {
  private static readonly BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://your-production-domain.com' 
    : 'http://localhost:3001';

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {},
    context?: string
  ): Promise<T> {
    const url = `${this.BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new APIError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      ResponseValidator.validate(data);
      
      return data;
    } catch (error) {
      throw ErrorHandler.handle(error, context);
    }
  }

  static async verifyPayment(paymentData: {
    orderId: string;
    amount: number;
    upiId: string;
    utr: string;
    payerName?: string;
    paidAmount?: number;
    paidAt?: string;
  }) {
    return RetryHandler.retry(
      async () => {
        ResponseValidator.validatePaymentData(paymentData);
        return this.request('/api/payments', {
          method: 'POST',
          body: JSON.stringify(paymentData),
        }, 'Payment Verification');
      },
      3,
      1000,
      'Payment Verification'
    );
  }

  static async getPayment(utr?: string, orderId?: string) {
    const params = new URLSearchParams();
    if (utr) params.append('utr', utr);
    if (orderId) params.append('orderId', orderId);
    
    return this.request(`/api/payments?${params.toString()}`, {}, 'Get Payment');
  }

  static async getPaymentStats() {
    return this.request('/api/payments/stats', {}, 'Get Payment Stats');
  }

  static async clearPayments() {
    return this.request('/api/payments', { method: 'DELETE' }, 'Clear Payments');
  }

  static async healthCheck() {
    return this.request('/health', {}, 'Health Check');
  }
}

// Export singleton instance
export const apiService = APIService;
