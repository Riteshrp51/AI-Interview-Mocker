"use client";
import React, { useEffect, useState } from 'react';
import { 
    Map, 
    ArrowLeft, 
    Sparkles, 
    LoaderCircle, 
    BookOpen, 
    CheckSquare, 
    Square, 
    Compass, 
    Clock, 
    ExternalLink,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq, desc } from 'drizzle-orm';
import { chatSession } from '@/utils/GeminiAIModel';

export default function LearningRoadmap() {
    const { user } = useAuth();
    const [targetRole, setTargetRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [roadmap, setRoadmap] = useState(null);
    const [expandedWeeks, setExpandedWeeks] = useState({ 0: true }); // Keep first week expanded by default
    const [completedItems, setCompletedItems] = useState({}); // { "week-index-topic": boolean }

    useEffect(() => {
        if (user?.email) {
            findLatestRole();
        }
    }, [user?.email]);

    const findLatestRole = async () => {
        try {
            const interviews = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.createdBy, user.email))
                .orderBy(desc(MockInterview.id));

            if (interviews.length > 0 && interviews[0].jobPosition) {
                setTargetRole(interviews[0].jobPosition);
            }
        } catch (error) {
            console.error("Error looking up user target role:", error);
        }
    };

    const handleGenerateRoadmap = async (e) => {
        e?.preventDefault();
        if (!targetRole.trim()) {
            alert("Please enter a target job role first!");
            return;
        }

        setLoading(true);
        try {
            const prompt = `
            You are an expert curriculum designer and senior software engineer.
            Create a highly detailed 4-week structured preparation curriculum/roadmap for the target role: "${targetRole}".
            The roadmap must focus on preparing the candidate for technical interviews, coding rounds, and core system architectures.
            
            Return ONLY a valid flat JSON matching this schema exactly (do not output any conversational text or markdown codeblocks outside the JSON brackets):
            {
              "role": "${targetRole}",
              "duration": "4 Weeks",
              "weeks": [
                {
                  "weekNumber": 1,
                  "title": "Week 1 Core Topic Name",
                  "topics": ["Detail Topic 1", "Detail Topic 2", "Detail Topic 3"],
                  "milestones": ["Milestone check/interview practice question 1", "Milestone check/interview practice question 2"],
                  "resources": ["Reference study guide/link 1", "Reference study guide/link 2"],
                  "hoursRequired": 10
                },
                {
                  "weekNumber": 2,
                  "title": "Week 2 Core Topic Name",
                  "topics": ["Detail Topic 1", "Detail Topic 2"],
                  "milestones": ["Milestone 1"],
                  "resources": ["Reference 1"],
                  "hoursRequired": 8
                },
                {
                  "weekNumber": 3,
                  "title": "Week 3 Core Topic Name",
                  "topics": ["Detail Topic 1"],
                  "milestones": ["Milestone 1"],
                  "resources": ["Reference 1"],
                  "hoursRequired": 12
                },
                {
                  "weekNumber": 4,
                  "title": "Week 4 Core Topic Name",
                  "topics": ["Detail Topic 1"],
                  "milestones": ["Milestone 1"],
                  "resources": ["Reference 1"],
                  "hoursRequired": 8
                }
              ]
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

            const parsedRoadmap = JSON.parse(rawText);
            setRoadmap(parsedRoadmap);
            setExpandedWeeks({ 0: true });
        } catch (error) {
            console.error("Failed to generate dynamic AI roadmap:", error);
            alert("Encountered an issue creating your roadmap. Please check your role inputs and try again.");
        } finally {
            setLoading(false);
        }
    };

    const toggleWeekExpansion = (idx) => {
        setExpandedWeeks(prev => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };

    const toggleCompleted = (key) => {
        setCompletedItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                        <Map className="w-8 h-8 text-blue-600 dark:text-blue-500" />
                        AI Learning Roadmap
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                        Get customized structured curricula dynamically tailored based on your target domains.
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

            {/* Role input card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-zinc-850 dark:text-zinc-200">Configure Target Role</h3>
                <form onSubmit={handleGenerateRoadmap} className="flex flex-col sm:flex-row gap-3">
                    <input 
                        type="text"
                        required
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="Ex: Senior React Developer, DevOps Engineer..."
                        className="flex-1 text-xs p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={loading || !targetRole.trim()}
                        className="py-3 px-5 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-150 disabled:text-zinc-400 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow transition-colors cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <LoaderCircle className="animate-spin w-4 h-4" />
                                <span>Generating Roadmap...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                <span>Generate Prep Roadmap</span>
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Roadmap Output */}
            {roadmap ? (
                <div className="space-y-6">
                    
                    {/* Header info */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-xl text-white shadow-md space-y-2">
                        <div className="flex items-center gap-2">
                            <Compass className="w-5 h-5" />
                            <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded-full">Curriculum Pathway</span>
                        </div>
                        <h2 className="text-2xl font-black">{roadmap.role} Study Roadmap</h2>
                        <p className="text-xs text-white/80">Estimated prep schedule: <strong>{roadmap.duration}</strong>. Expand weeks below to view tasks.</p>
                    </div>

                    {/* Timeline Weeks list */}
                    <div className="space-y-4">
                        {roadmap.weeks.map((week, idx) => {
                            const isExpanded = expandedWeeks[idx];
                            
                            // Calculate completed tasks ratio
                            const weekKeys = [
                                ...week.topics.map(t => `w-${idx}-topic-${t}`),
                                ...week.milestones.map(m => `w-${idx}-milestone-${m}`)
                            ];
                            const completedCount = weekKeys.filter(k => completedItems[k]).length;
                            const totalCount = weekKeys.length;
                            const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                            return (
                                <div 
                                    key={idx} 
                                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm"
                                >
                                    {/* Week Header */}
                                    <div 
                                        onClick={() => toggleWeekExpansion(idx)}
                                        className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-850/20 select-none border-b border-zinc-100 dark:border-zinc-850"
                                    >
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            <span className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-650 dark:text-blue-400 font-extrabold text-xs flex items-center justify-center shrink-0">
                                                W{week.weekNumber}
                                            </span>
                                            <div className="min-w-0">
                                                <h3 className="font-extrabold text-xs sm:text-sm text-zinc-900 dark:text-zinc-50 truncate">{week.title}</h3>
                                                <div className="flex items-center gap-3 mt-1 text-[10px] text-zinc-400 font-semibold">
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {week.hoursRequired} hrs study</span>
                                                    <span>•</span>
                                                    <span className="text-blue-600 dark:text-blue-400">{completionPercent}% completed</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 shrink-0">
                                            {/* Small visual bar */}
                                            <div className="hidden sm:block w-20 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300" style={{ width: `${completionPercent}%` }} />
                                            </div>
                                            {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                                        </div>
                                    </div>

                                    {/* Week Expanded Body */}
                                    {isExpanded && (
                                        <div className="p-5 space-y-6 bg-zinc-50/30 dark:bg-zinc-950/15">
                                            
                                            {/* Sub Topics List */}
                                            <div className="space-y-2">
                                                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Topics to Learn</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                                    {week.topics.map((topic, tidx) => {
                                                        const key = `w-${idx}-topic-${topic}`;
                                                        const isDone = !!completedItems[key];
                                                        return (
                                                            <div 
                                                                key={tidx}
                                                                onClick={() => toggleCompleted(key)}
                                                                className={`p-3 rounded-lg border text-xs flex items-start gap-3 cursor-pointer transition-all duration-200 select-none ${
                                                                    isDone
                                                                        ? 'border-emerald-250 bg-emerald-50/10 text-emerald-800 dark:border-emerald-900/20 dark:bg-emerald-950/5 dark:text-emerald-400 line-through opacity-80'
                                                                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-blue-300'
                                                                }`}
                                                            >
                                                                {isDone ? <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> : <Square className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />}
                                                                <span className="leading-relaxed">{topic}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Milestones Checkpoint */}
                                            <div className="space-y-2">
                                                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Milestones & Practice Checkpoints</h4>
                                                <div className="space-y-2">
                                                    {week.milestones.map((milestone, midx) => {
                                                        const key = `w-${idx}-milestone-${milestone}`;
                                                        const isDone = !!completedItems[key];
                                                        return (
                                                            <div 
                                                                key={midx}
                                                                onClick={() => toggleCompleted(key)}
                                                                className={`p-3 rounded-lg border text-xs flex items-start gap-3 cursor-pointer transition-all duration-200 select-none ${
                                                                    isDone
                                                                        ? 'border-emerald-250 bg-emerald-50/10 text-emerald-800 dark:border-emerald-900/20 dark:bg-emerald-950/5 dark:text-emerald-450 line-through opacity-85'
                                                                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-blue-300'
                                                                }`}
                                                            >
                                                                {isDone ? <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> : <Square className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />}
                                                                <span className="leading-relaxed font-semibold">{milestone}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Study References */}
                                            {week.resources && week.resources.length > 0 && (
                                                <div className="space-y-2 border-t border-zinc-150 dark:border-zinc-850 pt-4">
                                                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                                                        <BookOpen className="w-3.5 h-3.5" />
                                                        <span>Recommended Study Resources</span>
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {week.resources.map((res, ridx) => (
                                                            <div 
                                                                key={ridx}
                                                                className="px-3 py-1.5 text-[10px] font-medium bg-blue-50 dark:bg-blue-955/20 text-blue-700 dark:text-blue-400 border border-blue-150/40 rounded-lg flex items-center gap-1.5"
                                                            >
                                                                <span>{res}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </div>
            ) : (
                <div className="h-[300px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl flex flex-col items-center justify-center text-center p-6 space-y-4 shadow-sm">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-850 rounded-full border border-zinc-150 dark:border-zinc-850">
                        <Map className="w-10 h-10 text-zinc-400" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">Enter Target Job Position</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs max-w-sm">
                            Configure your desired career track role in target inputs above to generate a custom 4-week preparation timeline syllabus checklist.
                        </p>
                    </div>
                </div>
            )}

        </div>
    );
}
