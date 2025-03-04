import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal'
import { Input, Select, SelectItem } from '@nextui-org/react'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';

import React from 'react'

function ModalAddTask({ isOpen, setIsOpen }) {

    const tableColumns = [
        { key: 'month', text: 'ตัวชี้วัด' },
        { key: 'progress', text: 'ความคืบหน้า' },
        { key: 'target', text: 'เป้าหมาย' },
        { key: 'unit', text: 'หน่วยนับ' },
        { key: 'weight', text: 'น้ำหนักคะแนน' },
        { key: 'action', text: '' },
    ];

    return (
        <Modal isOpen={isOpen} onClose={setIsOpen} size='4xl'>
            <ModalContent>
                <ModalHeader className=''>เพิ่มความคืบหน้า</ModalHeader>
                <ModalBody className=''>
                    <div>
                        <span className='text-sm text-slate-500'>เลือกกลุ่มเป้าหมาย</span>
                        <Select defaultSelectedKeys={['1']}>
                            <SelectItem key={1} value={1}>Task1</SelectItem>
                            <SelectItem key={2} value={2}>Task2</SelectItem>
                            <SelectItem key={3} value={3}>Task3</SelectItem>
                        </Select>
                    </div>

                    <div className='mt-6 border-1 border-slate-50  rounded-md'>
                        <Table removeWrapper aria-label="Example static collection table">
                            <TableHeader columns={tableColumns} className="text-center">
                                {(column) => (
                                    <TableColumn
                                        key={column.name}
                                        className={`text-center text-sm ${column.key === 'month' && 'text-center'} ${column.key === 'progress' && 'w-1/12'}`}
                                        allowsSorting={true}
                                    >
                                        {column.text}
                                    </TableColumn>
                                )}
                            </TableHeader>
                            <TableBody>
                                <TableRow key='1' className="text-slate-500 h-12">
                                    <TableCell className="text-center">ตัวชี้วัด</TableCell>
                                    <TableCell className="text-center">
                                        <div className='w-8/12 mx-auto'>
                                            <Input className='w-full' size='sm' />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">5</TableCell>
                                    <TableCell className="text-center">ครั้ง</TableCell>
                                    <TableCell className="text-center">10%</TableCell>
                                    <TableCell className="text-center"><span className='underline underline-offset-2 text-blue-500 cursor-pointer'>เพิ่มไฟล์</span></TableCell>
                                </TableRow>
                                <TableRow key='2' className="text-slate-500 h-12">
                                    <TableCell className="text-center">ตัวชี้วัด</TableCell>
                                    <TableCell className="text-center">
                                        <div className='w-8/12 mx-auto'>
                                            <Input className='w-full' size='sm' />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">5</TableCell>
                                    <TableCell className="text-center">ครั้ง</TableCell>
                                    <TableCell className="text-center">10%</TableCell>
                                    <TableCell className="text-center"><span className='underline underline-offset-2 text-blue-500 cursor-pointer'>เพิ่มไฟล์</span></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    <ModalFooter className='px-0 mt-6'>
                        <div className='px-8 py-1 text-slate-500 cursor-pointer bg-slate-200 rounded-md'>ยกเลิก</div>
                        <div className='px-8 py-1 text-white cursor-pointer bg-blue-500 rounded-md'>ยืนยัน</div>
                    </ModalFooter>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default ModalAddTask
