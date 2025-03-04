import React from 'react'
import { Image, Progress, Select, SelectItem } from '@nextui-org/react'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';

function Box1({ thisYear, firstYear, selectYear, setSelectYear, isSwitch }) {

    const months = [
        'มกราคม',
        'กุมภาพันธ์',
        'มีนาคม',
        'เมษายน',
        'พฤษภาคม',
        'มิถุนายน',
        'กรกฎาคม',
        'สิงหาคม',
        'กันยายน',
        'ตุลาคม',
        'พฤศจิกายน',
        'ธันวาคม'
    ]

    const tableColumns = [
        { key: 'month', text: 'เดือน' },
        { key: 'point', text: 'คะแนน' },
        { key: 'grade', text: 'เกรด' },
    ];

    return (
        <div className='lg:w-5/12 md:w-full w-full bg-white p-5 border-2 border-slate-100 rounded-md h-full'>
            {/* header */}
            <div className='profile flex flex-row items-start space-x-4'>
                <div className='image lg:w-4/12 lg:h-32 md:w-2/12 md:h-32 w-2/12 h-24 rounded-md bg-slate-300 flex items-center justify-center'>Imagse</div>
                <div className=''>
                    <div className='mt-4 space-x-3'>
                        <span className='text-lg text-slate-500'>HF000_TEST</span>
                        <span className='px-4 py-0.5 bg-blue-100 text-blue-500 rounded-md text-sm'>CRM</span>
                        <span className='px-4 py-0.5 bg-yellow-100 text-yellow-500 rounded-md text-sm'>Staff</span>
                    </div>
                    <div className='mt-2'>
                        <span className='text-sm text-slate-500'>Username</span>
                    </div>
                </div>
            </div>

            <hr className='my-6' />


            {/* Filtering Data */}
            <div>
                {!isSwitch && (
                    <div className='filtering Data flex flex-row items-center justify-between'>
                        <Select color='' defaultSelectedKeys={[(new Date().getMonth()).toString()]} className="w-40">
                            {months.map((month, index) => (
                                <SelectItem key={index} value={index.toString()}>
                                    {month}
                                </SelectItem>
                            ))}
                        </Select>

                        <Select aria-label='year selector' placeholder='เลือกปี'
                            selectedKeys={[selectYear + '']}
                            onChange={(e) => setSelectYear(Number(e.target.value))}
                            size='sm'
                            color=''
                            disallowEmptySelection
                            className='w-32'
                        >
                            {[...Array(thisYear - firstYear + 1).keys()].map(e => {
                                return <SelectItem key={thisYear - e} textValue={thisYear - e}>{thisYear - e}</SelectItem>
                            })}
                        </Select>
                    </div>
                )}

                {/* Progress Bar */}
                <div className='mt-6'>
                    <div className='flex flex-row justify-between items-center w-full text-slate-500 pb-1'>
                        <span>ภาพรวม</span>
                        <span>100%</span>
                    </div>
                    <Progress
                        className="w-full"
                        color="warning"
                        maxValue={100}
                        size="sm"
                        value={100}
                    />
                </div>

                {/* Task */}
                {isSwitch ? (
                    <div className='mt-6'>
                        <Table removeWrapper aria-label="Example static collection table">
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
                                {months.map((month, index) => (
                                    <TableRow key={month + 1} className="text-slate-500">
                                        <TableCell className="text-center">{month}</TableCell>
                                        <TableCell className="text-center">0</TableCell>
                                        <TableCell className="text-center">F</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className='mt-8 text-sm'>
                        <div>
                            <div>
                                <span className='text-lg text-slate-600'>เป้าหมาย</span>
                            </div>
                            <div className='border-1 border-slate-300 rounded-md text-slate-500 px-2 py-1.5 mt-3 flex flex-row justify-between items-center'>
                                <span>Task 1</span>
                                <span>20%</span>
                            </div>
                            <div className='border-1 border-slate-300 rounded-md text-slate-500 px-2 py-1.5 mt-3 flex flex-row justify-between items-center'>
                                <span>Task 2</span>
                                <span>10%</span>
                            </div>
                            <div className='border-1 border-slate-300 rounded-md text-slate-500 px-2 py-1.5 mt-3 flex flex-row justify-between items-center'>
                                <span>Task 3</span>
                                <span>70%</span>
                            </div>
                        </div>
                        <div className='mt-4 flex flex-row justify-between items-center px-2 text-slate-700 bg-slate-100 rounded-md py-2'>
                            <span>รวม</span>
                            <span>100%</span>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Box1
