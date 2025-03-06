import { Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import React, { useContext, useEffect, useState } from 'react'
import { URLS } from '../../../../config';
import fetchProtectedData from '../../../../../utils/fetchData';
import ModalViewWithDraw from '../OtherExpensesModal/ModalViewWithDraw';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ModalEditWithDraw from '../OtherExpensesModal/ModalEditWithDraw';
import { Data } from '../../TabsExpense/TabsOthersCost';
import ModalDeleteWithDraw from '../OtherExpensesModal/ModalDeleteWithDraw';

function WithDraw() {

    const { isAddWithDraw, setIsAddWithDraw, searchWithDraw, setSearchWithDraw, searchDateWithDraw, setSearchDateWithDraw, searchDepartment, currentUser, selectAgentFromModal, setSelectAgentFromModal } = useContext(Data)

    const [data, setData] = useState([])
    const [selectData, setSelectData] = useState([])
    const [viewModal, setViewModal] = useState(false)
    const [EditModal, setEditModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [isDelete, setIsDelete] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const fetchData = async () => {
        setIsLoading(true)
        const url = `${URLS.OTHEREXPENSES}/getWithDraw`
        try {
            const res = await fetchProtectedData.get(url)
            setData(res.data)
        } catch (error) {
            console.log('ไม่สามารถดึงข้อมูลได้', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        if (isAddWithDraw) {
            fetchData()
            setIsAddWithDraw(false)
        }
    }, [isAddWithDraw])

    useEffect(() => {
        if (isDelete) {
            fetchData()
            setIsDelete(false)
        }
    }, [isDelete])

    useEffect(() => {
        if (isEdit) {
            fetchData()
            setIsEdit(false)
        }
    }, [isEdit])

    const months = {
        1: 'มกราคม',
        2: 'กุมภาพันธ์',
        3: 'มีนาคม',
        4: 'เมษายน',
        5: 'พฤษภาคม',
        6: 'มิถุนายน',
        7: 'กรกฎาคม',
        8: 'สิงหาคม',
        9: 'กันยายน',
        10: 'ตุลาคม',
        11: 'พฤศจิกายน',
        12: 'ธันวาคม'
    };

    const handleFormatDate = (item, field) => {
        const date = new Date(field === 'create' ? item.create_Date : item.update_Date)
        const day = date.getDate()
        const month = date.getMonth() + 1
        const year = date.getFullYear()
        return `${day} ${months[month]} ${year}`
    }

    const handleOpenModal = (topic, item) => {
        if (topic === 'view') {
            setSelectData(item)
            setViewModal(true)
        }
        if (topic === 'edit') {
            setSelectData(item)
            setEditModal(true)
        }
        if (topic === 'delete') {
            setSelectData(item)
            setDeleteModal(true)
        }
    }

    const handleCloseModal = (item) => {
        if (item === 'view') setViewModal(false)
        if (item === 'edit') setEditModal(false)
        if (item === 'delete') setDeleteModal(false)
    }

    const filterByDateRange = (itemDate) => {
        if (!searchDateWithDraw || !searchDateWithDraw.start || !searchDateWithDraw.end) {
            return true;
        }

        const startDate = new Date(searchDateWithDraw.start.year, searchDateWithDraw.start.month - 1, searchDateWithDraw.start.day);
        const endDate = new Date(searchDateWithDraw.end.year, searchDateWithDraw.end.month - 1, searchDateWithDraw.end.day);
        const itemDateObj = new Date(itemDate);
        return itemDateObj >= startDate && itemDateObj <= endDate;
    };

    const searchData = data.filter(item => {
        const bid = item.businessId === selectAgentFromModal.toString()
        const matchesSearchText = item.lists.some(a =>
            a.list.toLowerCase().includes(searchWithDraw.toLowerCase())
        );

        const matchesDateRange = filterByDateRange(item.create_Date);
        const matchesDepartment = searchDepartment === 'ทั้งหมด' || item.department === searchDepartment;

        return matchesSearchText && matchesDateRange && matchesDepartment && bid;
    });

    const calculateSummaryAndCountByDate = () => {
        const totalAmount = searchData
            .filter(e => e.businessId === selectAgentFromModal.toString())
            .flatMap(item => item.lists)
            .reduce((sum, entry) => sum + (parseFloat(entry.totalAmount) || 0), 0);

        const count = searchData.length;

        return {
            totalAmount: totalAmount.toLocaleString(),
            // totalAmount: new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalAmount),
            count: count
        };
    };

    return (
        <div className='mt-4' >

            <div className='flex flex-row space-x-8 px-6 py-3 mb-3'>
                <div className='flex flex-col'>
                    <span className='text-slate-500 text-sm'>ยอดรวม</span>
                    <span className='text-2xl'>{calculateSummaryAndCountByDate().totalAmount || 0}</span>
                </div>

                <div className='border-1 h-12 ms-5'></div>

                <div className='flex flex-col text-sm'>
                    <span className='text-slate-500'>จำนวนรายการ</span>
                    <span className='text-2xl'>{calculateSummaryAndCountByDate().count || 0}</span>
                </div>
            </div>

            <div className='rounded-xl' style={{ overflow: 'hidden' }}>
                <Table className='table w-full text-center text-slate-600' shadow='none'>
                    <TableHeader className='bg-slate-100'>
                        <TableColumn>แผนก</TableColumn>
                        <TableColumn>รายละเอียด</TableColumn>
                        <TableColumn>รายการ</TableColumn>
                        <TableColumn>ยอดรวม</TableColumn>
                        <TableColumn>Remark</TableColumn>
                        <TableColumn>สร้างโดย</TableColumn>
                        <TableColumn>วันที่สร้าง</TableColumn>
                        <TableColumn>อัพเดทโดย</TableColumn>
                        <TableColumn>วันที่อัพเดท</TableColumn>
                        <TableColumn></TableColumn>
                    </TableHeader>

                    <TableBody items={searchData} className='text-sm' isLoading={isLoading} loadingContent={<Spinner />}>
                        {item => (
                            <TableRow key={item.id} className='hover:bg-slate-50 cursor-pointer h-12' onPress={() => handleOpenModal('view', item)}>
                                <TableCell>{item.department}</TableCell>
                                <TableCell>{item.descriptions || '-'}</TableCell>
                                <TableCell>{item.lists.map(subItem => subItem.list).join(' , ')}</TableCell>
                                <TableCell>
                                    {new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                                        item.lists.reduce((sum, entry) => sum + parseFloat(entry.totalAmount || 0), 0)
                                    )}
                                </TableCell>
                                <TableCell>{item.remark || '-'}</TableCell>
                                <TableCell>{item.create_By}</TableCell>
                                <TableCell>{handleFormatDate(item, 'create') || '-'}</TableCell>
                                <TableCell>{item.update_By || '-'}</TableCell>
                                <TableCell>{item.update_Date ? handleFormatDate(item, 'update') : '-'}</TableCell>
                                <TableCell>
                                    <div className='flex items-center space-x-2'>
                                        <FaEdit className='hover:scale-150 transition ease-in duration-150 text-yellow-500' onPress={(e) => { e.stopPropagation(); handleOpenModal('edit', item); }} size={18} />
                                        <FaTrash className='hover:scale-150 transition ease-in duration-150 text-red-500' onPress={(e) => { e.stopPropagation(); handleOpenModal('delete', item); }} size={18} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}

                    </TableBody>


                </Table>
            </div>
            {viewModal && (
                <ModalViewWithDraw
                    isOpen={viewModal}
                    onClose={() => handleCloseModal('view')}
                    data={selectData}
                />
            )}
            {EditModal && (
                <ModalEditWithDraw
                    isOpen={EditModal}
                    onClose={() => handleCloseModal('edit')}
                    data={selectData}
                    setIsEdit={setIsEdit}
                />
            )}
            {deleteModal && (
                <ModalDeleteWithDraw
                    isOpen={deleteModal}
                    onClose={() => handleCloseModal('delete')}
                    data={selectData}
                    setIsDelete={setIsDelete}
                />
            )}
        </div>



    )
}

export default WithDraw
