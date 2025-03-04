import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal'
import { Button } from '@nextui-org/react'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table'
import React, { useContext, useEffect, useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import ModalActionType from './ModalActionType'
import { URLS } from '../../../../config'
import fetchProtectedData from '../../../../../utils/fetchData'
import { Data } from '../../TabsExpense/TabsOthersCost'

function ModalManageTypeExpenses({ isOpen, onClose, setIsManageType, setIsOpenManageTypeModal }) {

    const { setIsAdd, search, setSearch, selectDate, setSelectDate, isSwap,
        setIsSwap, setIsAddWithDraw, searchWithDraw, setSearchWithDraw,
        searchDateWithDraw, setSearchDateWithDraw, searchDepartment, setSearchDepartment,
        currentUser, selectAgentFromModal, setSelectAgentFromModal,
        typeData, setTypeData, isManageType } = useContext(Data);

    const [action, setAction] = useState('')
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [selectData, setSelectData] = useState('')
    const [id, setId] = useState(null)
    const [isAction, setIsAction] = useState(false)
    const [data, setData] = useState([])

    const tableColumn = [
        { key: 'name', text: 'ประเภท' },
        { key: 'create_By', text: 'ผู้สร้าง' },
        { key: 'create_Date', text: 'วันที่สร้าง' },
        { key: 'update_By', text: 'ผู้อัพเดท' },
        { key: 'action', text: '' },
    ]

    const handleOpenModal = (item, topic, id) => {
        setId(id)
        setSelectData(topic)
        setAction(item)
        setIsOpenModal(true)
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} size='2xl'>
            <ModalContent className='space-y-5'>
                <ModalHeader>จัดการประเภทค่าใช้จ่าย</ModalHeader>
                <ModalBody className=''>
                    <Table
                        isStriped
                        className='h-42 max-h-[720px] rounded-md overflow-y-auto overflow-x-auto scrollbar-hide'
                        isHeaderSticky
                        removeWrapper>
                        <TableHeader columns={tableColumn}>
                            {(columns) => (
                                <TableColumn
                                    key={columns.name}
                                    className={`text-sm text-center`}
                                    allowsSorting={true}
                                >
                                    {columns.text}
                                </TableColumn>
                            )}
                        </TableHeader>

                        <TableBody>
                            {typeData.map((data, index) => (
                                <TableRow key={`${data.username}-${index}`} className='text-center text-slate-600'>
                                    <TableCell className='text-center'>{data.typeExpenses}</TableCell>
                                    <TableCell className='text-center'>{data.create_By}</TableCell>
                                    <TableCell className='text-center'>{new Date(data.create_Date).toLocaleDateString()}</TableCell>
                                    <TableCell className='text-center'>{data.update_By || '-'}</TableCell>
                                    <TableCell className='text-center'>
                                        <div className='flex justify-center space-x-4'>
                                            <span onPress={() => handleOpenModal('edit', data.typeExpenses, data.id)} className='cursor-pointer hover:scale-150 transition ease-in duration-150'><FaEdit size={16} className='text-yellow-500' /></span>
                                            <span onPress={() => handleOpenModal('delete', data.typeExpenses, data.id)} className='cursor-pointer hover:scale-150 transition ease-in duration-150'><FaTrash size={16} className='text-red-400' /></span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <hr />
                </ModalBody>
                <ModalFooter>
                    <Button size='sm' color="danger" variant="light" onPress={() => { setIsManageType(true); onClose(); }}>
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
                    setIsManageType={setIsManageType}
                    setIsAction={setIsAction}
                />
            )}

        </Modal>
    )
}

export default ModalManageTypeExpenses
