"use client";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { useAuth } from '@/context/AuthContext';

function Header() {
  const path = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <div className='flex items-center justify-between p-4 bg-white shadow-sm border-b'>
      {/* Logo on the left */}
      <Image src={'/logo.svg'} width={160} height={100} alt='logo' />

      {/* Centered Navigation Menu */}
      <ul className='hidden md:flex flex-1 justify-center gap-8 px-6 text-sm font-medium'>
        <li>
          <Link
            href="/dashboard"
            className={`hover:text-blue-600 transition-colors cursor-pointer ${path === '/dashboard' ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-1' : 'text-gray-600'}`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/questions"
            className={`hover:text-blue-600 transition-colors cursor-pointer ${path === '/dashboard/questions' ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-1' : 'text-gray-600'}`}
          >
            Questions
          </Link>
        </li>

        <li>
          <Link
            href="/how-it-works"
            className={`hover:text-blue-600 transition-colors cursor-pointer ${path === '/how-it-works' ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-1' : 'text-gray-600'}`}
          >
            How It Works?
          </Link>
        </li>
      </ul>

      {/* Auth controls on the right */}
      {user ? (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">
            {user.email}
          </span>
          <button
            type="button"
            onClick={() => {
              logout();
              router.replace('/');
            }}
            className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/sign-up"
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header;
