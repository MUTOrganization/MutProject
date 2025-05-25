import React from 'react'
import ProfitChart from './ProfitChart'

function ChartBody() {
    return (
        <div className='w-full mt-4 grid grid-cols-2 gap-4'>
            <div className='w-full p-4 rounded-lg shadow-sm bg-white'>
                <ProfitChart />
            </div>
            <div className='w-full p-4 rounded-lg shadow-sm bg-white'>
                2
            </div>
            <div className='w-full p-4 rounded-lg shadow-sm bg-white'>

            </div>
            <div className='w-full p-4 rounded-lg shadow-sm bg-white'>

            </div>
        </div>
    )
}

export default ChartBody
