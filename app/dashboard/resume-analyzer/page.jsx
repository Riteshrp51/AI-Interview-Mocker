"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
    FileText,
    Upload,
    AlertCircle,
    Award,
    Briefcase,
    GraduationCap,
    CheckCircle,
    FileDown,
    Sparkles,
    AlertTriangle,
    LoaderCircle
} from 'lucide-react';

export default function ResumeAnalyzer() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('skills');
    const [data, setData] = useState(null);

    // Fetch existing analysis on load
    useEffect(() => {
        if (user?.email) {
            fetchAnalysis();
        }
    }, [user?.email]);

    const fetchAnalysis = async () => {
        setLoading(true);
        try {
            // Query resume list helper
            const response = await fetch(`/api/resume/get?email=${encodeURIComponent(user.email)}`);
            if (response.ok) {
                const result = await response.json();
                if (result.data) {
                    setData(result.data);
                }
            }
        } catch (err) {
            console.error("Failed to fetch resume analysis:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("resume", file);
        formData.append("email", user.email);

        try {
            const response = await fetch("/api/resume/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Upload failed");
            }

            if (result.data) {
                setData(result.data);
            }
        } catch (err) {
            console.error(err);
            alert(err.message || "Failed to analyze resume.");
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center">
                <LoaderCircle className="animate-spin h-10 w-10 text-blue-600 dark:text-blue-500" />
            </div>
        );
    }

    // Define mock fallback summary just to show premium visuals
    const dummyAnalysis = {
        atsScore: 78,
        technicalSkills: ["React", "JavaScript", "HTML", "CSS", "Next.js", "Docker", "Node.js", "Express", "MongoDB"],
        projects: [
            {
                title: "AI Interview Prep",
                description: "Redesigned the frontend dashboard using React, TailwindCSS, and Drizzle query setups.",
                skillsUsed: ["React", "TailwindCSS"]
            }
        ],
        education: [
            {
                degree: "B.S. in Computer Science",
                institution: "Tech University",
                year: "2024"
            }
        ],
        experience: [
            {
                role: "Frontend Engineer Intern",
                company: "SaaS Startups INC",
                duration: "Jan 2024 - Present",
                description: "Maintained UI systems, reduced bundle compile size, and implemented collapsible navigators."
            }
        ],
        certifications: ["AWS Certified Practitioner"],
        resumeStrengths: [
            "Excellent technical stack grouping",
            "Proper verb choices in work experience items"
        ],
        missingSkills: [
            "REST APIs",
            "Git Action Pipelines"
        ],
        grammarImprovements: [
            "Change 'helped standard projects' to 'collaborated on implementation plans' to sound more authoritative."
        ],
        resumeSummary: "Ambitious Computer Science undergraduate with hands-on exposure designing responsive interfaces and connecting Gemini AI backend models."
    };

    const resumeData = data || {
        fileName: "No resume uploaded yet",
        cloudinaryUrl: "",
        analysis: dummyAnalysis
    };

    const analysis = resumeData.analysis;

    return (
        <div className="space-y-8 pb-12">
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                        <FileText className="w-8 h-8 text-blue-600 dark:text-blue-500" />
                        Resume Analyzer Dashboard
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                        Evaluate your PDF / DOCX resume ATS compatibility score and get actionable feedback.
                    </p>
                </div>

                {/* Upload Widget */}
                <div className="relative">
                    <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>{uploading ? "Analyzing..." : "Upload New Resume"}</span>
                        <input
                            type="file"
                            accept=".pdf,.docx"
                            onChange={handleUpload}
                            disabled={uploading}
                            className="absolute inset-0 opacity-0 cursor-pointer hidden"
                        />
                    </label>
                </div>
            </div>

            {uploading && (
                <div className="p-8 border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl text-center space-y-3">
                    <LoaderCircle className="animate-spin w-8 h-8 mx-auto text-blue-600 dark:text-blue-400" />
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-55">Uploading and Analyzing File...</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs max-w-sm mx-auto">
                        This will take approx 10-15 seconds. Gemini is computing ATS ranking score, parsing keywords, and editing grammar recommendations.
                    </p>
                </div>
            )}

            {/* Main Analysis Display Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Left Column: ATS Circle & Core Summary & Target Improvements */}
                <div className="xl:col-span-1 space-y-6">

                    {/* ATS Score Radial Circle */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 text-center space-y-4 shadow-sm hover:shadow transition-shadow">
                        <h3 className="font-semibold text-zinc-850 dark:text-zinc-250 text-sm">ATS Fit Score</h3>

                        <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle
                                    cx="50" cy="50" r="40"
                                    className="stroke-zinc-100 dark:stroke-zinc-800"
                                    strokeWidth="8" fill="none"
                                />
                                <circle
                                    cx="50" cy="50" r="40"
                                    className="stroke-blue-600 dark:stroke-blue-500"
                                    strokeWidth="8" fill="none"
                                    strokeDasharray={`${2 * Math.PI * 40}`}
                                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - analysis.atsScore / 100)}`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute text-center">
                                <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">{analysis.atsScore}</span>
                                <span className="block text-[10px] text-zinc-400 uppercase font-semibold">ATS Rank</span>
                            </div>
                        </div>

                        <div className="text-xs text-zinc-500 space-y-1">
                            <p className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Target passing rank: {analysis.atsScore >= 75 ? "Passed" : "Needs Review"} (75+)
                            </p>
                            <p className="mt-1 flex items-center justify-center gap-1 text-[11px] bg-zinc-50 dark:bg-zinc-850 py-1.5 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                                <FileText className="w-3.5 h-3.5 text-zinc-400" />
                                {resumeData.fileName}
                            </p>
                        </div>

                        {resumeData.cloudinaryUrl && (
                            <a
                                href={resumeData.cloudinaryUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                            >
                                <FileDown className="w-4 h-4" />
                                <span>View Uploaded File</span>
                            </a>
                        )}
                    </div>

                    {/* AI Summary Card */}
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl p-5 hover:shadow transition-shadow">
                        <h3 className="font-bold text-indigo-950 dark:text-indigo-200 text-sm mb-2 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-indigo-650" />
                            AI Resume Summary
                        </h3>
                        <p className="text-xs text-indigo-900 dark:text-indigo-305 leading-relaxed">
                            {analysis.resumeSummary}
                        </p>
                    </div>

                    {/* Strengths & Missing Keywords */}
                    <div className="space-y-4">
                        {/* Strengths */}
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm mb-3">Key Strengths</h3>
                            <ul className="space-y-2.5">
                                {analysis.resumeStrengths?.map((str, idx) => (
                                    <li key={idx} className="flex gap-2 items-start text-xs text-zinc-650 dark:text-zinc-350">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <span>{str}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Missing Keywords */}
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm mb-3">Missing ATS Keywords</h3>
                            <div className="flex flex-wrap gap-2">
                                {analysis.missingSkills?.map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2 py-1 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-md border border-amber-200/50 dark:border-amber-900/30 inline-flex items-center gap-1"
                                    >
                                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Columns: Tabbed Sections breakdown */}
                <div className="xl:col-span-2 space-y-6">

                    {/* Navigation Tabs */}
                    <div className="flex border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto gap-4">
                        {[
                            { id: 'skills', label: 'Skills & Keywords', icon: Award },
                            { id: 'experience', label: 'Experience', icon: Briefcase },
                            { id: 'projects', label: 'Projects', icon: FileText },
                            { id: 'education', label: 'Education', icon: GraduationCap }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                type="button"
                                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors ${activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 font-bold'
                                        : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-650'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Contents */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm min-h-[400px]">

                        {/* Skills Tab */}
                        {activeTab === 'skills' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base mb-2">Technical Skills Detected</h3>
                                    <p className="text-xs text-zinc-450 dark:text-zinc-400">
                                        Here is a full breakdown of technical keywords matching database configurations found inside your document.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2.5">
                                    {analysis.technicalSkills?.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-lg transition-colors"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                {analysis.certifications && analysis.certifications.length > 0 && (
                                    <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                        <h4 className="font-bold text-zinc-900 dark:text-zinc-50 text-sm mb-3">Certifications</h4>
                                        <ul className="space-y-2">
                                            {analysis.certifications.map((cert, idx) => (
                                                <li key={idx} className="flex gap-2 items-center text-xs text-zinc-600 dark:text-zinc-400">
                                                    <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                                                    <span>{cert}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Experience Tab */}
                        {activeTab === 'experience' && (
                            <div className="space-y-6">
                                <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base mb-2">Work Experience Overview</h3>

                                <div className="relative pl-6 border-l border-zinc-200 dark:border-zinc-800 space-y-6">
                                    {analysis.experience?.map((exp, idx) => (
                                        <div key={idx} className="relative space-y-1">
                                            <span className="absolute -left-[31px] top-1 px-1.5 py-1.5 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 text-zinc-500 flex items-center justify-center">
                                                <Briefcase className="w-3 h-3 text-zinc-400" />
                                            </span>
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                                <div>
                                                    <h4 className="font-bold text-zinc-850 dark:text-zinc-150 text-sm">{exp.role}</h4>
                                                    <h5 className="text-xs text-zinc-550 dark:text-zinc-400 font-semibold">{exp.company}</h5>
                                                </div>
                                                <span className="text-[10px] text-zinc-400 font-medium px-2 py-0.5 bg-zinc-50 dark:bg-zinc-850 rounded border border-zinc-150 dark:border-zinc-800 mt-1 sm:mt-0">
                                                    {exp.duration}
                                                </span>
                                            </div>
                                            <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed pt-1.5">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Projects Tab */}
                        {activeTab === 'projects' && (
                            <div className="space-y-6">
                                <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base mb-2">Projects Portfolios</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {analysis.projects?.map((proj, idx) => (
                                        <div key={idx} className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl space-y-3 bg-zinc-50/50 dark:bg-zinc-850/10">
                                            <div>
                                                <h4 className="font-bold text-zinc-850 dark:text-zinc-150 text-sm">{proj.title}</h4>
                                                <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1 leading-relaxed">
                                                    {proj.description}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 pt-2">
                                                {proj.skillsUsed?.map((sk, sidx) => (
                                                    <span key={sidx} className="px-2 py-0.5 bg-zinc-150 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-350 text-[10px] font-medium rounded">
                                                        {sk}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education Tab */}
                        {activeTab === 'education' && (
                            <div className="space-y-6">
                                <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base mb-2">Education Timeline</h3>

                                <div className="relative pl-6 border-l border-zinc-200 dark:border-zinc-800 space-y-6">
                                    {analysis.education?.map((edu, idx) => (
                                        <div key={idx} className="relative space-y-1">
                                            <span className="absolute -left-[31px] top-1 px-1.5 py-1.5 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 text-zinc-500 flex items-center justify-center">
                                                <GraduationCap className="w-3 h-3 text-zinc-400" />
                                            </span>
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-bold text-zinc-850 dark:text-zinc-150 text-sm">{edu.degree}</h4>
                                                <span className="text-[10px] text-zinc-400 font-medium px-2 py-0.5 bg-zinc-50 dark:bg-zinc-850 rounded border border-zinc-150 dark:border-zinc-800">
                                                    {edu.year}
                                                </span>
                                            </div>
                                            <p className="text-zinc-550 dark:text-zinc-400 text-xs font-semibold">
                                                {edu.institution}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Grammar & Phrasing Suggestions */}
                    {analysis.grammarImprovements && analysis.grammarImprovements.length > 0 && (
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-3">
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4 text-zinc-500" />
                                Recommended Grammar & Style Improvements
                            </h3>
                            <ul className="space-y-3">
                                {analysis.grammarImprovements.map((suggestion, idx) => (
                                    <li key={idx} className="flex gap-2.5 items-start text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed bg-zinc-50 dark:bg-zinc-850/50 p-3 rounded-lg border border-zinc-150 dark:border-zinc-800/40">
                                        <span className="text-amber-600 dark:text-amber-450 font-bold">💡 Suggestion:</span>
                                        <span>{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}
