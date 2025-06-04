import {  Button, Input, Textarea, Tooltip } from '@heroui/react'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal'
import React, { useRef, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import AddMember from './AddMember';
import ImageInput from '@/component/ImageInput';
import { useAppContext } from '@/contexts/AppContext';
import UserProfileAvatar from '@/component/UserProfileAvatar';
import { Trash, UserCog, UserRoundCog } from 'lucide-react';
import chatroomService from '@/services/chatroomService';
import { toastError, toastSuccess, toastWarning } from '@/component/Alert';

function CreateGroupChat({ isOpen, onClose = () => {}, onSubmit = () => {} }) {
    const { currentUser } = useAppContext();
    const [isOpenModalAddMember, setIsOpenModalAddMember] = useState(false)
    const [editingGroup, setEditingGroup] = useState({
        name: '',
        description: '',
        image: null,
    })
    const [members, setMembers] = useState([
        {
            username: currentUser.username,
            name: currentUser.name,
            displayImgUrl: currentUser.displayImgUrl,
            type: 'admin',
        }
    ])
    const [isLoading, setIsLoading] = useState(false)

    const handleInputChange = (field, value) => {
        setEditingGroup({ ...editingGroup, [field]: value })
    }

    const handleAddMember = (member, type) => {
        if(members.find((m) => m.username === member.username)) return;
        setMembers([...members, {
            username: member.username,
            name: member.name,
            displayImgUrl: member.displayImgUrl,
            type: type,
        }])
    }

    const handleRemoveMember = (member) => {
        setMembers(members.filter((m) => m.username !== member.username))
    }

    const handleSubmit = async () => {
        try{
            if(editingGroup.name.trim() === '' || editingGroup.description.trim() === ''){
                toastWarning('กรุณากรอกชื่อกลุ่มและรายละเอียดกลุ่ม')
                return;
            }
            setIsLoading(true)
            const newRoom = await chatroomService.createGroupChatRoom(currentUser.agent.agentId, editingGroup.name, editingGroup.description, editingGroup.image, members)
            toastSuccess('สร้างกลุ่มแชทสำเร็จ', 'ส่งคำเชิญเข้าร่วมกลุ่มแชทไปที่ผู้ใช้ที่เลือกแล้ว')
            setEditingGroup({
                name: '',
                description: '',
                image: null,
            })
            setMembers([
                {
                    username: currentUser.username,
                    name: currentUser.name,
                    displayImgUrl: currentUser.displayImgUrl,
                    type: 'admin',
                }
            ])
            onSubmit(newRoom)
            onClose();
        }catch(err){
            console.error(err)
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถสร้างกลุ่มแชทได้')
        }finally{
            setIsLoading(false)
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} isDismissable={false} >
                <ModalContent className={`max-w-3xl transition-all duration-200`}>
                    <ModalHeader className='text-slate-600'>สร้างกลุ่มแชท</ModalHeader>
                    <ModalBody className={`flex flex-row justify-between items-start`}>
                        <div className={`left-side w-full`}>
                            <header className='flex flex-row justify-start items-start w-full'>
                                {/* Image Setting */}
                                <div className='relative w-3/12'>
                                    <ImageInput size='lg' onChange={(file) => handleInputChange('image', file)} />
                                </div>

                                <div className='mt-2 px-4 flex flex-row justify-between items-start w-full'>
                                    <div className='w-10/12 space-y-4'>
                                        <Input aria-label='ชื่อกลุ่ม' placeholder='ชื่อกลุ่ม' size='sm' 
                                            variant='bordered'
                                            value={editingGroup.name}
                                            maxLength={100}
                                            onValueChange={(value) => handleInputChange('name', value)}
                                            validate={(value) => {
                                                if(value.trim() === ''){
                                                    return 'กรุณากรอกชื่อกลุ่ม'
                                                }
                                                return true;
                                            }}
                                        />
                                        <Textarea placeholder='รายละเอียดกลุ่ม' size='sm' variant='bordered' 
                                            value={editingGroup.description}
                                            onValueChange={(value) => handleInputChange('description', value)}
                                            validate={(value) => {
                                                if(value.trim() === ''){
                                                    return 'กรุณากรอกรายละเอียดกลุ่ม'
                                                }
                                                return true;
                                            }}
                                        />
                                    </div>
                                </div>
                            </header>

                            <hr className='my-3' />

                            {/* Invite Members */}
                            <section className='w-full space-y-4'>
                                <header>
                                    <span className='text-slate-500'>สมาชิก ({members.length})</span>
                                </header>
                                <div className='w-full flex flex-row justify-start items-center h-20'>
                                    <div className='flex flex-col justify-center items-center space-y-1'>
                                        <div onClick={() => setIsOpenModalAddMember(true)} className={`p-6 rounded-full bg-slate-100 hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer`}><FaPlus className='text-sm' /></div>
                                        <span className='text-sm'>เพิ่มสมาชิก</span>
                                    </div>
                                    <div className='h-full ms-4 border-l-2 bg-slate-200' />
                                    <div className='ms-4 mt-1 flex'>
                                        {members.map((member) => {
                                            return (
                                                <div key={member.username} className='relative w-20 flex flex-col items-center'>
                                                    <div className='mt-1'>
                                                        <UserProfileAvatar name={member.name} imageURL={member.displayImgUrl} size='lg' />
                                                    </div>
                                                    <span className='text-sm mt-1'>{member.name}</span>
                                                    {
                                                        member.username !== currentUser.username && (
                                                            <div className='absolute top-0 right-0 text-red-500 cursor-pointer rounded-full bg-white p-1 border-1' onClick={() => handleRemoveMember(member)}>
                                                                <Trash size={16} />
                                                            </div>
                                                        )
                                                    }
                                                    {
                                                        member.type === 'admin' && (
                                                            <Tooltip content="แอดมิน">
                                                                <div className='absolute top-0 left-0 bg-white border-1 rounded-full p-1'>
                                                                    <UserCog size={16} />
                                                                </div>
                                                            </Tooltip>
                                                        )
                                                    }
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                            </section>
                        </div>

                       <AddMember isOpen={isOpenModalAddMember} onClose={() => setIsOpenModalAddMember(false)} members={members} onAddMember={handleAddMember} />
                    </ModalBody>
                    <hr />
                    <ModalFooter>
                        <Button size='sm' color='success' className='text-white px-8' isLoading={isLoading} onPress={handleSubmit}>ยืนยัน</Button>
                        <Button size='sm' className='px-8' onPress={onClose}>ยกเลิก</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal >
            
        </>
    )
}

export default CreateGroupChat
