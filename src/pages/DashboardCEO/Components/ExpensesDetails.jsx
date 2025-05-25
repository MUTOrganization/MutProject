import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
import { formatNumber } from '@/component/FormatNumber'
import React, { useMemo } from 'react'

function ExpensesDetails({ expensesData, selectExpensesTypeFromChart }) {
    const tableColumns = [
        { key: 'type', label: 'ประเภท' },
        { key: 'name', label: 'รายการ' },
        { key: 'amount', label: 'จำนวนเงิน' },
        { key: 'date', label: 'วันที่' },
    ]

    const filterExpenses = useMemo(() => {
        if (!selectExpensesTypeFromChart) return expensesData
        return expensesData?.filter(item =>
            item?.expensesType?.typeName?.trim() === selectExpensesTypeFromChart.trim()
        )
    }, [expensesData, selectExpensesTypeFromChart])

    const totalAmount = filterExpenses?.reduce((acc, item) => acc + item?.totalAmount, 0) || 0

    return (
        <div className="relative max-h-[400px] overflow-y-auto">
            <Table aria-label="รายการค่าใช้จ่าย" isHeaderSticky removeWrapper>
                <TableHeader columns={tableColumns}>
                    {(column) => <TableColumn key={column.key} className='text-center'>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={filterExpenses} emptyContent={<span>ไม่มีข้อมูล</span>}>
                    {(item) => (
                        <TableRow key={item.expensesId} className='h-12 border-b-1 border-slate-100 sticky bottom-0 bg-white'>
                            <TableCell className='text-center'>{item?.expensesType?.typeName}</TableCell>
                            <TableCell className='text-center'>{item?.remarks}</TableCell>
                            <TableCell className='text-center'>{formatNumber(item?.totalAmount)}</TableCell>
                            <TableCell className='text-center'>
                                {new Date(item?.createdDate).toLocaleDateString('th-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    timeZone: 'Asia/Bangkok'
                                })}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Sticky footer row */}
            <div className="sticky bottom-0 border-t border-gray-200 z-10 bg-slate-50 shadow-md rounded-lg h-12 flex flex-row justify-center items-center">
                <div className="flex flex-row justify-between items-center px-4 py-2 font-medium text-sm w-full px-12">
                    <div className="col-span-1">รวมทั้งหมด ({filterExpenses?.length} รายการ)</div>
                    <div className="col-span-1 space-x-2">
                        <span className='text-red-500'>{formatNumber(totalAmount)}</span>
                        <span className='text-sm text-slate-500'>บาท</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExpensesDetails
