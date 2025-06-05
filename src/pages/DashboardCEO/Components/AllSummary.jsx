import React, { act, useEffect, useState } from 'react'
import { formatNumber } from '@/component/FormatNumber'
import { Spinner } from '@heroui/react'
import commissionService from '@/services/commissionService'
import expensesService from '@/services/expensesService'
import { formatDateObject } from '@/utils/dateUtils'
import { endOfMonth, parseDate, startOfMonth } from '@internationalized/date'
import GroupProfitByMonth from '../GroupProfitByMonth'
import { FaCaretSquareUp, FaCartArrowDown, FaCartPlus, FaExpeditedssl, FaHornbill, FaIntercom, FaMarkdown, FaMoneyBillWaveAlt, FaMoneyCheckAlt, FaRegMoneyBillAlt } from 'react-icons/fa'

function AllSummary({ expensesData, commissionData, isLoading, currentUser, date, dateMode, allUser, selectAgent }) {

    // fetch Data
    const [prevCommissionData, setPrevCommissionData] = useState([])
    const [prevExpensesData, setPrevExpensesData] = useState([])

    const [isPercentLoading, setIsPercentLoading] = useState(false)
    const [prevDate, setPrevDate] = useState({})

    // Number Compare
    const summary = GroupProfitByMonth.Summary(commissionData, expensesData)

    // Percent Compare
    const profitCompare = GroupProfitByMonth.getPrevPercentProfit(
        prevCommissionData.length > 0 ? prevCommissionData : [], commissionData.length > 0 ? commissionData : [],
        prevExpensesData.length > 0 ? prevExpensesData : [], expensesData.length > 0 ? expensesData : []
    )

    useEffect(() => {
        if (!date?.start || !date?.end) return;

        let newStartDate, newEndDate;

        if (dateMode === 'ปี') {
            const prevYear = date.start.year - 1;

            newStartDate = parseDate(`${prevYear}-01-01`);
            newEndDate = parseDate(`${prevYear}-12-31`);

        } else if (dateMode === 'เดือน') {
            const prevMonthDate = date.start.subtract({ months: 1 });

            newStartDate = startOfMonth(prevMonthDate);
            newEndDate = endOfMonth(prevMonthDate);
        }

        setPrevDate({
            start: newStartDate,
            end: newEndDate,
        });
    }, [dateMode, date]);


    const fetchPrevData = async () => {
        setIsPercentLoading(true)
        const Selectusers = allUser?.map(item => item.username)
        try {
            const [expenses, commission] = await Promise.all([
                await expensesService.getExpensesDetails(selectAgent, formatDateObject(prevDate.start), formatDateObject(prevDate.end)),
                await commissionService.getCommission(selectAgent, Selectusers, formatDateObject(prevDate.start), formatDateObject(prevDate.end))
            ])
            setPrevExpensesData(expenses)
            setPrevCommissionData(commission)
            setIsPercentLoading(false)
        } catch (err) {
            console.log('Can not Get DataExpenses From Dashboard CEO', err)
        }
    }

    useEffect(() => {
        if (prevDate.start && prevDate.end && allUser.length > 0 && selectAgent !== null) {
            fetchPrevData()
        }
    }, [prevDate, allUser])

    useEffect(() => {
        setPrevCommissionData([])
        setPrevExpensesData([])
    }, [selectAgent])

    return (
        <div className='w-full flex flex-row justify-start items-center space-x-3'>
            <div className='bg-white px-4 w-4/12 rounded-lg border-8 border-slate-50'>
                <header className='h-14 w-full flex flex-row justify-between items-center space-x-2'>
                    <span className='p-2 bg-blue-100 rounded-full '><FaMoneyCheckAlt className='text-xl text-blue-500' /></span>
                    <span>กำไรสุทธิ</span>
                </header>
                <div className=''>
                    <div className='text-2xl text-blue-500 font-bold'>{summary.profit}</div>
                </div>
                <span className={`text-sm ${profitCompare?.ProfitValue?.color}`}>
                    {!isLoading && (
                        <>
                            {isPercentLoading ? (
                                <Spinner variant='dots' size='sm' color='primary' />
                            ) : (
                                <span className={`text-sm ${profitCompare?.ProfitValue?.color}`}>
                                    {profitCompare?.ProfitValue?.icon} {profitCompare?.ProfitValue?.percent}
                                </span>
                            )}
                        </>
                    )}
                </span>
            </div>

            <div className='bg-white px-4 w-4/12 rounded-lg border-8 border-slate-50'>
                <header className='h-14 w-full flex flex-row justify-between items-center space-x-2'>
                    <span className='p-2 bg-green-100 rounded-full '><FaMoneyBillWaveAlt className='text-xl text-green-500' /></span>
                    <span>ยอดขาย</span>
                </header>
                <div className=''>
                    <div className='text-2xl text-slate-500'>{isLoading ? <div className='w-28'><Spinner variant='gradient' size='sm' color='primary' /></div> : summary.sales}</div>
                </div>
                <span className='text-sm'>
                    {!isLoading && (
                        <>
                            {isPercentLoading ? (
                                <Spinner variant='dots' size='sm' color='primary' />
                            ) : (
                                <span className='text-sm'>{GroupProfitByMonth.getPrevPercentSales(prevCommissionData, commissionData)}</span>
                            )}
                        </>
                    )}
                </span>
            </div>

            <div className='bg-white px-4 w-4/12 rounded-lg border-8 border-slate-50'>
                <header className='h-14 w-full flex flex-row justify-between items-center space-x-2'>
                    <span className='p-2 bg-red-100 rounded-full '><FaMarkdown className='text-xl text-red-500' /></span>
                    <span>ค่าใช้จ่ายรวม</span>
                </header>
                <div className=''>
                    <div className='text-2xl text-slate-500'>{isLoading ? <div className='w-28'><Spinner variant='gradient' size='sm' color='primary' /></div> : summary.netExpense}</div>
                </div>
                <span className={`text-sm ${profitCompare?.percentNetExpenses?.color}`}>
                    {!isLoading && (
                        <>
                            {isPercentLoading ? (
                                <Spinner variant='dots' size='sm' color='primary' />
                            ) : (
                                <span className={`text-sm ${profitCompare?.percentNetExpenses?.color}`}>
                                    {profitCompare?.percentNetExpenses?.icon} {profitCompare?.percentNetExpenses?.percent}
                                </span>
                            )}
                        </>
                    )}
                </span>
            </div>

            <div className='bg-white px-4 w-5/12 rounded-lg border-8 border-slate-50 flex flex-row justify-between items-center'>
                <div className='subBox2 px-4'>
                    <header className='h-14 w-full flex flex-row justify-between items-center space-x-2'>
                        <span className='text-xs'>ค่าคอมมิชชั่น</span>
                    </header>
                    <div>
                        <div className='text-slate-500 text-2xl'>{isLoading ? <div className='w-28'><Spinner variant='gradient' size='sm' color='primary' /></div> : summary.commission}</div>
                    </div>
                    <span className={`text-sm ${profitCompare?.percentNetExpenses?.color}`}>
                        {!isLoading && (
                            <>
                                {isPercentLoading ? (
                                    <Spinner variant='dots' size='sm' color='primary' />
                                ) : (
                                    <span className={`text-sm`}>
                                        {summary.percent.commission}%
                                    </span>
                                )}
                            </>
                        )}
                    </span>
                </div>
                <div className='h-20 w-0.5 bg-slate-100 rounded-md'></div>
                <div className='subBox2 px-4'>
                    <header className='h-14 w-full flex flex-row justify-between items-center space-x-2'>
                        <span className='text-xs'>ค่าใช้จ่ายอื่นๆ</span>
                    </header>
                    <div>
                        <div className='text-slate-500 text-2xl'>{isLoading ? <div className='w-28'><Spinner variant='gradient' size='sm' color='primary' /></div> : summary.expenses}</div>
                    </div>
                    <span className={`text-sm ${profitCompare?.percentNetExpenses?.color}`}>
                        {!isLoading && (
                            <>
                                {isPercentLoading ? (
                                    <Spinner variant='dots' size='sm' color='primary' />
                                ) : (
                                    <span className={`text-sm`}>
                                        {summary.percent.expenses}%
                                    </span>
                                )}
                            </>
                        )}
                    </span>
                </div>
            </div>

            <div className='bg-white px-4 w-3/12 rounded-lg border-8 border-slate-50'>
                <header className='h-14 w-full flex flex-row justify-between items-center space-x-2'>
                    <span className='p-2 bg-yellow-100 rounded-full '><FaCartPlus className='text-xl text-yellow-500' /></span>
                    <span>ออเดอร์</span>
                </header>
                <div className='text-center'>
                    <div className='text-2xl text-slate-600'>{isLoading ? <div className='w-28'><Spinner variant='gradient' size='sm' color='primary' /></div> : summary.orderCount}</div>
                </div>
                <span className={`text-sm ${profitCompare?.percentNetExpenses?.color}`}>
                    <span className='text-white'>...</span>
                </span>
            </div>
        </div>
    )
}

export default AllSummary
