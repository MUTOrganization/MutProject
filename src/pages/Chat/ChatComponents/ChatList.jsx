import { Button, Input, Tab, Tabs, Tooltip } from '@heroui/react'
import React, { useCallback, useEffect, useState } from 'react'
import CreateGroupChat from './CreateGroupChat';
import PrivateChatTab from './ChatListTabs/PrivateChatTab';
import { useChatContext } from '../ChatContext';
import { PlusIcon } from 'lucide-react';
import ChatHistoryTab from './ChatListTabs/ChatHistoryTab';
import { ChatRoom } from '@/models/chatRoom';
import { RoomInvite } from '@/models/roomInvite';
import useSocket from '@/component/hooks/useSocket';
import { playNotificationSound } from '@/utils/soundFunc';
import GroupChatTab from './ChatListTabs/GroupChatTab';
import chatroomService from '@/services/chatroomService';
import { toastError } from '@/component/Alert';

export default function ChatList({ selectedTab, setSelectedTab, selectedUser, setSelectedUser }) {
    const { setCurrentChatRoom, setChatRooms, setRoomInvites, insertChatRoom, roomsReadStatus, roomInvites } = useChatContext();
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState('')
    

    useEffect(() => {
        setSearchText('')
    }, [selectedTab])
    
    function handleSelectUser(user){
        setSelectedUser(user)
    }

    function handleSelectRoom(room){
        setCurrentChatRoom(room)
        setSelectedUser(null)
    }

    function handleCreateGroupChat(room){
        insertChatRoom(room)

        setCurrentChatRoom(room)
        setSelectedUser(null)
    }

    const handleSocketReceiveInvite = useCallback((data) => {
        setRoomInvites(prev => [new RoomInvite(data), ...prev])
        playNotificationSound('invite');
    }, [setRoomInvites])
    useSocket('chat:receive:invite', handleSocketReceiveInvite)

    async function handleAcceptInvite(invite){
        try{
            const room = await chatroomService.acceptRoomInvite(invite.chatRoomId)
            setRoomInvites(prev => prev.filter(i => i.chatRoomId !== invite.chatRoomId))

            insertChatRoom(room)
            setCurrentChatRoom(room)
            setSelectedUser(null)
        }catch(err){
            console.error(err)
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถยอมรับคำเชิญได้')
        }
    }

    const handleSocketJoinGroup = useCallback((data) => {
        try{
            const { user, room } = data;
            setChatRooms(prev => prev.map(r => {
                if(r.chatRoomId === room.chatRoomId){
                    return new ChatRoom(room)
                }
                return r
            }))
        }catch(err) {
            console.error(err)
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถเข้าร่วมกลุ่มแชทได้')
        }

    }, [setChatRooms])
    useSocket('chat:joined:room', handleSocketJoinGroup);

    async function handleRejectInvite(invite){
        await chatroomService.rejectRoomInvite(invite.chatRoomId)
    }
    
    return (
        <div className='w-full'>
            <Input placeholder='ค้นหาผู้ใช้' className='w-full lg:max-w-80' size='sm' variant='bordered' value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            <div className='flex flex-row justify-between items-start py-6 relative'>
                <div className='w-full '>
                    <Tabs aria-label="Options" radius='full' size='sm' selectedKey={selectedTab} onSelectionChange={setSelectedTab}>
                        <Tab key="history" title={
                            <div className='relative'>แชทล่าสุด
                                {
                                    [roomInvites.length + Object.keys(roomsReadStatus).length] > 0 &&
                                    <div className='absolute -top-1 -right-3 rounded-full size-2 bg-red-500'></div>
                                }
                            </div>}>
                            <ChatHistoryTab onSelectChatRoom={handleSelectRoom} searchText={searchText} onAcceptInvite={handleAcceptInvite} onRejectInvite={handleRejectInvite} />
                        </Tab>
                        <Tab key="private" title="แชทส่วนตัว">
                            <PrivateChatTab selectedUser={selectedUser} onSelectUser={handleSelectUser} searchText={searchText}/>
                        </Tab>
                        <Tab key="group" title="แชทกลุ่ม">
                            <GroupChatTab onSelectChatRoom={handleSelectRoom} searchText={searchText} onAcceptInvite={handleAcceptInvite} onRejectInvite={handleRejectInvite} />
                        </Tab>
                    </Tabs>
                    
                </div>
                <div className='absolute top-7 right-0'>
                    {
                    selectedTab === 'group' && 
                    <Tooltip content='สร้างกลุ่มแชท'>
                        <Button isIconOnly size='sm' onPress={() => setIsOpen(true)} className='bg-green-500 text-white'><PlusIcon size={20} /></Button>
                    </Tooltip>
                    }
                </div>
            </div>

            {
                <CreateGroupChat
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onSubmit={handleCreateGroupChat}
                />
            }

        </div >
    )
}
