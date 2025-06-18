import { redirect } from 'next/navigation';
import { auth } from '../(auth)/auth';
import { getUser } from '@/lib/db/queries';
import { AdminSidebar } from '@/components/admin-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/login');
  }
  
  const users = await getUser(session.user.email);
  const user = users[0];
  
  if (!user || user.role !== 'admin') {
    redirect('/chat');
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar user={user} />
      <SidebarInset className="flex-1">
        <div className="flex flex-col h-full">
          <header className="border-b bg-background px-6 py-4">
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}