"use client";
import React from 'react';
import Header from '../dashboard/_components/Header';

function HowItWorks() {
    return (
        <div className='min-h-screen bg-white'>
            <Header />
            <div className='max-w-4xl mx-auto px-6 py-12'>
                <h1 className='text-3xl font-bold text-center mb-10 text-gray-800'>How it Works?</h1>

                <div className='grid gap-8'>
                    <div className='bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm'>
                        <h2 className='text-xl font-semibold mb-4 text-blue-600'>1. Interview Q & A Process</h2>
                        <ul className='list-disc pl-5 space-y-3 text-gray-700'>
                            <li>
                                <strong>Start Interview:</strong> Choose your job role and experience level to generate custom interview questions powered by AI.
                            </li>
                            <li>
                                <strong>Answer Questions:</strong> You will be presented with a set of 5 questions. Read the question and click on "Record Answer" to start recording your response via microphone.
                            </li>
                            <li>
                                <strong>Save Response:</strong> Once recorded, the system converts your speech to text. You can review your transcribed answer and click "Save User Answer" to submit it.
                            </li>
                            <li>
                                <strong>Next Question:</strong> Proceed to the next question and repeat the process until all questions are answered.
                            </li>
                        </ul>
                    </div>

                    <div className='bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm'>
                        <h2 className='text-xl font-semibold mb-4 text-purple-600'>2. Feedback Generation</h2>
                        <p className='text-gray-700 leading-relaxed'>
                            After you complete the interview, click on "End Interview". The AI analyzes your responses based on the job requirements.
                            You will receive a detailed feedback report including:
                        </p>
                        <ul className='list-disc pl-5 mt-3 space-y-2 text-gray-700'>
                            <li><strong>Rating:</strong> An overall score for your performance.</li>
                            <li><strong>Feedback:</strong> Specific constructive feedback on your answers.</li>
                            <li><strong>Correct Answer:</strong> A suggested ideal response for each question to help you improve.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HowItWorks;
