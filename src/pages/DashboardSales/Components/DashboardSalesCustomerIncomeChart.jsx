import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useDashboardSalesContext } from '../DashboardSalesContext';
import { useAppContext } from '@/contexts/AppContext';
import { endOfYear, startOfYear, today } from '@internationalized/date';
import commissionService from '@/services/commissionService';
import userService from '@/services/userService';
import { formatDateObject } from '@/utils/dateUtils';
import { Spinner } from '@heroui/react';

function DashboardSalesCustomerIncomeChart() {

    const { currentUser } = useAppContext()
    const { selectAgent, dateMode, date, isSuperAdmin, userData, selectUser } = useDashboardSalesContext()
    const [isLoading, setIsLoading] = useState(false)

    const [dateChart, setDateChart] = useState({
        start: startOfYear(today()),
        end: endOfYear(today())
    })

    const getUserParams = () => {
        if (!userData || userData.length === 0) return [];

        if (isSuperAdmin) {
            if (selectUser === 'ทั้งหมด') {
                return userData.map(u => u.username);
            } else {
                return Array.isArray(selectUser) ? selectUser : [selectUser];
            }
        } else {
            return [currentUser.username];
        }
    }

    const fetchCommissionData = async () => {
        const oldIncome = Array(12).fill(0);
        const newIncome = Array(12).fill(0);

        const usernames = getUserParams();
        if (!usernames || usernames.length === 0) return;

        setIsLoading(true)
        try {
            const commissionData = await commissionService.getCommission(selectAgent, usernames, dateMode === 'ปี' ? formatDateObject(date.start) : formatDateObject(dateChart.start), dateMode === 'ปี' ? formatDateObject(date.end) : formatDateObject(dateChart.end));
            setIsLoading(false)

            commissionData.forEach(user => {
                user.data.forEach(item => {
                    const month = item.monthIndex - 1;
                    oldIncome[month] += Number(item.oldCustomerIncome || 0);
                    newIncome[month] += Number(item.newCustomerIncome || 0);
                });
            });

            setSeries([
                {
                    name: "ลูกค้าเก่า (Old Customer)",
                    data: oldIncome
                },
                {
                    name: "ลูกค้าใหม่ (New Customer)",
                    data: newIncome
                }
            ]);
        } catch (err) {
            console.log('Can not get Commission Data At DashboardSalesContext', err)
        }
    }

    useEffect(() => {
        fetchCommissionData()
    }, [dateChart, selectAgent, userData])

    useEffect(() => {
        if (dateMode === 'ปี') {
            fetchCommissionData()
        }
    }, [dateMode, date])

    useEffect(() => {
        if (dateMode === 'เดือน') {
            setDateChart({
                start: startOfYear(today()),
                end: endOfYear(today())
            })
        }
    }, [dateMode])

    const [series, setSeries] = useState([
        {
            name: "ลูกค้าเก่า (Old Customer)",
            data: Array(12).fill(0)
        },
        {
            name: "ลูกค้าใหม่ (New Customer)",
            data: Array(12).fill(0)
        }
    ]);

    const options = {
        chart: {
            height: 350,
            type: 'line',
            dropShadow: {
                enabled: true,
                color: '#000',
                top: 10,
                left: 5,
                blur: 6,
                opacity: 0.2
            },
            zoom: { enabled: false },
            toolbar: { show: false }
        },
        colors: ['#00C49F', '#008FFB'],
        dataLabels: {
            enabled: true,
            formatter: (val) => val > 0 ? val.toLocaleString() : ''
        },
        stroke: {
            curve: 'smooth'
        },
        title: {
            text: 'รายได้ลูกค้าเก่า vs ลูกค้าใหม่ รายเดือน',
            align: 'left'
        },
        grid: {
            borderColor: '#e7e7e7',
            row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5
            },
        },
        markers: {
            size: 3
        },
        xaxis: {
            categories: [
                'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
                'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
                'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
            ],
            title: {
                text: 'เดือน'
            }
        },
        yaxis: {
            title: {
                text: 'ยอดขาย (บาท)'
            },
            labels: {
                formatter: (val) => val.toLocaleString()
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            floating: false,
            offsetY: 0,
            offsetX: 0
        }
    };

    return (
        <div className='w-full bg-white rounded-lg p-4 shadow-sm h-96'>
            {isLoading ? (
                <div className='flex justify-center items-center h-full'>
                    <Spinner variant='wave' />
                </div>
            ) : (
                <ReactApexChart options={options} series={series} type="line" height={350} />
            )}
        </div>
    );
}

export default DashboardSalesCustomerIncomeChart;
