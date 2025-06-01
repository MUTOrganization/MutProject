import React, { act, useEffect, useState } from 'react'
import { formatNumber } from '@/component/FormatNumber'
import { Spinner } from '@heroui/react'
import commissionService from '@/services/commissionService'
import expensesService from '@/services/expensesService'
import { formatDateObject } from '@/utils/dateUtils'
import { endOfMonth, parseDate, startOfMonth } from '@internationalized/date'
import GroupProfitByMonth from '../GroupProfitByMonth'

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
            console.log('Test')
            fetchPrevData()
        }
    }, [prevDate, allUser])

    useEffect(() => {
        setPrevCommissionData([])
        setPrevExpensesData([])
    }, [selectAgent])

    const isDataEmpty =
        commissionData?.length === 0 ||
        expensesData?.length === 0 ||
        prevCommissionData?.length === 0 ||
        prevExpensesData?.length === 0

    return (
        <div className='w-full flex flex-row justify-start items-center space-x-4'>

            <div className='bg-white rounded-lg px-6 w-full flex flex-row justify-between items-center space-x-8 relative h-28 border-8 border-slate-50'>
                <div className='subBox1'>
                    <header className='text-start text-sm text-slate-500 mb-3 absolute top-4'>กำไรสุทธิ</header>
                    <div className='mt-8'>
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

                <div className='h-20 w-0.5 bg-slate-100 rounded-md'></div>

                <div className='subBox2'>
                    <header className='text-start text-sm text-slate-500 mb-3 absolute top-4'>ยอดขาย</header>
                    <div className='mt-8'>
                        <div className='text-2xl text-slate-500'>{isLoading ? <div className='w-28'><Spinner variant='gradient' size='sm' color='primary' /></div> : summary.sales}</div>
                    </div>
                    <span>
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

                <div className='h-20 w-0.5 bg-slate-100 rounded-md'></div>

                <div className='subBox1 w-auto'>
                    <header className='text-start text-sm text-slate-500 mb-3 absolute top-4'>ค่าใช้จ่ายรวม</header>
                    <div className='mt-8 flex flex-col justify-center items-start py-4'>
                        <div className='text-2xl text-slate-500'>{isLoading ? <div className='w-28'><Spinner variant='gradient' size='sm' color='primary' /></div> : summary.netExpense}</div>
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
                </div>
            </div>

            <div className='bg-white rounded-lg py-3 px-6 h-28 flex flex-row justify-between items-center space-x-8 relative w-full border-8 border-slate-50'>
                <div className='subBox2 px-4'>
                    <header className='text-start text-sm text-slate-500 mb-3 absolute top-4'>ค่าคอมมิชชั่น</header>
                    <div className='flex flex-col justify-center items-start mt-8'>
                        <div className='text-slate-500 text-2xl'>{isLoading ? <div className='w-28'><Spinner variant='gradient' size='sm' color='primary' /></div> : summary.commission}</div>

                        <div className='flex flex-row justify-between items-center space-x-4 w-full my-1'>
                            <div className='text-orange-500 text-sm'>
                                {isDataEmpty ? '' : `${summary.percent.commission}%`}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='h-20 w-0.5 bg-slate-100 rounded-md'></div>

                <div className='subBox2 px-4'>
                    <header className='text-start text-sm text-slate-500 mb-3 absolute top-4'>ค่าใช้จ่ายอื่นๆ</header>
                    <div className='flex flex-col justify-center items-start mt-8'>
                        <div className='text-slate-500 text-2xl'>{isLoading ? <div className='w-28'><Spinner variant='gradient' size='sm' color='primary' /></div> : summary.expenses}</div>

                        <div className='flex flex-row justify-between items-center space-x-4 w-full my-1'>
                            <div className='text-orange-500 text-sm'>
                                {isDataEmpty ? '' : `${summary.percent.expenses}%`}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='bg-white rounded-lg px-4 py-5 h-28 flex flex-col justify-center items-center space-y-2 w-full  border-8 border-slate-50'>
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

            <div className='bg-white rounded-xl px-4 text-slate-500 py-5 h-28 w-full relative border-8 border-slate-50'>
                <header className='text-start text-lg mb-3 absolute top-4'>ออเดอร์</header>
                <div className='mt-4 flex flex-row justify-center items-start py-4'>
                    <div className='text-2xl text-slate-600'>{isLoading ? <div className='w-28'><Spinner variant='gradient' size='sm' color='primary' /></div> : summary.orderCount}</div>
                    <div className='text-sm text-slate-500'></div>
                </div>
            </div>
        </div>
    )
}

export default AllSummary
