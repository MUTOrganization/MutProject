import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardBody, CardHeader, CardFooter, Spinner, Button, Chip, Select, SelectItem, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react'
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/react";
import columns from './config/return';
import fetchProtectedData from './../../../../utils/fetchData';
import { useAppContext } from '../../../contexts/AppContext';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { ACCESS } from '../../../configs/access';
import { URLS } from '../../../config';
import { data } from 'autoprefixer';
import ConfirmPenalty from './ConfirmPenaltyModal';
import { CompareStatus } from '../../../../utils/CompareStatus';
import RefundModal from './RefundModal';

function returnOrderTable({ dateRange, selectedEmployee = 'all', selectedFine }) {

    const [sortDescriptor, setSortDescriptor] = useState({
        column: "orderDate",
        direction: "descending",
    });

    const [returnData, setReturnData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedFineUser, setSelectedFineUser] = useState('');

    const appContext = useAppContext();
    const currentData = useAppContext();
    const currentUser = appContext.currentUser

    const canAccessDeduct = currentData?.accessCheck?.haveAny([ACCESS.deductReturn.deduct]);

    const headerColumns = useMemo(() => {
        return columns.filter((column) => {
            if (!canAccessDeduct && (column.uid === 'createBy' || column.uid === 'actions')) {
                return false;
            }
            return true;
        });
    }, [canAccessDeduct]);

    //state Modal
    const [openModalConfirmPenalty, setOpenModalConfirmPenalty] = useState({ state: false, data: null, isNotPenalty: false, isSelectedTwo: false });
    const [openRefundModal, setOpenRefundModal] = useState({ state: false, data: null });

    const formatDate = (dateString) => {
        dayjs.locale('th');
        const [year, month, day] = dateString.split('-');
        let convertedYear = parseInt(year, 10);

        if (convertedYear < 2500) {
            convertedYear += 543;
        }

        const date = dayjs(`${convertedYear}-${month}-${day}`);
        return date.format('D MMMM YYYY');
    };

    const filteredData = useMemo(() => {
        let filtered = returnData;

        if (selectedFine.length > 0) {
            filtered = filtered.filter(item => {
                return selectedFine.includes(item.fineImposed);
            });
        }

        return filtered;
    }, [returnData, selectedFine]);

    const sortedItems = useMemo(() => {
        return [...filteredData].sort((a, b) => {
            let first = a[sortDescriptor.column];
            let second = b[sortDescriptor.column];

            const firstIsNumber = !isNaN(parseFloat(first)) && isFinite(first);
            const secondIsNumber = !isNaN(parseFloat(second)) && isFinite(second);

            if (firstIsNumber && secondIsNumber) {
                first = parseFloat(first);
                second = parseFloat(second);
            } else {
                first = String(first).toLowerCase();
                second = String(second).toLowerCase();
            }

            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [filteredData, sortDescriptor]);

    const totalSum = useMemo(() => {
        return filteredData.reduce((sum, item) => {
            return {
                orderCount: sum.orderCount + 1,
                totalAmount: sum.totalAmount + (parseFloat(item.totalAmount) || 0),
                totalFine: sum.totalFine + (parseFloat(item.fine) || 0),
            };
        }, { orderCount: 0, totalAmount: 0, totalFine: 0 });
    }, [filteredData]);

    const formatDateObject = (dateObj) => {
        if (!dateObj) return null;
        const year = dateObj.year;
        const month = String(dateObj.month).padStart(2, "0");
        const day = String(dateObj.day).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '0';
        const number = Number(amount);
        const formattedNumber = number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return `฿${formattedNumber}`;
    };

    const formatCurrencyNoDollars = (amount) => {
        if (amount === undefined || amount === null) return '0';

        const number = Number(amount);
        const formattedNumber = number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return `${formattedNumber}`;
    };

    const formatCurrencyNoDollarsWithFixed = (amount) => {
        if (amount === undefined || amount === null) return '0';

        const number = Number(amount);
        const formattedNumber = number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return `${formattedNumber}`;
    };

    const fetchReturnData = async () => {
        const startDate = dateRange.start
        const endDate = dateRange.end
        setIsLoading(true);
        try {
            const response = await fetchProtectedData.post(URLS.RETURNORDER, {
                startDate: formatDateObject(startDate),
                endDate: formatDateObject(endDate),
                ownerId: appContext.agent.selectedAgent.id,
                customerOwnerId: appContext.agent.selectedAgent.id,
                selectedUser: selectedEmployee,
            });
            setReturnData(response.data);
            setIsLoading(false);
        } catch (error) {
            console.log('error fetching data', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReturnData();
    }, [dateRange.end, selectedEmployee, appContext.agent.selectedAgent.id]);

    const renderSummaryCell = (columnKey) => {
        switch (columnKey) {
            case 'orderDate':
                return 'รวมทั้งหมด';
            case 'orderNo':
                return `${totalSum.orderCount} รายการ`;
            case 'totalAmount':
                return formatCurrency(totalSum.totalAmount);
            case 'fine':
                return formatCurrency(totalSum.totalFine);
            default:
                return '';
        }
    };

    const classNames = useMemo(() => ({
        row: [
            "hover:bg-blue-200",
            "group",
            "transition-colors",
            "duration-300",
        ],
        td: [
            "p-2",
            "border-b",
            "border-gray-50",
            "text-center",
            "group-hover:bg-blue-50",
        ],
    }), []);

    return (
        <div>
            <Card radius='sm' shadow='none'>
                {openModalConfirmPenalty.data &&
                    <ConfirmPenalty
                        open={openModalConfirmPenalty.state}
                        close={e => { setOpenModalConfirmPenalty({ state: e, data: null, isNotPenalty: false, isSelectedTwo: false }) }}
                        data={openModalConfirmPenalty.data}
                        isRefresh={e => e && fetchReturnData()}
                        isNotPenalty={openModalConfirmPenalty.isNotPenalty}
                        selectedUserPenalty={selectedFineUser}
                        isSelectedTwo={openModalConfirmPenalty.isSelectedTwo}
                    />
                }

                {openRefundModal.data &&
                    <RefundModal
                        open={openRefundModal.state}
                        close={e => setOpenRefundModal({ state: e, data: null })}
                        data={openRefundModal.data}
                        isFetchData={e => e && fetchReturnData()}
                    />
                }

                <Table
                    aria-label='table return order'
                    removeWrapper
                    className="max-h-[720px] overflow-y-auto overflow-x-auto scrollbar-hide p-2"
                    classNames={classNames}
                    sortDescriptor={sortDescriptor}
                    onSortChange={setSortDescriptor}
                    isHeaderSticky
                    align='center'
                >
                    <TableHeader className="text-center">
                        <TableColumn key={'orderDate'} allowsSorting className='text-sm'>วันที่ทำรายการ</TableColumn>
                        <TableColumn key={'orderNo'} allowsSorting className='text-sm'>รหัสคำสั่งซื้อ</TableColumn>
                        <TableColumn key={'name'} allowsSorting className='text-sm'>ชื่อลูกค้า</TableColumn>
                        <TableColumn key={'totalAmount'} allowsSorting className='text-sm'>ยอดชำระ</TableColumn>
                        <TableColumn key={'paymentType'} allowsSorting className='text-sm'>ประเภทการชำระเงิน</TableColumn>
                        <TableColumn key={'paymentStatus'} allowsSorting className='text-sm'>สถานะการชำระเงิน</TableColumn>
                        <TableColumn key={'fine'} allowsSorting className='text-sm'>ค่าปรับ</TableColumn>
                        <TableColumn key={'fineImposed'} allowsSorting className='text-sm'>สถานะการปรับ</TableColumn>
                        <TableColumn hidden={!canAccessDeduct} key={'employee'} allowsSorting className='text-sm'>พนักงาน</TableColumn>
                        <TableColumn hidden={!canAccessDeduct} key={'action'} allowsSorting className='text-sm'>การจัดการ</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"ไม่พบข้อมูล"}
                        isLoading={isLoading}
                        loadingContent={<Spinner color="primary" />}
                    >
                        {sortedItems.map(item => {
                            return (
                                <TableRow key={item.id}>
                                    <TableCell>{formatDate(item.orderDate)}</TableCell>
                                    <TableCell>{item.orderNo}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{formatCurrency(item.totalAmount)}</TableCell>
                                    <TableCell>{item.paymentType}</TableCell>
                                    <TableCell>{item.paymentStatus}</TableCell>
                                    <TableCell>{formatCurrency(item.fine)}</TableCell>
                                    <TableCell>
                                        {CompareStatus(item.fineImposed, {
                                            1: <Chip color="success" variant='flat' size='sm' >หักค่าปรับ</Chip>,
                                            0: <Chip color="danger" variant='flat' size='sm'>ยังไม่ถูกหักค่าปรับ</Chip>,
                                            null: <Chip color="danger" variant='flat' size='sm'>ยังไม่ถูกหักค่าปรับ</Chip>
                                        })}
                                    </TableCell>
                                    <TableCell hidden={!canAccessDeduct}>
                                        <div className="">
                                            <p className='text-start'>{item.upsaleUser && 'เลือกผู้ใช้'}</p>
                                            <Select
                                                aria-label='selectUserFind'
                                                placeholder={item.createBy}
                                                labelPlacement="outside"
                                                variant="bordered"
                                                className="max-w-xs"
                                                value={selectedFineUser}
                                                onChange={(e) => setSelectedFineUser(e.target.value)}
                                            >
                                                <SelectItem key={item.createBy} value={item.createBy}>
                                                    {item.createBy}
                                                </SelectItem>
                                                {item.upsaleUser && (
                                                    <SelectItem key={item.upsaleUser} value={item.upsaleUser}>
                                                        {item.upsaleUser}
                                                    </SelectItem>
                                                )}
                                            </Select>
                                        </div>
                                    </TableCell>
                                    <TableCell hidden={!canAccessDeduct}>
                                        {!item.fineImposed ? (
                                            <Dropdown>
                                                <DropdownTrigger>
                                                    <Button size='sm' color='primary' variant='bordered'>กรุณาเลือก</Button>
                                                </DropdownTrigger>
                                                <DropdownMenu variant='flat' color='primary'>
                                                    <DropdownItem onPress={() => setOpenModalConfirmPenalty({ state: true, data: item, isNotPenalty: false, isSelectedTwo: false })}>หักค่าปรับ</DropdownItem>
                                                    {item.upsaleUser &&
                                                        <DropdownItem onPress={() => setOpenModalConfirmPenalty({ state: true, data: item, isNotPenalty: false, isSelectedTwo: true })} >ปรับทั้งคู่</DropdownItem>
                                                    }
                                                    <DropdownItem onPress={() => setOpenModalConfirmPenalty({ state: true, data: item, isNotPenalty: true, isSelectedTwo: true })}>ไม่หักค่าปรับ</DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        ) :
                                            (
                                                <>
                                                    <Button disabled={item.refundStatus} onPress={() => setOpenRefundModal({ state: true, data: item })} size='sm' color='warning' variant='flat'>{item.refundStatus ? 'คืนเงินแล้ว' : 'คืนเงินค่าปรับ'}</Button>
                                                </>
                                            )}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        {sortedItems && sortedItems.length > 0 && (
                            <TableRow className="bg-slate-200 border-0 z-10 sticky bottom-0 rounded-lg">
                                {columns.map((column, index) => (
                                    <TableCell
                                        key={column.uid}
                                        className="text-center font-bold"
                                        hidden={!canAccessDeduct}
                                        style={{
                                            borderTopLeftRadius: index === 0 ? 4 : 0,
                                            borderBottomLeftRadius: index === 0 ? 4 : 0,
                                            borderTopRightRadius: index === headerColumns.length - 1 ? 4 : 0,
                                            borderBottomRightRadius: index === headerColumns.length - 1 ? 4 : 0,
                                        }}
                                    >
                                        {renderSummaryCell(column.uid)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}

export default returnOrderTable