"use client"
import { MockInterview } from '@/utils/schema';
import { db } from '@/utils/db';
import React, { useEffect, useState, use } from 'react';
import { eq } from 'drizzle-orm';
import Webcam from 'react-webcam';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function Interview({ params }) {
  const unwrappedParams = use(params);
  const [interviewData, setInterviewData] = useState({
    jobPosition: '',
    jobDesc: '',
    jobExperience: ''
  });
  const [webcamEnable, setWebcamEnable] = useState(false);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, unwrappedParams.interviewId));
      
    setInterviewData(result[0]);
  };

  return (
    <div className="my-10">
      <h2 className="font-bold text-2xl mb-6">Let's Get Started</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Info on the Left */}
        <div className="flex flex-col gap-5 text-left">
          <div className='flex flex-col p-5 rounded-lg border gap-5'>
          <h2 className="text-lg">
            <strong>Job Role/Position:</strong> {interviewData.jobPosition}
          </h2>
          <h2 className="text-lg">
            <strong>Job Description/Tech Stack:</strong> {interviewData.jobDesc}
          </h2>
          <h2 className="text-lg">
            <strong>Years of Experience:</strong> {interviewData.jobExperience}
          </h2>
          </div>
          <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-light'>
                <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb /><strong>Information</strong></h2>
                <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
          </div>
        </div>

        {/* Camera on the Right */}
        <div className="flex flex-col justify-center items-center">
          {webcamEnable ? (
            <Webcam
              onUserMedia={() => setWebcamEnable(true)}
              onUserMediaError={() => setWebcamEnable(false)}
              mirrored={true}
              style={{
                height: 300,
                width: 300,
              }}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-72 my-7 p-10 bg-secondary rounded-lg border" />
              <Button variant="ghost" className="w-full" onClick={() => setWebcamEnable(true)}>
                Enable Web Camera and Microphone
              </Button>
            </>
          )}
        </div>
      </div>

        <div className='flex justify-end items-end'>
          <Link href={'/dashboard/interview/' + unwrappedParams.interviewId + '/start'}>
      <Button >Start Interview</Button>
      </Link>
      </div>
    </div>
  );
}

export default Interview;
