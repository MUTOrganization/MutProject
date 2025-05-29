import userService from '@/services/userService'
import { Button } from '@heroui/react'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal'
import React from 'react'
import { toast } from 'sonner'

function CloseStatus({ isOpen, onClose, selectUserData, fetchData }) {

    const closeStatus = async () => {
        try {
            await userService.changeStatus(selectUserData.username)
            await fetchData()
            toast.success('ปิดการใช้งานผู้ใช้งานเรียบร้อย')
            onClose()
        } catch (err) {
            console.log('Cannot Change Status User!', err)
            toast.error('ไม่สามารถปิดการใช้งานผู้ใช้งานได้')
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className='text-slate-500'>ยืนยันการปิดการใช้งานผู้ใช้งาน</ModalHeader>
                <ModalBody className='text-center'>
                    <div className='space-x-2 flex flex-row justify-center items-center bg-slate-100 py-6 shadow-sm rounded-lg'>
                        <span className='text-slate-600'>ต้องการปิดการใช้งานผู้ใช้งาน</span>
                        <span className='font-bold text-red-500'>{selectUserData.username}</span>
                        <span className='text-slate-600'>หรือไม่ ?</span>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button onPress={closeStatus} className='px-6 py-1' size='sm' color='primary'>ยืนยัน</Button>
                    <Button onPress={() => onClose()} className='px-6 py-1' size='sm'>ยกเลิก</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default CloseStatus
