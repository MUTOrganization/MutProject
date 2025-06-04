import React, { useState } from 'react'
import { useDashboardSalesContext } from '../DashboardSalesContext'
import { Progress, Spinner, Switch, Tab, Tabs } from '@heroui/react';
import { formatNumber } from '@/component/FormatNumber';

function DashboardSalesMainData() {

    const { getCommissionData, getProfit, getOrder, getPaidIncome, getMoneyStatus, isLoading, isSwitch, setIsSwitch, getOrderStatus } = useDashboardSalesContext();

    const code = getMoneyStatus()

    return (
        <div className='w-full flex flex-row justify-between items-start space-x-6'>
            <section className='w-full grid grid-cols-2 gap-4'>
                <div className='bg-white rounded-lg p-3 shadow-sm border-8 border-slate-50'>
                    <header className='text-slate-500 text-sm'>คอมมิชชั่น</header>
                    <div className='text-center'>
                        <div className='text-center text-blue-500 font-bold text-3xl py-2'>
                            {isLoading ? <Spinner /> : formatNumber(getCommissionData())}
                        </div>

                    </div>
                </div>
                <div className='bg-white rounded-lg p-3 shadow-sm border-8 border-slate-50'>
                    <header className='text-slate-500 text-sm'>ยอดขาย</header>
                    <div className='text-center'>
                        <div className='text-center text-blue-500 font-bold text-3xl py-2'>
                            {isLoading ? <Spinner /> : formatNumber(getProfit())}
                        </div>

                    </div>
                </div>
                <div className='bg-white rounded-lg p-3 shadow-sm border-8 border-slate-50'>
                    <header className='text-slate-500 text-sm'>ออเดอร์</header>
                    <div className='text-center'>
                        <div className='text-center text-blue-500 font-bold text-3xl py-2'>
                            {isLoading ? <Spinner /> : getOrder()}
                        </div>

                    </div>
                </div>
                <div className='bg-white rounded-lg p-3 shadow-sm border-8 border-slate-50'>
                    <header className='text-slate-500 text-sm'>ยอดยก</header>
                    <div className='text-center'>
                        <div className='text-center text-blue-500 font-bold text-3xl py-2'>
                            {isLoading ? <Spinner /> : formatNumber(getPaidIncome())}
                        </div>

                    </div>
                </div>
            </section>
            <div className='w-full bg-white rounded-lg p-4 h-full relative shadow-sm border-8 border-slate-50'>
                <div className='flex flex-row justify-end items-center space-x-3 text-sm absolute top-5 right-6 '>
                    <span>ยอดขาย</span>
                    <Switch checked={isSwitch} onChange={() => setIsSwitch(!isSwitch)} />
                    <span>ออเดอร์</span>
                </div>
                <Tabs className=''>
                    <Tab key='สถานะการชำระเงิน' title='สถานะการชำระเงิน'>
                        {isLoading ? <div className='flex justify-center iitems-center'><Spinner variant='dots' /></div> : (
                            <div className='mt-3'>
                                <div className='space-y-4'>
                                    <div>
                                        <div className='text-slate-500 flex flex-row justify-between items-center'>
                                            <span>ยอดรวม</span>
                                            <span className=''>
                                                {isSwitch ?
                                                    code?.summary?.paidOrderCount || 0 : formatNumber(code?.summary?.paidIncome || 0)} / {isSwitch ? code?.summary?.orderCount || 0 : formatNumber(code?.summary?.income || 0)}
                                            </span>
                                        </div>
                                        <Progress value={isSwitch ? code?.summary?.paidOrderCount : code?.summary?.paidIncome} color='success' maxValue={isSwitch ? code?.summary?.orderCount : code?.summary?.income} size='sm' />
                                    </div>
                                    <div>
                                        <div className='text-slate-500 flex flex-row justify-between items-center'>
                                            <span>COD</span>
                                            <span>{isSwitch ? code?.COD?.paidOrderCount || 0 : formatNumber(code?.COD?.paidIncome || 0)} / {isSwitch ? code?.COD?.orderCount || 0 : formatNumber(code?.COD?.income || 0)}</span>
                                        </div>
                                        <Progress value={isSwitch ? code?.COD?.paidOrderCount : code?.COD?.paidIncome} color='primary' maxValue={isSwitch ? code?.COD?.orderCount : code?.COD?.income} size='sm' />
                                    </div>
                                    <div>
                                        <div className='text-slate-500 flex flex-row justify-between items-center'>
                                            <span>TRANSFER</span>
                                            <span>{isSwitch ? code?.TRANSFER?.paidOrderCount || 0 : formatNumber(code?.TRANSFER?.paidIncome || 0)} / {isSwitch ? code?.TRANSFER?.orderCount || 0 : formatNumber(code?.TRANSFER?.income) || 0}</span>
                                        </div>
                                        <Progress value={isSwitch ? code?.TRANSFER?.paidOrderCount : code?.TRANSFER?.paidIncome} color='warning' maxValue={isSwitch ? code?.TRANSFER?.orderCount : code?.TRANSFER?.income || 0} size='sm' />
                                    </div>
                                </div>
                            </div>
                        )}
                    </Tab>
                    <Tab key='สถานะออเดอร์' title='สถานะออเดอร์'>
                        {isLoading ? <Spinner /> : (
                            <div className='space-y-2 w-full mt-2 px-3'>
                                <div className='flex flex-row justify-between items-center'>
                                    <span className='text-slate-600'>รอจัดส่ง</span>
                                    <span>{isSwitch ? getOrderStatus()?.wait?.count : formatNumber(getOrderStatus()?.wait?.amount)}</span>
                                </div>
                                <div className='flex flex-row justify-between items-center'>
                                    <span className='text-slate-600'>กำลังจัดส่ง</span>
                                    <span>{isSwitch ? getOrderStatus()?.onDelivery?.count : formatNumber(getOrderStatus()?.onDelivery?.amount)}</span>
                                </div>
                                <div className='flex flex-row justify-between items-center'>
                                    <span className='text-slate-600'>รับสินค้าแล้ว</span>
                                    <span>{isSwitch ? getOrderStatus()?.finished?.count : formatNumber(getOrderStatus()?.finished?.amount)}</span>
                                </div>
                                <div className='flex flex-row justify-between items-center'>
                                    <span className='text-slate-600'>ตีกลับ</span>
                                    <span>{isSwitch ? getOrderStatus()?.returned?.count : formatNumber(getOrderStatus()?.returned?.amount)}</span>
                                </div>
                            </div>
                        )}
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export default DashboardSalesMainData
