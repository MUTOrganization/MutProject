import React, { useMemo } from 'react'
import { Card, CardBody, Spinner } from '@nextui-org/react'
import { PhoneInIcon, PhoneRingIcon, ClockIcon, ClockTimeIcon } from '../../../component/Icons';

function DashboardTalkTimeTop({ data, talkTimeData, selectedUsername, selectedTeam, findUsername, isLoading }) {

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '0';
        const number = Number(amount);
        const formattedNumber = number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return `฿${formattedNumber}`;
    };

    const formatCurrencyNoDollars = (amount) => {
        if (amount === undefined || amount === null) return '0';

        const number = Number(amount);
        const formattedNumber = number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return `${formattedNumber}`;
    };
    const formatCurrencyNoDollars2Fixed = (amount) => {
        if (amount === undefined || amount === null) return '0';

        const number = Number(amount);
        const formattedNumber = number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return `${formattedNumber}`;
    };

    const filteredData = useMemo(() => {
        if (!data || data.length === 0) return [];

        let filtered = data?.currentMonth;

        if (selectedTeam.length > 0) {
            filtered = filtered.filter(item => {
                return (
                    selectedTeam.includes(item.team) ||
                    (selectedTeam.includes("ยังไม่มีทีม") && item.team === null)
                );
            });
        }

        if (selectedUsername.length > 0) {
            filtered = filtered.filter(item => selectedUsername.includes(item.username));
        }

        if (findUsername && typeof findUsername === 'string') {
            filtered = filtered.filter(user =>
                user.username.toLowerCase().includes(findUsername.toLowerCase())
            );
        }

        return filtered;
    }, [data, selectedUsername, selectedTeam, findUsername]);

    const totalSum = useMemo(() => {
        const filteredDataArray = Array.isArray(filteredData) ? filteredData : [];
        const currentMonthData = talkTimeData?.currentMonth || [];
        const lastMonthData = talkTimeData?.lastMonth || [];
    
        const result = filteredDataArray.reduce(
            (sum, item) => {
                const talkTimeItem =
                    currentMonthData.find((talk) => talk.adminUser === item.username) || {};
                const lastTalkTimeItem =
                    lastMonthData.find((talk) => talk.adminUser === item.username) || {};
    
                return {
                    callIn: (sum.callIn || 0) + (parseInt(talkTimeItem.callIn) || 0),
                    callOut: (sum.callOut || 0) + (parseInt(talkTimeItem.callOut) || 0),
                    totalTime: (sum.totalTime || 0) + (parseFloat(talkTimeItem.totalTime) || 0),
                    lastCallIn: (sum.lastCallIn || 0) + (parseInt(lastTalkTimeItem.callIn) || 0),
                    lastCallOut: (sum.lastCallOut || 0) + (parseInt(lastTalkTimeItem.callOut) || 0),
                    lastTotalTime:
                        (sum.lastTotalTime || 0) + (parseFloat(lastTalkTimeItem.totalTime) || 0),
                };
            },
            {
                callIn: 0,
                callOut: 0,
                totalTime: 0,
                lastCallIn: 0,
                lastCallOut: 0,
                lastTotalTime: 0,
            }
        );
    
        const averageTime =
            result.totalTime > 0 ? result.totalTime / (result.callIn + result.callOut) : 0;
        const lastAverageTime =
            result.lastTotalTime > 0
                ? result.lastTotalTime / (result.lastCallIn + result.lastCallOut)
                : 0;
    
        return {
            ...result,
            averageTime,
            lastAverageTime,
        };
    }, [filteredData, talkTimeData]);
    

    const getComparisonColor = (currentValue, lastValue) => {
        const current = parseFloat(currentValue);
        const last = parseFloat(lastValue);

        if (current > last) return "text-green-600";
        if (current < last) return "text-red-600";
        return "text-gray-500";
    };

    const getDifference = (currentValue, lastValue, format = (val) => val) => {
        const current = parseFloat(currentValue);
        const last = parseFloat(lastValue);
        const difference = current - last;

        const color = getComparisonColor(current, last);
        const arrow = current > last ? "▲" : current < last ? "▼" : "";

        return {
            difference: format(Math.abs(difference)),
            color,
            arrow,
        };
    };

    return (
        <Card shadow="none" radius="sm" className="flex flex-col items-center">
            {isLoading ? (
                <div className="bg-white bg-opacity-50 z-10 flex items-center justify-center p-4">
                    <Spinner color="primary" />
                </div>
            ) : (
                <CardBody>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[
                            {
                                title: "จำนวนการรับสาย (สาย)",
                                value: totalSum.callIn,
                                lastValue: totalSum.lastCallIn,
                                icon: <PhoneInIcon size={36} />,
                                format: formatCurrencyNoDollars,
                                color: "bg-blue-50",
                                bgIcon: "bg-white",
                            },
                            {
                                title: "จำนวนสายที่ได้คุย (สาย)",
                                value: totalSum.callOut,
                                lastValue: totalSum.lastCallOut,
                                icon: <PhoneRingIcon size={36} />,
                                format: formatCurrencyNoDollars,
                                color: "bg-blue-50",
                                bgIcon: "bg-white",
                            },
                            {
                                title: "ระยะเวลาการสนทนาทั้งหมด (นาที)",
                                value: totalSum.totalTime,
                                lastValue: totalSum.lastTotalTime,
                                icon: <ClockTimeIcon size={36} />,
                                format: formatCurrencyNoDollars2Fixed,
                                color: "bg-blue-50",
                                bgIcon: "bg-white",
                            },
                            {
                                title: "ค่าเฉลี่ยระยะเวลาการสนทนาทั้งหมด (นาที)",
                                value: totalSum.averageTime,
                                lastValue: totalSum.lastAverageTime,
                                icon: <ClockIcon size={36} />,
                                format: formatCurrencyNoDollars2Fixed,
                                color: "bg-blue-50",
                                bgIcon: "bg-white",
                            },
                        ].map((item, index) => {
                            const { difference, color, arrow } = getDifference(item.value, item.lastValue);

                            return (
                                <Card key={index} className={`${item.color} shadow-none rounded-lg p-4`}>
                                    <div className="grid grid-cols-12 items-center">
                                        <div className="col-span-3 flex items-center justify-center">
                                            <div className={`w-12 h-12 ${item.bgIcon} rounded-lg flex items-center justify-center`}>
                                                {item.icon}
                                            </div>
                                        </div>

                                        <div className="col-span-9 flex flex-col items-end text-right">
                                            <span className="block text-gray-500 text-md">{item.title}</span>
                                            <span className="block text-2xl font-bold text-gray-800">
                                                {item.format(item.value)}
                                            </span>
                                            <span className={`text-xs font-bold flex items-center gap-1 ${color}`}>
                                                <span style={{ fontSize: "10px" }}>{arrow}</span>
                                                {item.format(difference)}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </CardBody>
            )}
        </Card>
    )
}

export default DashboardTalkTimeTop