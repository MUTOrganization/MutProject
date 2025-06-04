import React, { useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useDashboardSalesContext } from '../DashboardSalesContext';
import { Spinner } from '@heroui/react';
import DashboardSalesTotalChart from './DashboardSalesTotalChart';
import DashboardSalesCustomerIncomeChart from './DashboardSalesCustomerIncomeChart';

function DashboardSalesChart() {

  return (
    <div className='w-full flex flex-row justify-between items-center space-x-5'>
      <DashboardSalesTotalChart />
      <DashboardSalesCustomerIncomeChart />
    </div>
  )
}

export default DashboardSalesChart
