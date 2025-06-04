import React from 'react'
import { useDashboardSalesContext } from '../DashboardSalesContext';
import DateSelector from '@/component/DateSelector';
import { Autocomplete, AutocompleteItem } from '@heroui/react';

function DashboardSalesController() {

    const { date, setDate, dateMode, setDateMode, agentData, selectAgent, setSelectAgent, userData, selectUser, setSelectUser , selectUserParams } = useDashboardSalesContext();
    console.log(selectUserParams())
    return (
        <div className='w-full bg-white rounded-lg p-4 shadow-sm flex flex-row justify-start items-center space-x-4'>
            <DateSelector
                value={date}
                onChange={setDate}
                isShowDateRange={false}
                isShowDay={false}
                modeState={dateMode}
                onModeChange={setDateMode}
            />

            <Autocomplete className='w-2/12' variant='bordered' aria-label='ตัวแทน' label='เลือกตัวแทน' selectedKey={`${selectAgent}`} onSelectionChange={(value) => setSelectAgent(Number(value) || null)}>
                {agentData.map((item) => (
                    <AutocompleteItem key={item.agentId} value={item.agentId}>{item.name}</AutocompleteItem>
                ))}
            </Autocomplete>

            <Autocomplete className='w-2/12' variant='bordered' aria-label='ตัวแทน' label='เลือกผู้ขาย' selectedKey={`${selectUser}`} onSelectionChange={(value) => setSelectUser(value || null)}>
                {userData.map((item) => (
                    <AutocompleteItem key={item.username} value={item.username}>{item.username}</AutocompleteItem>
                ))}
            </Autocomplete>

        </div>
    )
}

export default DashboardSalesController
