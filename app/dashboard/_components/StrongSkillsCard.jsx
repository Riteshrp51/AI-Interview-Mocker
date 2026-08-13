import React from 'react';

export default function StrongSkillsCard({ skills }) {
    const defaultSkills = [
        { name: 'React', progress: 92 },
        { name: 'JavaScript', progress: 88 },
        { name: 'MongoDB', progress: 85 },
        { name: 'Node.js', progress: 80 },
    ];

    const list = skills || defaultSkills;

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 text-base mb-4">Strong Skills</h3>

            <div className="space-y-4">
                {list.map((item, index) => (
                    <div key={index} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">{item.name}</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-450">{item.progress}% mastery</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${item.progress}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
