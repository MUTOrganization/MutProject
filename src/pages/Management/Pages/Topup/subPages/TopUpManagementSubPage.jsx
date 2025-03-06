import { useEffect, useState } from "react";
import { useAppContext } from "../../../../../contexts/AppContext";
import { Button, Card, CardHeader, Chip, DateRangePicker, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Pagination, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "../../../../../config";
import { AlertQuestion, toastError } from "../../../../../component/Alert";
import { CustomFormatDate } from "../../../../../../utils/FormatDate"
import UserProfileAvatar from "../../../../../component/UserProfileAvatar";
import { CompareStatus } from "../../../../../../utils/CompareStatus";
import DetailImageModal from "../components/DetailImageModal";
import { CheckCircle, CloseCircle, IncorrectIcon, InfomationIcon, InformationIcon, RefreshIcon } from "../../../../../component/Icons";
import moment from "moment";
import CustomModal from "../../../../../component/CustomModal";
import ConfirmModal from "../components/ComfirmModal";
import ModalRemark from "../components/ModalRemark";
import { ACCESS } from "../../../../../configs/access";
import { ExportExcel } from "../../../../../../utils/exportExcel";


function TopUpManagementSubPage() {
    //state appContext
    const { currentUser } = useAppContext();

    //state list Data 
    const [listUsers, setListUsers] = useState([]);
    const [listOrderTopUp, setListOrderTopUp] = useState([]);

    //Input
    const [dateInput, setDateInput] = useState({ start: null, end: null });
    const [userInput, setUserInput] = useState('all');
    const [statusInput, setStatusInput] = useState('');
    const [pagination, setPagination] = useState({
        size: 10,
        currentPage: 1,
        totalPages: 1,
        totalRecords: 1,
        count: 10,
    })

    //Modal 
    const [openModalImage, setOpenModalImage] = useState({ state: false, image: null, itemData: null });
    const [openConfirmModal, setConfirmModal] = useState({ state: false, data: null, isApprove: false });
    const [openModalRemark, setOpenModalRemark] = useState({ state: false, data: null, changeStatus: false, status: 2 });

    //state loading
    const [loadingUser, setLoadingUser] = useState(false);
    const [loadingOrderTopup, setLoadingOrderTopup] = useState(false);

    const listStatus = [
        { id: 0, value: 'รอยืนยัน', desc: 'รายการที่รอการอนุมัติ' },
        { id: 1, value: 'อนุมัติแล้ว', desc: 'รายการที่อนุมัติ' },
        { id: 2, value: 'ไม่อนุมัติ', desc: 'รายการที่ไม่ถูกอนุมัติ' },
        { id: 3, value: 'ยกเลิกการทำรายการ', desc: 'ผู้ทำรายการยกเลิกการทำรายการ' },
        { id: 4, value: 'รอการยืนยันใหม่', desc: 'รอผู้ทำรายการแก้ไขข้อมูลให้ถูกต้อง' },
    ];

    function clearInput() {
        setDateInput({ start: null, end: null });
    }


    //#region function fetch API
    async function fetchGetUser() {
        setLoadingUser(true)
        await fetchProtectedData.get(URLS.users.getAll, { params: { businessId: currentUser.businessId } })
            .then(r => {
                setLoadingUser(false)
                setListUsers(r.data);
            })
            .catch(err => {
                toastError('เกิดข้อผิดพลาด', 'การดึงข้อมูลจากเซิฟเวอร์ล้มเหลวโปรดลองใหม่อีกครั้ง');
            }).finally(() => {
                setLoadingUser(false)
            })
    }

    async function fetchGetOrderTopup() {
        setLoadingOrderTopup(true);
        const startDate = dateInput.start ? moment(dateInput.start.toString()).startOf('day').format('YYYY-MM-DD HH:mm:ss') : null;
        const endDate = dateInput.end ? moment(dateInput.end.toString()).endOf('day').format('YYYY-MM-DD HH:mm:ss') : null;
        const status = statusInput.split(',').map(Number);

        await fetchProtectedData
            .post(URLS.wallet.manageTopup, {
                page: pagination.currentPage,
                size: pagination.size,
                createBy: userInput,
                status,
                startDate,
                endDate,
                businessId: currentUser.businessId
            })
            .then(res => {
                const data = res.data.data;
                const paginationData = res.data.pagination;

                setListOrderTopUp(data);
                setPagination(prev => ({
                    ...prev,
                    totalPages: paginationData.totalPages,
                    totalRecords: paginationData.totalRecords,
                    count: paginationData.count
                }));
                setLoadingOrderTopup(false);
            })
            .catch(err => {
                toastError('เกิดข้อผิดพลาด', 'การดึงข้อมูลจากเซิฟเวอร์ล้มเหลว');
            })
            .finally(() => {
                setLoadingOrderTopup(false);
            });
    }

    const [listDataExpotyExcel, setListDataExpotyExcel] = useState([]);
    const [loadingExport, setLoadingExport] = useState(false);
    async function fetchGetAllTopUpForExport() {
        setLoadingExport(true);
        await fetchProtectedData.get(URLS.wallet.getAllTopUpOrder, { params: { businessId: currentUser.businessId } })
            .then(results => {
                setListDataExpotyExcel(results.data)
                setLoadingExport(false);
            })
            .catch(() => {
                toastError('เกิดข้อผิดพลาด', 'พบปัญหาการดึงข้อมูลจากเซิฟเวอร์ กรุณาลองใหม่อีกครั้ง');
            })
            .finally(() => {
                setLoadingExport(false);
            })
    }

    //#endregion

    //#region Use Effect
    useEffect(() => {
        fetchGetUser();
        fetchGetOrderTopup();
    }, [])

    useEffect(() => {
        fetchGetOrderTopup();
    }, [userInput, dateInput.end, statusInput])

    useEffect(() => {
        fetchGetOrderTopup();
    }, [pagination.currentPage, pagination.size])
    //#endregion


    const exportExcelFunc = async () => {
        await fetchGetAllTopUpForExport();
        ExportExcel('ประวัตอเติมเงิน', [{ sheetName: 'ชีท 1', data: listDataExpotyExcel }]);
    }

    return (
        <div className="w-full h-fit max-h-screen">
            {openModalImage.image &&
                <DetailImageModal
                    image={openModalImage.image}
                    open={openModalImage.state}
                    close={e => setOpenModalImage({ state: e, image: null, itemData: null })}
                />
            }
            {openConfirmModal.data &&
                <ConfirmModal
                    isFetchData={e => e && fetchGetOrderTopup()}
                    isApprove={openConfirmModal.isApprove}
                    open={openConfirmModal.state}
                    close={e => setConfirmModal({ state: e, data: null, isApprove: false })}
                    data={openConfirmModal.data} />
            }
            {openModalRemark.data &&
                <ModalRemark
                    isFetchData={e => e && fetchGetOrderTopup()}
                    changeStatus={openModalRemark.changeStatus}
                    open={openModalRemark.state}
                    close={e => setOpenModalRemark({ state: e, data: null, changeStatus: false })}
                    data={openModalRemark.data}
                    status={openModalRemark.status}
                />
            }
            <div className="w-full max-w-full p-2 ">
                <div className="flex space-x-5 items-center max-lg:flex-wrap max-lg:space-y-4">
                    <DateRangePicker
                        label='วันที่ทำรายการ'
                        labelPlacement="inside"
                        variant="bordered"
                        color="default"
                        size="sm"
                        className="max-w-xs"
                        onChange={e => setDateInput({ start: e.start, end: e.end })}
                        value={{ start: dateInput.start, end: dateInput.end }} />


                    <Button size="sm" color="primary" variant="flat" onPress={clearInput} >ล้างวันที่</Button>

                    <Select
                        label='สถานะรายการ'
                        labelPlacement="inside"
                        size="sm"
                        color="default"
                        variant="bordered"
                        className="max-w-xs"
                        items={listStatus}
                        defaultSelectedKeys={'all'}
                        selectionMode="multiple"
                        value={statusInput}
                        onChange={e => setStatusInput(e.target.value)} >

                        {(item) => {
                            return (
                                <SelectItem key={item.id} textValue={item.value} description={item.desc} color="primary" variant="flat">
                                    {item.value}
                                </SelectItem>
                            )
                        }}

                    </Select>


                    <Select
                        label='พนักงาน'
                        labelPlacement="inside"
                        size="sm"
                        color="default"
                        variant="bordered"
                        className="max-w-xs"
                        isLoading={loadingUser}
                        items={[{ username: 'all' }, ...listUsers]}
                        defaultSelectedKeys={['all']}
                        onChange={e => setUserInput(e.target.value)}>

                        {(item) => {
                            return (
                                <SelectItem key={item.username} textValue={item.username === 'all' ? 'ทั้งหมด' : item.username} variant="flat" color="primary">
                                    <div className="flex gap-2 items-center">
                                        <UserProfileAvatar name={item.username === 'all' ? 'All' : item.username} imageURL={item.displayimgURL} size="sm" />
                                        <div className="font-semibold">
                                            <p>{item.username === 'all' ? 'ทั้งหมด' : item.username}</p>
                                            <p className="text-xs font-light">{item.name} {item.nickName ? '(' + item.nickName + ')' : ''}</p>
                                        </div>
                                    </div>
                                </SelectItem>
                            )
                        }}
                    </Select>
                    <Button variant="flat" color="primary" size="sm" onPress={() => fetchGetOrderTopup()}  >รีเฟรชข้อมูล</Button>
                </div>
            </div>

            <div className="flex w-full justify-end items-center">
                <Button size="sm" variant="solid" color="primary"  onPress={exportExcelFunc} isLoading={loadingExport}>Export excel</Button>
            </div>
            <Card className="overflow-auto shadow-sm border-1.5 scrollbar-hide my-4 h-full">
                <Table
                    aria-label="table-orderTopup"
                    removeWrapper
                    fullWidth
                    isHeaderSticky
                    className="h-[400px] max-h-[400px] overflow-auto scrollbar-hide"
                    align="center">
                    <TableHeader>
                        <TableColumn key={'date'} title='วันที่' />
                        <TableColumn key={'orderNo'} title='เลขที่ธุรกรรม' />
                        <TableColumn key={'ownerOrder'} title='ผู้ทำรายการ' />
                        <TableColumn key={'balance'} title='จำนวนเงิน' />
                        <TableColumn key={'status'} title='สถานะ' />
                        <TableColumn key={'refFile'} title='ไฟล์แนบ' />
                    </TableHeader>
                    <TableBody isLoading={loadingOrderTopup} loadingContent={<Spinner size="lg" color="primary" />} emptyContent='ไม่พบข้อมูล'>
                        {listOrderTopUp.map(item => {
                            return (
                                <TableRow key={item.id}>
                                    <TableCell>{CustomFormatDate(item.createDate, 'DD/MM/YYYY HH:mm')}</TableCell>
                                    <TableCell>{item.transactionNo}</TableCell>
                                    <TableCell>
                                        <p>{item.createBy}</p>
                                        {(() => {
                                            const userData = listUsers.find(user => user.username == item.createBy);
                                            return (
                                                <div className="font-semibold">
                                                    <p className="text-xs font-light">{userData?.name} {userData?.nickName ? `(${userData.nickName})` : ''}</p>
                                                </div>
                                            );
                                        })()}

                                    </TableCell>
                                    <TableCell>{item.amount}</TableCell>
                                    <TableCell>
                                        {CompareStatus(
                                            item.status,
                                            {
                                                0:
                                                    <Dropdown>
                                                        <DropdownTrigger>
                                                            <Chip variant="flat" color="primary" size="sm" className="select-none cursor-pointer">
                                                                รออนุมัติ
                                                            </Chip>
                                                        </DropdownTrigger>
                                                        <DropdownMenu aria-label="dropdown-status" variant="flat">
                                                            <DropdownItem onPress={() => setConfirmModal({ state: true, data: item, isApprove: true })} color="success" endContent={<CheckCircle size={15} />}>อนุมัติ</DropdownItem>
                                                            <DropdownItem onPress={() => setConfirmModal({ state: true, data: item, isApprove: false })} color="danger" endContent={<CloseCircle size={15} />}>ไม่อนุมัติ</DropdownItem>
                                                            <DropdownItem onPress={() => setOpenModalRemark({ state: true, data: item, changeStatus: true, status: 4 })} color="warning" description='ให้ผู้ทำรายการแก้ไขข้อมูล' >รอการยืนยันใหม่</DropdownItem>
                                                        </DropdownMenu>
                                                    </Dropdown>,
                                                1:
                                                    <Dropdown>
                                                        <DropdownTrigger>
                                                            <Chip variant="flat" color="success" size="sm" className="select-none cursor-pointer">
                                                                อนุมัติแล้ว
                                                            </Chip>
                                                        </DropdownTrigger>
                                                        <DropdownMenu aria-label="dropdown-status" variant="flat">
                                                            <DropdownItem onPress={() => setOpenModalRemark({ state: true, data: item, changeStatus: true, status: 2 })} description='เปลี่ยนสถานะเป็นไม่อนุมัติ' color="danger" endContent={<InfomationIcon size={15} />}>เปลี่ยนสถานะ</DropdownItem>
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                ,
                                                2:
                                                    <Dropdown>
                                                        <DropdownTrigger>
                                                            <Chip variant="flat" color="danger" size="sm" className="select-none cursor-pointer">
                                                                ไม่อนุมัติ
                                                            </Chip>
                                                        </DropdownTrigger>
                                                        <DropdownMenu aria-label="dropdown-status" variant="flat">
                                                            <DropdownItem onPress={() => setOpenModalRemark({ state: true, data: item, changeStatus: false, status: item.status })} color="primary" endContent={<InfomationIcon size={15} />}>รายละเอียด</DropdownItem>
                                                        </DropdownMenu>
                                                    </Dropdown>,
                                                3: <Chip variant="flat" color="danger" size="sm" className="select-none cursor-pointer">ยกเลิกการทำรายการ</Chip>,
                                                4:
                                                    <Dropdown>
                                                        <DropdownTrigger>
                                                            <Chip variant="flat" color="primary" size="sm" className="select-none cursor-pointer">
                                                                รออนุมัติใหม่
                                                            </Chip>
                                                        </DropdownTrigger>
                                                        <DropdownMenu aria-label="dropdown-status" variant="flat">
                                                            <DropdownItem onPress={() => setConfirmModal({ state: true, data: item, isApprove: true })} color="success" endContent={<CheckCircle size={15} />}>อนุมัติ</DropdownItem>
                                                            <DropdownItem onPress={() => setConfirmModal({ state: true, data: item, isApprove: false })} color="danger" endContent={<CloseCircle size={15} />}>ไม่อนุมัติ</DropdownItem>
                                                            <DropdownItem onPress={() => setOpenModalRemark({ state: true, data: item, changeStatus: false, status: item.status })} color="primary" endContent={<InfomationIcon size={15} />}>รายละเอียด</DropdownItem>
                                                        </DropdownMenu>
                                                    </Dropdown>,
                                            }
                                        )}
                                    </TableCell>
                                    <TableCell className="flex justify-center cursor-pointer" onClick={() => setOpenModalImage({ state: true, image: URLS.googleCloud.topUp + item.slipImage, itemData: item })}>
                                        <Image className="object-fill" radius="md" removeWrapper width={50} height={50} src={URLS.googleCloud.topUp + item.slipImage} />
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>


                <div className="w-full  mt-6 flex items-center justify-center relative max-lg:flex-wrap">
                    <Pagination
                        loop
                        variant="flat"
                        color="primary"
                        isCompact
                        showControls
                        total={pagination.totalPages}
                        page={pagination.currentPage}
                        onChange={(newPage) => setPagination(prev => ({ ...prev, currentPage: newPage }))}
                    />


                    <div className="lg:absolute end-10 max-lg:my-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button size="sm" variant="light" color="primary">
                                    แสดงทั้งหมด {pagination.size} รายการ
                                </Button>
                            </DropdownTrigger>

                            <DropdownMenu aria-label="set-size" variant="flat" color="primary" selectionMode="single" onAction={key => setPagination(prev => ({ ...prev, size: key }))}>
                                <DropdownItem key={10}>10 รายการ</DropdownItem>
                                <DropdownItem key={20}>20 รายการ</DropdownItem>
                                <DropdownItem key={50}>50 รายการ</DropdownItem>
                                <DropdownItem key={100}>100 รายการ</DropdownItem>
                                <DropdownItem key={pagination.totalRecords}>แสดงทั้งหมด</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>

                    </div>
                </div>

                <div className="w-full my-3   flex items-center justify-center relative">
                    <p className="text-xs text-primary font-semibold">ทั้งหมด {pagination.totalRecords} รายการ</p>
                </div>
            </Card>
        </div>
    )
}

export default TopUpManagementSubPage;