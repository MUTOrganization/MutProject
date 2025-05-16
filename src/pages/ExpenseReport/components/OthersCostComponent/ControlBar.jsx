import { Button, Checkbox, DatePicker, DateRangePicker, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure, ModalFooter, Textarea, Tabs, Tab, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Select, SelectItem, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import React, { useContext, useEffect, useState } from 'react';
import { Colors } from '../../Constrants/Colors';
import { useAppContext } from '../../../../contexts/AppContext';
import { formatDateObject } from '../../../../component/DateUtiils';
import { Data } from '../../TabsExpense/TabsOthersCost';
import { FaPlusCircle, FaTrash } from 'react-icons/fa';
import { formatNumberInput } from '../../../../component/FormatNumber';
import { URLS } from '../../../../config';
import fetchProtectedData from '../../../../../utils/fetchData';
import { Toaster, toast } from 'sonner';
import Contents from './Contents';
import ModalAddWithDraw from '../OtherExpensesModal/ModalAddWithDraw';
import { endOfMonth, startOfMonth, today } from '@internationalized/date';
import DateSelector from '../../../../component/DateSelector';
import AgentSelector from '../../../../component/AgentSelector';
import ModalTypeExpenses from '../OtherExpensesModal/ModalTypeExpenses';
import ModalManageTypeExpenses from '../OtherExpensesModal/ModalManageTypeExpenses';
import getExpensesType from '@/services/expensesService'
import ModalAddExpensesDetails from '../OtherExpensesModal/ModalAddExpensesDetails';

function ControlBar() {

    const { setIsAdd, search, setSearch, dateRange, setDateRange, isSwap,
        setIsSwap, setIsAddWithDraw, searchWithDraw, setSearchWithDraw,
        searchDateWithDraw, setSearchDateWithDraw, searchDepartment, setSearchDepartment,
        currentUser, selectedAgent,
        typeData, setTypeData, isManageType, setIsManageType } = useContext(Data);

    const currentMonthStart = startOfMonth(today());
    const currentMonthEnd = endOfMonth(today());

    const [isOpen, setIsOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isEnable, setIsEnable] = useState(false)
    const [showBtnEdit, setShowBtnEdit] = useState(false)
    const [isConfirmEdit, setIsConfirmEdit] = useState(false)
    const [oldData, setOldData] = useState(false)
    const [editIndex, setEditIndex] = useState(null);
    const [isOpenWithDraw, setIsOpenWithDraw] = useState(false)
    const [isOpenTypeExpenses, setIsOpenTypeExpenses] = useState(false)
    const [selectType, setSelectType] = useState('')
    const [isOpenManageTypeModal, setIsOpenManageTypeModal] = useState(false)

    // TypeExpenses
    const [typeName, setTypeName] = useState()

    const getData = async () => {
        try {
            const res = await getExpensesType.getExpensesType(currentUser.agent.id)
            setTypeData(res)
        } catch (err) {
            console.log('Error', err)
        }
    }

    useEffect(() => {
        getData()
    }, [selectedAgent])

    useEffect(() => {
        if (isManageType) {
            getData()
            setIsManageType(false)
        }
    }, [isManageType])

    const handleCloseWithDraw = () => {
        setIsOpenWithDraw(false)
    }

    const departments = ["ทั้งหมด", "CRM", "SALE", "ADS", "Data & MARKETING", "ACC", "IT", "HR", "GM"];
    const [selectedData, setSelectedData] = useState({
        date: new Date().toISOString().split('T')[0],
        list: [{ name: '', qty: '', price: '', totalAmount: '' }],
        remark: null
    });

    const [editData, setEditData] = useState({
        date: null,
        list: [{ name: '', qty: '', price: '', totalAmount: '' }],
        remark: null
    })

    const addExpenseItem = () => {
        if (oldData) {
            setEditData((prev) => ({
                ...prev,
                list: [...prev.list, { name: '', qty: '', price: '', totalAmount: '' }]
            }));
        } else {
            setSelectedData((prev) => ({
                ...prev,
                list: [...prev.list, { name: '', qty: '', price: '', totalAmount: '' }]
            }));
        }
    };

    const handleExpenseChange = (index, field, value) => {
        const updatedList = oldData ? [...editData.list] : [...selectedData.list];

        updatedList[index] = {
            ...updatedList[index],
            [field]: value || null,
        };

        const qty = parseFloat(updatedList[index].qty) || null;
        const price = parseFloat(updatedList[index].price) || 0;
        updatedList[index].totalAmount = qty ? (qty * price).toFixed(2) : price.toFixed(2);

        if (oldData) {
            setEditData(prev => ({ ...prev, list: updatedList }));
        } else {
            setSelectedData(prev => ({ ...prev, list: updatedList }));
        }
    };

    const handleDeleteList = (index) => {
        if (oldData) {
            setEditData(prev => ({
                ...prev,
                list: prev.list.filter((_, i) => i !== index)
            }));
        } else {
            setSelectedData(prev => ({
                ...prev,
                list: prev.list.filter((_, i) => i !== index)
            }));
        }
    };

    const handleConfirmAdd = async () => {
        const urlOtherExpenses = `${URLS.OTHEREXPENSES}/addOtherExpenses`;

        try {
            const response = await fetchProtectedData.post(urlOtherExpenses, {
                data: selectedData,
                type: selectType,
                businessId: selectedAgent.id,
                user: currentUser.userName
            });
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error adding other expenses:', error);
        } finally {
            setIsAdd(true)
            toast.success('เพิ่มข้อมูลสำเร็จ')
        }
    };

    const isDisabled = selectedData.list.some(e =>
        !e.list || e.list.trim() === '' ||
        // !e.qty || e.qty.trim() === '' ||
        !e.price || e.price.trim() === '' ||
        !selectType || selectType === undefined
    );

    const handleChange = (selectedKey) => {
        let getKey = selectedKey.target.value
        const findValueById = typeData.find(e => String(e?.expensesTypeId) === String(getKey));
        setSelectType(findValueById?.typeName)
    };
    
    // #region Return
    return (
        <>
            <div className='flex flex-col lg:flex-row lg:justify-between items-center'>
                <div className='header p-3 flex flex-col lg:flex-row lg:items-center space-x-0 lg:space-x-6 w-10/12'>
                    <DateSelector value={dateRange} onChange={setDateRange} />
                    <div className="flex flex-col gap-2">
                        <Input type='text' label='รายการ' onChange={(e) => setSearch(e.target.value)} variant="bordered" size='sm'></Input>
                    </div>


                    {currentUser.businessId === 1 && (
                        <>
                            <AgentSelector />
                        </>
                    )}

                    <div className='btn-container flex flex-col'>
                        <div className='invisible'>This text is</div>
                        {isSwap === 'withDraw' ? (
                            <button onPress={() => { setSearchWithDraw(''); setSearchDateWithDraw(null); setSearchDepartment('ทั้งหมด') }} className='bg-blue-500 text-white px-8 text-sm py-1 rounded-md hover:bg-blue-600'>ล้างการค้นหา</button>
                        ) : (
                            <button onPress={() => { setSearch(''); setDateRange(null); }} className='bg-blue-500 text-white px-8 text-sm py-1 rounded-md hover:bg-blue-600'>ล้างการค้นหา</button>
                        )}
                    </div>
                </div>

                <div className='btn-container-add'>
                    <Dropdown>
                        <DropdownTrigger>
                            <button className='bg-green-500 text-white px-8 py-1.5 rounded-md text-sm hover:bg-green-600'
                            >
                                เพิ่มข้อมูล
                            </button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions">
                            <DropdownItem onPress={() => setIsOpen(true)} key="new">เพิ่มค่าใช้จ่าย</DropdownItem>
                            <DropdownItem onPress={() => setIsOpenTypeExpenses(true)} key="copy">เพิ่มประเภทค่าใช้จ่าย</DropdownItem>
                            <DropdownItem onPress={() => setIsOpenManageTypeModal(true)} key="type">จัดการประเภทค่าใช้จ้่ย</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>

            {isOpen && (
                <ModalAddExpensesDetails
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    selectedAgent={selectedAgent.id}
                    currentUser={currentUser}
                    setTypeData={setTypeData}
                    setTypeName={setTypeName}
                    setIsEnable={setIsEnable}
                    isEnable={isEnable}
                    isDisabled={isDisabled}
                    handleConfirmAdd={handleConfirmAdd}
                    handleExpenseChange={handleExpenseChange}
                    handleDeleteList={handleDeleteList}
                    addExpenseItem={addExpenseItem}
                    selectedData={selectedData}
                    typeData={typeData}
                    setSelectedData={setSelectedData}
                    handleChange={handleChange}
                />
            )}

            {isOpenTypeExpenses && (
                <ModalTypeExpenses
                    isOpen={isOpenTypeExpenses}
                    onClose={() => setIsOpenTypeExpenses(false)}
                    selectedAgent={selectedAgent.id}
                    currentUser={currentUser}
                    setTypeData={setTypeData}
                    setTypeName={setTypeName}
                    typeName={typeName}
                    setIsManageType={setIsManageType}
                />
            )}

            {isOpenManageTypeModal && (
                <ModalManageTypeExpenses
                    isOpen={isOpenManageTypeModal}
                    onClose={() => setIsOpenManageTypeModal(false)}
                    typeData={typeData}
                    setIsManageType={setIsManageType}
                    setIsOpenManageTypeModal={setIsOpenManageTypeModal}
                />
            )}

        </>
    );
}

export default ControlBar;
