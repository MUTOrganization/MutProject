import React from 'react'
import { useDashboardSalesContext } from '../DashboardSalesContext';

function DashboardSalesController() {

    const { commissionData, agentData, userData, isLoading } = useDashboardSalesContext();

    return (
        <div>
            Controller
        </div>
    )
}

export default DashboardSalesController
