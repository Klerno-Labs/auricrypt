# API Documentation

**Base URL:** `https://your-domain.com/api`

This document outlines the REST API endpoints available in the Auricrypt Plumbing SaaS. All requests must include authentication headers unless accessing public endpoints.

## Authentication

Most endpoints require a Bearer token obtained via NextAuth session cookies or an API key for external integrations.

```http
Authorization: Bearer <token>
Cookie: next-auth.session-token=...
```

---

## Jobs / Scheduling

### Get Jobs
Retrieve a list of jobs. Supports filtering by date, status, and assigned technician.

*   **Endpoint:** `GET /jobs`
*   **Auth Required:** Yes (Staff, Manager, Owner)
*   **Query Params:**
    *   `status` (optional): `pending`, `in-progress`, `completed`, `cancelled`
    *   `dateFrom` (optional): ISO 8601 date string
    *   `dateTo` (optional): ISO 8601 date string
*   **Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "job_12345",
      "customerId": "cust_987",
      "address": "123 Main St, City, ST",
      "scheduledStart": "2023-10-25T09:00:00Z",
      "status": "pending",
      "description": "Leaky kitchen faucet",
      "assignedToId": "user_555"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 20
  }
}
```

### Create Job
Create a new job entry.

*   **Endpoint:** `POST /jobs`
*   **Auth Required:** Yes (Manager, Owner)
*   **Body:**

```json
{
  "customerId": "cust_987",
  "title": "Install Water Heater",
  "description": "Install 50gal Rheem heater in garage",
  "scheduledStart": "2023-10-26T10:00:00Z",
  "estimatedDuration": 120,
  "assignedToId": "user_555"
}
```

*   **Response:** `201 Created`

### Update Job Status
Change the status of a job (e.g., Clock in, Clock out).

*   **Endpoint:** `PATCH /jobs/:id/status`
*   **Auth Required:** Yes (Staff, Manager, Owner)
*   **Body:**

```json
{
  "status": "in-progress",
  "lat": 29.7604,
  "long": -95.3698
}
```

*   **Response:** `200 OK`

---

## Invoices & Payments

### Create Invoice
Generate an invoice for a specific job or ad-hoc.

*   **Endpoint:** `POST /invoices`
*   **Auth Required:** Yes (Staff, Manager, Owner)
*   **Body:**

```json
{
  "jobId": "job_12345",
  "customerId": "cust_987",
  "lineItems": [
    {
      "description": "Labor (2 hours)",
      "quantity": 2,
      "unitPrice": 150.00,
      "productId": "prod_111"
    },
    {
      "description": "Pipe Fitting 1/2\"",
      "quantity": 4,
      "unitPrice": 12.50,
      "productId": "prod_222"
    }
  ],
  "notes": "Please pay within 15 days."
}
```

*   **Response:** `201 Created`
    *   Returns the created invoice object including `stripePaymentIntentId`.

### Charge Invoice
Execute the payment immediately via Stripe.

*   **Endpoint:** `POST /invoices/:id/charge`
*   **Auth Required:** Yes (Staff, Manager, Owner)
*   **Body:**

```json
{
  "paymentMethodId": "pm_1234567890"
}
```

*   **Response:** `200 OK`

```json
{
  "success": true,
  "transactionId": "ch_1234567890",
  "status": "paid",
  "receiptUrl": "https://stripe.com/receipts/..."
}
```

---

## Inventory

### Get Truck Inventory
Get current inventory levels for a specific truck/user.

*   **Endpoint:** `GET /inventory/truck/:userId`
*   **Auth Required:** Yes (Staff, Manager, Owner)
*   **Response:** `200 OK`

```json
{
  "truckId": "truck_1",
  "items": [
    {
      "productId": "prod_222",
      "name": "Pipe Fitting 1/2\"",
      "quantityOnHand": 45,
      "reorderLevel": 10
    }
  ]
}
```

### Update Inventory
Deduct inventory used during a job or restock.

*   **Endpoint:** `PATCH /inventory/update`
*   **Auth Required:** Yes (Staff, Manager, Owner)
*   **Body:**

```json
{
  "jobId": "job_12345",
  "updates": [
    { "productId": "prod_222", "quantityUsed": 4 },
    { "productId": "prod_333", "quantityAdded": 10 }
  ]
}
```

*   **Response:** `200 OK`

---

## Webhooks

### Stripe Webhook
Handle events from Stripe (payment succeeded, failed, etc.).

*   **Endpoint:** `POST /webhooks/stripe`
*   **Auth Required:** No (Signature verification used)
*   **Events Handled:** `payment_intent.succeeded`, `payment_intent.payment_failed`, `invoice.payment_succeeded`

---

## Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request (Validation error) |
| 401  | Unauthorized |
| 403  | Forbidden (Insufficient permissions) |
| 404  | Not Found |
| 500  | Internal Server Error |

Error Response Format:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": { ... }
  }
}
```