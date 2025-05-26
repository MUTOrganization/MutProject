import AgentSelector from '@/component/AgentSelector'
import DateSelector from '@/component/DateSelector'
import agentService from '@/services/agentService'
import { formatDateObject } from '@/utils/dateUtils'
import React, { useEffect, useState } from 'react'

function Controller({ setAgentList, currentUser, date, setDate, dateMode, setDateMode }) {

    const fetchAgent = async () => {
        try {
            const res = await agentService.getAgent()
            setAgentList(res)
        } catch (err) {
            console.log('Cannot Get Agent', err)
        }
    }

    useEffect(() => {
        fetchAgent()
    }, [])

    return (
        <div className='w-full bg-white rounded-md p-4 flex flex-row justify-start items-center space-x-4'>
            <div className={`${dateMode === 'ปี' ? 'w-2/12' : ''}`}>
                <DateSelector
                    value={{ start: date.start, end: date.end }}
                    onChange={(value) => setDate({ start: value.start, end: value.end })}
                    modeState={dateMode}
                    onModeChange={setDateMode}
                    isShowDateRange={false}
                    isShowDay={false}
                />
            </div>
            <div className=''>
                {currentUser.baseRole === 'SUPER_ADMIN' && (
                    <AgentSelector />
                )}
            </div>
        </div>
    )
}

export default Controller
