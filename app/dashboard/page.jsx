import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'

function Dashboard({children}) {
  return (
    <div className="p-5 md:p-10">
        <h2 className='font-extrabold text-3xl md:text-4xl text-primary bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2'>Dashboard</h2>
        <h2 className='text-gray-500 text-lg mb-8'>Create and Start your AI Mockup Interview</h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 my-5'>
          <AddNewInterview /> 
        </div>
    
        <div className="mt-12">
          <InterviewList />
        </div>

      {children}
    </div>
  )
}

export default Dashboard
