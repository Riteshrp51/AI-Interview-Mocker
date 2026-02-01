import { Lightbulb, Volume2 } from 'lucide-react'
import React from 'react'

function QuestionSection({ mockInterviewQuestions, activeQuestionIndex, onQuestionClick }) {

  const textToSpeech = (text) => {
    if('speechSynthesis' in window)  {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    }
    else {
      alert('Sorry, your browser does not support text-to-speech functionality.');
    }
  }

  return mockInterviewQuestions && (
    <div className='p-5 border rounded-lg'>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-5 lg:grid-cols-4'>
        {mockInterviewQuestions.map((question, index) => (
          <h2
            key={index}
            onClick={() => onQuestionClick(index)} // Added click handler
            className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer ${
              activeQuestionIndex === index
                ? 'bg-primary text-white'
                : 'bg-secondary text-black'
            }`}
          >
            Question #{index + 1}
          </h2>
        ))}
      </div>

      <h2 className="my-5 text-md md:text-lg">
        {mockInterviewQuestions[activeQuestionIndex]?.question}
      </h2>

      <Volume2 
        className='cursor-pointer' 
        onClick={() => textToSpeech(mockInterviewQuestions[activeQuestionIndex]?.question)} 
      />

      <div className='border rounded-lg p-5 bg-blue-100 mt-20'>
        <h2 className='flex gap-2 items-center text-blue-700'>
            <Lightbulb />
            <strong>Note:</strong>
        </h2>
        <h2 className='text-sm text-blue-600 my-3'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
      </div>
    </div>
  )
}

export default QuestionSection;