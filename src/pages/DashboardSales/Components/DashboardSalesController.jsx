import React from 'react'
import { useDashboardSalesContext } from '../DashboardSalesContext';
import DateSelector from '@/component/DateSelector';
import { Autocomplete, AutocompleteItem, Button } from '@heroui/react';
import { useAppContext } from '@/contexts/AppContext';
import { HFRefresh } from '@/component/Icons';

function DashboardSalesController() {

    const { date, setDate, dateMode, setDateMode, agentData, selectAgent, setSelectAgent, userData, selectUser, setSelectUser, isSuperAdmin, isAdmin, fetchRefreshData, currentUser } = useDashboardSalesContext();
    
    return (
        <div className='w-full bg-white rounded-lg p-4 shadow-sm flex flex-col justify-center items-center lg:flex-row lg:justify-start lg:items-center lg:space-x-4 lg:space-y-0 space-x-0 space-y-4'>
            <DateSelector
                value={date}
                onChange={setDate}
                isShowDateRange={false}
                isShowDay={false}
                modeState={dateMode}
                onModeChange={setDateMode}
            />

            {(isSuperAdmin) && (
                <Autocomplete className='w-full lg:w-2/12' variant='bordered' aria-label='ตัวแทน' label='เลือกตัวแทน' selectedKey={`${selectAgent}`}
                    onSelectionChange={(value) => {
                        if (value === null) return;
                        setSelectAgent(Number(value) || null)
                    }}>
                    {agentData.map((item) => (
                        <AutocompleteItem key={item.agentId} value={item.agentId}>{item.name}</AutocompleteItem>
                    ))}
                </Autocomplete>
            )}

            {(isSuperAdmin || isAdmin) ? (
                <Autocomplete className='w-full lg:w-2/12' variant='bordered' aria-label='เลือกผู้ขาย' label='เลือกผู้ขาย' selectedKey={`${selectUser}`}
                    onSelectionChange={(value) => {
                        if (value === null) return;
                        setSelectUser(value || null)
                    }}>
                    <AutocompleteItem key='ทั้งหมด' value='ทั้งหมด'>ทั้งหมด</AutocompleteItem>
                    {userData.map((item) => (
                        <AutocompleteItem key={item.username} value={item.username}>{`${item.username} - ${item.department.departmentName}`}</AutocompleteItem>
                    ))}
                </Autocomplete>
            ) : currentUser.baseRole === 'MANAGER' ? (
                <Autocomplete className='w-full lg:w-2/12' variant='bordered' aria-label='เลือกผู้ขาย' label='เลือกผู้ขาย' selectedKey={`${selectUser}`}
                    onSelectionChange={(value) => {
                        if (value === null) return;
                        setSelectUser(value || null)
                    }}>
                    <AutocompleteItem key='ทั้งหมด' value='ทั้งหมด'>ทั้งหมด</AutocompleteItem>
                    {userData.filter(d => d.department.departmentId === currentUser.department.departmentId).map((item) => (
                        <AutocompleteItem key={item.username} value={item.username}>{`${item.username} - ${item.department.departmentName}`}</AutocompleteItem>
                    ))}
                </Autocomplete>
            ) : ''}

            <Button isIconOnly color='primary' variant='light' onPress={() => fetchRefreshData()} className='text-lg'>
                <HFRefresh size={20} />
            </Button>

        </div>
    )
}

export default DashboardSalesController
