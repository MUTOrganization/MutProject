import React from 'react'
import { Progress, Select, SelectItem } from '@nextui-org/react'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';


function ViewOKRMonth() {
    const tableColumns = [
        { key: 'task', text: 'ตัวชี้วัด' },
        { key: 'Measuring device', text: '' },
        { key: 'amount', text: 'จำนวน' },
        { key: 'unit', text: 'หน่วย' },
        { key: 'point', text: 'น้ำหนักคะแนน' },
        { key: 'status', text: 'ความคืบหน้า' },
        { key: 'total', text: '' },
    ];

    return (
        <div>
            {/* Loop Task Data */}
            <div className='flex flex-row justify-between items-center text-slate-500 px-2 mb-2 text-sm'>
                <span className='text-slate-500 text-lg'>Task1</span>
                <span className='px-4 py-1 bg-blue-100 text-blue-500 rounded-md text-sm'>20%</span>
            </div>
            <Table aria-label="Example static collection table">
                <TableHeader columns={tableColumns} className="text-center">
                    {(column) => (
                        <TableColumn
                            key={column.name}
                            className={`text-center text-sm`}
                            allowsSorting={true}
                        >
                            {column.text}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody>
                    <TableRow key="1" className='text-slate-500 h-16'>
                        <TableCell className='text-center'>Sub Task1</TableCell>
                        <TableCell className='text-center'><span className='px-2 py-1 bg-blue-100 text-blue-500 rounded-md text-sm'>มากกว่า</span></TableCell>
                        <TableCell className='text-center'>10</TableCell>
                        <TableCell className='text-center'>ครั้ง</TableCell>
                        <TableCell className='text-center' >10%</TableCell>
                        <TableCell>
                            <div>
                                <Progress
                                    className="w-full"
                                    color="primary"
                                    maxValue={100}
                                    size="md"
                                    value={100}
                                />
                            </div></TableCell>
                        <TableCell>10%</TableCell>
                    </TableRow>
                    <TableRow key="2" className='text-slate-500 h-16'>
                        <TableCell className='text-center'>Sub Task2</TableCell>
                        <TableCell className='text-center'><span className='px-2 py-1 bg-blue-100 text-blue-500 rounded-md text-sm'>มากกว่า</span></TableCell>
                        <TableCell className='text-center'>5</TableCell>
                        <TableCell className='text-center'>ครั้ง</TableCell>
                        <TableCell className='text-center' >10%</TableCell>
                        <TableCell>
                            <div>
                                <Progress
                                    className="w-full"
                                    color="primary"
                                    maxValue={100}
                                    size="md"
                                    value={80}
                                />
                            </div></TableCell>
                        <TableCell>8%</TableCell>
                    </TableRow>
                    <TableRow key="3" className='text-slate-500 bg-slate-100 text-slate-500 rounded-lg'>
                        <TableCell className='text-center'>รวม</TableCell>
                        <TableCell className='text-center'></TableCell>
                        <TableCell className='text-center'></TableCell>
                        <TableCell className='text-center'></TableCell>
                        <TableCell className='text-center' ></TableCell>
                        <TableCell className='text-center' ></TableCell>
                        <TableCell>18%</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}

export default ViewOKRMonth
