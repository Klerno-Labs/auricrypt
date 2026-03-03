import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Jobs</h2>
          <p className="text-muted-foreground">Manage your schedule and service calls.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Job
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Job Item 1 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg bg-white gap-4">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center justify-center p-2 bg-blue-50 rounded-lg text-blue-700 min-w-[60px]">
                  <span className="text-xs font-bold uppercase">Mar</span>
                  <span className="text-xl font-bold">14</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Leaky Pipe Repair</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 9:00 AM - 11:00 AM</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> 4092 Estates Parkway</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Scheduled</span>
                <Button variant="outline" size="sm">Details</Button>
                <Button size="sm">Start Job</Button>
              </div>
            </div>

             {/* Job Item 2 */}
             <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg bg-white gap-4">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center justify-center p-2 bg-blue-50 rounded-lg text-blue-700 min-w-[60px]">
                  <span className="text-xs font-bold uppercase">Mar</span>
                  <span className="text-xl font-bold">14</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Water Heater Installation</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 1:00 PM - 4:00 PM</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> 8820 Wood Avenue</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">In Progress</span>
                <Button variant="outline" size="sm">Details</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}