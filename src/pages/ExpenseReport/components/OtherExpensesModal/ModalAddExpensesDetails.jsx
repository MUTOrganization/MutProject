import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { Button, Select, SelectItem, TableBody, TableCell, TableColumn, TableHeader, TableRow, Textarea, Table, Input } from "@heroui/react";
import React from 'react'
import { FaPlusCircle, FaTrash } from 'react-icons/fa';

function ModalAddExpensesDetails({ isOpen, onClose, handleChange, setSelectedData, selectedData, typeData, isEnable, isDisabled, handleConfirmAdd, handleExpenseChange, handleDeleteList, addExpenseItem }) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} isDismissable={false} isKeyboardDismissDisabled={true}>
            <ModalContent className='max-w-2xl'>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">ฟอร์มเพิ่มค่าใช้จ่าย</ModalHeader>
                        <ModalBody className='flex lg:flex-row px-6 space-x-0 lg:space-x-4 space-y-0 lg:space-y-7'>
                            <div className='side1 w-full'>
                                <div className='form space-y-8'>

                                    <div className="flex w-full lg:flex-col gap-0 lg:gap-2 items-start">
                                        <label className="text-sm text-slate-500">ระบุวันที่</label>
                                        <input type="date"
                                            disabled={isEnable}
                                            value={selectedData.date}
                                            onChange={(e) => setSelectedData((prev) => ({ ...prev, date: e.target.value }))}
                                            className='input-sm w-full h-9 focus:outline-none text-slate-400 border-2 border-slate-200 rounded-md px-4' />
                                    </div>

                                    <div className='relative'>
                                        <div className='flex justify-end mb-3'>
                                            <Select
                                                label='เลือกประเภท'
                                                aria-label='เลือกประเภท'
                                                color="primary"
                                                className="w-48"
                                                size="sm"
                                                onChange={handleChange}
                                            >
                                                {typeData?.map((item) => (
                                                    <SelectItem key={item.expensesTypeId} value={item.typeName}>
                                                        {item.typeName}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        </div>
                                        <Table className=''>
                                            <TableHeader className=''>
                                                <TableColumn className='font-medium'>รายการ</TableColumn>
                                                <TableColumn className='font-medium'>จำนวน</TableColumn>
                                                <TableColumn className='font-medium'>ราคา</TableColumn>
                                                <TableColumn className='font-medium'>ยอดรวม</TableColumn>
                                                <TableColumn className='font-medium'></TableColumn>
                                            </TableHeader>

                                            <TableBody className=''>
                                                {selectedData.list.map((item, index) => (
                                                    <>
                                                        <TableRow key={index}>
                                                            <TableCell >
                                                                <input
                                                                    type="text"
                                                                    maxLength={50}
                                                                    value={item.name}
                                                                    disabled={isEnable}
                                                                    onChange={(e) => handleExpenseChange(index, 'name', e.target.value)}
                                                                    className='input input-sm input-bordered focus:outline-none text-sm h-9 px-2'
                                                                    placeholder="รายการ"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <input
                                                                    type="text"
                                                                    maxLength={50}
                                                                    value={item.qty}
                                                                    disabled={isEnable}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value;
                                                                        if (/^\d*\.?\d*$/.test(value)) {
                                                                            handleExpenseChange(index, 'qty', value);
                                                                        }
                                                                    }}
                                                                    className='input input-sm input-bordered focus:outline-none w-full text-sm h-9'
                                                                    placeholder="0"
                                                                    onKeyDown={(e) => {
                                                                        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Delete') {
                                                                            e.preventDefault();
                                                                        }
                                                                    }}
                                                                    pattern="[0-9]*"
                                                                />
                                                            </TableCell>
                                                            <TableCell className=''>
                                                                <input
                                                                    type="text"
                                                                    maxLength={10}
                                                                    value={item.price}
                                                                    disabled={isEnable}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value;
                                                                        if (/^\d*\.?\d*$/.test(value)) {
                                                                            handleExpenseChange(index, 'price', value);
                                                                        }
                                                                    }}
                                                                    placeholder='0.00'
                                                                    className='input input-sm input-bordered h-9 focus:outline-none text-sm w-full ps-3'
                                                                    onKeyDown={(e) => {
                                                                        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Delete') {
                                                                            e.preventDefault();
                                                                        }
                                                                    }}
                                                                    pattern="[0-9]*"
                                                                />
                                                            </TableCell>
                                                            <TableCell className=''>
                                                                <div className='w-full'>
                                                                    {item.totalAmount || '0.00'}

                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                {index > 0 && (
                                                                    <FaTrash size={18} onClick={() => handleDeleteList(index)} className='hover:scale-150 cursor-pointer transition duration-150 ease-in text-red-500' />
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    </>
                                                ))}
                                                <TableRow className=''>
                                                    <TableCell>
                                                        <div className='w-full'>
                                                            {selectedData.list.length !== 5 && (
                                                                <div className='cursor-pointer flex flex-row items-center space-x-1' onClick={addExpenseItem}>
                                                                    <span><FaPlusCircle className='text-blue-500' /></span>
                                                                    <span className='text-sm text-blue-500 underline underline-offset-2'>เพิ่มข้อมูล</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell></TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>

                                    <div className="other w-full">
                                        <div className="flex w-full lg:flex-col gap-0 lg:gap-2 items-start">
                                            <label className="text-sm text-slate-500">หมายเหตุ (ถ้ามี)</label>
                                            <Textarea
                                                labelPlacement="outside"
                                                placeholder="Enter your description"
                                                className="max-w-full"
                                                isDisabled={isEnable}
                                                value={selectedData.remark}
                                                onChange={(e) => setSelectedData((prev) => ({ ...prev, remark: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                ยกเลิก
                            </Button>
                            <Button
                                isDisabled={isDisabled}
                                color="primary"
                                onPress={() => {
                                    onClose();
                                    handleConfirmAdd();
                                }}
                            >
                                ยืนยัน
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal >
    );
}

export default ModalAddExpensesDetails
