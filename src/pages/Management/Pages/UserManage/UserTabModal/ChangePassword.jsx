import { toastError, toastSuccess } from '@/component/Alert'
import userService from '@/services/userService'
import { Button, Input, Spinner } from '@heroui/react'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal'
import React, { useState } from 'react'
import { toast } from 'sonner'

function ChangePassword({ isOpen, onClose, selectUserData, fetchData }) {

    const [newPassword, setNewPassword] = useState(null)
    const [isLoadingChangePassword, setIsLoadingChangePassword] = useState(false)

    const changePassword = async () => {
        setIsLoadingChangePassword(true)
        try {
            await userService.changePassword(selectUserData.username, newPassword)
            await fetchData()
            setIsLoadingChangePassword(false)
            onClose()
            toastSuccess('สำเร็จ', 'เปลี่ยนรหัสผ่านสำเร็จ')
        } catch (err) {
            console.log('Cannot Change Password', err)
            toastError('ไม่สำเร็จ', 'เปลี่ยนรหัสผ่านไม่สำเร็จ')
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className='space-x-2'>
                    <span className='text-slate-500'>เปลี่ยนรหัสผ่าน</span>
                    <span className='text-blue-500 font-bold'>({selectUserData.username})</span>
                </ModalHeader>
                <ModalBody>
                    <Input maxLength={20} placeholder='รหัสผ่านใหม่' onChange={(e) => setNewPassword(e.target.value)} />
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' size='sm' className='px-6' isDisabled={newPassword === null} onPress={changePassword}>
                        {isLoadingChangePassword && <Spinner color='white' size='sm' />}
                        <span>บันทึก</span>
                    </Button>
                    <Button size='sm' onPress={onClose} className='px-6'>ยกเลิก</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ChangePassword
