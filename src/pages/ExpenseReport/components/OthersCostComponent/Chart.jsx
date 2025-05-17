import React, { useContext, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { URLS } from '@/config';
import fetchProtectedData from '@/utils/fetchData';
import { Select, SelectItem, Spinner } from "@heroui/react";
import { CommissionData, sumCommissionData } from '../../../Commission/Components/YearlyContent/CommissionData';
import { useCommissionContext } from '../../../Commission/CommissionContext';
import { CostSummaryData } from '../../TabsExpense/TabsCostSummary';

function Chart() {
    const { dateRange, selectAgentFromModal, selectedAgent } = useContext(CostSummaryData)
    const { isSettingLoaded } = useCommissionContext();

    const [chartOptions, setChartOptions] = useState({});
    const [chartSeries, setChartSeries] = useState([]);

    const months = ['ม.ค', 'ก.พ', 'มี.ค', 'เม.ย', 'พ.ค', 'มิ.ย', 'ก.ค', 'ส.ค', 'ก.ย', 'ต.ค', 'พ.ย', 'ธ.ค'];


    const [otherExpensesChart, setOtherExpensesChart] = useState([]);
    const [adsExpensesChart, setAdsExpensesChart] = useState([])
    const [commissionChart, setCommissionChart] = useState([]);

    const thisYear = new Date().getFullYear();
    const firstYear = 2019;
    const [selectedYear, setSelectedYear] = useState(thisYear);

    const [isLoading, setIsLoading] = useState(false)

    const [commissionPercent, setCommissionPercent] = useState([]);

    useEffect(() => {
        const getCommissionSettings = async () => {
            try {
                const url = `${URLS.commission.commissionSetting}?businessId=${selectAgentFromModal}`;
                const res = await fetchProtectedData.get(url);
                setCommissionPercent(res.data);
            } catch (error) {
                console.log('Error fetching commission settings:', error);
            }
        };
        getCommissionSettings();
    }, [selectAgentFromModal])

    const fetchAllData = async (controller) => {
        const urlCom = `${URLS.commission.getFullYear}`;
        const urlOtherExpenses = `${URLS.OTHEREXPENSES}/getOtherExpenses?businessId=${selectAgentFromModal}&year=${selectedYear}`;
        const urlAds = `${URLS.ADSFORM}/getAds`
        setIsLoading(true)
        try {
            const [comm, other, ads] = await Promise.all([
                // Commission
                fetchProtectedData.post(urlCom, {
                    username: 'all',
                    businessId: selectAgentFromModal,
                    year: selectedYear,
                    ownerId: selectedAgent.id
                }, { signal: controller.signal }),
                fetchProtectedData.get(urlOtherExpenses), //OtherExpenses
                fetchProtectedData.post(urlAds, {
                    teamAds: 'all',
                    businessId: selectAgentFromModal,
                }) // OtherExpenses
            ])
            const dataCom = comm.data.map(item => {
                const userStatus = {
                    probStatus: item.probStatus,
                    departmentName: item.depName,
                    roleName: item.roleName
                }
                const commDataSet = item.data.map(e => new CommissionData(e, userStatus, commissionPercent));
                // const userSum = sumCommissionData(commDataSet);
                return {
                    ...item,
                    data: commDataSet,
                }
            });

            setCommissionChart(dataCom)
            setOtherExpensesChart(other.data)
            setAdsExpensesChart(ads.data)
            setIsLoading(false);
        } catch (error) {
            // console.log('Chart Error', error)
        } finally {
        }
    }
    console.log(commissionChart)
    useEffect(() => {
        setCommissionChart([])
        setOtherExpensesChart([])
        setAdsExpensesChart([])
        if (!isSettingLoaded) return;
        const controller = new AbortController();
        fetchAllData(controller);
        return () => {
            controller.abort();
        };
    }, [commissionPercent, selectedYear, selectAgentFromModal, isSettingLoaded]);
    console.log(commissionChart)

    useEffect(() => {
        const adsData = {};
        const commissionDataByMonth = {};
        const otherExpensesData = {};

        adsExpensesChart.forEach((item) => {
            const date = new Date(item.date_time);
            if (date.getFullYear() === selectedYear) {
                const month = `${selectedYear}-${date.getMonth() + 1}`;
                if (!adsData[month]) adsData[month] = 0;
                adsData[month] += parseFloat(item.ads || 0);
            }
        });

        commissionChart.forEach((item) => {
            item.data.forEach((dataItem) => {
                const monthDate = new Date(dataItem.month); // แปลงเป็น Date object
                if (monthDate.getFullYear() === selectedYear) {
                    const monthKey = `${selectedYear}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;
        
                    if (!commissionDataByMonth[monthKey]) commissionDataByMonth[monthKey] = 0;
                    commissionDataByMonth[monthKey] += parseFloat(dataItem.commission || 0);
                }
            });
        });
        
        otherExpensesChart.forEach((item) => {
            const date = new Date(item.create_Date);
            if (date.getFullYear() === selectedYear) {
                const month = `${selectedYear}-${date.getMonth() + 1}`;
                if (!otherExpensesData[month]) otherExpensesData[month] = 0;

                item.lists.forEach((list) => {
                    otherExpensesData[month] += parseFloat(list.totalAmount || 0);
                });
            }
        });

        const allMonths = Array.from({ length: 12 }, (_, i) => `${selectedYear}-${i + 1}`);
        const adsArray = allMonths.map((month) => adsData[month] || 0);
        const commissionArray = allMonths.map((month) => commissionDataByMonth[month] || 0);
        const otherExpensesArray = allMonths.map((month) => otherExpensesData[month] || 0);

        // ตั้งค่าข้อมูล series
        setChartSeries([
            {
                name: 'ค่าแอด',
                data: adsArray.map((val) => parseFloat(val.toFixed(2))),
            },
            {
                name: 'ค่าคอมมิชชั่น',
                data: commissionArray.map((val) => parseFloat(val.toFixed(2))),
            },
            {
                name: 'ค่าใช้จ่ายอื่นๆ',
                data: otherExpensesArray.map((val) => parseFloat(val.toFixed(2))),
            },
        ]);

        // ตั้งค่ากราฟ
        setChartOptions({
            chart: {
                type: 'bar',
                height: 350,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 5,
                    endingShape: 'rounded',
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent'],
            },
            xaxis: {
                categories: months, // แสดงเฉพาะชื่อเดือน
                labels: {
                    style: {
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                    },
                },
            },
            yaxis: {
                labels: {
                    formatter: function (val) {
                        return `${val.toLocaleString()} ฿`;
                    },
                },
                title: {
                    text: 'ค่าใช้จ่าย (บาท)',
                },
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return `${val.toLocaleString()} ฿`; // แสดงค่าในแกน Y พร้อมสกุลเงิน
                    },
                },
                x: {
                    formatter: function (val, opts) {
                        const month = opts.dataPointIndex + 1; // ดึง index ของเดือนที่คลิก
                        const seriesTotals = opts.series.reduce((total, series) => total + series[opts.dataPointIndex], 0); // รวมค่าทั้งหมดในจุดนั้น
                        return `เดือน ${months[opts.dataPointIndex]}<br>รวม: ${seriesTotals.toLocaleString()} ฿`; // แสดงเดือนพร้อมยอดรวม
                    },
                },
            },
            fill: {
                opacity: 1,
            },
        });
    }, [adsExpensesChart, commissionChart, otherExpensesChart, selectedYear, selectAgentFromModal, commissionPercent]);
    console.log(chartSeries)
    // #region RETURN
    return (
        <div className='mt-4'>
            <Select aria-label='year selector' placeholder='เลือกปี'
                selectedKeys={[selectedYear + '']}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                size='sm'
                color='success'
                disallowEmptySelection
                className='w-32 ms-5'
            >
                {[...Array(thisYear - firstYear + 1).keys()].map(e => {
                    return <SelectItem key={thisYear - e} textValue={thisYear - e}>{thisYear - e}</SelectItem>
                })}
            </Select>
            {commissionChart.length > 0 && adsExpensesChart.length > 0 && otherExpensesChart.length > 0 ? (
                <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={350} />
            ) : (
                <>
                    <div className='flex justify-center items-center flex-col'>
                        <Spinner />
                        <span>Loading All Expenses Data...</span>
                    </div>
                </>
            )}
            <div>
            </div>
        </div>
    );
}

export default Chart;
