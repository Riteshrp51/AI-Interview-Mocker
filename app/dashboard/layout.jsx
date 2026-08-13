"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from './_components/Sidebar';
import Navbar from './_components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';

function DashboardLayout({ children }) {
  const { user, initialized } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!initialized) return;

    if (!user) {
      console.log("DashboardLayout: User not found, redirecting to sign-in");
      router.replace('/sign-in');
    } else {
      setLoading(false);
    }
  }, [user, initialized, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <LoaderCircle className="animate-spin h-10 w-10 text-blue-600 dark:text-blue-500" />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex transition-colors duration-300">
        {/* Responsive Sidebar */}
        <Sidebar
          isOpen={isMobileOpen}
          isCollapsed={isCollapsed}
          toggleCollapse={() => setIsCollapsed(!isCollapsed)}
          onClose={() => setIsMobileOpen(false)}
        />

        {/* Dashboard Content Area */}
        <div
          className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ${isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'
            }`}
        >
          {/* Top Navbar */}
          <Navbar
            isCollapsed={isCollapsed}
            onMenuClick={() => setIsMobileOpen(true)}
          />

          {/* Main Dashboard Pages */}
          <main className="flex-1 overflow-x-hidden p-6 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default DashboardLayout;