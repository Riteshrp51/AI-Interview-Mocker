"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useAuth } from '@/context/AuthContext';
import { eq, desc } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronsUpDown } from 'lucide-react';

function Questions() {
  const { user } = useAuth();
  const [questionsList, setQuestionsList] = useState([]);

  useEffect(() => {
    if (user?.email) {
      GetAllQuestions();
    }
  }, [user]);

  const GetAllQuestions = async () => {
    // 1. Get all interviews for the user
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, user?.email ?? ''))
      .orderBy(desc(MockInterview.createdAt));

    // 2. Flatten all questions from all interviews
    // result[i].jsonMockResp is the array of questions
    const allQuestions = result.flatMap((interview) => {
      // jsonMockResp is already a JSON object (array of questions) due to Drizzle schema or might need parsing if stored as string.
      // In StartInterview, we saw it's accessed directly as result[0].jsonMockResp and then setMockInterviewQuestions(jsonMockResp).
      // However, in AddNewInterview it was inserted as string: jsonMockResp: MockJSONResp (which was a string).
      // But the schema says: jsonMockResp: json("jsonMockResp").notNull()
      // So Drizzle should parse it automatically if the column type is JSON.
      // Let's assume it's an array. If it's a string, we parse it.
      
      let questions = interview.jsonMockResp;
      if (typeof questions === 'string') {
        try {
            questions = JSON.parse(questions);
        } catch (e) {
            questions = [];
        }
      }
      
      return questions.map((q) => ({
        ...q,
        interviewId: interview.mockId,
        jobPosition: interview.jobPosition,
        createdAt: interview.createdAt,
      }));
    });

    setQuestionsList(allQuestions);
  };

  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl mb-5'>My Interview Questions</h2>
      <p className='text-gray-500 mb-10'>
        Here are all the questions generated for your interviews, tailored to your job descriptions.
      </p>

      <div className='grid grid-cols-1 gap-5'>
        {questionsList.map((q, index) => (
          <div key={index} className='p-5 border rounded-lg shadow-sm bg-white'>
             <div className='flex justify-between items-start'>
                <div>
                    <h3 className='font-bold text-lg mb-2'>{q.question}</h3>
                    <p className='text-sm text-gray-500 mb-2'>
                        <strong>Role:</strong> {q.jobPosition} | <strong>Created:</strong> {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                </div>
             </div>
             
             <Collapsible className='mt-3'>
                <CollapsibleTrigger className='flex gap-2 items-center text-blue-500 text-sm cursor-pointer hover:underline'>
                    View Answer <ChevronsUpDown className='h-4 w-4'/>
                </CollapsibleTrigger>
                <CollapsibleContent className='mt-3 text-gray-700 bg-slate-50 p-3 rounded-md'>
                    {q.answer || q.correctAns || 'No answer available'}
                </CollapsibleContent>
             </Collapsible>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Questions;
