"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Package,
  FileText,
  Settings,
  Wrench,
  LogOut,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Jobs & Calendar", href: "/dashboard/jobs", icon: Calendar },
  { name: "Inventory", href: "/dashboard/inventory", icon: Package },
  { name: "Invoices & Billing", href: "/dashboard/invoices", icon: FileText },
  { name: "Admin Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const user = useAppStore((state) => state.currentUser);

  return (
    <div className="flex h-full w-64 flex-col bg-gray-50 border-r border-gray-200">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <Wrench className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-bold text-gray-900">Auricrypt</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-primary-foreground" : "text-gray-400"
                  )}
                  aria-hidden="true"
                />
                <span className="ml-3">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
              {user?.name.charAt(0)}
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
          <button className="ml-auto text-gray-400 hover:text-gray-500">
            <LogOut className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}