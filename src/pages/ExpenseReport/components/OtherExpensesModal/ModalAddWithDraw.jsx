import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal'
import { Button, DateRangePicker, Select, SelectItem, Textarea } from '@nextui-org/react'
import React, { useContext, useState } from 'react'
import { FaPlusCircle, FaTrash } from 'react-icons/fa'
import { URLS } from '../../../../config'
import fetchProtectedData from '../../../../../utils/fetchData'
import { useAppContext } from '../../../../contexts/AppContext'
import { Data } from '../../TabsExpense/TabsOthersCost'
import { list } from 'postcss'
import { toast, Toaster } from 'sonner'

function ModalAddWithDraw({ isOpen, onClose, setIsAddWithDraw, selectedAgent }) {

    const { currentUser } = useAppContext();

    const { isAddWithDraw } = useContext(Data)

    const [list, setList] = useState([{ list: null, qty: null, price: null, totalAmount: null }])
    const [date, setdate] = useState(new Date().toISOString().split('T')[0])
    const [department, setDepartment] = useState('CRM')
    const [description, setDescription] = useState(null)
    const [remark, setRemark] = useState(null)

    const departments = ["CRM", "SALE", "ADS", "Data & MARKETING", "ACC", "IT", "HR", "GM"];

    const handleAddWithDraw = () => {
        setList(prev => [...prev, { list: null, qty: null, price: null, totalAmount: null }])
    }

    const handleDeleteWithDraw = (index) => {
        setList(prev => prev.filter((_, i) => i !== index));
    }

    const calculateTotalAmount = () => {
        return list.reduce((sum, item) => {
            const qty = parseFloat(item.qty) || 0;
            const price = parseFloat(item.price) || 0;
            return sum + (qty * price);
        }, 0).toFixed(2);
    };

    const handleAddData = async () => {

        let l = list.map(e => e.list)
        let q = list.map(e => e.qty)
        let t = list.map(e => e.price)

        if (list.length === 0 || l.includes(null) || l.includes('') || q.includes(null) || q.includes('') || t.includes(null) || t.includes('')) {
            return toast.error('กรุณากรอกรายการค่าใช้จ่ายและจำนวนเงินให้ถูกต้อง');
        } else {
            const url = `${URLS.OTHEREXPENSES}/addWithDraw`
            try {
                const res = await fetchProtectedData.post(url, {
                    user: currentUser.userName,
                    businessId: selectedAgent,
                    date: date,
                    department: department,
                    description: description,
                    lists: list,
                    remark: remark
                });
                console.log('SUccess', res.data)
            } catch (error) {
                console.log('Error', error)
            } finally {
                setIsAddWithDraw(true)
                toast.success('เพิ่มข้อมูลสำเร็จ')
            }
        }


    }

    return (
        <div>
            <Modal isOpen={isOpen} onOpenChange={onClose} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent className='max-w-3xl'>

                    <ModalHeader>
                        <span className='text-xl'>ขอเบิก</span>
                        {/* <button onPress={() => setIsAddWithDraw(!isAddWithDraw)}>Click</button> */}
                    </ModalHeader>

                    <ModalBody>
                        <div className='container-modal space-y-7'>

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
                                    <input onChange={(e) => setDescription(e.target.value)} type="text" className='input input-sm input-bordered focus:outline-none h-10 w-full' placeholder='รายละเอียด' />
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
                                                        <input
                                                            value={item.qty}
                                                            onChange={(e) => {
                                                                const updatedList = [...list];
                                                                updatedList[index].qty = e.target.value;
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
                                                        {index > 0 && (
                                                            <FaTrash size={16} className='text-red-500 cursor-pointer hover:scale-150 transition duration-150 ease-in' onPress={() => handleDeleteWithDraw(index)} />
                                                        )}
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
                            isDisabled={list.some(e =>
                                e.list === null || e.list.trim() === '' ||
                                e.qty === null || e.qty.trim() === '' ||
                                e.price === null || e.price.trim() === ''
                            ) && list.length === 0}
                            onPress={() => {
                                onClose();
                                handleAddData();
                            }}>
                            ยืนยัน
                        </Button>
                    </ModalFooter>

                </ModalContent>
            </Modal>
            {/* <Toaster richColors position='bottom-left' /> */}

        </div >
    )
}

export default ModalAddWithDraw
