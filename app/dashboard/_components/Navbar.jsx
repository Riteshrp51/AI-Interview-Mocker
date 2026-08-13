"use client";
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { Menu, Sun, Moon, Bell, Search, LogOut } from 'lucide-react';

export default function Navbar({ onMenuClick, isCollapsed }) {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.replace('/');
    };

    // Get user profile initial
    const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

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
                <span className="hidden sm:inline-block text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                    Dashboard / Overview
                </span>
            </div>

            {/* Center Search Bar - UI only */}
            <div className="relative w-64 md:w-80 hidden md:block">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                    <Search className="w-4 h-4" />
                </span>
                <input
                    type="text"
                    placeholder="Search interview types..."
                    className="w-full pl-9 pr-4 py-1.5 bg-zinc-55 dark:bg-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm transition-all focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-800 dark:text-zinc-200"
                />
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-4">
                {/* Toggle Theme buttons */}
                <button
                    onClick={toggleTheme}
                    type="button"
                    className="p-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-350 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors"
                    title="Toggle Theme"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Notifications - UI only */}
                <button
                    type="button"
                    className="p-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-350 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg relative cursor-pointer"
                >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
                </button>

                {/* Divider */}
                <span className="h-6 w-px bg-zinc-250 dark:bg-zinc-800 hidden xs:block" />

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
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Premium Member</span>
                        </div>

                        <button
                            onClick={handleLogout}
                            type="button"
                            className="p-2 text-zinc-550 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg cursor-pointer transition-colors"
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
