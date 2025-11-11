import React from 'react'

interface CallStatusProps {
  callStatus: string
  callType: string
}

const CallStatus: React.FC<CallStatusProps> = ({ callStatus, callType }) => {
  if (!callStatus) return null

  return (
    <div className='mb-4 text-center'>
      <p className='text-sm font-medium '>
        Status: <span className='text-blue-600'>{callStatus}</span>
      </p>
      {callType && <p className='text-sm '>{callType}</p>}
    </div>
  )
}

export default CallStatus
