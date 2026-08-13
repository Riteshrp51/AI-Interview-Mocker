"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Page() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) return;

    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative hidden lg:flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 lg:col-span-5 lg:h-full xl:col-span-6 p-12 border-r border-zinc-200 dark:border-zinc-800">
          <div className="max-w-md text-center space-y-6">
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Welcome to AI Interview Mocker 👾
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Every expert was once a beginner—start preparing today with AI-powered mock interviews.
            </p>
            <div className="relative w-full aspect-square max-w-sm mx-auto overflow-hidden rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-805 bg-white">
              <img
                alt="AI Interview Preparation"
                src="/interview-illustrate.png"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl w-full">
            <div className="mb-6 block lg:hidden">
              <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                Login
              </h1>
              <p className="mt-4 leading-relaxed text-gray-500">
                Enter your email and password to continue to your dashboard.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="mt-4 text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/sign-up" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </main>
      </div>
    </section>
  );
}
