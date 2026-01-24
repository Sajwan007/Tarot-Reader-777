// Custom error classes for better error handling
export class DatabaseError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class SupabaseError extends DatabaseError {
  constructor(message: string, public originalError?: any) {
    super(message, originalError);
    this.name = 'SupabaseError';
  }
}

export class LocalStorageError extends DatabaseError {
  constructor(message: string, public originalError?: any) {
    super(message, originalError);
    this.name = 'LocalStorageError';
  }
}

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public originalError?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends APIError {
  constructor(message: string, public field?: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends APIError {
  constructor(message: string) {
    super(message, 0);
    this.name = 'NetworkError';
  }
}

// Error handler utility
export class ErrorHandler {
  static log(error: Error, context?: string) {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';
    
    console.error(`${timestamp} ${contextStr} ${error.name}: ${error.message}`, {
      stack: error.stack,
      originalError: (error as any).originalError,
      status: (error as any).status
    });
  }

  static handle(error: any, context?: string): APIError {
    this.log(error, context);

    // Handle different error types
    if (error instanceof APIError) {
      return error;
    }

    if (error instanceof DatabaseError) {
      return new APIError('Database operation failed', 500, error);
    }

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return new NetworkError('Network connection failed');
    }

    if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
      return new APIError('Invalid response format', 500, error);
    }

    // Default fallback
    return new APIError('An unexpected error occurred', 500, error);
  }

  static getUserFriendlyMessage(error: APIError): string {
    switch (error.name) {
      case 'ValidationError':
        return error.message;
      
      case 'NetworkError':
        return 'Please check your internet connection and try again.';
      
      case 'DatabaseError':
      case 'SupabaseError':
        return 'Unable to save data. Please try again later.';
      
      case 'LocalStorageError':
        return 'Unable to access local storage. Please check your browser settings.';
      
      default:
        if (error.status === 500) {
          return 'Something went wrong. Please try again later.';
        }
        return error.message || 'An unexpected error occurred.';
    }
  }
}

// Retry utility for failed operations
export class RetryHandler {
  static async retry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000,
    context?: string
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = ErrorHandler.handle(error, context);
        
        if (attempt === maxRetries) {
          throw lastError;
        }

        // Don't retry on validation errors or 4xx status codes
        if (lastError instanceof ValidationError || 
            ((lastError as any).status && (lastError as any).status >= 400 && (lastError as any).status < 500)) {
          throw lastError;
        }

        console.log(`Retry attempt ${attempt}/${maxRetries} for ${context || 'operation'}`);
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }

    throw lastError!;
  }
}

// API response validator
export class ResponseValidator {
  static validate(response: any): void {
    if (!response) {
      throw new APIError('Empty response received');
    }

    if (typeof response !== 'object') {
      throw new APIError('Invalid response format');
    }

    // Check for API error responses
    if (response.success === false) {
      throw new APIError(response.message || 'API request failed', response.status);
    }

    // Check for Supabase errors
    if (response.error) {
      throw new SupabaseError(response.error.message, response.error);
    }
  }

  static validatePaymentData(data: any): void {
    const required = ['orderId', 'amount', 'utr'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      throw new ValidationError(`Missing required fields: ${missing.join(', ')}`);
    }

    if (!/^\d{12,}$/.test(data.utr)) {
      throw new ValidationError('UTR must be at least 12 digits', 'utr');
    }

    if (data.amount && (isNaN(data.amount) || data.amount <= 0)) {
      throw new ValidationError('Amount must be a positive number', 'amount');
    }
  }

  static validateBookingData(data: any): void {
    const required = ['customer_name', 'customer_email', 'service_name', 'booking_date', 'booking_time'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      throw new ValidationError(`Missing required fields: ${missing.join(', ')}`);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.customer_email)) {
      throw new ValidationError('Invalid email address', 'customer_email');
    }

    // Phone validation (optional but if provided, should be valid)
    if (data.customer_phone) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(data.customer_phone)) {
        throw new ValidationError('Invalid phone number', 'customer_phone');
      }
    }
  }
}
