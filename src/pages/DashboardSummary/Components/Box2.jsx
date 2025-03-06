import React, { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    Spinner,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Button
} from "@nextui-org/react";
import fetchProtectedData from "../../../../utils/fetchData";
import { URLS } from "../../../config";
import { InfomationIcon } from "../../../component/Icons";
import { formatCurrencyNoDollars } from "@/pages/DashboardOverView/utils/currencyUtils";

function Box2({ startDate, endDate, selectedNameListValue, selectedAgentValue, dateMode }) {

    const [isLoading, setIsLoading] = useState(false);
    const [summaryData, setSummaryData] = useState({ currentMonth: {}, lastMonth: {} });

    const fetchSummaryData = async () => {
        setIsLoading(true);
        try {
            const response = await fetchProtectedData.post(`${URLS.summary.Box2}`, {
                startDate: startDate,
                endDate: endDate,
                selectedNameList: selectedNameListValue,
                customerOwnerId: selectedAgentValue,
                ownerId: selectedNameListValue,
                dateMode: dateMode
            });
            setSummaryData(response.data);
        } catch (error) {
            console.log("error fetching data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSummaryData();
    }, [startDate, endDate, selectedNameListValue, selectedAgentValue ,dateMode]);

    const getComparisonColor = (currentValue, lastValue) => {
        const current = parseFloat(currentValue) || 0;
        const last = parseFloat(lastValue) || 0;

        if (current > last) return "text-green-600";
        if (current < last) return "text-red-600";
        return "text-gray-500";
    };

    const getDifference = (currentValue, lastValue) => {
        const current = parseFloat(currentValue) || 0;
        const last = parseFloat(lastValue) || 0;
        const difference = current - last;

        return {
            formattedDifference: formatCurrencyNoDollars(Math.abs(difference)),
            color: getComparisonColor(current, last),
            arrow: current > last ? "▲" : current < last ? "▼" : "",
        };
    };

    return (
        <div>
            <Card shadow="none" radius="sm">
                <CardBody>
                    {isLoading ? (
                        <div className="flex justify-center h-full">
                            <Spinner />
                        </div>
                    ) : (
                        <>
                            <div className="relative">
                                <div className="absolute top-0 right-1">
                                    <Popover placement="bottom" offset={10}>
                                        <PopoverTrigger>
                                            <Button isIconOnly size="sm" variant="light" color="primary">
                                                <InfomationIcon size={24} />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <div>
                                                {[
                                                    { label: "ออเดอร์ลูกค้าใหม่", key: "newOrder" },
                                                    { label: "ออเดอร์ลูกค้าเก่า", key: "oldOrder" },
                                                    { label: "ออเดอร์รวม", key: "totalOrder" },
                                                    { label: "ออเดอร์อัพเซล", key: "upSaleOrder" }
                                                ].map(({ label, key }) => {
                                                    const current = parseFloat(summaryData.currentMonth?.[key]) || 0;
                                                    const last = parseFloat(summaryData.lastMonth?.[key]) || 0;
                                                    const { formattedDifference, color, arrow } = getDifference(current, last);

                                                    return (
                                                        <div key={key} className="grid grid-cols-2 gap-4 text-lg">
                                                            <span className="text-start text-nowrap">{label}</span>
                                                            <span className="text-end flex items-center">
                                                                <span className="text-black">{formatCurrencyNoDollars(current)}</span>
                                                                {last !== 0 && (
                                                                    <span className={`ml-2 text-sm font-semibold ${color}`}>
                                                                        {arrow} {formattedDifference}
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="flex justify-center items-center">
                                    <div className="font-bold p-2 text-2xl text-center text-gray-500">
                                        ออเดอร์รวม
                                    </div>
                                </div>
                            </div>

                            <CardBody className="flex sm:flex-col md:grid md:grid-row gap-4 p-1">
                                <div className="flex flex-col items-center w-full h-full overflow-hidden">
                                    <div className="text-center">
                                        <span className="text-4xl font-bold text-black">
                                            {formatCurrencyNoDollars(summaryData.currentMonth?.totalOrder)}
                                        </span>
                                    </div>
                                    <div className={`text-sm font-semibold flex items-center ${getComparisonColor(summaryData.currentMonth?.totalOrder, summaryData.lastMonth?.totalOrder)}`}>
                                        {getDifference(summaryData.currentMonth?.totalOrder, summaryData.lastMonth?.totalOrder).arrow}
                                        <span className="ml-1">
                                            {getDifference(summaryData.currentMonth?.totalOrder, summaryData.lastMonth?.totalOrder).formattedDifference}
                                        </span>
                                    </div>
                                </div>
                            </CardBody>
                        </>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}

export default Box2;
