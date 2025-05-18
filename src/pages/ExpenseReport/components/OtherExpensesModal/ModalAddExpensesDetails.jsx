import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { Button, TableBody, TableCell, TableColumn, TableHeader, TableRow, Textarea, Table, Input, DatePicker, Select, SelectItem } from "@heroui/react";
import React, { useContext, useRef } from 'react'
import { FaPlusCircle, FaTrash } from 'react-icons/fa';
import { Data } from "../../TabsExpense/TabsOthersCost";

function ModalAddExpensesDetails({ isOpen, onClose, handleChange, setSelectedData, selectedData, typeData, isEnable, isDisabled,
    handleConfirmAdd, handleExpenseChange, handleDeleteList, addExpenseItem, expensesDate, setExpensesDate, selectType, setSelectType }) {

    const { typeValue, setTypeValue } = useContext(Data)

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} size="xl" className="overflow-hidden">
            <ModalContent>
                <ModalHeader className="">ฟอร์มเพิ่มค่าใช้จ่าย</ModalHeader>
                <ModalBody className='flex lg:flex-row px-6 space-x-0 lg:space-x-4 space-y-0 lg:space-y-7'>
                    <div className='space-y-8'>
                        <div className="flex w-full lg:flex-col gap-0 lg:gap-2 items-start">
                            <label className="text-sm text-slate-500">ระบุวันที่</label>
                            <DatePicker
                                value={expensesDate}
                                onChange={(e) => setExpensesDate(e)}
                            />
                        </div>
                        <div className='relative'>
                            <div className='flex justify-end mb-3'>
                                <select onChange={(e) => setSelectType(e.target.value)} name="" id="" className="border-2 border-slate-200 px-4 py-1 rounded-xl text-sm">
                                    {typeData?.filter(e => e.status === true).map((item) => (
                                        <option value={item.expensesTypeId}>{item.typeName}</option>
                                    ))}
                                </select>
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
                                <label className="text-sm text-slate-500">หมายเหตุ</label>
                                <Textarea
                                    labelPlacement="outside"
                                    placeholder="กรุณากรอกหมายเหตุ"
                                    className="max-w-full"
                                    isDisabled={isEnable}
                                    value={selectedData.remark}
                                    onChange={(e) => setSelectedData((prev) => ({ ...prev, remark: e.target.value }))}
                                />
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
            </ModalContent>
        </Modal >
    );
}

export default ModalAddExpensesDetails
