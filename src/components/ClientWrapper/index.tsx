// components/ClientWrapper.tsx
'use client'; 

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar'; // Adjust path if necessary

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define the routes where the Sidebar should appear
  const sidebarRoutes = ['/home', '/attendance', '/marks', '/time-table'];
  const showSidebar = sidebarRoutes.includes(pathname);

  return (
    <div className="flex">
      {showSidebar && <Sidebar />}
      <main className="flex-grow">{children}</main>
    </div>
  );
}
