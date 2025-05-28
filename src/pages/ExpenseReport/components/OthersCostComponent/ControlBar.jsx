import { DropdownTrigger, DropdownMenu, DropdownItem, Input, useDisclosure, Button, Dropdown, Tooltip } from "@heroui/react";
import React, { useContext, useEffect, useState } from 'react';
import { Data } from '../../TabsExpense/TabsOthersCost';
import DateSelector from '../../../../component/DateSelector';
import AgentSelector from '../../../../component/AgentSelector';
import ModalTypeExpenses from '../OtherExpensesModal/ModalTypeExpenses';
import ModalManageTypeExpenses from '../OtherExpensesModal/ModalManageTypeExpenses';
import getExpensesType from '@/services/expensesService'
import ModalAddExpensesDetails from '../OtherExpensesModal/ModalAddExpensesDetails';
import { toastError, toastSuccess } from "@/component/Alert";
import expensesService from "@/services/expensesService";
import { endOfMonth, startOfMonth, today } from "@internationalized/date";
import { formatDateObject } from "@/utils/dateUtils";
import { FaEraser } from "react-icons/fa";

function ControlBar({ expensesDate, setExpensesDate, setSearchText, searchText }) {

    const { setSearch, dateRange, setDateRange, currentUser, selectedAgent, typeData, setTypeData, getDataOtherExpenses } = useContext(Data);

    // Trigger For Modal
    const [isOpenExpensesDetails, setIsOpenExpensesDetails] = useState(false)
    const [isOpenTypeExpenses, setIsOpenTypeExpenses] = useState(false)
    const [isOpenManageTypeModal, setIsOpenManageTypeModal] = useState(false)

    // Enable Action When put data and not at all!
    const [isEnable, setIsEnable] = useState(false)

    // Select Type
    const [selectType, setSelectType] = useState(null)

    // Selected Data State
    const [selectedData, setSelectedData] = useState({
        list: [{ name: '', qty: '', price: '', totalAmount: '' }],
        remark: ''
    });

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

    useEffect(() => {
        if (typeData?.length > 0 && !selectType) {
            setSelectType(typeData[0].expensesTypeId);
        }
    }, [typeData]);

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

        const qty = parseFloat(updatedList[index].qty) || 1;
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
            await expensesService.addExpensesDetails(selectedData.remark, formatDateObject(expensesDate), selectedData.list, selectType)
            await getDataOtherExpenses()
            toastSuccess('เพิ่มข้อมูลสำเร็จ')
        } catch (error) {
            console.error('Error adding other expenses:', error);
            toastError('เพิ่มข้อมูลไม่สำเร็จ')
        }
    };

    const isDisabled = selectedData.list.some(e =>
        !e.name || e.name.trim() === '' ||
        // !e.qty || e.qty.trim() === '' ||
        !e.price || e.price.trim() === '' ||
        !selectType || selectType === null
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
                    <div className="flex flex-row items-center justify-between space-x-2">
                        <Input type='text' label='รายการ' value={searchText} onChange={(e) => setSearchText(e.target.value)} variant="bordered" size='sm'></Input>
                        <Tooltip content='ล้างการค้ยหา' placement="right" color="danger">
                            <span className="px-2 py-2 bg-red-200 rounded-full cursor-pointer" onClick={() => setSearchText('')}><FaEraser className="text-red-500" /></span>
                        </Tooltip>
                    </div>
                    {currentUser.businessId === 1 && (
                        <>
                            <AgentSelector />
                        </>
                    )}
                </div>

                <div className='btn-container-add'>
                    <Dropdown
                        autoFocus={false}
                        closeOnSelect={true}
                        disableAnimation={true}
                    >
                        <DropdownTrigger>
                            <Button className="text-white" color="success">เพิ่มค่าใช้จ่าย</Button>
                        </DropdownTrigger>

                        <DropdownMenu
                            aria-label="Static Actions"
                            onAction={(key) => {
                                requestAnimationFrame(() => {
                                    if (key === "addexpenses") setIsOpenExpensesDetails(true);
                                    if (key === "addexpensestype") setIsOpenTypeExpenses(true);
                                    if (key === "manageexpensestype") setIsOpenManageTypeModal(true);
                                });
                            }}
                        >
                            <DropdownItem
                                title="เพิ่มข้อมูล"
                                key="addexpenses"
                            />
                            <DropdownItem
                                title="เพิ่มประเภทค่าใช้จ่าย"
                                key="addexpensestype"
                            />
                            <DropdownItem
                                title="จัดการประเภทค่าใช้จ่าย"
                                key="manageexpensestype"
                            />
                        </DropdownMenu>
                    </Dropdown>

                </div>
            </div>

            {isOpenExpensesDetails && (
                <ModalAddExpensesDetails
                    isOpen={isOpenExpensesDetails}
                    onClose={() => { setIsOpenExpensesDetails(false); setSelectedData({ list: [{ name: '', qty: '', price: '', totalAmount: '' }], remark: '' }) }}
                    selectedAgent={selectedAgent.id}
                    currentUser={currentUser}
                    setTypeData={setTypeData}
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
                    setSelectType={setSelectType}
                    selectType={selectType}
                />
            )}

            {isOpenTypeExpenses && (
                <ModalTypeExpenses
                    isOpen={isOpenTypeExpenses}
                    onClose={() => setIsOpenTypeExpenses(false)}
                    currentUser={currentUser}
                    typeData={typeData}
                    getTypeData={getTypeData}
                />
            )}

            {isOpenManageTypeModal && (
                <ModalManageTypeExpenses
                    isOpen={isOpenManageTypeModal}
                    onClose={() => setIsOpenManageTypeModal(false)}
                    typeData={typeData}
                    setIsOpenManageTypeModal={setIsOpenManageTypeModal}
                    getTypeData={getTypeData}
                />
            )}

        </>
    );
}

export default ControlBar;
