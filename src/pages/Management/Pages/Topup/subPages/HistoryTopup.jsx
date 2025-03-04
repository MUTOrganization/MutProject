import { Button, Card, CardHeader, Chip, DatePicker, DateRangePicker, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Input, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import DefaultLayout from "../../../../../layouts/default";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../../../../contexts/AppContext";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "../../../../../config";
import { toastError, toastSuccess } from "../../../../../component/Alert";
import { AddFileIcon, HintIcon, SettingIcon } from "../../../../../component/Icons";
import DetailImageModal from "../components/DetailImageModal";
import moment from "moment";
import { parseDate } from "@internationalized/date";
import { CustomFormatDate } from "../../../../../../utils/FormatDate";
import { cFormatter } from "../../../../../../utils/numberFormatter";
import { CompareStatus } from "../../../../../../utils/CompareStatus";
import ConfirmByUserModal from "../components/ConfirmByUserModal";
import ModalRemark from "../components/ModalRemark";
import EditModal from "../components/EditModal";
import { ACCESS } from "../../../../../configs/access";


function HistoryTopup() {
    const { currentUser, accessCheck } = useAppContext()
    const canSettingImage = accessCheck.haveOne(ACCESS.topup.settingImage);

    let fileInputRef = useRef(null);

    let fileSettingRef = useRef(null);

    //state data 
    const [balance, setBalace] = useState([]);
    const [listTopUp, setListTopUp] = useState([]);
    const [settingImageTopUp, setSettingImageTopUp] = useState();

    //state Input
    const [dateRangeSelected, setDateRangeSelceted] = useState({ start: null, end: null });
    const [dateInput, setDateInput] = useState(parseDate(moment().format('YYYY-MM-DD')))
    const [statusInput, setStatusInput] = useState('');
    const [fileList, setFileList] = useState([]);
    const [inputBalance, setInputBalance] = useState(0.00)

    //state loading
    const [loadingBalance, setLoadingBalance] = useState(false);
    const [isLoadingTopup, setLoadingTopup] = useState(false);
    const [loadingOrderTopup, setLoadingOrderTopup] = useState(false)
    const [loadingSetting, setLoadingSetting] = useState(false);

    //state Modal
    const [openModalImage, setOpenModalImage] = useState({ state: false, image: null });
    const [openConfirmModal, setConfirmModal] = useState({ state: false, data: null, status: 0 })
    const [openRemarkModal, setOpenRemarkModal] = useState({ state: false, data: null, changeStatus: false })
    const [openEditModal, setOpenEditModal] = useState({ state: false, data: null, status: 0 });

    // state Validate Error
    const [validateNumber, setValidateInputNumber] = useState({ state: false, message: '' })
    const [validateFile, setValidateFile] = useState({ state: false, message: '' })

    //#region all function fetch API
    async function fetchTopup() {
        setLoadingTopup(true);
        try {
            var newForm = new FormData();
            newForm.append('amount', inputBalance);
            newForm.append('currentUser', currentUser.userName)
            newForm.append('businessId', currentUser.businessId)
            newForm.append('orderDate', dateInput)
            newForm.append('image', fileList[0])
            await fetchProtectedData.post(URLS.wallet.topUp, newForm, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(res => {
                    toastSuccess('ดำเนินรายการเสร็จสมบูรณ์', 'โปรดรอแอดมินตรวจสอบ');
                    setLoadingTopup(false);
                })

        } catch (err) {
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถทำรายการนี้ได้โปรดลองใหม่อีกครั้ง')
        } finally {
            setLoadingTopup(false);
        }
    }

    //คั้งค่ารูปบัญชีบริษัท
    async function fetchSettingImageAccountCmp(e) {
        const image = e.target.files;
        var newForm = new FormData();
        newForm.append('businessId', currentUser.businessId)
        newForm.append('image', image[0])
        await fetchProtectedData.post(URLS.wallet.settingImageTopUp, newForm, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(e => {
                toastSuccess('ดำเนินการสำเร็จ', 'ระบบได้ดำเนินการเปลี่ยนรูปเรียบร้อยแล้ว')
                setLoadingSetting(false);
                fetchGetSettingImageTopUp()
            }).catch(err => {
                toastError('ดำเนินการไม่สำเร็จ', 'เกิดข้อผิดพลาด')
            }).finally(() => {
                setLoadingSetting(false);
            })
        if (fileSettingRef.current) {
            fileSettingRef.current.value = "";
        }
    }
    //#endregion


    async function fetchGetBalance() {
        setLoadingBalance(true)
        await fetchProtectedData.get(URLS.users.getBalance + '/' + currentUser.userName)
            .then(res => {
                setBalace(res.data)
                setLoadingBalance(false)
            })
            .catch(err => {
                toastError('เกิดข้อผิดพลาด', 'พบข้อผิดพลาดในการดึงข้อมูล โปรดลองใหม่อีกครั้ง')
            })
            .finally(() => {
                setLoadingBalance(false)
            })
    }

    async function fetchGetSettingImageTopUp() {
        setLoadingSetting(true);
        await fetchProtectedData.get(URLS.wallet.getSettingImageTopUp, { params: { businessId: currentUser.businessId } })
            .then(res => {
                setSettingImageTopUp(res.data.imgSetting)
                setLoadingSetting(false)
            }).catch(err => {
                setSettingImageTopUp('')
            })
            .finally(() => {
                setLoadingSetting(false)
            })
    }


    async function fetchGetAllTopUpOrder() {
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

    const listStatus = [
        { id: 0, value: 'รอยืนยัน', desc: 'รายการที่รอการอนุมัติ' },
        { id: 1, value: 'อนุมัติแล้ว', desc: 'รายการที่อนุมัติ' },
        { id: 2, value: 'ไม่อนุมัติ', desc: 'รายการที่ไม่ถูกอนุมัติ' },
        { id: 3, value: 'ยกเลิกการทำรายการ', desc: 'ผู้ทำรายการยกเลิกการทำรายการ' },
        { id: 4, value: 'รอการยืนยันใหม่', desc: 'รอผู้ทำรายการแก้ไขข้อมูลให้ถูกต้อง' },
    ];

    function clearInput() {
        setDateRangeSelceted({ start: null, end: null });
    }

    function clearFile() {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setFileList([])
    }

    function clear() {
        setInputBalance('')
        setValidateInputNumber({ state: false, message: '' })
    }

    //#region openFile Dialog
    function openFileDialog() {
        fileInputRef.current.click();
    }

    function handleFileChange(value) {
        setValidateFile({ state: false, message: '' });
        const files = Array.from(value.target.files);
        setFileList(files)
    }
    //#endregion

    //#region validateInput
    function validateInputNumber(value) {
        if (!value || !Number(value) || !parseFloat(value).toFixed(2) || value <= 0.00) {
            setValidateInputNumber({ state: true, message: '**กรุณากรอกจำนวนเงินให้ถูกต้อง' })
            return false;
        }

        if (fileList.length <= 0) {
            setValidateFile({ state: true, message: 'กรุณาแนบไฟล์' })
            return false;
        }
        return true;
    }

    async function handleConfirm() {
        if (validateInputNumber(inputBalance)) {
            await fetchTopup();
            clear();
            clearFile();
            setValidateFile({ state: false, message: '' });
            fetchGetAllTopUpOrder();
        }
    }

    //#endregion

    useEffect(() => {
        fetchGetBalance();
        fetchGetAllTopUpOrder(); ///
        fetchGetSettingImageTopUp();
    }, [])

    return (
        <section title={'เติมเงิน'}>
            <DetailImageModal open={openModalImage.state} close={e => setOpenModalImage({ state: e, image: null })} image={openModalImage.image} />
            {openConfirmModal.data &&
                <ConfirmByUserModal
                    open={openConfirmModal.state}
                    close={e => setConfirmModal({ state: e, data: null, isApprove: false, status: 0 })}
                    data={openConfirmModal.data}
                    status={openConfirmModal.status}
                    isFetchData={e => e && fetchGetAllTopUpOrder()}
                />
            }

            {openRemarkModal.data &&
                <ModalRemark
                    open={openRemarkModal.state}
                    close={e => setOpenRemarkModal({ state: e, data: null, changeStatus: false })}
                    data={openRemarkModal.data}
                    changeStatus={openRemarkModal.changeStatus}
                    isFetchData={e => e && fetchGetAllTopUpOrder()}
                />
            }

            {openEditModal.data &&
                <EditModal
                    open={openEditModal.state}
                    close={e => setOpenEditModal({ state: e, data: null, status: 0 })}
                    data={openEditModal.data}
                    status={openEditModal.status}
                    isFetchData={e => e && fetchGetAllTopUpOrder()}
                />
            }

            <Card shadow="sm" radius="sm" className="w-full h-full p-4">
                <div className="w-full" radius="sm" shadow="sm">
                    <CardHeader className="flex space-x-5 items-center max-lg:flex-wrap max-lg:space-y-4">
                        <DateRangePicker
                            label='วันที่ทำรายการ'
                            labelPlacement="inside"
                            variant="bordered"
                            color="default"
                            size="sm"
                            className="max-w-xs"
                            onChange={e => setDateRangeSelceted({ start: e.start, end: e.end })}
                            value={{ start: dateRangeSelected.start, end: dateRangeSelected.end }} />


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
                    </CardHeader>
                </div>

                <Card className="w-full my-10 p-8" shadow="sm" radius="sm">
                    <div className="flex items-center">
                        <div className="flex-1">
                            {settingImageTopUp ?
                                <Image
                                    src={URLS.googleCloud.settingImageTopUp + settingImageTopUp}
                                    isLoading={loadingSetting}
                                    className="cursor-pointer"
                                    onPress={() => { canSettingImage && fileSettingRef.current.click() }}
                                    height={100} alt="บัญชีบริษัท"
                                />
                                :

                                <Button
                                    size="sm"
                                    color="primary"
                                    variant="flat"
                                    onPress={() => {
                                        if (canSettingImage) fileSettingRef.current.click();
                                    }}
                                >
                                    {canSettingImage ? 'เพิ่มบัญชีบริษัท' : 'โปรดติดต่อ admin ให้ เพิ่มบัญชีบริษัท'}
                                </Button>
                            }
                        </div>
                        <div className="flex-1 space-y-4">
                            {canSettingImage &&
                                <span className='absolute top-6 left-10 cursor-pointer'>
                                    <Tooltip content='กดที่รูปเพื่อเปลี่ยนรูปบัญชี' size="lg" showArrow>
                                        <span>
                                            <HintIcon />
                                        </span>
                                    </Tooltip>
                                    <input type="file" className="hidden" ref={fileSettingRef} accept="image/*" onChange={(e) => fetchSettingImageAccountCmp(e)} />
                                </span>
                            }
                            <div className="flex justify-end items-center">

                                {loadingBalance ? <Spinner color="primary" size="md" /> : <Chip size="lg" color="primary" variant="flat">ยอดคงเหลือ {balance.balance}</Chip>}
                            </div>
                            <div className="flex gap-5 items-center">
                                <DatePicker
                                    label="วันที่ทำรายการ (ตามสลิป)"
                                    size="sm"
                                    variant="bordered"
                                    showMonthAndYearPickers
                                    color="default"
                                    value={dateInput}
                                    onChange={setDateInput}
                                />
                                <Input
                                    label='จำนวนเงิน'
                                    placeholder="0.00"
                                    onChange={e => setInputBalance(e.target.value)}
                                    value={inputBalance}
                                    isInvalid={validateNumber.state}
                                    errorMessage={validateNumber.message}
                                    labelPlacement="inside"
                                    onFocus={clear}
                                    variant="bordered"
                                    size="sm" />
                                <div>
                                    <Button
                                        size="sm"
                                        variant="bordered"
                                        onPress={openFileDialog}
                                        radius="lg"
                                        color="primary"
                                        type="button"
                                        startContent={<AddFileIcon />}>
                                        แนบไฟล์
                                    </Button>

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    {fileList.length > 0 && <p className="link text-primary text-center my-2" onPress={() => {
                                        fileList.map((file) => {
                                            const urlImage = URL.createObjectURL(file);
                                            setOpenModalImage({ state: true, image: urlImage })
                                        })
                                    }}>ดูไฟล์แนบ</p>}
                                </div>
                            </div>
                            <div className="flex justify-end items-center space-x-4">
                                {validateFile.state ? <p className="text-danger font-semibold text-sm">**กรุณาแนบไฟล์ก่อนกด</p> : <div></div>}
                                <Button color="success" size="md" variant="flat" onPress={handleConfirm} isLoading={isLoadingTopup} className="w-[150px]">เติมเงิน</Button>
                            </div>
                        </div>
                    </div>
                </Card>

                <p className="mx-10 font-semibold">ประวัติการเติมเงิน {listTopUp.length} รายการ</p>
                <Card shadow="sm" className=" border-1.5 h-[500px] w-full overflow-auto scrollbar-hide">

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
                            items={listTopUp.filter(x => {
                                let isDateInRange = true;
                                let isStatusMatched = true;

                                if (dateRangeSelected.start && dateRangeSelected.end) {
                                    const createDate = moment(x.createDate).format('YYYY-MM-DD');
                                    const startDate = dateRangeSelected.start.toString();
                                    const endDate = dateRangeSelected.end.toString();

                                    isDateInRange = createDate >= startDate && createDate <= endDate;
                                }

                                if (statusInput) {
                                    const statusArray = statusInput.split(',').map(Number);
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
                                        <TableCell className="flex justify-center cursor-pointer" onClick={() => setOpenModalImage({ state: true, image: URLS.googleCloud.topUp + item.slipImage, itemData: item })}>
                                            <Image className="object-contain" radius="md" removeWrapper width={50} height={50} src={URLS.googleCloud.topUp + item.slipImage} />
                                        </TableCell>
                                    </TableRow>
                                )
                            }}

                        </TableBody>
                    </Table>
                </Card>
            </Card>

        </section >
    )
}


export default HistoryTopup;