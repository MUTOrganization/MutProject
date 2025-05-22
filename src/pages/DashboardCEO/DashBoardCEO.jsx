import React, { useState } from 'react'
import Controller from './Controller'
import AllSummary from './Components/AllSummary'
import { useAppContext } from '@/contexts/AppContext'
import { endOfMonth, startOfMonth, today } from '@internationalized/date';
function DashboardCEO() {

    const { currentUser } = useAppContext();

    // Date Data
    const startDate = startOfMonth(today())
    const endDate = endOfMonth(today())
    const [date, setDate] = useState({
        startDate: startDate,
        endDate: endDate
    })

    const [agentList, setAgentList] = useState(null)
    const [selectAgent, setSelectAgent] = useState(null)

    return (
        <div className='body-contain w-full'>
            <div className='controller mb-4'>
                <Controller agentList={agentList} setAgentList={setAgentList} selectAgent={selectAgent} setSelectAgent={setSelectAgent} currentUser={currentUser} />
            </div>
            <div className=''>
                <AllSummary currentUser={currentUser} date={date} />
            </div>
        </div>
    )
}

export default DashboardCEO
