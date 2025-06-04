import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal'
import React, { useEffect, useState } from 'react'
import ChatList from './ChatComponents/ChatList'
import ChatBox from './ChatComponents/ChatBox/ChatBox'
import { useChatContext } from './ChatContext'
import chatroomService from '@/services/chatroomService'
import { useAppContext } from '@/contexts/AppContext'
import { toastError } from '@/component/Alert'

export default function ChatBody({ isOpen, onClose = () => {} }) {
    const { currentUser } = useAppContext()
    const [selectedTab, setSelectedTab] = useState('history')
    const { currentChatRoom, setCurrentChatRoom } = useChatContext()
    const [selectedUser, setSelectedUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    async function fetchPrivateChatRoom(username){
        try{
            setIsLoading(true)
            const chatRoom = await chatroomService.getPrivateChatRoom(currentUser.username, username)
            setCurrentChatRoom(chatRoom)
        }catch(err){
            console.error(err)
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลห้องแชทได้')
        }finally{
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if(selectedUser && selectedTab === 'private'){
            fetchPrivateChatRoom(selectedUser.username)
        }
    }, [selectedUser])

    async function handleStartChat(selectedUser){
        await fetchPrivateChatRoom(selectedUser.username)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} isDismissable={false} isKeyboardDismissDisabled={true}>
            <ModalContent className="w-full max-w-7xl h-[80vh]">
                <ModalHeader className='text-slate-600'>แชท</ModalHeader>
                <ModalBody className='flex flex-row justify-between items-start overflow-auto'>
                    <div className='flex grow max-w-[1300px]'>
                        {/* list ห้องแชท */}
                        <div className='w-[320px] h-full'>
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
                        <div className='flex-1 max-w-[900px] h-full'>
                            <ChatBox selectedTab={selectedTab} selectedUser={selectedUser} onStartChat={() => handleStartChat(selectedUser)}/>
                        </div>
                    </div>


                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
