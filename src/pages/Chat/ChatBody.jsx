import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react'
import React from 'react'
import MemberList from './ChatComponents/MemberList'
import MemberChat from './ChatComponents/MemberChat'

function ChatBody({ isOpen, onOpenChange }) {
    return (

        // ความสูง กว้าง กำหนด ชั่วคราว อยากได้เท่าไหร่ ปรับเอาเลย
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
            <ModalContent className="w-full max-w-7xl h-[80vh]">
                <ModalHeader className='text-slate-600'>แชท</ModalHeader>
                <ModalBody className='flex flex-row justify-between items-start'>

                    {/* ฝั่งซ้าย */}
                    <MemberList />

                    {/* ฝั่งขวา */}
                    <MemberChat />

                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default ChatBody
