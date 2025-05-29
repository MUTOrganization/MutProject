import { Button, Input, Tab, Tabs, Tooltip } from '@heroui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import CreateGroupChat from './CreateGroupChat';
import { useSocketContext } from '@/contexts/SocketContext';
import PrivateChatTab from './ChatListTabs/PrivateChatTab';
import { useChatContext } from '../ChatContext';
import { PlusIcon } from 'lucide-react';

export default function ChatList({ selectedTab, setSelectedTab, selectedUser, setSelectedUser }) {
    const { currentChatRoom, setCurrentChatRoom } = useChatContext();
    const [isOpen, setIsOpen] = useState(false);
    
    
    function handleSelectUser(user){
        setSelectedUser(user)
    }

    function handleSelectRoom(room){
        setCurrentChatRoom(room)
        setSelectedUser(null)
    }
    
    return (
        <div className='w-full'>
            <Input placeholder='ค้นหาผู้ใช้' className='w-full lg:max-w-80' size='sm' variant='bordered' />
            <div className='flex flex-row justify-between items-start py-6'>
                <div className='w-full'>
                    <Tabs aria-label="Options" radius='full' size='sm' selectedKey={selectedTab} onSelectionChange={setSelectedTab}>
                        <Tab key="history" title="แชทล่าสุด">
                            <span className='text-sm text-slate-500'>History List</span>
                        </Tab>
                        <Tab key="private" title="แชทส่วนตัว">
                            <PrivateChatTab selectedUser={selectedUser} onSelectUser={handleSelectUser}/>
                        </Tab>
                        <Tab key="group" title="แชทกลุ่ม">
                            <span className='text-sm text-slate-500'>Group List</span>
                        </Tab>
                    </Tabs>
                </div>
                <div>
                    {
                    selectedTab === 'group' && 
                    <Tooltip>
                        <Button isIconOnly size='sm' onPress={() => setIsOpen(true)} className='bg-green-500 text-white'><PlusIcon size={20} /></Button>
                    </Tooltip>
                    }
                </div>
            </div>

            {
                <CreateGroupChat
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                />
            }

        </div >
    )
}
