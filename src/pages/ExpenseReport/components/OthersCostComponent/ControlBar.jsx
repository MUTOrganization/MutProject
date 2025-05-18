import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Input, useDisclosure } from "@heroui/react";
import React, { useContext, useEffect, useState } from 'react';
import { Data } from '../../TabsExpense/TabsOthersCost';
import { URLS } from '@/config';
import fetchProtectedData from '@/utils/fetchData';
import DateSelector from '../../../../component/DateSelector';
import AgentSelector from '../../../../component/AgentSelector';
import ModalTypeExpenses from '../OtherExpensesModal/ModalTypeExpenses';
import ModalManageTypeExpenses from '../OtherExpensesModal/ModalManageTypeExpenses';
import getExpensesType from '@/services/expensesService'
import ModalAddExpensesDetails from '../OtherExpensesModal/ModalAddExpensesDetails';
import { toastSuccess } from "@/component/Alert";
import expensesService from "@/services/expensesService";
import { endOfMonth, startOfMonth, today } from "@internationalized/date";

function ControlBar() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { setIsAdd, setSearch, dateRange, setDateRange, currentUser, selectedAgent, typeData, setTypeData, setIsManageType, isAction } = useContext(Data);

    // Trigger For Modal
    const [isOpenExpensesDetails, setIsOpenExpensesDetails] = useState(false)
    const [isOpenTypeExpenses, setIsOpenTypeExpenses] = useState(false)
    const [isOpenManageTypeModal, setIsOpenManageTypeModal] = useState(false)

    // Enable Action When put data and not at all!
    const [isEnable, setIsEnable] = useState(false)

    // Select Type
    const [selectType, setSelectType] = useState('')

    // Fetch TypeData
    const [typeName, setTypeName] = useState()

    // Selected Data State
    const [selectedData, setSelectedData] = useState({
        list: [{ name: '', qty: '', price: '', totalAmount: '' }],
        remark: null
    });

    // Date
    const [expensesDate, setExpensesDate] = useState(today())
    // fetchData
    const getTypeData = async () => {
        try {
            const res = await getExpensesType.getExpensesType(currentUser.agent.agentId)
            setTypeData(res)
        } catch (err) {
            console.log('Error', err)
        }
    }

    // All Use Effect
    useEffect(() => {
        getTypeData()
    }, [selectedAgent])

    // All Function
    const addExpenseItem = () => {
        setSelectedData((prev) => ({
            ...prev,
            list: [...prev.list, { name: '', qty: '', price: '', totalAmount: '' }]
        }));
    };
    const handleExpenseChange = (index, field, value) => {
        const updatedList = [...selectedData.list];

        updatedList[index] = {
            ...updatedList[index], [field]: value || null,
        };

        const qty = parseFloat(updatedList[index].qty) || null;
        const price = parseFloat(updatedList[index].price) || 0;
        updatedList[index].totalAmount = qty ? (qty * price).toFixed(2) : price.toFixed(2);

        setSelectedData(prev => ({ ...prev, list: updatedList }));
    };

    const handleDeleteList = (index) => {
        setSelectedData(prev => ({
            ...prev,
            list: prev.list.filter((_, i) => i !== index)
        }));
    };

    const handleConfirmAdd = async () => {
        try {
            const res = await expensesService.addExpensesDetails()
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error adding other expenses:', error);
        } finally {
            setIsAdd(true)
            toastSuccess('เพิ่มข้อมูลสำเร็จ')
        }
    };

    const isDisabled = selectedData.list.some(e =>
        !e.list || e.list.trim() === '' ||
        // !e.qty || e.qty.trim() === '' ||
        !e.price || e.price.trim() === '' ||
        !selectType || selectType === undefined
    );

    const handleChange = (selectedKey) => {
        console.log(selectedKey)
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
                        <button onPress={() => { setSearch(''); setDateRange(null); }} className='bg-blue-500 text-white px-8 text-sm py-1 rounded-md hover:bg-blue-600'>ล้างการค้นหา</button>

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
                            <DropdownItem onPress={() => onOpen()} key="new">เพิ่มค่าใช้จ่าย</DropdownItem>
                            <DropdownItem onPress={() => setIsOpenTypeExpenses(true)} key="copy">เพิ่มประเภทค่าใช้จ่าย</DropdownItem>
                            <DropdownItem onPress={() => setIsOpenManageTypeModal(true)} key="type">จัดการประเภทค่าใช้จ้่ย</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>

            {isOpen && (
                <ModalAddExpensesDetails
                    isOpen={isOpen}
                    onClose={onOpenChange}
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
                    expensesDate={expensesDate}
                    setExpensesDate={setExpensesDate}
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
                    getTypeData={getTypeData}
                />
            )}

        </>
    );
}

export default ControlBar;
