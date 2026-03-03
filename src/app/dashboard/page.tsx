"use client";

import { StatsCard } from "@/components/dashboard/stats-card";
import { 
  DollarSign, 
  Wrench, 
  Clock, 
  TrendingUp,
  Calendar as CalendarIcon
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { jobs, inventory, invoices } = useAppStore();
  
  // Derived metrics
  const todaysJobs = jobs.filter(job => {
    const today = new Date();
    const jobDate = new Date(job.scheduledTime);
    return jobDate.toDateString() === today.toDateString();
  });

  const pendingInvoices = invoices.filter(inv => inv.status === 'pending').length;
  const totalRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  const lowStockItems = inventory.filter(item => item.stockOnHand <= item.lowStockThreshold);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, here's what's happening today.
          </p>
        </div>
        <Button>
          <CalendarIcon className="mr-2 h-4 w-4" />
          New Job
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Today's Revenue"
          value={1250.00} // Mocked for demo visual
          icon={DollarSign}
          description="Processed via Stripe"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Jobs Today"
          value={todaysJobs.length}
          icon={Wrench}
          description="Scheduled for today"
        />
        <StatsCard
          title="Pending Invoices"
          value={pendingInvoices}
          icon={Clock}
          description="Awaiting payment"
        />
        <StatsCard
          title="Low Stock Alerts"
          value={lowStockItems.length}
          icon={TrendingUp}
          description="Items to restock"
          trend={{ value: lowStockItems.length > 0 ? 5 : 0, isPositive: false }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Upcoming Jobs */}
        <div className="col-span-4 rounded-xl border bg-white shadow-sm">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="font-semibold text-lg">Upcoming Jobs</h3>
            <Link href="/dashboard/jobs" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="p-0">
            {jobs.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No upcoming jobs scheduled.
              </div>
            ) : (
              <div className="divide-y">
                {jobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <Wrench className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{job.customerName}</p>
                        <p className="text-sm text-muted-foreground">{job.address}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatDate(job.scheduledTime)}</p>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        job.status === 'completed' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                        job.status === 'in-progress' ? 'bg-blue-50 text-blue-700 ring-blue-700/10' :
                        'bg-gray-50 text-gray-600 ring-gray-500/10'
                      }`}>
                        {job.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Low Inventory Alert */}
        <div className="col-span-3 rounded-xl border bg-white shadow-sm">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="font-semibold text-lg">Inventory Alerts</h3>
            <Link href="/dashboard/inventory" className="text-sm text-primary hover:underline">
              Manage
            </Link>
          </div>
          <div className="p-6 space-y-4">
            {lowStockItems.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Inventory levels are healthy.
              </div>
            ) : (
              lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-red-600">
                    {item.stockOnHand} left
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}