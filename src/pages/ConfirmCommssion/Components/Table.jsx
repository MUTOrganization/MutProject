import React from 'react'
import { formatNumber } from '../../../component/FormatNumber'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { Spinner, Tooltip } from '@nextui-org/react';
import { calculate } from '../../../component/Calculate';

function TableCom({ selectedKeys, handleSelectionChange, selectAgent, isLoading, data, sortedCommissionDetails, isUserInConfirmCommission, handleOpenModal }) {

    const tableColumns = [
        { key: 'username', text: 'รหัส', className: 'text-center' },
        { key: 'teams', text: 'ทีม', className: 'text-center' },
        { key: 'paidIncome', text: 'ยอดเงินเข้า', className: 'text-center' },
        { key: 'liftIncome', text: 'ยอดยก', className: 'text-center' },
        { key: 'nextLiftIncome', text: 'ยอดยกไปเดือนหน้า', className: 'text-center' },
        { key: 'delivery', text: 'ค่าส่งสุทธิ', className: 'text-center' },
        { key: 'liftDelivery', text: 'ยอดยกค่าส่ง', className: 'text-center' },
        { key: 'nextLiftDelivery', text: 'ยอดยกค่าส่งไปเดือนหน้า', className: 'text-center' },
        { key: 'totalIncome', text: 'ยอดเงินเข้าสุทธิ', className: 'text-center' },
        { key: 'totalDelivery', text: 'ยอดค่าส่งสุทธิ', className: 'text-center' },
        { key: 'netIncome', text: 'ยอดเงินสุทธิ', className: 'text-center' },
        { key: 'findAmount', text: 'ค่าปรับ', className: 'text-center' },
        { key: 'commission', text: 'ค่าคอม', className: 'text-center' },
        { key: 'Ict', text: 'Incentive', className: 'text-center' },
    ];
    console.log(data)
    return (
        <div className=''>
            <Table aria-label="Example static collection table" radius='sm' className='max-h-[720px] rounded-md overflow-y-auto p-2 overflow-x-auto scrollbar-hide bg-white'
                shadow='none'
                isHeaderSticky
                removeWrapper
                selectionMode="multiple"
                selectedKeys={selectedKeys}
                onSelectionChange={handleSelectionChange}
            >
                <TableHeader columns={tableColumns} className="text-center">
                    {(column) => (
                        <TableColumn
                            key={column.name}
                            className={`text-sm ${column.name === 'username' ? 'text-start' : 'text-end'}`}
                            allowsSorting={true}
                        >
                            {column.text}
                        </TableColumn>
                    )}
                </TableHeader>

                <TableBody isLoading={isLoading && sortedCommissionDetails.length > 0}
                    loadingContent={
                        <div className="absolute inset-0 flex items-center h-full justify-center bg-white/80 z-50">
                            <Spinner label="Loading..." />
                        </div>}
                    // items={sortedCommissionDetails}
                    emptyContent={!isLoading && sortedCommissionDetails.length === 0 && 'ไม่พบข้อมูล'}
                >
                    {sortedCommissionDetails.length > 0 && !isLoading && selectAgent !== 1 && sortedCommissionDetails.map((e, index) => (
                        <TableRow
                            key={`${e.username}-${index}`}
                            className={`h-12 hover:bg-slate-200 rounded-xl cursor-pointer text-slate-600  ${isUserInConfirmCommission(e.username) ? 'bg-green-100 text-green-500' : ''}`}
                            onClick={() => handleOpenModal(e)}
                        >
                            <TableCell className='text-center'>{e.username}</TableCell>
                            <TableCell className='text-center'>{e?.teamName}</TableCell>
                            <TableCell className='text-center'>{formatNumber(calculate("+", e.data.adminPaidIncome, e.data.upsalePaidIncome)) || 0}</TableCell>
                            <TableCell className='text-center'>{formatNumber(calculate("+", e.data.adminLiftIncome, e.data.upsaleLiftIncome)) || 0}</TableCell>
                            <TableCell className='text-center'>
                                <Tooltip content={`เข้าแล้ว ${formatNumber(calculate("+", e.data.adminNextLiftIncome, e.data.upsaleNextLiftIncome))} / ${formatNumber(calculate("+", e.data.adminNextLiftIncome, e.data.upsaleNextLiftIncome, e.data.adminUnpaid, e.data.upsaleUnpaid))}`} showArrow={true}>
                                    <span tooltip='' className='bg-blue-200 px-3 rounded-xl text-blue-500 py-0.5'>
                                        {formatNumber(calculate("+", e.data.adminNextLiftIncome, e.data.upsaleNextLiftIncome))}
                                    </span>
                                </Tooltip>
                            </TableCell>
                            <TableCell className='text-center'>{formatNumber(calculate("+", e.data.adminDelivery, e.data.upsaleDelivery)) || 0}</TableCell>
                            <TableCell className='text-center'>{formatNumber(calculate("+", e.data.adminLiftDelivery, e.data.upsaleLiftDelivery)) || 0}</TableCell>
                            <TableCell className='text-center'>
                                <span className='bg-green-200 px-3 rounded-xl text-green-500 py-0.5'>
                                    {formatNumber(calculate("+", e.data.adminNextLiftDelivery, e.data.upsaleNextLiftDelivery))}
                                </span>
                            </TableCell>
                            <TableCell className='text-center'>{formatNumber(calculate("+", calculate("+", e.data.adminPaidIncome, e.data.upsalePaidIncome), calculate("+", parseFloat(e.data.adminLiftIncome) || 0, parseFloat(e.data.upsaleLiftIncome) || 0))) || 0}</TableCell>
                            <TableCell className='text-center'>{formatNumber(calculate("+", calculate("+", e.data.adminDelivery, e.data.upsaleDelivery), calculate("+", e.data.adminLiftDelivery, e.data.upsaleLiftDelivery))) || 0}</TableCell>
                            <TableCell className='text-center'>{formatNumber(e.data.netIncome) || 0}</TableCell>
                            <TableCell className='text-center'>{formatNumber(e.data.finedAmount) || 0}</TableCell>
                            <TableCell className='text-center'>{formatNumber(e.data.commission) || 0}</TableCell>
                            <TableCell className='text-center'>{formatNumber(e.data.incentive) || 0}</TableCell>
                        </TableRow>
                    ))}
                    {sortedCommissionDetails.length > 0 && selectAgent !== 1 && (
                        <TableRow aria-disabled className="sticky bottom-0 bg-slate-100 border-0 z-10 rounded-lg h-12 shadow-md">
                            <TableCell className="font-bold text-center">รวม</TableCell>
                            <TableCell className="text-slate-600 font-bold text-center"></TableCell>
                            <TableCell className="text-slate-600 font-bold text-center">
                                {formatNumber(
                                    sortedCommissionDetails.reduce(
                                        (sum, item) => sum + (parseFloat(calculate("+", item.data.adminPaidIncome, item.data.upsalePaidIncome)) || 0),
                                        0
                                    )
                                )}
                            </TableCell>
                            <TableCell className="text-slate-600 font-bold text-center">
                                {formatNumber(
                                    sortedCommissionDetails.reduce(
                                        (sum, item) => sum + (parseFloat(calculate("+", item.data.adminLiftIncome, item.data.upsaleLiftIncome)) || 0),
                                        0
                                    )
                                )}
                            </TableCell>
                            <TableCell className="text-slate-600 font-bold text-center">
                                <span className='bg-blue-200 px-3 rounded-xl text-blue-500 py-0.5'>
                                    {formatNumber(
                                        sortedCommissionDetails.reduce(
                                            (sum, item) => sum + (parseFloat(calculate("+", item.data.adminNextLiftIncome, item.data.upsaleNextLiftIncome)) || 0),
                                            0
                                        )
                                    )}
                                </span>
                            </TableCell>
                            <TableCell className="text-slate-600 font-bold text-center">
                                {formatNumber(
                                    sortedCommissionDetails.reduce(
                                        (sum, item) => sum + (parseFloat(calculate("+", item.data.adminDelivery, item.data.upsaleDelivery)) || 0),
                                        0
                                    )
                                )}
                            </TableCell>
                            <TableCell className="text-slate-600 font-bold text-center">
                                {formatNumber(
                                    sortedCommissionDetails.reduce(
                                        (sum, item) => sum + (parseFloat(calculate("+", item.data.adminLiftDelivery, item.data.upsaleLiftDelivery)) || 0),
                                        0
                                    )
                                )}
                            </TableCell>
                            <TableCell className="text-slate-600 font-bold text-center">
                                <span className='bg-blue-200 px-3 rounded-xl text-blue-500 py-0.5'>
                                    {formatNumber(
                                        sortedCommissionDetails.reduce(
                                            (sum, item) => sum + (parseFloat(calculate("+", item.data.adminNextLiftDelivery, item.data.upsaleNextLiftDelivery)) || 0),
                                            0
                                        )
                                    )}
                                </span>
                            </TableCell>
                            <TableCell className="text-slate-600 font-bold text-center">
                                {formatNumber(
                                    sortedCommissionDetails.reduce(
                                        (sum, item) => sum + (parseFloat(calculate("+", calculate("+", item.data.adminPaidIncome, item.data.upsalePaidIncome), calculate("+", parseFloat(item.data.adminLiftIncome) || 0, parseFloat(item.data.upsaleLiftIncome) || 0))) || 0),
                                        0
                                    )
                                )}
                            </TableCell>
                            {/* ยอดค่าส่งสุทธิ */}
                            <TableCell className="text-slate-600 font-bold text-center">
                                {formatNumber(
                                    sortedCommissionDetails.reduce(
                                        (sum, item) => sum + (parseFloat(calculate("+", calculate("+", item.data.adminDelivery, item.data.upsaleDelivery), calculate("+", item.data.adminLiftDelivery, item.data.upsaleLiftDelivery))) || 0),
                                        0
                                    )
                                )}
                            </TableCell>
                            <TableCell className="text-slate-600 font-bold text-center">
                                {formatNumber(
                                    sortedCommissionDetails.reduce(
                                        (sum, item) => sum + (parseFloat(calculate("+", item.data.netIncome, item.data.finedAmount)) || 0),
                                        0
                                    )
                                )}
                            </TableCell>
                            <TableCell className="text-slate-600 font-bold text-center">
                                {formatNumber(
                                    sortedCommissionDetails.reduce(
                                        (sum, item) => sum + (parseFloat(item.data.finedAmount) || 0),
                                        0
                                    )
                                )}
                            </TableCell>
                            <TableCell className="text-slate-600 font-bold text-center">
                                {formatNumber(
                                    sortedCommissionDetails.reduce(
                                        (sum, item) => sum + (parseFloat(item.data.commission) || 0),
                                        0
                                    )
                                )}
                            </TableCell>
                            <TableCell className="text-slate-600 font-bold text-center">
                                {formatNumber(
                                    sortedCommissionDetails.reduce(
                                        (sum, item) => sum + (parseFloat(item.data.incentive) || 0),
                                        0
                                    )
                                )}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default TableCom
