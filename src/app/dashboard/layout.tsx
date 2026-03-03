import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Placeholder */}
      <aside className="w-64 border-r bg-slate-50 hidden md:block p-6">
        <div className="font-bold text-xl mb-6 text-blue-600">Auricrypt</div>
        <nav className="space-y-2">
          <div className="px-3 py-2 rounded-md bg-blue-100 text-blue-700 font-medium">Dashboard</div>
          <div className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer">Calendar</div>
          <div className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer">Invoices</div>
          <div className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer">Inventory</div>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">Welcome, {session.user.name}</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium uppercase">
              {session.user.role}
            </span>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}