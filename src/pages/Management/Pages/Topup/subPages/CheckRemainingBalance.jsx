import { Button, Card, CardBody, CardHeader, Chip, Divider, Image, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useEffect, useState } from "react";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { toastError } from "../../../../../component/Alert";
import { URLS } from "../../../../../config";
import { useAppContext } from "../../../../../contexts/AppContext";
import UserProfileAvatar from "../../../../../component/UserProfileAvatar";
import { cFormatter } from "../../../../../../utils/numberFormatter";
import _ from 'lodash'
import { CustomFormatDate } from "../../../../../../utils/FormatDate";
import { CompareStatus } from "../../../../../../utils/CompareStatus";
import DetailImageModal from "../components/DetailImageModal";
import SearchBox from "../../../../../component/SearchBox";
import RecoverModal from "../components/RecoverModal";


function CheckRemainingBalance() {
    //state context
    const { currentUser } = useAppContext();

    //state data api
    const [listUsers, setListUsers] = useState([]);
    const [listDep, setListDep] = useState([]);
    const [listRole, setListRole] = useState([]);
    const [listOrderTopUp, setListOrderTopUp] = useState([]);
    const [listExpenses, setListExpenses] = useState([]);

    //state select / input
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedDep, setSelectedDep] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [searchUser, setSearchUser] = useState([]);

    //state loading
    const [loadingUser, setLoadingUser] = useState(false);
    const [loadingDep, setLoadingDep] = useState(false);
    const [loadingRole, setLoadingRole] = useState(false);
    const [loadingExpenses, setLoadingExpenses] = useState(false);
    const [loadingACB, setLoadingACB] = useState(false);


    //Modal
    const [openModalImage, setOpenModalImage] = useState({ state: false, image: null });
    const [openRecoverModal, setOpenRecoverModal] = useState(false);

    async function fetchAllData() {
        setLoadingUser(true);
        setLoadingRole(true);
        setLoadingDep(true);

        try {
            const [
                userResponse,
                depResponse,
                roleResponse,
            ] = await Promise.all([
                fetchProtectedData.get(URLS.users.getAll, { params: { businessId: currentUser.businessId } }),
                fetchProtectedData.get(URLS.departments.getall, { params: { businessId: currentUser.businessId } }),
                fetchProtectedData.get(URLS.roles.getall, { params: { businessId: currentUser.businessId } }),
            ]);

            setListUsers(userResponse.data)
            setSearchUser(userResponse.data);
            setListDep(depResponse.data)
            setListRole(roleResponse.data)
            setLoadingUser(false);
            setLoadingRole(false);
            setLoadingDep(false);
        } catch (err) {
            toastError('เกิดข้อผิดพลาด', 'การดึงข้อมูลจากเซิร์ฟเวอร์ไม่สำเร็จ');
        } finally {
            setLoadingUser(false);
            setLoadingRole(false);
            setLoadingDep(false);
        }
    }


    async function fetchGetAllTopUpOrder() {
        setLoadingACB(true)
        await fetchProtectedData.get(URLS.wallet.getAllTopUpOrder, { params: { businessId: currentUser.businessId } })
            .then(results => {
                setListOrderTopUp(results.data);
                setLoadingACB(false);
            })
            .catch(err => {
                toastError('เกิดข้อผิดพลาด', 'การดึงข้อมูลยอดสะสมจากเซิฟเวอร์ไม่สำเร็จ');
            })
            .finally(() => {
                setLoadingACB(false)
            })
    }

    async function fetchGetAllExpenses() {
        setLoadingExpenses(true)
        await fetchProtectedData.get(URLS.wallet.getAllExpenses)
            .then(results => {
                setListExpenses(results.data);
                setLoadingExpenses(false);
            })
            .catch(err => {
                toastError('เกิดข้อผิดพลาด', 'การดึงข้อมูลยอดใช้สะสมจากเซิฟเวอร์ไม่สำเร็จ');
            })
            .finally(() => {
                setLoadingExpenses(false)
            })

    }

    //function
    function findACB(username) {
        const findBalanceUser = listOrderTopUp.filter(x => x.createBy === username && x.status === 1);
        let totalBalance = 0;
        if (findBalanceUser.length > 0) {
            findBalanceUser.map(item => {
                totalBalance += parseFloat(item.amount) || 0;
            })
            return cFormatter(totalBalance, 2);
        } else {
            return cFormatter(0, 2);
        }
    }

    function findExpenses(username) {
        const findExpensesUser = listExpenses.filter(x => x.finedUser === username);
        let totalExpenses = 0;
        if (findExpensesUser.length > 0) {
            findExpensesUser.map(item => {
                totalExpenses += parseFloat(item.amount) || 0;
            })
            return cFormatter(totalExpenses, 2);
        } else {
            return cFormatter(0, 2);
        }
    }

    function handleBeforeSearch(copyData) {
        return copyData;
    }

    function handleSearchResult(result) {
        setSearchUser(result);
    }

    const fetchExpensesTopup = async () => {
        await Promise.all([fetchAllData(), fetchGetAllExpenses(), fetchGetAllTopUpOrder()]);
    }


    useEffect(() => {
        fetchAllData()
        fetchGetAllTopUpOrder();
        fetchGetAllExpenses();
    }, [])

    return (
        <div className="w-full h-fit max-h-screen">
            <RecoverModal isOpen={openRecoverModal} closed={e => e && setOpenRecoverModal(false)} isFetching={e => e && fetchExpensesTopup()} />
            <Card className="w-full max-w-full p-2 shadow-md border-1.5">
                <CardHeader className="flex space-x-5 items-center max-lg:flex-wrap max-lg:space-y-4">
                    <Select
                        onChange={(e) => setSelectedDep(e.target.value)}
                        items={[{ id: 'all', departmentName: 'ทั้งหมด' }, ...listDep]} label='แผนก'
                        defaultSelectedKeys={['all']}
                        labelPlacement="inside" size="sm"
                        variant="bordered"
                        className="max-w-xs"
                        isLoading={loadingDep}>
                        {(item) => {
                            return (
                                <SelectItem key={item.id} variant="flat" color="primary" endContent={item.isHq === 1 && <Chip size="sm" variant="flat" color="success">สำนักงานใหญ่</Chip>}>{item.departmentName}</SelectItem>
                            )
                        }}
                    </Select>

                    <Select
                        onChange={(e) => setSelectedRole(e.target.value)}
                        items={[{ id: 'all', roleName: 'ทั้งหมด' }, ...listRole.filter(x => x.depId == selectedDep)]}
                        defaultSelectedKeys={['all']}
                        isLoading={loadingRole}
                        label='ตำแหน่ง'
                        labelPlacement="inside"
                        size="sm"
                        className="max-w-xs"
                        variant="bordered" >

                        {(item) => {
                            return (
                                <SelectItem key={item.id} variant="flat" color="primary" endContent={item.isHq === 1 && <Chip size="sm" variant="flat" color="success">สำนักงานใหญ่</Chip>}>{item.roleName}</SelectItem>
                            )
                        }}

                    </Select>

                    <div className="w-[300px]">
                        <SearchBox
                            className={'max-w-lg'}
                            data={listUsers}
                            label="ค้นหา"
                            variant="bordered"
                            placeholder="ค้นหาพนักงาน"
                            searchRules={[['username', 10], ['nickName', 10], ['name', 10], ['depName', 10], ['roleName', 10]]}
                            onChange={handleSearchResult}
                            onBeforeSearch={handleBeforeSearch}
                        />
                    </div>

                    <div className="flex items-center justify-end w-[300px] ">
                        <Button
                            size="sm"
                            color="warning"
                            variant="solid"
                            onPress={() => setOpenRecoverModal(true)}
                            className="text-white">Recover data</Button>
                    </div>
                </CardHeader>
            </Card>


            <div className="w-full flex max-lg:flex-wrap items-center justify-between space-x-4 my-5">
                <div className="flex-1 h-[500px] overflow-auto scrollbar-hide">
                    {searchUser.filter(x => {
                        if (selectedDep && selectedDep !== 'all' && selectedRole && selectedRole !== 'all') {
                            return x.depId == selectedDep && x.roleId == selectedRole;
                        }
                        if (selectedDep && selectedDep !== 'all') {
                            return x.depId == selectedDep;
                        }
                        if (selectedRole && selectedRole !== 'all') {
                            return x.roleId == selectedRole;
                        }
                        return true;
                    }).map(item => {
                        return (
                            <Card key={item.username}
                                onPress={() => setSelectedUser(item.username)}
                                shadow="none"
                                className={`p-2 border-1.5 rounded-lg my-6 w-full ${selectedUser === item.username && 'bg-blue-100'}`}
                                isHoverable isPressable>
                                <CardHeader className="flex items-center justify-start space-x-4">
                                    <UserProfileAvatar key={item.username} name={item.username} imageURL={item.displayImgUrl} size="lg" />
                                    <div className=" flex-1 text-sm">
                                        <p>{item.username}</p>
                                        <div className="font-semibold text-wrap space-y-2">
                                            <p className="text-xs font-light">{item.name} {item.nickName ? `(${item.nickName})` : ''}</p>
                                            <div className="space-x-2">
                                                {item.depName && <Chip size="sm" color="primary" variant="dot">{item.depName}</Chip>}
                                                {item.roleName && <Chip size="sm" color="success" variant="dot"> {item.roleName}</Chip>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-evenly space-x-10">
                                        <div className="text-center flex-1  text-nowrap">
                                            <p className="text-lg">ยอดคงเหลือ</p>
                                            {loadingUser ? <Spinner size="md" color="primary" /> : <p className="text-xl font-semibold text-green-500">{cFormatter(item.balance, 2)}</p>}
                                        </div>
                                        <div className="text-center flex-1  text-nowrap">
                                            <p className="text-lg">ยอดสะสม</p>
                                            {loadingACB ? <Spinner size="md" color="primary" /> : <p className="text-xl font-semibold text-green-500">{findACB(item.username)}</p>}
                                        </div>
                                        <div className="text-center flex-1  text-nowrap">
                                            <p className="text-lg">ยอดหักค่าปรับ</p>
                                            {loadingExpenses ? <Spinner size="md" color="primary" /> : <p className="text-xl font-semibold text-green-500">{findExpenses(item.username)}</p>}
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        )
                    })}
                </div>

                <div className="flex-1 h-fit max-h-screen">
                    <p className="text-end mx-10 font-semibold">ทั้งหมด {listOrderTopUp.filter(x => {
                        if (selectedUser || selectedUser === '') {
                            return x.createBy == selectedUser
                        }
                        return true;
                    }).length} รายการ</p>
                    <Card shadow="sm" className=" border-1.5 h-[500px] flex-1 overflow-auto scrollbar-hide">
                        <Table align="center" aria-label="table-listTopUpbyUser " removeWrapper isHeaderSticky>
                            <TableHeader>
                                <TableColumn key={'date'} title='วันที่' />
                                <TableColumn key={'orderNo'} title='เลขที่ธุรกรรม' />
                                <TableColumn key={'ownerOrder'} title='ผู้ทำรายการ' />
                                <TableColumn key={'balance'} title='จำนวนเงิน' />
                                <TableColumn key={'status'} title='สถานะ' />
                                <TableColumn key={'refFile'} title='ไฟล์แนบ' />
                            </TableHeader>
                            <TableBody
                                emptyContent='ไม่มีประวัติการทำธุรกรรม'
                                items={listOrderTopUp.filter(x => {
                                    if (selectedUser || selectedUser === '') {
                                        return x.createBy == selectedUser
                                    }
                                    return true;
                                })}>

                                {(item) => {
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell>{CustomFormatDate(item.createDate, 'DD/MM/YYYY HH:mm')}</TableCell>
                                            <TableCell>{item.transactionNo}</TableCell>
                                            <TableCell>{item.createBy}</TableCell>
                                            <TableCell>{cFormatter(item.amount, 2)}</TableCell>
                                            <TableCell>
                                                {CompareStatus(item.status, {
                                                    0: <Chip size="sm" variant="flat" color="primary" className="select-none">รออนุมัติ</Chip>,
                                                    1: <Chip size="sm" variant="flat" color="success" className="select-none">อนุมัติแล้ว</Chip>,
                                                    2: <Chip size="sm" variant="flat" color="danger" className="select-none">ไม่อนุมัติ</Chip>,
                                                    3: <Chip size="sm" variant="flat" color="warning" className="select-none  text-xs ">ยกเลิกการทำรายการ</Chip>,
                                                    4: <Chip size="sm" variant="flat" color="primary" className="select-none">รอการยืนยันใหม่</Chip>
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-primary link text-wrap" onPress={() => setOpenModalImage({ state: true, image: URLS.googleCloud.topUp + item.slipImage })}>ดูไฟล์แนบ</p>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }}

                            </TableBody>
                        </Table>
                    </Card>
                </div>

                {openModalImage.image && <DetailImageModal image={openModalImage.image} open={openModalImage.state} close={e => setOpenModalImage({ state: e, image: null })} />}
            </div>
        </div >
    )
}


export default CheckRemainingBalance;