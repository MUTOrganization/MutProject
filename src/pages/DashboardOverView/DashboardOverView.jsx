import React, { useState, useEffect } from 'react'
import DashboardOverViewBody from './Components/DashboardOverViewBody'
import TopController from './Components/topController'
import StepperProgress from './Components/StepperProgress';
import { today, startOfMonth, endOfMonth, startOfYear, endOfYear } from "@internationalized/date";
import useOverViewData from './fetchData/overViewData';
import { formatCurrencyNoDollarsWithFixed } from './utils/currencyUtils';
import TotalAmountCard from './Components/totalAmountCard';

function DashboardOverView() {

    const [dateRange, setDateRange] = useState({
        start: startOfYear(today()),
        end: endOfYear(today()),
    });

    const [open, setOpen] = useState(false)
    const [isPercentage, setIsPercentage] = useState(false)
    const [value, setValue] = useState("all")

    const [dateMode, setDateMode] = useState('ปี');

    const { data, isLoading, fetchData } = useOverViewData({ startDate: dateRange.start, endDate: dateRange.end, dateMode: dateMode });

    const totalAmount = data?.currentMonthAgentRanking?.totalAmount
        ? parseFloat(data.currentMonthAgentRanking.totalAmount)
        : 0;

    useEffect(() => {
        fetchData();
    }, [dateRange, dateMode])

    return (
        <div className='space-y-4' title={'แดชบอร์ดยอดสั่งซื้อ'}>
            <section>
                <TopController
                    dateRange={dateRange}
                    open={open}
                    dateMode={dateMode}
                    value={value}
                    setOpen={setOpen}
                    setValue={setValue}
                    setDateMode={setDateMode}
                    setDateRange={setDateRange}
                    isPercentage={isPercentage}
                    setIsPercentage={setIsPercentage} 
                    />
            </section>
            <section>
                <TotalAmountCard data={data} dateMode={dateMode} isPercentage={isPercentage}/>
            </section>
            <section>
                <StepperProgress totalAmount={totalAmount} isLoading={isLoading} dateMode={dateMode} isPercentage={isPercentage}/>
            </section>
            <section >
                <DashboardOverViewBody data={data} isLoading={isLoading} dateMode={dateMode} isPercentage={isPercentage}/>
            </section>
        </div>
    )
}

export default DashboardOverView