"use client";

import { useAppStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, MoreHorizontal, CheckCircle, PlayCircle } from "lucide-react";
import { useState } from "react";

const statusColors: Record<string, string> = {
  &quot;scheduled": "bg-blue-100 text-blue-800 hover:bg-blue-200",
  "in-progress": "bg-amber-100 text-amber-800 hover:bg-amber-200",
  "completed": "bg-green-100 text-green-800 hover:bg-green-200",
  "cancelled": "bg-gray-100 text-gray-800 hover:bg-gray-200",
};

export default function JobsPage() {
  const { jobs, updateJobStatus } = useAppStore();
  const [filter, setFilter] = useState<string>(&quot;all");

  const filteredJobs = filter === "all" 
    ? jobs 
    : jobs.filter(job => job.status === filter);

  const handleStatusChange = (jobId: string, newStatus: typeof jobs[0]["status"]) => {
    updateJobStatus(jobId, newStatus);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Jobs & Schedule</h1>
          <p className="text-muted-foreground">Manage your upcoming and active jobs.</p>
        </div>
      </div>

      <div className="flex gap-2">
        {[&quot;all", "scheduled", "in-progress", "completed"].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
            className="capitalize&quot;
          >
            {status.replace("-", " ")}
          </Button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{job.customerName}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground gap-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.address}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(job.scheduledTime)}
                    </span>
                  </div>
                </div>
                <Badge className={statusColors[job.status]}>{job.status.replace(&quot;-", " ")}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 max-w-2xl">
                  <span className="font-medium">Notes:</span> {job.notes || &quot;No additional notes provided."}
                </p>
                <div className="flex gap-2">
                  {job.status === "scheduled" && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStatusChange(job.id, &quot;in-progress")}
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Start Job
                    </Button>
                  )}
                  {job.status === "in-progress" && (
                    <Button 
                      size="sm"
                      onClick={() => handleStatusChange(job.id, &quot;completed")}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Complete Job
                    </Button>
                  )}
                  <Button size="sm" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}