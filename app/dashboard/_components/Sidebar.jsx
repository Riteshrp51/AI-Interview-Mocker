"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Mic,
    FileText,
    GitCompare,
    Code2,
    BarChart3,
    Map,
    History,
    Trophy,
    Bell,
    Settings,
    X,
    Sparkles
} from 'lucide-react';

export const sidebarItems = [
    { name: 'Dashboard', icon: Home, href: '/dashboard' },
    { name: 'Mock Interviews', icon: Mic, href: '/dashboard' }, // Links to dashboard to keep previous interview flow functional
    { name: 'Resume Analyzer', icon: FileText, href: '/dashboard/resume-analyzer' },
    { name: 'Resume vs Job Description', icon: GitCompare, href: '/dashboard/resume-vs-jd' },
    { name: 'Coding Interviews', icon: Code2, href: '/dashboard/coding-interviews' },
    { name: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' },
    { name: 'Learning Roadmap', icon: Map, href: '/dashboard/learning-roadmap' },
    { name: 'Interview History', icon: History, href: '/dashboard/history' },
    { name: 'Achievements', icon: Trophy, href: '/dashboard/achievements' },
    { name: 'Notifications', icon: Bell, href: '/dashboard/notifications' },
    { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

export default function Sidebar({ isOpen, toggleCollapse, isCollapsed, onClose }) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Drawer Backdrop */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-zinc-950/20 backdrop-blur-sm lg:hidden transition-all duration-300"
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    } ${isCollapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'} w-[260px]`}
            >
                {/* Header */}
                <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-150 dark:border-zinc-800">
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                        <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-sm flex items-center justify-center">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        {!isCollapsed && (
                            <span className="font-extrabold text-lg text-zinc-900 dark:text-light tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                PrepAI
                            </span>
                        )}
                    </Link>
                    <button
                        onClick={onClose}
                        type="button"
                        className="lg:hidden p-1.5 text-zinc-500 hover:text-zinc-650 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 overflow-y-auto space-y-1.5 p-3">
                    {sidebarItems.map((item, index) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${isActive
                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-semibold'
                                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200'
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
                                {!isCollapsed && <span className="truncate">{item.name}</span>}

                                {/* Tooltip on collapsed state */}
                                {isCollapsed && (
                                    <div className="absolute left-16 scale-0 rounded bg-zinc-950 px-2 py-1 text-xs text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap shadow-md">
                                        {item.name}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Toggle Collapse Button for desktop */}
                <div className="hidden lg:block p-4 border-t border-zinc-200 dark:border-zinc-800">
                    <button
                        onClick={toggleCollapse}
                        type="button"
                        className="w-full py-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-semibold transition-colors cursor-pointer"
                    >
                        {isCollapsed ? '→ Expand' : '← Collapse Sidebar'}
                    </button>
                </div>
            </aside>
        </>
    );
}
