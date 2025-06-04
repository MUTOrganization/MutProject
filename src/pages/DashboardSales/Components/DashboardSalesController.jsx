import React from 'react'
import { useDashboardSalesContext } from '../DashboardSalesContext';

function DashboardSalesController() {

    const { commissionData, agentData, userData, isLoading } = useDashboardSalesContext();

    return (
        <div className='w-full bg-white rounded-lg p-4 shadow-sm'>
            Controller
        </div>
    )
}

export default DashboardSalesController
