import React from 'react'
import { Button, Modal, ModalBody, ModalContent, ModalHeader, Textarea, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { URLS } from '@/config';
import fetchProtectedData from '@/utils/fetchData';
import { toast, Toaster } from 'sonner';

function ModalDelete({ isOpen, onClose, data, alreadyDelete }) {
    console.log(data)
    const handleDelete = async () => {
        const urlDelete = `${URLS.OTHEREXPENSES}/deleteExpenses`
        try {
            await fetchProtectedData.post(urlDelete, {
                id: data.id
            }).then(response => {
                console.log("Edit successful:", response.data);
            })
        } catch (error) {
            console.log('Something Wrong', error)
        } finally {
            alreadyDelete(true)
            toast.success('ลบข้อมูลสำเร็จ')
        }
    }

    return (
        <div>
            <Modal isOpen={isOpen} onOpenChange={onClose} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent className='max-w-xl'>

                    <ModalHeader>
                        <div className='flex flex-col mb-4'>
                            <span className='text-xl'>ลบข้อมูล</span>
                            {data.update_By && data.update_Date && (
                                <>
                                    <span className='text-slate-400 text-sm pt-2'>อัพเดทโดย : {data.update_By}</span>
                                </>
                            )}
                            <span></span>
                        </div>
                    </ModalHeader>

                    <ModalBody>
                        <div className='form space-y-8'>
                            <div className='flex flex-row'>
                                <div className="flex w-full lg:flex-col gap-0 lg:gap-2 items-start">
                                    <label className="text-sm text-slate-500">วันที่กรอก</label>
                                    <input value={new Date(data.create_Date).toLocaleDateString()} disabled type="text" className='input input-sm input-bordered focus:outline-none w-full text-sm h-9' />
                                </div>
                            </div>


                            <div className="text-end text-sm text-slate-500 me-2">
                                <div className="text-center">
                                    <Table>
                                        <TableHeader className=''>
                                            <TableColumn className="text-center">รายการ</TableColumn>
                                            <TableColumn className="text-center">จำนวน</TableColumn>
                                            <TableColumn className="text-center">ราคา</TableColumn>
                                            <TableColumn className="text-center">ยอดรวม</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            {data.lists.map((item, index) => (
                                                <TableRow key={index} className=''>
                                                    <TableCell className="text-center">{item.list}</TableCell>
                                                    <TableCell className="text-center">{item.qty || '-'}</TableCell>
                                                    <TableCell className="text-center">{item.price}</TableCell>
                                                    <TableCell className="text-center">
                                                        {item.qty
                                                            ? (parseFloat(item.price || 0) * parseFloat(item.qty || 0)).toFixed(2)
                                                            : parseFloat(item.price || 0).toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="text-end text-sm py-3 text-slate-500 me-2">
                                    <span>ยอดรวม {new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                                        data.lists.reduce((sum, entry) => sum + parseFloat(entry.totalAmount || 0), 0)
                                    )} บาท</span>
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

                    <ModalFooter className='mt-4'>
                        <Button color="danger" variant='light' className='h-8 px-10' onPress={onClose}>
                            ยกเลิก
                        </Button>
                        <Button color="danger" className='h-8 px-10' onPress={() => { onClose(); handleDelete() }}>
                            ยืนยันการลบ
                        </Button>
                    </ModalFooter>

                </ModalContent>
            </Modal>
            <Toaster richColors position='bottom-left' />
        </div>
    )
}

export default ModalDelete
