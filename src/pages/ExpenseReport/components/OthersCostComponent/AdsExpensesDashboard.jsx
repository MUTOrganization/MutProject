import React, { useContext, useEffect, useState, useMemo } from 'react';
import { URLS } from '../../../../config';
import fetchProtectedData from '../../../../../utils/fetchData';
import { CostSummaryData } from '../../TabsExpense/TabsCostSummary';
import ReactApexChart from 'react-apexcharts';
import { Spinner } from '@nextui-org/react';

function AdsExpensesDashboard() {
    const { selectedAgent, selectedYear } = useContext(CostSummaryData);

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);

    // คำนวณ Monthly Data
    const monthlyData = useMemo(() => {
        const result = Array(12).fill(0);
        data.forEach((item) => {
            const date = new Date(item.date_time);
            const month = date.getMonth(); // January is 0

            if (date.getFullYear() === selectedYear) {
                result[month] += item.ads;
            }
        });
        return result;
    }, [data, selectedYear]);

    // ตั้งค่า Chart Data
    const chartData = useMemo(() => ({
        series: [{ name: 'ADS', data: monthlyData }],
        options: {
            chart: {
                height: 350,
                type: 'bar',
            },
            colors: ['#6366f1'],
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
                categories: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
                position: 'bottom',
                axisBorder: { show: false },
                axisTicks: { show: false },
            },
            yaxis: {
                labels: {
                    formatter: (val) => val.toLocaleString(),
                },
            },
            title: {
                text: `ADS ${selectedYear}`,
                position: 'top',
                floating: false,
                offsetY: 0,
                align: 'center',
                style: {
                    color: '#444',
                    fontSize: '16px',
                },
            },
        },
    }), [monthlyData, selectedYear , selectedAgent]);

    // Fetch Data
    const fetchAds = async () => {
        const url = `${URLS.ADSFORM}/getAds`;
        setIsLoading(true);
        try {
            const res = await fetchProtectedData.post(url, {
                teamAds: 'all',
                businessId: selectedAgent.id,
            });
            // Update raw data
            setData(res.data);
        } catch (error) {
            console.log('Something went wrong', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedYear) {
            fetchAds();
        }
    }, [selectedYear, selectedAgent]);

    return (
        <div className="p-4 bg-white flex justify-center items-center w-full shadow-sm">
            {isLoading ? (
                <div className="flex flex-col space-y-2">
                    <Spinner />
                    <span>Loading ADS Data...</span>
                </div>
            ) : (
                <div id="chart" className="w-full text-sm">
                    <ReactApexChart
                        options={chartData.options}
                        series={chartData.series}
                        type="bar"
                        color="#4338ca"
                        height={350}
                        width={750}
                    />
                </div>
            )}
        </div>
    );
}

export default AdsExpensesDashboard;
