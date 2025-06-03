import UserProfile from '@/component/UserProfile';
import { Avatar, Button, Input } from '@heroui/react'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal'
import { Select, SelectItem } from "@nextui-org/select"
import React, { useEffect, useMemo, useState } from 'react'
import { useChatContext } from '../ChatContext';
import Fuse from 'fuse.js'
import { useAppContext } from '@/contexts/AppContext';

function AddMember({ isOpen, onClose = () => {}, members, onAddMember = () => {}, roomInvites = [] }) {
    const { currentUser } = useAppContext();
    const { userList} = useChatContext();
    const [search, setSearch] = useState('');
    

    const invitedMemberMap = useMemo(() => {
        return roomInvites.reduce((acc, invited) => {
            acc[invited.inviteeUsername] = invited;
            return acc;
        }, {})
    }, [roomInvites])
    
    const filteredMembers = useMemo(() => {
        const memberSet = new Set(members.map((member) => member.username))
        return userList.filter((user) => !memberSet.has(user.username))
    }, [members, userList])

    const displayUserList = useMemo(() => {
        if(search.trim() === '') return filteredMembers
        const fuse = new Fuse(filteredMembers, {
            keys: ['username', 'name', 'nickName'],
            threshold: 0.3,
        })
        const result = fuse.search(search)
        return result.map((user) => user.item)
    }, [filteredMembers, search])


    const handleAddMember = (user, type) => {
        onAddMember(user, type)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size='2xl'>
            <ModalContent className="max-h-[80vh] overflow-y-auto">
                <ModalHeader>เพิ่มสมาชิก</ModalHeader>
                <ModalBody>
                    <Input placeholder='ค้นหาสมาชิก' size='sm' variant='bordered' onValueChange={(value) => setSearch(value)} value={search} />
                    <div className='overflow-y-auto max-h-[500px] min-h-[300px]'>
                        {displayUserList.length <= 0 ?
                            <div className='flex flex-row justify-center items-center h-full'>
                                <span className='text-sm text-slate-500'>ไม่พบข้อมูล</span>
                            </div>
                        : displayUserList.map((user) => (
                            <AddMemberItem key={user.username} user={user} 
                                onAddMember={(type) => handleAddMember(user, type)} 
                                isInvited={invitedMemberMap[user.username] ? true : false} 
                            />
                        ))}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button size='sm' className='px-8' color='primary' onPress={onClose}>ปิด</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}


function AddMemberItem({ user, isInvited = false, onAddMember = () => {} }) {
    const [type, setType] = useState('member');

    const handleAddMember = () => {
        onAddMember(type)
    }

    return (
        <div className='rounded-lg p-2 flex flex-row justify-between items-center w-full'>
            <div className='flex flex-row justify-start items-center space-x-2 flex-1 w-[200px]'>
                <UserProfile user={user} />
            </div>
            <div className='w-24 mx-4'>
                <Select aria-label='ประเภทสมาชิก' className='w-full'
                    key={user.username}
                    size='sm'
                    variant='bordered'
                    disallowEmptySelection
                    selectedKeys={[type]}
                    onSelectionChange={(keys) => setType(Array.from(keys)[0])}
                >
                    <SelectItem key='member' value='member'>สมาชิก</SelectItem>
                    <SelectItem key='admin' value='admin'>แอดมิน</SelectItem>
                </Select>
            </div>
            <Button size='sm' color={isInvited ? 'default' : 'primary'} isDisabled={isInvited} onPress={handleAddMember}>{isInvited ? 'เชิญแล้ว' : 'เชิญ'}</Button>
        </div>
    )
}

export default AddMember
