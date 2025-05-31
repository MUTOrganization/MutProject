import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal"
import { Button, Tooltip } from "@heroui/react"
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table"
import React, { useContext, useEffect, useState } from 'react'
import { FaBan, FaCheck, FaEdit, FaTrash } from 'react-icons/fa'
import ModalActionType from './ModalActionType'
import fetchProtectedData from '@/utils/fetchData'
import { Data } from '../../TabsExpense/TabsOthersCost'

function ModalManageTypeExpenses({ isOpen, onClose, getTypeData }) {

    const { typeData } = useContext(Data);

    const [action, setAction] = useState('')
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [selectData, setSelectData] = useState('')
    const [id, setId] = useState(null)
    const [isCloseType, setIsCloseType] = useState(null)

    const tableColumn = [
        { key: 'name', text: 'ประเภท' },
        // { key: 'create_By', text: 'ผู้สร้าง' },
        { key: 'create_Date', text: 'วันที่สร้าง' },
        { key: 'status', text: 'สถานะ' },
        { key: 'action', text: '' },
    ]

    const handleOpenModal = (action, typeName, expensesTypeId, status) => {
        setAction(action)
        setSelectData(typeName)
        setId(expensesTypeId)
        setIsCloseType(status)
        setIsOpenModal(true)
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} size='2xl' className="overflow-hidden">
            <ModalContent className='space-y-5'>
                <ModalHeader className='text-slate-600'>จัดการประเภทค่าใช้จ่าย</ModalHeader>
                <ModalBody className=''>
                    <Table
                        className='h-42 max-h-[720px] rounded-md overflow-y-auto overflow-x-auto scrollbar-hide'
                        isStriped
                        isHeaderSticky
                        removeWrapper
                    >
                        <TableHeader columns={tableColumn}>
                            {(columns) => (
                                <TableColumn
                                    key={columns.name}
                                    className={`text-sm text-center`}
                                >
                                    {columns.text}
                                </TableColumn>
                            )}
                        </TableHeader>

                        <TableBody emptyContent='ไม่พบข้อมูลประเภทค่าใช้จ่าย'>
                            {typeData.map((data, index) => (
                                <TableRow key={`${data.username}-${index}`} className='text-center text-slate-600'>
                                    <TableCell className='text-center'>{data.typeName}</TableCell>
                                    {/* <TableCell className='text-center'>{data.create_By}</TableCell> */}
                                    <TableCell className='text-center'>{new Date(data.createdDate).toLocaleDateString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit' })}</TableCell>
                                    <TableCell className={`text-center ${data.status ? 'text-green-500' : 'text-red-500'}`}>{data.status ? 'ใช้งานอยู่' : 'ปิดการใช้งาน'}</TableCell>
                                    <TableCell className='text-center'>
                                        <div className='flex justify-center space-x-4'>
                                            <span onClick={() => handleOpenModal('edit', data.typeName, data.expensesTypeId, data.status)} className='cursor-pointer hover:scale-150 transition ease-in duration-150'><FaEdit size={16} className='text-yellow-500' /></span>
                                            <Tooltip content={data?.status ? 'ปิดการใช้งาน' : 'เปิดการใช้งาน'} placement="right">
                                                <span onClick={() => handleOpenModal('close', data.typeName, data.expensesTypeId, data.status)} className='cursor-pointer hover:scale-150 transition ease-in duration-150'>{data?.status ? <FaBan size={16} className='text-red-400' /> : <FaCheck size={16} className='text-green-400' />}</span>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <hr />
                </ModalBody>
                <ModalFooter>
                    <Button size='sm' color="danger" variant="light" onPress={() => { onClose(); }}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>

            {isOpenModal && (
                <ModalActionType
                    isOpen={isOpenModal}
                    onClose={() => setIsOpenModal(false)}
                    action={action}
                    selectData={selectData}
                    id={id}
                    setIsCloseType={setIsCloseType}
                    isCloseType={isCloseType}
                    typeData={typeData}
                    getTypeData={getTypeData}
                />
            )}

        </Modal>
    )
}

export default ModalManageTypeExpenses
