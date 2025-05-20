import { Avatar, Input, Modal, ModalBody, ModalContent, ModalHeader, Textarea } from '@heroui/react'
import React, { useRef } from 'react'
import { FaPencilAlt } from 'react-icons/fa'

function CreateGroupChat({ isOpen, onOpenChange }) {

    const fileInputRef = useRef(null);

    const handleIconClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("ไฟล์ที่เลือก:", file);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
            <ModalContent>
                <ModalHeader className='text-slate-600'>สร้างกลุ่มแชท</ModalHeader>
                <ModalBody>
                    <header className='flex flex-row justify-start items-start w-full'>
                        {/* Image Setting */}
                        <div className='relative w-3/12'>
                            <Avatar name="Image" className="w-28 h-28 text-large bg-slate-100" />
                            <div onClick={handleIconClick} className='rounded-full absolute bottom-0 right-0 bg-blue-200 p-2 cursor-pointer'>
                                <FaPencilAlt className='text-black text-blue-500' />
                            </div>
                        </div>

                        {/* ซ่อน Input หรือจะใช้วิธีอื่นได้นะ */}
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                        />

                        <div className='mt-2 px-4 flex flex-row justify-between items-start w-full'>
                            <div className='w-10/12 space-y-4'>
                                <Input placeholder='ชื่อกลุ่ม' size='sm' />
                                <Textarea placeholder='รายละเอียดกลุ่ม' size='sm' />
                            </div>
                            <span className='text-blue-500'>0/100</span>
                        </div>
                    </header>

                    <hr className='my-3' />

                    {/* Invite Members */}
                    <section className='w-full'>
                        <header>
                            <span className='text-slate-500'>สมาชิก (0)</span>
                        </header>
                        <div>

                        </div>
                    </section>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default CreateGroupChat
