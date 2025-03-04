import React from 'react'
import FilterCrminsight from './filterCrminsight'
import MonetarySegment from './monetarySegment'
import AnalysisSegment from './AnalysisSegment'
function DashboardInsightsHeader() {
  return (
    <div className='space-y-4'>
    <section>
        <FilterCrminsight/>
    </section>
    <section>
        <MonetarySegment/>
    </section>
    <section>
        <AnalysisSegment/>
    </section>
</div>
  )
}

export default DashboardInsightsHeader