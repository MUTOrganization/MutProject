import React from 'react'
import CustomerSegmentTable from './customerSegmentTable'
import RFMSegment from './rfmSegment'

function DashboardInsightsBody() {
    return (
        <div className='space-y-4'>
            <section>
                <RFMSegment />
            </section>
            <section>
                <CustomerSegmentTable />
            </section>
        </div>
    )
}

export default DashboardInsightsBody