"use client";
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Sun, Moon, LogOut } from 'lucide-react';

export default function Navbar({ onMenuClick, isCollapsed }) {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        logout();
        router.replace('/');
    };

    // Get user profile initial
    const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

    const getPageTitle = () => {
        if (pathname === '/dashboard/mock-interviews' || pathname === '/dashboard/questions') {
            return 'Dashboard / Mock Interviews';
        }
        if (pathname?.startsWith('/dashboard/interview/')) {
            return 'Dashboard / Interview';
        }
        return 'Dashboard / Overview';
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-6">
            {/* Menu / Breadcrumb */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    type="button"
                    className="lg:hidden p-2 text-zinc-500 hover:text-zinc-650 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <span className="hidden sm:inline-block text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                    {getPageTitle()}
                </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-4">
                {/* Toggle Theme button */}
                <button
                    onClick={toggleTheme}
                    type="button"
                    className="p-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-350 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors"
                    title="Toggle Theme"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Divider */}
                <span className="h-6 w-px bg-zinc-200 dark:border-zinc-800 hidden xs:block" />

                {/* User Info & Logout */}
                {user && (
                    <div className="flex items-center gap-3">
                        {/* User Profile Avatar */}
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm" title={user.email}>
                            {userInitial}
                        </div>

                        <div className="hidden md:flex flex-col items-start pr-1">
                            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 max-w-[130px] truncate">
                                {user.email.split('@')[0]}
                            </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            type="button"
                            className="p-2 text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg cursor-pointer transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-4.5 h-4.5" />
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
