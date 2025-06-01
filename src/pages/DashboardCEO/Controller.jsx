import AgentSelector from '@/component/AgentSelector'
import DateSelector from '@/component/DateSelector'
import agentService from '@/services/agentService'
import { formatDateObject } from '@/utils/dateUtils'
import { Autocomplete } from '@heroui/react'
import { Select, SelectItem } from '@nextui-org/select'
import React, { useEffect, useState } from 'react'

function Controller({ agentList, setAgentList, currentUser, date, setDate, dateMode, setDateMode, selectAgent, setSelectAgent, isSuperAdmin }) {

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
            <div className='w-2/12'>
                {currentUser.baseRole === 'SUPER_ADMIN' && (
                    <Select aria-label='ตัวเลือกหน่วยงาน' variant='bordered' label='ตัวแทน' selectedKeys={[`${selectAgent}`]} onChange={(e) => setSelectAgent(Number(e.target.value) || null)}>
                        {agentList.map((item) => (
                            <SelectItem key={item.agentId} value={item.agentId}>{item.name}</SelectItem>
                        ))}
                    </Select>
                )}
            </div>
        </div>
    )
}

export default Controller
