import { Avatar, Button, Input, Textarea, Tooltip } from '@heroui/react'
import { Modal, ModalBody, ModalContent, ModalHeader, ModalFooter } from '@nextui-org/modal'
import React, { useEffect, useMemo, useState } from 'react'
import { FaRunning } from 'react-icons/fa'
import { useChatContext } from '../ChatContext';
import { useAppContext } from '@/contexts/AppContext';
import ImageInput from '@/component/ImageInput';
import UserProfileAvatar from '@/component/UserProfileAvatar';
import chatroomService from '@/services/chatroomService';
import { toastError, toastWarning } from '@/component/Alert';
import { Pencil, Trash2, Trash2Icon, UserCog } from 'lucide-react';
import ConfirmDeleteGroupModal from './ConfirmDeleteGroupModal';
import ConfirmLeaveGroupModal from './ConfirmLeaveGroupModal';
import { useSocketContext } from '@/contexts/SocketContext';
import { leaveRoom } from '@/services/socketHandler.js/general';
import { getRoomName } from '../utils';

function ChatGroupInfo({ isOpen, onClose = () => {} }) {
    const { currentUser } = useAppContext();
    const { currentChatRoom, setCurrentChatRoom, setChatRooms } = useChatContext();
    const { socket } = useSocketContext();

    const [isEditingGroupInfo, setIsEditingGroupInfo] = useState(false)
    const [editingGroupInfo, setEditingGroupInfo] = useState({
        name: currentChatRoom.name,
        description: currentChatRoom.description
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isDeletingGroup, setIsDeletingGroup] = useState(false)
    const [isLeavingGroup, setIsLeavingGroup] = useState(false)

    useEffect(() => {
        if(isEditingGroupInfo){
            setEditingGroupInfo({
                name: currentChatRoom.name,
                description: currentChatRoom.description
            })
        }
    }, [isEditingGroupInfo])

    const isAdmin = currentChatRoom.roomMembers.find(member => member.username === currentUser.username)?.isAdmin;

    async function handleChangeImage(file){
        try{    
            setIsLoading(true)
            const room = await chatroomService.changeChatRoomImage(currentChatRoom.chatRoomId, file)
            setCurrentChatRoom(room)
        }catch(err){
            console.error(err)
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถเปลี่ยนรูปภาพได้')
        }finally{
            setIsLoading(false)
        }
    }

    async function handleSaveGroupInfo(){
        try{
            setIsLoading(true)
            const room = await chatroomService.updateGroupChatRoom(currentChatRoom.chatRoomId, editingGroupInfo.name.trim(), editingGroupInfo.description.trim())
            setCurrentChatRoom(room)
            setIsEditingGroupInfo(false)
        }catch(err){
            console.error(err)
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถเปลี่ยนรูปภาพได้')
        }finally{
            setIsLoading(false)
        }
    }

    async function handleLeaveGroup(){
        try{
            const roomId = currentChatRoom.chatRoomId
            if(currentChatRoom.createdBy === currentUser.username){
                toastWarning('ไม่สามารถออกจากกลุ่มได้', 'ผู้สร้างกลุ่มไม่สามารถออกจากกลุ่มได้')
                return
            }
            setIsLoading(true)
            await chatroomService.leaveChatRoom(roomId, currentUser.username)
            setChatRooms(prev => prev.filter(room => room.chatRoomId !== roomId))
            setCurrentChatRoom(null)
            leaveRoom(socket, getRoomName.chatroom(roomId))
            onClose()
        }catch(err){
            console.error(err)
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถออกจากกลุ่มได้')
        }finally{
            setIsLoading(false)
        }
    }


    async function handleDeleteGroup(){
        try{
            const roomId = currentChatRoom.chatRoomId
            setIsLoading(true)
            await chatroomService.deleteChatRoom(roomId)
            setChatRooms(prev => prev.filter(room => room.chatRoomId !== roomId))
            setCurrentChatRoom(null)
            leaveRoom(socket, getRoomName.chatroom(roomId))
            onClose()
        }catch(err){
            console.error(err)
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถลบกลุ่มได้')
        }finally{
            setIsLoading(false)
        }
    }

    const isInfoChanged = useMemo(() => {
        return currentChatRoom.name !== editingGroupInfo.name.trim() || currentChatRoom.description !== editingGroupInfo.description.trim()
    }, [currentChatRoom, editingGroupInfo])
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>รายละเอียดกลุ่ม</ModalHeader>
                <ModalBody className='flex flex-col items-center justify-center space-y-4 py-8'>
                    <div className='space-y-4'>
                        {
                            isAdmin ? (
                                <div>
                                    <ImageInput oldImageUrl={currentChatRoom.imageUrl} size='lg' onChange={(file) => handleChangeImage(file)} isDisabled={isLoading} />
                                </div>
                            ) :
                            (
                                <div className='size-32'>
                                    <img src={currentChatRoom.imageUrl} alt="Preview" className="w-full h-full object-cover rounded-full" />
                                </div>
                            )
                        }
                        <div className='flex justify-center w-full items-center space-x-2'>
                            <div className='text-center font-bold text-2xl'>{currentChatRoom.name}</div>
                            {
                                isAdmin && (
                                    <div className='cursor-pointer' onClick={() => setIsEditingGroupInfo(true)}><Pencil size={16}/></div>
                                )
                            }
                        </div>
                    </div>
                    <div className='flex flex-col space-y-2 justify-center w-full'>
                        <div className='flex flex-row w-full items-center space-x-2'>
                            <span className='text-slate-600 font-bold'>รายละเอียดกลุ่ม</span> 
                            {
                                isAdmin && (
                                    <span className='cursor-pointer' onClick={() => setIsEditingGroupInfo(true)}><Pencil size={16}/></span>
                                )
                            }
                        </div>
                        <pre className='text-slate-400 px-2 w-full max-h-[100px] overflow-y-auto overflow-x-hidden'>
                            {currentChatRoom.description}
                        </pre>
                    </div>
                    <div className='w-full flex flex-col justify-center'>
                        <span className='text-slate-600 font-bold'>สมาชิก ({currentChatRoom.roomMembers.length})</span>
                        <div  className='w-full flex flex-row items-center overflow-x-auto space-x-1 scrollbar-hide'>
                            {
                                 currentChatRoom.roomMembers.map(member => (
                                    <Tooltip key={member.username} content={member.name} className='size-full' delay={0} closeDelay={0}>
                                        <div className='flex flex-row items-center justify-center size-12 rounded-full relative'>
                                                <UserProfileAvatar name={member.name} imageURL={member.displayImgUrl} size='md' />
                                                {
                                                    member.isAdmin && (
                                                        <div className='absolute -top-1 -left-1 bg-white border-1 rounded-full p-1'>
                                                            <UserCog size={16} />
                                                        </div>
                                                    )
                                                }
                                        </div>
                                    </Tooltip>
                                ))
                            }
                        </div>
                    </div>
                    <div className='border-1 border-slate-200 w-full h-0.5'></div>
                    <div className='w-full flex flex-col space-y-2'>
                        {
                            currentChatRoom.createdBy !== currentUser.username && 
                            <Button variant='ghost' color='danger' className='w-full text-red-500 rounded-lg p-2 flex flex-row 
                                justify-between items-center px-3 cursor-pointer hover:bg-red-500 hover:text-white transition-all duration-300'
                                onPress={() => setIsLeavingGroup(true)} isLoading={isLoading}
                            >
                                <span>ออกจากกลุ่ม</span>
                                <span><FaRunning /></span>
                            </Button>
                        }
                        {
                            isAdmin && (
                            <Button 
                                variant='solid'
                                color='danger'
                                radius='sm'
                                className='flex flex-row items-center justify-between'
                                onPress={() => setIsDeletingGroup(true)}
                                isDisabled={isLoading}
                            >
                                <span>ลบกลุ่ม</span>
                                <span><Trash2 size={16}/></span>
                            </Button>
                            )
                        }
                    </div>
                </ModalBody>


                <Modal isOpen={isEditingGroupInfo} onClose={() => setIsEditingGroupInfo(false)}>
                    <ModalContent>  
                        <ModalHeader>แก้ไขรายละเอียดกลุ่ม</ModalHeader>
                        <ModalBody>
                            <div>
                                <Input
                                    aria-label='ชื่อกลุ่ม'
                                    label='ชื่อกลุ่ม'
                                    variant='bordered'
                                    value={editingGroupInfo.name}
                                    onChange={(e) => setEditingGroupInfo({ ...editingGroupInfo, name: e.target.value })}
                                    validate={value => value.trim().length <= 0 && 'กรุณากรอกชื่อกลุ่ม'}
                                />
                                <Textarea
                                    aria-label='รายละเอียดกลุ่ม'
                                    label='รายละเอียดกลุ่ม'
                                    variant='bordered'
                                    className='mt-4'
                                    minRows={3}
                                    maxRows={5}
                                    value={editingGroupInfo.description}
                                    onChange={(e) => setEditingGroupInfo({ ...editingGroupInfo, description: e.target.value })}
                                    validate={value => value.trim().length <= 0 && 'กรุณากรอกชื่อกลุ่ม'}
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button 
                                color='primary'
                                isDisabled={!editingGroupInfo.name.trim() || !editingGroupInfo.description.trim() || !isInfoChanged} 
                                onPress={handleSaveGroupInfo}
                                isLoading={isLoading}
                            >
                                บันทึก
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                <ConfirmLeaveGroupModal 
                    isOpen={isLeavingGroup} 
                    onClose={() => setIsLeavingGroup(false)} 
                    currentChatRoom={currentChatRoom} 
                    isLoading={isLoading} 
                    onLeave={() => handleLeaveGroup()} />
                <ConfirmDeleteGroupModal 
                    isOpen={isDeletingGroup} 
                    onClose={() => setIsDeletingGroup(false)} 
                    currentChatRoom={currentChatRoom} 
                    isLoading={isLoading} 
                    onDelete={handleDeleteGroup} />
            </ModalContent>

        </Modal>
    )
}

export default ChatGroupInfo
