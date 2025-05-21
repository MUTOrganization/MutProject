import { Avatar, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import React from 'react'
import Select from 'react-select'

function AddMember({ isOpen, onOpenChange }) {

    const options = [
        { value: 'member', label: 'สมาชิกกลุ่ม' },
        { value: 'admin', label: 'แอดมินกลุ่ม' },
    ];

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='xl'>
            <ModalContent className="max-h-[80vh] overflow-y-auto">
                <ModalHeader>เพิ่มสมาชิก</ModalHeader>
                <ModalBody>
                    <Input placeholder='ค้นหาสมาชิก' size='sm' />
                    <div className='rounded-lg p-2 flex flex-row justify-between items-center'>
                        <div className='flex flex-row justify-start items-center space-x-2'>
                            <Avatar name='Img' className='w-20 h-20' />
                            <span className='text-xs text-slate-500'>MemeberName</span>
                        </div>
                        <Select
                            options={options}
                            className='w-36 text-sm'
                        />
                        <span className='px-6 py-1 rounded-md bg-blue-500 text-white text-sm cursor-pointer transition-all duration-300 hover:bg-blue-600 hover:bg-blue-600'>เชิญ</span>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button size='sm' color='success' className='text-white px-8'>ยืนยัน</Button>
                    <Button size='sm' className='px-8' onPress={onOpenChange}>ยกเลิก</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddMember
