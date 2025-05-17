import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal"
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Textarea } from "@heroui/react";
import React from 'react'
import { URLS } from '@/config';
import fetchProtectedData from '@/utils/fetchData';
import { toast } from 'sonner';

function ModalDeleteWithDraw({ isOpen, onClose, data, setIsDelete }) {

    const calculateTotalAmount = () => {
        const total = data.lists.reduce((sum, item) => {
            const qty = parseFloat(item.qty) || 0;
            const price = parseFloat(item.price) || 0;
            return sum + (qty * price);
        }, 0);
        return Number(total.toFixed(2)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    };

    const handleDelete = async () => {
        try {
            const url = `${URLS.OTHEREXPENSES}/deleteWithDraw`
            await fetchProtectedData.post(url, {
                id: data.id
            }).then(res => {
                console.log('Delete Success', res.data)
            })
        } catch (error) {
            console.log('Cannot Delete', error)
        } finally {
            setIsDelete(true)
            toast.success('ลบข้อมูลสำเร็จ')
        }
    }

    return (
        <div>
            <Modal isOpen={isOpen} onOpenChange={onClose} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent className='max-w-2xl'>
                    <ModalHeader>
                        <div className='flex flex-col mb-4 w-full'>
                            <span className='text-xl'>ลบข้อมูล</span>
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
                        <div className='space-y-7'>

                            <div className='row-1 flex flex-col lg:flex-row space-x-4'>
                                <div className="flex flex-col gap-2 w-full">
                                    <label className="text-sm text-slate-500">เลือกวันที่</label>
                                    <input disabled value={new Date(data.create_Date).toLocaleDateString()} type="text" className='input input-sm input-bordered focus:outline-none h-10 w-full' />
                                </div>
                                <div className='flex flex-col gap-2 w-8/12'>
                                    <label className="text-sm text-slate-500">แผนก</label>
                                    <input disabled value={data.department} type="text" className='input input-sm input-bordered h-10' />
                                </div>
                            </div>

                            <div className='row-2'>
                                <div className="flex flex-col gap-2 w-full">
                                    <label className="text-sm text-slate-500">รายละเอียดขอเบิก</label>
                                    <input disabled value={data.descriptions} type="text" className='input input-sm input-bordered focus:outline-none h-10 w-full' placeholder='รายละเอียด' />
                                </div>
                            </div>

                            <div className='row-3'>
                                <div className='rounded-t-xl'>
                                    <Table className='table w-full '>
                                        <TableHeader className='bg-slate-100'>
                                            <TableColumn className='text-center'>รายการ</TableColumn>
                                            <TableColumn className='text-center'>จำนวน</TableColumn>
                                            <TableColumn className='text-center'>ราคา</TableColumn>
                                            <TableColumn className='text-center'>ยอดรวม</TableColumn>
                                        </TableHeader>

                                        <TableBody items={data.lists} className='text-sm'>
                                            {data.lists.map((item, index) => (
                                                <TableRow key={index} className=''>
                                                    <TableCell className='text-center'>{item.list}</TableCell>
                                                    <TableCell className='text-center'>{item.qty}</TableCell>
                                                    <TableCell className='text-center'>{item.price}</TableCell>
                                                    <TableCell className='text-center'>{(item.qty && item.price) ? (item.qty * item.price).toFixed(2) : '0.00'}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className='text-end text-sm py-3 text-slate-500 me-2'>
                                    <span>ยอดรวม {calculateTotalAmount()} บาท</span>
                                </div>
                            </div>

                            <div className='row-4 flex flex-col gap-2'>
                                <label className="text-sm text-slate-500">หมายเหตุ (ถ้ามี)</label>
                                <Textarea
                                    value={data.remark}
                                    labelPlacement="outside"
                                    placeholder="Enter your description"
                                    className="max-w-full"
                                />
                            </div>

                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button color="danger" variant='light' className='h-8 rounded-md px-8' onPress={() => { onClose() }}>
                            ยกเลิก
                        </Button>
                        <Button color="danger" className='h-8 rounded-md px-8' onPress={() => { onClose(); handleDelete() }}>
                            ยืนยันการลบข้อมูล
                        </Button>
                    </ModalFooter>

                </ModalContent>
            </Modal>
        </div>
    )
}

export default ModalDeleteWithDraw
