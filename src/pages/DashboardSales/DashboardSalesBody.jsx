import React from 'react'
import { DashboardSalesProvider } from './DashboardSalesContext'
import DashboardContent from './DashboardContent'

function DashboardSalesBody() {
  return (
    <div>
      <DashboardSalesProvider>
        <DashboardContent />
      </DashboardSalesProvider>
    </div>
  )
}

export default DashboardSalesBody
