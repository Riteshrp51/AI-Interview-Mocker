"use client";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';

function InterviewCard({ interview }) {
  const router = useRouter();

  const onStart = () => {
    router.push("/dashboard/interview/" + interview?.mockId);
  };
  const onFeedback = () => {
    router.push("/dashboard/interview/" + interview?.mockId + "/feedback");
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl p-5 hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 flex flex-col justify-between group">
      <div>
        <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {interview?.jobPosition}
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-md border border-blue-100 dark:border-blue-900/40">
            {interview?.jobExperience} Years Exp
          </span>
        </div>
        <h2 className="text-xs text-zinc-400 dark:text-zinc-500 mt-3">
          Created at: {interview?.createdAt ? new Date(interview.createdAt).toLocaleDateString() : 'Unknown'}
        </h2>
      </div>
      <div className="flex mt-5 gap-3">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 cursor-pointer"
          onClick={onFeedback}
        >
          Feedback
        </Button>
        <Button
          size="sm"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all cursor-pointer"
          onClick={onStart}
        >
          Start
        </Button>
      </div>
    </div>
  );
}

export default InterviewCard;
