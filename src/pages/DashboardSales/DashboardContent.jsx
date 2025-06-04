import React from 'react'
import DashboardSalesController from './Components/DashboardSalesController';
import DashboardSalesMainData from './Components/DashboardSalesMainData';
import DashboardSalesChart from './Components/DashboardSalesChart';

function DashboardContent() {

    return (
        <div className='space-y-4 w-full'>
            <DashboardSalesController />
            <DashboardSalesMainData />
            <DashboardSalesChart />
        </div>
    )
}

export default DashboardContent
