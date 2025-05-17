import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal"
import { Button, Textarea } from "@heroui/react"
import React, { useState } from 'react'
import { FaPlusCircle, FaTrash } from 'react-icons/fa'
import { URLS } from '@/config'
import fetchProtectedData from '@/utils/fetchData'
import { useAppContext } from '@/contexts/AppContext'
import { toast, Toaster } from 'sonner'

function ModalEditWithDraw({ isOpen, onClose, data, setIsEdit }) {

    const { currentUser } = useAppContext();
    const [list, setList] = useState(data.lists)
    const [date, setdate] = useState(new Date(data.create_Date).toISOString().split('T')[0])
    const [department, setDepartment] = useState(data.department)
    const [description, setDescription] = useState(data.descriptions)
    const [remark, setRemark] = useState(data.remark)

    const departments = ["CRM", "SALE", "ADS", "Data & MARKETING", "ACC", "IT", "HR", "GM"];

    const handleAddWithDraw = () => {
        setList(prev => [...prev, { list: null, qty: null, price: null, totalAmount: null }])
    }

    const handleDeleteWithDraw = (index) => {
        setList(prev => prev.filter((_, i) => i !== index));
    }

    const calculateTotalAmount = () => {
        const total = list.reduce((sum, item) => {
            const qty = parseFloat(item.qty) || 0;
            const price = parseFloat(item.price) || 0;
            return sum + (qty * price);
        }, 0);
        return Number(total.toFixed(2)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    };

    const handleEdit = async () => {
        let l = list.map(e => e.list)
        let q = list.map(e => e.qty)
        let t = list.map(e => e.price)

        if (list.length === 0 || l.includes(null) || l.includes('') || q.includes(null) || q.includes('') || t.includes(null) || t.includes('')) {
            return toast.error('กรุณากรอกรายการค่าใช้จ่ายและจำนวนเงินให้ถูกต้อง');
        } else {
            console.log('success')
        }
        const url = `${URLS.OTHEREXPENSES}/editWithDraw`
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
        !e.qty || e.qty.trim() === '' ||
        !e.price || e.price.trim() === ''
    );

    return (
        <div>
            <Modal isOpen={isOpen} onOpenChange={onClose} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent className='max-w-2xl'>
                    <ModalHeader>
                        <div className='flex flex-col mb-4 w-full'>
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
                    <ModalBody className='space-y-4'>
                        <div className='row-1 flex flex-col lg:flex-row space-x-4'>
                            <div className="flex flex-col gap-2 w-full">
                                <label className="text-sm text-slate-500">เลือกวันที่</label>
                                <input onChange={(e) => setdate(e.target.value)} value={date} type="date" className='input input-sm input-bordered focus:outline-none h-10 w-full' />
                            </div>
                            <div className='flex flex-col gap-2 w-8/12'>
                                <label className="text-sm text-slate-500">แผนก</label>
                                <select name="" onChange={(e) => setDepartment(e.target.value)} value={department} className='select select-sm h-10 select-bordered' id="">
                                    {departments.map((i, x) => (
                                        <>
                                            <option key={x} value={i}>{i}</option>
                                        </>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className='row-2'>
                            <div className="flex flex-col gap-2 w-full">
                                <label className="text-sm text-slate-500">รายละเอียดขอเบิก</label>
                                <input onChange={(e) => setDescription(e.target.value)} value={description} type="text" className='input input-sm input-bordered focus:outline-none h-10 w-full' placeholder='รายละเอียด' />
                            </div>
                        </div>

                        <div className='row-3'>
                            <div className='rounded-xl' style={{ overflow: 'hidden' }}>
                                <table className='table w-full'>
                                    <thead className='bg-[#F3F3F3] border-b-2 border-slate-200'>
                                        <tr className='text-sm'>
                                            <th>รายการ</th>
                                            <th>จำนวน</th>
                                            <th>ราคา</th>
                                            <th>ยอดรวม</th>
                                            <th></th>
                                        </tr>
                                    </thead>

                                    <tbody className='text-sm bg-slate-100 '>
                                        {list.map((item, index) => (
                                            <tr key={index} className=''>
                                                <td className='w-4/12'>
                                                    <input value={item.list}
                                                        onChange={(e) => {
                                                            const updatedList = [...list];
                                                            updatedList[index].list = e.target.value;
                                                            setList(updatedList);
                                                        }}
                                                        type="text" className='input input-sm input-bordered focus:outline-none w-full' maxLength={45} />
                                                </td>
                                                <td className='w-2/12'>
                                                    <input value={item.qty}
                                                        onChange={(e) => {
                                                            const updatedList = [...list];
                                                            updatedList[index].qty = e.target.value;
                                                            setList(updatedList);
                                                        }}
                                                        type="text" className='input input-sm input-bordered focus:outline-none w-full' maxLength={45}
                                                        onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Delete') {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        pattern="[0-9]*"
                                                    />
                                                </td>
                                                <td className='w-3/12'>
                                                    <input value={item.price}
                                                        onChange={(e) => {
                                                            const updatedList = [...list];
                                                            updatedList[index].price = e.target.value;
                                                            updatedList[index].totalAmount = (updatedList[index].qty * updatedList[index].price).toFixed(2);
                                                            setList(updatedList);
                                                        }}
                                                        type="text" className='input input-sm input-bordered focus:outline-none w-full' maxLength={45}
                                                        onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Delete') {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        pattern="[0-9]*"
                                                    />
                                                </td>
                                                <td>
                                                    {(item.qty && item.price) ? (item.qty * item.price).toFixed(2) : '0.00'}
                                                </td>
                                                <td>
                                                    <FaTrash size={16} className='text-red-500 cursor-pointer hover:scale-150 transition duration-150 ease-in' onPress={() => handleDeleteWithDraw(index)} />
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan={5}>
                                                <div className='flex flex-row items-center space-x-1 justify-start mr-1'>
                                                    <div className='cursor-pointer flex flex-row items-center space-x-1' onPress={handleAddWithDraw}>
                                                        <span><FaPlusCircle className='text-blue-500' /></span>
                                                        <span className='text-sm text-blue-500 underline underline-offset-2'>เพิ่มข้อมูล</span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className='text-end text-sm py-2 text-slate-500'>
                                <span>ยอดรวม {calculateTotalAmount()} บาท</span>
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
        </div>
    );
}

export default ModalEditWithDraw
