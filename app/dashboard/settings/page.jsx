"use client";
import React from 'react';
import { Settings, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl max-w-2xl mx-auto space-y-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-full">
                <Settings className="w-8 h-8 animate-pulse" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Settings & Profile</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                    Adjust interface preferences, profile credentials, dashboard display layouts, API tokens, and subscription tiers.
                </p>
            </div>
            <Link
                href="/dashboard"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors inline-flex items-center gap-2"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
            </Link>
        </div>
    );
}
