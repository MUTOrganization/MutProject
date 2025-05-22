import React, { useContext, useEffect, useState } from 'react'
import fetchProtectedData from '@/utils/fetchData'
import { URLS } from '@/config';
import {
    Spinner,
    Table,
    TableCell,
    TableColumn,
    TableHeader,
    TableBody,
    TableRow,
    getKeyValue,
    SelectItem,
    Select
} from "@heroui/react";
import { Data } from '../../TabsExpense/TabsOthersCost';
import ModalManageOtherExpenses from '../OtherExpensesModal/ModalManageOtherExpenses';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ModalEdid from '../OtherExpensesModal/ModalEdid';
import ModalDelete from '../OtherExpensesModal/ModalDelete';
import { formatDateObject } from '@/utils/dateUtils';
import expensesService from '@/services/expensesService'
import { endOfMonth, startOfMonth, today } from '@internationalized/date';


export default function Contents({ isLoading }) {
    const { typeData, setTypeValue, filterData } = useContext(Data)

    const [selectData, setSelectData] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalEdit, setIsModalEdit] = useState(false)
    const [isDelete, setIsDelete] = useState(false)

    const handleChange = (selectedKey) => {
        if (selectedKey.target.value === 'all') {
            setTypeValue("ทั้งหมด")
        } else {
            let getKey = selectedKey.target.value
            const findValueById = typeData.find(e => String(e.expensesTypeId) === String(getKey));
            setTypeValue(findValueById.typeName)
        }
    };

    // #region RETURN   
    return (
        <div className='content-conteainer mt-4'>

            <div className='flex flex-row space-x-8 px-6 py-3 mb-3'>
                <div className='flex flex-col'>
                    <span className='text-slate-500 text-sm pb-2'>ยอดรวม</span>
                    <span className='text-2xl text-slate-600'>{filterData?.reduce((sum, item) => sum + item.totalAmount, 0).toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</span>
                </div>

                <div className='border-1 h-16 ms-5'></div>

                <div className='flex flex-col text-sm'>
                    <span className='text-slate-500 pb-2'>จำนวนรายการ</span>
                    <span className='text-2xl text-slate-600'>{filterData?.length || 0}</span>
                </div>
            </div>
            <div className='ps-4'>
                <Select
                    color="primary"
                    className="w-48"
                    size="sm"
                    label='ประเภท'
                    aria-label='ประเภท'
                    onChange={handleChange}
                    placeholder='ทั้งหมด'
                >
                    <SelectItem key="all" value="ทั้งหมด">
                        ทั้งหมด
                    </SelectItem>
                    {typeData?.filter(e => e.status === true).map((item) => (
                        <SelectItem key={item.expensesTypeId} value={item.typeName} className='text-slate-600'>
                            {item.typeName}
                        </SelectItem>
                    ))}
                </Select>
            </div>
            <div style={{ overflow: 'hidden' }}>
                <Table aria-label="Expenses Table" className="table w-full text-center text-slate-600" shadow='none'>
                    <TableHeader className="bg-slate-100">
                        <TableColumn>ประเภท</TableColumn>
                        <TableColumn>รายการ</TableColumn>
                        <TableColumn>ยอดรวม</TableColumn>
                        <TableColumn>วันที่สร้าง</TableColumn>
                        <TableColumn>Actions</TableColumn>
                    </TableHeader>
                    <TableBody items={filterData || []} isLoading={isLoading} emptyContent={<span>ไม่พบข้อมูล</span>} loadingContent={<Spinner />}>
                        {item => (
                            <TableRow key={item.expensesId} onClick={() => { setSelectData(item); setIsModalOpen(true); }} className="hover:bg-slate-50 cursor-pointer text-slate-600 h-12">
                                <TableCell>{item?.expensesType.typeName}</TableCell>
                                <TableCell >{item?.remarks}</TableCell>
                                <TableCell className='text-red-500 font-semibold'>{item?.totalAmount.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</TableCell>
                                <TableCell>{new Date(item?.createdDate).toLocaleDateString('th-GB', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Bangkok' })}</TableCell>
                                <TableCell>
                                    <div className="flex flex-row space-x-2 transition duration-200 ease-in">
                                        <FaEdit
                                            aria-label='แก้ไข'
                                            size={18}
                                            className="hover:scale-150 text-yellow-500 transition duration-100 ease-in"
                                            onClick={(e) => {
                                                {
                                                    e.stopPropagation();
                                                    setSelectData(item)
                                                    setIsModalEdit(true)
                                                }
                                            }}
                                        />
                                        <FaTrash
                                            aria-label='ลบ'
                                            size={18}
                                            className="hover:scale-150 text-red-400 transition duration-100 ease-in"
                                            onClick={(e) => {
                                                {
                                                    e.stopPropagation();
                                                    setSelectData(item)
                                                    setIsDelete(true)
                                                }
                                            }}
                                        />
                                    </div>

                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>


            {isModalOpen && (
                <ModalManageOtherExpenses
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    data={selectData}
                />
            )}

            {isModalEdit && (
                <ModalEdid
                    isOpen={isModalEdit}
                    onClose={() => setIsModalEdit(false)}
                    data={selectData}
                    typeData={typeData}
                />
            )}

            {isDelete && (
                <ModalDelete
                    isOpen={isDelete}
                    onClose={() => setIsDelete(false)}
                    data={selectData}
                />
            )}

        </div>
    )
}
