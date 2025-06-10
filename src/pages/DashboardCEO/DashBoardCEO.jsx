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
import { Spinner } from '@heroui/react';
import agentService from '@/services/agentService';

function DashboardCEO() {

    const { currentUser } = useAppContext();

    // Fetch Data
    const [allUser, setAllUser] = useState([])
    const [expensesData, setExpensesData] = useState([])
    const [commissionData, setCommissionData] = useState([])
    const [agentList, setAgentList] = useState([])
    const [expensesType, setExpensesType] = useState([])

    //Access Check
    const isSuperAdmin = currentUser.baseRole === 'SUPER_ADMIN'

    // Loading Data
    const [isLoading, setIsLoading] = useState(false)

    // Other State
    const [selectAgent, setSelectAgent] = useState(isSuperAdmin ? null : currentUser.agent.agentId)
    const [selectExpensesTypeFromChart, setSelectExpensesTypeFromChart] = useState(null)

    // Date Data
    const startDate = startOfYear(today())
    const endDate = endOfYear(today())
    const [date, setDate] = useState({
        start: startDate,
        end: endDate
    })
    const [dateMode, setDateMode] = useState('ปี');

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const agents = await agentService.getAgent()
                setAgentList(agents)

                if (isSuperAdmin && agents.length > 0) {
                    setSelectAgent(agents[0].agentId)
                }
            } catch (err) {
                console.log('Error loading agents', err)
            }
        }

        fetchAgents()
    }, [])


    const FetchData = async () => {
        setIsLoading(true)
        try {
            const [users] = await Promise.all([
                userService.getAllUser(selectAgent),
            ])
            const Selectusers = users.length > 0 ? users.map(u => u.username) : []
            const [expenses, commission, expensesType] = await Promise.all([
                expensesService.getExpensesDetails(selectAgent, formatDateObject(date.start), formatDateObject(date.end)),
                commissionService.getCommission(selectAgent, Selectusers, formatDateObject(date.start), formatDateObject(date.end)),
                expensesService.getExpensesType(selectAgent)
            ])

            setAllUser(users)
            setExpensesData(expenses)
            setCommissionData(commission)
            setExpensesType(expensesType)
        } catch (err) {
            console.log('Error fetching CEO dashboard data', err)
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        setExpensesData([])
        setCommissionData([])
        FetchData()
    }, [date, selectAgent])

    useEffect(() => {
        if (isSuperAdmin && agentList.length > 0 && selectAgent === null) {
            setSelectAgent(agentList[0]?.agentId)
        }
    }, [selectAgent])
    
    return (
        <div className='body-contain w-full'>
            <div className='controller mb-4'>
                <Controller agentList={agentList} setAgentList={setAgentList} currentUser={currentUser} date={date} setDate={setDate} dateMode={dateMode} setDateMode={setDateMode} selectAgent={selectAgent} setSelectAgent={setSelectAgent} isSuperAdmin={isSuperAdmin} />
            </div>
            <div className='w-full'>
                <AllSummary expensesData={expensesData} selectAgent={selectAgent} commissionData={commissionData} isLoading={isLoading} currentUser={currentUser} date={date} dateMode={dateMode} allUser={allUser} />

                {/* Chart Body */}
                <div className='w-full mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4'>
                    <div className='w-full p-4 rounded-lg shadow-sm bg-white'>
                        <ProfitChart commissionData={commissionData} expensesData={expensesData} />
                    </div>
                    <div className='w-full p-4 rounded-lg shadow-sm bg-white'>
                        <Sales_ExpensesChart commissionData={commissionData} expensesData={expensesData} />
                    </div>
                    <div className='w-full p-4 rounded-lg shadow-sm bg-white'>
                        <ExpensesDetails expensesType={expensesType} expensesData={expensesData} selectExpensesTypeFromChart={selectExpensesTypeFromChart} />
                    </div>
                    <div className='w-full p-4 rounded-lg shadow-sm bg-white'>
                        <ExpensesChart expensesData={expensesData} setSelectExpensesTypeFromChart={setSelectExpensesTypeFromChart} selectExpensesTypeFromChart={selectExpensesTypeFromChart} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardCEO
