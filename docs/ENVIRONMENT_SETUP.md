# Environment Setup Guide

This guide details the environment variables required to run the Auricrypt Plumbing SaaS.

## 1. Prerequisites

You will need accounts/API keys for the following services:
-   **Database:** Vercel Postgres or Neon
-   **Authentication:** Google Cloud Console
-   **Payments:** Stripe
-   **Email:** Resend or SendGrid

## 2. Environment Variables

Create a `.env.local` file in the root of your project. Add the following variables:

### Database

```env
# Database Connection String (provided by Vercel/Neon)
DATABASE_URL="postgres://user:password@host:port/database?sslmode=require"
```

### Authentication (NextAuth)

```env
# Secret key for encrypting sessions. Generate a random string.
NEXTAUTH_SECRET="your-super-secret-key-at-least-32-chars-long"

# The URL of your app (used for OAuth callbacks)
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth Credentials
# 1. Go to Google Cloud Console > APIs & Services > Credentials
# 2. Create OAuth 2.0 Client ID (Web application)
# 3. Add http://localhost:3000/api/auth/callback/google to Authorized redirect URIs
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Stripe Integration

```env
# Stripe Public Key (Publishable)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Stripe Secret Key
STRIPE_SECRET_KEY="sk_test_..."

# Stripe Webhook Secret (Found in Stripe Developers > Webhooks > Signing Secret)
STRIPE_WEBHOOK_SECRET="whsec_..."

# Your Stripe Price IDs for subscriptions or services (if applicable)
STRIPE_PRICE_ID_STANDARD="price_..."
```

### Email (Resend)

```env
# Resend API Key
RESEND_API_KEY="re_..."

# The email address from which system emails are sent
NEXT_PUBLIC_APP_EMAIL="noreply@auricrypt.com"
```

### Third Party: Google Calendar

```env
# Service Account JSON for Calendar Integration (Base64 encoded)
GOOGLE_SERVICE_ACCOUNT_KEY="base64_encoded_json_string"

# The Calendar ID to sync jobs with (usually user email or a shared calendar ID)
GOOGLE_CALENDAR_ID="primary"
```

## 3. Third-Party Setup Instructions

### Setting up Stripe

1.  Log in to the [Stripe Dashboard](https://dashboard.stripe.com/).
2.  Navigate to **Developers** > **API keys**.
3.  Copy the **Publishable key** to `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
4.  Copy the **Secret key** to `STRIPE_SECRET_KEY`.
5.  **Webhooks:** Go to **Developers** > **Webhooks**.
    *   Click "Add endpoint".
    *   Endpoint URL: `https://your-domain.com/api/webhooks/stripe`.
    *   Select events to send: `payment_intent.succeeded`, `payment_intent.payment_failed`.
    *   Copy the **Signing secret** to `STRIPE_WEBHOOK_SECRET`.

### Setting up Google OAuth

1.  Go to [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project (or select existing).
3.  Enable **Google+ API**.
4.  Go to **Credentials** > **Create Credentials** > **OAuth client ID**.
5.  Application type: **Web application**.
6.  Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`.
7.  Copy Client ID and Secret to your `.env.local`.

### Setting up Google Calendar API (Server-side)

1.  In Google Cloud Console, enable the **Google Calendar API**.
2.  Go to **Credentials** > **Create Credentials** > **Service account**.
3.  Download the JSON key file.
4.  **IMPORTANT:** Do not commit this JSON file to Git.
5.  Convert the JSON file content to a Base64 string.
    *   Mac: `base64 -i service-account.json`
    *   Linux: `base64 -w 0 service-account.json`
6.  Paste the resulting string into `GOOGLE_SERVICE_ACCOUNT_KEY`.
7.  Share the specific Google Calendar with the `client_email` found in the JSON key file (giving it "Editor" permissions).

## 4. Running Migrations

Once environment variables are set, initialize your database:

```bash
npm run db:push
```

This will create all necessary tables (Users, Jobs, Invoices, Inventory, etc.) in your PostgreSQL database.