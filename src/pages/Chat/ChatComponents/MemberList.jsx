import { Button, Input, Tab, Tabs, useDisclosure } from '@heroui/react'
import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import CreateGroupChat from './CreateGroupChat';

function MemberList({ setIsPrivateChat }) {

    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [isOpenModalAddMember, setIsOpenModalAddMember] = useState(false)

    return (
        <div className='w-9/12'>
            <Input placeholder='ค้นหาผู้ใช้' className='w-full' size='sm' />
            <div className='flex flex-row justify-between items-start py-6'>
                <div>
                    <Tabs aria-label="Options" radius='full' size='sm' onSelectionChange={(key) => setIsPrivateChat(key === "singleChat")}>
                        <Tab key="singleChat" title="แชทส่วนตัว">
                            <span className='text-sm text-slate-500'>Member List</span>
                        </Tab>
                        <Tab key="groupChat" title="แชทกลุ่ม">
                            <span className='text-sm text-slate-500'>Group List</span>
                        </Tab>
                    </Tabs>
                </div>
                <div>
                    <Button size='sm' onPress={onOpen} className='bg-green-500 text-white px-4'>สร้างกลุ่ม <FaPlus className='' size='10px' /></Button>
                </div>
            </div>

            {
                isOpen && (
                    <CreateGroupChat
                        isOpen={isOpen}
                        onOpenChange={() => { onOpenChange(); setIsOpenModalAddMember(false) }}
                        isOpenModalAddMember={isOpenModalAddMember}
                        setIsOpenModalAddMember={setIsOpenModalAddMember}
                    />
                )
            }

        </div >
    )
}

export default MemberList
