"use client";
import React, { useEffect, useState } from 'react';
import Header from './_components/Header';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';

function DashboardLayout({ children }) {
  const { user, initialized } = useAuth(); // assuming 'initialized' is now exposed from AuthContext, if not I need a follow up edit to AuthContext to expose it.
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for auth to initialize before making decisions
    if (!initialized) return;

    if (!user) {
      // Not logged in, redirect to sign-in
      console.log("DashboardLayout: User not found, redirecting to sign-in");
      router.replace('/sign-in');
    } else {
      // Logged in, show content
      setLoading(false);
    }
  }, [user, initialized, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoaderCircle className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className='mx-5 md:mx-20 lg:mx-36' >
        {children}
      </div>

    </div>
  )
}

export default DashboardLayout


