import { Button, Input, Spinner, Tooltip } from '@heroui/react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FaInfoCircle, FaUserPlus } from 'react-icons/fa'
import ChatGroupInfo from '../ChatGroupInfo'
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
    const { currentChatRoom, userMap, chatRooms, setChatRooms, setChatRoomLastReads, insertChatRoom } = useChatContext()
    const { socket } = useSocketContext()
    const isPrivate = selectedTab === 'private'
    const [isLoading, setIsLoading] = useState(false)
    // For Private Chat
    const [isOpenConfirmBlockMember, setIsOpenConfirmBlockMember] = useState(false)

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 30,
        total: 0,
        count: 0
    })

    // For Group Chat
    const [isOpenSearchMember, setIsOpenSearchMember] = useState(false)
    const [isOpenChatGroupInfo, setIsOpenChatGroupInfo] = useState(false)
    const [isOpenInviteMember, setIsOpenInviteMember] = useState(false)

    async function handleStartChat(){
        try{
            setIsLoading(true)
            const room = await chatroomService.createPrivateChatRoom(currentUser.agent.agentId, currentUser.username, selectedUser.username)
            onStartChat(selectedUser)
            
            insertChatRoom(room)

            socket.emit('chat:create:private', {
                username1: currentUser.username,
                username2: selectedUser.username
            })
        }catch(err){
            console.error(err)
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถเริ่มสนทนาได้')
        }finally{
            setIsLoading(false)
        }
    }
    const handleSocketCreatePrivateChatRoom = useCallback((data) => {
        insertChatRoom(data)
        playNotificationSound('message')
    },[currentUser, setChatRooms, socket])
    useSocket('chat:created:private', handleSocketCreatePrivateChatRoom)



    const bottomRef = useRef(null)
    const containerRef = useRef(null)
    /** @param {'instant' | 'smooth'} behavior */
    const scrollToBottom = (behavior = 'instant') => {
        setTimeout(() => {
            bottomRef.current?.scrollIntoView({behavior: behavior})
        }, 0)
    }

    const canLoadMore = useMemo(() => {
        return pagination.count < pagination.total
    }, [pagination])

    const handleScroll = useCallback((e) => {
        const container = e.target
        if (container.scrollTop === 0 && currentChatRoom && canLoadMore && !isLoading) {
            setPagination(prev => ({...prev, page: prev.page + 1}))
        }
    }, [canLoadMore, isLoading, currentChatRoom])

    useEffect(() => {
        const container = containerRef.current
        if (container) {
            container.addEventListener('scroll', handleScroll)
            return () => container.removeEventListener('scroll', handleScroll)
        }
    }, [handleScroll])

    // ดึงข้อมูล messages เมื่อ scroll ไปบนสุด
    useEffect(() => {
        if(currentChatRoom && pagination.page > 1){
            setIsLoading(true)
            chatMessageService.getChatMessages(currentChatRoom.chatRoomId, pagination.page, pagination.limit).then(data => {
                const { data: messages, pagination } = data;
                messages.forEach(message => {
                    message.sender = userMap.get(message.senderUsername)
                })
                setMessages(prev => [...prev, ...messages])
                setPagination(prev => ({...prev, total: pagination.total, count: prev.count + pagination.count}))
                const container = containerRef.current;
                if (container) {
                    const oldScrollHeight = container.scrollHeight;
                    const oldScrollTop = container.scrollTop;
                    
                    // รอให้ DOM อัพเดทก่อน
                    setTimeout(() => {
                        const newScrollHeight = container.scrollHeight;
                        const newScrollTop = newScrollHeight - oldScrollHeight + oldScrollTop;
                        container.scrollTop = newScrollTop;
                    }, 0);
                }
            }).catch(error => {
                console.error(error)
                toastError('ไม่สามารถดึงข้อมูลการแชทได้')
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }, [pagination.page, currentChatRoom, userMap])
    /** @type {[ChatMessage[]]} */
    const [messages, setMessages] = useState([]);
    /** @type {[ChatMessage[]]} */
    const [pendingMessage, setPendingMessage] = useState([]);
    
     // ดึงข้อมูล messages ตอนเปิดห้องแชท
    useEffect(() => {
        if(currentChatRoom){
            setIsLoading(true)
            chatMessageService.getChatMessages(currentChatRoom.chatRoomId, 1, pagination.limit).then(data => {
                const { data: messages, pagination } = data;
                messages.forEach(message => {
                    message.sender = userMap.get(message.senderUsername)
                })
                setMessages(messages)
                setPagination(prev => ({...prev, total: pagination.total, count: pagination.count}))
                scrollToBottom('instant')
            }).catch(error => {
                console.error(error)
                toastError('ไม่สามารถดึงข้อมูลการแชทได้')
            }).finally(() => {
                setIsLoading(false)
            })
        }
    },[currentChatRoom, userMap])

    function saveChatRoomLastReadTime(){
        if(currentChatRoom){
            // บันทึก state
            setChatRoomLastReads(prev => ({...prev, [currentChatRoom.chatRoomId]: new Date()}))

            // บันทึก localStorage
            const chatRoomLastReadsRaw = localStorage.getItem(`chatRoom-last-read-time`)
            const chatRoomLastReads = chatRoomLastReadsRaw ? JSON.parse(chatRoomLastReadsRaw) : {}
            chatRoomLastReads[currentChatRoom.chatRoomId] = new Date().toISOString()
            localStorage.setItem(`chatRoom-last-read-time`, JSON.stringify(chatRoomLastReads))

        }
    }

    // เมื่อเปิดห้องแชท
    useEffect(() => {
        setPagination({ // รีเซ็ตค่า pagination
            page: 1,
            limit: 30,
            total: 0,
            count: 0
        })
        saveChatRoomLastReadTime() // บันทึกข้อมูลการอ่านข้อความล่าสุด 

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
        setPagination(prev => ({...prev, total: prev.total + 1, count: prev.count + 1}))
        scrollToBottom('smooth')

        // อัพเดทข้อความล่าสุด และเรียงลำดับห้องแชทใหม่
        const chatRoomsCopy = [...chatRooms]
        const chatRoom = chatRoomsCopy.find(room => room.chatRoomId === currentChatRoom.chatRoomId)
        chatRoom.lastMessage = newMessage
        setChatRooms(chatRoomsCopy)

        saveChatRoomLastReadTime()
    }

    // เมื่อ server แจ้งการส่งข้อความเสร็จสิ้น จะทำการอัพเดตสถานะของข้อความที่ส่งไปเป็น false และเปลี่ยน id ของข้อความเป็น id จริง
    const chatReceiveMessageHandler = useCallback((data) => {
        const { roomId, message, pendingMessageId } = data

        if(Number(roomId) === Number(currentChatRoom?.chatRoomId)){ // ถ้าข้อความที่แจ้ง อยู่ในห้องแชทที่กำลังดูอยู่
            if(message.senderUsername === currentUser.username){ // ถ้าเป็นข้อความที่ส่งจากตัวเอง จะทำการอัพเดท pendingMessage เป็น false , แก้ id เป็น id จริง และลบ pendingMessage ออก
                setMessages(prev => prev.map(m => m.id === pendingMessageId ? {...m, id: `user-${message.userMessageId}`, isPending: false} : m))
                setPendingMessage(prev => prev.filter(m => m.id !== pendingMessageId))
                
                saveChatRoomLastReadTime()
            }else{ // ถ้าเป็นข้อความที่ส่งจากคนอื่น จะทำการเพิ่มข้อความเข้าไปใน messages และ scroll to bottom 
                const newMessage = ChatMessage.fromUserMessage(message)
                setMessages(prev => [newMessage, ...prev])
                setPagination(prev => ({...prev, total: prev.total + 1, count: prev.count + 1}))
                scrollToBottom('smooth')
                saveChatRoomLastReadTime()
            }
        }


        // ไม่สนว่าข้อความนี้อยู่ในห้องแชทที่กำลังดูอยู่หรือไม่ จะทำการอัพเดท lastMessage ใน ChatList 
        if(message.senderUsername === currentUser.username){ 
            const newMessage = ChatMessage.fromUserMessage(message)
            setChatRooms(prev => 
                prev.map(room => room.chatRoomId === newMessage.roomId 
                    ? {...room, lastMessage: newMessage} 
                    : room
                )
            )
        }else{
            const newMessage = ChatMessage.fromUserMessage(message)
            const chatRoomsCopy = [...chatRooms]
            const chatRoom = chatRoomsCopy.find(room => room.chatRoomId === newMessage.roomId)
            chatRoom.lastMessage = newMessage
            setChatRooms(chatRoomsCopy)
        }

        // ถ้าไม่ใช่ห้องแชทที่กำลังดูอยู่ จะเปิดเสียงแจ้งเตือน
        if(currentChatRoom?.chatRoomId !== roomId){
            playNotificationSound()
        }
    },[currentChatRoom, userMap, pendingMessage, messages, chatRooms])
    useSocket('chat:receive:message', chatReceiveMessageHandler)

    const handleSocketReceiveSystemMessage = useCallback((data) => {
        const newMessage = ChatMessage.fromSystemMessage(data);
        if(Number(newMessage.roomId) === Number(currentChatRoom?.chatRoomId)){ // ถ้าข้อความที่แจ้ง อยู่ในห้องแชทที่กำลังดูอยู่
            setMessages(prev => [newMessage, ...prev])
            setPagination(prev => ({...prev, total: prev.total + 1, count: prev.count + 1}))
            scrollToBottom('smooth')
        }
    }, [currentChatRoom, setMessages, setPagination])
    useSocket('chat:received:system_message', handleSocketReceiveSystemMessage);


    const [roomInvites, setRoomInvites] = useState([]);

    useEffect(() => {
        if(currentChatRoom){
            chatroomService.getRoomInvitesByChatRoomId(currentChatRoom.chatRoomId).then((data) => {
                setRoomInvites(data);
            }).catch((error) => {
                console.log(error);
                toastError('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลการเชิญ');
            })
        }
    }, [currentChatRoom])

    async function handleInviteMember(user, type = 'member'){
        try{
            const invite = await chatroomService.createRoomInvite(currentChatRoom.chatRoomId, user.username, type === 'admin');
            setRoomInvites(prev => [...prev, invite]);
        }catch(err){
            console.error(err);
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถเชิญสมาชิกได้');
        }
    }



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
                    name: `${currentChatRoom.name} (${currentChatRoom.roomMembers.length})`,
                    imageFallback: currentChatRoom.name,
                    imageUrl: currentChatRoom.imageUrl,
                }
            }
        }else{
            if(currentChatRoom.isPrivate){
                const member = currentChatRoom.roomMembers.find(member => member.username !== currentUser.username)
                return {
                    name: member.name,
                    imageFallback: member.name,
                    imageUrl: member.displayImgUrl,
                }
            }else{
                return {
                    name: `${currentChatRoom.name} (${currentChatRoom.roomMembers.length})`,
                    imageFallback: currentChatRoom.name,
                    imageUrl: currentChatRoom.imageUrl,
                }
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
                
                {
                (!currentChatRoom || currentChatRoom.isPrivate) ? (
                    <header className='flex flex-row justify-between items-center border-1 border-slate-200 py-2 px-4 rounded-md shadow-sm'>
                        <div className='flex flex-row justify-center items-center space-x-2'>
                            <div>
                                <UserProfileAvatar name={roomInfo.imageFallback} imageURL={roomInfo.imageUrl} />
                            </div>
                            <span className='text-slate-500'>{roomInfo.name}</span>
                        </div>
                    </header>
                ) : (
                    <header className='flex flex-row justify-between items-center border-1 border-slate-200 py-2 px-4 rounded-md relative'>
                        <span className='text-slate-500'>{roomInfo.name}</span>
                        <div className='flex flex-row justify-center items-center space-x-4 '>
                            {/* <Tooltip content='ค้นหารายชื่อ' color='primary' className='text-white'>
                                <div onClick={() => setIsOpenSearchMember(!isOpenSearchMember)} className='cursor-pointer'><FaSearch className='text-blue-500' size='18px' /></div>
                            </Tooltip> */}
                            <Tooltip content='เชิญเข้ากลุ่ม' color='success' className='text-white'>
                                <div className='cursor-pointer' onClick={() => setIsOpenInviteMember(true)}><FaUserPlus className='text-green-500' size='18px' /></div>
                            </Tooltip>
                            <Tooltip content='รายละเอียดกลุ่ม' color='warning' className='text-white'>
                                <div className='cursor-pointer' onClick={() => setIsOpenChatGroupInfo(true)}><FaInfoCircle className='text-yellow-500' size='18px' /></div>
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
                            <div ref={containerRef} className='flex-1 w-full overflow-y-auto px-2'>
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
                    onClose={() => setIsOpenChatGroupInfo(false)}
                />
            )}

            {isOpenInviteMember && (
                <AddMember
                    isOpen={isOpenInviteMember}
                    onClose={() => setIsOpenInviteMember(false)}
                    members={currentChatRoom.roomMembers}
                    roomInvites={roomInvites}
                    onAddMember={handleInviteMember}
                />
            )}
        </>
    )
}
