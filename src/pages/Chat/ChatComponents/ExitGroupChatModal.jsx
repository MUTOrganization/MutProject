import React from 'react'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'

function ExitGroupChatModal() {
    return (
        // ใช้ได้เลยนะ Modal ยินยันการออกจากกลุ่ม แต่ Modal มันจะซ้อนกัน 3 อัน
        <div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader>บล็อคสมาชิก</ModalHeader>
                    <ModalBody>
                        <div className='flex flex-row justify-center items-center text-slate-500'>
                            <span>คุณต้องการบล็อค <span className='text-blue-500 font-bold'>HF000_ANNY</span> นี้หรือไม่</span>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button size='sm' color='danger'>ยืนยัน</Button>
                        <Button size='sm' onClick={onOpenChange}>ยกเลิก</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default ExitGroupChatModal
