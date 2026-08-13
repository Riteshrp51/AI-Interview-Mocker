"use client";
import React, { useEffect, useState } from 'react';
import { 
    BarChart3, 
    ArrowLeft, 
    TrendingUp, 
    Award, 
    HelpCircle, 
    BookOpen, 
    Sparkles, 
    LoaderCircle,
    ThumbsUp,
    ThumbsDown,
    BrainCircuit
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/utils/db';
import { MockInterview, UserAnswer } from '@/utils/schema';
import { eq, desc } from 'drizzle-orm';
import { chatSession } from '@/utils/GeminiAIModel';

export default function Analytics() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [interviews, setInterviews] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [stats, setStats] = useState({
        totalInterviews: 0,
        totalQuestions: 0,
        averageScore: 0,
        accuracyRate: 0
    });
    const [aiRecommendations, setAiRecommendations] = useState(null);
    const [generatingAI, setGeneratingAI] = useState(false);

    useEffect(() => {
        if (user?.email) {
            fetchAnalyticsData();
        }
    }, [user?.email]);

    const fetchAnalyticsData = async () => {
        setLoading(true);
        try {
            // 1. Fetch interviews
            const userInterviews = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.createdBy, user.email))
                .orderBy(desc(MockInterview.id));

            setInterviews(userInterviews);

            // 2. Fetch answers
            const userRoutesAnswers = await db
                .select()
                .from(UserAnswer)
                .where(eq(UserAnswer.userEmail, user.email))
                .orderBy(UserAnswer.id);

            setAnswers(userRoutesAnswers);

            // 3. Calculate statistics
            const totalInt = userInterviews.length;
            const totalQues = userRoutesAnswers.length;
            
            const totalScore = userRoutesAnswers.reduce((sum, curr) => sum + (Number(curr.rating) || 0), 0);
            const avgScore = totalQues > 0 ? (totalScore / totalQues).toFixed(1) : 0;
            const accuracy = totalQues > 0 ? ((totalScore / (totalQues * 10)) * 100).toFixed(0) : 0;

            setStats({
                totalInterviews: totalInt,
                totalQuestions: totalQues,
                averageScore: avgScore,
                accuracyRate: accuracy
            });

            // 4. Generate AI Recommendations if there are answers
            if (userRoutesAnswers.length > 0) {
                generateAIAnalytics(userRoutesAnswers);
            }

        } catch (error) {
            console.error("Failed to load analytics data:", error);
        } finally {
            setLoading(false);
        }
    };

    const generateAIAnalytics = async (userAnswers) => {
        setGeneratingAI(true);
        try {
            const mappedAnswers = userAnswers.map(ans => ({
                question: ans.question.substring(0, 60) + '...',
                rating: ans.rating,
                feedback: ans.feedback.substring(0, 80) + '...'
            }));

            const prompt = `
            You are an AI performance analytics system for PrepAI.
            Analyze the candidate's answers and ratings:
            ${JSON.stringify(mappedAnswers)}

            Identify:
            1. Strengths (topics, logic, or communication domains with rating >= 8).
            2. Weaknesses (topics, syntax errors, or communication areas with rating < 7).
            3. Actionable preparation advice (to improve scores in future mock tests).

            Return ONLY a valid flat JSON matching this schema:
            {
              "strengths": ["Strength point 1", "Strength point 2"],
              "weaknesses": ["Improvement point 1", "Improvement point 2"],
              "advice": ["Specific guide/action 1", "Specific guide/action 2"]
            }
            `;

            const result = await chatSession.sendMessage(prompt);
            let rawText = (await result.response.text()).trim();

            rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const firstBrace = rawText.indexOf('{');
            const lastBrace = rawText.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                rawText = rawText.substring(firstBrace, lastBrace + 1);
            }

            const parsed = JSON.parse(rawText);
            setAiRecommendations(parsed);
        } catch (err) {
            console.error("Failed to generate AI recommendations:", err);
        } finally {
            setGeneratingAI(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center">
                <LoaderCircle className="animate-spin h-10 w-10 text-blue-600 dark:text-blue-500" />
            </div>
        );
    }

    // Chart logic - plot chronological answers progress
    const chartPoints = answers.map((ans, idx) => ({
        x: idx,
        y: ans.rating
    }));
    
    const svgWidth = 600;
    const svgHeight = 220;
    const padding = 35;
    
    // Scale mapping coordinates
    const getXCoord = (idx) => {
        if (chartPoints.length <= 1) return padding + (svgWidth - 2 * padding) / 2;
        return padding + (idx / (chartPoints.length - 1)) * (svgWidth - 2 * padding);
    };

    const getYCoord = (score) => {
        return svgHeight - padding - (score / 10) * (svgHeight - 2 * padding);
    };

    const dPath = chartPoints.reduce((pathStr, pt, idx) => {
        const x = getXCoord(pt.x);
        const y = getYCoord(pt.y);
        return idx === 0 ? `M ${x} ${y}` : `${pathStr} L ${x} ${y}`;
    }, '');

    return (
        <div className="space-y-8 pb-12">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                        <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-500" />
                        Performance Analytics
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                        Detailed overview of your technical answers, score charts, strengths, and smart suggestions.
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

            {answers.length === 0 ? (
                <div className="h-[450px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl flex flex-col items-center justify-center text-center p-6 space-y-4 shadow-sm">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-850 rounded-full border border-zinc-150 dark:border-zinc-850">
                        <BarChart3 className="w-10 h-10 text-zinc-400" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">No Answers Recorded Yet</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs max-w-sm">
                            Create a Mock Interview on your dashboard, complete it, and save your answers to unlock detailed statistics charts.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Total Mock Interviews', value: stats.totalInterviews, icon: BookOpen, bg: 'bg-blue-500' },
                            { label: 'Total Questions Checked', value: stats.totalQuestions, icon: HelpCircle, bg: 'bg-indigo-500' },
                            { label: 'Average rating Score', value: `${stats.averageScore}/10`, icon: Award, bg: 'bg-emerald-500' },
                            { label: 'Accurate Answers Rate', value: `${stats.accuracyRate}%`, icon: TrendingUp, bg: 'bg-purple-500' }
                        ].map((card, idx) => (
                            <div key={idx} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                                <div className={`p-3 rounded-lg text-white ${card.bg}`}>
                                    <card.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-450 uppercase font-bold tracking-wider">{card.label}</p>
                                    <p className="text-xl font-black text-zinc-855 dark:text-zinc-100">{card.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Progress Chart & Score Ledger split screen */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Progress SVG Line Chart */}
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm lg:col-span-2 space-y-4">
                            <div>
                                <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                                    Ratings Score Timeline
                                </h3>
                                <p className="text-zinc-450 dark:text-zinc-500 text-[10px]">Chrono-progression tracking across mock interview answers.</p>
                            </div>
                            
                            {/* SVG Chart display */}
                            <div className="overflow-x-auto">
                                <svg width="100%" height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="mx-auto overflow-visible select-none">
                                    
                                    {/* Grid Lines */}
                                    {Array.from({ length: 6 }).map((_, gidx) => {
                                        const yVal = padding + (gidx / 5) * (svgHeight - 2 * padding);
                                        const ratingLabel = 10 - gidx * 2;
                                        return (
                                            <g key={gidx}>
                                                <line 
                                                    x1={padding} y1={yVal} x2={svgWidth - padding} y2={yVal}
                                                    className="stroke-zinc-100 dark:stroke-zinc-800/60"
                                                    strokeWidth={1}
                                                />
                                                <text x={padding - 10} y={yVal + 4} className="text-[9px] fill-zinc-400 font-bold font-mono text-right">{ratingLabel}</text>
                                            </g>
                                        );
                                    })}

                                    {/* Line Connection Path */}
                                    {dPath && (
                                        <path 
                                            d={dPath} 
                                            fill="none" 
                                            className="stroke-blue-600 dark:stroke-blue-500" 
                                            strokeWidth={2.5} 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                        />
                                    )}

                                    {/* Coordinates circular points */}
                                    {chartPoints.map((pt, pidx) => {
                                        const x = getXCoord(pt.x);
                                        const y = getYCoord(pt.y);
                                        return (
                                            <g key={pidx} className="group cursor-pointer">
                                                <circle 
                                                    cx={x} cy={y} r={4.5} 
                                                    className="fill-white stroke-blue-600 dark:stroke-blue-500"
                                                    strokeWidth={2}
                                                />
                                                {/* Tooltip on hover */}
                                                <circle 
                                                    cx={x} cy={y} r={12} 
                                                    className="fill-blue-500 opacity-0 hover:opacity-10 transition-opacity"
                                                />
                                                <title>{`Q#${pidx + 1}: Rating ${pt.y}/10`}</title>
                                            </g>
                                        );
                                    })}

                                </svg>
                            </div>
                        </div>

                        {/* Recent answers log list */}
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
                            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">Checkpoints Log</h3>
                            <div className="space-y-3 overflow-y-auto max-h-[220px] pr-1">
                                {answers.slice(-5).reverse().map((ans, idx) => (
                                    <div key={idx} className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-150 dark:border-zinc-850 flex items-start justify-between gap-3 text-xs">
                                        <div className="truncate space-y-1">
                                            <p className="font-bold text-zinc-800 dark:text-zinc-200 truncate">{ans.question}</p>
                                            <p className="text-[9px] text-zinc-400 font-medium">{ans.createdAt}</p>
                                        </div>
                                        <span className={`px-2 py-0.5 font-bold font-mono text-[10px] rounded shrink-0 ${
                                            ans.rating >= 8 
                                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450 border border-emerald-250/20' 
                                                : ans.rating >= 6
                                                ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950/20 dark:text-yellow-450 border border-yellow-250/20'
                                                : 'bg-red-50 text-red-600 dark:bg-red-955/20 dark:text-red-450 border border-red-250/20'
                                        }`}>
                                            {ans.rating}/10
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* AI Analytics Evaluation Section */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
                                    <BrainCircuit className="w-5 h-5 text-indigo-500" />
                                    AI Smart Recommendations
                                </h3>
                                <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">
                                    Personalized intelligence highlights generated based on your mock evaluations.
                                </p>
                            </div>
                            
                            {generatingAI && (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-500">
                                    <LoaderCircle className="animate-spin w-3.5 h-3.5" />
                                    Analyzing...
                                </span>
                            )}
                        </div>

                        {aiRecommendations ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                
                                {/* Strengths */}
                                <div className="space-y-3 bg-emerald-50/10 dark:bg-emerald-955/5 p-4 rounded-xl border border-emerald-100/50 dark:border-emerald-900/10">
                                    <h4 className="font-bold text-xs text-emerald-600 dark:text-emerald-450 flex items-center gap-1.5 uppercase tracking-wider">
                                        <ThumbsUp className="w-4 h-4" />
                                        Strong Domains
                                    </h4>
                                    <ul className="space-y-2">
                                        {aiRecommendations.strengths.map((str, sidx) => (
                                            <li key={sidx} className="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed flex items-start gap-1.5">
                                                <span className="text-emerald-500 font-extrabold">✓</span>
                                                <span>{str}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Weaknesses */}
                                <div className="space-y-3 bg-red-50/10 dark:bg-red-955/5 p-4 rounded-xl border border-red-100/50 dark:border-red-900/10">
                                    <h4 className="font-bold text-xs text-rose-600 dark:text-rose-450 flex items-center gap-1.5 uppercase tracking-wider">
                                        <ThumbsDown className="w-4 h-4" />
                                        Development Areas
                                    </h4>
                                    <ul className="space-y-2">
                                        {aiRecommendations.weaknesses.map((weak, widx) => (
                                            <li key={widx} className="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed flex items-start gap-1.5">
                                                <span className="text-rose-500 font-extrabold">⚠</span>
                                                <span>{weak}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Prep Advice */}
                                <div className="space-y-3 bg-indigo-50/10 dark:bg-indigo-955/5 p-4 rounded-xl border border-indigo-100/50 dark:border-indigo-900/10">
                                    <h4 className="font-bold text-xs text-indigo-650 dark:text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                                        <Sparkles className="w-4 h-4" />
                                        Preparation Advice
                                    </h4>
                                    <ul className="space-y-2">
                                        {aiRecommendations.advice.map((adv, aidx) => (
                                            <li key={aidx} className="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed flex items-start gap-1.5 font-medium">
                                                <span className="text-indigo-500">💡</span>
                                                <span>{adv}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                            </div>
                        ) : (
                            <div className="p-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-center text-zinc-400 text-xs bg-zinc-50/50 dark:bg-zinc-950/20">
                                Submit more mock interview answers to activate the smart AI analysis review.
                            </div>
                        )}

                    </div>

                </div>
            )}

        </div>
    );
}
