# Auricrypt Plumbing SaaS

**Enterprise Edition v1.0.0**

A bespoke, full-stack workforce management solution built for Auricrypt. This application streamlines job scheduling, invoicing, inventory tracking, and payment processing for plumbing professionals.

## 🚀 Project Overview

This application is designed to replace manual paperwork with a digital-first workflow. It allows staff to view daily schedules via a calendar, manage truck inventory in real-time, and generate invoices with integrated Stripe payments directly from the field.

### Key Features

- **Role-Based Access Control (RBAC):** Secure 3-tiered system (Owner, Manager, Staff).
- **Interactive Dashboard:** Custom views based on user role.
- **Job Scheduling:** Google Calendar integration for syncing and viewing upcoming jobs.
- **Invoicing & Payments:** Create invoices and charge customers via Stripe with one click.
- **Inventory Management:** Track parts usage per job and manage truck stock levels.
- **Real-time Updates:** WebSocket integration for live status updates.
- **Analytics:** Comprehensive reporting on revenue, jobs completed, and inventory usage.

## 🛠 Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (Strict)
- **Styling:** Tailwind CSS + CVA
- **Database:** PostgreSQL (Vercel Postgres / Neon)
- **ORM:** Drizzle
- **Authentication:** NextAuth v5
- **Payments:** Stripe
- **Forms:** React Hook Form + Zod
- **State:** Zustand
- **Charts:** Recharts
- **Deployment:** Vercel

## 📦 Installation

### Prerequisites

- Node.js 18.17+
- PostgreSQL database
- Stripe Account
- Google Cloud Project (for Calendar/OAuth)

### 1. Clone the Repository

```bash
git clone https://github.com/pegrio/auricrypt-plumbing-saas.git
cd auricrypt-plumbing-saas
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Environment Setup

Copy the `.env.example` file to `.env.local` and fill in the required variables. Refer to `docs/ENVIRONMENT_SETUP.md` for detailed instructions on third-party service setup.

```bash
cp .env.example .env.local
```

### 4. Database Setup

Run the database migration to create the schema:

```bash
npm run db:push
```

If you need to seed the database with initial data (products, default roles):

```bash
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗 Project Structure

```
 auricrypt-plumbing-saas/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Authentication group (login, register)
│   │   ├── (dashboard)/        # Main application layout
│   │   │   ├── admin/          # Owner/Manager specific pages
│   │   │   ├── jobs/           # Calendar and scheduling
│   │   │   ├── invoices/       # Invoicing and payments
│   │   │   └── inventory/      # Truck inventory
│   │   └── api/                # API routes
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI primitives
│   │   ├── dashboard/          # Dashboard specific widgets
│   │   └── forms/              # Form components
│   ├── lib/                    # Utility functions
│   ├── db/                     # Database schema and connection
│   │   ├── schema.ts           # Drizzle schema
│   │   └── index.ts            # DB connection
│   └── store/                  # Zustand stores
├── docs/                       # Documentation files
└── public/                     # Static assets
```

## 🔐 Authentication & Security

- **Auth:** NextAuth v5 handles session management.
- **Hashing:** bcrypt is used for password hashing.
- **Security:** All API routes are protected with middleware enforcing role-based access control.
- **Rate Limiting:** Implemented on auth endpoints to prevent brute force attacks.

## 📝 License

This project is proprietary software developed by Pegrio LLC for Auricrypt. All rights reserved.

## 🤝 Support

For technical support or warranty claims, contact support@pegrio.com.