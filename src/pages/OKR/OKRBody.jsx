import DefaultLayout from '@/layouts/default'
import React, { useState } from 'react'
import Box2 from './Components/Box2'
import Box1 from './Components/Box1'

function OKRBody() {

    const thisYear = new Date().getFullYear()
    const firstYear = 2019
    const [selectYear, setSelectYear] = useState(thisYear)
    const [isSwitch, setIsSwitch] = useState(false)


    return (
        <div className='w-full flex lg:flex-row md:flex-col flex-col items-start bg-slate-50 rounded-md p-4 lg:space-x-4 lg:space-y-0 md:space-y-4 space-y-0 h-full'>
            <Box1 thisYear={thisYear} firstYear={firstYear} selectYear={selectYear} setSelectYear={setSelectYear} isSwitch={isSwitch} />
            <Box2 isSwitch={isSwitch} setIsSwitch={setIsSwitch} />
        </div>
    )
}

export default OKRBody
