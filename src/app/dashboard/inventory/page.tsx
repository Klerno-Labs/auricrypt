"use client";

import { useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MinusCircle, PlusCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function InventoryPage() {
  const { inventory, updateInventory } = useAppStore();
  const [search, setSearch] = useState("");

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleStockChange = (itemId: string, change: number) => {
    updateInventory(itemId, change);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Truck Inventory</h1>
          <p className="text-muted-foreground">Manage stock levels and parts used on the job.</p>
        </div>
        <Button>Add New Item</Button>
      </div>

      <div className="flex items-center space-x-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search parts or SKU..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredInventory.map((item) => {
          const isLowStock = item.stockOnHand <= item.lowStockThreshold;
          return (
            <Card key={item.id} className={isLowStock ? "border-red-200 bg-red-50/30" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{item.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                  </div>
                  {isLowStock && (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold">{item.stockOnHand}</p>
                    <p className="text-xs text-muted-foreground">In Stock</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{formatCurrency(item.sellPrice)}</p>
                    <p className="text-xs text-muted-foreground">Unit Price</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => handleStockChange(item.id, -1)}
                      disabled={item.stockOnHand === 0}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => handleStockChange(item.id, 1)}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  {isLowStock && (
                    <span className="text-xs font-medium text-red-600">Low Stock</span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}