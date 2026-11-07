"use client";
import React from 'react';
import AddNewInterview from './_components/AddNewInterview';
import InterviewList from './_components/InterviewList';

export default function Dashboard() {
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="font-extrabold text-3xl md:text-4xl text-primary bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
          Dashboard
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg">
          Create and Start your AI Mockup Interview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AddNewInterview />
      </div>

      <div className="mt-10">
        <InterviewList />
      </div>
    </div>
  );
}
