import { Button, Card, Chip, DateRangePicker, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { URLS } from "../../../config";
import { useAppContext } from "../../../contexts/AppContext";
import { CompareStatus } from "../../../../utils/CompareStatus";
import { cFormatter } from "../../../../utils/numberFormatter";
import { CustomFormatDate } from "../../../../utils/FormatDate";
import moment from "moment";
import DetailImageModal from "../../Management/Pages/Topup/components/DetailImageModal";
import EditModal from "../../Management/Pages/Topup/components/EditModal";
import ModalRemark from "../../Management/Pages/Topup/components/ModalRemark";
import ConfirmByUserModal from "../../Management/Pages/Topup/components/ConfirmByUserModal";
import fetchProtectedData from "../../../../utils/fetchData";
import { toastError } from "../../../component/Alert";

function Topup() {
    //state context 
    const { currentUser } = useAppContext();

    //state input
    const [dateRangeSelected, setDateRangeSelected] = useState({ start: null, end: null });
    const [statusSelected, setStatusInput] = useState('');

    //state list data
    const listStatus = [
        { id: 0, value: 'รอยืนยัน', desc: 'รายการที่รอการอนุมัติ' },
        { id: 1, value: 'อนุมัติแล้ว', desc: 'รายการที่อนุมัติ' },
        { id: 2, value: 'ไม่อนุมัติ', desc: 'รายการที่ไม่ถูกอนุมัติ' },
        { id: 3, value: 'ยกเลิกการทำรายการ', desc: 'ผู้ทำรายการยกเลิกการทำรายการ' },
        { id: 4, value: 'รอการยืนยันใหม่', desc: 'รอผู้ทำรายการแก้ไขข้อมูลให้ถูกต้อง' },
    ];

    const [listTopUp, setListTopUp] = useState([]);

    //state modal
    const [openModalImage, setOpenModalImage] = useState({ state: false, image: null });
    const [openConfirmModal, setConfirmModal] = useState({ state: false, data: null, status: 0 })
    const [openRemarkModal, setOpenRemarkModal] = useState({ state: false, data: null, changeStatus: false })
    const [openEditModal, setOpenEditModal] = useState({ state: false, data: null, status: 0 });

    //state loading
    const [loadingOrderTopup, setLoadingOrderTopup] = useState(false);

    function clearDate() {
        setDateRangeSelected({ start: null, end: null });
    }

    async function fetchGetAllTopUpOrderByOwner() {
        setLoadingOrderTopup(true)
        await fetchProtectedData.get(URLS.wallet.getAllTopUpOrder, { params: { businessId: currentUser.businessId, username: currentUser.userName } })
            .then(results => {
                setListTopUp(results.data);
                setLoadingOrderTopup(false)
            })
            .catch(err => {
                toastError('เกิดข้อผิดพลาด', 'การดึงข้อมูลยอดสะสมจากเซิฟเวอร์ไม่สำเร็จ');
            })
            .finally(() => {
                setLoadingOrderTopup(false)
            })
    }

    useEffect(() => {
        fetchGetAllTopUpOrderByOwner();
    }, [])

    return (
        <>

            <DetailImageModal open={openModalImage.state} close={e => setOpenModalImage({ state: e, image: null })} image={openModalImage.image} />

            {openConfirmModal.data &&
                <ConfirmByUserModal
                    open={openConfirmModal.state}
                    close={e => setConfirmModal({ state: e, data: null, isApprove: false, status: 0 })}
                    data={openConfirmModal.data}
                    status={openConfirmModal.status}
                    isFetchData={e => e && fetchGetAllTopUpOrderByOwner()}
                />
            }

            {openRemarkModal.data &&
                <ModalRemark
                    open={openRemarkModal.state}
                    close={e => setOpenRemarkModal({ state: e, data: null, changeStatus: false })}
                    data={openRemarkModal.data}
                    changeStatus={openRemarkModal.changeStatus}
                    isFetchData={e => e && fetchGetAllTopUpOrderByOwner()}
                />
            }

            {openEditModal.data &&
                <EditModal
                    open={openEditModal.state}
                    close={e => setOpenEditModal({ state: e, data: null, status: 0 })}
                    data={openEditModal.data}
                    status={openEditModal.status}
                    isFetchData={e => e && fetchGetAllTopUpOrderByOwner()}
                />
            }
            <div className="h-fit max-h[200px] w-full flex flex-row items-center justify-start p-4 space-x-4">
                <DateRangePicker
                    variant="flat" size="sm"
                    className="max-w-xs"
                    label='วันที่ทำรายการ'
                    aria-label="daterangepicker-topup"
                    labelPlacement="inside"
                    onChange={e => setDateRangeSelected({ start: e.start, end: e.end })}
                    value={{ start: dateRangeSelected.start, end: dateRangeSelected.end }} />

                <Button variant="flat" size="sm" color="primary" onPress={clearDate}>ล้างวันที่</Button>
                <Select
                    size="sm"
                    variant="bordered"
                    className="max-w-xs"
                    aria-label="select-status"
                    label='สถานะทำรายการ'
                    labelPlacement="inside"
                    items={listStatus}
                    defaultSelectedKeys={'all'}
                    selectionMode="multiple"
                    value={statusSelected}
                    onChange={e => setStatusInput(e.target.value)}>
                    {(item) => {
                        return (
                            <SelectItem key={item.id} textValue={item.value} description={item.desc} color="primary" variant="flat">
                                {item.value}
                            </SelectItem>
                        )
                    }}
                </Select>
            </div>


            <Card className="my-4 h-full overflow-auto scrollbar-hide" shadow="sm">
                <Table aria-label="table topup" removeWrapper isHeaderSticky align="center">
                    <TableHeader>
                        <TableColumn key={'orderDate'}>วันที่ทำรายการ</TableColumn>
                        <TableColumn key={'orderNo'}>เลขที่ธุรกรรม</TableColumn>
                        <TableColumn key={'createBy'}>ผู้ทำรายการ</TableColumn>
                        <TableColumn key={'amount'}>จำนวนเงิน</TableColumn>
                        <TableColumn key={'status'}>สถานะ</TableColumn>
                        <TableColumn key={'fileRef'}>ไฟล์แนบ</TableColumn>
                    </TableHeader>
                    <TableBody
                        emptyContent='ไม่มีประวัติการทำธุรกรรม'
                        items={listTopUp.filter(x => {
                            let isDateInRange = true;
                            let isStatusMatched = true;

                            if (dateRangeSelected.start && dateRangeSelected.end) {
                                const createDate = moment(x.createDate).format('YYYY-MM-DD');
                                const startDate = dateRangeSelected.start.toString();
                                const endDate = dateRangeSelected.end.toString();

                                isDateInRange = createDate >= startDate && createDate <= endDate;
                            }

                            if (statusSelected) {
                                const statusArray = statusSelected.split(',').map(Number);
                                isStatusMatched = statusArray.includes(x.status);
                            }

                            return isDateInRange && isStatusMatched;
                        })}
                        isLoading={loadingOrderTopup}>
                        {(item) => {
                            return (
                                <TableRow key={item.id}>
                                    <TableCell>{CustomFormatDate(item.createDate, 'DD/MM/YYYY HH:mm')}</TableCell>
                                    <TableCell>{item.transactionNo}</TableCell>
                                    <TableCell>{item.createBy}</TableCell>
                                    <TableCell>{cFormatter(item.amount, 2)}</TableCell>
                                    <TableCell>
                                        {CompareStatus(item.status, {
                                            0:
                                                <Dropdown>
                                                    <DropdownTrigger>
                                                        <span>
                                                            <Chip size="sm" variant="flat" color="primary" className="select-none cursor-pointer">รออนุมัติ</Chip>
                                                        </span>
                                                    </DropdownTrigger>
                                                    <DropdownMenu variant="flat" color="primary">
                                                        <DropdownItem color="warning" onPress={() => setOpenEditModal({ state: true, data: item, status: item.status })}>แก้ไขรายการ</DropdownItem>
                                                        <DropdownItem color="danger" onPress={() => setConfirmModal({ state: true, data: item, status: 3 })}>ยกเลิกรายการ</DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>,
                                            1: <Chip size="sm" variant="flat" color="success" className="select-none">อนุมัติแล้ว</Chip>,
                                            2:
                                                <Dropdown>
                                                    <DropdownTrigger>
                                                        <span>
                                                            <Chip size="sm" variant="flat" color="danger" className="select-none cursor-pointer">ไม่อนุมัติ</Chip>
                                                        </span>
                                                    </DropdownTrigger>
                                                    <DropdownMenu variant="flat">
                                                        <DropdownItem color="primary" onPress={() => setOpenRemarkModal({ state: true, data: item, changeStatus: false })} >รายละเอียด</DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            ,
                                            3: <Chip size="sm" variant="flat" color="warning" className="select-none  text-xs ">ยกเลิกการทำรายการ</Chip>,
                                            4: <Dropdown>
                                                <DropdownTrigger>
                                                    <span>
                                                        <Chip size="sm" variant="flat" color="primary" className="select-none cursor-pointer">รอการยืนยันใหม่</Chip>
                                                    </span>
                                                </DropdownTrigger>
                                                <DropdownMenu variant="flat">
                                                    <DropdownItem color="warning" onPress={() => setOpenEditModal({ state: true, data: item, status: item.status })}>แก้ไขรายการ</DropdownItem>
                                                    <DropdownItem color="primary" onPress={() => setOpenRemarkModal({ state: true, data: item, changeStatus: false })}>รายละเอียด</DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        })}
                                    </TableCell>
                                    <TableCell className="flex justify-center cursor-pointer" onPress={() => setOpenModalImage({ state: true, image: URLS.googleCloud.topUp + item.slipImage, itemData: item })}>
                                        <Image className="object-contain" radius="md" removeWrapper width={50} height={50} src={URLS.googleCloud.topUp + item.slipImage} />
                                    </TableCell>
                                </TableRow>
                            )
                        }}
                    </TableBody>
                </Table>
            </Card>
        </>
    )
}


export default Topup;