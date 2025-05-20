import { Tooltip } from '@heroui/react'
import React from 'react'
import { FaBan } from 'react-icons/fa'

function MemberChat() {
    return (
        <div className='w-full h-full'>
            <header className='flex flex-row justify-between items-center border-1 border-slate-200 py-2 px-4 rounded-md shadow-md'>
                <span className='text-slate-500'>MemberName</span>
                <Tooltip content='บล็อค'>
                    <span className='cursor-pointer'><FaBan className='text-red-500' size='18px' /></span>
                </Tooltip>
            </header>
            <div className='bg-slate-100 w-full h-full p-4 flex flex-row justify-center items-center'>
                <span className='text-slate-500'>Chat</span>
            </div>
        </div>
    )
}

export default MemberChat
