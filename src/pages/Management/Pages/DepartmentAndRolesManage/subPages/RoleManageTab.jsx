import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../../../../contexts/AppContext";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { AlertQuestion, toastError, toastSuccess, toastWarning } from "../../../../../component/Alert";
import { URLS } from "../../../../../config";
import { Button, Card, CheckboxIcon, Chip, getKeyValue, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure } from "@nextui-org/react";
import { CheckIcon, DeleteIcon, HFCheck, HFPlus, MenuIcon, SortIcon } from "../../../../../component/Icons";
import { toast } from "sonner";
import RoleAccesBox from "../components/RoleAccessBox";
import { ACCESS } from "../../../../../configs/accessids";
import MultiAddRoleAccessModal from "../components/MultiAddRoleAccessModal";
import AgentSelector from "../../../../../component/AgentSelector";
import SortableDragAndDrop from "../../../../../component/DragAndDrop/SortableDragAndDrop";

export default function RoleManageTab() {
    const { currentUser, agent, accessCheck } = useAppContext();
    const { agentList, loadAgent, selectedAgent, setSelectedAgent } = agent;
    const isHq = currentUser.businessId == 1;

    const [selectedRole, setSelectedRole] = useState(null);
    const [roleList, setRoleList] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(false);

    const [depList, setDepList] = useState([]);
    const [selectedDep, setSelectedDep] = useState({ id: null });

    const [newRoles, setNewRoles] = useState({ name: '', attachRoleId: 0, roleLevelType: 'lower' });
    const [showValidate, setShowValidate] = useState(false);
    const [loadSubmit, setLoadSubmit] = useState(false);

    const [selectedDeleteRole, setSelectedDeleteRole] = useState();
    const [isShowAlert, setIsShowAlert] = useState(false);

    const [accessList, setAccessList] = useState([]);
    const [loadAccessList, setLoadAccessList] = useState(false);

    const [isShowMultiAdd, setIsShowMultiAdd] = useState(false);

    const [isSortRoleModalShow, setIsSortRoleModalShow] = useState(false);
    const [selectedSortDep, setSelectedSortDep] = useState(null);
    const [sortingRoles, setSortingRoles] = useState([]);
    const [isOrderChange, setIsOrderChange] = useState(false);


    const roleListToMultiAdd = useMemo(() => {
        return roleList.filter(e => e.isHq != '1');
    },[roleList])

    const selectedDepRoles = useMemo(() => {
        return roleList.filter(role => role.depId == selectedDep.id);
    }, [selectedDep])

    const isRoleNameValid = useMemo(() => {
        return !(newRoles.name.trim() == "")
    }, [newRoles])

    useEffect(() => {
        if (selectedSortDep) {
            setSortingRoles(roleList.filter(role => role.depId == selectedSortDep.id));
        }else{
            setSortingRoles([]);
        }
    }, [selectedSortDep])

    useEffect(() => {
        const roles = roleList.filter(role => role.depId == selectedDep.id);
        if (roles.length > 0) setNewRoles(p => ({ ...p, attachRoleId: roles[0].id }))
    }, [selectedDep])

    //#region fetchFunction
    const fetchData = async () => {
        try {
            setLoadingRoles(true);
            const [rolesResponse, depResponse] = await Promise.all([
                fetchProtectedData.get(`${URLS.roles.getall}/?businessId=${selectedAgent.id}`),
                fetchProtectedData.get(`${URLS.departments.getall}/?businessId=${selectedAgent.id}`)
            ]);
            if (rolesResponse.status === 200) {
                setRoleList(rolesResponse.data);
                setDepList(depResponse.data);
                setLoadingRoles(false);
            } else {
                toastError("เกิดข้อผิดพลาด", "โปรดลองใหม่อีกครั้ง");
            }
        } catch (err) {
            setLoadingRoles(false);
            console.error('error fetching department');
            toastError("เกิดข้อผิดพลาด", "โปรดลองใหม่อีกครั้ง");
        }
    };
    async function fetchAccess() {
        try {
            setLoadAccessList(true);
            const response = await fetchProtectedData.get(URLS.access.getAll, {
                params: {
                    businessId: selectedAgent.id,
                    safe: selectedAgent.id == '1' ? 'false': 'true'
                }
            })
            setAccessList(response.data)
        } catch (err) {
            console.error('error fetching access');
            toastError('เกิดข้อผิดพลาด', 'กรุณาลองใหม่อีกครั้ง');
        } finally {
            setLoadAccessList(false);
        }
    }
    //#endregion fetchFunction

    //#region side Effect
    useEffect(() => {
        fetchData();
        fetchAccess();
    }, [selectedAgent])


    //#endregion side Effect

    //#region handler function
    function handleSelectAgent(id) {
        const findAgent = agentList.find(e => e.id == id);
        if (findAgent) {
            setSelectedAgent(findAgent);
        }
    }
    function handleSelectRole(id) {
        const findRole = roleList.find(e => e.id == id);
        if (findRole) {
            setSelectedRole(findRole);
        }
    }
    function handleSelectDep(id) {
        const findDep = depList.find(e => e.id == id);
        if (findDep) {
            setSelectedDep(findDep);
        }
    }

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

    async function handleSubmit() {
        setShowValidate(true)
        if (!isRoleNameValid || selectedDep.id === 'none') return;

        try {
            setLoadSubmit(true);

            const responseAddRole = await fetchProtectedData.post(`${URLS.roles.add}`, {
                role: newRoles.name,
                departmentId: selectedDep.id,
                departmentName: selectedDep.departmentName,
                createBy: currentUser.userName,
                levelType: newRoles.roleLevelType,
                levelRole: newRoles.attachRoleId,
                isHq: selectedAgent.id == '1' ? selectedDep.isHq : '0'
            })

            setSelectedDep({ id: 'none' });
            setNewRoles({ name: '', attachRoleId: 0, roleLevelType: 'lower' });
            setShowValidate(false);
            onClose();
            fetchData();
            toastSuccess('สำเร็จ', 'เพิ่มตำแหน่งสำเร็จ');
        } catch (err) {
            if (err.response && err.response.status === 422) {
                toastWarning('ชื่อซ้ำ', `แผนก ${selectedDep.departmentName} มีตำแหน่ง ${newRoles.name} อยู่แล้ว`)
                return;
            }
            console.error('error add role');
            toastError('เกิดข้อผิดพลาด', 'กรุณาลองใหม่อีกครั้ง');
        } finally {
            setLoadSubmit(false)
        }

    }

    function handleDeleteRoleClick(id) {
        setSelectedDeleteRole(roleList.find(e => e.id == id))
        setIsShowAlert(true);
    }
    async function handleDeleteRole() {
        try {
            const response = await fetchProtectedData.delete(`${URLS.roles.delete}/${selectedDeleteRole.id}`, {
                params: {
                    isHq: selectedAgent.id == '1' && selectedDeleteRole.isHq == '1' ? '1' : '0'
                }
            });
            if (response.status === 201) {
                setRoleList(prevRoles => prevRoles.filter(role => role.id !== selectedDeleteRole.id));
                toastSuccess("สถานะการทำรายการ", "ลบ " + selectedDeleteRole.roleName + " สำเร็จ");
                setIsShowAlert(false);

            } else {
                toastError("สถานะการทำรายการ", "ดำเนินการไม่สำเร็จ");
            }
        } catch (err) {
            console.error('error delete role');
            toastError("เกิดข้อผิดพลาด", "ดำเนินการไม่สำเร็จ");
        }
    }

    function handleSortDepSelect(id) {
        const findDep = depList.find(e => e.id == id);
        if(findDep){
            setSelectedSortDep(findDep);
        }
    }

    async function handleSortingSubmit(){
        try{
            setLoadSubmit(true)
            if(selectedSortDep.isHq == '1'){
                const body = sortingRoles.map((role, index) => ({
                        roleName: role.roleName,
                        level: index + 1
                    }));
                await fetchProtectedData.put(`${URLS.roles.updateLevelHq}`, {
                    roles: body,
                    depName: selectedSortDep.departmentName
                })
            }else{
                const body = sortingRoles.map((role, index) => ({
                        id: role.id,
                        level: index + 1
                    }));
                await fetchProtectedData.put(`${URLS.roles.updateLevel}`, {
                    roles: body
                })
            }
            toastSuccess('สำเร็จ','อัพเดทลำดับตำแหน่งแล้ว');
            setIsSortRoleModalShow(false);
            fetchData();
        }catch(err){
            console.error(err);
            toastError('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
        }finally{
            setLoadSubmit(false);
        }
    }

    function onSortingModalClose() {
        setSelectedSortDep(null);
        setSortingRoles([]);
        setIsSortRoleModalShow(false)
    }
    //#endregion hander function
    const dummyDeps = [
        {
            id: 1,
            departmentName: 'Accounting',
            isHq: 0,
            status: 1,
            createDate: '2021-01-01',
            createBy: 'hq000_o',
            updateDate: '2021-01-01',
            updateBy: 'hq000_o',
        },
        {
            id: 2,
            departmentName: 'Sales',
            isHq: 1,
            status: 1,
            createDate: '2021-01-01',
            createBy: 'hq000_o',
            updateDate: '2021-01-01',
            updateBy: 'hq000_o',
        },
        {
            id: 3,
            departmentName: 'Marketing',
            isHq: 0,
            status: 1,
            createDate: '2021-01-01',
            createBy: 'hq000_o',
            updateDate: '2021-01-01',
            updateBy: 'hq000_o',
        },
        {
            id: 4,
            departmentName: 'CRM',
            isHq: 1,
            status: 1,
            createDate: '2021-01-01',
            createBy: 'hq000_o',
            updateDate: '2021-01-01',
            updateBy: 'hq000_o',
        },
        {
            id: 5,
            departmentName: 'HR',
            isHq: 0,
            status: 1,
            createDate: '2021-01-01',
            createBy: 'hq000_o',
            updateDate: '2021-01-01',
            updateBy: 'hq000_o',

        },
        {
            id: 6,
            departmentName: 'IT',
            isHq: 1,
            status: 1,
            createDate: '2021-01-01',
            createBy: 'hq000_o',
            updateDate: '2021-01-01',
            updateBy: 'hq000_o',
        },
    ]
    const dummpyRoles = [
        {
            id: 1,
            roleName: 'Manager',
            depId: 1,
            departmentName: 'Accounting',
            isHq: '0',
            createBy: 'admin',
            
        },
        {
            id: 2,
            roleName: 'Staff',
            depId: 1,
            departmentName: 'Accounting',
            isHq: '0',
            createBy: 'admin',
        },
        {
            id: 4,
            roleName: 'Manager',
            depId: 2,
            departmentName: 'Sales',
            isHq: '1',
            createBy: 'admin',
        },
        {
            id: 5,
            roleName: 'Senior',
            depId: 2,
            departmentName: 'Sales',
            isHq: '1',
            createBy: 'admin',
        },
        {
            id: 6,
            roleName: 'Supervisor',
            depId: 2,
            departmentName: 'Sales',
            isHq: '1',
            createBy: 'admin',
        },
        {
            id: 7,
            roleName: 'Junior',
            depId: 2,
            departmentName: 'Sales',
            isHq: '1',
            createBy: 'admin',
        },
        {
            id: 8,
            roleName: 'Manager',
            depId: 3,
            departmentName: 'Marketing',
            isHq: '0',
            createBy: 'admin',
        },
        {
            id: 9,
            roleName: 'Senior',
            depId: 3,
            departmentName: 'Marketing',
            isHq: '0',
            createBy: 'admin',
        },
        {
            id: 10,
            roleName: 'Junior',
            depId: 3,
            departmentName: 'Marketing',
            isHq: '0',
            createBy: 'admin',
        },
        {
            id: 11,
            roleName: 'Manager',
            depId: 4,
            departmentName: 'CRM',
            isHq: '1',
            createBy: 'admin',
        },
        {
            id: 12,
            roleName: 'Senior',
            depId: 4,   
            departmentName: 'CRM',  
            isHq: '1',
            createBy: 'admin',
        },
        {
            id: 13,
            roleName: 'Junior', 
            depId: 4,
            departmentName: 'CRM',
            isHq: '1',
            createBy: 'admin',
        },  
        {
            id: 14,
            roleName: 'Manager',
            depId: 5,
            departmentName: 'HR',
            isHq: '0',
            createBy: 'admin',
        },
        {
            id: 15,
            roleName: 'Staff',
            depId: 5,
            departmentName: 'HR',
            isHq: '0',
            createBy: 'admin',
        },
    ]
    
    return (
        <div>
            <div className="md:flex items-center justify-between">
                <div className="md:flex max-md:mb-3 items-center">
                    {
                        isHq &&
                        <AgentSelector />
                    }
                </div>
                <div>
                    {
                        accessCheck.haveAny(['FIX']) &&
                        <Button size="sm" className="text-white bg-amber-500 font-bold" onPress={() => setIsShowMultiAdd(true)}>เพิ่มสิทธิ์ให้หลายตำแหน่ง</Button>
                    }
                </div>
            </div>
            <div className="mt-6 xl:flex">
                {/* #region RoleTable */}
                <div className="xl:max-w-lg w-full max-xl:mb-10">
                    <Card className="p-4" shadow="sm">
                        <Table aria-label="table"
                            className="h-[590px] overflow-auto !shadow-none scrollbar-hide"
                            isHeaderSticky
                            removeWrapper
                            selectionMode="single"
                            color="primary"
                            selectedKeys={["1" ?? selectedRole?.id + ""]}
                            onSelectionChange={(key) => handleSelectRole(Array.from(key)[0])}
                        >
                            <TableHeader>
                                <TableColumn><div className="text-[13px]">ตำแหน่ง</div></TableColumn>
                                <TableColumn align="center">
                                    {
                                        selectedAgent.id == '1' ?
                                            <div>สร้างให้ตัวแทน</div>
                                            :
                                            <div>สร้างโดยสำนักงานใหญ่</div>
                                    }
                                </TableColumn>
                                <TableColumn>
                                    <div className="flex justify-end py-2">
                                        {
                                        accessCheck.haveAny(['FIX']) &&
                                        <div className="flex">
                                            <Tooltip content="เพิ่มตำแหน่ง" placement="top" color="success" classNames={{content: 'text-white'}}>
                                                <Button size="sm" isIconOnly variant="light" color="success" onPress={() => onOpen()}><HFPlus size={16} /></Button>
                                            </Tooltip>
                                            <Tooltip content="เรียงลำดับตำแหน่ง" placement="top" color="primary" >
                                                <Button size="sm" isIconOnly variant="light" color="primary" onPress={() => setIsSortRoleModalShow(true)}><SortIcon size={16} /></Button>
                                            </Tooltip>
                                        </div>
                                        }
                                    </div>
                                </TableColumn>
                            </TableHeader>
                            <TableBody items={dummpyRoles ?? roleList}
                                isLoading={loadingRoles}
                                emptyContent={"ไม่มีตำแหน่ง"}
                            >
                                {(role) => (
                                    <TableRow key={role.id}>
                                        <TableCell>
                                            <div className="py-2">
                                                <span className="font-bold">{`${role.departmentName}`}</span> - <span>{role.roleName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center">
                                                {
                                                    selectedAgent.id == '1' && role.isHq == '1' ?
                                                        <div className="text-xs font-semibold flex justify-center items-center">
                                                            <Chip color="success" variant="flat"><HFCheck size={12} /></Chip>
                                                            {/* <div className="px-3 py-0.5 w-fit rounded-full bg-green-300 text-green-700 shadow-sm"><HFCheck size={16} /></div> */}
                                                        </div> :
                                                        selectedAgent.id == '1' && role.isHq == '0' ?
                                                        <div className="text-xs font-semibold"></div> :
                                                        selectedAgent.id != '1' && role.isHq == '1' ?
                                                        <Chip className="text-[10px]" color="success" variant="flat"><CheckIcon/></Chip>
                                                        :
                                                        null
                                                }
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-end">
                                            {
                                                !((role.isHq == '1' && selectedAgent.id != '1') ||
                                                    !(accessCheck.haveOne('FIX'))) && 
                                                <Button isIconOnly variant="light" color="danger" onPress={() => handleDeleteRoleClick(role.id)}>
                                                    <DeleteIcon />
                                                </Button>

                                            }
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                    <AlertQuestion
                        title={'ยืนยันการลบตำแหน่ง'}
                        content={<div className="w-full p-2 text-center">
                        <p>ต้องการลบตำแหน่ง</p>
                        <p className=""> <span className="text-lg text-wrap text-red-500">{'Accounting' ?? selectedDeleteRole?.departmentName} - {'Manager' ?? selectedDeleteRole?.roleName}</span> หรือไม่</p>
                    </div>}
                        isOpen={isShowAlert} onClose={() => setIsShowAlert(false)}
                        isLoading={loadSubmit}
                        onConfirm={handleDeleteRole}
                        color="danger"
                    >

                    </AlertQuestion>
                </div>
                {/* End Role Table */}

                {/* Add Modal */}
                <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} size="lg">
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader>
                                    <div className="py-3">เพิ่มตำแหน่ง</div>
                                </ModalHeader>
                                <ModalBody>
                                    <div className=" mx-8 mb-4 p-3">
                                        <div className="mb-6">
                                            <Select aria-label="department select" label="เลือกแผนก" variant="bordered"
                                                // selectedKeys={selectedDep ? [selectedDep?.id + ""] : []}
                                                // onSelectionChange={(key) => handleSelectDep(Array.from(key)[0])}
                                                isInvalid={showValidate && selectedDep.id === null}
                                            >
                                                {(dummyDeps ?? depList).filter(e => selectedAgent.id == '1' || e.isHq == '0')?.map(dep => (
                                                    <SelectItem key={String(dep.id)}  endContent={dep.isHq == '1' ? <Chip color="success" size="sm" variant="flat">HQ</Chip> : null} >
                                                        {dep.departmentName}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        </div>
                                        <div className="mb-10">
                                            <Input aria-label="role name input" label="ชื่อตำแหน่ง" variant="bordered"
                                                value={newRoles.name}
                                                onValueChange={(value) => setNewRoles(p => ({ ...p, name: value }))}
                                                isInvalid={showValidate && !isRoleNameValid}
                                            />
                                        </div>
                                        {
                                            selectedDep && selectedDep.id !== 'none' && selectedDepRoles.length > 0 &&
                                            <div className="">
                                                <div className="text-sm">ลำดับของตำแหน่ง</div>
                                                <div className="flex space-x-3">
                                                    <div className="w-32">
                                                        <Select aria-label="role level type select" size="md" variant="faded"
                                                            selectedKeys={[newRoles.roleLevelType]}
                                                            onSelectionChange={(key) => setNewRoles(p => ({ ...p, roleLevelType: Array.from(key)[0] }))}
                                                        >
                                                            <SelectItem key={'lower'}>ต่ำกว่า</SelectItem>
                                                            <SelectItem key={'higher'}>สูงกว่า</SelectItem>
                                                        </Select>
                                                    </div>
                                                    <div className="w-32">
                                                        <Select aria-label="role select" size="md" variant="faded"
                                                            selectedKeys={[newRoles.attachRoleId + ""]}
                                                            onSelectionChange={(key) => setNewRoles(p => ({ ...p, attachRoleId: Array.from(key)[0] }))}
                                                        >
                                                            {
                                                                selectedDepRoles.map(role => (
                                                                    <SelectItem key={role.id}>{role.roleName}</SelectItem>
                                                                ))
                                                            }
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>

                                </ModalBody>
                                <ModalFooter>
                                    <div className="space-x-3">
                                        <Button variant="light" onPress={onClose}>ยกเลิก</Button>
                                        <Button color="success" variant="solid" className="text-white" onPress={handleSubmit} isLoading={loadSubmit}>ยืนยัน</Button>
                                    </div>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>

                </Modal>
                {/* End Add Modal */}

                 {/* Sorting Role Modal */}
                 <Modal isOpen={isSortRoleModalShow} isDismissable={false} size="lg" onClose={() => onSortingModalClose()}>
                    <ModalContent>
                        <ModalHeader>
                            <div className="py-3">จัดลำดับตำแหน่ง</div>
                        </ModalHeader>
                        <ModalBody>
                            <div className=" mx-8 mb-4 p-3">
                                <div className="mb-6">
                                    <Select aria-label="department select" label="เลือกแผนก" variant="bordered"
                                        selectedKeys={selectedSortDep?.id ? [selectedSortDep.id + ""] : []}
                                        onSelectionChange={(key) => handleSortDepSelect(Array.from(key)[0])}
                                    >
                                        { (dummyDeps??  depList).filter(e => selectedAgent.id == '1' || e.isHq == '0')?.map(dep => (
                                            <SelectItem key={String(dep.id)}  endContent={dep.isHq == '1' ? <Chip color="success" size="sm" variant="flat">HQ</Chip> : null} >
                                                {dep.departmentName}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                                {
                                sortingRoles.length <= 0 ?
                                <div className="text-center">ไม่มีตำแหน่ง</div>
                                :
                                <div className="flex space-x-4">
                                    {
                                        sortingRoles.length > 1 &&
                                        <div className=" flex flex-col justify-between py-4">
                                            <div>สูงกว่า</div>
                                            <div>ต่ำกว่า</div>
                                        </div>
                                    }
                                    <div className="flex-1">
                                        <SortableDragAndDrop
                                            items={sortingRoles}
                                            keyFieldName={'id'}
                                            onChange={(newOrder) => {
                                                setIsOrderChange(true);
                                                setSortingRoles(newOrder);
                                            }}
                                        >
                                            {(item, index) => (
                                                <div key={item.id} className="mb-2">
                                                    <Card shadow="sm" className="">
                                                        <div className="flex justify-between items-center p-4">
                                                            <div>{item.roleName}</div>
                                                            <div><MenuIcon/></div>
                                                        </div>
                                                    </Card>
                                                </div>
                                            )}
                                        </SortableDragAndDrop>
                                    </div>
                                </div>
                                }
                                
                            </div>

                        </ModalBody>
                        <ModalFooter>
                            <div className="space-x-3">
                                <Button variant="light" onPress={() => onSortingModalClose()}>ยกเลิก</Button>
                                <Button color="success" variant="solid" className="text-white" onPress={handleSortingSubmit} isLoading={loadSubmit} isDisabled={!isOrderChange}>ยืนยัน</Button>
                            </div>
                        </ModalFooter>
                    </ModalContent>

                </Modal>
                {/* End Sorting Role Modal */}
                <div className="flex-1">
                    <RoleAccesBox selectedRole={selectedRole} accessList={accessList} onSave={() => { }} loadAccessList={loadAccessList} />
                </div>
            </div>
            {/* MultiAdd Modal */}
            <MultiAddRoleAccessModal isOpen={isShowMultiAdd} onClose={() => setIsShowMultiAdd(false)}
                accessList={accessList} roleList={roleListToMultiAdd}
            />
            {/* End MultiAdd Modal */}
        </div>
    )
}