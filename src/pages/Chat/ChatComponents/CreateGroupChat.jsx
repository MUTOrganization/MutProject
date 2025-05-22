import { Avatar, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from '@heroui/react'
import React, { useRef } from 'react'
import { FaMinus, FaPencilAlt, FaPlus } from 'react-icons/fa'
import AddMember from './AddMember';
import Select from 'react-select'

function CreateGroupChat({ isOpen, onOpenChange, isOpenModalAddMember, setIsOpenModalAddMember }) {

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

    const options = [
        { value: 'member', label: 'สมาชิกกลุ่ม' },
        { value: 'admin', label: 'แอดมินกลุ่ม' },
    ];

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} >
                <ModalContent className={`${isOpenModalAddMember ? 'max-w-7xl' : 'max-w-3xl'} transition-all duration-200`}>
                    <ModalHeader className='text-slate-600'>สร้างกลุ่มแชท</ModalHeader>
                    <ModalBody className={`${isOpenModalAddMember ? 'flex flex-row justify-between items-start' : 'w-full'}`}>
                        <div className={`left-side w-full ${isOpenModalAddMember && 'border-r-1 border-slate-200'}`}>
                            <header className='flex flex-row justify-start items-start w-full'>
                                {/* Image Setting */}
                                <div className='relative w-3/12'>
                                    <Avatar name="Image" className="w-28 h-28 text-large bg-slate-100" />
                                    <div onClick={handleIconClick} className='rounded-full absolute bottom-0 right-6 bg-blue-200 p-2 cursor-pointer'>
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
                            <section className='w-full space-y-4'>
                                <header>
                                    <span className='text-slate-500'>สมาชิก (0)</span>
                                </header>
                                <div className='w-full flex flex-row justify-start items-start'>
                                    <div onClick={() => { setIsOpenModalAddMember(!isOpenModalAddMember); }} className='flex flex-col justify-center items-center space-y-1'>
                                        <div className={`p-6 rounded-full bg-slate-100 ${isOpenModalAddMember ? 'hover:bg-red-500' : 'hover:bg-blue-500'} hover:text-white transition-all duration-300 cursor-pointer`}>{isOpenModalAddMember ? <FaMinus className='text-sm' /> : <FaPlus className='text-sm' />}</div>
                                        <span className='text-sm'>เพิ่มสมาชิก</span>
                                    </div>
                                </div>
                                <div>
                                    {/* เพิ่ม Avartar User ที่เพิ่ม */}
                                </div>

                            </section>
                        </div>

                        {/* Add Member Content */}
                        {isOpenModalAddMember && (
                            <div className='w-8/12 h-full rounded-lg shadow-sm space-y-2'>
                                <Input placeholder='ค้นหาสมาชิก' size='sm' />
                                <div className='rounded-lg p-2 flex flex-row justify-between items-center'>
                                    <div className='flex flex-row justify-start items-center space-x-2'>
                                        <Avatar name='Img' className='w-16 h-16' />
                                        <span className='text-xs text-slate-500'>MemeberName</span>
                                    </div>
                                    <Select
                                        options={options}
                                        className='w-36 text-sm'
                                    />
                                    <span className='px-6 py-1 rounded-md bg-blue-500 text-white text-sm cursor-pointer transition-all duration-300 hover:bg-blue-600 hover:bg-blue-600'>เชิญ</span>
                                </div>
                            </div>
                        )}
                    </ModalBody>
                    <hr />
                    <ModalFooter>
                        <Button size='sm' color='success' className='text-white px-8'>ยืนยัน</Button>
                        <Button size='sm' className='px-8' onPress={onOpenChange}>ยกเลิก</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal >
        </>
    )
}

export default CreateGroupChat
