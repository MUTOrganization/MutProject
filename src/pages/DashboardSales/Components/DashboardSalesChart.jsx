import React, { useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useDashboardSalesContext } from '../DashboardSalesContext';
import { Spinner } from '@heroui/react';
import DashboardSalesTotalChart from './DashboardSalesTotalChart';
import DashboardSalesCustomerIncomeChart from './DashboardSalesCustomerIncomeChart';

function DashboardSalesChart() {

  return (
    <div className='w-full flex flex-col justify-center items-center lg:flex-row lg:justify-between lg:items-start lg:space-x-5 lg:space-y-0 space-x-0 space-y-5 h-full'>
      <DashboardSalesTotalChart />
      <DashboardSalesCustomerIncomeChart />
    </div>
  )
}

export default DashboardSalesChart
