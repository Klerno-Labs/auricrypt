import { auth, signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Stats Placeholders */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="font-medium text-sm text-muted-foreground">Total Jobs Today</div>
          <div className="text-2xl font-bold mt-2">4</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="font-medium text-sm text-muted-foreground">Pending Invoices</div>
          <div className="text-2xl font-bold mt-2">2</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="font-medium text-sm text-muted-foreground">Revenue This Week</div>
          <div className="text-2xl font-bold mt-2">$1,250.00</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="font-medium text-sm text-muted-foreground">Low Stock Items</div>
          <div className="text-2xl font-bold mt-2 text-red-600">1</div>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Jobs</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Pipe Repair - Residential</p>
                <p className="text-sm text-muted-foreground">123 Main St, Springfield</p>
              </div>
              <div className="text-right">
                <p className="font-medium">10:00 AM</p>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Confirmed</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Water Heater Installation</p>
                <p className="text-sm text-muted-foreground">456 Oak Ave, Shelbyville</p>
              </div>
              <div className="text-right">
                <p className="font-medium">1:30 PM</p>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/login' });
          }}
        >
          <Button variant="destructive">Sign Out</Button>
        </form>
      </div>
    </div>
  );
}