import React from 'react'
import Box1 from './Box1';
import Box2 from './Box2';
import Box3 from './Box3';
import Box4 from './Box4';

function TotalSaleSection({ startDate, endDate, selectedNameListValue, selectedAgentValue, vatRate, dateMode }) {

    return (
        <div className='body-section1-container w-full grid xl:grid-cols-2 xl:gap-x-6 xl:gap-y-4 mt-4 md:grid-cols-2 md:gap-x-4 md:gap-y-3 gap-y-3'>
            <div className='totalSale'>
                <Box1 startDate={startDate} endDate={endDate} selectedNameListValue={selectedNameListValue} selectedAgentValue={selectedAgentValue} vatRate={vatRate} dateMode={dateMode} />
            </div>
            <div className='Ads'>
                <Box3 startDate={startDate} endDate={endDate} selectedNameListValue={selectedNameListValue} selectedAgentValue={selectedAgentValue} vatRate={vatRate} dateMode={dateMode} />
            </div>
            <div className='Order'>
                <Box2 startDate={startDate} endDate={endDate} selectedNameListValue={selectedNameListValue} selectedAgentValue={selectedAgentValue} vatRate={vatRate} dateMode={dateMode} />
            </div>
            <div className='Inbox'>
                <Box4 startDate={startDate} endDate={endDate} selectedNameListValue={selectedNameListValue} selectedAgentValue={selectedAgentValue} vatRate={vatRate} dateMode={dateMode} />
            </div>
        </div>
    )
}

export default TotalSaleSection
