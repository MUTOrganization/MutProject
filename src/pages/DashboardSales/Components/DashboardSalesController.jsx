import React from 'react'
import { useDashboardSalesContext } from '../DashboardSalesContext';
import DateSelector from '@/component/DateSelector';
import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { useAppContext } from '@/contexts/AppContext';

function DashboardSalesController() {

    const { date, setDate, dateMode, setDateMode, agentData, selectAgent, setSelectAgent, userData, selectUser, setSelectUser, isSuperAdmin, isAdmin } = useDashboardSalesContext();

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

            {isSuperAdmin && (
                <Autocomplete className='w-2/12' variant='bordered' aria-label='ตัวแทน' label='เลือกตัวแทน' selectedKey={`${selectAgent}`}
                    onSelectionChange={(value) => {
                        if (value === null) return;
                        setSelectAgent(Number(value) || null)
                    }}>
                    {agentData.map((item) => (
                        <AutocompleteItem key={item.agentId} value={item.agentId}>{item.name}</AutocompleteItem>
                    ))}
                </Autocomplete>
            )}

            {(isSuperAdmin || isAdmin) && (
                <Autocomplete className='w-2/12' variant='bordered' aria-label='เลือกผู้ขาย' label='เลือกผู้ขาย' selectedKey={`${selectUser}`}
                    onSelectionChange={(value) => {
                        if (value === null) return;
                        setSelectUser(value || null)
                    }}>
                    <AutocompleteItem key='ทั้งหมด' value='ทั้งหมด'>ทั้งหมด</AutocompleteItem>
                    {userData.map((item) => (
                        <AutocompleteItem key={item.username} value={item.username}>{item.username}</AutocompleteItem>
                    ))}
                </Autocomplete>
            )}

        </div>
    )
}

export default DashboardSalesController
