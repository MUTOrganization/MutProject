import { Button, Card, Chip, DateRangePicker, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import fetchProtectedData from "../../../../utils/fetchData";
import { URLS } from "../../../config";
import { useAppContext } from "../../../contexts/AppContext";
import { toastError } from "../../../component/Alert";
import { CustomFormatDate, CustomFormatDateTime } from "../../../../utils/FormatDate";
import { CompareStatus } from "../../../../utils/CompareStatus";
import { cFormatter } from "../../../../utils/numberFormatter";
import moment from "moment";
import DateSelector from "../../../component/DateSelector";
import { endOfMonth, parseDate, startOfMonth, today } from "@internationalized/date";
import { HintIcon } from "../../../component/Icons";

function PDH() {
    //state context
    const { currentUser } = useAppContext();

    //state input
    const [datePicker, setDatePicker] = useState({ start: startOfMonth(today()), end: endOfMonth(today()) });
    const [datePickerReturnOrder, setDatePickerReturnOrder] = useState({ start: startOfMonth(today()), end: endOfMonth(today()) });
    const [fineStatusFilter, setFineStatusFilter] = useState('');

    //state loading
    const [loadingGetAllFined, setLoadingAllFined] = useState(false);
    const [loadingReturnOrder, setLoadingReturnOrder] = useState(false);

    //state list data form api
    const [listFined, setListFined] = useState([]);
    const [listReturnOrder, setListReturnOrder] = useState([]);

    const statusFine = [
        { id: 0, value: 'หักค่าปรับ' },
        { id: 1, value: 'คืนเงินค่าปรับ' }
    ]

    const findSummaryFined = () => {
        let totalNotFined = listReturnOrder.filter(x => x.fineImposed === null || x.fineImposed === 0);
        return totalNotFined.length;
    }



    //funcion fetcher
    async function fetchFineLogs() {
        setLoadingAllFined(true);
        await fetchProtectedData.get(URLS.wallet.getAllExpenses, { params: { username: currentUser.userName } })
            .then((r) => {
                setListFined(r.data);
            }).catch(err => {
                toastError('เกิดข้อผิดพลาด', 'ดึงข้อมูลจากเซิฟเวอร์ไม่สำเร็จ โปรดลองใหม่อีกครั้ง');
            }).finally(() => {
                setLoadingAllFined(false);
            })
    }

    async function fetchReturnOrder() {
        setLoadingReturnOrder(true);
        let startDay = datePickerReturnOrder.start.day;
        let endDay = datePickerReturnOrder.end.day;
        let startMonth = datePickerReturnOrder.start.month;
        let endMonth = datePickerReturnOrder.end.month;
        let startYear = datePickerReturnOrder.start.year;
        let endYear = datePickerReturnOrder.end.year;
        let startDate = new Date(startYear, startMonth - 1, startDay, 0, 0, 0, 0);
        let endDate = new Date(endYear, endMonth - 1, endDay, 23, 59, 59, 999);

        let formattedStartDate = CustomFormatDateTime(startDate);
        let formattedEndDate = CustomFormatDateTime(endDate);

        await fetchProtectedData.get(URLS.order.getAll, {
            params: {
                status: 'RETURN',
                createBy: currentUser.userName,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
            }
        }).then((r) => {
            setListReturnOrder(r.data);
        }).catch(err => {
            toastError('เกิดข้อผิดพลาด', 'ดึงข้อมูลจากเซิฟเวอร์ไม่สำเร็จ โปรดลองใหม่อีกครั้ง');
        }).finally(() => {
            setLoadingReturnOrder(false);
        })
    }


    //state useEffect
    useEffect(() => {
        fetchFineLogs();
        fetchReturnOrder();
    }, [])

    useEffect(() => {
        fetchReturnOrder()
    }, [datePickerReturnOrder.end])

    //filter
    const filterFine = listFined.filter(x => {
        let createDate = CustomFormatDate(x.createDate);
        let startDate = datePicker.start?.toString();
        let endDate = datePicker.end?.toString();

        if (startDate && endDate) {
            return createDate >= startDate && createDate <= endDate;
        }

        if (fineStatusFilter) {
            return fineStatusFilter.includes(x.status)
        }
        return true;
    });

    return (
        <>
            <div className="max-lg:flex-wrap  h-fit max-h[200px] w-full flex flex-row items-center justify-start p-4 space-x-4">
                <div className="flex-1 flex items-center justify-start space-x-4">
                    <DateSelector value={{ start: datePicker.start, end: datePicker.end }} onChange={e => { setDatePicker({ start: e.start, end: e.end }); }} />

                    <Select
                        size="sm"
                        variant="bordered"
                        selectionMode="multiple"
                        items={statusFine}
                        defaultSelectedKeys={'all'}
                        label='สถานะค่าปรับ'
                        onChange={e => setFineStatusFilter(e.target.value)}
                        value={fineStatusFilter}
                        className="max-w-xs">
                        {(item) => {
                            return (
                                <SelectItem key={item.id}>{item.value}</SelectItem>
                            )
                        }}
                    </Select>
                </div>

                <div className="flex-1 flex items-center justify-start space-x-4">

                    <DateSelector value={{ start: datePickerReturnOrder.start, end: datePickerReturnOrder.end }} onChange={e => { setDatePickerReturnOrder({ start: e.start, end: e.end }); }} />

                    <Card className="w-full h-full p-4 font-semibold text-start" radius="sm" shadow="sm">
                        <div className=" absolute top-2 end-4">
                            <Tooltip content='ข้อมูลเป็นของช่วงเวลาที่เลือก' color="primary">
                                <span >
                                    <HintIcon />
                                </span>
                            </Tooltip>
                        </div>
                        <p className="text-danger">ยังไม่ถูกหัก : {findSummaryFined()} รายการ</p>
                        <p className="text-green-600">ถูกหักค่าปรับแล้ว : {listReturnOrder.length - findSummaryFined()} รายการ </p>
                    </Card>
                </div>
            </div>
            <div className="w-full flex space-x-4 max-lg:flex-wrap max-lg:space-y-20">
                <div className="flex-1">
                    <p className="font-semibold mt-2">ประวัติการโดนหักค่าปรับ {filterFine.length} รายการ</p>
                    <Card className="w-full h-full scrollbar-hide my-2" shadow="sm">
                        <Table aria-label="table finelogs" removeWrapper align="center" className="h-[520px] overflow-auto scrollbar-hide" isHeaderSticky isStriped={true} >
                            <TableHeader>
                                <TableColumn key={'createDate'} title='วันที่ถูกปรับ' />
                                <TableColumn key={'finedUser'} title='ผู้ถูกปรับ' />
                                <TableColumn key={'amount'} title='จำนวนเงิน' />
                                <TableColumn key={'status'} title='สถานะ' />
                                <TableColumn key={'fineType'} title='ประเภทค่าปรับ' />
                            </TableHeader>
                            <TableBody isLoading={loadingGetAllFined} loadingContent={<Spinner size="lg" color="primary" />}>
                                {filterFine.map(item => {
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell>{CustomFormatDate(item.createDate, 'DD-MM-YYYY HH:mm')}</TableCell>
                                            <TableCell>{item.finedUser}</TableCell>
                                            <TableCell>{cFormatter(item.amount, 2)}</TableCell>
                                            <TableCell>
                                                {CompareStatus(item.status, {
                                                    0: <Chip size="sm" color="danger" variant="flat">หักค่าปรับ</Chip>,
                                                    1: <Chip size="sm" color="warning" variant="flat">คืนเงินค่าปรับ</Chip>
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                {CompareStatus(item.fineType, {
                                                    0: <Chip size="sm" color="success" variant="flat">หักจากเงินในระบบ</Chip>,
                                                    1: <Chip size="sm" color="primary" variant="flat">หักจาก Commission</Chip>,
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </Card>
                </div>

                <div className="flex-1">
                    <p className="font-semibold mt-2">รายการทั้งหมด {listReturnOrder.length} รายการ</p>
                    <Card className="w-full h-full scrollbar-hide my-2" shadow="sm">
                        <Table aria-label="table returnOrder" removeWrapper align="center" className="h-[520px] overflow-auto scrollbar-hide" isHeaderSticky isStriped={true} >
                            <TableHeader>
                                <TableColumn key={'orderDate'} title='วันที่' />
                                <TableColumn key={'orderNo'} title='หมายเลขอ้างอิง' />
                                <TableColumn key={'paymentType'} title='ประเภทการชำระเงิน' />
                                <TableColumn key={'createBy'} title='เซลล์' />
                                <TableColumn key={'upsaleUser'} title='ผู้อัพเซลล์' />
                                <TableColumn key={'netAmount'} title='ยอดขาย' />
                                <TableColumn key={'status'} title='สถานะ' />
                                <TableColumn key={'fineType'} title='สถานะค่าปรับ' />
                            </TableHeader>
                            <TableBody isLoading={loadingReturnOrder} loadingContent={<Spinner size="lg" color="primary" />}>
                                {listReturnOrder.map(item => {
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell>{CustomFormatDateTime(item.orderDate)}</TableCell>
                                            <TableCell>{item.orderNo}</TableCell>
                                            <TableCell>{item.paymentType}</TableCell>
                                            <TableCell>{item.createBy}</TableCell>
                                            <TableCell>{item.upsaleUser || '- -'}</TableCell>
                                            <TableCell>฿{cFormatter(item.netAmount, 2)}</TableCell>
                                            <TableCell>{item.status}</TableCell>
                                            <TableCell>
                                                {CompareStatus(item.fineImposed, {
                                                    null: <Chip size="sm" color="warning" variant="flat">ยังไม่ถูกหัก</Chip>,
                                                    0: <Chip size="sm" color="warning" variant="flat">ยังไม่ถูกหัก</Chip>,
                                                    1: <Chip size="sm" color="success" variant="flat">ถูกหักค่าปรับแล้ว</Chip>
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            </div>
        </>
    )
}


export default PDH;