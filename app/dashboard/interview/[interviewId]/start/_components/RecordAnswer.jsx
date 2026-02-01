"use client";

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle, Save } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAIModel';
import { UserAnswer } from '@/utils/schema';
import moment from 'moment';
import { db } from '@/utils/db';
import { useAuth } from '@/context/AuthContext';
import { Textarea } from '@/components/ui/textarea';

function RecordAnswer({ mockInterviewQuestions, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState('');
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const {
    error,
    results,
    startSpeechToText,
    stopSpeechToText,
    isRecording,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    results.map((result) => (
      setUserAnswer(prevAns => prevAns + result?.transcript)
    ));
  }, [results])

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  }

  const UpdateUserAnswer = async () => {
    if (!user) {
      toast.error('Please login to save your answer.');
      return;
    }
    if (userAnswer?.length < 10) {
      toast.error('Answer is too short. Please record again.');
      return;
    }
    setLoading(true);
    
    const question = mockInterviewQuestions?.[activeQuestionIndex]?.question;
    // The prompt in AddNewInterview asks for 'answer', but we were looking for 'correctAns'.
    // We check both to be safe.
    const correctAns = mockInterviewQuestions?.[activeQuestionIndex]?.correctAns || 
                       mockInterviewQuestions?.[activeQuestionIndex]?.answer || 
                       "No correct answer provided";

    if (!question) {
        toast.error('Error: Question not found.');
        setLoading(false);
        return;
    }

    if (!interviewData?.mockId) {
        toast.error('Error: Interview data missing.');
        setLoading(false);
        return;
    }

    const feedbackPrompt = "Question: " + question +
      ", User Answer: " + userAnswer + ", Depends on question and user answer for give interview question " +
      " please give us rating for answer and feedback as area of improvement if any " +
      "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field. " +
      "Rating should be a number from 1 to 10.";

    try {
      const result = await chatSession.sendMessage(feedbackPrompt);
      let mockJsonResp = (result.response.text()).replace('```json', '').replace('```', '');
      
      // Additional cleanup to ensure valid JSON
      mockJsonResp = mockJsonResp.trim();
      
      // If the response starts with something other than '{', try to find the first '{'
      const firstBrace = mockJsonResp.indexOf('{');
      const lastBrace = mockJsonResp.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
          mockJsonResp = mockJsonResp.substring(firstBrace, lastBrace + 1);
      }
      
      const JsonFeedbackResp = JSON.parse(mockJsonResp);

      const resp = await db.insert(UserAnswer)
        .values({
          mockIdRef: interviewData?.mockId,
          question: question,
          correctAns: correctAns,
          userAnswer: userAnswer,
          feedback: JsonFeedbackResp?.feedback,
          rating: Number(JsonFeedbackResp?.rating), // Ensure rating is a number
          userEmail: user?.email,
          createdAt: moment().format('DD-MM-YYYY')
        })

      if (resp) {
        toast.success('User Answer recorded successfully');
        setUserAnswer('');
        setResults([]);
      }
      setResults([]);
      setLoading(false);
    } catch (error) {
      // Graceful fallback if JSON parsing fails or other errors
      console.error("Error saving answer:", error);
      toast.error("Error saving answer. Please try again.");
      setLoading(false);
    }
  }


  return (
    <div className='flex items-center justify-center flex-col'>
      <div className='flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5'>
        <Image src={'/webcam.webp'} width={200} height={200} className='absolute' />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: '100%',
            zIndex: 10,
          }}
        />
      </div>

      <div className='w-full max-w-xl mt-5'>
        <label className='text-gray-500 text-sm'>Your Answer (Recorded or Typed):</label>
        <Textarea
          className="mt-2 h-32"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type your answer here or record using the microphone..."
        />
      </div>

      <div className="flex gap-5 mt-5 mb-10">
        <Button
          disabled={loading}
          variant="outline"
          className="my-10"
          onClick={StartStopRecording}
        >
          {isRecording ?
            <h2 className='text-red-600 flex gap-2'>
              <StopCircle /> Stop Recording
            </h2>
            :
            <h2 className='text-primary flex gap-2 items-center'>
              <Mic /> Record Answer
            </h2>
          }
        </Button>

        <Button
          disabled={loading}
          className="my-10"
          onClick={UpdateUserAnswer}
        >
          {loading ? 'Saving...' : 'Save Answer'}
        </Button>
      </div>
    </div>
  )
}

export default RecordAnswer