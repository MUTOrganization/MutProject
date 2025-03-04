import { Button, Checkbox, DatePicker, DateRangePicker, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure, ModalFooter, Textarea, Tabs, Tab, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Select, SelectItem, Input } from '@nextui-org/react';
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

function ControlBar() {

    const { setIsAdd, search, setSearch, dateRange, setDateRange, isSwap,
        setIsSwap, setIsAddWithDraw, searchWithDraw, setSearchWithDraw,
        searchDateWithDraw, setSearchDateWithDraw, searchDepartment, setSearchDepartment,
        currentUser, selectedAgent,
        typeData, setTypeData, isManageType, setIsManageType } = useContext(Data);

    const currentMonthStart = startOfMonth(today());
    const currentMonthEnd = endOfMonth(today());

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
        const url = `${URLS.OTHEREXPENSES}/getTypeExpenses?businessId=${selectedAgent.id}`
        try {
            const res = await fetchProtectedData.get(url)
            setTypeData(res.data)
            console.log('GetData Success', res.data)
        } catch (error) {
            console.log('Something Wrong', error)
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
        list: [{ list: '', qty: '', price: '', totalAmount: '' }],
        remark: null
    });

    const [editData, setEditData] = useState({
        date: null,
        list: [{ list: '', qty: '', price: '', totalAmount: '' }],
        remark: null
    })


    const addExpenseItem = () => {
        if (oldData) {
            setEditData((prev) => ({
                ...prev,
                list: [...prev.list, { list: '', qty: '', price: '', totalAmount: '' }]
            }));
        } else {
            setSelectedData((prev) => ({
                ...prev,
                list: [...prev.list, { list: '', qty: '', price: '', totalAmount: '' }]
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
        const findValueById = typeData.find(e => String(e?.id) === String(getKey));
        setSelectType(findValueById?.id)
    };
    // #region Return
    return (
        <>
            <div className='flex flex-col lg:flex-row lg:justify-between items-center'>

                <div className='header p-3 flex flex-col lg:flex-row lg:items-center space-x-0 lg:space-x-6 w-10/12'>

                    {/* <div className='flex flex-col gap-2'>
                        <label className="text-xs ps-2">ประเภท</label>
                        <Tabs color='primary' onSelectionChange={(k => setIsSwap(k))} size='sm' aria-label="Options">
                            <Tab key="otherExpenses" title="ทั่วไป" ></Tab>
                            <Tab key="withDraw" title="ขอเบิก" ></Tab>
                        </Tabs>
                    </div> */}

                    {isSwap === 'withDraw' ? (
                        <>
                            <DateSelector value={searchDateWithDraw} onChange={setSearchDateWithDraw} />
                            <div className="flex flex-col gap-2">
                                <label className="text-xs">ค้นหารายการ</label>
                                <input value={searchWithDraw} onChange={(e) => setSearchWithDraw(e.target.value)} type="text" className='input input-sm input-bordered focus:outline-none h-9' placeholder='ค้นหารายการ' />
                            </div>
                        </>
                    ) : (
                        <>
                            <DateSelector value={dateRange} onChange={setDateRange} />
                            <div className="flex flex-col gap-2">
                                <Input type='text' label='รายการ' onChange={(e) => setSearch(e.target.value)} variant="bordered" size='sm'></Input>
                            </div>
                        </>
                    )}

                    {isSwap === 'withDraw' && (
                        <>
                            <div className='flex flex-col gap-2'>
                                <div className='text-xs'>ค้นหาตามแผนก</div>
                                <select onChange={(e) => setSearchDepartment(e.target.value)} name="" id="" className='select select-sm h-9 select-bordered'>
                                    {departments.map((item, index) => (
                                        <option key={index} value={item}>{item}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

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
                    {isSwap === 'otherExpenses' && (
                        <Dropdown>
                            <DropdownTrigger>
                                <button className='bg-green-500 text-white px-8 py-1.5 rounded-md text-sm hover:bg-green-600'
                                >
                                    เพิ่มข้อมูล
                                </button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions">
                                <DropdownItem onPress={onOpen} key="new">เพิ่มค่าใช้จ่าย</DropdownItem>
                                <DropdownItem onPress={() => setIsOpenTypeExpenses(true)} key="copy">เพิ่มประเภทค่าใช้จ่าย</DropdownItem>
                                <DropdownItem onPress={() => setIsOpenManageTypeModal(true)} key="type">จัดการประเภทค่าใช้จ้่ย</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    )}
                    {isSwap === 'withDraw' && (
                        <button onPress={() => setIsOpenWithDraw(true)} className='bg-green-500 text-white px-6 py-1.5 rounded-md text-sm hover:bg-green-600'>เพิ่มค่าใช้จ่าย + </button>
                    )}

                </div>
            </div>


            {/* Modal */}
            {isSwap === 'otherExpenses' && (
                <>
                    <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                        <ModalContent className='max-w-3xl'>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">เพิ่มค่าใช้จ่าย</ModalHeader>
                                    <ModalBody className='flex lg:flex-row px-6 space-x-0 lg:space-x-4 space-y-0 lg:space-y-7'>
                                        <div className='side1 w-full'>
                                            <div className='form space-y-8'>
                                                <div className='flex lg:flex-row space-x-0 lg:space-x-5'>
                                                    <div className="flex w-full lg:flex-col gap-0 lg:gap-2 items-start">
                                                        <label className="text-sm text-slate-500">ชื่อผู้อกรอก</label>
                                                        <input value={currentUser.userName} disabled type="text" className='input input-sm input-bordered focus:outline-none w-full text-sm h-9' />
                                                    </div>
                                                    <div className="flex w-full lg:flex-col gap-0 lg:gap-2 items-start">
                                                        <label className="text-sm text-slate-500">แผนก</label>
                                                        <input type="text" value={currentUser.department} disabled className='input input-sm input-bordered focus:outline-none w-full text-sm h-9' />
                                                    </div>
                                                    <div className="flex w-full lg:flex-col gap-0 lg:gap-2 items-start">
                                                        <label className="text-sm text-slate-500">ตำแหน่ง</label>
                                                        <input type="text" value={currentUser.userRole} disabled className='input input-sm input-bordered focus:outline-none w-full text-sm h-9' />
                                                    </div>
                                                </div>

                                                <div className="flex w-full lg:flex-col gap-0 lg:gap-2 items-start">
                                                    <label className="text-sm text-slate-500">ระบุวันที่</label>
                                                    <input type="date"
                                                        disabled={isEnable}
                                                        value={selectedData.date}
                                                        onChange={(e) => setSelectedData((prev) => ({ ...prev, date: e.target.value }))}
                                                        className='input input-sm w-full h-9 input-bordered focus:outline-none text-slate-400' />
                                                </div>

                                                <div className='relative'>
                                                    <div className='flex justify-end mb-3'>
                                                        <Select
                                                            label='เลือกประเภท'
                                                            // placeholder="ประเภท"
                                                            color="primary"
                                                            className="w-48"
                                                            size="sm"
                                                            onChange={handleChange}
                                                        >
                                                            {typeData.map((item) => (
                                                                <SelectItem key={item.id} value={item.typeExpenses}>
                                                                    {item.typeExpenses}
                                                                </SelectItem>
                                                            ))}
                                                        </Select>
                                                    </div>
                                                    <table className='table w-full overflow-hidden'>
                                                        <thead className='bg-[#F3F3F3] rounded-xl border-b-2 border-slate-200'>
                                                            <tr className='text-sm text-slate-500'>
                                                                <th className='font-medium'>รายการ</th>
                                                                <th className='font-medium'>จำนวน(ถ้ามี)</th>
                                                                <th className='font-medium'>ราคา</th>
                                                                <th className='font-medium'>ยอดรวม</th>
                                                                <th className='font-medium'></th>
                                                            </tr>
                                                        </thead>

                                                        <tbody className='bg-slate-100'>
                                                            {selectedData.list.map((item, index) => (
                                                                <>
                                                                    <tr key={index}>
                                                                        <td className='w-4/12'>
                                                                            <input
                                                                                type="text"
                                                                                maxLength={50}
                                                                                value={item.list}
                                                                                disabled={isEnable}
                                                                                onChange={(e) => handleExpenseChange(index, 'list', e.target.value)}
                                                                                className='input input-sm input-bordered focus:outline-none w-full text-sm h-9'
                                                                                placeholder="รายการ"
                                                                            />
                                                                        </td>
                                                                        <td className='w-2/12'>
                                                                            <input
                                                                                type="text"
                                                                                maxLength={50}
                                                                                value={item.qty}
                                                                                disabled={isEnable}
                                                                                onChange={(e) => {
                                                                                    const value = e.target.value;
                                                                                    if (/^\d*\.?\d*$/.test(value)) {
                                                                                        handleExpenseChange(index, 'qty', value);
                                                                                    }
                                                                                }}
                                                                                className='input input-sm input-bordered focus:outline-none w-full text-sm h-9'
                                                                                placeholder="0"
                                                                                onKeyDown={(e) => {
                                                                                    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Delete') {
                                                                                        e.preventDefault();
                                                                                    }
                                                                                }}
                                                                                pattern="[0-9]*"
                                                                            />
                                                                        </td>
                                                                        <td className='w-2/12'>
                                                                            <input
                                                                                type="text"
                                                                                maxLength={10}
                                                                                value={item.price}
                                                                                disabled={isEnable}
                                                                                onChange={(e) => {
                                                                                    const value = e.target.value;
                                                                                    if (/^\d*\.?\d*$/.test(value)) {
                                                                                        handleExpenseChange(index, 'price', value);
                                                                                    }
                                                                                }}
                                                                                placeholder='0.00'
                                                                                className='w-full input input-sm input-bordered h-9 focus:outline-none text-sm ps-3'
                                                                                onKeyDown={(e) => {
                                                                                    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Delete') {
                                                                                        e.preventDefault();
                                                                                    }
                                                                                }}
                                                                                pattern="[0-9]*"
                                                                            />
                                                                        </td>
                                                                        <td className=''>
                                                                            {item.totalAmount || '0.00'}
                                                                        </td>
                                                                        <td className='text-center'>
                                                                            {index > 0 && (
                                                                                <FaTrash size={18} onPress={() => handleDeleteList(index)} className='hover:scale-150 cursor-pointer transition duration-150 ease-in text-red-500' />
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                </>
                                                            ))}
                                                            <tr>
                                                                <td colSpan={5}>
                                                                    <div className='flex flex-row items-center space-x-1 justify-start mr-1'>
                                                                        {selectedData.list.length !== 5 && (
                                                                            <div className='cursor-pointer flex flex-row items-center space-x-1' onPress={addExpenseItem}>
                                                                                <span><FaPlusCircle className='text-blue-500' /></span>
                                                                                <span className='text-sm text-blue-500 underline underline-offset-2'>เพิ่มข้อมูล</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>

                                                <div className="other w-full">
                                                    <div className="flex w-full lg:flex-col gap-0 lg:gap-2 items-start">
                                                        <label className="text-sm text-slate-500">หมายเหตุ (ถ้ามี)</label>
                                                        <Textarea
                                                            labelPlacement="outside"
                                                            placeholder="Enter your description"
                                                            className="max-w-full"
                                                            isDisabled={isEnable}
                                                            value={selectedData.remark}
                                                            onChange={(e) => setSelectedData((prev) => ({ ...prev, remark: e.target.value }))}
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            ยกเลิก
                                        </Button>
                                        <Button
                                            isDisabled={isDisabled}
                                            color="primary"
                                            onPress={() => {
                                                onClose();
                                                handleConfirmAdd();
                                            }}
                                        >
                                            ยืนยัน
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal >

                </>
            )}
            {isSwap === 'withDraw' && (
                <ModalAddWithDraw
                    isOpen={isOpenWithDraw}
                    onClose={handleCloseWithDraw}
                    setIsAddWithDraw={setIsAddWithDraw}
                    selectedAgent={selectedAgent.id}
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
