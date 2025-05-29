import React, { useEffect, useState } from 'react'
import ChatBody from './ChatBody';
import { MessageSquareText } from 'lucide-react';

function FloatingButton() {

    // ตัวเปิด Modal
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);


    // Modal HeroUI มันพอปิดแล้ว Modal ไม่ยอมปิดจริง อันนี้เอาไว้เช็คว่าถ้าเป็น null จะไม่แสดง ChatBody
    useEffect(() => {
        if (isOpen) {
            setIsOpen2(true)
        }else{
            setTimeout(() => {
                setIsOpen2(false)
            }, 300);
        }
    }, [isOpen])

    return (
        <>
            <div className='fixed bottom-8 right-8 z-50'>
                <button onClick={() => setIsOpen(true)} className="bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 p-4">
                    <MessageSquareText size={30} />
                </button>
            </div>
            
            { isOpen2 && <ChatBody isOpen={isOpen} onClose={() => setIsOpen(false)}  /> }
        </>
    )
}

export default FloatingButton
