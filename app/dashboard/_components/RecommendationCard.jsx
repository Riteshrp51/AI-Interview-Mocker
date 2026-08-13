import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';

export default function RecommendationCard({ recommendations }) {
    const defaultRecs = [
        'Continue practicing Java Collections questions to boost your average score.',
        'Complete one Technical Coding Interview today to maintain your daily streak.',
        'Review your Resume ATS suggestions (4 formatting errors detected).',
    ];

    const list = recommendations || defaultRecs;

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-indigo-500 text-white rounded-lg">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-indigo-950 dark:text-indigo-200 text-base">Today's Recommendations</h3>
                </div>

                <ul className="space-y-3.5">
                    {list.map((rec, index) => (
                        <li key={index} className="flex gap-2.5 items-start text-xs text-indigo-900 dark:text-indigo-300">
                            <span className="inline-flex items-center justify-center min-w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold text-[10px]">
                                {index + 1}
                            </span>
                            <p className="leading-relaxed mt-0.5">{rec}</p>
                        </li>
                    ))}
                </ul>
            </div>

            <button
                type="button"
                className="w-full mt-6 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm hover:shadow"
            >
                <span>Execute Plan</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}
