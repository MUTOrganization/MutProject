import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal'
import React, { useEffect, useState } from 'react'
import ChatList from './ChatComponents/ChatList'
import ChatBox from './ChatComponents/ChatBox'
import { useChatContext } from './ChatContext'
import chatroomService from '@/services/chatroomService'
import { useAppContext } from '@/contexts/AppContext'

export default function ChatBody({ isOpen, onClose = () => {} }) {
    const { currentUser } = useAppContext()
    const [selectedTab, setSelectedTab] = useState('history')
    const { currentChatRoom, setCurrentChatRoom } = useChatContext()
    const [selectedUser, setSelectedUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if(selectedUser && selectedTab === 'private'){
            chatroomService.getPrivateChatRoom(currentUser.username, selectedUser.username).then((data) => {
                setCurrentChatRoom(data)
                console.log(data);
            }).catch((err) => {
                console.error(err)
                toastError('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลห้องแชทได้')
            })
        }
    }, [selectedUser])

    return (
        <Modal isOpen={isOpen} onClose={onClose} isDismissable={false} isKeyboardDismissDisabled={true}>
            <ModalContent className="w-full max-w-7xl h-[80vh]">
                <ModalHeader className='text-slate-600'>แชท</ModalHeader>
                <ModalBody className='flex flex-row justify-between items-start'>

                    {/* list ห้องแชท */}
                    <div className='w-full max-w-[320px] h-full'>
                        <ChatList 
                            selectedTab={selectedTab} 
                            setSelectedTab={setSelectedTab}      
                            selectedUser={selectedUser}
                            setSelectedUser={setSelectedUser}
                        />

                    </div>
                    <div className='w-1 h-full py-8'>
                        <div className='w-full h-full bg-slate-100' />
                    </div>
                    {/* ช่องที่แสดงข้อความ */}
                    <div className='w-full h-full'>
                        <ChatBox isLoading={isLoading}/>
                    </div>

                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
