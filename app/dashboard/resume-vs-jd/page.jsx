"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
    FileText,
    Search,
    Sparkles,
    LoaderCircle,
    AlertTriangle,
    CheckCircle,
    Clock,
    ArrowRight,
    TrendingUp,
    Sliders,
    ChevronRight,
    Upload
} from 'lucide-react';

export default function ResumeVsJdMatcher() {
    const { user } = useAuth();

    // State
    const [loading, setLoading] = useState(true);
    const [comparing, setComparing] = useState(false);
    const [resumeData, setResumeData] = useState(null);
    const [jdText, setJdText] = useState('');
    const [activeReport, setActiveReport] = useState(null);
    const [history, setHistory] = useState([]);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadingResume, setUploadingResume] = useState(false);

    // Fetch initial data (resume and match history)
    useEffect(() => {
        if (user?.email) {
            fetchInitialData();
        }
    }, [user?.email]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            // 1. Fetch latest resume
            const resResume = await fetch(`/api/resume/get?email=${encodeURIComponent(user.email)}`);
            if (resResume.ok) {
                const body = await resResume.json();
                if (body.data) {
                    setResumeData(body.data);
                }
            }

            // 2. Fetch match history
            const resHistory = await fetch(`/api/resume/match?email=${encodeURIComponent(user.email)}`);
            if (resHistory.ok) {
                const body = await resHistory.json();
                if (body.data && body.data.length > 0) {
                    setHistory(body.data);
                    setActiveReport(body.data[0]); // Default to show latest match report
                }
            }

        } catch (err) {
            console.error("Error fetching matching workspace data:", err);
        } finally {
            setLoading(false);
        }
    };

    // Upload fallback if no resume exists
    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingResume(true);
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
                setResumeData(result.data);
                alert("Resume uploaded successfully! Paste a JD below and compare.");
            }
        } catch (err) {
            console.error("Resume upload failed:", err);
            alert(err.message || "Failed to process resume.");
        } finally {
            setUploadingResume(false);
        }
    };

    const handleCompare = async (e) => {
        e.preventDefault();
        if (!jdText.trim()) {
            alert("Please paste a Job Description first.");
            return;
        }
        if (!resumeData && !uploadedFile) {
            alert("Please upload a resume first.");
            return;
        }

        setComparing(true);
        try {
            const response = await fetch("/api/resume/match", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: user.email,
                    jobDescription: jdText
                })
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Comparison failed");
            }

            if (result.data) {
                setActiveReport(result.data);
                // Prepend to history stack
                setHistory(prev => [result.data, ...prev]);
                setJdText(''); // Clear input
            }
        } catch (err) {
            console.error("Comparison request failed:", err);
            alert(err.message || "Something went wrong during evaluation.");
        } finally {
            setComparing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center">
                <LoaderCircle className="animate-spin h-10 w-10 text-blue-650 dark:text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Title Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                    <Sliders className="w-8 h-8 text-blue-600 dark:text-blue-500" />
                    Resume vs JD Matcher
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                    Evaluate how well your resume matches any target job description using Gemini AI.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Left Column: Form Inputs & Matches History list */}
                <div className="space-y-6 xl:col-span-1">

                    {/* Resume Checklist Card */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
                        <h3 className="font-bold text-sm text-zinc-850 dark:text-zinc-200">1. Target Resume</h3>

                        {resumeData ? (
                            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-850/50 border border-zinc-200 dark:border-zinc-800/80 rounded-lg">
                                <div className="flex items-center gap-2.5 truncate">
                                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-500 shrink-0" />
                                    <div className="truncate">
                                        <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{resumeData.fileName}</p>
                                        <p className="text-[10px] text-zinc-450 dark:text-zinc-400 font-medium">Ready to match</p>
                                    </div>
                                </div>

                                {/* Reupload button */}
                                <label className="text-[10px] text-blue-650 dark:text-blue-450 hover:underline font-bold cursor-pointer shrink-0">
                                    Replace
                                    <input type="file" accept=".pdf,.docx" onChange={handleResumeUpload} className="hidden" />
                                </label>
                            </div>
                        ) : (
                            <div className="p-4 border border-dashed border-red-200 dark:border-red-900 bg-red-50/30 dark:bg-red-950/10 rounded-lg text-center space-y-3">
                                <AlertTriangle className="w-6 h-6 text-red-500 mx-auto" />
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">No Resume Uploaded</p>
                                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal max-w-xs mx-auto">
                                        Please upload a resume first to run comparison checks.
                                    </p>
                                </div>

                                <label className="inline-flex py-1.5 px-3 bg-blue-655 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg cursor-pointer shadow items-center gap-1.5 transition-colors">
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>{uploadingResume ? "Uploading..." : "Upload Resume Now"}</span>
                                    <input type="file" accept=".pdf,.docx" onChange={handleResumeUpload} disabled={uploadingResume} className="hidden" />
                                </label>
                            </div>
                        )}
                    </div>

                    {/* JD Input Forms */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
                        <h3 className="font-bold text-sm text-zinc-850 dark:text-zinc-200">2. Match Job Description</h3>

                        <form onSubmit={handleCompare} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Paste Job Description Text</label>
                                <textarea
                                    required
                                    rows={6}
                                    value={jdText}
                                    onChange={(e) => setJdText(e.target.value)}
                                    placeholder="Paste the target job description or requirements list..."
                                    className="w-full text-xs p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={comparing || !resumeData}
                                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:text-zinc-400 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow transition-colors cursor-pointer"
                            >
                                {comparing ? (
                                    <>
                                        <LoaderCircle className="animate-spin w-4 h-4" />
                                        <span>Analyzing Compatibility...</span>
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-4 h-4" />
                                        <span>Compare & Match</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* History Ledger List */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
                            <Clock className="w-4.5 h-4.5 text-zinc-400" />
                            <h3 className="font-bold text-sm">Previous Matches</h3>
                        </div>

                        {history.length > 0 ? (
                            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                                {history.map((hItem) => {
                                    const isActive = activeReport?._id === hItem._id;
                                    const dateStr = new Date(hItem.createdAt).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit'
                                    });
                                    return (
                                        <button
                                            key={hItem._id}
                                            onClick={() => setActiveReport(hItem)}
                                            className={`w-full text-left p-3 rounded-lg border text-xs flex justify-between items-center transition-all cursor-pointer ${isActive
                                                    ? 'border-blue-550 bg-blue-50/30 dark:border-blue-500 dark:bg-blue-950/10 font-semibold text-blue-650 dark:text-blue-400'
                                                    : 'border-zinc-150 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 text-zinc-700 dark:text-zinc-300'
                                                }`}
                                        >
                                            <div className="truncate mr-4">
                                                <p className="truncate text-xs font-bold leading-tight">
                                                    {hItem.jobDescription.substring(0, 45)}...
                                                </p>
                                                <p className="text-[10px] text-zinc-400 mt-1 font-medium">{dateStr}</p>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0 font-bold">
                                                <span>{hItem.overallMatchPercentage}%</span>
                                                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-zinc-500 dark:text-zinc-405 text-xs text-center py-4 bg-zinc-50 dark:bg-zinc-950/40 rounded-lg">
                                No match history found yet.
                            </p>
                        )}
                    </div>

                </div>

                {/* Right Columns: Analysis Dashboard Score Report Cards */}
                <div className="xl:col-span-2 space-y-6">

                    {activeReport ? (
                        <div className="space-y-6">

                            {/* Gauges Grid block */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-6">
                                <div>
                                    <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
                                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                                        Match Compatibility Results
                                    </h3>
                                    <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">
                                        Below is the AI alignment score mapping across key requirements filters.
                                    </p>
                                </div>

                                {/* Animated SVG Gauges */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                                    {[
                                        { label: 'Overall Match', score: activeReport.overallMatchPercentage, stroke: 'stroke-blue-600 dark:stroke-blue-500' },
                                        { label: 'Skills Alignment', score: activeReport.skillsMatch, stroke: 'stroke-emerald-600 dark:stroke-emerald-500' },
                                        { label: 'Experience Alignment', score: activeReport.experienceMatch, stroke: 'stroke-indigo-600 dark:stroke-indigo-500' },
                                        { label: 'Education Alignment', score: activeReport.educationMatch, stroke: 'stroke-purple-600 dark:stroke-purple-500' }
                                    ].map((gauge, idx) => {
                                        const radius = 34;
                                        const strokeWidth = 6.5;
                                        const circumference = 2 * Math.PI * radius;
                                        const strokeOffset = circumference - (gauge.score / 100) * circumference;

                                        return (
                                            <div key={idx} className="space-y-3 bg-zinc-50/50 dark:bg-zinc-850/10 p-4 rounded-xl border border-zinc-150 dark:border-zinc-800/40">
                                                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                                                        <circle
                                                            cx="40" cy="40" r={radius}
                                                            className="stroke-zinc-100 dark:stroke-zinc-850"
                                                            strokeWidth={strokeWidth}
                                                            fill="none"
                                                        />
                                                        <circle
                                                            cx="40" cy="40" r={radius}
                                                            className={`${gauge.stroke} transition-all duration-1000 ease-out`}
                                                            strokeWidth={strokeWidth}
                                                            fill="none"
                                                            strokeDasharray={circumference}
                                                            strokeDashoffset={strokeOffset}
                                                            strokeLinecap="round"
                                                        />
                                                    </svg>
                                                    <span className="absolute text-zinc-900 dark:text-zinc-100 font-extrabold text-lg">
                                                        {gauge.score}%
                                                    </span>
                                                </div>
                                                <p className="text-[11px] font-bold text-zinc-600 dark:text-zinc-350">{gauge.label}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Missing Skills in Colored badges & Target Technologies wrapper */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Missing Skills */}
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
                                    <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                                        Missing Skills
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {activeReport.missingSkills && activeReport.missingSkills.length > 0 ? (
                                            activeReport.missingSkills.map((sk, sidx) => (
                                                <span
                                                    key={sidx}
                                                    className="px-2.5 py-1 text-[10px] font-semibold bg-red-50 text-red-750 dark:bg-red-955/20 dark:text-red-400 border border-red-200/50 dark:border-red-900/30 rounded-md"
                                                >
                                                    {sk}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-zinc-450 dark:text-zinc-400 text-xs flex gap-1.5 items-center">
                                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                No critical missing skills!
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Missing Technologies */}
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
                                    <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                                        Missing Technologies
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {activeReport.missingTechnologies && activeReport.missingTechnologies.length > 0 ? (
                                            activeReport.missingTechnologies.map((tech, tidx) => (
                                                <span
                                                    key={tidx}
                                                    className="px-2.5 py-1 text-[10px] font-semibold bg-amber-55/70 text-amber-800 dark:bg-amber-970/20 dark:text-amber-400 border border-amber-250/50 dark:border-amber-900/30 rounded-md"
                                                >
                                                    {tech}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-zinc-450 dark:text-zinc-400 text-xs flex gap-1.5 items-center">
                                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                No missing technologies found.
                                            </p>
                                        )}
                                    </div>
                                </div>

                            </div>

                            {/* AI Recommendations & suggestions */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
                                <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                                    <Sparkles className="w-4 h-4 text-indigo-500" />
                                    AI Improvement Recommendations
                                </h4>
                                <ul className="space-y-3">
                                    {activeReport.aiSuggestions && activeReport.aiSuggestions.length > 0 ? (
                                        activeReport.aiSuggestions.map((sgg, idx) => (
                                            <li key={idx} className="flex gap-2.5 items-start text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed bg-zinc-55/40 dark:bg-zinc-850/30 p-3 rounded-lg border border-zinc-150 dark:border-zinc-800/40">
                                                <span className="text-blue-600 dark:text-blue-400 font-extrabold">💡</span>
                                                <span>{sgg}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-xs text-zinc-500">No suggestions available.</li>
                                    )}
                                </ul>
                            </div>

                        </div>
                    ) : (
                        <div className="h-[450px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl flex flex-col items-center justify-center text-center p-6 space-y-4">
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-850 rounded-full border border-zinc-150 dark:border-zinc-800">
                                <Search className="w-10 h-10 text-zinc-400" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">Awaiting JD Match Analysis</h3>
                                <p className="text-zinc-500 dark:text-zinc-400 text-xs max-w-sm">
                                    Paste the requirements specification list into target fields on the left and compare to check layout scoring compatibility.
                                </p>
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}
