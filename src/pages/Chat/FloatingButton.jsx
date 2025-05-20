import { useDisclosure } from '@heroui/react';
import React from 'react'
import { FaFacebookMessenger } from 'react-icons/fa'
import ChatBody from './ChatBody';

function FloatingButton() {

    // ตัวเปิด Modal
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <div className='fixed bottom-8 right-8 z-50'>
                <button onClick={onOpen} className="bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 p-6">
                    <FaFacebookMessenger className='text-2xl' />
                </button>
            </div>
            <ChatBody isOpen={isOpen} onOpenChange={onOpenChange} />
        </>
    )
}

export default FloatingButton
