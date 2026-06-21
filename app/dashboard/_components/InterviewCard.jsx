import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

function InterviewCard({ interview }) {

    const router = useRouter();

    const onStart = () => {
        router.push("/dashboard/interview/" +interview?.mockId)
    }
    const onFeedback = () => {
        router.push("/dashboard/interview/" +interview?.mockId + "/feedback")
    }
  return (
    <div className='bg-white border border-gray-200 shadow-sm rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group'>
      <div>
        <h2 className='font-bold text-lg text-primary group-hover:text-blue-600 transition-colors'>{interview?.jobPosition}</h2>
        <div className='flex items-center gap-2 mt-1'>
          <span className='px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md'>
            {interview?.jobExperience} Years Exp
          </span>
        </div>
        <h2 className='text-xs text-gray-400 mt-3'>
          Created at: {interview?.createdAt ? new Date(interview.createdAt).toLocaleDateString() : 'Unknown'}
        </h2>
      </div>
      <div className='flex mt-5 gap-4'>
        <Button size="sm" variant="outline" className="flex-1 bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-700" onClick={onFeedback}>Feedback</Button>
        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all" onClick={onStart}>Start</Button>
      </div>
    </div>
  )
}

export default InterviewCard