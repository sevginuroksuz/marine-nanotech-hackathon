# YachtDrop Backend Setup

## Features Added ✅

1. **Order Management API**
   - `/api/orders` - Create and list orders
   - Orders saved to `data/orders.json`
   - Full validation

2. **Email Notifications** 
   - Automatic email on order creation
   - Uses [Resend.com](https://resend.com) (free tier: 100 emails/day)
   - Falls back to console logging in dev

3. **Payment Processing (PayTR)**
   - `/api/payment/paytr` - Payment initialization
   - `/api/payment/paytr-callback` - Webhook handler
   - Secure iframe integration
   - Test & production modes
   - Auto-order updates on payment

4. **Order Tracking**
   - `/orders/[orderNumber]` - Track order status
   - Phone number lookup
   - Real-time status updates
   - Mobile-optimized UI

## Setup Instructions

### 1. PayTR Payment Gateway

**Sign up:** [PayTR.com](https://www.paytr.com)

```bash
# Get your credentials from PayTR dashboard:
# - Merchant ID
# - Merchant Key  
# - Merchant Salt

# Add to .env:
PAYTR_MERCHANT_ID=123456
PAYTR_MERCHANT_KEY=your_key_here
PAYTR_MERCHANT_SALT=your_salt_here
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

**Webhook Setup:**
- Login to PayTR dashboard
- Go to Settings → Callback URL
- Set: `https://yourdomain.com/api/payment/paytr-callback`
- PayTR will POST payment results here

### 2. Email Notifications (Optional)

**Free Tier:** [Resend.com](https://resend.com)

```bash
# Sign up at resend.com
# Get API key
# Add to .env:
RESEND_API_KEY=re_xxxxxxxxxxxx
NOTIFICATION_EMAIL=christian@marinenanotech.com
```

### 3. Redis Cache (Optional)

**Free Tier:** [Upstash Redis](https://upstash.com)

```bash
# Already configured in lib/cache.js
# Just add credentials:
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxx
```

## How It Works

### Order Flow

1. User fills checkout form (name, email, phone, marina, berth)
2. Frontend calls `/api/orders` (POST) - Order created
3. Order saved to `data/orders.json` with status "pending"
4. Frontend calls `/api/payment/paytr` (POST) - Get payment token
5. PayTR iframe opens for secure payment
6. User completes payment on PayTR
7. PayTR calls `/api/payment/paytr-callback` webhook
8. Order status updated to "confirmed", payment status → "paid"
9. Email notification sent (if configured)
10. User redirected to success page
11. User can track at `/orders/YD-12345`

### Demo Mode

Everything works **without** PayTR credentials:
- Orders saved locally
- Payment skipped (demo mode)
- Emails logged to console
- Tracking works fully

### Production Setup

1. Copy `.env.example` to `.env`
2. Add PayTR credentials
3. Set `NEXT_PUBLIC_BASE_URL` to your domain
4. Configure PayTR webhook URL
5. Deploy to Vercel/Netlify
6. Real payments work automatically!

## API Endpoints

### POST /api/orders
Create new order
```json
{
  "name": "Captain Hook",
  "email": "captain@example.com",
  "phone": "+34 600 123 456",
  "marina": "Port Vell, Barcelona",
  "berth": "Pontoon A, Berth 5",
  "mode": "delivery",
  "items": [...],
  "total": 249.99
}
```

### GET /api/orders?orderNumber=YD-12345
Get specific order by number

### GET /api/orders?phone=+34600123456
Get all orders by phone number

### POST /api/payment/paytr
Initialize PayTR payment
```json
{
  "orderNumber": "YD-12345",
  "total": 249.99,
  "name": "Captain Hook",
  "email": "captain@example.com",
  "phone": "+34 600 123 456"
}
```
Returns: `{ token: "...", iframeUrl: "https://..." }`

### POST /api/payment/paytr-callback
PayTR webhook (called automatically by PayTR after payment)

## Next Steps

- [ ] Test PayTR in sandbox mode
- [ ] Configure production PayTR credentials
- [ ] Set up webhook URL on PayTR dashboard  
- [ ] SMS notifications via Twilio
- [ ] Admin dashboard for orders
- [ ] Delivery driver app
- [ ] Real-time tracking with GPS

## PayTR Test Cards

**Test Mode Cards:**
- Success: `4508034508034509`
- 3D Secure: `5406697543211173`  
- Fail: `4540690000000010`

Expiry: Any future date  
CVV: Any 3 digits
