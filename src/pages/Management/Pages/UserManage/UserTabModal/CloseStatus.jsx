import userService from '@/services/userService'
import { Button } from '@heroui/react'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal'
import React from 'react'
import { FaExclamationCircle } from 'react-icons/fa'
import { toast } from 'sonner'

function CloseStatus({ isOpen, onClose, selectUserData, fetchData }) {

    const closeStatus = async () => {
        try {
            await userService.changeStatus(selectUserData.username)
            toast.success('ปิดการใช้งานผู้ใช้งานเรียบร้อย')
            fetchData()
        } catch (err) {
            console.log('Cannot Change Status User!', err)
            toast.error('ไม่สามารถปิดการใช้งานผู้ใช้งานได้')
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className='text-slate-500'>{selectUserData.status ? 'ปิดการใช้งานผู้ใช้งาน' : 'เปิดการใช้งานผู้ใช้งาน'}</ModalHeader>
                <ModalBody className='text-center'>
                    <div className='text-center mx-auto'>
                        <div className='p-5 bg-red-200 rounded-full'><FaExclamationCircle className='text-red-500 text-5xl' /></div>
                    </div>
                    <div className='text-red-400'>หากปิดการใช้งานแล้วจะไม่สามารถกู้คืนข้อมูลได้!</div>
                    <div className='font-bold text-slate-500 bg-slate-100 rounded-lg w-5/12 mx-auto py-2'>{selectUserData.username.toUpperCase()}</div>
                    <div className='text-slate-500 text-xs'>ต้องการปิดการใช้งานหรือไม่ ?</div>
                </ModalBody>

                <ModalFooter className='mt-4'>
                    <Button onPress={() => onClose()} className='px-8 py-1' size='sm'>ยกเลิก</Button>
                    <Button onPress={() => { closeStatus(); onClose() }} className='px-8 py-1' size='sm' color='danger'>ยืนยัน</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default CloseStatus
