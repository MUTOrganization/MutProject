import React, { useState } from 'react'
import { Button, Checkbox, DatePicker, DateRangePicker, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure, ModalFooter, Textarea, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Select, SelectItem } from "@heroui/react";
import { formatNumber } from '@/component/FormatNumber';

function ModalManageOtherExpenses({ isOpen, onClose, data }) {
    return (
        <div>
            <Modal isOpen={isOpen} onOpenChange={onClose} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent className='max-w-2xl'>
                    <ModalHeader>
                        <div className='flex flex-col w-full'>
                            <span className='text-xl'>รายละเอียดข้อมูล <span className='text-sm text-slate-500'> รายการ {data?.remarks}</span> </span>
                        </div>
                    </ModalHeader>

                    <ModalBody>
                        <div className='form space-y-8'>

                            <div className='flex flex-row'>
                                <div className="flex w-full lg:flex-col gap-0 lg:gap-2 items-start">
                                    <label className="text-sm text-slate-500">วันที่กรอก</label>
                                    <Input value={new Date(data.createdDate).toLocaleDateString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit' })} isDisabled />
                                </div>
                            </div>

                            <div className='w-full text-end'>
                                <Select
                                    selectedKeys={[String(data?.expensesType.typeName)]}
                                    isDisabled
                                    variant='bordered'
                                    className="w-48"
                                    size="sm"
                                    label="ประเภท"
                                >
                                    <SelectItem key={data?.expensesType.typeName} value={data?.expensesType.typeName}>
                                        {data?.expensesType.typeName}
                                    </SelectItem>
                                </Select>
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
                                                    <TableCell className="text-center">{formatNumber(item.price)}</TableCell>
                                                    <TableCell className="text-center">{formatNumber(Number(item.price) * Number(item.qty || 1))}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="flex flex-row items-center justify-end space-x-4 py-3">
                                    <span>ยอดรวม</span>
                                    <span className='text-red-500 font-semibold'>{data?.totalAmount.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</span>
                                    <span>บาท</span>
                                </div>
                            </div>


                            <div className='row-4 flex flex-col gap-2'>
                                <label className="text-sm text-slate-500">หมายเหตุ</label>
                                <Textarea
                                    value={data?.remarks}
                                    disabled
                                    labelPlacement="outside"
                                    placeholder="Enter your description"
                                    className="max-w-full"
                                />
                            </div>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button color="danger" className='h-8 px-10' onPress={onClose}>
                            ปิด
                        </Button>
                    </ModalFooter>

                </ModalContent>
            </Modal >
        </div >
    )
}

export default ModalManageOtherExpenses
