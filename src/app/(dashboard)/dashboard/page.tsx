"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react"
import { useState } from "react"

// Mock Data
const jobs = [
  {
    id: 1,
    title: "Water Heater Repair",
    customer: "John Doe",
    address: "123 Main St, Springfield",
    time: "09:00 AM - 11:00 AM",
    status: "in_progress",
  },
  {
    id: 2,
    title: "Pipe Leak Inspection",
    customer: "Jane Smith",
    address: "456 Oak Ave, Shelbyville",
    time: "01:00 PM - 02:30 PM",
    status: "scheduled",
  },
  {
    id: 3,
    title: "Fixture Installation",
    customer: "Acme Corp",
    address: "789 Industrial Pkwy",
    time: "03:30 PM - 05:00 PM",
    status: "scheduled",
  },
]

export default function DashboardPage() {
  const [selectedJob, setSelectedJob] = useState(jobs[0])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, here&apos;s your schedule for today.</p>
        </div>
        <div className="text-sm text-slate-500 font-medium">
          {new Date().toLocaleDateString(&quot;en-US", { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-slate-500" />
            Upcoming Jobs
          </h2>
          {jobs.map((job) => (
            <Card 
              key={job.id} 
              className={`hover:shadow-md transition-shadow cursor-pointer border-l-4 ${job.status === 'in_progress' ? 'border-l-blue-500' : 'border-l-transparent'}`}
              onClick={() => setSelectedJob(job)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg text-slate-900">{job.title}</h3>
                      {job.status === 'in_progress' && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">In Progress</span>
                      )}
                    </div>
                    <p className="text-slate-600 font-medium">{job.customer}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.address}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Job Details / Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Focus</CardTitle>
              <CardDescription>Quick actions for selected job</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-md border border-slate-100">
                <h3 className="font-semibold text-slate-900">{selectedJob.title}</h3>
                <p className="text-sm text-slate-500">{selectedJob.customer}</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <Button className="w-full h-12 text-base" onClick={() => window.location.href = '/invoice/new'}>
                  Create Invoice
                </Button>
                <Button variant="outline" className="w-full h-12 text-base">
                  Update Status
                </Button>
                <Button variant="ghost" className="w-full h-12 text-base">
                  View Full Details
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 text-white">
            <CardHeader>
              <CardTitle className="text-white">Truck Inventory</CardTitle>
              <CardDescription className="text-slate-400">Status: Good</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pipe Fittings (1/2&quot;)</span>
                  <span className="font-mono text-blue-400">42</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>PVC Glue</span>
                  <span className="font-mono text-blue-400">3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Faucet Cartridges</span>
                  <span className="font-mono text-red-400">2 (Low)</span>
                </div>
              </div>
              <Button variant="secondary" className="w-full mt-4" onClick={() => window.location.href = '/inventory'}>
                Manage Inventory
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}