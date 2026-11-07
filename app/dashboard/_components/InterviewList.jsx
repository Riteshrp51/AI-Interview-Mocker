"use client";
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import InterviewCard from './InterviewCard';
import { useAuth } from '@/context/AuthContext';
import { LoaderCircle } from 'lucide-react';

function InterviewList() {
  const { user } = useAuth();
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      GetInterviewList();
    } else {
      setLoading(false);
    }
  }, [user?.email]);

  const GetInterviewList = async () => {
    setLoading(true);
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, user?.email ?? ''))
        .orderBy(desc(MockInterview.id));

      setInterviewList(result || []);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.email) {
    return (
      <div>
        <h2 className="font-bold text-2xl text-zinc-900 dark:text-zinc-100 mb-2">Previous Mock Interviews</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Please login to view your previous mock interviews.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-2xl text-zinc-900 dark:text-zinc-100">Previous Mock Interviews</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <LoaderCircle className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-500" />
        </div>
      ) : interviewList && interviewList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-3">
          {interviewList.map((interview, index) => (
            <InterviewCard interview={interview} key={interview.id || index} />
          ))}
        </div>
      ) : (
        <div className="p-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-center text-zinc-500 dark:text-zinc-400">
          <p className="text-base font-medium">No previous interviews found.</p>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">Create your first mock interview above to get started!</p>
        </div>
      )}
    </div>
  );
}

export default InterviewList;
