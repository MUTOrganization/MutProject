import React, { useState } from 'react'
import ViewpersonalBox1 from './ViewpersonalBox1'
import ViewPersonalBox2 from './ViewPersonalBox2'


function ViewPersonalOKR({ handleViewUserOKR }) {

    const thisYear = new Date().getFullYear()
    const firstYear = 2019
    const [selectYear, setSelectYear] = useState(thisYear)
    const [isSwitch, setIsSwitch] = useState(false)


    return (
        <div className='w-full flex flex-row items-start bg-slate-50 rounded-md p-4 space-x-4 h-full'>
            <ViewpersonalBox1 thisYear={thisYear} firstYear={firstYear} selectYear={selectYear} setSelectYear={setSelectYear} isSwitch={isSwitch} />
            <ViewPersonalBox2 isSwitch={isSwitch} setIsSwitch={setIsSwitch} handleViewUserOKR={handleViewUserOKR} />
        </div>
    )
}

export default ViewPersonalOKR
