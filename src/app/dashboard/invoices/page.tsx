"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, CreditCard, Check, FileText } from "lucide-react";
import type { InvoiceItem } from "@/types";

export default function InvoicesPage() {
  const { jobs, inventory, addInvoice, updateInvoiceStatus, invoices } = useAppStore();
  
  // Form State
  const [selectedJobId, setSelectedJobId] = useState<string>(&quot;");
  const [laborCharge, setLaborCharge] = useState<number>(0);
  const [lineItems, setLineItems] = useState<InvoiceItem[]>([]);
  const [customerEmail, setCustomerEmail] = useState<string>(&quot;");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  // Calculation Logic
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0) + laborCharge;
  const taxRate = 0.08; // 8% tax
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  const handleAddItem = (inventoryId: string) => {
    const product = inventory.find(p => p.id === inventoryId);
    if (!product) return;

    const existingItemIndex = lineItems.findIndex(item => item.inventoryId === inventoryId);
    
    if (existingItemIndex > -1) {
      const updatedItems = [...lineItems];
      updatedItems[existingItemIndex].quantity += 1;
      updatedItems[existingItemIndex].total = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].price;
      setLineItems(updatedItems);
    } else {
      setLineItems([...lineItems, {
        inventoryId: product.id,
        name: product.name,
        quantity: 1,
        price: product.sellPrice,
        total: product.sellPrice
      }]);
    }
  };

  const handleRemoveItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleUpdateQuantity = (index: number, qty: number) => {
    if (qty < 1) return;
    const updatedItems = [...lineItems];
    updatedItems[index].quantity = qty;
    updatedItems[index].total = qty * updatedItems[index].price;
    setLineItems(updatedItems);
  };

  const handleCreateInvoice = async () => {
    if (!selectedJobId || lineItems.length === 0) return;
    
    setIsProcessing(true);
    
    // Simulate API call / Stripe processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      jobId: selectedJobId,
      customerId: selectedJob?.customerId || &quot;",
      customerEmail: customerEmail,
      items: lineItems,
      laborCharge,
      taxRate,
      subtotal,
      taxAmount,
      total,
      status: "paid", // Simulating immediate payment success
      createdAt: new Date(),
      paymentMethod: "stripe"
    };

    addInvoice(newInvoice);
    updateInvoiceStatus(newInvoice.id, "paid");
    
    // Reset form
    setSelectedJobId("");
    setLaborCharge(0);
    setLineItems([]);
    setCustomerEmail("");
    setIsProcessing(false);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Left Column: Invoice Builder */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create Invoice</h1>
            <p className="text-muted-foreground">Charge customers for parts and labor.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Job</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selectedJobId}
                onChange={(e) => {
                  setSelectedJobId(e.target.value);
                  const job = jobs.find(j => j.id === e.target.value);
                  if (job) setLaborCharge(job.price ? Number(job.price) : 0);
                }}
              >
                <option value="">-- Select a completed job --</option>
                {jobs.filter(j => j.status !== 'cancelled').map(job => (
                  <option key={job.id} value={job.id}>
                    {job.customerName} - {job.address}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedJob && (
              <div className="p-4 bg-gray-50 rounded-md text-sm space-y-1">
                <p><span className="font-medium">Scheduled:</span> {formatDate(selectedJob.scheduledTime)}</p>
                <p><span className="font-medium">Notes:</span> {selectedJob.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Line Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <select 
                className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                onChange={(e) => e.target.value && handleAddItem(e.target.value)}
                defaultValue="&quot;
              >
                <option value="" disabled>Add Part from Inventory</option>
                {inventory.map(item => (
                  <option key={item.id} value={item.id} disabled={item.stockOnHand === 0}>
                    {item.name} ({formatCurrency(item.sellPrice)}) - {item.stockOnHand} in stock
                  </option>
                ))}
              </select>
            </div>

            {lineItems.length > 0 ? (
              <div className="space-y-3">
                {lineItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(item.price)} / unit</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Input 
                        type="number" 
                        min="1"
                        className="w-16 h-8 text-center"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(index, parseInt(e.target.value))}
                      />
                      <span className="text-sm font-medium w-20 text-right">
                        {formatCurrency(item.total)}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-md">
                No items added yet. Add parts from inventory above.
              </div>
            )}

            <div className="pt-4 border-t">
              <Label htmlFor="labor">Labor Charge</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <Input 
                  id="labor" 
                  type="number" 
                  className="pl-7"
                  value={laborCharge}
                  onChange={(e) => setLaborCharge(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Totals & History */}
      <div className="space-y-6">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (8%)</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-4 border-t">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <div className="pt-4 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email">Customer Email (for receipt)</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="customer@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full" 
                size="lg" 
                disabled={!selectedJobId || lineItems.length === 0 || isProcessing}
                onClick={handleCreateInvoice}
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Charge {formatCurrency(total)}
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Secure payment via Stripe
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {invoices.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-2">No invoices yet.</p>
            ) : (
              invoices.slice(-3).reverse().map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{invoice.customerEmail || 'No Email'}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(invoice.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formatCurrency(invoice.total)}</span>
                    {invoice.status === 'paid' && <Check className="h-4 w-4 text-green-500" />}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}