import { Button, Card, Checkbox, Chip, input, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { AddStreamlineUltimateWhiteIcon, CheckIcon, ChecklistIcon, DeleteIcon, DisableIcon, EditIcon, SearchIcon } from "../../../../../component/Icons";
import SearchBox from "../../../../../component/SearchBox";
import { useEffect, useState } from "react";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "../../../../../config";
import { useAppContext } from "../../../../../contexts/AppContext";
import { toastError, toastSuccess } from "../../../../../component/Alert";
import { CustomFormatDate } from "../../../../../../utils/FormatDate";
import { CompareStatus, CompareValue } from "../../../../../../utils/CompareStatus";
import { ConfirmCancelButtons } from "../../../../../component/Buttons";
import AgentSelector from "../../../../../component/AgentSelector";

function AddDepartments({ open, close, isAdded = false, businessId, currentUser, listDep = [], isEditing, depEdit }) {

    const [errName, setErrName] = useState({ state: false, message: '' });

    const [inputName, setInputName] = useState('');
    const [isAddedAllAgent, setIsAddedAllAgent] = useState(false);

    useEffect(() => {
        if (isEditing) {
            setInputName(depEdit && depEdit.departmentName);
            setIsAddedAllAgent(depEdit && depEdit.isHq === '1' ? true : false);
        }
    }, [isEditing])

    async function fetchAddDep() {
        let isHqAdded = '';
        if (currentUser.businessId === 1) {
            if (businessId !== currentUser.businessId) {
                isHqAdded = '1';
            }
            else {
                isHqAdded = isAddedAllAgent ? '1' : '0';
            }

        }
        else {
            isHqAdded = '0';
        }

        await fetchProtectedData.post(URLS.departments.add, {
            businessId: businessId,
            departmentName: inputName,
            createBy: currentUser.userName,
            isHq: isHqAdded,
        }).then(res => {
            if (res.status === 400) {
                setErrName({ state: true, message: 'มีชื่อแผนกนี้อยู่แล้ว' })
            }
            toastSuccess('บันทึกข้อมูลสำเร็จ', 'ข้อมูลถูกบันทึกเข้าระบบเรียบร้อยแล้ว');
        }).catch(err => {
            toastError('บันทึกข้อมูลไม่สำเร็จ', 'การบันทึกข้อมูลเกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง')
            isAdded(false);
        })
    }

    async function fetchEditDep() {
        await fetchProtectedData.put(`${URLS.departments.edit}/${depEdit && depEdit.id}`, {
            businessId: businessId,
            departmentName: inputName,
            updateBy: currentUser.userName,
            isHq: currentUser.businessId === 1 ? CompareStatus(isAddedAllAgent, { true: '1', false: '0' }) : '0',
        }).then(res => {
            toastSuccess('แก้ไขข้อมูลสำเร็จ', 'ข้อมูลในระบบถูกแก้ไขเรียบร้อย')
            isEditing = false;
        }).catch(err => {
            toastError('แก้ไขข้อมูลไม่สำเร็จ', 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล โปรดลองใหม่อีกครั้ง')
            isEditing = false;
        })
    }

    function validate() {
        // validate input
        // return true if valid
        if (!inputName || inputName.trim() === '') {
            setErrName({ state: true, message: '** กรุณากรอกชื่อแผนก' });
            return false;
        }

        const findDepId = listDep.filter(x => x.departmentName === inputName && x.businessId === businessId);
        if (findDepId.length > 0) {
            setErrName({ state: true, message: '** ชื่อแผนกนี้มีอยู่แล้วในตัวแทนนี้' });
            return false;
        }
        return true;
    }


    async function handleSubmit() {
        if (validate()) {
            if (isEditing) {
                await fetchEditDep();
            } else {
                await fetchAddDep();
            }
            isAdded(true);
            handleClose();
        }
    }

    function handleClose() {
        setErrName({ state: false, message: '' })
        setIsAddedAllAgent(false);
        close(false);
    }

    return (
        <Modal isOpen={open} onClose={() => close(false)} backdrop="opaque" isDismissable={false} size="lg">
            <ModalContent>
                <ModalHeader className="flex gap2 bg-blue-100 text-primary text-2xl justify-center items-center">
                    <p>{CompareStatus(isEditing, { true: 'แก้ไขแผนก', false: 'เพิ่มแผนก' })}</p>
                </ModalHeader>
                <ModalBody>
                    <div className="flex w-full my-5 space-x-4">
                        <Input
                            aria-label="depName"
                            label='ชื่อแผนก'
                            placeholder={CompareStatus(isEditing, { true: depEdit && depEdit.departmentName, false: "กรอกชื่อแผนก" })}
                            labelPlacement="outside"
                            variant="bordered"
                            onChange={(e) => setInputName(e.target.value)}
                            onFocus={() => setErrName({ state: false, message: '' })}
                            isInvalid={errName.state}
                            errorMessage={errName.message}
                            className="max-w-xs"
                            size="sm" />
                    </div>

                    {(businessId === 1 && !isEditing) &&
                        <div>
                            <Checkbox aria-label="checkAddDepToAgent" onChange={e => setIsAddedAllAgent(e.target.checked)} className="text-sm" size="md" color="primary">สร้างให้ตัวแทนทั้งหมด</Checkbox>
                        </div>
                    }
                </ModalBody>
                <ModalFooter>
                    <ConfirmCancelButtons onConfirm={() => handleSubmit()} onCancel={() => handleClose()} />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

function DeleteDep({ open, close, dep, isDeleted, currentUser }) {
    // let isHq = '';
    // if (currentUser.businessId === 1) {
    //     if (dep && dep.isHq === 1) {
    //         isHq = '1'
    //     }
    //     else {
    //         isHq = '0'
    //     }
    // }
    // else {
    //     isHq = '0'
    // }
    const fetchDelete = async () => {
        await fetchProtectedData.delete(`${URLS.departments.delete}/${dep.id}`, {
            params: {
                isHq: currentUser.businessId === 1 ? CompareStatus(dep && dep.isHq, { 1: '1', 0: '0' }) : '0',
            }
        }).then((res) => {
            toastSuccess('ลบข้อมูลแผนกสำเร็จ', 'ระบบได้ทำการลบแผนกเรียบร้อยแล้ว')
        }).catch(err => {
            toastError('ลบข้อมูลแผนกไม่สำเร็จ', 'เกิดข้อผิดพลาดระหว่างการลบข้อมูล โปรดลองใหม่อีกครั้ง')
        })
    }

    const handleDelete = async () => {
        await fetchDelete();
        isDeleted(true);
        close(false);
    }

    return (
        <Modal isOpen={open} onClose={() => close(false)} size="sm">
            <ModalContent>
                <ModalHeader className="w-full flex flex-col gap-1 text-center bg-custom-redlogin text-white">
                    <p>ปิดการใช้งานแผนก</p>
                </ModalHeader>
                <ModalBody>
                    <div className="w-full p-2 text-center">
                        <p>ท่านต้องการปิดการใช้งาน แผนก</p>
                        <p className="text-lg text-wrap text-red-500"> {dep && dep.departmentName} นี้หรือไม่</p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <ConfirmCancelButtons size="sm" onCancel={() => close(false)} onConfirm={handleDelete} />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}


function ManageDepartments() {
    //Field Context
    const { currentUser, agent } = useAppContext()
    const { selectedAgent } = agent;

    //Field Selected 
    const [depRowSelected, setDepRowSelected] = useState();

    //Field Modal
    const [openModalAddDep, setOpenModalDep] = useState(false);
    const [openModalDeleteDep, setOpenModalDeleteDep] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    //Field List Data from API
    const [listDepartments, setListDeaprtments] = useState([]);
    const [searchListDep, setSearchListDep] = useState([]);

    //Field Loading State
    const [isLoadingDep, setIsLoadingDep] = useState(false);

    //Field Sort
    const [sortKey, setSortKey] = useState('asc');

    //#region Function fetch
    const fetchDepartments = async () => {
        setIsLoadingDep(true);
        await fetchProtectedData.get(URLS.departments.getall, { params: { businessId: selectedAgent.id } })
            .then((response) => {
                const departments = response.data;
                setListDeaprtments(departments);
                setSearchListDep(departments);
                setIsLoadingDep(false);
            }).catch(err => {
                toastError('การดึงข้อมูลล้มเหลว', 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง')
            }).finally(() => {
                setIsLoadingDep(false);
            })
    }
    //#endregion


    //#region UseEffect
    useEffect(() => {
        fetchDepartments();
    }, []);


    useEffect(() => {
        fetchDepartments();
    }, [selectedAgent])
    //#endregion


    //#region funcion handle
    function handleBeforeSearch(copyData) {
        return copyData;
    }

    function handleSearchResult(result) {
        setSearchListDep(result);
    }

    function handleModalEdit(dep) {
        setIsEditing(true);
        setOpenModalDep(true);
        setDepRowSelected(dep);
    }

    const handleSort = (key) => {
        setSortKey(sortKey === 'asc' ? 'desc' : 'asc');
        const sorted = [...searchListDep].sort((a, b) => {
            let valueA = a[key];
            let valueB = b[key];
            const isDate = (dateString) => {
                return !isNaN(Date.parse(dateString));
            };

            if (isDate(valueA) && isDate(valueB)) {
                valueA = new Date(valueA);
                valueB = new Date(valueB);
            } else {
                valueA = valueA ? valueA.toString() : "";
                valueB = valueB ? valueB.toString() : "";
            }
            if (sortKey === "asc") {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });
        setSearchListDep(sorted);
    };
    const dummyDeps = [
        {
            id: 1,
            departmentName: 'Accounting',
            isHq: 0,
            status: 1,
            createDate: '2021-01-01',
            createBy: 'hq000_ore',
            updateDate: '2021-01-01',
            updateBy: 'hq000_ore',
        },
        {
            id: 2,
            departmentName: 'Sales',
            isHq: 1,
            status: 1,
            createDate: '2021-01-01',
            createBy: 'hq000_ore',
            updateDate: '2021-01-01',
            updateBy: 'hq000_ore',
        },
        {
            id: 3,
            departmentName: 'Marketing',
            isHq: 0,
            status: 1,
            createDate: '2021-01-01',
            createBy: 'hq000_ore',
            updateDate: '2021-01-01',
            updateBy: 'hq000_ore',
        },
        {
            id: 4,
            departmentName: 'CRM',
            isHq: 1,
            status: 1,
            createDate: '2021-01-01',
            createBy: 'hq000_ore',
            updateDate: '2021-01-01',
            updateBy: 'hq000_ore',
        },
        {
            id: 5,
            departmentName: 'HR',
            isHq: 0,
            status: 1,
            createDate: '2021-01-01',
            createBy: 'hq000_ore',
            updateDate: '2021-01-01',
            updateBy: 'hq000_ore',

        },
        {
            id: 6,
            departmentName: 'IT',
            isHq: 1,
            status: 1,
            createDate: '2021-01-01',
            createBy: 'hq000_ore',
            updateDate: '2021-01-01',
            updateBy: 'hq000_ore',
        },
    ]
    //#endregion
    return (
        <section className="w-full">
            <AddDepartments open={openModalAddDep} close={e => { setOpenModalDep(e); setIsEditing(false); }} isAdded={e => e && fetchDepartments()} businessId={selectedAgent.id} currentUser={currentUser} listDep={searchListDep} isEditing={isEditing} depEdit={depRowSelected} />
            <DeleteDep dep={depRowSelected} open={openModalDeleteDep} close={e => setOpenModalDeleteDep(e)} isDeleted={e => e && fetchDepartments()} currentUser={currentUser} />
            <Card className="flex p-4 h-full min-h-[650px] shadow-none scrollbar-hide overflow-auto">
                <div className="w-full  flex justify-between items-end mb-3">
                    <div>
                        {currentUser.businessId === 1 &&
                            <div className="w-full my-2">
                                <AgentSelector />
                            </div>}

                    </div>
                    <div className="w-[300px]">
                        <SearchBox
                            className={'max-w-xs'}
                            data={listDepartments}
                            label="ค้นหา"
                            variant="bordered"
                            placeholder="ค้นหาโดยชื่อแผนก"
                            searchRules={[['departmentName', 10]]}
                            onChange={handleSearchResult}
                            onBeforeSearch={handleBeforeSearch}
                        />
                    </div>
                </div>
                <div className="w-full h-full min-h-[580px] rounded-lg">
                    <Card className="w-full h-[580px] overflow-auto scrollbar-hide  p-2" shadow="sm">
                        <Table
                            isHeaderSticky
                            removeWrapper
                            aria-label="table-departments"
                            color="primary"
                            selectionMode="single"
                            selectionBehavior="replace"
                            onSortChange={() => handleSort}>
                            <TableHeader>
                                <TableColumn allowsSorting onClick={() => handleSort('departmentName')} key={'departmentName'}>ชื่อแผนก</TableColumn>
                                <TableColumn key={'isHq'} className="text-center">{currentUser.businessId === 1 ? 'สร้างให้ตัวแทน' : 'สร้างโดยสำนักงานใหญ่'}</TableColumn>
                                <TableColumn allowsSorting onClick={() => handleSort('createDate')} key={'createBy'}>สร้างโดย</TableColumn>
                                <TableColumn allowsSorting onClick={() => handleSort('updateDate')} key={'updateBy'}>อัพเดตล่าสุด</TableColumn>
                                <TableColumn key={'actions'} width={10} className="text-center">
                                    <Tooltip showArrow={true} content='เพิ่มแผนก' placement="right">
                                        <Button isIconOnly variant="light" color="success" onPress={() => setOpenModalDep(true)}>
                                            <AddStreamlineUltimateWhiteIcon />
                                        </Button>
                                    </Tooltip>
                                </TableColumn>
                            </TableHeader>
                            <TableBody items={dummyDeps ?? searchListDep} isLoading={isLoadingDep} loadingContent={<Spinner label="" color="primary" labelColor="primary" />} emptyContent="ไม่พบข้อมูลแผนก">
                                {(item) => {
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.departmentName}</TableCell>
                                            <TableCell className="text-center">
                                                {
                                                    currentUser.businessId === 1 ?
                                                        (
                                                            <>
                                                                {CompareStatus(item.isHq,
                                                                    {
                                                                        '0': selectedAgent.id === 1 ? null : <Chip size="sm" variant="flat" color="success" className={`font-semibold`}>{item.name}</Chip>,
                                                                        '1': selectedAgent.id === 1 ? <Chip size="sm" variant="flat" color="success" className={`font-semibold`}><CheckIcon /></Chip>

                                                                            : <Chip size="sm" variant="flat" color="warning" className={`font-semibold`}>สำนักงานใหญ่</Chip>
                                                                    })}
                                                            </>
                                                        ) :


                                                        (
                                                            <>
                                                                {CompareStatus(item.isHq,
                                                                    {
                                                                        '0': null,
                                                                        '1': <Chip size="sm" variant="flat" color="success" className={`font-semibold px-2`}><CheckIcon /></Chip>
                                                                    })}
                                                            </>
                                                        )
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p>{item.createBy}</p>
                                                    <p className="text-xs text-gray-400">เมื่อวันที่ {CustomFormatDate(item.createDate, 'DD/MM/YYYY')}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p>{item.updateBy || '-'}</p>
                                                    <p className="text-xs text-gray-400">เมื่อวันที่ {CustomFormatDate(item.updateDate, 'DD/MM/YYYY')}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {selectedAgent.id === 1 || (selectedAgent.id !== 1 && item.isHq !== 1) ?
                                                    (
                                                        <div className="w-full flex justify-center items-center space-x-1">
                                                            <Button isIconOnly variant="light" color="warning" onPress={() => handleModalEdit(item)}>
                                                                <EditIcon className='text-lg' />
                                                            </Button>
                                                            <Button isIconOnly variant="light" color="danger" onPress={() => { setOpenModalDeleteDep(true); setDepRowSelected(item) }}>
                                                                <DeleteIcon className='text-lg' />
                                                            </Button>
                                                        </div>
                                                    ) :
                                                    (
                                                        <div className="w-full flex justify-center items-center space-x-4">

                                                        </div>
                                                    )
                                                }
                                            </TableCell>
                                        </TableRow>
                                    )
                                }}
                            </TableBody>
                        </Table>
                    </Card>
                </div>

            </Card>
        </section>
    )
}


export default ManageDepartments;