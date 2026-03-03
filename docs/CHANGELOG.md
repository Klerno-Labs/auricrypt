# Changelog

All notable changes to the Auricrypt Plumbing SaaS project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2023-10-27

### Added
- **User Authentication**
  - Email/Password login system.
  - Google OAuth integration.
  - Role-based access control (Owner, Manager, Staff).
  - Session management via NextAuth v5.

- **Dashboard**
  - Role-specific landing pages.
  - Daily job summary cards.
  - Quick actions (New Job, New Invoice).

- **Job Management**
  - Calendar view (Month, Week, Day).
  - Google Calendar two-way sync.
  - Job details view (Customer info, notes, status).
  - Job status tracking (Pending, En Route, In Progress, Completed).

- **Invoicing & Payments**
  - Invoice creation wizard.
  - Line item selection from inventory database.
  - Stripe integration for credit card processing.
  - PDF invoice generation.
  - Email invoice to customer functionality.

- **Inventory Management**
  - Product catalog management.
  - Truck-specific inventory tracking.
  - Inventory deduction on job completion.
  - Low stock alerts and reports.

- **Admin Features**
  - User management (Invite, Deactivate, Edit Roles).
  - System-wide analytics dashboard (Revenue, Jobs count).
  - Activity logs.

- **Integrations**
  - Stripe (Payments)
  - Google (Auth & Calendar)
  - Resend (Transactional Emails)

### Security
- Rate limiting on authentication endpoints.
- Input sanitization on all forms.
- SQL injection protection via Drizzle ORM.
- Secure HTTP-only cookies for sessions.

### Performance
- Optimized database queries with proper indexing.
- Image optimization via Next.js Image component.
- Server-side rendering (SSR) for dashboard pages.

---

## Known Limitations

- **Mobile App:** This is currently a Web App. While it is mobile-responsive, it is not a native iOS/Android application.
- **Offline Mode:** The app requires an active internet connection to sync inventory and process payments. Offline capabilities are not included in v1.0.0.

## Future Enhancements

- **QuickBooks Integration:** Direct sync for accounting.
- **Customer Portal:** Allow customers to view booking history and pay invoices online.
- **SMS Notifications:** Twilio integration for job reminders to staff and customers.
- **Advanced Reporting:** Custom report builder.