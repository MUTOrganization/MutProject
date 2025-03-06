import React, { useState, useEffect, useMemo } from 'react';
import Chart from 'react-apexcharts';
import {
    Card,
    Spinner,
    Divider,
    CardBody,
    Switch,
    cn
} from '@nextui-org/react';
import fetchProtectedData from '../../../../utils/fetchData';
import { URLS } from '../../../config';
import {
    formatCurrencyNoDollars,
    formatCurrencyNoDollarsWithFixed,
} from '@/pages/DashboardOverView/utils/currencyUtils';

function getComparisonColor(current, last) {
    if (current > last) return "text-green-600";
    if (current < last) return "text-red-600";
    return "text-gray-500";
}

function getDifference(
    currentValue,
    lastValue,
    formatFunction = formatCurrencyNoDollarsWithFixed
) {
    const current = parseFloat(currentValue) || 0;
    const last = parseFloat(lastValue) || 0;
    const diff = current - last;

    const arrow = diff > 0 ? "▲" : diff < 0 ? "▼" : "";
    const color = getComparisonColor(current, last);
    const formattedDifference = formatFunction(Math.abs(diff));

    return { arrow, color, formattedDifference };
}

function mergeData(currentArray, lastArray) {
    const merged = {};

    currentArray.forEach(item => {
        merged[item.category] = {
            category: item.category,
            description: item.description,
            currentPrice: parseFloat(item.totalPrice) || 0,
            currentCount: parseInt(item.totalProductCount) || 0,
            lastPrice: 0,
            lastCount: 0
        };
    });

    lastArray.forEach(item => {
        if (!merged[item.category]) {
            merged[item.category] = {
                category: item.category,
                description: item.description,
                currentPrice: 0,
                currentCount: 0,
                lastPrice: parseFloat(item.totalPrice) || 0,
                lastCount: parseInt(item.totalProductCount) || 0
            };
        } else {
            merged[item.category].lastPrice = parseFloat(item.totalPrice) || 0;
            merged[item.category].lastCount = parseInt(item.totalProductCount) || 0;
        }
    });

    return Object.values(merged);
}

