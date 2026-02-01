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
    <div className='flex items-center justify-between p-4 bg-secondary shadow-sm'>
      {/* Logo on the left */}
      <Image src={'/logo.svg'} width={160} height={100} alt='logo' />

      {/* Centered Navigation Menu */}
      <ul className='hidden md:flex flex-1 justify-center gap-6 px-6'>
        <li>
          <Link
            href="/dashboard"
            className={`hover:text-blue-500 hover:font-bold transition-all cursor-pointer ${path === '/dashboard' ? 'text-blue-500 font-bold' : ''}`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/questions"
            className={`hover:text-blue-500 hover:font-bold transition-all cursor-pointer ${path === '/dashboard/questions' ? 'text-blue-500 font-bold' : ''}`}
          >
            Questions
          </Link>
        </li>

        <li>
          <Link
            href="/how-it-works"
            className={`hover:text-blue-500 hover:font-bold transition-all cursor-pointer ${path === '/how-it-works' ? 'text-blue-500 font-bold' : ''}`}
          >
            How It Works?
          </Link>
        </li>
      </ul>

      {/* Auth controls on the right */}
      {user ? (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700 hidden sm:inline">
            {user.email}
          </span>
          <button
            type="button"
            onClick={() => {
              logout();
              router.replace('/');
            }}
            className="px-3 py-1 rounded-md border text-sm hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="px-3 py-1 rounded-md border text-sm hover:bg-gray-100"
          >
            Login
          </Link>
          <Link
            href="/sign-up"
            className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header;
