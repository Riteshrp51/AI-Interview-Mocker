"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useAuth } from '@/context/AuthContext';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronsUpDown, LoaderCircle, ArrowUpRight, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MockInterviewsPage() {
  const { user } = useAuth();
  const [questionsList, setQuestionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('All');

  useEffect(() => {
    if (user?.email) {
      GetAllQuestions();
    } else {
      setLoading(false);
    }
  }, [user?.email]);

  const GetAllQuestions = async () => {
    setLoading(true);
    try {
      // 1. Get all interviews for the user ordered by creation date
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, user?.email ?? ''))
        .orderBy(desc(MockInterview.createdAt));

      // 2. Flatten all questions from all interviews
      const allQuestions = result.flatMap((interview) => {
        let questions = interview.jsonMockResp;
        if (typeof questions === 'string') {
          try {
            questions = JSON.parse(questions);
          } catch (e) {
            questions = [];
          }
        }

        if (!Array.isArray(questions)) return [];

        return questions.map((q, idx) => ({
          id: `${interview.mockId}-${idx}`,
          question: q.question,
          answer: q.answer || q.correctAns || 'No answer available',
          interviewId: interview.mockId,
          jobPosition: interview.jobPosition || 'General',
          jobExperience: interview.jobExperience,
          createdAt: interview.createdAt,
        }));
      });

      setQuestionsList(allQuestions);
    } catch (err) {
      console.error("Failed to load interview questions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Group roles for filter tabs
  const roleCounts = questionsList.reduce((acc, q) => {
    const role = q.jobPosition;
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  const availableRoles = ['All', ...Object.keys(roleCounts)];

  const displayedQuestions = selectedRole === 'All'
    ? questionsList
    : questionsList.filter((q) => q.jobPosition === selectedRole);

  return (
    <div className="space-y-8 pb-12">
      {/* Title & Description */}
      <div>
        <h2 className="font-extrabold text-3xl md:text-4xl text-primary bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
          Mock Interview Questions
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg">
          Here are all the questions generated for your interviews, organized by role.
        </p>
      </div>

      {loading ? (
        <div className="flex h-[50vh] w-full items-center justify-center">
          <LoaderCircle className="animate-spin h-10 w-10 text-blue-600 dark:text-blue-500" />
        </div>
      ) : questionsList.length === 0 ? (
        <div className="p-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-center bg-white dark:bg-zinc-900/40">
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            No interview questions generated yet
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-6">
            Create a mock interview on the dashboard to generate AI-tailored role-wise questions and model answers.
          </p>
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Role Filter Tabs */}
          {availableRoles.length > 2 && (
            <div className="flex flex-wrap gap-2 items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mr-2">
                Filter by Role:
              </span>
              {availableRoles.map((role) => {
                const count = role === 'All' ? questionsList.length : roleCounts[role];
                const isSelected = selectedRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-750'
                    }`}
                  >
                    <span>{role}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-blue-700 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Questions Grid / List */}
          <div className="grid grid-cols-1 gap-5">
            {displayedQuestions.map((q, index) => (
              <div
                key={q.id || index}
                className="p-5 sm:p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm bg-white dark:bg-zinc-900 transition-all hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 leading-snug">
                      {q.question}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2.5 py-0.5 rounded-md font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40">
                        Role: {q.jobPosition}
                      </span>
                      {q.jobExperience && (
                        <span className="px-2 py-0.5 rounded-md font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                          {q.jobExperience} Years Exp
                        </span>
                      )}
                      <span className="text-zinc-400 dark:text-zinc-500">
                        • Created: {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <Link href={`/dashboard/interview/${q.interviewId}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0 text-xs border-zinc-250 dark:border-zinc-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-blue-600 dark:text-blue-400 gap-1 cursor-pointer"
                    >
                      Practice Interview
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>

                <Collapsible className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
                  <CollapsibleTrigger className="flex gap-2 items-center text-blue-600 dark:text-blue-400 text-sm font-medium cursor-pointer hover:underline">
                    View Model Answer <ChevronsUpDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-850 p-4 rounded-lg border border-zinc-200/70 dark:border-zinc-800 text-sm leading-relaxed whitespace-pre-wrap">
                    {q.answer}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

