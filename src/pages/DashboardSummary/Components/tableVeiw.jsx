import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Spinner, Card } from "@nextui-org/react";
import { useAppContext } from '../../../contexts/AppContext';
import columns from '../config/config';
import fetchProtectedData from '../../../../utils/fetchData';
import { URLS } from '../../../config';
import dayjs from 'dayjs';
import 'dayjs/locale/th';

function tableVeiw({ startDate, endDate, selectedNameListValue, selectedAgentValue, vatRate, selectedTypeValue }) {

    const [sortDescriptor, setSortDescriptor] = useState({
        column: "orderDate",
        direction: "ascending",
    });

    const [summaryData, setSummaryData] = useState([]);

    const selectedType = selectedTypeValue === 'ปี' ? 'year' : selectedTypeValue;

    const [isLoading, setIsLoading] = useState(false);
    const appContext = useAppContext();
    const currentUser = appContext.currentUser

    console.log(summaryData)

    const formatDateObject = (dateObj) => {
        if (!dateObj) return null;
        const year = dateObj.year;
        const month = String(dateObj.month).padStart(2, "0");
        const day = String(dateObj.day).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const formatDate = (dateString) => {
        if (!dateString || typeof dateString !== 'string') return 'รวมทั้งหมด';

        dayjs.locale('th');
        const [year, month, day] = dateString.split('-');
        let convertedYear = parseInt(year, 10);

        if (convertedYear < 2500) {
            convertedYear += 543;
        }

        const date = dayjs(`${convertedYear}-${month}-${day}`);
        return date.isValid() ? date.format('D MMMM YYYY') : 'รูปแบบวันที่ไม่ถูกต้อง';
    };

    const fetchSummaryData = async () => {
        setIsLoading(true);
        try {
            const response = await fetchProtectedData.post(`${URLS.summary.TableMergedData}`, {
                startDate: startDate,
                endDate: endDate,
                selectedNameList: selectedNameListValue,
                customerOwnerId: selectedAgentValue,
                ownerId: selectedNameListValue,
                selectedTypeValue: selectedTypeValue
            });
            setSummaryData(response.data);
        } catch (error) {
            console.log('error fetching data', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSummaryData();
    }, [startDate, endDate, selectedNameListValue, selectedAgentValue, vatRate]);

    const sortedItems = useMemo(() => {
        return [...summaryData].sort((a, b) => {
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
    }, [summaryData, sortDescriptor]);

    const parseNumber = (value) => {
        return typeof value === 'number' ? value : parseFloat(value) || 0;
    };

    const calculateVat = (amount) => {
        const validAmount = parseNumber(amount);
        if (vatRate && vatRate > 0) {
            const vatAmount = validAmount * 0.07;
            return validAmount + vatAmount;
        }
        return validAmount;
    };

    const totalSum = useMemo(() => {
        const result = summaryData.reduce((sum, item) => {
            return {
                totalAmount: (sum.totalAmount || 0) + (parseFloat(item.totalAmount) || 0),
                oldSale: (sum.oldSale || 0) + (parseFloat(item.oldSale) || 0),
                newSale: (sum.newSale || 0) + (parseFloat(item.newSale) || 0),
                totalAmountAdmin: (sum.totalAmountAdmin || 0) + (parseFloat(item.totalAmountAdmin) || 0),
                totalAmountCRM: (sum.totalAmountCRM || 0) + (parseFloat(item.totalAmountCRM) || 0),
                totalAds: (sum.totalAds || 0) + (parseFloat(item.totalAds) || 0),
                totalUpSale: (sum.totalUpSale || 0) + (parseFloat(item.totalUpSale) || 0),
                orderUpSale: (sum.orderUpSale || 0) + (parseFloat(item.orderUpSale) || 0),
                newOrder: (sum.newOrder || 0) + (parseFloat(item.newOrder) || 0),
                oldOrder: (sum.oldOrder || 0) + (parseFloat(item.oldOrder) || 0),
                totalOrderAdmin: (sum.totalOrderAdmin || 0) + (parseFloat(item.totalOrderAdmin) || 0),
                totalOrder: (sum.totalOrder || 0) + (parseFloat(item.totalOrder) || 0),
                newInbox: (sum.newInbox || 0) + (parseFloat(item.newInbox) || 0),
                oldInbox: (sum.oldInbox || 0) + (parseFloat(item.oldInbox) || 0),
                totalInbox: (sum.totalInbox || 0) + (parseFloat(item.totalInbox) || 0),
            };
        }, {});

        const calculatedPercentageNewSale = result.newSale > 0
            ? (result.totalAds / result.newSale) * 100
            : 0;

        const calculatedPercentageOldSale = result.oldSale > 0
            ? (result.totalAds / result.oldSale) * 100
            : 0;

        const calculatedPercentageTotalAmount = result.totalAmount > 0
            ? (result.totalAds / result.totalAmount) * 100
            : 0;

        const calculatedPercentageNewCustomerClose = result.newOrder > 0
            ? (result.newInbox / result.newOrder)
            : 0;

        const calculatedPercentageTotalAmountClose = result.oldOrder > 0
            ? (result.newInbox / result.oldOrder)
            : 0;

        const calculatedPercentageTotalOrderAdminClose = result.totalOrderAdmin > 0
            ? (result.newInbox / result.totalOrderAdmin)
            : 0;

        const calculatedPercentageOrderUpSale = result.totalOrder > 0
            ? (result.orderUpSale / result.totalOrder) * 100
            : 0;

        return {
            ...result,
            orderDate: "รวมทั้งหมด",
            percentageNewSale: calculatedPercentageNewSale.toFixed(2),
            percentageOldSale: calculatedPercentageOldSale.toFixed(2),
            percentageTotalAmount: calculatedPercentageTotalAmount.toFixed(4),
            percentageNewCustomerClose: calculatedPercentageNewCustomerClose.toFixed(2),
            percentageTotalAmountClose: calculatedPercentageTotalAmountClose.toFixed(2),
            percentageOrderUpSale: calculatedPercentageOrderUpSale.toFixed(2),
            percentageTotalOrderAdminClose: calculatedPercentageTotalOrderAdminClose.toFixed(2),
        };
    }, [summaryData]);


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

    const formatCurrencyWithFixed = (amount) => {
        if (amount === undefined || amount === null) return '0';

        const number = Number(amount);
        const formattedNumber = number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return `${formattedNumber}`;
    };

    const renderCell = useCallback((data, columnKey) => {
        const cellValue = data[columnKey];

        const isNumber = !isNaN(parseFloat(cellValue)) && isFinite(cellValue);

        if (columnKey === "orderDate") {
            if (cellValue === "รวมทั้งหมด") {
                return <div className="flex justify-center"><p className="text-bold text-sm text-nowrap">{cellValue}</p></div>;
            }

            if (selectedType === 'year') {
                const formattedDate = dayjs(cellValue).format("MMMM YYYY");
                return <div className="flex justify-center"><p className="text-bold text-sm text-nowrap">{formattedDate}</p></div>;
            } else {
                return <div className="flex justify-center"><p className="text-bold text-sm text-nowrap">{formatDate(cellValue)}</p></div>;
            }
        }

        switch (columnKey) {
            case "totalAmount":
                return <div className="flex justify-center"><p className="text-bold text-sm">{formatCurrencyWithFixed(cellValue)}</p></div>;
            case "oldSale":
                return <div className="flex justify-center"><p className="text-bold text-sm">{formatCurrencyWithFixed(cellValue)}</p></div>;
            case "newSale":
                return <div className="flex justify-center"><p className="text-bold text-sm">{formatCurrencyWithFixed(cellValue)}</p></div>;
            case "totalAmountAdmin":
                return <div className="flex justify-center"><p className="text-bold text-sm">{formatCurrencyWithFixed(cellValue)}</p></div>;
            case "totalAmountCRM":
                return <div className="flex justify-center"><p className="text-bold text-sm">{formatCurrencyWithFixed(cellValue)}</p></div>;
            case "totalAds":
                return <div className="flex justify-center"><p className="text-bold text-sm">{formatCurrencyWithFixed(calculateVat(cellValue))}</p></div>;
            case "percentageNewSale":
                return <div className="flex justify-center"><p className="text-bold text-sm">{formatCurrencyWithFixed(calculateVat(cellValue))}%</p></div>;
            case "percentageOldSale":
                return <div className="flex justify-center"><p className="text-bold text-sm">{formatCurrencyWithFixed(calculateVat(cellValue))}%</p></div>;
            case "percentageTotalAmount":
                return <div className="flex justify-center"><p className="text-bold text-sm">{formatCurrencyWithFixed(calculateVat(cellValue))}%</p></div>;
            case "totalUpSale":
                return <div className="flex justify-center"><p className="text-bold text-sm">{formatCurrency(cellValue)}</p></div>;
            case "orderUpSale":
                return <div className="flex justify-center"><p className="text-bold text-sm">{formatCurrencyNoDollars(cellValue)}</p></div>;
            case "oldOrder":
                return <div className="flex justify-center"><p className="text-bold text-sm">{formatCurrencyNoDollars(cellValue)}</p></div>;
            case "totalOrderAdmin":
                return <div className="flex justify-center"><p className="text-bold text-sm">{formatCurrencyNoDollars(cellValue)}</p></div>;
            case "newOrder":
                return <div className="flex justify-center"><p className="text-bold text-sm">{formatCurrencyNoDollars(cellValue)}</p></div>;
            case "totalOrder":
                return <div className="flex justify-center"><p className="text-bold text-sm">{formatCurrencyNoDollars(cellValue)}</p></div>;
            case "newInbox":
                return <div className="flex justify-center"><p className="text-bold text-sm">{formatCurrencyNoDollars(cellValue)}</p></div>;
            case "oldInbox":
                return <div className="flex justify-center"><p className="text-bold text-sm">{formatCurrencyNoDollars(cellValue)}</p></div>;
            case "totalInbox":
                return <div className="flex justify-center"><p className="text-bold text-sm">{formatCurrencyNoDollars(cellValue)}</p></div>;
            case "percentageNewCustomerClose":
                return <div className="flex justify-center"><p className="text-bold text-sm">{formatCurrencyWithFixed(cellValue)}%</p></div>;
            case "percentageTotalAmountClose":
                return <div className="flex justify-center"><p className="text-bold text-sm">{formatCurrencyWithFixed(cellValue)}%</p></div>;
            case "percentageTotalOrderAdminClose":
                return <div className="flex justify-center"><p className="text-bold text-sm">{formatCurrencyWithFixed(cellValue)}%</p></div>;
            case "percentageOrderUpSale":
                return <div className="flex justify-center"><p className="text-bold text-sm">{formatCurrencyWithFixed(cellValue)}%</p></div>;
        }
    }, [selectedType, summaryData]);

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
            <Table
                className="max-h-[720px] overflow-y-auto overflow-x-auto"
                classNames={classNames}
                isHeaderSticky
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
                radius='sm'
                color='primary'
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            className='text-center'
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={sortedItems} emptyContent={"ไม่พบข้อมูล"}
                    loadingState={isLoading ? "loading" : undefined}
                    loadingContent={<Spinner color="primary" />}
                >
                    {sortedItems.map((item, index) => (
                        <TableRow key={index}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    ))}
                    {!isLoading && sortedItems && sortedItems.length > 0 && (
                        <TableRow className="bg-slate-300 border-0 z-10 sticky bottom-0 rounded-lg">
                            {columns.map((column, index) => (
                                <TableCell
                                    key={column.uid}
                                    className="text-center font-bold"
                                    style={{
                                        borderTopLeftRadius: index === 0 ? 4 : 0,
                                        borderBottomLeftRadius: index === 0 ? 4 : 0,
                                        borderTopRightRadius: index === columns.length - 1 ? 4 : 0,
                                        borderBottomRightRadius: index === columns.length - 1 ? 4 : 0,
                                    }}
                                >
                                    {renderCell(totalSum, column.uid)}
                                </TableCell>
                            ))}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

export default tableVeiw;
