import { Button, Card, DateInput, DatePicker, Divider, Listbox, ListboxItem, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@heroui/react";
import { useAppContext } from "../../../../../contexts/AppContext"
import { toastError, toastSuccess, toastWarning } from "../../../../../component/Alert";
import fetchProtectedData from "@/utils/fetchData";
import { URLS } from "../../../../../config";
import { useEffect, useMemo, useState } from "react";
import { ArrowDownStreamlineUltimateIcon, DeleteIcon } from "../../../../../component/Icons";
import SearchBox from "../../../../../component/SearchBox";
import AgentSelector from "../../../../../component/AgentSelector";
import UserProfileAvatar from "../../../../../component/UserProfileAvatar";
import lodash from 'lodash'
import { CalendarDate, parseDate, today } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import { CustomFormatDate } from "@/utils/dateUtils";

export default function UserStartWorkDateManage(){
    const { currentUser, agent } = useAppContext();
    const { selectedAgent } = agent;

    
    const [listDep, setListDep] = useState([]);
    const [listRoles, setListRoles] = useState([]);
    const [listUsers, setListUsers] = useState([]);

    const [searchListUser, setSearchListUser] = useState([]);

    const [selectedDep, setSelectedDep] = useState(null);
    const [selectedRole, setSelectedRole] = useState('all');
    
    
    const [isLoading, setIsLoading] = useState(false);
    
    const [selectedUsers, setSelectedUsers] = useState(new Set([]));
    /** @type {[CalendarDate]} */
    const [selectedDate, setSelectedDate] = useState(null);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    const filteredUsers = useMemo(() => {
        if(selectedDep){
            if(selectedRole != 'all'){
                return listUsers.filter(u => u.depId == selectedDep && u.roleId == selectedRole)
            }else{
                return listUsers.filter(u => u.depId == selectedDep)
            }
        }else{
            return listUsers;
        }
    },[listUsers, selectedDep, selectedRole])

    useEffect(() => {
        setSearchListUser(filteredUsers);
    },[filteredUsers])

    async function fetchDepartments() {
        //API Departments
        try{
            setIsLoading(true);
            const response = await fetchProtectedData.get(URLS.departments.getall, { 
                params: { 
                    businessId: selectedAgent?.id || currentUser.businessId 
                } 
            });
            setListDep(response.data)
            setSelectedDep(response.data[0]?.id)
        }catch(err){
            toastError('เกิดข้อผิดพลาดระหว่างดึงข้อมูล', 'การดึงข้อมูลจากระบบเกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง')
            console.error('error fetch dep');
            console.error(err);
        }finally{
            setIsLoading(false);
        }
    }
    async function fetchRoleByDepartment() {
        try{
            if(!selectedDep){
                setListRoles([])
                return;
            }
            setIsLoading(true);
            const response = await fetchProtectedData.get(`${URLS.roles.getByDep}/${selectedDep}`)
            setListRoles(response.data);
        }catch(err){
            toastError('เกิดข้อผิดพลาด', 'การดึงข้อมูลตำแหน่งผู้ใช้เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง')
            console.error('error fetch role');
            console.error(err);
        }finally{
            setIsLoading(false);
        }
    }
    async function fetchUsers() {
        try{
            setIsLoading(true);
            const response = await fetchProtectedData.get(URLS.users.getCustom, {
                params:{
                    businessId: selectedAgent?.id || currentUser.businessId,
                }
            })
            setListUsers(response.data);
            console.log(response.data);
        }catch(err) {
            toastError('เกิดข้อผิดพลาด', 'การดึงข้อมูลผู้ใช้เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง')
            console.error('error fetch users');
            console.error(err);
        }finally{
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchDepartments();
        fetchUsers();
    },[selectedAgent])

    useEffect(() => {
        if(!selectedDep) return;
        fetchRoleByDepartment();
    },[selectedDep])

    // useEffect(() => {
    //     if(!selectedDep) return;
    //     fetchUserByRole();
    // },[selectedDep, selectedRole])

    const isSelectAllUsers = useMemo(() => {
        return searchListUser.every(u1 => selectedUsers.has(u1.username))
    },[selectedUsers, searchListUser])

    const userListMap = useMemo(() => {
        return new Map(listUsers.map(u => [u.username, u]));
    }, [listUsers])

    function handleSelectUsers(keys){
        if(keys === 'all'){
            if(isSelectAllUsers){
                setSelectedUsers(p => new Set(lodash.difference(p, searchListUser.map(u => u.username))))
            }else{
                setSelectedUsers(p => new Set(lodash.union(p, searchListUser.map(u => u.username))))
            }
        }else{
            setSelectedUsers(new Set(keys));
        }
    }

    async function handleSubmit(){
        if(!selectedDate){
            toastWarning('กรุณากรอกวันที่ให้ถูกต้อง')
            return;
        }
        try{
            setIsSubmitLoading(true);
            const users = Array.from(selectedUsers);
            console.log('aaa');
            await fetchProtectedData.put(URLS.users.updateWorkStartDate, {
                username: users,
                date: selectedDate.toString()
            })
            toastSuccess('สำเร็จ', 'แก้ไขวันเริ่มงานสำเร็จ');
            fetchUsers();
        }catch(err){
            console.error(err);
            toastError('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
        }finally{
            setIsSubmitLoading(false);
        }
    }

    return (
        <section className="w-full h-[600px]">

            {currentUser.businessId === 1 &&
                <div className="">
                    <AgentSelector />
                </div>
            }
            <div className="flex max-2xl:flex-col max-2xl:space-y-8 2xl:space-x-8 h-full">
                <div className="flex space-x-8 h-full flex-1 ">

                    <div className="max-md:hidden h-full">
                        <Card shadow="sm" className="p-2 w-52 h-full">
                            {listDep.map(dep => {
                                const isSelected = dep.id == selectedDep
                                return(
                                    <div key={dep.id} className={` rounded-lg transition-colors cursor-pointer 
                                        ${isSelected ? 'bg-primary-100 text-primary' : 'hover:bg-gray-200'}`}
                                        onClick={() => setSelectedDep(dep.id)}    
                                    >
                                        <div className="p-2">{dep.departmentName}</div>
                                    </div>
                                )
                            })}
                        </Card>
                    </div>
                    <div className="flex-1 lg:min-w-[600px] h-full flex flex-col">
                        <div className="md:hidden mb-4">
                            <Select
                                variant="bordered"
                                size="sm"
                                label={'แผนก'}
                                disallowEmptySelection
                                labelPlacement="outside"
                                aria-label="select-role"
                                selectedKeys={[String(selectedDep)]}
                                onChange={(e) => { setSelectedDep(e.target.value) }}
                                items={[...listDep]}>
                                {(dep) => {
                                    return (
                                        <SelectItem key={dep.id} value={dep.id}>{dep.departmentName}</SelectItem>
                                    )
                                }}
                            </Select>

                        </div>
                        <div className="flex items-center justify-between mb-4 space-x-4">
                            <div className="flex-1">
                                <Select
                                    variant="bordered"
                                    size="sm"
                                    label={listRoles.length > 0 ? 'ตำแหน่ง' : 'ไม่พบตำแหน่ง'}
                                    labelPlacement="outside"
                                    disallowEmptySelection
                                    aria-label="select-role"
                                    selectedKeys={[selectedRole]}
                                    onChange={(e) => { setSelectedRole(e.target.value) }}
                                    items={[{ id: 'all', roleName: 'ทั้งหมด' }, ...listRoles]}>
                                    {(role) => {
                                        return (
                                            <SelectItem key={role.id} value={role.id}>{role.roleName}</SelectItem>
                                        )
                                    }}
                                </Select>
                            </div>

                            <div className="flex-1 mt-auto">
                                <SearchBox
                                    className={'max-w-xs'}
                                    data={listUsers}
                                    variant="bordered"
                                    placeholder="ค้นหาผู้ใช้"
                                    searchRules={[['username', 10], ['depName', 9], ['nickName', 8], ['name', 8]]}
                                    onChange={(data) => setSearchListUser(data)}
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <Card shadow="sm" className="max-h-[500px] h-full overflow-auto scrollbar-hide">
                                <Table
                                    aria-label="user table"
                                    isHeaderSticky
                                    removeWrapper
                                    selectionMode="multiple"
                                    selectedKeys={selectedUsers}
                                    onSelectionChange={(keys) => handleSelectUsers(keys)}
                                >
                                    <TableHeader>
                                        <TableColumn>ชื่อผู้ใช้</TableColumn>
                                        <TableColumn>ตำแหน่ง</TableColumn>
                                        <TableColumn>วันที่เริ่มทำงาน</TableColumn>
                                    </TableHeader>
                                    <TableBody emptyContent="ไม่พบข้อมูล" loadingContent={<Spinner />} isLoading={isLoading}>
                                        {searchListUser.map(user => {
                                            const workStartDate = CustomFormatDate(user.workStartDate);
                                            return(
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
                                                            <h1 className="font-semibold">{user.roleName}</h1>
                                                            <p className="text-xs text-gray-400">{user.depName}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{workStartDate === 'Invalid date' ? 'ไม่มีข้อมูล' : workStartDate}</TableCell>
                                                </TableRow>
                                                
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </Card>
                        </div>
                    </div>
                </div>
                <div className="flex-1 h-full">
                    <Card shadow="sm" className="p-4 h-full min-h-[300px] overflow-auto scrollbar-hide">
                        <div className="flex flex-col">
                            <div className="flex items-center space-x-4">
                                <I18nProvider locale="en-UK">
                                    <DatePicker label="กรอกวันที่เริ่มงาน"
                                        
                                        showMonthAndYearPickers
                                        value={selectedDate}
                                        onChange={setSelectedDate}
                                    />
                                </I18nProvider>
                                <Button color="primary" variant="flat" isDisabled={selectedUsers.size <= 0 || !selectedDate} onPress={handleSubmit} isLoading={isSubmitLoading}>ยืนยัน</Button>
                            </div>
                            <Divider className="my-4"/>
                            <div className="flex justify-end">เลือกแล้ว <strong className="ms-2">({selectedUsers.size})</strong></div>
                            <div>
                                <div>
                                {Array.from(selectedUsers).map((u) => {
                                    const user = userListMap.get(u)
                                    const workStartDate = CustomFormatDate(user.workStartDate);
                                    return(
                                        <div key={u} className="p-2 border-b text-sm">
                                            <div className="flex justify-between items-center">
                                                <div className="flex gap-3 items-center justify-start">
                                                    <UserProfileAvatar name={user.username} key={user.username} imageURL={user.displayImgUrl} />
                                                    <div>
                                                        <h1 className="font-semibold">{user.username}</h1>
                                                        <div className="flex text-xs text-gray-500 space-x-2">
                                                            <strong>{user.depName}</strong>
                                                            <p>{user.roleName}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="text-sm">{workStartDate === 'Invalid date' ? '--' : workStartDate}</div>
                                                    <div>
                                                        <Tooltip content="นำออกจากรายการ" color="danger">
                                                            <Button size="sm" isIconOnly color="danger" radius="md" variant="light"
                                                                onPress={() => setSelectedUsers(p => {
                                                                    const newSet = new Set(p);
                                                                    newSet.delete(u); 
                                                                    return newSet;
                                                                })}
                                                            >
                                                                <DeleteIcon/>
                                                            </Button>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            
        </section>
    )
}