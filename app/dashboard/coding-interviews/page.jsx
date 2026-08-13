"use client";
import React, { useState } from 'react';
import { 
    Code2, 
    ArrowLeft, 
    Play, 
    Sparkles, 
    Bug, 
    Clock, 
    Activity, 
    ChevronRight, 
    Terminal, 
    CheckCircle, 
    AlertTriangle,
    RotateCcw
} from 'lucide-react';
import Link from 'next/link';
import { chatSession } from "@/utils/GeminiAIModel";

// Predefined challenges
const challenges = [
    {
        id: 'two-sum',
        title: '1. Two Sum',
        difficulty: 'Easy',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
        starterCode: {
            javascript: `function twoSum(nums, target) {\n    // Write your code here\n    \n}`,
            python: `def twoSum(nums: List[int], target: int) -> List[int]:\n    # Write your code here\n    pass`,
            cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n        \n    }\n};`,
            java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[0];\n    }\n}`
        }
    },
    {
        id: 'valid-parentheses',
        title: '20. Valid Parentheses',
        difficulty: 'Easy',
        description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets, and open brackets are closed in the correct order.',
        starterCode: {
            javascript: `function isValid(s) {\n    // Write your code here\n    \n}`,
            python: `def isValid(s: str) -> bool:\n    # Write your code here\n    pass`,
            cpp: `class Solution {\npublic:\n    bool isValid(string s) {\n        // Write your code here\n        \n    }\n};`,
            java: `class Solution {\n    public boolean isValid(String s) {\n        // Write your code here\n        return false;\n    }\n}`
        }
    },
    {
        id: 'reverse-linked-list',
        title: '206. Reverse Linked List',
        difficulty: 'Easy',
        description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
        starterCode: {
            javascript: `function reverseList(head) {\n    // Write your code here\n    \n}`,
            python: `def reverseList(head: Optional[ListNode]) -> Optional[ListNode]:\n    # Write your code here\n    pass`,
            cpp: `class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Write your code here\n        \n    }\n};`,
            java: `class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Write your code here\n        return null;\n    }\n}`
        }
    },
    {
        id: 'fibonacci-number',
        title: '509. Fibonacci Number',
        difficulty: 'Easy',
        description: 'The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n).',
        starterCode: {
            javascript: `function fib(n) {\n    // Write your code here\n    \n}`,
            python: `def fib(n: int) -> int:\n    # Write your code here\n    pass`,
            cpp: `class Solution {\npublic:\n    int fib(int n) {\n        // Write your code here\n        \n    }\n};`,
            java: `class Solution {\n    public int fib(int n) {\n        // Write your code here\n        return 0;\n    }\n}`
        }
    }
];

const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'cpp', name: 'C++' },
    { id: 'java', name: 'Java' }
];

