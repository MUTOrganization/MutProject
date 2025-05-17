import { Button, Card, Checkbox, Chip, CircularProgress, Input, Select, SelectItem, SelectSection, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User } from "@nextui-org/react";
import { useAppContext } from "../../../../../contexts/AppContext"
import { useCallback, useEffect, useMemo, useState } from "react";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "../../../../../config";
import { groupArray, moveToLastOfArray } from "../../../../../../utils/arrayFunc";
import { SearchMatchScore } from "../../../../../../utils/search";
import { getProfileColor, getUserName } from "../../../../../../utils/util";
import lodash from "lodash";
import { ACCESS } from "../../../../../configs/accessids";
import { AlertQuestion, toastError, toastSuccess } from "../../../../../component/Alert";
import th from "dayjs/locale/th";
import AgentSelector from "../../../../../component/AgentSelector";

export default function UserRolePage(){
    const {currentUser, agent, accessCheck} = useAppContext()
    const {agentList, loadAgent, selectedAgent, setSelectedAgent} = agent;

    const [departmentList, setDepartmentList] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState({id: 'all'});
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState({id: 'all'});
    const [loadingPage, setLoadingPage] = useState(false);
    const [loadingAccess, setLoadingAccess] = useState(false);
    const [loadingNewAccess, setLoadingNewAccess] = useState(false)
    const [userList,setUserList] = useState([]);
    const [accessList, setAccessList] = useState([]);
    const [displayUser, setDisplayUser] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedUser,setSelectUser] = useState(null);
    const [selectedUserList, setSelectedUserList] = useState([]);
    const [selectedUserAccess, setSelectedUserAccess] = useState([]);
    const [selectedNewRoleAccess, setSelectedNewRoleAccess] = useState([]);
    const [selectedNewRole, setSelectedNewRole] = useState('n');
    const [isEditing, setIsEditing] = useState(false);
    const [loadSubmit, setLoadSubmit] = useState(false);

    const isHq = currentUser.businessId == '1'

    // const isUserAllCheck = useMemo(() => {
    //     return displayUser.every(e => selectedUserList.some(e1 => e.username === e1.username))
    // },[displayUser, selectedUserList]) 

    const groupAccess = useMemo(() => {
        return groupArray(accessList, 'groupName');
    },[accessList])

    
    //#region fetchFunction
    async function fetchData(){
        try{
            setLoadingPage(true);
            const [
                userResponse,
                depResponse,
                roleResponse,
                accessResponse,
            ] = await Promise.all([
                fetchProtectedData.get(`${URLS.users.getCustom}?businessId=${selectedAgent.id}`),
                fetchProtectedData.get(`${URLS.departments.getall}?businessId=${selectedAgent.id}`),
                fetchProtectedData.get(`${URLS.roles.getall}?businessId=${selectedAgent.id}`),
                fetchProtectedData.get(`${URLS.access.getAll}`, {
                    params: {
                        bussinessId: selectedAgent.id,
                        safe: selectedAgent.id == '1' ? 'false' : 'true'
                    }
                }),
            ])
            setUserList(userResponse.data);
            setDepartmentList(depResponse.data)
            setRoles(roleResponse.data);
            setAccessList(accessResponse.data);
        }catch(err){
            console.error('error fetchData');
            toastError('เกิดข้อผิดพลาดระหว่างดึงข้อมูลแผนก','');
        }finally{
            setLoadingPage(false);
        }
    }
    async function getUserAccess(signal){
        try{
            if(!selectedUser) return;
            setLoadingAccess(true);
            const response = await fetchProtectedData.get(URLS.roleAccess.getByUsername+"/"+selectedUser.username,{
                signal: signal
            });
            setSelectedUserAccess(response.data);
        }catch(err){
            if(err.name === 'CanceledError') return;
            console.error('error get user access');
            toastError('เกิดข้อผิดพลาด','เกิดข้อผิดพลาดขณะรับข้อมูล');
        }finally{
            setLoadingAccess(false);
        }
    }
    //#endregion fetchFunction
    
    //#region side Effect
    useEffect(() => {
        
        fetchData();
    },[selectedAgent])
    
    const depRole = useMemo(() => {
        if(['all','n'].includes(selectedDepartment.id)){
            return [];
        }else{
            return roles.filter(e => e.depId == selectedDepartment.id);
        }
    },[selectedDepartment])

    useEffect(() => {
        let filterUser;
        const copyUser = [...userList];
        if(selectedDepartment.id == 'all'){
            filterUser = copyUser;
        }else if(selectedDepartment.id == 'n'){
            filterUser = copyUser.filter(e => e.depId == null);
        }else{
            if(selectedRole.id == 'all'){
                filterUser = copyUser.filter(e => e.depId == selectedDepartment.id)
            }else if(selectedRole.id == 'n'){
                filterUser = copyUser.filter(e => e.depId == selectedDepartment.id && e.roleId == null);
            }else{
                filterUser = copyUser.filter(e => e.depId == selectedDepartment.id && e.roleId == selectedRole.id);
            }
        }
        filterUser = moveToLastOfArray(filterUser, e => e.depId == null)
        if(filterUser.length > 0){
            const result = SearchMatchScore(filterUser,searchText,[{fieldName: 'username', weight: 3},{fieldName: 'depName', weight: 5},{fieldName: 'roleName',weight: 5}])
            setDisplayUser(result.filter(e=> !(e.score <= 0)));
        }else{
            setDisplayUser(filterUser);
        }

    },[userList, selectedDepartment,selectedRole,searchText])

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        getUserAccess(signal);

        return () => {
            abortController.abort();
        }
    },[selectedUser])

    useEffect(() => {
        async function getNewRoleAccess(){
            try{
                setLoadingNewAccess(true);
                if(selectedNewRole == 'n'){
                    setSelectedNewRoleAccess([]);
                }else{
                    const response = await fetchProtectedData.get(URLS.roleAccess.getByRoleId+"/"+selectedNewRole);
                    setSelectedNewRoleAccess(response.data);
                }
            }catch(err){
                console.error('error fetching new role access');
                toastError('เกิดข้อผิดพลาด','เกิดข้อผิดพลาดขณะรับข้อมูล');
            }finally{
                setLoadingNewAccess(false);
            }
        }

        getNewRoleAccess();
    },[selectedNewRole])
    //#endregion side Effect
    
    //#region handler function
    function handleSelectAgent(id){
        const findAgent = agentList.find(e => e.id == id);
        if(findAgent){
            setSelectedAgent(findAgent);   
        }
    }
    function handleSelectDep(id){
        if(id == 'all' || id == 'n'){
            setSelectedDepartment({id: id})
        }else{
            const findDep = departmentList.find(e => e.id == id)
            if(findDep){
                setSelectedDepartment(findDep);
            }
        }
        setSelectedRole({id: 'all'})
    }
    function handleSelectRole(id){
        if(id == 'all'){
            setSelectedRole({id: id})
        }else{
            const findRole = roles.find(e => e.id == id)
            if(findRole){
                setSelectedRole(findRole);
            }
        }
    }
    function handleSelectUser(users){
        if(JSON.stringify(users) === JSON.stringify(['a','l','l'])){
            if(displayUser.every(e => selectedUserList.some(e1 => e.username === e1.username))){
                const users = lodash.differenceBy(selectedUserList, displayUser,'username')
                setSelectedUserList(users);
            }else{
                const users = lodash.unionBy(selectedUserList, displayUser,'username')
                setSelectedUserList(users)
            }
            return;
        }
        const findUsers = users.map(user => userList.find(e => e.username === user));
        setSelectedUserList(findUsers);
        if(findUsers.length > 0){
            setSelectUser(findUsers[findUsers.length - 1]);
        }
    }
    function handleChangeRoleMultiUser(){
        async function saveUserRoles() {
            try{
                setLoadSubmit(true)
                const response = await fetchProtectedData.put(URLS.users.changeRole,{
                    username: selectedUserList.map(e => e.username),
                    roleId: selectedNewRole == 'n' ? 0 : selectedNewRole,
                    updateBy: currentUser.userName
                })
                if(response.data.rowAffected <= 0){
                    throw Error(response.data?.error);
                }
                setSelectUser(null);
                toastSuccess('สำเร็จ',`เปลี่ยนตำแหน่งสำเร็จ`)
                setSelectedNewRole('n')
                setSelectedUserList([]);
                setIsEditing(false);
                fetchData();
            }catch(err){
                console.error('error change role multi user');
                toastError('เกิดข้อผิดพลาด','ไม่สามารถเปลี่ยนตำแหน่ง');
            }finally{
                setLoadSubmit(true)
            }
        }

        saveUserRoles();
    }
    //#endregion handler function

    const dummyUsers = [
        {
            id: 1,
            username: 'username1',
            name: 'name1',
            depName: 'CRM',
            roleName: 'Manager',
        },
        {
            id: 2,
            username: 'username2',
            name: 'name2',
            depName: 'CRM',
            roleName: 'Manager',
        }
    ]
    return (
        <div>
            <div className="md:flex items-center justify-between">
                {
                isHq &&
                <div className="md:flex max-md:mb-3 items-center">
                    <AgentSelector/>
                </div>
                }
            </div>
            <div className="w-full xl:flex sm:p-2 mt-5 xl:space-x-6">
                <div className={`${isEditing ? 'xl:w-0 p-0' : 'xl:w-6/12'} bg-white h-full  max-xl:mb-8
                    transition-all duration-300`}>
                    <Card className={`${!isEditing && 'p-4'}`} shadow="sm">
                        <div className={`${isEditing ? 'hidden' : ''} h-full flex flex-col `}>
                            <div>
                                <div className='text-start sm:ps-2 mb-4 sm:flex items-center'>
                                    <div className="max-sm:ms-2 me-2">ค้นหา</div>
                                    <div className="w-full max-w-56">
                                        <Input
                                            aria-label="search input"
                                            value={searchText} 
                                            onValueChange={(value) => setSearchText(value)} 
                                            isDisabled={loadingPage} 
                                            variant="bordered" 
                                            placeholder="พิมพ์ชื่อผู้ใช้ แผนก หรือตำแหน่ง" 
                                        />
                                    </div>
                                </div>
                                <div className='sm:flex sm:space-x-3 max-sm:space-y-3'>
                                    <div className='sm:w-1/2'>
                                        <div className='text-start ms-2'>เลือกแผนก</div>
                                        <Select aria-label="department select"
                                            selectedKeys={[selectedDepartment.id+""]}
                                            onSelectionChange={(value) => handleSelectDep(Array.from(value)[0])} 
                                        >
                                            <SelectItem key={'all'}>ทั้งหมด</SelectItem>
                                            <SelectItem key={'n'}>ไม่มีแผนก</SelectItem>
                                            {departmentList.map(dep => (<SelectItem key={dep.id} endContent={dep.isHq == '1' ? <Chip color="success" size="sm" variant="flat">สำนักงานใหญ่</Chip> : null}>{dep.departmentName}</SelectItem>))}
                                        </Select>
                                    </div>
                                    <div className='sm:w-1/2'>
                                        <div className={`text-start ms-2 ${(selectedDepartment.id === 'all' || selectedDepartment.id === 'n') && 'text-gray-300'}`}>เลือกตำแหน่ง</div>
                                        <Select aria-label="role select"
                                            selectedKeys={[selectedRole.id+""]}
                                            onSelectionChange={(value) => handleSelectRole(Array.from(value)[0])} 
                                            isDisabled={selectedDepartment.id === 'all' || selectedDepartment.id === 'n'}
                                        >
                                            <SelectItem key={'all'}>ทั้งหมด</SelectItem>
                                            {depRole.map(role => (<SelectItem key={role.id}>{role.roleName}</SelectItem>))}
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 h-[420px]">
                                <Table
                                    aria-label="user table"
                                    className="h-full overflow-auto !shadow-none" 
                                    isHeaderSticky 
                                    removeWrapper
                                    selectionMode="multiple" 
                                    color="primary"
                                    selectedKeys={selectedUserList.map(e => e.username)} //DUMMY
                                    onSelectionChange={(key) => handleSelectUser(Array.from(key))}
                                    // onRowAction={(key) => handleClickUser(key)} 
                                >
                                    <TableHeader>
                                        <TableColumn>ชื่อ</TableColumn>
                                        <TableColumn>ตำแหน่ง</TableColumn>
                                    </TableHeader>
                                    <TableBody items={displayUser}
                                        emptyContent={'ไม่พบผู้ใช้'}
                                        isLoading={loadingPage}
                                    >
                                        {(user) => (
                                            <TableRow key={user.username}>
                                                <TableCell>
                                                    <div>
                                                        <User 
                                                            name={user.username}
                                                            description={user.name}
                                                            classNames={{
                                                                name: 'font-semibold'
                                                            }}
                                                            avatarProps={{
                                                                name: getUserName(user.username),
                                                                src: user.displayImgUrl,
                                                                showFallback: true,
                                                                className: 'bg-primary-100',
                                                            }}
                                                        />

                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                {
                                                    user.depName ?
                                                    <div className="flex flex-col">
                                                        <p className="font-bold">{user.depName}</p>
                                                        <p className="text-default-400">{user.roleName}</p>
                                                    </div>:
                                                    <div>
                                                        <p>ไม่มีตำแหน่ง</p>
                                                    </div>

                                                }
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="xl:w-6/12">
                    <Card className="p-4 max-xl:min-h-[300px] max-xl:max-h-[600px]" shadow="sm">
                    {
                        selectedUserList.length > 1 ?
                        <div className="flex flex-col p-6 relative">
                            <div>
                                <div className='text-lg font-bold text-center mb-4'>ผู้ใช้ที่เลือก</div>
                                <Table
                                    aria-label="selected users table" 
                                    removeWrapper
                                >
                                    <TableHeader>
                                        <TableColumn>ชื่อผู้ใช้</TableColumn>
                                        <TableColumn>แผนก</TableColumn>
                                        <TableColumn>ตำแหน่ง</TableColumn>
                                    </TableHeader>
                                    <TableBody items={selectedUserList}>
                                        {(user) => (
                                            <TableRow key={user.username}>
                                                <TableCell><div className="py-2">{user.username}</div></TableCell>
                                                <TableCell><div className="py-2">{user.depName??'ไม่มีแผนก'}</div></TableCell>
                                                <TableCell><div className="py-2">{user.roleName??'ไม่มีตำแหน่ง'}</div></TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            {
                            (!isEditing && selectedUserList.length > 1 && accessCheck.haveAny([ACCESS.role_manage.userRole_edit])) ?
                                <div className='mt-6 flex justify-center space-x-6'>
                                    <Button className='text-white' color="warning" onPress={() => {
                                        setIsEditing(true);
                                    }}>เปลี่ยนตำแหน่ง</Button>
                                </div>
                            : (isEditing && selectedUserList.length > 1) &&
                                <div className={`absolute right-4 top-4`}>
                                    <Button className='' variant="bordered" size="sm"
                                        onPress={() => setIsEditing(false)}>
                                        เลือกตำแหน่งเดิม 
                                    </Button>
                                </div>
                            }
                        </div> 
                        :
                        <div className="text-center">
                            <div className="max-xl:flex 2xl:flex items-center justify-between space-x-3 mb-3">
                            <div className="block max-xl:hidden 2xl:hidden mb-2 text-right">
                                    {
                                        (!isEditing && selectedUserList.length === 1 && accessCheck.haveAny([ACCESS.role_manage.userRole_edit])) ?
                                            <Button className='text-white' size="sm" color="warning" 
                                                onPress={() => {
                                                    setIsEditing(true);
                                                }}
                                            >
                                                เปลี่ยนตำแหน่ง
                                            </Button>
                                        : (isEditing && selectedUserList.length === 1) &&
                                            <Button className='' variant="bordered" size="sm"
                                                onPress={() => setIsEditing(false)}>
                                                เลือกตำแหน่งเดิม 
                                            </Button>
                                    }

                                </div>
                                {
                                    selectedUserList.length === 0 ?
                                    <div className=' text-center w-full'>โปรดเลือกผู้ใช้</div> :
                                
                                    <div className='w-full flex items-center  justify-between '>
                                        <div>ผู้ใช้: {selectedUser?.username}</div>
                                        <div>แผนก: {selectedUser?.depName}</div>
                                        <div>ตำแหน่ง: {selectedUser?.roleName}</div>
                                    </div>
                                }   
                                <div className="hidden max-xl:block 2xl:block">
                                    {
                                        (!isEditing && selectedUserList.length === 1 && accessCheck.haveAny([ACCESS.role_manage.userRole_edit])) ?
                                            <Button className='text-white' size="sm" color="warning" 
                                                onPress={() => {
                                                    setIsEditing(true);
                                                }}
                                            >
                                                เปลี่ยนตำแหน่ง
                                            </Button>
                                        : (isEditing && selectedUserList.length === 1) &&
                                            <Button className='' variant="bordered" size="sm"
                                                onPress={() => setIsEditing(false)}>
                                                เลือกตำแหน่งเดิม 
                                            </Button>
                                    }

                                </div>
                            </div>
                            <hr className='border-y mb-6' />
                            <div className='h-[500px] overflow-auto relative px-2'>
                                {loadingAccess &&
                                    <div className='absolute w-full flex justify-center mt-4'>
                                        <CircularProgress />
                                    </div>
                                }
                                <div className="">
                                    {
                                    
                                    Object.keys(groupAccess).map((groupKey,groupKey_index) => 
                                    {
                                        return(
                                        <div key={groupKey}>
                                            <div key={groupKey_index} className='border-b pb-3 mb-4'>
                                                <div className='text-start font-semibold'>{groupKey}</div>
                                                <div className='mt-3 space-y-2 px-5'>
                                                    {
                                                        groupAccess[groupKey].map((item,index) => 
                                                            <div key={index} className='space-x-2 flex items-center'>
                                                                <Checkbox 
                                                                id={`cb_${groupKey}_${item.accessCode}`} 
                                                                color="success"
                                                                name="access_list" 
                                                                classNames={{icon: 'text-white'}}
                                                                isSelected={selectedUserAccess.some(e => e.id === item.id)} 
                                                                isDisabled={true}
                                                                onChange={() => {}}
                                                                />
                                                                <label htmlFor={`cb_${groupKey}_${item.accessCode}`}>{item.accessName}</label>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>

                                        </div>
                                        )
                                    })
                                    }
                                </div>
                            </div>
                        </div>
                    }
                    </Card>
                </div>
                {/* change role box */}
                {
                <div className={`${isEditing ? 'xl:w-1/2' : 'xl:w-0'} transition-all duration-300 max-xl:mt-8`}>
                    <Card className={`${isEditing && 'p-4'} `} shadow="sm">
                        <div className={` flex flex-col relative
                            `}>
                                <div className={`${isEditing ? '' : 'hidden'} flex flex-col h-full max-xl:min-h-[300px] max-xl:max-h-[600px]`}>
                                    
                                    {
                                    <div className='flex space-x-12 justify-start mb-6 max-xl:mt-10 items-center'>
                                        <div className='flex-1'>
                                            <div className='flex items-center'>
                                                <div className='me-3'>ตำแหน่ง</div>
                                                {(() => {
                                                    let groups = groupArray(roles,'departmentName')
                                                    const sectionClass = "flex w-full sticky top-0 z-20 py-1.5 px-2 font-bold text-black bg-default-100 rounded-small";
                                                    return(
                                                        <Select aria-label="department select"
                                                            scrollShadowProps={{isEnabled: false}}
                                                            selectedKeys={[selectedNewRole]}
                                                            onSelectionChange={(value) => setSelectedNewRole(Array.from(value)[0])}
                                                        >
                                                            {
                                                                Object.keys(groups).map((keyName) => (
                                                                    <SelectSection key={keyName} title={keyName} classNames={{
                                                                        heading: sectionClass
                                                                    }}>
                                                                        {
                                                                            groups[keyName].map(role => (
                                                                                <SelectItem key={role.id} 
                                                                                    endContent={role.isHq == '1' ? <Chip color="success" size="sm" variant="flat">HQ</Chip> : null}
                                                                                    textValue={`${role.departmentName} - ${role.roleName} ${role.isHq == '1' ? ': HQ' : ''}`}
                                                                                >
                                                                                    <div className="flex items-center justify-between">
                                                                                        <div>{role.roleName}</div>

                                                                                    </div>
                                                                                </SelectItem>

                                                                            )) 
                                                                        }
                                                                    </SelectSection>
                                                                ))
                                                            }
                                                            <SelectSection title={'ไม่มีแผนก'} classNames={{
                                                                heading: sectionClass
                                                            }}>
                                                                <SelectItem key={'n'}>ไม่มีตำแหน่ง</SelectItem>
                                                            </SelectSection>
                                                        </Select>
                                                        // <GroupSelector items={items} value={selectedNewRole} onChange={(e) => setSelectedNewRole(e.target.value)} />
                                                    )
                                                })()}
                                            </div>
                                        </div>
                                        {
                                    (isEditing && selectedUser) &&
                                    <div className={`mt-1`}>
                                        <Button size="sm" color="success" className="text-white" 
                                            onPress={() => handleChangeRoleMultiUser()}
                                        >
                                            เลือกตำแหน่งนี้
                                        </Button>
                                    </div>
                                    }
                                    </div>
                                    }   
                                    <hr className='border-y mb-6' />
                                    <div className='h-[480px] overflow-auto'>
                                        {
                                        Object.keys(groupAccess).map((groupKey,groupKey_index) => 
                                            <div key={groupKey_index} className='border-b pb-3 mb-4'>
                                                <div className='text-start font-semibold'>{groupKey}</div>
                                                <div className='mt-3 space-y-2 px-5'>
                                                    {
                                                        groupAccess[groupKey].map((item,index) => 
                                                            <div key={index} className='space-x-2 flex items-center'>
                                                                <Checkbox 
                                                                id={`cb_${groupKey}_${item.accessCode}`} 
                                                                color="success"
                                                                name="access_list" 
                                                                classNames={{icon: 'text-white'}}
                                                                isSelected={selectedNewRoleAccess.some(e => e.id === item.id)} 
                                                                isDisabled={true}
                                                                onChange={() => {}}
                                                                />
                                                                <label htmlFor={`cb_${groupKey}_${item.accessCode}`}>{item.accessName}</label>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        )
                                    }
                                    </div>
                                </div>
                        </div>
                    </Card>
                </div>
                }
            </div>
        </div>
        
    )
}