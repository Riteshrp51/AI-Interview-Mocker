"use client";
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState, use } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../start/_components/ui/collapsible';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function Feedback({ params }) {
  const unwrappedParams = use(params);
  const [feedbackList, setFeedbackList] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const router = useRouter();

  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    const interviewId = unwrappedParams.interviewId;

    if (!interviewId) {
      console.error('Interview ID not found');
      return;
    }

    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, interviewId))
      .orderBy(UserAnswer.id);

    setFeedbackList(result);

    // Calculate average rating
    const total = result.reduce((sum, item) => sum + (Number(item.rating) || 0), 0);
    const average = result.length > 0 ? total / result.length : 0;
    setAverageRating(average.toFixed(1));
  };

  return (
    <div className='p-10'>
      
      {feedbackList?.length==0?
    <h2 className='font-bold text-xl text-gray-500'>No Interview Record Feedback Found</h2> 
    : 
    <>
    <h2 className='text-3xl font-bold text-green-500'>Congratulations</h2>
    <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>
      
      <h2 className='text-primary text-lg my-3'>
        Your overall interview rating: <strong className={averageRating < 5 ? 'text-red-500' : 'text-green-500'}>{averageRating}/10</strong>
      </h2>
      
      <h2 className='text-sm text-gray-500'>
        Find below interview question with correct answer, your answer and feedback for improvement
      </h2>

      <div className='mt-6 space-y-4'>
        {feedbackList.map((item, index) => (
          <Collapsible key={index} className='border p-4 rounded-lg shadow-sm'>
            <CollapsibleTrigger className='text-left text-md font-medium w-full flex justify-between gap-7'>
              {index + 1}. {item?.question || 'No question available'}
              <ChevronsUpDown className='h-5 w-5' />
            </CollapsibleTrigger>
            <CollapsibleContent className='mt-2 text-sm text-gray-700 space-y-2'>
              <p><strong>Rating:</strong> {item?.rating || 'No rating given'}</p>
              <p><strong>Your Answer:</strong> {item?.userAnswer || 'No answer provided'}</p>
              <p><strong>Feedback:</strong> {item?.feedback || 'No specific feedback provided.'}</p>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </>}

      <Button onClick={() => router.replace('/dashboard')} className='mt-6'>
        Go Home
      </Button>
    </div>
  );
}

export default Feedback;
