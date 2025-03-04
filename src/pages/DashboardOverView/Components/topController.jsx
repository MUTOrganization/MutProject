import React from 'react'
import DateSelector from '@/component/DateSelector';
import { Card, CardBody, Checkbox } from '@nextui-org/react';
import { PercentIcon } from 'lucide-react';

function topController({ dateRange, setDateRange, open, dateMode, value, setOpen, setValue, setDateMode, isPercentage, setIsPercentage }) {

    return (
        <div>
            <Card shadow='none' radius='sm'>
                <CardBody>
                    <div className='flex items-center w-full'>
                        <div className='flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-center w-full'>
                            <DateSelector value={dateRange} onChange={(value) => setDateRange(value)} modeState={dateMode} onModeChange={setDateMode} />
                            <Checkbox icon={<PercentIcon />} isSelected={isPercentage} onValueChange={setIsPercentage}>แสดงผล %</Checkbox>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}

export default topController