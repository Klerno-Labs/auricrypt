"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, CreditCard, FileText } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

type LineItem = {
  id: string
  description: string
  quantity: number
  price: number
  total: number
}

export default function NewInvoicePage() {
  const [customerEmail, setCustomerEmail] = useState("")
  const [items, setItems] = useState<LineItem[]>([
    { id: &quot;1", description: "", quantity: 1, price: 0, total: 0 }
  ])
  const [isProcessing, setIsProcessing] = useState(false)

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: "", quantity: 1, price: 0, total: 0 }])
  }

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value }
        if (field === "quantity" || field === "price") {
          updated.total = Number(updated.quantity) * Number(updated.price)
        }
        return updated
      }
      return item
    })
    setItems(newItems)
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const tax = subtotal * 0.08 // Mock 8% tax
  const total = subtotal + tax

  const handleCharge = async () => {
    if (!customerEmail || items.length === 0) return
    setIsProcessing(true)
    // Mock Stripe API Call
    setTimeout(() => {
      setIsProcessing(false)
      alert(`Payment of ${formatCurrency(total)} processed successfully for ${customerEmail}!`)
      // In real app: redirect to success page or dashboard
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create Invoice</h1>
          <p className="text-slate-500">Charge customer for work completed.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-full border">
          <FileText className="h-4 w-4" />
          Draft #INV-2023-001
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Customer Email (for receipt)</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="customer@example.com" 
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items & Services</CardTitle>
              <CardDescription>Select inventory or add custom services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-2 items-start p-4 border rounded-md bg-slate-50">
                    <div className="flex-1 space-y-1">
                      <Input 
                        placeholder="Description (e.g. Labor, Pipe Repair)" 
                        value={item.description}
                        onChange={(e) => updateItem(item.id, &quot;description", e.target.value)}
                      />
                    </div>
                    <div className="w-24">
                      <Input 
                        type="number" 
                        placeholder="Qty" 
                        min="1"
                        value={item.quantity || ""}
                        onChange={(e) => updateItem(item.id, &quot;quantity", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="w-32">
                      <Input 
                        type="number" 
                        placeholder="Price" 
                        min="0"
                        step="0.01"
                        value={item.price || ""}
                        onChange={(e) => updateItem(item.id, &quot;price", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="w-28 text-right font-medium pt-2 text-slate-700">
                      {formatCurrency(item.total)}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-dashed" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" /> Add Line Item
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax (8%)</span>
                <span className="font-medium">{formatCurrency(tax)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl text-slate-900">{formatCurrency(total)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button 
                className="w-full h-12 text-base bg-green-600 hover:bg-green-700" 
                onClick={handleCharge}
                disabled={isProcessing || total <= 0}
              >
                {isProcessing ? (
                  &quot;Processing..."
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Charge {formatCurrency(total)}
                  </>
                )}
              </Button>
              <Button variant="outline" className="w-full">
                Save as Draft
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}