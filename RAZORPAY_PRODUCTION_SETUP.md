# Razorpay Production Setup Guide

This document outlines the requirements and manual steps necessary to deploy your Razorpay integration to production securely.

## 1. Environment Variables

### Frontend Variables (Safe for browser)
- `VITE_RAZORPAY_KEY_ID`: Must be set to your LIVE Razorpay Key ID (e.g., `rzp_live_...`).
- `VITE_SITE_URL`: Should point to your production URL (`https://biharbitemakhana.com`).

### Server Variables (SECRET - NEVER EXPOSE TO VITE)
- `RAZORPAY_KEY_ID`: Your LIVE Razorpay Key ID.
- `RAZORPAY_KEY_SECRET`: Your LIVE Razorpay Key Secret.
- `RAZORPAY_WEBHOOK_SECRET`: The webhook secret you configure in the Razorpay Dashboard.

**Where to configure these:**
In production, do **not** rely on the `.env` file. You must add all 5 variables into your hosting platform's environment settings (e.g., Vercel, Render, Heroku dashboard).

## 2. Backend Deployment Requirement
For the integration to work in production, the Node.js backend (`server.js`) must be hosted on a publicly accessible domain with HTTPS. 
- The frontend must point its `baseUrl` to this deployed backend API, **not** `localhost:5000`.
- The webhook endpoint must be accessible by Razorpay's servers.

## 3. Webhook Configuration (Razorpay Dashboard)
To ensure payment statuses are updated even if the user closes their browser early, configure the webhook in the Razorpay Dashboard:
1. Navigate to **Settings → Webhooks** in Razorpay.
2. Click **Add New Webhook**.
3. **Webhook URL**: Enter `https://<YOUR_BACKEND_DOMAIN>/api/payment/webhook` (e.g., `https://biharbitemakhana.com/api/payment/webhook`).
4. **Secret**: Enter the exact same secret you configured in your server's `RAZORPAY_WEBHOOK_SECRET` environment variable.
5. **Active Events**: Check the following events:
   - `order.paid`
   - `payment.captured`

## 4. How to Test a Production Payment Safely
1. Create a hidden test product priced at ₹1.
2. Proceed through the checkout on your live production site.
3. Complete the payment using UPI or a real card.
4. Verify the order appears as **Paid** in Supabase and the Admin Panel.
5. Verify the invoice generates correctly.

## 5. Verifying Operations
- **Supabase Orders**: Check the `orders` table. A successful transaction will have `paymentStatus: 'Paid'`, along with `razorpay_order_id` and `razorpay_payment_id`.
- **Admin Orders**: The Admin UI reads directly from Supabase, so it will automatically show the correct status.
- **Invoices**: The invoice generator reads the same Supabase row. It correctly isolates COD from online payments.

## 6. Troubleshooting
- If a payment succeeds but the order remains `Pending`, check your backend logs for Webhook processing failures or verify that the Razorpay Dashboard webhook is firing.
- If the payment modal fails to open, verify that `VITE_RAZORPAY_KEY_ID` is present in the frontend production environment.
