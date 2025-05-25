import React, { act, useEffect, useState } from 'react'
import { formatNumber } from '@/component/FormatNumber'
import { Spinner } from '@heroui/react'

function AllSummary({ expensesData, commissionData, isLoading }) {

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
        <div className='w-full flex flex-row justify-start items-center space-x-4'>

            <div className='bg-white rounded-lg py-2 px-6 w-full flex flex-row justify-between items-center space-x-8 relative h-28 border-8 border-slate-50'>
                <div className='subBox1'>
                    <header className='text-start text-sm text-slate-500 mb-3 absolute top-4'>กำไรสุทธิ</header>
                    <div className='mt-3'>
                        <div className='text-2xl'>{formatNumber(Math.abs(totalSales - expensesNetAmount))}</div>
                    </div>
                </div>

                <div className='h-20 w-0.5 bg-slate-100 rounded-md'></div>

                <div className='subBox2'>
                    <header className='text-start text-sm text-slate-500 mb-3 absolute top-4'>ยอดขาย</header>
                    <div className='mt-3'>
                        <div className='text-2xl'>{isLoading || commissionData.length === 0 ? <div className='w-28'><Spinner variant='gradient' size='sm' color='primary' /></div> : formatNumber(totalSales)}</div>
                    </div>
                </div>

                <div className='h-20 w-0.5 bg-slate-100 rounded-md'></div>

                <div className='subBox1 w-28'>
                    <header className='text-start text-sm text-slate-500 mb-3 absolute top-4'>ค่าใช้จ่ายรวม</header>
                    <div className='mt-4 flex flex-col justify-center items-start py-4'>
                        <div className='text-2xl'>{isLoading || commissionData.length === 0 ? <div className='w-28'><Spinner variant='gradient' size='sm' color='primary' /></div> : formatNumber(expensesNetAmount)}</div>
                        <div className='text-sm text-slate-500'></div>
                    </div>
                </div>
            </div>

            <div className='bg-white rounded-lg py-3 px-6 h-28 flex flex-row justify-between items-center space-x-8 relative w-full border-8 border-slate-50'>
                <div className='subBox2 px-4'>
                    <header className='text-start text-sm text-slate-500 mb-3 absolute top-4'>ค่าคอมมิชชั่น</header>
                    <div className='flex flex-col justify-center items-start mt-8'>
                        <div className='text-slate-500 text-2xl'>{isLoading || commissionData.length === 0 ? <div className='w-28'><Spinner variant='gradient' size='sm' color='primary' /></div> : formatNumber(totalCommission)}</div>

                        <div className='flex flex-row justify-between items-center space-x-4 w-full my-1'>
                            <div className='text-orange-500 text-sm'>
                                {isDataEmpty ? '' : `${commissionPercent.toFixed(2)}%`}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='h-20 w-0.5 bg-slate-100 rounded-md'></div>

                <div className='subBox2 px-4'>
                    <header className='text-start text-sm text-slate-500 mb-3 absolute top-4'>ค่าใช้จ่ายอื่นๆ</header>
                    <div className='flex flex-col justify-center items-start mt-8'>
                        <div className='text-slate-500 text-2xl'>{isLoading ? <div className='w-28'><Spinner variant='gradient' size='sm' color='primary' /></div> : formatNumber(totalExpenses)}</div>

                        <div className='flex flex-row justify-between items-center space-x-4 w-full my-1'>
                            <div className='text-orange-500 text-sm'>
                                {isDataEmpty ? '' : `${otherExpensesPercent.toFixed(2)}%`}
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
                    <div className='text-2xl text-slate-600'>{isLoading ? <div className='w-28'><Spinner variant='gradient' size='sm' color='primary' /></div> : commissionData.reduce((sum, item) => sum + item.data.reduce((acc, item) => acc + item?.orderCount, 0), 0)}</div>
                    <div className='text-sm text-slate-500'></div>
                </div>
            </div>
        </div>
    )
}

export default AllSummary
