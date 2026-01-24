# UPI Payment Implementation Guide

This guide explains how to use the new UPI QR payment system that replaces Razorpay in the Reader777 Tarot application.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
# Option 1: Run both frontend and backend together
npm run dev:full

# Option 2: Run them separately (in different terminals)
npm run server  # Backend API on port 3001
npm run dev     # Frontend on port 5174
```

### 3. Test the Payment Flow
1. Navigate to the booking page and complete a booking
2. You'll be redirected to the UPI payment page
3. Scan the QR code or copy the UPI ID
4. Complete a test payment (you can use any UPI app)
5. Enter the UTR (transaction reference number)
6. Submit to verify the payment

## 📱 Payment Flow

### User Experience
1. **QR Code Display**: Shows scannable QR code with payment amount
2. **UPI ID Copy**: One-click copy of UPI ID for manual payment
3. **Payment Instructions**: Step-by-step guide for users
4. **UTR Submission**: Form to enter transaction reference number
5. **Payment Verification**: Automatic validation and confirmation

### Technical Flow
1. User completes UPI payment via any UPI app
2. User enters UTR (12-digit transaction reference)
3. Frontend validates UTR format and checks for duplicates
4. POST request to `/api/payments` with payment details
5. Backend validates UTR, checks for duplicates, verifies amount
6. Payment stored in database (Supabase) and status updated
7. Confirmation email sent to user
8. Redirect to confirmation page

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the project root:

```env
# Supabase Database
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# SendGrid Email Service
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@yourdomain.com

# Application
NODE_ENV=development
```

### UPI Payment Details
Update these constants in `src/pages/PaymentPage.tsx`:

```typescript
// Sample UPI details - replace with actual values
const upiId = 'mysticaltarot@ybl';
const qrImageUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=mysticaltarot@ybl&pn=Mystical%20Tarot&am=999&cu=INR';
```

## 📊 API Endpoints

### POST /api/payments
Verifies UPI payment and stores payment record.

**Request Body:**
```json
{
  "orderId": "booking_123456",
  "amount": 999,
  "upiId": "mysticaltarot@ybl",
  "utr": "123456789012",
  "payerName": "John Doe",
  "paidAmount": 999,
  "paidAt": "2024-01-15T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "payment": {
    "id": "upi_1642234567890_abc123",
    "orderId": "booking_123456",
    "utr": "123456789012",
    "status": "verified",
    "verifiedAt": "2024-01-15T10:31:00Z"
  }
}
```

### GET /api/payments
Retrieve payment status by UTR or order ID.

**Query Parameters:**
- `utr`: Transaction reference number
- `orderId`: Booking order ID

**Response:**
```json
{
  "success": true,
  "payment": {
    "id": "upi_1642234567890_abc123",
    "orderId": "booking_123456",
    "utr": "123456789012",
    "status": "verified",
    "verifiedAt": "2024-01-15T10:31:00Z"
  }
}
```

### GET /api/payments/stats
Get payment statistics and recent payments.

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 25,
    "verified": 25,
    "totalAmount": 24975,
    "recentPayments": [...]
  }
}
```

### DELETE /api/payments
Clear all payments (for testing only).

## 🛡️ Security Features

### Client-Side Validation
- **UTR Format Validation**: Must be at least 12 digits
- **Duplicate UTR Check**: Prevents submitting same UTR twice
- **Amount Validation**: Ensures paid amount matches required amount
- **Form Validation**: All required fields must be filled

### Server-Side Validation
- **UTR Uniqueness**: Database-level duplicate prevention
- **Amount Verification**: Server-side amount matching
- **Request Validation**: Required field validation
- **Error Handling**: Comprehensive error responses

### Data Protection
- **HTTPS Required**: All payment data transmitted securely
- **Input Sanitization**: All inputs validated and sanitized
- **Rate Limiting**: Prevents spam payment attempts (can be added)
- **Audit Trail**: All payment attempts logged

## 🎨 UI Components

### Payment Form Fields
- **UTR (Required)**: 12+ digit transaction reference
- **Payer Name (Optional)**: Name from UPI app
- **Paid Amount**: Auto-filled with booking amount
- **Payment Date/Time**: Current time by default
- **Confirmation Checkbox**: Must be checked to submit

### Visual Elements
- **QR Code**: Scannable payment QR code
- **Copy Button**: One-click UPI ID copy
- **Instructions**: Step-by-step payment guide
- **Loading States**: Visual feedback during processing
- **Success Animation**: Confirmation after successful payment

### Responsive Design
- **Mobile Optimized**: Works perfectly on mobile devices
- **Touch Friendly**: Large tap targets for mobile users
- **Readable Text**: High contrast for accessibility
- **Flexible Layout**: Adapts to different screen sizes

## 🧪 Testing

### Manual Testing
1. **Test Payment Flow**: Complete end-to-end payment process
2. **Invalid UTR**: Try submitting invalid UTR formats
3. **Duplicate UTR**: Test duplicate prevention
4. **Amount Mismatch**: Test with different amounts
5. **Network Errors**: Test API failure scenarios

### API Testing
```bash
# Test health check
curl http://localhost:3001/health

# Test payment verification
curl -X POST http://localhost:3001/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "test_123",
    "amount": 999,
    "upiId": "test@upi",
    "utr": "123456789012",
    "payerName": "Test User"
  }'

# Test payment lookup
curl "http://localhost:3001/api/payments?utr=123456789012"
```

## 🚀 Production Deployment

### Backend Setup
1. **Environment Variables**: Set production environment variables
2. **Database**: Configure Supabase for production
3. **HTTPS**: Enable SSL/TLS for secure connections
4. **Rate Limiting**: Implement rate limiting middleware
5. **Logging**: Set up comprehensive logging

### Frontend Setup
1. **Build**: `npm run build` to create production build
2. **Environment**: Set production environment variables
3. **CDN**: Serve static assets via CDN
4. **Monitoring**: Set up error tracking and analytics

### Security Considerations
- **API Keys**: Store securely in environment variables
- **Database Security**: Use Supabase RLS policies
- **Input Validation**: Validate all user inputs
- **Error Handling**: Don't expose sensitive information
- **Monitoring**: Monitor for suspicious activity

## 🔍 Troubleshooting

### Common Issues

**"Invalid UTR format"**
- Ensure UTR is at least 12 digits
- Check for extra spaces or characters
- Use only numeric characters

**"UTR already used"**
- Each UTR can only be used once
- Check if payment was already processed
- Contact support if needed

**"Amount mismatch"**
- Ensure exact amount is paid
- Check for any additional fees
- Verify currency and decimal places

**"API connection failed"**
- Check if backend server is running
- Verify port 3001 is available
- Check network connectivity

### Debug Mode
Add console logging for debugging:
```javascript
// In PaymentPage.tsx
console.log('Payment data:', paymentData);
console.log('API response:', result);
```

### Health Checks
Monitor system health:
```bash
# Check server status
curl http://localhost:3001/health

# Check payment stats
curl http://localhost:3001/api/payments/stats
```

## 📞 Support

For issues with UPI payment implementation:
1. Check browser console for JavaScript errors
2. Verify backend server is running
3. Check network requests in browser dev tools
4. Review server logs for API errors
5. Test with different UPI apps and banks

## 🔄 Migration from Razorpay

To migrate existing Razorpay implementation:
1. **Update PaymentPage**: Already done in this implementation
2. **Update Database**: New payment fields added to existing schema
3. **Email Templates**: Updated to work with UPI payments
4. **API Routes**: New UPI-specific endpoints
5. **Testing**: Comprehensive testing of new flow

The migration maintains all existing functionality while adding UPI support.
