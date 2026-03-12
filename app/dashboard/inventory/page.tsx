import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Package, AlertTriangle } from "lucide-react";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Truck Inventory</h2>
          <p className="text-muted-foreground">Manage stock levels for Truck 01.</p>
        </div>
        <Button>
           <Package className="mr-2 h-4 w-4" /> Update Stock
        </Button>
      </div>

      <Card>
        <CardHeader>
           <div className="flex items-center justify-between">
             <CardTitle>Current Stock</CardTitle>
             <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search products..." className="pl-8" />
             </div>
           </div>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">SKU</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Unit</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Quantity</th>
                  <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Unit Price</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle font-medium">PIP-001</td>
                  <td className="p-4 align-middle">1/2" Copper Pipe</td>
                  <td className="p-4 align-middle">ft</td>
                  <td className="p-4 align-middle text-right">150</td>
                  <td className="p-4 align-middle text-center">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-500 text-white">In Stock</span>
                  </td>
                  <td className="p-4 align-middle text-right">$12.50</td>
                  <td className="p-4 align-middle text-right"><Button variant="ghost" size="sm">Edit</Button></td>
                </tr>
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle font-medium">VNT-002</td>
                  <td className="p-4 align-middle">2" PVC Elbow</td>
                  <td className="p-4 align-middle">piece</td>
                  <td className="p-4 align-middle text-right">4</td>
                  <td className="p-4 align-middle text-center">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-red-500 text-white flex justify-center items-center gap-1 w-fit mx-auto"><AlertTriangle className="h-3 w-3"/> Low</span>
                  </td>
                  <td className="p-4 align-middle text-right">$3.20</td>
                  <td className="p-4 align-middle text-right"><Button variant="ghost" size="sm">Edit</Button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}