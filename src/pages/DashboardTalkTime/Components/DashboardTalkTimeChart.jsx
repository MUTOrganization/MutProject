import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardBody, Spinner } from "@nextui-org/react";

const formatCurrencyNoDollars = (amount) => {
    if (amount === undefined || amount === null) return "0";
    const number = Number(amount);
    const formattedNumber = number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${number}`;
};

const formatCurrencyNoDollars2Fixed = (amount) => {
    if (amount === undefined || amount === null) return "0";
    const number = Number(amount);
    const formattedNumber = number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formattedNumber}`;
};

const filterHourlyData = (data) => {
    return data.filter(item => item.hour && item.hour.includes(":"));
};

const aggregateData = (data, dateMode) => {
    if (dateMode === "วัน") {
        const hourlyData = Array.from({ length: 24 }, (_, index) => ({
            category: `${index.toString().padStart(2, "0")}:00`,
            callIn: 0,
            callOut: 0,
            totalCall: 0,
            totalTime: 0,
            averageTime: 0,
        }));

        data.forEach((item) => {
            const hour = parseInt(item.hour.split(" ")[1]?.slice(0, 2), 10);
            if (!isNaN(hour) && hourlyData[hour]) {
                hourlyData[hour].callIn += parseInt(item.callIn) || 0;
                hourlyData[hour].callOut += parseInt(item.callOut) || 0;
                hourlyData[hour].totalCall += parseInt(item.totalCall) || 0;
                hourlyData[hour].totalTime += parseFloat(item.totalTime) || 0;
            }
        });

        return hourlyData.map((hour) => ({
            ...hour,
            averageTime:
                hour.totalCall > 0 ? hour.totalTime / hour.totalCall : 0,
        }));
    }

    const dailyData = data.reduce((acc, curr) => {
        const date = curr.hour.split(" ")[0];
        if (!acc[date]) {
            acc[date] = {
                callIn: 0,
                callOut: 0,
                totalCall: 0,
                totalTime: 0,
            };
        }
        acc[date].callIn += parseInt(curr.callIn) || 0;
        acc[date].callOut += parseInt(curr.callOut) || 0;
        acc[date].totalCall += parseInt(curr.totalCall) || 0;
        acc[date].totalTime += parseFloat(curr.totalTime) || 0;
        return acc;
    }, {});

    return Object.entries(dailyData).map(([date, values]) => ({
        category: date,
        ...values,
        averageTime:
            values.callIn + values.callOut > 0
                ? values.totalTime / (values.callIn + values.callOut)
                : 0,
    }));
};

function DashboardTalkTimeChart({ talkTimeChartData, dateMode, isLoading, selectedTeam }) {

    const filteredTeamData = useMemo(() => {
        if (!selectedTeam || selectedTeam.length === 0) {
            return talkTimeChartData;
        }
        return talkTimeChartData.filter(item => selectedTeam.includes(item.team));
    }, [talkTimeChartData, selectedTeam]);

    const filteredData = useMemo(() => {
        if (dateMode === "วัน") {
            return filterHourlyData(filteredTeamData, 24);
        }
        return filteredTeamData;
    }, [filteredTeamData, dateMode]);

    const aggregatedData = useMemo(
        () => aggregateData(filteredData, dateMode),
        [filteredData, dateMode]
    );

    const categories = aggregatedData.map((data) => data.category);
    const callInData = aggregatedData.map((data) => data.callIn);
    const callOutData = aggregatedData.map((data) => data.callOut);
    const totalTimeData = aggregatedData.map((data) => data.totalTime);
    const averageTime = aggregatedData.map((data) => data.averageTime);

    const series = [
        { name: "จำนวนการรับสาย", data: callInData },
        { name: "จำนวนสายที่ได้คุย", data: callOutData },
        { name: "ระยะเวลาการสนทนาทั้งหมด (นาที)", data: totalTimeData },
        { name: "ค่าเฉลี่ยระยะเวลาการสนทนาทั้งหมด (นาที)", data: averageTime },
    ];

    const options = {
        chart: {
            type: "bar",
            height: 350,
            stacked: false,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "90%",
                borderRadius: 3,
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories,
            title: {
                text: dateMode === "รายวัน" ? "วันที่" : "เวลา",
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: "12px",
                },
                formatter: (value) => formatCurrencyNoDollars(value),
            },
            title: {
                style: {
                    fontSize: "12px",
                },
            },
        },
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: function (value, { seriesIndex }) {
                    if (seriesIndex === 2 || seriesIndex === 3) {
                        return formatCurrencyNoDollars2Fixed(value);
                    }
                    return formatCurrencyNoDollars(value);
                },
            },
            style: {
                fontSize: "14px",
            },
        },
        legend: {
            position: "top",
            horizontalAlign: "center",
        },
        colors: ["#5096e7", "#7dcf98", "#f5c259", "#d06eec"],
    };

    return (
        <Card shadow="none" radius="sm" className="flex flex-col items-center">
            <CardBody className="relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-50 z-10 flex items-center justify-center">
                        <Spinner color="primary" size="lg" />
                    </div>
                )}
                <div style={{ opacity: isLoading ? 0.5 : 1, zIndex: 0 }}>
                    <ReactApexChart options={options} series={series} type="bar" height={350} />
                </div>
            </CardBody>
        </Card>
    );
}

export default DashboardTalkTimeChart;

