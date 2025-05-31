import { toastError, toastSuccess } from '@/component/Alert'
import userService from '@/services/userService'
import { Button, Spinner } from '@heroui/react'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal'
import React, { useState } from 'react'
import { FaExclamationCircle } from 'react-icons/fa'

function CloseStatus({ isOpen, onClose, selectUserData, fetchData }) {
    const [isLoadingCloseStatus, setIsLoadingCloseStatus] = useState(false)

    const closeStatus = async () => {
        setIsLoadingCloseStatus(true)
        try {
            await userService.changeStatus(selectUserData.username)
            await fetchData()
            setIsLoadingCloseStatus(false)
            onClose()
            toastSuccess('สำเร็จ', 'ปิดการใช้งานผู้ใช้งานเรียบร้อย')
        } catch (err) {
            console.log('Cannot Change Status User!', err)
            toastError('ไม่สำเร็จ', 'ปิดการใช้งานผู้ใช้งานไม่สำเร็จ')
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className='text-slate-500'>ปิดการใช้งานผู้ใช้งาน</ModalHeader>
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
                    <Button onPress={closeStatus} className='px-8 py-1' size='sm' color='danger'>
                        {isLoadingCloseStatus && <Spinner color='white' size='sm' />}
                        <span>ปิดการใช้งาน</span>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default CloseStatus