export default function CodingInterviews() {
    const [selectedChallenge, setSelectedChallenge] = useState(challenges[0]);
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0].id);
    const [code, setCode] = useState(challenges[0].starterCode[languages[0].id]);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [activeTab, setActiveTab] = useState('review'); // 'review', 'code', 'complexity'

    const handleChallengeChange = (challenge) => {
        setSelectedChallenge(challenge);
        setCode(challenge.starterCode[selectedLanguage]);
        setFeedback(null);
    };

    const handleLanguageChange = (langId) => {
        setSelectedLanguage(langId);
        setCode(selectedChallenge.starterCode[langId]);
        setFeedback(null);
    };

    const resetStarterCode = () => {
        setCode(selectedChallenge.starterCode[selectedLanguage]);
    };

    const handleAIReview = async () => {
        if (!code.trim()) {
            alert("Code workspace is empty!");
            return;
        }

        setReviewLoading(true);
        try {
            const prompt = `
            You are an expert technical interviewer and senior software engineer. Review the candidate's code solution for the coding challenge.
            Challenge details:
            - Name: ${selectedChallenge.title}
            - Description: ${selectedChallenge.description}
            - Language: ${selectedLanguage}
            - Code: ${code}

            Output your review in JSON format matching this schema exactly (do not output markdown JSON ticks or codeblocks outside the JSON brackets, just output the JSON raw structure):
            {
              "isCorrect": true,
              "timeComplexity": "O(N)",
              "spaceComplexity": "O(1) / O(N)",
              "runtimeExplanation": "Explanation of runtime and space requirements...",
              "bugsDetected": ["Bug details if any"],
              "syntaxSuggestions": ["Syntax/grammar optimizations if any"],
              "optimizedCode": "Write complete clean optimized code solution snippet...",
              "explanation": "Provide detailed summary of strengths and recommendations to improve..."
            }
            `;

            const result = await chatSession.sendMessage(prompt);
            let rawText = (await result.response.text()).trim();

            // Cleanup code fences
            rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

            const firstBrace = rawText.indexOf('{');
            const lastBrace = rawText.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                rawText = rawText.substring(firstBrace, lastBrace + 1);
            }

            const parsedData = JSON.parse(rawText);
            setFeedback(parsedData);
            setActiveTab('review');
        } catch (error) {
            console.error("Failed to fetch code review feedback:", error);
            alert("Encountered an error analyzing code. Please try again.");
        } finally {
            setReviewLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                        <Code2 className="w-8 h-8 text-blue-600 dark:text-blue-500" />
                        Coding Interview Playground
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                        Select a challenge, write your code, and receive real-time AI code reviews and runtime calculations.
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

            {/* Split Screen Container */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                
                {/* Left Side: Problem & Editor */}
                <div className="space-y-4 flex flex-col">
                    
                    {/* Selectors Panel */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Challenge:</label>
                            <select 
                                value={selectedChallenge.id}
                                onChange={(e) => handleChallengeChange(challenges.find(c => c.id === e.target.value))}
                                className="text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-850 dark:text-zinc-100 font-semibold focus:outline-none"
                            >
                                {challenges.map(c => (
                                    <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Language:</label>
                            <select 
                                value={selectedLanguage}
                                onChange={(e) => handleLanguageChange(e.target.value)}
                                className="text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-850 dark:text-zinc-100 font-semibold focus:outline-none"
                            >
                                {languages.map(l => (
                                    <option key={l.id} value={l.id}>{l.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Problem Description */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-extrabold text-base text-zinc-950 dark:text-zinc-50">{selectedChallenge.title}</h3>
                            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450 border border-emerald-250/20 rounded-full">
                                {selectedChallenge.difficulty}
                            </span>
                        </div>
                        <p className="text-zinc-650 dark:text-zinc-350 text-xs leading-relaxed">
                            {selectedChallenge.description}
                        </p>
                    </div>

                    {/* Code Editor */}
                    <div className="bg-zinc-950 dark:bg-black rounded-xl border border-zinc-800 shadow-lg overflow-hidden flex flex-col flex-1 min-h-[420px]">
                        <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-zinc-500" />
                                <span className="text-[10px] uppercase tracking-widest text-zinc-450 font-bold font-mono">Workspace.src</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={resetStarterCode}
                                    className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                                    title="Reset Code Template"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />
                            </div>
                        </div>
                        
                        {/* Editor Input Area */}
                        <div className="flex flex-1 relative font-mono text-xs">
                            {/* Lines index simulation */}
                            <div className="bg-zinc-900/40 text-zinc-600 w-10 text-right select-none pr-3 pt-4 border-r border-zinc-900/60 font-mono text-[11px] leading-relaxed">
                                {Array.from({ length: Math.max(code.split('\n').length, 12) }).map((_, idx) => (
                                    <div key={idx}>{idx + 1}</div>
                                ))}
                            </div>
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="flex-1 w-full bg-transparent text-zinc-100 p-4 font-mono focus:outline-none border-none resize-none leading-relaxed text-[11px]"
                                placeholder="// Start typing your solution code here..."
                                spellCheck={false}
                            />
                        </div>

                        {/* Run actions footer */}
                        <div className="bg-zinc-900 border-t border-zinc-800 p-3 flex justify-end">
                            <button
                                onClick={handleAIReview}
                                disabled={reviewLoading}
                                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-850 disabled:text-zinc-500 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow cursor-pointer transition-all"
                            >
                                {reviewLoading ? (
                                    <>
                                        <Activity className="animate-spin w-4 h-4" />
                                        <span>AI Reviewing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        <span>Review with AI</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                </div>

                {/* Right Side: AI Feedback Panels */}
                <div className="space-y-4">
                    {feedback ? (
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
                            
                            {/* Feedback Header Tabs */}
                            <div className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-150 dark:border-zinc-850 flex p-1.5 gap-1">
                                {[
                                    { id: 'review', label: 'Review & Feedback', icon: Sparkles },
                                    { id: 'code', label: 'Optimized Code', icon: Code2 },
                                    { id: 'complexity', label: 'Performance Analysis', icon: Clock }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                            activeTab === tab.id
                                                ? 'bg-white dark:bg-zinc-900 border border-zinc-250/20 dark:border-zinc-800 text-blue-600 dark:text-blue-500 shadow-sm'
                                                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50'
                                        }`}
                                    >
                                        <tab.icon className="w-3.5 h-3.5" />
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Tab Contents */}
                            <div className="p-5 flex-1 space-y-5 max-h-[500px] overflow-y-auto">
                                
                                {activeTab === 'review' && (
                                    <div className="space-y-5">
                                        
                                        {/* Status Alert */}
                                        {feedback.isCorrect ? (
                                            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400 rounded-lg flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" />
                                                <div>
                                                    <h4 className="font-extrabold text-xs">Solution Logic Correct</h4>
                                                    <p className="text-[10px] mt-0.5 leading-normal opacity-90">Your code covers core problem cases and logic correctly!</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-rose-50 dark:bg-rose-955/20 border border-rose-200/50 dark:border-rose-900/30 text-rose-800 dark:text-rose-400 rounded-lg flex items-start gap-3">
                                                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
                                                <div>
                                                    <h4 className="font-extrabold text-xs">Solution Needs Improvement</h4>
                                                    <p className="text-[10px] mt-0.5 leading-normal opacity-90">AI detected missing cases, bug failures, or suboptimal logic.</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Review text block */}
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">AI Evaluation</h4>
                                            <p className="text-zinc-700 dark:text-zinc-300 text-xs leading-relaxed bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-150 dark:border-zinc-850">
                                                {feedback.explanation}
                                            </p>
                                        </div>

                                        {/* Bugs Section */}
                                        {feedback.bugsDetected && feedback.bugsDetected.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                                                    <Bug className="w-4 h-4 text-red-500" />
                                                    Bugs & Critical Issues
                                                </h4>
                                                <div className="space-y-2">
                                                    {feedback.bugsDetected.map((bug, bidx) => (
                                                        <div key={bidx} className="flex gap-2 text-xs text-red-800 dark:text-red-400 bg-red-50/30 dark:bg-red-955/15 p-3 rounded-lg border border-red-200/20 dark:border-red-900/20">
                                                            <span>•</span>
                                                            <span className="leading-relaxed">{bug}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Syntax Section */}
                                        {feedback.syntaxSuggestions && feedback.syntaxSuggestions.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                                                    <ChevronRight className="w-4 h-4 text-blue-500" />
                                                    Syntax & Readability Tips
                                                </h4>
                                                <div className="space-y-2">
                                                    {feedback.syntaxSuggestions.map((tip, tidx) => (
                                                        <div key={tidx} className="flex gap-2 text-xs text-blue-800 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200/20 dark:border-blue-900/20">
                                                            <span>💡</span>
                                                            <span className="leading-relaxed">{tip}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                )}

                                {activeTab === 'code' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">AI Optimized Code</h4>
                                        </div>
                                        <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-xl border border-zinc-800 font-mono text-[11px] overflow-x-auto leading-relaxed">
                                            <code>{feedback.optimizedCode}</code>
                                        </pre>
                                    </div>
                                )}

                                {activeTab === 'complexity' && (
                                    <div className="space-y-5">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-zinc-50 dark:bg-zinc-950/50 p-4 border border-zinc-150 dark:border-zinc-850 rounded-xl space-y-1">
                                                <p className="text-[10px] text-zinc-450 font-bold uppercase tracking-wider">Time Complexity</p>
                                                <p className="text-2xl font-extrabold text-blue-650 dark:text-blue-400 font-mono leading-none">{feedback.timeComplexity}</p>
                                            </div>
                                            <div className="bg-zinc-50 dark:bg-zinc-950/50 p-4 border border-zinc-150 dark:border-zinc-850 rounded-xl space-y-1">
                                                <p className="text-[10px] text-zinc-450 font-bold uppercase tracking-wider">Space Complexity</p>
                                                <p className="text-2xl font-extrabold text-indigo-650 dark:text-indigo-400 font-mono leading-none">{feedback.spaceComplexity}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Complexity Explanation</h4>
                                            <p className="text-zinc-650 dark:text-zinc-350 text-xs leading-relaxed bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-150 dark:border-zinc-850">
                                                {feedback.runtimeExplanation}
                                            </p>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    ) : (
                        <div className="h-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl flex flex-col items-center justify-center text-center p-6 min-h-[400px] space-y-4">
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-850 rounded-full border border-zinc-150 dark:border-zinc-850">
                                <Code2 className="w-10 h-10 text-zinc-400 animate-pulse" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">Awaiting Code Submission</h3>
                                <p className="text-zinc-500 dark:text-zinc-400 text-xs max-w-sm">
                                    Type your solution in the code workspace and click **Review with AI** to view detailed runtime complexities, bug logs, and optimized outputs.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
