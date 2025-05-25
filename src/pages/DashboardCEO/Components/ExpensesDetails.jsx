import { formatNumber } from '@/component/FormatNumber'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
import React, { useMemo } from 'react'

function ExpensesDetails({ expensesData, expensesType, selectExpensesTypeFromChart }) {

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

    return (
        <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
            <Table aria-label="Example static collection table" isHeaderSticky removeWrapper>
                <TableHeader columns={tableColumns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={filterExpenses} emptyContent={<span>ไม่มีข้อมูลข้อมูล</span>}>
                    {((item) => (
                        <TableRow key={item?.expensesId} className='h-12 border-b-1 border-slate-100'>
                            <TableCell>{item?.expensesType.typeName}</TableCell>
                            <TableCell>{item?.remarks}</TableCell>
                            <TableCell>{formatNumber(item?.totalAmount)}</TableCell>
                            <TableCell>{new Date(item?.createdDate).toLocaleDateString('th-GB', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Bangkok' })}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default ExpensesDetails
