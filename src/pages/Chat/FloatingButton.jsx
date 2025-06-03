import React, { use, useEffect, useMemo, useState } from 'react'
import ChatBody from './ChatBody';
import { MessageSquareText } from 'lucide-react';
import { useSocketContext } from '@/contexts/SocketContext';
import { playNotificationSound } from '@/utils/soundFunc';
import { useChatContext } from './ChatContext';
import { Badge } from '@heroui/react';

function FloatingButton() {
    // ตัวเปิด Modal
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const { socket } = useSocketContext();
    const { roomsReadStatus, roomInvites, fetchChatRooms } = useChatContext()

    // Modal HeroUI มันพอปิดแล้ว Modal ไม่ยอมปิดจริง อันนี้เอาไว้เช็คว่าถ้าเป็น null จะไม่แสดง ChatBody
    useEffect(() => {
        if (isOpen) {
            setIsOpen2(true)
            fetchChatRooms()
        }else{
            setTimeout(() => {
                setIsOpen2(false)
            }, 300);
        }
    }, [isOpen])


    useEffect(() => {
        if(!socket) return;
        if(!isOpen) {
            socket.on('chat:receive:message', () => {
                playNotificationSound('message');
            })
            socket.on('chat:receive:invite', () => {
                playNotificationSound('invite');
            })
        }else{
            socket.off('chat:receive:message');
            socket.off('chat:receive:invite');
        }
        return () => {
            socket.off('chat:receive:message');
            socket.off('chat:receive:invite');
        }
    },[isOpen, socket])

    const unreadMessageCount = useMemo(() => {
        return Object.values(roomsReadStatus).filter(status => status === true).length + roomInvites.length;
    },[roomsReadStatus, roomInvites])

    return (
        <>
            <div className='fixed bottom-8 right-8 z-50'>
                <div className='relative'>
                    <Badge color='danger' content={unreadMessageCount > 0 ? unreadMessageCount : null} isInvisible={unreadMessageCount === 0}>
                        <button onClick={() => setIsOpen(true)} className="bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 p-4">
                            <MessageSquareText size={30} />
                        </button>
                    </Badge>
                </div>
            </div>
            
            { isOpen2 && <ChatBody isOpen={isOpen} onClose={() => setIsOpen(false)}  /> }
        </>
    )
}

export default FloatingButton
