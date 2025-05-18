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


export default function Contents() {
    const { isAdd, setIsAdd, search, selectDate, data, setData, selectedAgent, typeData, isManageType, dateRange, currentUser, typeValue, setTypeValue } = useContext(Data)
    const [isLoading, setIsLoading] = useState(false)
    const [selectData, setSelectData] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalEdit, setIsModalEdit] = useState(false)
    const [isDelete, setIsDelete] = useState(false)
    const [selectDataDelete, setSelectDataDelete] = useState([])

    const [isEdit, setIsEdit] = useState(false)
    const [alreadyDelete, setAlreadyDelete] = useState(false)

    // Date

    const startDate = startOfMonth(today())
    const endDate = endOfMonth(today())
    const [expensesDate, setExpensesDate] = useState({
        startDate: startDate,
        endDate: endDate
    })

    const getDataOtherExpenses = async () => {
        setIsLoading(true)
        try {
            const res = await expensesService.getExpensesDetails(currentUser.agent.agentId, formatDateObject(expensesDate.startDate), formatDateObject(expensesDate.endDate))
            setData(res);
            setIsLoading(false)
        } catch (error) {
            console.error('ไม่สามารถดึงข้อมูลได้:', error);
        }
    }

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

    const filterByDateRange = (itemDate) => {
        if (!selectDate || !selectDate.start || !selectDate.end) {
            return true;
        }

        const startDate = new Date(selectDate.start.year, selectDate.start.month - 1, selectDate.start.day);
        const endDate = new Date(selectDate.end.year, selectDate.end.month - 1, selectDate.end.day);
        const itemDateObj = new Date(itemDate);
        return itemDateObj >= startDate && itemDateObj <= endDate;
    };

    // const calculateSummaryAndCountByDate = () => {
    //     const filteredData = data?.filter(item => filterByDateRange(item.expensesDate) && item.expensesType.agentId === selectedAgent.id.toString() && (value === 'ทั้งหมด' || item.expensesType.typeName === value));

    //    const totalAmount = filteredData.details.reduce((acc , item) => acc + item.)

    //     const count = filteredData.length;

    //     return {
    //         totalAmount: totalAmount.toLocaleString(),
    //         count: count
    //     };
    // };

    // const searchData = data?.filter(item => {
    //     const bid = item.businessId === selectedAgent.id.toString()
    //     const matchesSearchText = item.lists.some(a =>
    //         a.list.toLowerCase().includes(search.toLowerCase())
    //     );
    //     const matchesType = value === 'ทั้งหมด' || item.typeExpenses === value;
    //     const matchesDateRange = filterByDateRange(item.create_Date);

    //     return matchesSearchText && matchesType
    // });

    useEffect(() => {
        getDataOtherExpenses();
    }, [selectedAgent, isManageType, dateRange])

    useEffect(() => {
        if (isAdd) {
            getDataOtherExpenses();
            setIsAdd(false);
        }
    }, [isAdd]);

    useEffect(() => {
        if (isEdit) {
            getDataOtherExpenses();
            setIsEdit(false);
        }
    }, [isEdit]);

    useEffect(() => {
        if (alreadyDelete) {
            getDataOtherExpenses();
            setAlreadyDelete(false);
        }
    }, [alreadyDelete]);

    const handleOpenModal = (item) => {
        setSelectData(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCloseModalEdit = () => {
        setIsModalEdit(false);
    };

    const handleOpenEdit = (item) => {
        setSelectData(item)
        setIsModalEdit(true)
    }

    const handleDelete = (item) => {
        setSelectDataDelete(item)
        setIsDelete(true)
    }

    const handleCloseDelete = () => {
        setIsDelete(false)
    }

    const handleFormatDate = (item, field) => {
        const date = new Date(field === 'create' ? item.create_Date : item.update_Date)
        const day = date.getDate()
        const month = date.getMonth() + 1
        const year = date.getFullYear()
        return `${day} ${months[month]} ${year}`
    }

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
                    <span className='text-slate-500 text-sm'>ยอดรวม</span>
                    {/* <span className='text-2xl'>{calculateSummaryAndCountByDate().totalAmount || 0}</span> */}
                </div>

                <div className='border-1 h-12 ms-5'></div>

                <div className='flex flex-col text-sm'>
                    <span className='text-slate-500'>จำนวนรายการ</span>
                    {/* <span className='text-2xl'>{calculateSummaryAndCountByDate().count || 0}</span> */}
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
                        <SelectItem key={item.expensesTypeId} value={item.typeName}>
                            {item.typeName}
                        </SelectItem>
                    ))}
                </Select>
            </div>
            <div style={{ overflow: 'hidden' }}>
                <Table aria-label="Expenses Table" className="table w-full text-center text-slate-600" shadow='none'>
                    <TableHeader className="bg-slate-100">
                        <TableColumn>รายการ</TableColumn>
                        <TableColumn>ประเภท</TableColumn>
                        <TableColumn>ยอดรวม</TableColumn>
                        <TableColumn>Notes</TableColumn>
                        <TableColumn>สร้างโดย</TableColumn>
                        <TableColumn>วันที่อัพเดท</TableColumn>
                        <TableColumn>อัพเดทโดย</TableColumn>
                        <TableColumn>Actions</TableColumn>
                    </TableHeader>
                    <TableBody items={data || []} isLoading={isLoading} loadingContent={<Spinner />}>
                        {item => (
                            <TableRow key={item.expensesId} onPress={() => handleOpenModal(item)} className="hover:bg-slate-50 cursor-pointer text-slate-600 h-12">
                                <TableCell >{item.remarks}</TableCell>
                                <TableCell>{item.expensesType.typeName}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell>
                                    <div className="flex flex-row space-x-2 transition duration-200 ease-in">
                                        <FaEdit
                                            size={18}
                                            className="hover:scale-150 text-yellow-500 transition duration-100 ease-in"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenEdit(item);
                                            }}
                                        />
                                        <FaTrash
                                            size={18}
                                            className="hover:scale-150 text-red-400 transition duration-100 ease-in"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(item);
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
                    onClose={handleCloseModal}
                    data={selectData}
                />
            )}

            {isModalEdit && (
                <ModalEdid
                    isOpen={isModalEdit}
                    onClose={handleCloseModalEdit}
                    data={selectData}
                    setIsEdit={setIsEdit}
                    typeData={typeData}
                />
            )}

            {isDelete && (
                <ModalDelete
                    isOpen={isDelete}
                    onClose={handleCloseDelete}
                    data={selectDataDelete}
                    alreadyDelete={setAlreadyDelete}
                />
            )}

        </div>
    )
}