function OrderRank({ startDate, endDate, selectedNameListValue, selectedAgentValue, dateMode }) {
    const [summaryData, setSummaryData] = useState({ currentMonth: [], lastMonth: [] });
    const [platformData, setPlatformData] = useState([]);
    const [isChartLoading, setIsChartLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isBarChart, setIsBarChart] = useState(false);

    const colors = [
        { bg: 'bg-yellow-50', text: 'text-yellow-500', badge: 'bg-yellow-400' },
        { bg: 'bg-gray-50', text: 'text-gray-500', badge: 'bg-gray-400' },
        { bg: 'bg-red-50', text: 'text-red-400', badge: 'bg-red-400' },
    ];

    const fetchSummaryData = async () => {
        setIsLoading(true);
        try {
            const response = await fetchProtectedData.post(`${URLS.summary.OrderRanking}`, {
                startDate, endDate,
                selectedNameList: selectedNameListValue,
                customerOwnerId: selectedAgentValue,
                ownerId: selectedNameListValue,
                dateMode: dateMode
            });
            setSummaryData(response.data);
        } catch (error) {
            console.log('Error fetching summary data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSummaryData();
    }, [startDate, endDate, selectedNameListValue, selectedAgentValue, dateMode]);

    const fetchPlatformData = async () => {
        setIsChartLoading(true);
        try {
            const response = await fetchProtectedData.post(`${URLS.summary.PlatformStat}`, {
                startDate, endDate,
                selectedNameList: selectedNameListValue,
                customerOwnerId: selectedAgentValue,
                ownerId: selectedNameListValue,
            });
            setPlatformData(response.data);
        } catch (error) {
            console.log('Error fetching platform data:', error);
        } finally {
            setIsChartLoading(false);
        }
    };

    useEffect(() => {
        fetchPlatformData();
    }, [startDate, endDate, selectedNameListValue, selectedAgentValue, dateMode]);

    const rankData = useMemo(() => {
        return mergeData(summaryData.currentMonth, summaryData.lastMonth);
    }, [summaryData]);

    const apexLabels = platformData.map((item) => item.saleChannel || 'Unknown');
    const apexSeries = platformData.map((item) => parseFloat(item.totalAmountSumUpSale || 0));

    const apexDoughnutOptions = useMemo(() => ({
        chart: {
            type: 'donut',
            toolbar: { show: false }
        },
        labels: apexLabels,
        legend: {
            show: true,
            position: 'top',
            fontSize: '16px'
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => val.toFixed(1) + '%',
            style: { fontSize: '14px' }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '40%',
                    labels: {
                        show: true,
                        total: {
                            show: false,
                            label: 'Total',
                            formatter: (w) => {
                                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                                return sum.toLocaleString() + ' ฿';
                            }
                        }
                    }
                }
            }
        },
        colors: ['#008FFB', '#FF4560', '#00E396', '#FEB019', '#775DD0', '#A5978B', '#4ECDC4']
    }), [apexLabels, apexSeries]);

    const apexBarOptions = useMemo(() => ({
        chart: { type: 'bar', toolbar: { show: false } },
        xaxis: { categories: apexLabels },
        dataLabels: {
            enabled: true,
            formatter: (val) => val.toLocaleString() + ' ฿'
        },
        legend: { show: false }
    }), [apexLabels, apexSeries]);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Card className="w-full" radius="sm" shadow="none">
                <div className="flex justify-between items-center font-bold text-xl mt-2 px-4">
                    <span>Stat Platform</span>
                    <Switch
                        isSelected={isBarChart}
                        onChange={(e) => setIsBarChart(e.target.checked)}
                        classNames={{
                            wrapper: "p-0 h-4 overflow-visible",
                            thumb: cn(
                                "w-6 h-6 border-2 shadow-lg",
                                "group-data-[hover=true]:border-primary",
                                "group-data-[selected=true]:ml-6",
                                "group-data-[pressed=true]:w-7",
                                "group-data-[selected]:group-data-[pressed]:ml-4"
                            ),
                        }}
                    />
                </div>

                <div className="mx-auto">
                    {isChartLoading ? (
                        <div className="flex justify-center items-center p-2">
                            <Spinner />
                        </div>
                    ) : platformData.length === 0 ? (
                        <div className="text-center text-gray-500 text-xl font-semibold p-4">
                            ไม่พบข้อมูล
                        </div>
                    ) : (
                        <div style={{ width: '100%', height: '400px' }}>
                            {isBarChart ? (
                                <Chart
                                    options={apexBarOptions}
                                    series={[{ data: apexSeries }]}
                                    type="bar"
                                    height="100%"
                                />
                            ) : (
                                <Chart
                                    options={apexDoughnutOptions}
                                    series={apexSeries}
                                    type="donut"
                                    height="100%"
                                />
                            )}
                        </div>
                    )}
                </div>
            </Card>

            <div>
                <Card shadow="none" radius="sm">
                    <CardBody>
                        <div className="font-bold text-xl text-center mb-2">
                            อันดับสินค้า
                        </div>
                        <Divider />

                        {isLoading ? (
                            <div className="flex justify-center items-center p-2">
                                <Spinner />
                            </div>
                        ) : (
                            <CardBody className="flex sm:flex-col md:grid md:grid-cols-1 gap-4 p-2 max-h-[350px] scrollbar-hide">
                                {rankData.length === 0 ? (
                                    <div className="text-center text-md">
                                        ไม่พบข้อมูล
                                    </div>
                                ) : (
                                    rankData.map((item, index) => {
                                        // ส่วนของราคายังใช้ formatCurrencyNoDollarsWithFixed
                                        const { arrow: priceArrow, color: priceColor, formattedDifference: priceDiff }
                                            = getDifference(item.currentPrice, item.lastPrice);

                                        // ส่วนของจำนวนออเดอร์ ใช้ formatCurrencyNoDollars
                                        const { arrow: countArrow, color: countColor, formattedDifference: countDiff }
                                            = getDifference(item.currentCount, item.lastCount, formatCurrencyNoDollars);

                                        return (
                                            <div key={index}>
                                                <Card
                                                    radius="sm"
                                                    shadow="none"
                                                    className={`py-2 px-3 ${index < 3
                                                        ? colors[index % colors.length].bg
                                                        : 'bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                        <div className="space-y-1">
                                                            {index < 3 ? (
                                                                <span
                                                                    className={`px-3 py-1 rounded-md text-white ${colors[index % colors.length].badge
                                                                        } font-medium`}
                                                                >
                                                                    อันดับ {index + 1}
                                                                </span>
                                                            ) : (
                                                                <span className="text-xl font-bold text-black">
                                                                    อันดับ {index + 1}
                                                                </span>
                                                            )}
                                                            <div className="text-xl font-bold text-black">
                                                                {item.description}
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col gap-1 text-right sm:text-left">
                                                            <div>
                                                                <span className="text-lg font-semibold">
                                                                    {formatCurrencyNoDollarsWithFixed(item.currentPrice)}
                                                                </span>
                                                                {item.lastPrice > 0 && (
                                                                    <span className={`ml-2 ${priceColor} text-sm font-semibold`}>
                                                                        {priceArrow} {priceDiff}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <span className="text-lg font-semibold">
                                                                    {formatCurrencyNoDollars(item.currentCount)} ออเดอร์
                                                                </span>
                                                                {item.lastCount > 0 && (
                                                                    <span className={`ml-2 ${countColor} text-sm font-semibold`}>
                                                                        {countArrow} {countDiff}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </div>
                                        );
                                    })
                                )}
                            </CardBody>
                        )}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default OrderRank;
