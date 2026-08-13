import React from 'react';
import { Play, Upload, Code, BookOpen } from 'lucide-react';

export default function QuickActions({ onStartInterview, onUploadResume, onStartCoding, onViewRoadmap }) {
    const actions = [
        {
            title: 'Start New Interview',
            description: 'Begin an AI-powered mock interview tailored to your role.',
            icon: Play,
            bgIcon: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
            action: onStartInterview,
            primaryButtonText: 'Start Round',
        },
        {
            title: 'Upload Resume',
            description: 'Analyze your resume ATS score and get instant suggestions.',
            icon: Upload,
            bgIcon: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
            action: onUploadResume,
            primaryButtonText: 'Analyze',
        },
        {
            title: 'Start Coding Round',
            description: 'Practice interactive coding challenges with live AI feedback.',
            icon: Code,
            bgIcon: 'bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400',
            action: onStartCoding,
            primaryButtonText: 'Practice',
        },
        {
            title: 'View Learning Roadmap',
            description: 'Check your personalized AI learning paths and topics list.',
            icon: BookOpen,
            bgIcon: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
            action: onViewRoadmap,
            primaryButtonText: 'View Path',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {actions.map((item, index) => (
                <div
                    key={index}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                    <div>
                        <div className={`p-3 rounded-lg w-fit ${item.bgIcon} group-hover:scale-110 transition-transform duration-300`}>
                            <item.icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 text-base mt-4 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.title}
                        </h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
                            {item.description}
                        </p>
                    </div>
                    <button
                        onClick={item.action}
                        type="button"
                        className="w-full mt-5 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-zinc-700 dark:text-zinc-250 text-xs font-semibold transition-all duration-300 cursor-pointer shadow-sm group-hover:shadow-md"
                    >
                        {item.primaryButtonText}
                    </button>
                </div>
            ))}
        </div>
    );
}
