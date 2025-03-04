import { Accordion, AccordionItem, Avatar, Button, Card, CardHeader, Checkbox, Listbox, ListboxItem, ListboxSection, select, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "../../../../../config";
import { useAppContext } from "../../../../../contexts/AppContext";
import AgentSelector from "../../../../../component/AgentSelector";
import { toastError, toastSuccess } from "../../../../../component/Alert";
import { ArrowDownStreamlineUltimateIcon, CheckCircle, CloseCircle, RemovePerson } from "../../../../../component/Icons";
import SearchBox from "../../../../../component/SearchBox";
import lodash from 'lodash';
import { CompareStatus } from "../../../../../../utils/CompareStatus";
import UserProfileAvatar from "../../../../../component/UserProfileAvatar";


function ManageUsers() {
    //Field Contenxt
    const context = useAppContext();
    const currentUser = context.currentUser;
    const [agentSelected, setAgentSelected] = useState(null);

    //Field state Fetch API
    const [listDep, setListDep] = useState([]);
    const [listRoles, setListRoles] = useState([]);
    const [listUsers, setListUsers] = useState([]);
    const [searchListUser, setSearchListUser] = useState([]);

    //Field state
    const [activeDep, setActiveDep] = useState(null);

    //Field Selected List
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState(new Set());
    const [checkPrass, setCheckPrass] = useState(true);
    const [checkNotPrss, setCheckNotPrss] = useState(true);


    //Field Loding
    const [loadingUser, setLoadingUser] = useState(false);


    //#region Fetch Functions
    async function fetchDepartments() {
        //API Departments
        await fetchProtectedData.get(URLS.departments.getall, { params: { businessId: context.agent.selectedAgent?.id || currentUser.businessId } })
            .then((res) => {
                setListDep(res.data)
            }).catch(err => {
                toastError('เกิดข้อผิดพลาดระหว่างดึงข้อมูล', 'การดึงข้อมูลจากระบบเกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง')
            })
    }

    async function fetchRoleByDepartment() {
        await fetchProtectedData.get(`${URLS.roles.getByDep}/${activeDep}`)
            .then(res => {
                setListRoles(res.data);
            }).catch(err => {
                toastError('เกิดข้อผิดพลาด', 'การดึงข้อมูลตำแหน่งผู้ใช้เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง')
            })
    }

    async function fetchUserByRole() {
        let params = {
            businessId: context.agent.selectedAgent?.id || currentUser.businessId,
            department: activeDep || currentUser.depId
        };
        if (selectedRole !== 'all') {
            params.role = selectedRole;
        }
        setLoadingUser(true);
        await fetchProtectedData.get(URLS.users.getCustom, { params }).then(res => {
            const data = res.data;
            setListUsers(data);
            setSearchListUser(data);
            setLoadingUser(false);
        }).catch(err => {
            toastError('เกิดข้อผิดพลาด', 'การดึงข้อมูลผู้ใช้เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง')
        }).finally(() => {
            setLoadingUser(false);
        })
    }

    async function fetchEditProbations(status) {
        await fetchProtectedData.put(URLS.users.editUserProbs, {
            users: Array.from(selectedUsers),
            status: status,
        }).then(res => {
            toastSuccess('แก้ไขข้อมูลสำเร็จ', 'ข้อมูลถูกบันทึกเข้าระบบเรียบร้อยแล้ว')
            fetchUserByRole();
        }).catch(err => {
            toastError('เกิดข้อผิดพลดา', 'พบข้อผิดพลาดระหว่างแก้ไขข้อมูล โปรดลองใหม่อีกครั้ง')
        })
    }
    //#endregion


    // กรอง listUsers ตามค่า checkbox
    const filteredUsers = searchListUser.filter(user => {
        if (checkPrass && user.probStatus === 1) return true;
        if (checkNotPrss && user.probStatus === 0) return true;
        return false;
    });


    //#region Function handlers
    function handleToggle(depId) {
        setActiveDep(activeDep === depId ? null : depId);
    };

    function handleBeforeSearch(copyData) {
        return copyData;
    }

    function handleSearchResult(result) {
        setSearchListUser(result);
    }

    function handleSelectionChange(keys) {
        if (keys === 'all') {
            setSelectedUsers(new Set(filteredUsers.map(user => user.username)));
            return;
        }
        const users = Array.from(keys).map(key => filteredUsers.find(user => user.username === key));
        setSelectedUsers(new Set(users.map(user => user.username)));
    };

    function handleRemoverUser(username) {
        setSelectedUsers((prevSelectedUsers) => {
            const newSelectedUsers = new Set(prevSelectedUsers);
            newSelectedUsers.delete(username);
            return newSelectedUsers;
        });
    }
    //#endregion



    useEffect(() => {
        fetchDepartments(); //fetch Departments
    }, [])

    useEffect(() => {
        fetchDepartments(); //fetch Departments
        setListRoles([]);
        setListUsers([]);
    }, [context.agent.selectedAgent])

    useEffect(() => {
        fetchRoleByDepartment(); //fetch RoleByDepartment
        fetchUserByRole(); //fetch UserByDepartment
        setSelectedUsers(new Set());
    }, [activeDep])

    useEffect(() => {
        fetchUserByRole(); //fetch UsersByRole
    }, [selectedRole])

    return (
        <section className="w-full">

            {currentUser.businessId === 1 &&
                <div className="">
                    <AgentSelector agentSelected={e => setAgentSelected(e)} />
                </div>
            }

            <Card className="flex h-full min-h-[600px] shadow-none">
                <div className="flex w-full h-[600px] shadow-lg rounded-lg my-3">
                    <div className="w-1/5 h-fit overflow-auto scrollbar-hide p-2">
                        {listDep.map((dep) => {
                            const isActive = activeDep === dep.id;
                            return (
                                <div
                                    key={dep.id}
                                    className={`p-2 hover:bg-blue-100 hover:text-primary rounded-lg text-black cursor-pointer flex items-center justify-between ${isActive ? 'bg-blue-400 text-white' : ''}`}
                                    onClick={() => handleToggle(dep.id)} >
                                    <span>{dep.departmentName}</span>
                                    <ArrowDownStreamlineUltimateIcon className={isActive ? 'transition-transform hue-rotate-180' : 'transition-transform -rotate-90 text-white'} />
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex-1 h-[500px] p-2 ">
                        <div className="flex items-center justify-between mb-4 space-x-4">
                            <div className="flex-1">
                                <Select
                                    variant="bordered"
                                    size="sm"
                                    label={listRoles.length > 0 ? 'ตำแหน่ง' : 'ไม่พบตำแหน่ง'}
                                    labelPlacement="outside"
                                    aria-label="select-role"
                                    defaultSelectedKeys={['all']}
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
                                    onChange={handleSearchResult}
                                    onBeforeSearch={handleBeforeSearch}
                                />
                            </div>
                        </div>

                        <div className="flex items-center mb-4 space-x-4">
                            <Checkbox type="checkbox" isSelected={checkPrass} checked={checkPrass} onChange={(e) => setCheckPrass(e.target.checked)} aria-label="prassPro" color="primary" >แสดงผู้ที่ผ่านโปรแล้ว</Checkbox>
                            <Checkbox type="checkbox" isSelected={checkNotPrss} checked={checkNotPrss} onChange={(e) => setCheckNotPrss(e.target.checked)} aria-label="prassPro" color="primary" >แสดงผู้ที่ยังไม่ผ่านโปร</Checkbox>
                        </div>

                        <Card className="overflow-auto max-h-[450px]  scrollbar-hide">
                            <Table color="primary" selectedKeys={selectedUsers} removeWrapper onSelectionChange={handleSelectionChange}
                                selectionMode="multiple" isHeaderSticky aria-label="table-user" className="w-full min-h-full">
                                <TableHeader>
                                    <TableColumn key={'username'}>ชื่อผุ้ใช้</TableColumn>
                                    <TableColumn key={'role'}>ตำแหน่ง</TableColumn>
                                    <TableColumn key={'status'}>สถานะ</TableColumn>
                                </TableHeader>
                                <TableBody
                                    items={filteredUsers}
                                    emptyContent='ไม่พบผู้ใช้งาน' isLoading={loadingUser}
                                    loadingContent={<Spinner
                                        label=""
                                        color="primary"
                                        labelColor="primary" />}>
                                    {(user) => {
                                        const firstLatter = user.username.includes('_') ? user.username.split('_')[1][0] : user.username[0];
                                        return (
                                            <TableRow key={user.username} className="cursor-pointer">
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
                                                <TableCell>
                                                    <div>
                                                        {CompareStatus(user.probStatus,
                                                            {
                                                                1: <span className="flex text-xs text-nowrap items-center gap-2 font-semibold text-success"><CheckCircle size={14} />ผ่านแล้ว</span>,
                                                                0: <span className="flex text-xs text-nowrap items-center gap-2 text-danger font-semibold"><CloseCircle size={14} />ยังไม่ผ่าน</span>
                                                            }
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }}
                                </TableBody>
                            </Table>
                        </Card>
                    </div>

                    <div className="flex-1 h-full p-4">

                        <Card className="overflow-auto scrollbar-hide mt-5">
                            <CardHeader className="flex justify-between">
                                <p className="font-semibold">เลือกแล้ว {Array.from(selectedUsers).length} รายการ</p>
                                {Array.from(selectedUsers).length > 0 &&
                                    <div className="flex space-x-2">
                                        <Button size="sm" variant="flat" onPress={() => fetchEditProbations(1)} color="success" className="font-semibold">
                                            ผ่านโปรทั้งหมด
                                        </Button>
                                        <Button size="sm" variant="flat" onPress={() => fetchEditProbations(0)} color="danger" className="font-semibold">
                                            ไม่ผ่านทั้งหมด
                                        </Button>
                                    </div>
                                }
                            </CardHeader>
                            <div className="p-2 h-[500px] max-h-[500px] w-full">
                                {Array.from(selectedUsers).map(user => {
                                    const firstLatter = user.includes('_') ? user.split('_')[1][0] : user[0];
                                    const foundUser = listUsers.find(x => x.username === user);
                                    if (foundUser) {
                                        return (
                                            <div key={user} className="flex gap-3  items-center hover:bg-blue-100 rounded-lg justify-between border-b-1 border-blue-100 mb-2 p-4">
                                                <div className="flex gap-3 items-center">
                                                    <UserProfileAvatar name={foundUser.username} key={foundUser.username} imageURL={foundUser.displayImgUrl} />
                                                    <div>
                                                        <h1 className="font-semibold">{foundUser.username}</h1>
                                                        <p className="text-xs text-gray-400">{foundUser.nickName || ''}</p>
                                                        <p className="text-xs text-gray-400">{foundUser.name}</p>
                                                    </div>
                                                </div>

                                                <div className="flex space-x-3 items-center">
                                                    <div>
                                                        {CompareStatus(foundUser.probStatus,
                                                            {
                                                                1: <span className="flex text-sm items-center gap-2 font-semibold text-success"><CheckCircle size={14} />ผ่านแล้ว</span>,
                                                                0: <span className="flex text-sm items-center gap-2 text-danger font-semibold"><CloseCircle size={14} />ยังไม่ผ่าน</span>
                                                            }
                                                        )}
                                                    </div>
                                                    <div>
                                                        <Tooltip content='ลบรายการนี้ออกจากตัวเลือก' showArrow>
                                                            <span className="cursor-pointer" onPress={() => handleRemoverUser(user)}><RemovePerson size={20} className={'text-red-600'} /></span>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}

                            </div>
                        </Card>
                    </div>

                </div>
            </Card>
        </section>
    )
}



export default ManageUsers;