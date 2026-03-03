import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, CreditCard } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function InvoicesPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">New Invoice</h2>
          <p className="text-muted-foreground">Create an invoice for a completed job.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <Label>Search Customer</Label>
              <Input placeholder="Name or Email..." />
             </div>
             <div className="p-4 border rounded bg-gray-50">
               <p className="font-medium">Alice Johnson</p>
               <p className="text-sm text-muted-foreground">alice@example.com</p>
               <p className="text-sm text-muted-foreground">555-0123</p>
             </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Line Items</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
                <div className="col-span-6">Item</div>
                <div className="col-span-2">Qty</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Row 1 */}
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-6">
                  <Input defaultValue="Labor - Service Call" />
                </div>
                <div className="col-span-2">
                  <Input type="number" defaultValue={1} min={1} />
                </div>
                <div className="col-span-2">
                  <Input type="number" defaultValue={85.00} />
                </div>
                <div className="col-span-2 text-right font-medium flex items-center justify-end gap-2">
                  {formatCurrency(85)}
                  <button className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>

               {/* Row 2 */}
               <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-6">
                  <Input defaultValue="Copper Pipe (1/2 inch)" />
                </div>
                <div className="col-span-2">
                  <Input type="number" defaultValue={5} min={1} />
                </div>
                <div className="col-span-2">
                  <Input type="number" defaultValue={12.50} />
                </div>
                <div className="col-span-2 text-right font-medium flex items-center justify-end gap-2">
                  {formatCurrency(62.50)}
                  <button className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-end">
                  <div className="w-48 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatCurrency(147.50)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (8%)</span>
                      <span>{formatCurrency(11.80)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(159.30)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button variant="outline">Save Draft</Button>
                <Button>
                  <CreditCard className="h-4 w-4 mr-2" /> Charge & Send
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}