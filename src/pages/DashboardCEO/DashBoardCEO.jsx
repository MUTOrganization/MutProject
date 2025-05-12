import React from 'react'
import Controller from './Controller'
import AllSummary from './Components/AllSummary'
function DashboardCEO() {
    return (
        <div className='body-contain w-full'>
            <div className='controller mb-4'>
                <Controller />
            </div>
            <div className=''>
                <AllSummary />
            </div>
        </div>
    )
}

export default DashboardCEO
