import { Button, Input, Spinner, Textarea, Tooltip } from '@heroui/react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FaBan, FaInfo, FaInfoCircle, FaPaperclip, FaSearch, FaUserPlus } from 'react-icons/fa'
import ChatGroupInfo from '../ChatGroupInfo'
import ConfirmBlockMemberModal from '../ConfirmBlockMemberModal'
import AddMember from '../AddMember'
import { useChatContext } from '../../ChatContext'
import { useAppContext } from '@/contexts/AppContext'
import UserProfileAvatar from '@/component/UserProfileAvatar'
import { toastError } from '@/component/Alert'
import chatroomService from '@/services/chatroomService'
import ChatMessageBox from './ChatMessageBox'
import MessageInput from './MessageInput'
import { ChatMessage } from '@/models/chatMessage'
import chatMessageService from '@/services/chatMessageService'
import { useSocketContext } from '@/contexts/SocketContext'
import useSocket from '@/component/hooks/useSocket'
import { playNotificationSound } from '@/utils/soundFunc'

export default function ChatBox({selectedTab, selectedUser, onStartChat}) {
    const { currentUser } = useAppContext()
    const { currentChatRoom, userMap, chatRooms, setChatRooms, chatRoomLastReads, setChatRoomLastReads } = useChatContext()
    const { socket } = useSocketContext()
    const isPrivate = selectedTab === 'private'
    const [isLoading, setIsLoading] = useState(false)
    // For Private Chat
    const [isOpenConfirmBlockMember, setIsOpenConfirmBlockMember] = useState(false)

    // For Group Chat
    const [isOpenSearchMember, setIsOpenSearchMember] = useState(false)
    const [isOpenChatGroupInfo, setIsOpenChatGroupInfo] = useState(false)
    const [isOpenInviteMember, setIsOpenInviteMember] = useState(false)


    const privateUser = useMemo(() => {
        if(isPrivate && currentChatRoom){
            const member = currentChatRoom.roomMembers.find(member => member.username !== currentUser.username)
            return member
        }
        return null
    },[currentUser, currentChatRoom])

    

    async function handleStartChat(){
        try{
            setIsLoading(true)
            await chatroomService.createPrivateChatRoom(currentUser.agent.agentId, currentUser.username, selectedUser.username)
            onStartChat(selectedUser)
        }catch(err){
            console.error(err)
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถเริ่มสนทนาได้')
        }finally{
            setIsLoading(false)
        }
    }



    const bottomRef = useRef(null)
    /** @param {'instant' | 'smooth'} behavior */
    const scrollToBottom = (behavior = 'instant') => {
        setTimeout(() => {
            bottomRef.current?.scrollIntoView({behavior: behavior})
        }, 0)
    }


    /** @type {[ChatMessage[]]} */
    const [messages, setMessages] = useState([]);
    /** @type {[ChatMessage[]]} */
    const [pendingMessage, setPendingMessage] = useState([]);
    useEffect(() => {
        if(currentChatRoom){
            setIsLoading(true)
            chatMessageService.getChatMessages(currentChatRoom.chatRoomId).then(messages => {
                messages.forEach(message => {
                    message.sender = userMap.get(message.senderUsername)
                })
                setMessages(messages)
                scrollToBottom('instant')
            }).catch(error => {
                console.error(error)
                toastError('ไม่สามารถดึงข้อมูลการแชทได้')
            }).finally(() => {
                setIsLoading(false)
            })
        }
    },[currentChatRoom, userMap])

    useEffect(() => {
        if(currentChatRoom){
            const chatRoomLastReadsRaw = localStorage.getItem(`chatRoom-last-read-time`)
            const chatRoomLastReads = chatRoomLastReadsRaw ? JSON.parse(chatRoomLastReadsRaw) : {}
            chatRoomLastReads[currentChatRoom.chatRoomId] = new Date().toISOString()
            localStorage.setItem(`chatRoom-last-read-time`, JSON.stringify(chatRoomLastReads))
        }
    }, [currentChatRoom])

    // function สำหรับเมื่อกดส่งข้อความแล้ว จะ mock ข้อความที่ส่งไปก่อนและขึ้นสถานะกำลังส่ง
    const handleSendMessage = (text) => {
        const pendingMessageId = `pending-${pendingMessage.length + 1}`
        socket?.emit('chat:send:message', {
            text,
            roomId: currentChatRoom.chatRoomId,
            pendingMessageId: `user-${pendingMessageId}`
        })
        const newMessage = new ChatMessage({
            id: pendingMessageId,
            roomId: currentChatRoom.chatRoomId,
            sender: currentUser,
            senderUsername: currentUser.username,
            text: text,
            createdDate: new Date(),
            updatedDate: new Date(),
            isPending: true,
            source: 'user'
        })
        setMessages(prev => [newMessage, ...prev])
        setPendingMessage(prev => [newMessage, ...prev])
        scrollToBottom('smooth')

        // อัพเดทข้อความล่าสุด และเรียงลำดับห้องแชทใหม่
        const chatRoomsCopy = [...chatRooms]
        const chatRoom = chatRoomsCopy.find(room => room.chatRoomId === currentChatRoom.chatRoomId)
        chatRoom.lastMessage = newMessage
        chatRoomsCopy.sort((a, b) => {
            if(!a.lastMessage && !b.lastMessage) return 0;
            if(!a.lastMessage) return 1;
            if(!b.lastMessage) return -1;
            return new Date(b.lastMessage?.createdDate) - new Date(a.lastMessage?.createdDate);
        })
        setChatRooms(chatRoomsCopy)

        setChatRoomLastReads(prev => ({...prev, [currentChatRoom.chatRoomId]: newMessage.createdDate}))
    }
    // console.log(messages);
    // เมื่อ server แจ้งการส่งข้อความเสร็จสิ้น จะทำการอัพเดตสถานะของข้อความที่ส่งไปเป็น false และเปลี่ยน id ของข้อความเป็น id จริง
    const chatReceiveMessageHandler = useCallback((data) => {
        const { roomId, message, pendingMessageId } = data
        if(Number(roomId) === Number(currentChatRoom.chatRoomId)){
            if(message.senderUsername === currentUser.username){
                setMessages(prev => prev.map(m => m.id === pendingMessageId ? {...m, id: `user-${message.userMessageId}`, isPending: false} : m))
                setPendingMessage(prev => prev.filter(m => m.id !== pendingMessageId))
            }else{
                const newMessage = ChatMessage.fromUserMessage(message)
                setMessages(prev => [newMessage, ...prev])
                scrollToBottom('smooth')
            }
        }

        if(message.senderUsername === currentUser.username){
            setChatRooms(prev => 
                prev.map(room => room.chatRoomId === currentChatRoom.chatRoomId 
                    ? {...room, lastMessage: { ...room.lastMessage, id: `user-${message.userMessageId}`}} 
                    : room
                )
            )
        }else{
            const newMessage = ChatMessage.fromUserMessage(message)
            const chatRoomsCopy = [...chatRooms]
            const chatRoom = chatRoomsCopy.find(room => room.chatRoomId === newMessage.roomId)
            chatRoom.lastMessage = newMessage
            chatRoomsCopy.sort((a, b) => {
                if(!a.lastMessage && !b.lastMessage) return 0;
                if(!a.lastMessage) return 1;
                if(!b.lastMessage) return -1;
                return new Date(b.lastMessage?.createdDate) - new Date(a.lastMessage?.createdDate);
            })
            setChatRooms(chatRoomsCopy)
        }
    },[currentChatRoom, userMap, pendingMessage, messages, chatRooms])
    useSocket('chat:receive:message', chatReceiveMessageHandler)


    const roomInfo = useMemo(() => {
        if(!currentChatRoom && selectedUser && selectedTab === 'private'){
            return {
                name: selectedUser.name,
                imageFallback: selectedUser.username,
                imageUrl: selectedUser.displayImgUrl,
            }
        }
        if(!currentChatRoom) return null;
        if(selectedTab === 'private'){
            if(currentChatRoom && currentChatRoom.isPrivate) {
                const member = currentChatRoom.roomMembers.find(member => member.username !== currentUser.username)
                return {
                    name: member.name,
                    imageFallback: member.name,
                    imageUrl: member.displayImgUrl,
                }
            }else{
                return {
                    name: currentChatRoom.name,
                    imageFallback: currentChatRoom.name,
                    imageUrl: currentChatRoom.imageUrl,
                }
            }
        }else{
            return {
                name: currentChatRoom.name,
                imageFallback: currentChatRoom.name,
                imageUrl: currentChatRoom.imageUrl,
            }
        }
    }, [currentChatRoom, selectedTab, selectedUser])

    if(!currentChatRoom && (!isPrivate || !selectedUser)){ //ถ้า currentChatRoom ไม่มี จะแสดง แต่ถ้าเป็น private จะต้องไม่มี selectedUser ถึงจะแสดง
        return (
            <div className='w-full h-full flex flex-row justify-center items-center'>
                <span className='text-slate-500'>กรุณาเลือกห้องแชท</span>
            </div>
        )
    }

    return (
        <>
            <div className='w-full h-full relative flex flex-col'>
                {/* Controller Chat For Private Chat && Group Chat */}
                {isPrivate ? (
                    <header className='flex flex-row justify-between items-center border-1 border-slate-200 py-2 px-4 rounded-md shadow-sm'>
                        <div className='flex flex-row justify-center items-center space-x-2'>
                            <div>
                                <UserProfileAvatar name={roomInfo.imageFallback} imageURL={roomInfo.imageUrl} />
                            </div>
                            <span className='text-slate-500'>{roomInfo.name}</span>
                        </div>
                        <Tooltip content='บล็อค'>
                            <span className='cursor-pointer' onClick={() => setIsOpenConfirmBlockMember(true)}><FaBan className='text-red-500' size='18px' /></span>
                        </Tooltip>
                    </header>
                ) : (
                    <header className='flex flex-row justify-between items-center border-1 border-slate-200 py-2 px-4 rounded-md relative'>
                        <span className='text-slate-500'>Group Name (จำนวน)</span>
                        <div className='flex flex-row justify-center items-center space-x-4 '>
                            {/* <Tooltip content='ค้นหารายชื่อ' color='primary' className='text-white'>
                                <div onClick={() => setIsOpenSearchMember(!isOpenSearchMember)} className='cursor-pointer'><FaSearch className='text-blue-500' size='18px' /></div>
                            </Tooltip> */}
                            <Tooltip content='รายละเอียดกลุ่ม' color='warning' className='text-white'>
                                <div className='cursor-pointer' onClick={() => setIsOpenChatGroupInfo(true)}><FaInfoCircle className='text-yellow-500' size='18px' /></div>
                            </Tooltip>
                            <Tooltip content='เชิญเข้ากลุ่ม' color='success' className='text-white'>
                                <div className='cursor-pointer' onClick={() => setIsOpenInviteMember(true)}><FaUserPlus className='text-green-500' size='18px' /></div>
                            </Tooltip>
                        </div>
                        {isOpenSearchMember && (
                            <div className='absolute w-full -bottom-10 left-0 rounded-md bg-white shadow-md'>
                                <Input placeholder='ชื่อสมาชิก' className='w-full' radius='none' />
                            </div>
                        )}
                    </header>
                )}

                {/* Chat Body */}
                <div className=' w-full h-[580px] flex flex-row justify-center items-center'>
                    {
                        (isPrivate && !currentChatRoom) ? 
                        <div>
                            <div className='w-full h-full flex flex-row justify-center items-center'>
                                <Button color='primary' onPress={() => handleStartChat()}>
                                    เริ่มสนทนา
                                </Button>
                            </div>
                        </div>
                        :
                        <div className='w-full h-full relative flex flex-col justify-end items-center'>
                            <div className='flex-1 w-full overflow-y-auto px-2'>
                                <div className='w-full h-full content-end '>
                                    <ChatMessageBox messages={messages} setMessages={setMessages} />
                                    <div ref={bottomRef} />
                                </div>
                            </div>
                            <div className='w-full'>
                                <MessageInput onSendMessage={handleSendMessage} />
                            </div>
                        </div>
                    }
                </div>


                {isLoading && (
                    <div className='w-full h-full flex flex-row justify-center items-center absolute top-0 left-0'>
                        <Spinner aria-label="Loading..." size="lg" color="primary" className="" />
                    </div>
                )}
            </div>


            {isOpenChatGroupInfo && (
                <ChatGroupInfo
                    isOpen={isOpenChatGroupInfo}
                    onOpenChange={() => setIsOpenChatGroupInfo(false)}
                />
            )}

            {isOpenConfirmBlockMember && (
                <ConfirmBlockMemberModal
                    isOpen={isOpenConfirmBlockMember}
                    onOpenChange={() => setIsOpenConfirmBlockMember(false)}
                />
            )}

            {isOpenInviteMember && (
                <AddMember
                    isOpen={isOpenInviteMember}
                    onOpenChange={() => setIsOpenInviteMember(false)}
                />
            )}
        </>
    )
}
