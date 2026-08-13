"use client";
import React, { useEffect, useState } from 'react';
import { 
    History, 
    ArrowLeft, 
    Calendar, 
    Briefcase, 
    Clock, 
    Award, 
    ArrowRight, 
    LoaderCircle,
    CheckCircle,
    PlayCircle
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/utils/db';
import { MockInterview, UserAnswer } from '@/utils/schema';
import { eq, desc } from 'drizzle-orm';

export default function InterviewHistory() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [historyList, setHistoryList] = useState([]);

    useEffect(() => {
        if (user?.email) {
            fetchHistoryData();
        }
    }, [user?.email]);

    const fetchHistoryData = async () => {
        setLoading(true);
        try {
            // 1. Fetch all interviews created by the user
            const interviews = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.createdBy, user.email))
                .orderBy(desc(MockInterview.id));

            // 2. Fetch all user answers to calculate score maps
            const answers = await db
                .select()
                .from(UserAnswer)
                .where(eq(UserAnswer.userEmail, user.email));

            // Group answers by mockIdRef
            const answersMap = {};
            answers.forEach(ans => {
                if (!answersMap[ans.mockIdRef]) {
                    answersMap[ans.mockIdRef] = [];
                }
                answersMap[ans.mockIdRef].push(ans);
            });

            // 3. Map interviews with scores and metadata
            const mappedHistory = interviews.map((interview) => {
                const sessionAnswers = answersMap[interview.mockId] || [];
                
                // Parse questions list from JSON response
                let totalQuestions = 0;
                try {
                    const parsedQuestions = typeof interview.jsonMockResp === 'string'
                        ? JSON.parse(interview.jsonMockResp)
                        : interview.jsonMockResp;
                    totalQuestions = Array.isArray(parsedQuestions) ? parsedQuestions.length : 5;
                } catch {
                    totalQuestions = 5;
                }

                const answeredCount = sessionAnswers.length;
                const totalScore = sessionAnswers.reduce((sum, curr) => sum + (Number(curr.rating) || 0), 0);
                const averageScore = answeredCount > 0 ? (totalScore / answeredCount).toFixed(1) : 0;
                const status = answeredCount >= totalQuestions ? 'Completed' : answeredCount > 0 ? 'In Progress' : 'Not Started';

                return {
                    ...interview,
                    totalQuestions,
                    answeredCount,
                    averageScore,
                    status,
                    answers: sessionAnswers
                };
            });

            setHistoryList(mappedHistory);
        } catch (error) {
            console.error("Failed to load interview history:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center">
                <LoaderCircle className="animate-spin h-10 w-10 text-blue-600 dark:text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                        <History className="w-8 h-8 text-blue-600 dark:text-blue-500" />
                        Detailed Interview History
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                        Browse scores, check dates, and review feedback from your previous mock interview sessions.
                    </p>
                </div>
                <Link
                    href="/dashboard"
                    className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-sm font-semibold rounded-lg transition-colors inline-flex items-center gap-2 w-fit"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Dashboard</span>
                </Link>
            </div>

            {/* History Cards timeline */}
            {historyList.length === 0 ? (
                <div className="h-[350px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl flex flex-col items-center justify-center text-center p-6 space-y-4 shadow-sm">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-850 rounded-full border border-zinc-150 dark:border-zinc-850">
                        <History className="w-10 h-10 text-zinc-400" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">No History Recorded</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs max-w-sm">
                            You haven't generated any mock interviews yet. Head back to the dashboard to begin your practice.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {historyList.map((item) => {
                        const dateStr = item.createdAt 
                            ? new Date(item.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })
                            : 'Date not available';

                        return (
                            <div 
                                key={item.mockId} 
                                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all space-y-4 flex flex-col justify-between"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                    {/* Left information details */}
                                    <div className="space-y-2.5">
                                        <div className="flex items-center flex-wrap gap-2.5">
                                            <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full border uppercase tracking-wider flex items-center gap-1 ${
                                                item.status === 'Completed'
                                                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450 border-emerald-250/25'
                                                    : item.status === 'In Progress'
                                                    ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-450 border-amber-250/25'
                                                    : 'bg-zinc-50 text-zinc-600 dark:bg-zinc-850/50 dark:text-zinc-400 border-zinc-200'
                                            }`}>
                                                {item.status === 'Completed' ? <CheckCircle className="w-2.5 h-2.5" /> : <PlayCircle className="w-2.5 h-2.5" />}
                                                {item.status}
                                            </span>
                                            <span className="text-[10px] text-zinc-400 font-bold flex items-center gap-1 font-mono">
                                                <Calendar className="w-3 h-3" />
                                                {dateStr}
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="font-extrabold text-base text-zinc-950 dark:text-zinc-50">{item.jobPosition}</h3>
                                            <p className="text-[10px] text-zinc-400 font-bold flex items-center gap-1 font-mono uppercase tracking-wider">
                                                <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                                                {item.jobExperience} Years Experience
                                            </p>
                                        </div>

                                        <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-normal max-w-2xl">
                                            <strong>Key skills/stack:</strong> {item.jobDesc}
                                        </p>
                                    </div>

                                    {/* Score Card on the Right */}
                                    <div className="flex items-center gap-4 bg-zinc-50/50 dark:bg-zinc-950/40 p-4 rounded-xl border border-zinc-150 dark:border-zinc-850 shrink-0 w-full sm:w-fit justify-between">
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] text-zinc-450 uppercase font-bold tracking-wider">Rating Score</p>
                                            <p className="text-2xl font-black text-blue-650 dark:text-blue-400 leading-none">{item.averageScore}/10</p>
                                        </div>
                                        <div className="h-10 w-px bg-zinc-200 dark:bg-zinc-800" />
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] text-zinc-450 uppercase font-bold tracking-wider">Questions</p>
                                            <p className="text-base font-bold text-zinc-800 dark:text-zinc-200 leading-none">
                                                {item.answeredCount} <span className="text-[10px] text-zinc-400 font-normal">/ {item.totalQuestions}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom actions bar */}
                                <div className="border-t border-zinc-100 dark:border-zinc-850 pt-3 flex flex-wrap gap-3 justify-end items-center">
                                    {item.status === 'Completed' || item.answeredCount > 0 ? (
                                        <Link 
                                            href={`/dashboard/interview/${item.mockId}/feedback`}
                                            className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <span>View Evaluation Feedback</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    ) : null}

                                    <Link 
                                        href={`/dashboard/interview/${item.mockId}/start`}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow cursor-pointer"
                                    >
                                        <span>{item.status === 'In Progress' ? 'Resume Practice' : 'Restart Practice'}</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
}
