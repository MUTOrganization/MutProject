import React, { useContext } from 'react'
import { Button, Modal, ModalBody, ModalContent, ModalHeader, Textarea, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, ModalFooter } from "@heroui/react";
import { toast, Toaster } from 'sonner';
import expensesService from '@/services/expensesService';
import { Data } from '../../TabsExpense/TabsOthersCost';

function ModalDelete({ isOpen, onClose, data }) {

    const { getDataOtherExpenses } = useContext(Data)

    const handleDelete = async () => {
        try {
            await expensesService.deleteExpensesDetails(data.expensesId)
            await getDataOtherExpenses()
            toast.success('ลบข้อมูลสำเร็จ')
        } catch (error) {
            console.log('Something Wrong', error)
            toast.error('ลบข้อมูลไม่สำเร็จ เกิดข้อผิดพลาด')
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
                                <div className="w-full">
                                    <label className="text-sm text-slate-500">วันที่กรอก</label>
                                    <input value={new Date(data.expensesDate).toLocaleDateString()} disabled type="text" className='input input-sm input-bordered bg-slate-100 focus:outline-none w-full text-sm h-9 px-4 text-slate-500 rounded-md shadow-sm' />
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
                                            {data.details.map((item, index) => (
                                                <TableRow key={index} className=''>
                                                    <TableCell className="text-center">{item.name}</TableCell>
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
                                <div className="text-end text-sm py-3 text-slate-500 me-2 space-x-4">
                                    <span>ยอดรวม</span>
                                    <span className='text-red-500 font-bold'>{data.totalAmount.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</span>
                                    <span>บาท</span>
                                </div>
                            </div>



                            <div className='row-4 flex flex-col gap-2'>
                                <label className="text-sm text-slate-500">หมายเหตุ</label>
                                <Textarea
                                    value={data.remarks}
                                    disabled
                                    labelPlacement="outside"
                                    placeholder="Enter your description"
                                    className="max-w-full text-slate-500"
                                />
                            </div>
                        </div>
                    </ModalBody>

                    <ModalFooter className='mt-4'>
                        <Button color="danger" variant='light' className='h-8 px-10' onPress={onClose}>
                            ยกเลิก
                        </Button>
                        <Button color="danger" className='h-8 px-10' onPress={() => { handleDelete(); onClose(); }}>
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
