# Admin Guide

This guide is for **Owners** and **Managers** of the Auricrypt Plumbing SaaS platform. It covers administrative tasks, user management, and system maintenance.

## User Management

### Creating a New User

1.  Navigate to the **Dashboard** > **Team**.
2.  Click the **"Add Staff Member"** button.
3.  Fill in the details:
    *   **Name:** Full name of the employee.
    *   **Email:** Must be unique (used for login).
    *   **Role:** Select `Staff`, `Manager`, or `Owner`.
    *   **Assigned Truck:** Link the user to a specific truck ID for inventory tracking.
4.  Click **"Send Invite"**. The system will send an email to the new user prompting them to set a password.

### Managing Roles

Roles dictate access within the app:

| Role | Permissions |
|------|-------------|
| **Owner** | Full access. Can manage billing, delete data, manage all users, and view global analytics. |
| **Manager** | Can create jobs, manage inventory, approve invoices, and view reports for their assigned teams. |
| **Staff** | Can view assigned jobs, clock in/out, create invoices, and update truck inventory. |

To change a role:
1.  Go to **Dashboard** > **Team**.
2.  Locate the user.
3.  Click the **Actions** menu (three dots) > **Edit Role**.
4.  Select the new role and save.

### Deactivating Users

If an employee leaves:
1.  Go to **Dashboard** > **Team**.
2.  Select the user.
3.  Click **"Deactivate Account"**.
4.  **Important:** Ensure their truck inventory is reconciled or transferred to another user before deactivation.

## Inventory Management

### Restocking Trucks

1.  Navigate to **Inventory** > **Trucks**.
2.  Select the truck you wish to restock.
3.  Click **"Restock"**.
4.  Enter the quantities for each part being added.
5.  Click **"Confirm"**.

### Setting Reorder Levels

To receive alerts when stock is low:
1.  Go to **Inventory** > **Products**.
2.  Click on a product.
3.  Set the **"Reorder Level"** (e.g., 5 units).
4.  When stock drops below this number, the item will appear in the **"Low Stock"** report on the dashboard.

## Analytics & Reporting

### Viewing Revenue

1.  Go to **Analytics** > **Financial**.
2.  Select the date range (Today, Week, Month, Custom).
3.  View charts showing:
    *   Total Revenue.
    *   Paid vs. Outstanding Invoices.
    *   Average Job Value.

### Exporting Data

To export data (e.g., for QuickBooks or tax purposes):
1.  Navigate to any list view (Jobs, Invoices, Inventory).
2.  Click the **"Export"** button in the top right.
3.  Choose **CSV** or **PDF** format.
4.  The file will download automatically.

## Backup & Restore

### Automated Backups

Database backups are automated daily via Vercel Postgres/Neon. Backups are retained for 30 days.

### Manual Backup

To create a manual snapshot of the database:
1.  Access your Vercel Dashboard (or Neon dashboard).
2.  Navigate to **Storage** > **[Project Name]**.
3.  Click **Snapshots** > **Create Snapshot**.

### Restoring Data

*Note: Restoration overwrites current data. Proceed with caution.*

1.  Go to **Storage** > **[Project Name]**.
2.  Click **Snapshots**.
3.  Locate the desired snapshot and click **Restore**.
4.  Confirm the action.

## Troubleshooting

### Users cannot log in

*   **Check:** Is their account status "Active"?
*   **Check:** Have they clicked the link in their invite email?
*   **Action:** As an Owner, you can manually reset their password via the **Team** page. Click **Actions** > **Reset Password**.

### Stripe payments failing

*   **Check:** Are your API keys valid in the Environment Variables?
*   **Check:** Is the customer's card valid in the Stripe Dashboard?
*   **Logs:** Check `api/logs/stripe-errors` in the admin panel for specific error codes.

### Inventory not syncing

*   **Check:** The user's device must have an active internet connection.
*   **Action:** Try refreshing the page on the staff device. If the issue persists, check the status of the Vercel/Neon database status page.