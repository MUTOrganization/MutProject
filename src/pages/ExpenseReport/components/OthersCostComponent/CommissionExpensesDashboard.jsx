import React, { useContext, useEffect, useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import fetchProtectedData from '@/utils/fetchData';
import { CostSummaryData } from '../../TabsExpense/TabsCostSummary';
import { useCommissionContext } from '../../../Commission/CommissionContext';
import { URLS } from '@/config';
import { CommissionData } from '../../../Commission/Components/YearlyContent/CommissionData';
import { Spinner } from "@heroui/react";

function CommissionExpensesDashboard() {
    const { selectedYear, selectedAgent } = useContext(CostSummaryData);
    const { isSettingLoaded } = useCommissionContext();

    const [data, setData] = useState([]);
    const [commissionPercent, setCommissionPercent] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

    // แยก fetch commission settings ออกมาเป็น function แยก
    const fetchCommissionSettings = async () => {
        try {
            const url = `${URLS.setting.getCommissionSettingByBusiness}?businessId=${selectedAgent.id}`;
            const res = await fetchProtectedData.get(url);
            setCommissionPercent(res.data);
        } catch (error) {
            console.error('Error fetching commission settings:', error);
        }
    };

    useEffect(() => {
        fetchCommissionSettings();
    }, [selectedAgent]);

    // แยก fetch commission data ออกมาเป็น function แยก
    const fetchCommissionData = async (controller) => {
        setData([]);
        setIsLoading(true);
        try {
            const res = await fetchProtectedData.post(
                URLS.commission.getFullYear,
                {
                    username: 'all',
                    businessId: selectedAgent.id,
                    year: selectedYear,
                    ownerId: selectedAgent.id,
                },
                { signal: controller.signal }
            );

            const processedData = res.data.map((item) => ({
                ...item,
                data: item.data.map((e) => 
                    new CommissionData(e, {
                        probStatus: item.probStatus,
                        roleId: item.roleId
                    }, commissionPercent)
                )
            }));

            setData(processedData);
        } catch (error) {
            if (!controller.signal.aborted) {
                console.error('Error fetching commission data:', error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        
        if (commissionPercent.length > 0) {
            fetchCommissionData(controller);
        }

        return () => controller.abort();
    }, [commissionPercent, selectedYear, selectedAgent, isSettingLoaded]);

    const monthlyData = useMemo(() => {
        const result = Array(12).fill(0);
        
        data.forEach((item) => {
            item.data.forEach((dataItem) => {
                const monthIndex = dataItem.monthIndex;
                if (monthIndex >= 0 && monthIndex < 12) {
                    result[monthIndex] += parseFloat(dataItem.commission || 0);
                }
            });
        });

        return result.map((val) => parseFloat(val.toFixed(2)));
    }, [data]);

    const chartSeries = useMemo(
        () => [{
            name: 'ค่าคอมมิชชั่น',
            data: monthlyData,
        }],
        [monthlyData]
    );

    const chartOptions = useMemo(
        () => ({
            chart: {
                type: 'bar',
                height: 350,
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                        selection: false,
                        zoom: false,
                        zoomin: false,
                        zoomout: false,
                        pan: false,
                    }
                }
            },
            colors: ['#10b981'],
            plotOptions: {
                bar: {
                    borderRadius: 5,
                    columnWidth: '55%',
                    dataLabels: {
                        position: 'top',
                    },
                },
            },
            dataLabels: {
                enabled: true,
                formatter: (val) => val.toLocaleString(),
                offsetY: -20,
                style: {
                    fontSize: '10px',
                    colors: ['#304758'],
                },
            },
            xaxis: {
                categories: months,
                labels: {
                    style: {
                        fontSize: '10px',
                        fontWeight: 'bold',
                    },
                },
            },
            yaxis: {
                labels: {
                    formatter: (val) => `${val.toLocaleString()} ฿`,
                },
                title: {
                    text: 'จำนวนเงิน (บาท)',
                    style: {
                        fontSize: '12px'
                    }
                }
            },
            tooltip: {
                y: {
                    formatter: (val) => `${val.toLocaleString()} ฿`,
                },
            },
            title: {
                text: 'รายงานค่าคอมมิชชั่นรายเดือน',
                align: 'center',
                style: {
                    fontSize: '16px',
                    fontWeight: 'bold',
                },
            },
        }),
        [months]
    );

    return (
        <div className="flex justify-center items-center w-full shadow-sm rounded-lg bg-white p-4">
            {isLoading ? (
                <div className="flex flex-col items-center space-y-2 p-8">
                    <Spinner size="lg" />
                    <span className="text-gray-600">กำลังโหลดข้อมูล...</span>
                </div>
            ) : (
                <div id="chart" className="text-sm">
                    <ReactApexChart 
                        options={chartOptions} 
                        series={chartSeries} 
                        type="bar" 
                        height={350} 
                        width={750}
                    />
                </div>
            )}
        </div>
    );
}

export default CommissionExpensesDashboard;
