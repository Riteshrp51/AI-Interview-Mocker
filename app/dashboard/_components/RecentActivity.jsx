import React from 'react';
import { CircleIcon } from 'lucide-react';

export default function RecentActivity({ activities }) {
    const defaultActivities = [
        { action: 'Resume Uploaded', timestamp: '2 hours ago', description: 'ATS analysis completed. Score: 85/100' },
        { action: 'Interview Completed', timestamp: '1 day ago', description: 'Mock Full Stack engineer interview' },
        { action: 'Feedback Generated', timestamp: '1 day ago', description: 'Report ready for Senior React Dev interview' },
        { action: 'Roadmap Generated', timestamp: '3 days ago', description: 'Custom Java developer road map updated' },
    ];

    const list = activities || defaultActivities;

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 text-base mb-4">Recent Activity</h3>

            <div className="relative pl-4 border-l border-zinc-200 dark:border-zinc-800 space-y-6">
                {list.map((item, index) => (
                    <div key={index} className="relative group">
                        {/* Timeline node */}
                        <span className="absolute -left-[21px] top-1 px-1 py-1 rounded-full bg-white dark:bg-zinc-900 border-2 border-blue-500 group-hover:bg-blue-600 transition-colors">
                            <span className="block w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-white" />
                        </span>

                        <div className="space-y-0.5">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">{item.action}</span>
                                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">{item.timestamp}</span>
                            </div>
                            <p className="text-zinc-500 dark:text-zinc-400 text-xs">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
