import React, { useEffect, useState } from 'react'
import Controller from './Controller'
import AllSummary from './Components/AllSummary'
import { useAppContext } from '@/contexts/AppContext'
import { endOfMonth, endOfYear, startOfMonth, startOfYear, today } from '@internationalized/date';
import ProfitChart from './Components/ProfitChart';
import userService from '@/services/userService';
import expensesService from '@/services/expensesService';
import commissionService from '@/services/commissionService';
import { formatDateObject } from '@/utils/dateUtils';
import Sales_ExpensesChart from './Components/Sales_ExpensesChart';
import ExpensesChart from './Components/ExpensesChart';
import ExpensesDetails from './Components/ExpensesDetails';

function DashboardCEO() {

    const { currentUser } = useAppContext();

    // Fetch Data
    const [allUser, setAllUser] = useState([])
    const [expensesData, setExpensesData] = useState([])
    const [commissionData, setCommissionData] = useState([])
    const [agentList, setAgentList] = useState(null)

    // Loading Data
    const [isLoading, setIsLoading] = useState(false)

    // Other State
    const [selectAgent, setSelectAgent] = useState(null)
    const [selectExpensesTypeFromChart, setSelectExpensesTypeFromChart] = useState(null)

    // Date Data
    const startDate = startOfYear(today())
    const endDate = endOfYear(today())
    const [date, setDate] = useState({
        start: startDate,
        end: endDate
    })
    const [dateMode, setDateMode] = useState('ปี');

    const fetchAllUser = async () => {
        try {
            const res = await userService.getAllUser(currentUser.agent.agentId)
            setAllUser(res)
        } catch (err) {
            console.log('Cannot Get All User', err)
        }
    }

    const fetchAllData = async () => {
        setIsLoading(true)
        const Selectusers = allUser.map(item => item.username)
        try {
            const [expenses, commission] = await Promise.all([
                await expensesService.getExpensesDetails(currentUser.agent.agentId, formatDateObject(date.start), formatDateObject(date.end)),
                await commissionService.getCommission(currentUser.agent.agentId, Selectusers, formatDateObject(date.start), formatDateObject(date.end))
            ])
            setExpensesData(expenses)
            setCommissionData(commission)
            setIsLoading(false)
        } catch (err) {
            console.log('Can not Get DataExpenses From Dashboard CEO', err)
        }
    }

    useEffect(() => {
        fetchAllUser()
    }, [])

    useEffect(() => {
        if (allUser.length > 0) {
            fetchAllData()
        }
    }, [date, allUser])

    return (
        <div className='body-contain w-full'>
            <div className='controller mb-4'>
                <Controller setAgentList={setAgentList} currentUser={currentUser} date={date} setDate={setDate} dateMode={dateMode} setDateMode={setDateMode} />
            </div>
            <div className='w-full'>
                <AllSummary expensesData={expensesData} commissionData={commissionData} isLoading={isLoading} currentUser={currentUser} date={date} dateMode={dateMode} allUser={allUser} />

                {/* Chart Body */}
                <div className='w-full mt-4 grid grid-cols-2 gap-4'>
                    <div className='w-full p-4 rounded-lg shadow-sm bg-white'>
                        <ProfitChart commissionData={commissionData} expensesData={expensesData} />
                    </div>
                    <div className='w-full p-4 rounded-lg shadow-sm bg-white'>
                        <Sales_ExpensesChart commissionData={commissionData} expensesData={expensesData} />
                    </div>
                    <div className='w-full p-4 rounded-lg shadow-sm bg-white'>
                        <ExpensesChart expensesData={expensesData} setSelectExpensesTypeFromChart={setSelectExpensesTypeFromChart} selectExpensesTypeFromChart={selectExpensesTypeFromChart} />
                    </div>
                    <div className='w-full p-4 rounded-lg shadow-sm bg-white'>
                        <ExpensesDetails expensesData={expensesData} selectExpensesTypeFromChart={selectExpensesTypeFromChart} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardCEO
