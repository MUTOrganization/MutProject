import React, { useContext, useState } from 'react'
import { Button, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, Textarea, Table, TableHeader, SelectItem, TableColumn, Select, TableBody, TableRow, TableCell, Input, DatePicker } from "@heroui/react";
import { FaPlusCircle, FaTrash } from 'react-icons/fa';
import { useAppContext } from '@/contexts/AppContext';
import { toast, Toaster } from 'sonner';
import expensesService from '@/services/expensesService';
import { formatDateObject } from '@/utils/dateUtils';
import { toastError } from '@/component/Alert';
import { Data } from '../../TabsExpense/TabsOthersCost';
import { fromDate } from '@internationalized/date';

function ModalEdid({ isOpen, onClose, data, typeData }) {
    const { currentUser } = useAppContext();
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
    const [selectType, setSelectType] = useState(data?.expensesTypeId)

    const handleAddWithDraw = () => {
        setList(prev => [...prev, { name: null, qty: null, price: null, totalAmount: null }])
    }

    const handleDeleteWithDraw = (index) => {
        setList(prev => prev.filter((_, i) => i !== index));
    }

    const handleEdit = async () => {
        try {
            await expensesService.editExpensesDetail(data.expensesId, newRemarks, formatDateObject(newDate), list, selectType)
            await getDataOtherExpenses()
            toast.success('แก้ไขข้อมูลสำเร็จ')
        } catch (error) {
            console.log('Error', error)
            toast.error('แก้ไขข้อมูลไม่สำเร็จ')
        }
    }

    const isDisabled = list.some(e =>
        !e.name || e.name.trim() === '' ||
        // !e.qty || e.qty.trim() === '' ||
        !e.price || String(e.price).trim() === ''
    );

    const handleChange = (selectedKey) => {
        let getKey = selectedKey.target.value
        const findValueById = typeData.find(e => String(e?.id) === String(getKey));
        setSelectType(findValueById?.id)
    };

    const sumTotal = list.reduce((sum, item) => sum + parseFloat(item.totalAmount || 0), 0);

    return (
        <div>
            <Modal isOpen={isOpen} onOpenChange={onClose} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent className='max-w-3xl'>
                    <ModalHeader>
                        <div className='flex flex-col w-full'>
                            <span className='text-xl'>แก้ไขข้อมูล</span>
                            <div className='flex flex-row items-baseline justify-between w-full mt-2 font-normal'>
                                <span className='text-slate-400 text-sm'>สร้างโดย :  {data.create_By}</span>
                                {data.update_By && data.update_Date && (
                                    <>
                                        <div className='flex flex-col items-end space-y-1'>
                                            <span className='text-slate-400 text-sm'>อัพเดทโดย : {data.update_By}</span>
                                            <span className='text-slate-400 text-sm'>วันที่อัพเดท : {new Date(data.update_Date).toISOString().split('T')[0]}</span>
                                        </div>
                                    </>
                                )}
                            </div>
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
                                    <select value={selectType} onChange={(e) => setSelectType(e.target.value)} name="" id="" className="border-2 border-slate-200 px-4 py-1 rounded-xl text-sm">
                                        {typeData?.filter(e => e.status === true).map((item) => (
                                            <option value={item.expensesTypeId}>{item.typeName}</option>
                                        ))}
                                    </select>
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
                                                            placeholder='รายการ'
                                                        />
                                                    </TableCell>
                                                    <TableCell className='w-2/12'>
                                                        <Input
                                                            value={item.qty}
                                                            onChange={(e) => {
                                                                const updatedList = [...list];
                                                                updatedList[index].qty = e.target.value;

                                                                const qty = parseFloat(updatedList[index].qty) || 1;
                                                                const price = parseFloat(updatedList[index].price) || 0;
                                                                updatedList[index].totalAmount = (qty * price).toFixed(2);

                                                                setList(updatedList);
                                                            }}
                                                            type="text"
                                                            className='input input-sm input-bordered focus:outline-none w-full'
                                                            maxLength={6}
                                                            placeholder='0'
                                                            size='sm'
                                                            onKeyDown={(e) => {
                                                                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Delete') {
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
                                                                const updatedList = [...list];
                                                                updatedList[index].price = e.target.value;

                                                                const qty = parseFloat(updatedList[index].qty) || 1;
                                                                const price = parseFloat(updatedList[index].price) || 0;
                                                                updatedList[index].totalAmount = (qty * price).toFixed(2);

                                                                setList(updatedList);
                                                            }}
                                                            type="text"
                                                            size='sm'
                                                            maxLength={45}
                                                            onKeyDown={(e) => {
                                                                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Delete') {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                            pattern="[0-9]*"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {Number(item.totalAmount || 0).toLocaleString('th-TH', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        })}
                                                    </TableCell>

                                                    <TableCell>
                                                        <FaTrash
                                                            size={16}
                                                            className='text-red-500 cursor-pointer hover:scale-150 transition duration-150 ease-in'
                                                            onClick={() => handleDeleteWithDraw(index)}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow>
                                                <TableCell>
                                                    <div className='flex flex-row items-center space-x-1 justify-start mr-1 py-2'>
                                                        <div className='cursor-pointer flex flex-row items-center space-x-1' onClick={handleAddWithDraw}>
                                                            <span><FaPlusCircle className='text-blue-500' /></span>
                                                            <span className='text-sm text-blue-500 underline underline-offset-2'>เพิ่มข้อมูล</span>
                                                        </div>
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
                                    <span className='text-red-500 font-bold'>{sumTotal.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</span>
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
                        <Button color="primary"
                            isDisabled={isDisabled || list.length === 0}
                            onPress={() => {
                                onClose();
                                handleEdit();
                            }}>
                            ยืนยันการแก้ไข
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Toaster richColors position='bottom-left' />
        </div>
    );
}

export default ModalEdid
