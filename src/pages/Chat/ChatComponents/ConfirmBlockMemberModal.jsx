import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import React from 'react'

function ConfirmBlockMemberModal({ isOpen, onOpenChange }) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>บล็อคสมาชิก</ModalHeader>
                <ModalBody>
                    <div className='flex flex-row justify-center items-center text-slate-500'>
                        <span>คุณต้องการบล็อค <span className='text-blue-500 font-bold'>HF000_ANNY</span> นี้หรือไม่</span>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button size='sm' color='danger'>บล็อค</Button>
                    <Button size='sm' onClick={onOpenChange}>ยกเลิก</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ConfirmBlockMemberModal
