import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { Button, TableBody, TableCell, TableColumn, TableHeader, TableRow, Textarea, Table, Input, DatePicker, Spinner, Autocomplete, AutocompleteItem } from "@heroui/react";
import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaExclamationCircle, FaPlusCircle, FaTrash } from 'react-icons/fa';
import { Data } from "../../TabsExpense/TabsOthersCost";
import { formatNumber } from "@/component/FormatNumber";
import { Select, SelectItem } from "@nextui-org/select";
import { toast } from "sonner";
import { toastError, toastSuccess, toastWarning } from "@/component/Alert";
import expensesService from "@/services/expensesService";
import { formatDateObject } from "@/utils/dateUtils";

function ModalAddExpensesDetails({ isOpen, onClose, setSelectedData, selectedData, typeData, isEnable, getDataOtherExpenses, handleExpenseChange, handleDeleteList, addExpenseItem,
    expensesDate, setExpensesDate, setSelectType, selectType, selectAgent, handleValidate }) {

    const [isLoadAdd, setIsLoadingAdd] = useState(false)

    const handleConfirmAdd = async () => {
        if (handleValidate()) {
            toastWarning('เกิดข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบ')
            return;
        }
        setIsLoadingAdd(true)
        try {
            await expensesService.addExpensesDetails(selectedData.remark, formatDateObject(expensesDate), selectedData.list, selectType)
            await getDataOtherExpenses()
            setIsLoadingAdd(false)
            onClose();
            toastSuccess('Success !', 'เพิ่มข้อมูลค่าใช้จ่ายเรียบร้อย')
        } catch (error) {
            console.error('Error adding other expenses:', error);
            toastError('Error !', 'เพิ่มข้อมูลค่าใช้จ่ายไม่สำเร็จ')
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === ' ') {
            e.preventDefault();
        }
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} size="3xl" isDismissable={false} isKeyboardDismissDisabled={true}>
            <ModalContent>
                <ModalHeader className="">ฟอร์มเพิ่มค่าใช้จ่าย</ModalHeader>
                <ModalBody className='flex lg:flex-row px-6 space-x-0 lg:space-x-4 space-y-0 lg:space-y-7'>
                    <div className='space-y-8'>
                        <div className="flex w-full flex-col gap-0 lg:gap-2 items-start">
                            <label className="text-sm text-slate-500">ระบุวันที่</label>
                            <DatePicker
                                value={expensesDate}
                                onChange={(e) => setExpensesDate(e)}
                                granularity="day"
                                aria-label="Select a date"
                            />
                        </div>
                        <div className='relative'>
                            <div className='flex justify-end mb-3'>
                                <Autocomplete isClearable={false} allowsEmptyCollection variant="bordered" placeholder="เลือกประเภท" aria-label="Select a type" key={selectAgent} className="w-48" selectedKey={`${selectType}` || null} onSelectionChange={(value) => setSelectType(Number(value) || null)}>
                                    {typeData?.filter(e => e.status === true).map((item) => (
                                        <AutocompleteItem aria-label="Select a type" key={item.expensesTypeId} value={item.expensesTypeId}>{item.typeName}</AutocompleteItem>
                                    ))}
                                </Autocomplete>
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
                                                <TableCell className="w-5/12" >
                                                    <Input maxLength={50} className="shadow-sm"
                                                        aria-label="Input a name"
                                                        type="text"
                                                        value={item.name}
                                                        disabled={isEnable}
                                                        onChange={(e) => handleExpenseChange(index, 'name', e.target.value)}
                                                        placeholder="รายการ"
                                                        size="sm"
                                                    />
                                                </TableCell>
                                                <TableCell className="w-2/12">
                                                    <Input
                                                        aria-label="Input a qty"
                                                        type="text"
                                                        inputMode="numeric"
                                                        pattern="\d*"
                                                        maxLength={6}
                                                        value={item.qty}
                                                        size="sm"
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (/^\d*$/.test(value)) {
                                                                handleExpenseChange(index, 'qty', value);
                                                            }
                                                        }}
                                                        placeholder="0"
                                                    />

                                                </TableCell>
                                                <TableCell className='w-3/12'>
                                                    <Input
                                                        aria-label="Input a price"
                                                        type="text"
                                                        inputMode="numeric"
                                                        maxLength={10}
                                                        value={item.price}
                                                        disabled={isEnable}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (/^\d*$/.test(value)) {
                                                                handleExpenseChange(index, 'price', value);
                                                            }
                                                        }}
                                                        placeholder='0.00'
                                                        size="sm"
                                                    />
                                                </TableCell>
                                                <TableCell className=''>
                                                    <div className='w-full'>
                                                        {formatNumber(item.totalAmount) || '0.00'}

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

                        <div className="w-full text-end px-2 space-x-2">
                            <span className="text-sm text-slate-500">รวมทั้งหมด</span>
                            <span className="text-red-500 font-bold">
                                {formatNumber(selectedData.list.reduce((acc, item) => acc + Number(item.totalAmount), 0)) || 0.00}
                            </span>
                            <span className="text-sm text-slate-500">บาท</span>
                        </div>

                        <div className="other w-full">
                            <div className="flex w-full flex-col gap-0 lg:gap-2 items-start">
                                <label className="text-sm text-slate-500">หมายเหตุ</label>
                                <Textarea
                                    labelPlacement="outside"
                                    placeholder="กรุณากรอกหมายเหตุ"
                                    className="max-w-full"
                                    maxLength={50}
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
                    <Button color="primary" onPress={handleConfirmAdd}>
                        {isLoadAdd && <Spinner color="white" size="sm" />}
                        <span>ยืนยัน</span>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal >
    );
}

export default ModalAddExpensesDetails
