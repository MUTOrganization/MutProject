import { Avatar, Button, Card, Chip, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import AgentSelector from "../../../component/AgentSelector";
import fetchProtectedData from "../../../../utils/fetchData";
import { URLS } from "../../../config";
import { useAppContext } from "../../../contexts/AppContext";
import { toastError, toastSuccess } from "../../../component/Alert";
import SearchBox from "../../../component/SearchBox";
import { CompareStatus } from "../../../../utils/CompareStatus";
import { InfomationIcon, InformationIcon } from "../../../component/Icons";
import { ConfirmCancelButtons } from "../../../component/Buttons";
import UserProfileAvatar from "../../../component/UserProfileAvatar";

function AddPersonelDepartment({ open, close, listRoles, listUsers, isSave = false }) {
    const context = useAppContext();
    const [selectRole, setSelectRole] = useState('');
    const [errorSelectRole, setErrorSelectRole] = useState({ state: false, message: '' })

    async function fetchUpdateRoleAndDepUsers() {
        try {
            const res = await fetchProtectedData.put(URLS.users.changeRole, {
                username: Array.from(listUsers),
                roleId: selectRole,
                updateBy: context.currentUser.userName,
                depId: context.currentUser.depId,
            })
            if (res.status === 201) {
                toastSuccess('ดำเนินการสำเร็จ', 'ระบบได้บึนทึกข้อมูลเรียบร้อยแล้ว')
            }

        } catch (err) {
            toastError('เกิดข้อผิดพลาด', 'โปรดลองใหม่อีกครั้ง')
        }
    }

    async function validate() {
        if (!selectRole) {
            setErrorSelectRole({ state: true, message: 'กรุณาเลือกตำแหน่ง' })
            return false;
        }
        if (Array.from(listUsers).length <= 0) {
            toastError('ไม่สามารถดำเนินการได้', 'กรุณาเลือกพนักงานก่อน')
            return false;
        }
        return true;
    }


    async function handleSave() {
        if (await validate()) {
            // Call API add new user to department
            await fetchUpdateRoleAndDepUsers();
            isSave(true);
            setSelectRole('');
            setErrorSelectRole({ state: false, message: 'กรุณาเลือกตำแหน่ง' })
            close(false);
        }
    }

    function handleClose() {
        setSelectRole('');
        setErrorSelectRole({ state: false, message: 'กรุณาเลือกตำแหน่ง' })
        isSave(false);
        close(false);
    }

    return (
        <Modal size="lg" isOpen={open} onClose={() => close(false)}>
            <ModalContent>
                <ModalHeader className="flex text-lg text-primary justify-center bg-blue-100 font-semibold">
                    <p>เพิ่มพนักงานเข้าแผนก</p>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-5">
                        <Select
                            size="sm"
                            label='เลือกตำแหน่ง'
                            labelPlacement="outside"
                            variant="bordered"
                            isInvalid={errorSelectRole.state}
                            errorMessage={errorSelectRole.message}
                            onChange={(e) => { setSelectRole(e.target.value); setErrorSelectRole({ state: false, message: '' }) }}
                            items={listRoles}
                        >
                            {(item) => {
                                return (
                                    <SelectItem key={item.id} value={item.id}>{item.roleName}</SelectItem>
                                )
                            }}
                        </Select>

                        <Table aria-label="table-addUser" selectionBehavior="toggle" color="primary" selectionMode="single" className="max-h-96" >
                            <TableHeader>
                                <TableColumn key={'username'}>พนักงานที่เลือกทั้งหมด {Array.from(listUsers).length} คน</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {Array.from(listUsers).map(item => {
                                    return (
                                        <TableRow key={item}>
                                            <TableCell>
                                                {item}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <ConfirmCancelButtons onCancel={handleClose} confirmText="เพิ่ม" size="sm" onConfirm={handleSave} />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}


function RemovePersonelInDepartment({ open, close, listUsers, isSave = false }) {
    const context = useAppContext();

    async function fetchRemoveRoleInDepUsers() {
        try {
            const res = await fetchProtectedData.put(URLS.users.changeRole, {
                username: Array.from(listUsers),
                roleId: null,
                updateBy: context.currentUser.userName,
                depId: null,
            })
            if (res.status === 201) {
                toastSuccess('ดำเนินการสำเร็จ', 'ระบบได้บึนทึกข้อมูลเรียบร้อยแล้ว')
            }

        } catch (err) {
            toastError('เกิดข้อผิดพลาด', 'โปรดลองใหม่อีกครั้ง')
        }
    }


    async function handleSave() {
        if (Array.from(listUsers).length <= 0) {
            toastError('ไม่สามารถดำเนิกการได้', 'กรุณาเลือกพนักงานก่อน')
            return;
        }
        await fetchRemoveRoleInDepUsers();
        isSave(true);
        close(false)
    }

    function handleClose() {
        isSave(false);
        close(false);
    }

    return (
        <Modal size="lg" isOpen={open} onClose={() => close(false)}>
            <ModalContent>
                <ModalHeader className="flex text-lg text-primary justify-center bg-blue-100 font-semibold">
                    <p>นำพนักงานออกจากแผนก</p>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-5">
                        <Table aria-label="table-addUser" selectionBehavior="toggle" color="primary" selectionMode="single" className="max-h-96" >
                            <TableHeader>
                                <TableColumn key={'username'}>พนักงานที่เลือกทั้งหมด {Array.from(listUsers).length} คน</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {Array.from(listUsers).map(item => {
                                    return (
                                        <TableRow key={item}>
                                            <TableCell>
                                                {item}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <ConfirmCancelButtons onCancel={handleClose} confirmText="นำออก" size="sm" cancelColor="bg-warning" confirmColor="bg-danger" onConfirm={handleSave} />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}


function DepPersonelManagement() {
    //ContextData 
    const { currentUser, agent } = useAppContext();

    //Field state List Data Source
    const [listUsersOutDep, setListUsersOutDep] = useState([]);
    const [listUsersInDep, setListUsersInDep] = useState([]);
    const [listItemsDepartments, setListItemsDepartments] = useState([]);
    const [listItemsRoles, setListItemRoles] = useState([]);

    //Field state Loading 
    const [loadingListOutDep, setLoadingListOutDep] = useState(false);
    const [loadingListDep, setLoadingListDep] = useState(false);
    const [loadingListRoles, setLoadingListRoles] = useState(false);

    //Field state Filter Data Source
    const [selectedDep, setSelectedDep] = useState('all');
    const [selectedRole, setSelectedRole] = useState('allRoles');
    const [searchListUserOutDep, setSearchListUserOutDep] = useState([]);

    const [selectedRoleInDep, setSelectedRoleInDep] = useState('allRoles');
    const [searchListUserInDep, setSearchListUserInDep] = useState([]);

    const [selectedUsers, setSelectedUsers] = useState(new Set());
    const [selectedUsersInDep, setSelectedUsersInDep] = useState(new Set());

    //Field state Modal
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [fetchIsSave, setFetchIsSave] = useState(false);

    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [fetchIsRemove, setFetchIsRemove] = useState(false);


    //#region Fetch Functions
    async function fetchUsersOutDep() {
        //API Fetch List Users Out Department
        setLoadingListOutDep(true);
        //API Call
        try {
            const res = await fetchProtectedData.get(URLS.users.getAll, { params: { businessId: agent.selectedAgent.id } })
            if (res.status == 200) {
                let usersOutDep = res.data.filter(x => x.depId !== currentUser.depId)
                let usersInDep = res.data.filter(x => x.depId === currentUser.depId)
                setListUsersOutDep(usersOutDep);
                setSearchListUserOutDep(usersOutDep);
                setListUsersInDep(usersInDep);
                setSearchListUserInDep(usersInDep);
                setLoadingListOutDep(false);
            }
        } catch (e) {
            toastError('เกิดข้อผิดพลาด', 'กรุณาลองใหม่อีกครั้ง')
        } finally {
            setLoadingListOutDep(false);
        }
    }

    async function fetchAllDeps() {
        //API Fetch List All Departments
        setLoadingListDep(true);
        //API Call
        try {
            const res = await fetchProtectedData.get(URLS.departments.getall, {
                params: {
                    businessId: agent.selectedAgent.id,
                }
            })
            if (res.status == 200) {
                setListItemsDepartments(res.data);
                setLoadingListDep(false);
            }
        } catch (e) {
            toastError('เกิดข้อผิดพลาด', 'กรุณาลองใหม่อีกครั้ง')
        } finally {
            setLoadingListDep(false);
        }
    }

    async function fetchAllRoles() {
        setLoadingListRoles(true);
        try {
            const res = await fetchProtectedData.get(URLS.roles.getall, { businessId: agent.selectedAgent.id })
            if (res.status == 200) {
                setListItemRoles(res.data);
            }
        } catch (err) {
            toastError('เกิดข้อผิดพลาด', 'กรุณาลองใหม่อีกครั้ง')
        } finally {
            setLoadingListRoles(false);
        }
    }

    //#endregion Fetch Functions

    //#region Functions Utility
    function handleBeforeSearch(copyData) {
        return copyData;
    }

    function handleSearchResult(result) {
        setSearchListUserOutDep(result);
    }

    function handleBeforeSearch2(copyData) {
        return copyData;
    }

    function handleSearchResult2(result) {
        setSearchListUserInDep(result);
    }

    function handleSelectionChange(keys) {
        let selectedUsers = [];

        if (keys === 'all') {
            selectedUsers = searchListUserOutDep.map(user => user.username);
        } else {
            const users = Array.from(keys).map(key =>
                searchListUserOutDep.find(user => user.username === key)
            );

            selectedUsers = users.filter(user => user).map(user => user.username);
        }
        setSelectedUsers(new Set(selectedUsers));
    }

    function handleSelectionChangeInDep(keys) {
        let selectedUsers = [];

        if (keys === 'all') {
            selectedUsers = searchListUserInDep.map(user => user.username);
        } else {
            const users = Array.from(keys).map(key =>
                searchListUserInDep.find(user => user.username === key)
            );

            selectedUsers = users.filter(user => user).map(user => user.username);
        }
        setSelectedUsersInDep(new Set(selectedUsers));
    }
    //#endregion

    //#region useEffect
    useEffect(() => {
        fetchUsersOutDep();
        fetchAllDeps();
        fetchAllRoles();
    }, [])

    useEffect(() => {
        fetchUsersOutDep();
        fetchAllDeps();
    }, [agent.selectedAgent])

    useEffect(() => {
        if (fetchIsSave || fetchIsRemove) {
            fetchUsersOutDep();
            setSelectedUsers(new Set());
            setSelectedUsersInDep(new Set());
            setFetchIsSave(false);
            setFetchIsRemove(false);
        }
    }, [fetchIsSave, fetchIsRemove])

    //#endregion useEffect

    return (
        <section className="w-full">

            <AddPersonelDepartment open={openModalAdd} close={e => setOpenModalAdd(e)} listUsers={selectedUsers} listRoles={listItemsRoles.filter(x => x.depId === currentUser.depId)} isSave={e => setFetchIsSave(e)} />

            <RemovePersonelInDepartment open={openModalDelete} close={e => setOpenModalDelete(e)} listUsers={selectedUsersInDep} isSave={e => setFetchIsRemove(e)} />

            <Card className="flex p-4 h-full min-h-[700px] w-full shadow-none">
                <p>จัดการบุคลากรภายในแผนก</p>
                <Divider className="my-2" />
                <div className="w-full flex space-x-4 my-4 max-lg:flex-wrap">
                    <div className="flex-1">
                        {/*Tools Content */}
                        <div className="w-full mb-4">
                            <div className="flex justify-between space-x-6">
                                <p className="font-semibold text-md">พนักงานทั้งหมด ({searchListUserOutDep.length}) คน</p>
                            </div>
                            <div className="flex-wrap justify-start  space-y-0 items-center h-fit w-full">
                                <div className="flex space-x-4">
                                    <Select
                                        aria-label="select-dep"
                                        className="max-w-xs mb-5"
                                        size="sm"
                                        variant="bordered"
                                        selectionMode="single"
                                        label='แผนก'
                                        labelPlacement="outside"
                                        isLoading={loadingListDep}
                                        items={[{ id: 'all', departmentName: 'ทั้งหมด' }, ...listItemsDepartments, { id: 'noDep', departmentName: 'ไม่มีแผนก' }]}
                                        defaultSelectedKeys={['all']}
                                        onChange={(value) => { setSelectedDep(value.target.value) }} >
                                        {(dep) => {
                                            return (
                                                <SelectItem key={dep.id} value={dep.id} endContent={dep.isHq == 1 && <Chip color="success" size="sm" variant="flat">สำนักงานใหญ่</Chip>}>
                                                    {dep.departmentName}
                                                </SelectItem>
                                            )
                                        }}
                                    </Select>


                                    <Select
                                        aria-label="select-dep"
                                        className="max-w-xs mb-5"
                                        size="sm"
                                        variant="bordered"
                                        selectionMode="single"
                                        label='ตำแหน่ง'
                                        labelPlacement="outside"
                                        isLoading={loadingListRoles}
                                        items={[{ id: 'allRoles', roleName: 'ทั้งหมด' }, ...listItemsRoles.filter(x => x.depId == selectedDep), { id: 'noRole', roleName: 'ไม่มีตำแหน่ง' }]}
                                        defaultSelectedKeys={['allRoles']}
                                        onChange={(value) => { setSelectedRole(value.target.value) }} >
                                        {(role) => {
                                            return (
                                                <SelectItem key={role.id} value={role.id} endContent={role.isHq == 1 && <Chip color="success" size="sm" variant="flat">สำนักงานใหญ่</Chip>}>
                                                    {role.roleName}
                                                </SelectItem>
                                            )
                                        }}
                                    </Select>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">

                                <div>
                                    <SearchBox
                                        className={'max-w-xs'}
                                        data={listUsersOutDep}
                                        variant="bordered"
                                        placeholder="ค้นหาพนักงาน"
                                        searchRules={[['username', 10], ['depName', 10], ['nickName', 8], ['name', 8], ['roleName', 10]]}
                                        onChange={handleSearchResult}
                                        onBeforeSearch={handleBeforeSearch}
                                    />
                                </div>

                                <Button variant="flat" color="success" size="sm" radius="full" onPress={() => setOpenModalAdd(true)}>เพิ่มเข้าแผนก</Button>


                            </div>
                        </div>

                        <Card className="h-[600px] shadow-md overflow-auto scrollbar-hide">
                            <Table className="w-full"
                                isHeaderSticky
                                removeWrapper
                                selectedKeys={selectedUsers}
                                selectionMode="multiple" color="primary" aria-label="table-usersOutDep" onSelectionChange={handleSelectionChange}>
                                <TableHeader>
                                    <TableColumn key={'username'}>ชื่อผู้ใช้</TableColumn>
                                    <TableColumn key={'position'}>ตำแหน่ง / แผนก</TableColumn>
                                </TableHeader>
                                <TableBody items={
                                    (selectedDep === 'all' ? searchListUserOutDep :
                                        selectedDep === 'noDep' ? searchListUserOutDep.filter(x => x.depId === null) :
                                            searchListUserOutDep.filter(x => x.depId == selectedDep))
                                        .filter(x =>
                                            selectedRole === 'allRoles' ? true :
                                                selectedRole === 'noRole' ? x.roleId === null :
                                                    x.roleId == selectedRole)
                                }
                                    emptyContent='ไม่พบข้อมูลพนักงาน' isLoading={loadingListOutDep} loadingContent={<Spinner color="primary" />}>
                                    {(user) => {
                                        const firstLatter = user.username.includes('_') ? user.username.split('_')[1][0] : user.username[0];
                                        return (
                                            <TableRow key={user.username}>
                                                <TableCell>
                                                    <div className="flex gap-3 items-center justify-start">
                                                        <UserProfileAvatar name={user.username} key={user.username} imageURL={user.displayImgUrl} />
                                                        <div>
                                                            <h1 className="font-semibold">{user.username}</h1>
                                                            <p className="text-xs text-gray-400">{user.nickName || ''}</p>
                                                            <p className="text-xs text-gray-400">{user.name}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <h1 className="font-semibold">{user.roleName || '-'}</h1>
                                                        <p className="text-xs text-gray-400">{user.depName || '-'}</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }}
                                </TableBody>
                            </Table>
                        </Card>
                    </div>
                    <Divider orientation="vertical" />
                    <div className="flex-1 mt-2">
                        {/*Tools Content */}
                        <div className="w-full mb-4">
                            <div className="flex justify-between space-x-6">
                                <p className="font-semibold text-md">พนักงานในแผนก ({searchListUserInDep.length}) คน</p>
                            </div>
                            <div className="flex-wrap justify-start  space-y-0 items-center h-fit w-full">
                                <div className="flex space-x-4 items-center">
                                    <Select
                                        aria-label="select-dep"
                                        className="max-w-xs mb-5"
                                        size="sm"
                                        variant="bordered"
                                        selectionMode="single"
                                        label='ตำแหน่ง'
                                        labelPlacement="outside"
                                        isLoading={loadingListRoles}
                                        items={[{ id: 'allRoles', roleName: 'ทั้งหมด' }, ...listItemsRoles.filter(x => x.depId == currentUser.depId), { id: 'noRole', roleName: 'ไม่มีตำแหน่ง' }]}
                                        defaultSelectedKeys={['allRoles']}
                                        onChange={(value) => { setSelectedRoleInDep(value.target.value) }} >
                                        {(role) => {
                                            return (
                                                <SelectItem key={role.id} value={role.id} endContent={role.isHq == 1 && <Chip color="success" size="sm" variant="flat">สำนักงานใหญ่</Chip>}>
                                                    {role.roleName}
                                                </SelectItem>
                                            )
                                        }}
                                    </Select>

                                    <SearchBox
                                        className={'max-w-xs'}
                                        data={listUsersInDep}
                                        variant="bordered"
                                        placeholder="ค้นหาพนักงาน"
                                        searchRules={[['username', 10], ['depName', 10], ['nickName', 8], ['name', 8], ['roleName', 10]]}
                                        onChange={handleSearchResult2}
                                        onBeforeSearch={handleBeforeSearch2}
                                    />
                                </div>

                                <div className="flex justify-end items-center">
                                    <Button variant="flat" color="danger" size="sm" radius="full" onPress={() => setOpenModalDelete(true)}>นำพนักงานออกจากแผนก</Button>
                                </div>
                            </div>
                        </div>


                        <Card className="h-[600px] shadow-md overflow-auto scrollbar-hide">
                            <Table className="w-full" selectedKeys={selectedUsersInDep} isHeaderSticky removeWrapper onSelectionChange={handleSelectionChangeInDep} selectionMode="multiple" color="primary" aria-label="table-usersOutDep">
                                <TableHeader>
                                    <TableColumn key={'username'}>ชื่อผู้ใช้</TableColumn>
                                    <TableColumn key={'position'}>ตำแหน่ง / แผนก</TableColumn>
                                </TableHeader>
                                <TableBody items={selectedRoleInDep === 'allRoles' ? searchListUserInDep : searchListUserInDep.filter(x => x.roleId == selectedRoleInDep)} emptyContent='ไม่พบข้อมูลพนักงาน' isLoading={loadingListOutDep} loadingContent={<Spinner color="primary" />}>
                                    {(user) => {
                                        const firstLatter = user.username.includes('_') ? user.username.split('_')[1][0] : user.username[0];
                                        return (
                                            <TableRow key={user.username}>
                                                <TableCell>
                                                    <div className="flex gap-3 items-center justify-start">
                                                        <UserProfileAvatar name={user.username} key={user.username} imageURL={user.displayImgUrl} />
                                                        <div>
                                                            <h1 className="font-semibold">{user.username}</h1>
                                                            <p className="text-xs text-gray-400">{user.nickName || ''}</p>
                                                            <p className="text-xs text-gray-400">{user.name}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="flex items-center space-x-3">
                                                    <div>
                                                        <h1 className="font-semibold">{user.roleName || '-'}</h1>
                                                        <p className="text-xs text-gray-400">{user.depName || '-'}</p>
                                                    </div>
                                                    {!listItemsRoles.some(role => role.id === user.roleId) &&
                                                        <Tooltip content='ตำแหน่งนี้ถูกปิดใช้งานแล้ว' placement="bottom" showArrow>
                                                            <span className="text-danger">
                                                                <InfomationIcon size={18} />
                                                            </span>
                                                        </Tooltip>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }}
                                </TableBody>
                            </Table>
                        </Card>
                    </div>
                </div>
            </Card>
        </section>
    )
}



export default DepPersonelManagement;