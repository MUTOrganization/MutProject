import { useDisclosure } from '@heroui/react';
import React, { useEffect, useState } from 'react'
import { FaFacebookMessenger } from 'react-icons/fa'
import ChatBody from './ChatBody';
import { MessageSquare, MessageSquareText } from 'lucide-react';

function FloatingButton() {

    // ตัวเปิด Modal
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // เอาไว้เช็คว่าเป็นแชท กลุ่ม หรือ ส่วนตัว
    const [isPrivateChat, setIsPrivateChat] = useState(null)

    // Modal HeroUI มันพอปิดแล้ว Modal ไม่ยอมปิดจริง อันนี้เอาไว้เช็คว่าถ้าเป็น null จะไม่แสดง ChatBody
    useEffect(() => {
        if (isOpen) {
            setIsPrivateChat('singleChat')
        }
    }, [isOpen])

    return (
        <>
            <div className='fixed bottom-8 right-8 z-50'>
                <button onClick={onOpen} className="bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 p-4">
                    <MessageSquareText size={30} />
                </button>
            </div>
            {isPrivateChat !== null && (
                <ChatBody isOpen={isOpen} onOpenChange={() => { onOpenChange(); setIsPrivateChat(null) }} isPrivateChat={isPrivateChat} setIsPrivateChat={setIsPrivateChat} />
            )}
        </>
    )
}

export default FloatingButton
