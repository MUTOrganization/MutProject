import { Avatar, Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react'
import React from 'react'
import { FaRunning } from 'react-icons/fa'

function ChatGroupInfo({ isOpen, onOpenChange }) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>รายละเอียดกลุ่ม</ModalHeader>
                <ModalBody className='flex flex-col items-center justify-center space-y-4 py-8'>
                    <div className='space-y-4'>
                        <Avatar name='C' className='w-28 h-28 text-4xl font-bold bg-emerald-200 text-white text-emerald-600' />
                        <div className='text-slate-500'>SOME GROUP</div>
                    </div>
                    <div className='flex flex-col space-y-2 items-center justify-center'>
                        <span className='text-slate-600'>รายละเอียดกลุ่ม</span>
                        <span className='text-slate-400'>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat esse perferendis rem distinctio, laboriosam sequi?
                        </span>
                    </div>
                    <div className='border-1 border-slate-200 w-full h-0.5'></div>
                    <div className='w-full bg-red-200 text-red-500 rounded-md p-2 flex flex-row justify-between items-center px-3 cursor-pointer hover:bg-red-500 hover:text-white transition-all duration-300'>
                        <span>ออกจากกลุ่ม</span>
                        <span><FaRunning /></span>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default ChatGroupInfo
