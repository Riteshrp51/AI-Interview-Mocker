'use client';

import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import InterviewCard from './InterviewCard';
import { useAuth } from '@/context/AuthContext';

function InterviewList() {
  const { user } = useAuth();
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    if (user?.email) {
      GetInterviewList();
    }
  }, [user?.email]);

  const GetInterviewList = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, user?.email ?? ''))
      .orderBy(desc(MockInterview.id));

    setInterviewList(result);
  };

  if (!user?.email) {
    return (
      <div>
        <h2 className="font-medium text-xl mb-2">Previous Mock Interviews</h2>
        <p className="text-sm text-gray-500">Please login to view your previous mock interviews.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-medium text-xl">Previous Mock Interviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
        {interviewList &&
          interviewList.map((interview, index) => (
            <InterviewCard interview={interview} key={index} />
          ))}
      </div>
    </div>
  );
}

export default InterviewList;
