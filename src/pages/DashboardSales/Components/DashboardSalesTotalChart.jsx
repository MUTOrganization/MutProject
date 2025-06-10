import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useDashboardSalesContext } from '../DashboardSalesContext';
import userService from '@/services/userService';
import commissionService from '@/services/commissionService';
import { formatDateObject } from '@/utils/dateUtils';
import { useAppContext } from '@/contexts/AppContext';
import { endOfYear, startOfYear, today } from '@internationalized/date';
import { Spinner } from '@heroui/react';

function DashboardSalesTotalChart() {

    const { currentUser } = useAppContext()
    const { selectAgent, dateMode, date, selectUser, userData, isSuperAdmin } = useDashboardSalesContext()
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

    const [series, setSeries] = useState([
        {
            name: 'ยอดขาย (Admin Income)',
            color: '#A7F3D0',
            data: Array(12).fill(0)
        },
        {
            name: 'ค่าคอมมิชชัน',
            color: '#008FFB',
            data: Array(12).fill(0)
        },
    ]);

    const fetchCommissionData = async () => {
        const monthlyPaidIncome = Array(12).fill(0);
        const monthlyUnpaidIncome = Array(12).fill(0);

        const usernames = getUserParams();
        if (!usernames || usernames.length === 0) return;

        setIsLoading(true)
        try {
            const commissionData = await commissionService.getCommission(selectAgent, usernames, dateMode === 'ปี' ? formatDateObject(date.start) : formatDateObject(dateChart.start), dateMode === 'ปี' ? formatDateObject(date.end) : formatDateObject(dateChart.end));
            setIsLoading(false)

            commissionData.forEach(user => {
                user.data.forEach(item => {
                    const monthIndex = item.monthIndex;
                    monthlyPaidIncome[monthIndex] += Number(item.adminPaidIncome || 0);
                    monthlyUnpaidIncome[monthIndex] += Number(item.adminUnpaid || 0);
                });
            });

            setSeries([
                {
                    name: 'ยอดเงินเข้า',
                    color: '#77DD77',
                    data: monthlyPaidIncome
                },
                {
                    name: 'ยอดเงินยังไม่เข้า',
                    color: '#FF746C',
                    data: monthlyUnpaidIncome
                },
            ]);
        } catch (err) {
            console.log('Can not get Commission Data At DashboardSalesContext', err)
        }
    }

    useEffect(() => {
        fetchCommissionData()
    }, [dateChart, selectAgent, selectUser, userData])

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

    const options = {
        chart: {
            type: 'bar',
            height: 350,
            stacked: true
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        dataLabels: {
            enabled: false,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 5,
                borderRadiusApplication: 'end'
            },
        },
        xaxis: {
            categories: [
                'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
                'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
                'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
            ]
        },
        fill: {
            opacity: 1
        },
        yaxis: {
            labels: {
                formatter: (val) => {
                    return Number(val).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                }
            }
        },
        legend: {
            position: 'bottom',
            clusterGroupedSeriesOrientation: "vertical"
        }
    };

    return (
        <div className='w-full bg-white rounded-lg p-4 shadow-sm h-96'>
            {isLoading ? (
                <div className='flex flex-row justify-center items-center h-full'>
                    <Spinner variant='wave' />
                </div>
            ) : (
                <ReactApexChart options={options} series={series} type="bar" height={350} />
            )}
        </div>
    );
}

export default DashboardSalesTotalChart;
