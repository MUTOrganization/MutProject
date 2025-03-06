import { Progress, Switch } from '@nextui-org/react'
import React, { useState } from 'react'
import OKRByMonth from './OKRByMonth'
import OKRByYear from './OKRByYear';
import ModalAddTask from './ModalAddTask';

function Box2({ isSwitch, setIsSwitch }) {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='w-full bg-white p-5 border-2 border-slate-100 rounded-md h-full'>

            {/* Action button */}
            <div className={`flex flex-row items-center mb-8 space-x-4 ${!isSwitch ? 'justify-between' : 'justify-end'}`}>
                {!isSwitch && (
                    <div onClick={() => setIsOpen(true)} className='px-5 py-1 bg-green-100 text-green-500 rounded-md text-sm cursor-pointer hover:bg-green-200'>
                        <span>เพิ่มความคืบหน้า</span>
                    </div>
                )}
                <Switch isSelected={isSwitch} onValueChange={setIsSwitch} aria-label="Automatic updates" />
            </div>

            {isSwitch ? <OKRByYear /> : <OKRByMonth />}
            {isOpen &&
                <ModalAddTask
                    isOpen={isOpen}
                    setIsOpen={() => setIsOpen(false)}
                />}
        </div>
    )
}

export default Box2
