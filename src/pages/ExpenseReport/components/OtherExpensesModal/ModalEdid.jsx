import React, { useContext, useState } from 'react'
import { Button, Textarea, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, DatePicker, Spinner, Autocomplete, AutocompleteItem } from "@heroui/react";
import { FaPlusCircle, FaTrash } from 'react-icons/fa';
import { useAppContext } from '@/contexts/AppContext';
import { toast, Toaster } from 'sonner';
import expensesService from '@/services/expensesService';
import { formatDateObject } from '@/utils/dateUtils';
import { toastError, toastSuccess, toastWarning } from '@/component/Alert';
import { Data } from '../../TabsExpense/TabsOthersCost';
import { fromDate } from '@internationalized/date';
import { Select, SelectItem } from '@nextui-org/select';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { formatNumber } from '@/component/FormatNumber';

function ModalEdid({ isOpen, onClose, data, typeData, selectAgent }) {

    const { getDataOtherExpenses } = useContext(Data)

    const initializeListWithTotal = (details = []) => {
        return details.map(item => {
            const qty = parseFloat(item.qty) || 1;
            const price = parseFloat(item.price) || 0;
            return {
                ...item,
                totalAmount: (qty * price).toFixed(2)
            };
        });
    };

    // New Data
    const [list, setList] = useState(() => initializeListWithTotal(data.details));
    const [newRemarks, setNewRemarks] = useState(data.remarks)
    const [newDate, setNewDate] = useState(fromDate(new Date(data?.expensesDate)))
    const [selectType, setSelectType] = useState(data?.expensesTypeId || null)
    const [isLoadingEdit, setIsLoadingEdit] = useState(false)

    const handleAddWithDraw = () => {
        setList(prev => [...prev, { name: '', qty: '', price: '', totalAmount: '' }])
    }

    const handleDeleteWithDraw = (index) => {
        setList(prev => prev.filter((_, i) => i !== index));
    }

    const handleValidate = () => {
        const hasEmptyField = list.some(e =>
            !e.name?.trim() || !String(e.price).trim()
        )
        if (hasEmptyField || selectType === null || !newRemarks?.trim()) {
            return true
        }
        return false
    }

    const handleEdit = async () => {
        if (handleValidate()) {
            toastWarning('คำเตือน !', 'กรุณากรอกข้อมูลให้ครบ')
            return;
        }
        setIsLoadingEdit(true)
        try {
            await expensesService.editExpensesDetail(data.expensesId, newRemarks, formatDateObject(newDate), list, selectType)
            await getDataOtherExpenses()
            setIsLoadingEdit(false)
            onClose()
            toastSuccess('Success !', 'แก้ไขข้อมูลสำเร็จ')
        } catch (error) {
            console.log('Error', error)
            toastError('Error !', 'แก้ไขข้อมูลไม่สำเร็จ')
        }
    }

    const sumTotal = list.reduce((sum, item) => sum + parseFloat(item.totalAmount || 0), 0);

    return (
        <div>
            <Modal isOpen={isOpen} onOpenChange={onClose} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent className='max-w-3xl'>
                    <ModalHeader>
                        <div className='flex flex-col w-full'>
                            <span className='text-xl'>แก้ไขข้อมูล</span>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <div className='space-y-8'>


                            <div className='flex flex-row'>
                                <div className="flex w-full lg:flex-col gap-0 lg:gap-2 items-start">
                                    <label className="text-sm text-slate-500">วันที่กรอก</label>
                                    <DatePicker value={newDate} onChange={(e) => setNewDate(e)} granularity="day" />
                                </div>
                            </div>

                            <div className='flex justify-end mb-3'>
                                <div className='flex justify-end mb-3'>
                                    <Autocomplete allowsEmptyCollection={false} isClearable={false} variant="bordered" key={selectAgent} aria-label="Select a type" className="w-48" selectedKey={`${selectType || null}`} onSelectionChange={(value) => setSelectType(Number(value) || null)}>
                                        {typeData?.filter(e => e.status === true).map((item) => (
                                            <AutocompleteItem aria-label="Select a type" key={item.expensesTypeId} value={item.expensesTypeId}>{item.typeName || null}</AutocompleteItem>
                                        ))}
                                    </Autocomplete>
                                </div>
                            </div>

                            <div className='row-3'>
                                <div className='rounded-xl'>
                                    <Table className='w-full'>
                                        <TableHeader className='bg-[#F3F3F3] border-b-2 border-slate-200'>
                                            <TableColumn className='font-medium'>รายการ</TableColumn>
                                            <TableColumn className='font-medium'>จำนวน(ถ้ามี)</TableColumn>
                                            <TableColumn className='font-medium'>ราคา</TableColumn>
                                            <TableColumn className='font-medium'>ยอดรวม</TableColumn>
                                            <TableColumn className='font-medium'></TableColumn>
                                        </TableHeader>

                                        <TableBody className='text-sm bg-slate-100'>
                                            {list.map((item, index) => (
                                                <TableRow key={index} className='text-slate-500'>
                                                    <TableCell className='w-5/12'>
                                                        <Input
                                                            value={item.name}
                                                            onChange={(e) => {
                                                                const updatedList = [...list];
                                                                updatedList[index].name = e.target.value;
                                                                setList(updatedList);
                                                            }}
                                                            type="text"
                                                            maxLength={45}
                                                            size='sm'
                                                            onKeyDown={(e) => {
                                                                if (e.key === ' ') {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                            placeholder='รายการ'
                                                        />
                                                    </TableCell>
                                                    <TableCell className='w-2/12'>
                                                        <Input
                                                            value={item.qty}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (/^\d*$/.test(val)) {
                                                                    const updatedList = [...list];
                                                                    updatedList[index].qty = val;

                                                                    const qty = parseFloat(val) || 1;
                                                                    const price = parseFloat(updatedList[index].price) || 0;
                                                                    updatedList[index].totalAmount = (qty * price).toFixed(2);

                                                                    setList(updatedList);
                                                                }
                                                            }}
                                                            type="text"
                                                            className='input input-sm input-bordered focus:outline-none w-full'
                                                            maxLength={6}
                                                            placeholder='0'
                                                            size='sm'
                                                            onKeyDown={(e) => {
                                                                if (e.key === ' ') {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                            pattern="[0-9]*"
                                                        />
                                                    </TableCell>
                                                    <TableCell className='w-3/12'>
                                                        <Input
                                                            value={item.price}
                                                            placeholder='0.00'
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (/^\d*\.?\d*$/.test(val)) {
                                                                    const updatedList = [...list];
                                                                    updatedList[index].price = val;
                                                                    const qty = parseFloat(updatedList[index].qty) || 1;
                                                                    const price = parseFloat(val) || 0;
                                                                    updatedList[index].totalAmount = (qty * price).toFixed(2);
                                                                    setList(updatedList);
                                                                }
                                                            }}
                                                            type="text"
                                                            size='sm'
                                                            maxLength={45}
                                                            onKeyDown={(e) => {
                                                                if (e.key === ' ') {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {Number(item.totalAmount || 0).toLocaleString('th-TH', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        })}
                                                    </TableCell>

                                                    <TableCell>
                                                        {index > 0 && (
                                                            <FaTrash
                                                                size={16}
                                                                className='text-red-500 cursor-pointer hover:scale-150 transition duration-150 ease-in'
                                                                onClick={() => handleDeleteWithDraw(index)}
                                                            />
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow>
                                                <TableCell>
                                                    <div className='flex flex-row items-center space-x-1 justify-start mr-1 py-2'>
                                                        {list.length < 5 && (
                                                            <div className='cursor-pointer flex flex-row items-center space-x-1' onClick={handleAddWithDraw}>
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
                                <div className='text-end text-sm py-3 text-slate-500 space-x-4'>
                                    <span>ยอดรวม</span>
                                    <span className='text-red-500 font-bold'>{formatNumber(sumTotal)}</span>
                                    <span>บาท</span>
                                </div>
                            </div>

                            <div className='row-4 flex flex-col gap-2'>
                                <label className="text-sm text-slate-500">หมายเหตุ</label>
                                <Textarea
                                    onChange={(e) => setNewRemarks(e.target.value)}
                                    value={newRemarks}
                                    labelPlacement="outside"
                                    placeholder="Enter your description"
                                    className="max-w-full"
                                />
                            </div>
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                            ยกเลิก
                        </Button>
                        <Button color="primary" onPress={() => { handleEdit(); }}>
                            {isLoadingEdit && <Spinner color='white' size="sm" />}
                            <span>ยืนยันการแก้ไข</span>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Toaster richColors position='bottom-left' />
        </div>
    );
}

export default ModalEdid
