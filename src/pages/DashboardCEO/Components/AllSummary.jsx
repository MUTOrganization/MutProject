import React, { act, useEffect, useState } from 'react'
import expensesService from '@/services/expensesService'
import commissionService from '@/services/commissionService'
import userService from '@/services/userService'
import { formatDateObject } from '@/utils/dateUtils'
import { formatNumber } from '@/component/FormatNumber'
import { Spinner } from '@heroui/react'

function AllSummary({ currentUser, date }) {

    // Fetch Data
    const [allUser, setAllUser] = useState([])
    const [expensesData, setExpensesData] = useState([])
    const [commissionData, setCommissionData] = useState([])

    // Loading Data
    const [isLoading, setIsLoading] = useState(false)


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
                await expensesService.getExpensesDetails(currentUser.agent.agentId, formatDateObject(date.startDate), formatDateObject(date.endDate)),
                await commissionService.getCommission(currentUser.agent.agentId, Selectusers, formatDateObject(date.startDate), formatDateObject(date.endDate))
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

    const isDataEmpty = commissionData.length === 0 || expensesData.length === 0

    // All Expenses
    const totalExpenses = expensesData.reduce((sum, item) => sum + item.totalAmount, 0)
    const totalCommission = commissionData.reduce((sum, item) => sum + item.data.reduce((acc, item) => acc + item?.commission, 0), 0)
    const expensesNetAmount = Math.abs(totalCommission + totalExpenses)

    // All Percent
    const commissionPercent = expensesNetAmount > 0 ? (totalCommission / expensesNetAmount) * 100 : 0
    const otherExpensesPercent = expensesNetAmount > 0 ? (totalExpenses / expensesNetAmount) * 100 : 0

    // ยอดขาย
    const totalSales = commissionData.reduce((sum, item) => sum + item.data.reduce((acc, item) => acc + item?.adminIncome, 0), 0)

    return (
        <div className='w-full flex flex-row justify-start items-center space-x-5'>

            <div className='bg-white rounded-md shadow-md py-2 px-6 flex flex-row justify-between items-center space-x-8 relative h-28'>
                <div className='subBox1'>
                    <header className='text-start text-sm text-slate-500 mb-3 absolute top-4'>กำไรสุทธิ</header>
                    <div className='mt-3'>
                        <div className='text-2xl text-green-500 font-semibold'>{formatNumber(Math.abs(totalSales - expensesNetAmount))}</div>
                    </div>
                </div>

                <div className='h-20 w-0.5 bg-slate-200 rounded-md'></div>

                <div className='subBox2'>
                    <header className='text-start text-sm text-slate-500 mb-3 absolute top-4'>ยอดขาย</header>
                    <div className='mt-3'>
                        <div className='text-blue-500 text-2xl'>{isLoading || commissionData.length === 0 ? <Spinner variant='wave' color='danger' /> : formatNumber(totalSales)}</div>
                    </div>
                </div>

                <div className='h-20 w-0.5 bg-slate-200 rounded-md'></div>

                <div className='subBox1'>
                    <header className='text-start text-sm text-slate-500 mb-3 absolute top-4'>ค่าใช้จ่ายรวม</header>
                    <div className='mt-4 flex flex-col justify-center items-start py-4'>
                        <div className='text-2xl text-red-400'>{commissionData.length === 0 || expensesData.length === 0 ? <Spinner variant='wave' color='danger' /> : formatNumber(expensesNetAmount)}</div>
                        <div className='text-sm text-slate-500'></div>
                    </div>
                </div>
            </div>

            <div className='bg-white rounded-md shadow-md py-3 px-6 h-28 flex flex-row justify-between items-center space-x-8 relative'>
                <div className='subBox2 px-4'>
                    <header className='text-start text-sm text-slate-500 mb-3 absolute top-4'>ค่าคอมมิชชั่น</header>
                    <div className='flex flex-col justify-center items-start mt-8'>
                        <div className='text-slate-500 text-2xl'>{isLoading || commissionData.length === 0 ? <Spinner variant='wave' color='danger' /> : formatNumber(totalCommission)}</div>

                        <div className='flex flex-row justify-between items-center space-x-4 w-full my-1'>
                            <div className='text-orange-500 text-sm'>
                                {isDataEmpty ? '' : `${commissionPercent.toFixed(2)}%`}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='h-20 w-0.5 bg-slate-200 rounded-md'></div>

                <div className='subBox2 px-4'>
                    <header className='text-start text-sm text-slate-500 mb-3 absolute top-4'>ค่าใช้จ่ายอื่นๆ</header>
                    <div className='flex flex-col justify-center items-start mt-8'>
                        <div className='text-slate-500 text-2xl'>{isLoading || expensesData.length === 0 ? <Spinner color='danger' variant='wave' /> : formatNumber(totalExpenses)}</div>

                        <div className='flex flex-row justify-between items-center space-x-4 w-full my-1'>
                            <div className='text-orange-500 text-sm'>
                                {isDataEmpty ? '' : `${otherExpensesPercent.toFixed(2)}%`}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className='bg-white rounded-md shadow-md px-4 py-5 h-28 flex flex-col justify-center items-center space-y-2 w-3/12'>
                <div className='flex flex-row justify-between items-center space-x-4 w-full'>
                    <span className='text-lg text-slate-500'>ลูกค้าใหม่</span>
                    <span className='text-green-500 font-semibold'>500</span>
                </div>
                <div className='w-full h-0.5 bg-slate-100 rounded-md '></div>
                <div className='flex flex-row justify-between items-center space-x-4 w-full'>
                    <span className='text-lg text-slate-500'>ลูกค้าเก่า</span>
                    <span className='text-slate-600 font-semibold'>500</span>
                </div>
            </div>
        </div>
    )
}

export default AllSummary
