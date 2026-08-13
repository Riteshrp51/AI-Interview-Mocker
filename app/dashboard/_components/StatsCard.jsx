import React from 'react';

export default function StatsCard({ icon: Icon, title, value, trend, isPositive }) {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group">
            <div className="space-y-2">
                <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{title}</span>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">{value}</h3>
                {trend && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold mt-1">
                        <span className={`px-2 py-0.5 rounded-full ${isPositive
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400'
                            }`}>
                            {isPositive ? '↑' : '↓'} {trend}
                        </span>
                        <span className="text-zinc-400 dark:text-zinc-500">vs last month</span>
                    </div>
                )}
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/30 text-zinc-500 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 rounded-lg transition-colors">
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );
}
