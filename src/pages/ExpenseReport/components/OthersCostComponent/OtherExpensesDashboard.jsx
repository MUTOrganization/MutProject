import React, { useContext, useEffect, useState } from 'react';
import { URLS } from '../../../../config';
import fetchProtectedData from '../../../../../utils/fetchData';
import { CostSummaryData } from '../../TabsExpense/TabsCostSummary';
import ReactApexChart from 'react-apexcharts';
import { Select, SelectItem, Spinner, table, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';

function ExpensesDashboard() {
    const { selectedAgent, selectedYear } = useContext(CostSummaryData);
    const [dataExpenses, setDataExpenses] = useState([])
    const tableColumns = [
        { key: 'listType', text: 'ประเภท', className: 'text-center' },
        { key: 'ListName', text: 'รายการ', className: 'text-center' },
        { key: 'total', text: 'ยอดรวม', className: 'text-center' },
        { key: 'note', text: 'หมายเหตุ', className: 'text-center' },
    ];

    const monthsThai = [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
    ];

    const currentMonthIndex = new Date().getMonth();
    const [currentMonths, setCurrentMonth] = useState(currentMonthIndex)

    const [isLoading, setIsLoading] = useState(false);
    const [chartData, setChartData] = useState({
        series: [], // Data for pie chart
        options: {
            chart: {
                type: 'pie',
            },
            labels: [], // Labels for each expense type
            title: {
                text: `ค่าใช้จ่ายอื่นๆ`,
                align: 'center',
                style: {
                    fontSize: '16px',
                    color: '#444',
                },
            },
            tooltip: {
                y: {
                    formatter: (val) => `${val.toFixed(2)} บาท`,
                },
            },
            legend: {
                position: 'bottom',
            },
        },
    });

    const fetchExpenses = async () => {
        const date = new Date()
        const year = date.getFullYear()
        const monthIndex = `${year}-${currentMonths}`

        const url = `${URLS.OTHEREXPENSES}/getOtherExpenses?businessId=${selectedAgent.id}&monthIndex=${monthIndex}`;
        setIsLoading(true);
        try {
            const res = await fetchProtectedData.get(url);
            const data = res.data;
            setDataExpenses(data)
            const expensesByType = {};

            data.forEach((item) => {
                const date = new Date(item.create_Date);
                const year = date.getFullYear();
                const month = date.getMonth();

                const type = item.typeExpenses || 'ไม่ระบุประเภท';
                if (!expensesByType[type]) {
                    expensesByType[type] = 0;
                }
                item.lists.forEach((list) => {
                    const amount = parseFloat(list.totalAmount) || 0;
                    expensesByType[type] += amount;
                });

            });


            const series = Object.values(expensesByType);
            const labels = Object.keys(expensesByType);

            setChartData((prev) => ({
                ...prev,
                series,
                options: {
                    ...prev.options,
                    labels,
                },
            }));
        } catch (error) {
            console.error('Error fetching expenses data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedYear && selectedAgent) {
            fetchExpenses();
        }
    }, [selectedAgent, currentMonths]);

    return (
        <div className='p-4 bg-white w-full shadow-sm mt-4'>
            {isLoading ? (
                <div className='flex justify-center items-center'>
                    <div className='flex flex-col space-y-2 justify-center items-center'>
                        <span><Spinner /></span>
                        <span>Loading OtherExpenses Data...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className='w-2/12 flex justify-end mb-4'>
                        <Select label="เลือกเดือน" color='success' className='w-full' onSelectionChange={(keys) =>
                            setCurrentMonth(parseInt(Array.from(keys).join(""), 10))
                        }
                            disallowEmptySelection
                            selectedKeys={new Set([currentMonths.toString()])} size='sm'>
                            {monthsThai.map((month, index) => (
                                <SelectItem key={index} value={index.toString()} className='text-sm'>
                                    {month}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                    <div className='flex flex-row justify-between'>
                        <div id="chart" className='w-full text-sm h-full'>
                            <ReactApexChart
                                options={chartData.options}
                                series={chartData.series}
                                type="pie"
                                height={350}
                            />
                        </div>
                        <div className='w-full'>
                            <Table className='max-h-[720px] rounded-md overflow-y-auto p-2 overflow-x-auto scrollbar-hide bg-white'>
                                <TableHeader columns={tableColumns}>
                                    {(column) => (
                                        <TableColumn
                                            key={column.name}
                                            className={`text-sm text-center`}
                                            allowsSorting={true}
                                        >
                                            {column.text}
                                        </TableColumn>
                                    )}
                                </TableHeader>
                                <TableBody items={dataExpenses} loadingContent={<Spinner />} emptyContent={'ไม่มีข้อมูลค่าใช้จ่ายในเดือนนี้'}>
                                    {item => (
                                        <TableRow key={item.id} className="hover:bg-slate-50 cursor-pointer text-slate-600 h-12">
                                            <TableCell className='text-center'>{item.typeExpenses}</TableCell>
                                            <TableCell className='text-center'>{item.lists.map(e => e.list).join(',')}</TableCell>
                                            <TableCell className='text-center'>
                                                {new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                                                    item.lists.reduce((sum, entry) => sum + parseFloat(entry.totalAmount || 0), 0)
                                                )}
                                            </TableCell>
                                            <TableCell className='text-center'>{item.remark || '-'}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            <div className='text-end px-6 text-slate-500'>
                                ยอดรวม : {dataExpenses.reduce((totalSum, item) =>
                                    totalSum + item.lists.reduce((sum, data) => sum + Number(data.totalAmount), 0), 0
                                )} บาท
                            </div>
                        </div>
                    </div>
                </>
            )
            }
        </div >
    );
}

export default ExpensesDashboard;
