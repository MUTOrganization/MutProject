import { Input, Tooltip } from '@heroui/react'
import React, { useEffect, useState } from 'react'
import { FaBan, FaInfo, FaInfoCircle, FaSearch, FaUserPlus } from 'react-icons/fa'
import ChatGroupInfo from './ChatGroupInfo'
import ConfirmBlockMemberModal from './ConfirmBlockMemberModal'
import AddMember from './AddMember'

function MemberChat({ isPrivateChat }) {

    // For Private Chat
    const [isOpenConfirmBlockMember, setIsOpenConfirmBlockMember] = useState(false)

    // For Group Chat
    const [isOpenSearchMember, setIsOpenSearchMember] = useState(false)
    const [isOpenChatGroupInfo, setIsOpenChatGroupInfo] = useState(false)
    const [isOpenInviteMember, setIsOpenInviteMember] = useState(false)

    // ปิด Search เวลาไปแถบ แชทส่วนตัว
    useEffect(() => {
        setIsOpenSearchMember(false)
    }, [isPrivateChat])

    return (
        <>
            <div className='w-full h-full'>
                {/* Controller Chat For Private Chat && Group Chat */}
                {isPrivateChat ? (
                    <header className='flex flex-row justify-between items-center border-1 border-slate-200 py-2 px-4 rounded-md shadow-md'>
                        <span className='text-slate-500'>MemberName</span>
                        <Tooltip content='บล็อค'>
                            <span className='cursor-pointer' onClick={() => setIsOpenConfirmBlockMember(true)}><FaBan className='text-red-500' size='18px' /></span>
                        </Tooltip>
                    </header>
                ) : (
                    <header className='flex flex-row justify-between items-center border-1 border-slate-200 py-2 px-4 rounded-md relative'>
                        <span className='text-slate-500'>Group Name (จำนวน)</span>
                        <div className='flex flex-row justify-center items-center space-x-4 '>
                            <Tooltip content='ค้นหารายชื่อ' color='primary' className='text-white'>
                                <div onClick={() => setIsOpenSearchMember(!isOpenSearchMember)} className='cursor-pointer'><FaSearch className='text-blue-500' size='18px' /></div>
                            </Tooltip>
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
                <div className='bg-slate-100 w-full h-full p-4 flex flex-row justify-center items-center'>
                    <span className='text-slate-500'>Chat</span>
                </div>
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

export default MemberChat
