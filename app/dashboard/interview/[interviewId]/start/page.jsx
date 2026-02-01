"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useState, useEffect, use } from "react";
import QuestionSection from "./_components/QuestionSection";
import RecordAnswer from "./_components/RecordAnswer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function StartInterview({ params }) {
  const unwrappedParams = use(params);
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    if (unwrappedParams?.interviewId) {
      GetInterviewDetails();
    }
  }, [unwrappedParams]);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, unwrappedParams.interviewId));

    const jsonMockResp = result[0].jsonMockResp;
    console.log(jsonMockResp);
    setMockInterviewQuestions(jsonMockResp);
    setInterviewData(result[0]);
  };

  const handleQuestionClick = (index) => {
    setActiveQuestionIndex(index);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <QuestionSection 
          mockInterviewQuestions={mockInterviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
          onQuestionClick={handleQuestionClick}
        />

        <RecordAnswer 
          mockInterviewQuestions={mockInterviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>

      <div className="flex justify-end gap-6 mt-4">
        {activeQuestionIndex > 0 && (
          <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>
            Previous Question
          </Button>
        )}

        {activeQuestionIndex !== mockInterviewQuestions?.length - 1 && (
          <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>
            Next Question
          </Button>
        )}

        {activeQuestionIndex === mockInterviewQuestions?.length - 1 && interviewData?.mockId && (
          <Link href={`/dashboard/interview/${interviewData.mockId}/feedback`}>
            <Button>End Interview</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default StartInterview;
