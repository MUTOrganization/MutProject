import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Spinner, Card, Chip } from "@nextui-org/react";
import columns from '../config';

function TableCRM({ currentMonthData, selectedUsername, selectedTeam, findUsername, isLoading }) {

    const [sortDescriptor, setSortDescriptor] = useState({
        column: "totalAmount",
        direction: "descending",
    });

    const filteredData = useMemo(() => {
        let filtered = currentMonthData;

        // หาก selectedTeam ไม่ได้มี "all" ให้กรองตามทีม
        if (selectedTeam.length > 0 && !selectedTeam.includes("all")) {
            filtered = filtered.filter(item => {
                const team = item.team || "ยังไม่มีทีม";
                return selectedTeam.includes(team) ||
                    (selectedTeam.includes("ยังไม่มีทีม") && !item.team);
            });
        }

        // หาก selectedUsername ไม่ได้มี "all" ให้กรองตาม username
        if (selectedUsername.length > 0 && !selectedUsername.includes("all")) {
            filtered = filtered.filter(item => selectedUsername.includes(item.username));
        }

        if (findUsername && typeof findUsername === 'string') {
            filtered = filtered.filter(user =>
                user.username.toLowerCase().includes(findUsername.toLowerCase())
            );
        }

        return filtered;
    }, [currentMonthData, selectedUsername, selectedTeam, findUsername]);

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
                totalAmount: (sum.totalAmount || 0) + (parseFloat(item.totalAmount) || 0),
                totalOrder: (sum.totalOrder || 0) + (parseFloat(item.totalOrder) || 0),
                oldOrder: (sum.oldOrder || 0) + (parseFloat(item.oldOrder) || 0),
                newOrder: (sum.newOrder || 0) + (parseFloat(item.newOrder) || 0),
                totalUpSale: (sum.totalUpSale || 0) + (parseFloat(item.totalUpSale) || 0),
                totalUpSaleAmount: (sum.totalUpSaleAmount || 0) + (parseFloat(item.totalUpSaleAmount) || 0),
                totalAmountSumUpSale: (sum.totalAmountSumUpSale || 0) + (parseFloat(item.totalAmountSumUpSale) || 0),
                callIn: (sum.callIn || 0) + (parseInt(item.callIn) || 0),
                callOut: (sum.callOut || 0) + (parseInt(item.callOut) || 0),
                totalTime: (sum.totalTime || 0) + (parseFloat(item.totalTime) || 0),
                averageTime: (sum.averageTime || 0) + (parseFloat(item.averageTime) || 0),
            };
        }, {});
    }, [filteredData]);

    const handleSortChange = (column) => {
        const newDirection =
            sortDescriptor.column === column && sortDescriptor.direction === 'ascending'
                ? 'descending'
                : 'ascending';

        setSortDescriptor({ column, direction: newDirection });
    };

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return 'N/A';
        const number = Number(amount);
        const formattedNumber = number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return `฿${formattedNumber}`;
    };

    const formatCurrencyNoDollars = (amount) => {
        if (amount === undefined || amount === null) return 'N/A';

        const number = Number(amount);
        const formattedNumber = number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return `${formattedNumber}`;
    };

    const formatCurrencyNoDollars2Fixed = (amount) => {
        if (amount === undefined || amount === null) return '0';

        const number = Number(amount);
        const formattedNumber = number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return `${formattedNumber}`;
    };

    const renderCell = useCallback((data, columnKey, isFirstColumn) => {
        const cellValue = data[columnKey];
        const isNumber = !isNaN(parseFloat(cellValue)) && isFinite(cellValue);

        const cellClass = isFirstColumn
            ? "flex justify-start items-center" // จัดให้อยู่ซ้ายสุดในคอลัมน์แรก
            : "flex justify-center items-center"; // คอลัมน์อื่นอยู่ตรงกลาง

        switch (columnKey) {
            case "username":
                return (
                    <div className={cellClass}>
                        <p className="text-bold text-sm">{cellValue}</p>
                    </div>
                );
            case "team":
                return (
                    <div className="flex justify-center items-center">
                        <p className="text-bold text-sm">
                            <Chip color="primary" variant="flat">
                                {cellValue || 'ยังไม่มีทีม'}
                            </Chip>
                        </p>
                    </div>
                );
            case "totalAmountSumUpSale":
            case "totalAmount":
            case "totalUpSaleAmount":
                return (
                    <div className="flex justify-center items-center">
                        <p className="text-bold text-sm">
                            {isNumber ? formatCurrency(cellValue) : cellValue}
                        </p>
                    </div>
                );
            case "oldSale":
            case "newSale":
            case "oldOrder":
            case "newOrder":
            case "totalOrder":
            case "totalUpSale":
            case "callIn":
            case "callOut":
                return (
                    <div className="flex justify-center items-center">
                        <p className="text-bold text-sm">
                            {isNumber ? formatCurrencyNoDollars(cellValue) : cellValue}
                        </p>
                    </div>
                );
            case "totalTime":
            case "averageTime":
                return (
                    <div className="flex justify-center items-center">
                        <p className="text-bold text-sm">
                            {isNumber ? formatCurrencyNoDollars2Fixed(cellValue) : cellValue}
                        </p>
                    </div>
                );
            default:
                return (
                    <div className={cellClass}>
                        <p className="text-sm">
                            {isNumber ? cellValue : String(cellValue)}
                        </p>
                    </div>
                );
        }
    }, []);

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
            "border-gray-100",
            "text-center",
            "group-hover:bg-blue-50",
        ],
    }), []);

    return (
        <Card shadow="none" radius="sm" className='p-2'>
            <Table
                aria-label="ยังไม่มีข้อมูล"
                classNames={classNames}
                className="max-h-[680px] overflow-y-auto scrollbar-hide"
                isHeaderSticky
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
                shadow='none'
                removeWrapper
            >
                <TableHeader columns={columns} className="text-center">
                    {columns.map((column, index) => (
                        <TableColumn
                            key={column.uid}
                            className={`text-sm ${index === 0 ? 'text-start' : 'text-center'}`}
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    ))}
                </TableHeader>
                <TableBody
                    items={sortedItems}
                    emptyContent="ไม่พบข้อมูล"
                    loadingState={isLoading ? "loading" : undefined}
                    loadingContent={<Spinner color="primary" />}
                >
                    {sortedItems.map((item, index) => (
                        <TableRow key={index}>
                            {columns.map((column, colIndex) => (
                                <TableCell key={colIndex}>
                                    {renderCell(item, column.uid, colIndex === 0)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                    {!isLoading && sortedItems && sortedItems.length > 0 && (
                        <TableRow className="bg-slate-200 border-0 z-10 sticky bottom-0 rounded-lg">
                            <TableCell className="text-center font-bold" style={{ borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}>รวมทั้งหมด</TableCell>
                            <TableCell className="text-center font-bold"></TableCell>
                            <TableCell className="text-center font-bold">{formatCurrency(totalSum.totalAmountSumUpSale)}</TableCell>
                            <TableCell className="text-center font-bold">{formatCurrency(totalSum.totalAmount)}</TableCell>
                            <TableCell className="text-center font-bold">{formatCurrencyNoDollars(totalSum.totalOrder)}</TableCell>
                            <TableCell className="text-center font-bold">{formatCurrencyNoDollars(totalSum.oldOrder)}</TableCell>
                            <TableCell className="text-center font-bold">{formatCurrencyNoDollars(totalSum.newOrder)}</TableCell>
                            <TableCell className="text-center font-bold">{formatCurrencyNoDollars(totalSum.totalUpSale)}</TableCell>
                            <TableCell className="text-center font-bold" style={{ borderTopRightRadius: 4, borderBottomRightRadius: 4 }}>{formatCurrencyNoDollars2Fixed(totalSum.totalUpSaleAmount)}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Card>
    );
}

export default TableCRM;
