import React, { useContext, useState } from 'react'
import { Button, Checkbox, DatePicker, DateRangePicker, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure, ModalFooter, Textarea, Table, TableHeader, SelectItem , TableColumn, Select ,TableBody, TableRow, TableCell } from '@nextui-org/react';
import { defaultDate } from '../../../../component/DateUtiils';
import { FaPlus, FaPlusCircle, FaTrash } from 'react-icons/fa';
import { URLS } from '../../../../config';
import fetchProtectedData from '../../../../../utils/fetchData';
import { useAppContext } from '../../../../contexts/AppContext';
import { Data } from '../../TabsExpense/TabsOthersCost';
import { toast, Toaster } from 'sonner';



function ModalEdid({ isOpen, onClose, data, setIsEdit , typeData }) {
    const { currentUser } = useAppContext();
    const [list, setList] = useState(data.lists)
    const [date, setdate] = useState(new Date(data.create_Date).toISOString().split('T')[0])
    const [department, setDepartment] = useState(data.department)
    const [description, setDescription] = useState(data.descriptions)
    const [remark, setRemark] = useState(data.remark)
    const [selectType, setSelectType] = useState('')

    const handleAddWithDraw = () => {
        setList(prev => [...prev, { list: null, qty: null, price: null, totalAmount: null }])
    }

    const handleDeleteWithDraw = (index) => {
        setList(prev => prev.filter((_, i) => i !== index));
    }

    const handleEdit = async () => {
        const url = `${URLS.OTHEREXPENSES}/editExpenses`
        try {
            const res = await fetchProtectedData.post(url, {
                id: data.id,
                user: data.create_By,
                lists: list,
                date: date,
                department: department,
                description: description,
                remark: remark,
                user_update: currentUser.userName
            })
            console.log('EditData success')
        } catch (error) {
            console.log('Error'.error)
        } finally {
            setIsEdit(true)
            toast.success('แก้ไขข้อมูลสำเร็จ')
        }
    }

    const isDisabled = list.some(e =>
        !e.list || e.list.trim() === '' ||
        // !e.qty || e.qty.trim() === '' ||
        !e.price || e.price.trim() === ''
    );

    const handleChange = (selectedKey) => {
        let getKey = selectedKey.target.value
        const findValueById = typeData.find(e => String(e?.id) === String(getKey));
        setSelectType(findValueById?.id)
    };

    return (
        <div>
            <Modal isOpen={isOpen} onOpenChange={onClose} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent className='max-w-2xl'>
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
                                    <input value={date} onChange={(e) => setdate(e.target.value)} type="date" className='input input-sm focus:outline-none w-full border-1 border-slate-200 px-2 rounded-md text-sm h-9' />
                                </div>
                            </div>

                            <div className='flex justify-end mb-3'>
                                <Select
                                    label='เลือกประเภท'
                                    // placeholder="ประเภท"
                                    color="primary"
                                    className="w-48"
                                    size="sm"
                                    onChange={handleChange}
                                >
                                    {typeData.map((item) => (
                                        <SelectItem key={item.id} value={item.typeExpenses}>
                                            {item.typeExpenses}
                                        </SelectItem>
                                    ))}
                                </Select>
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

                                        <TableBody className='text-sm bg-slate-100 '>
                                            {list.map((item, index) => (
                                                <TableRow key={index} className=''>
                                                    <TableCell className='w-4/12'>
                                                        <input
                                                            value={item.list}
                                                            onChange={(e) => {
                                                                const updatedList = [...list];
                                                                updatedList[index].list = e.target.value;
                                                                setList(updatedList);
                                                            }}
                                                            type="text"
                                                            className='input input-sm input-bordered focus:outline-none w-full'
                                                            maxLength={45}
                                                        />
                                                    </TableCell>
                                                    <TableCell className='w-2/12'>
                                                        <input
                                                            value={item.qty}
                                                            onChange={(e) => {
                                                                const updatedList = [...list];
                                                                updatedList[index].qty = e.target.value;
                                                                updatedList[index].totalAmount = updatedList[index].qty
                                                                    ? (updatedList[index].qty * updatedList[index].price || 0).toFixed(2)
                                                                    : updatedList[index].price || 0;

                                                                setList(updatedList);
                                                            }}
                                                            type="text"
                                                            className='input input-sm input-bordered focus:outline-none w-full'
                                                            maxLength={45}
                                                            onKeyDown={(e) => {
                                                                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Delete') {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                            pattern="[0-9]*"
                                                        />
                                                    </TableCell>
                                                    <TableCell className='w-3/12'>
                                                        <input
                                                            value={item.price}
                                                            onChange={(e) => {
                                                                const updatedList = [...list];
                                                                updatedList[index].price = e.target.value;

                                                                updatedList[index].totalAmount = updatedList[index].qty
                                                                    ? (updatedList[index].qty * updatedList[index].price || 0).toFixed(2)
                                                                    : updatedList[index].price || 0;

                                                                setList(updatedList);
                                                            }}
                                                            type="text"
                                                            className='input input-sm input-bordered focus:outline-none w-full'
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
                                                        <span>{item.totalAmount || '0.00'}</span>
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
                                                    <div className='flex flex-row items-center space-x-1 justify-start mr-1'>
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
                                <div className='text-end text-sm py-2 text-slate-500'>
                                    <span>ยอดรวม {new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                                        data.lists.reduce((sum, entry) => sum + parseFloat(entry.totalAmount || 0), 0)
                                    )} บาท</span>
                                </div>
                            </div>

                            <div className='row-4 flex flex-col gap-2'>
                                <label className="text-sm text-slate-500">หมายเหตุ (ถ้ามี)</label>
                                <Textarea
                                    onChange={(e) => setRemark(e.target.value)}
                                    value={remark}
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
    )
}

export default ModalEdid
