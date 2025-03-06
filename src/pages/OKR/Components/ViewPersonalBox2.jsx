import { Switch } from '@nextui-org/switch';
import React from 'react'
import ViewOKRMonth from './ViewOKRMonth';
import ViewOKRYear from './ViewOKRYear';

function ViewPersonalBox2({ isSwitch, setIsSwitch, handleViewUserOKR }) {
    return (
        <div className='w-full bg-white p-5 border-2 border-slate-100 rounded-md h-full'>

            {/* Action button */}
            <div className={`flex flex-row items-center mb-8 space-x-4 justify-between`}>
                <div className='cursor-pointer px-8 py-1 rounded-md bg-red-100 text-red-500 text-sm' onClick={handleViewUserOKR}>
                    <span>กลับ</span>
                </div>
                <Switch isSelected={isSwitch} onValueChange={setIsSwitch} aria-label="Automatic updates" />
            </div>

            {!isSwitch ? <ViewOKRMonth /> : <ViewOKRYear />}
        </div>
    )
}

export default ViewPersonalBox2
