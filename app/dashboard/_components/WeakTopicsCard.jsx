import React from 'react';

export default function WeakTopicsCard({ topics }) {
    const defaultTopics = [
        { name: 'Java Collections', progress: 42, color: 'bg-rose-500 text-rose-700 dark:text-rose-300' },
        { name: 'SQL Joins', progress: 55, color: 'bg-amber-500 text-amber-700 dark:text-amber-300' },
        { name: 'Spring Boot', progress: 38, color: 'bg-rose-500 text-rose-700 dark:text-rose-300' },
        { name: 'Operating Systems', progress: 48, color: 'bg-amber-500 text-amber-700 dark:text-amber-300' },
    ];

    const list = topics || defaultTopics;

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 text-base mb-4">Topics Needing Improvement</h3>

            <div className="space-y-4">
                {list.map((item, index) => (
                    <div key={index} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">{item.name}</span>
                            <span className="font-semibold text-zinc-500 dark:text-zinc-400">{item.progress}% mastery</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${item.progress < 45 ? 'bg-rose-500' : 'bg-amber-500'
                                    }`}
                                style={{ width: `${item.progress}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
