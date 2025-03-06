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

function Box3({ startDate, endDate, selectedNameListValue, selectedAgentValue, dateMode }) {

    const [isLoading, setIsLoading] = useState(false);
    const [summaryData, setSummaryData] = useState({
        currentMonth: {},
        lastMonth: {}
    });

    const fetchSummaryData = async () => {
        setIsLoading(true);
        try {
            const response = await fetchProtectedData.post(`${URLS.summary.Box3}`, {
                startDate,
                endDate,
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

    const formatNumberWithSign = (value) => {
        const num = parseFloat(value);
        if (isNaN(num)) return "0";
        if (num > 0) {
            return "+" + num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        }
        return num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    };

    const getDifference = (currentValue, lastValue) => {
        const current = parseFloat(currentValue) || 0;
        const last = parseFloat(lastValue) || 0;
        const difference = current - last;

        let arrow = "";
        let color = "text-gray-500";
        let formattedDifference = "0";

        if (difference < 0) {
            arrow = "▼";
            color = "text-green-600";
            formattedDifference = difference.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            });
        } else if (difference > 0) {
            arrow = "▲";
            color = "text-red-600";
            formattedDifference = formatNumberWithSign(difference);
        }

        return {
            difference,
            formattedDifference,
            color,
            arrow
        };
    };

    const { currentMonth, lastMonth } = summaryData;

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
                                                    {
                                                        label: "Ads ลูกค้าใหม่",
                                                        key: "newSalePercentage",
                                                        postfix: "%"
                                                    },
                                                    {
                                                        label: "Ads ลูกค้าเก่า",
                                                        key: "oldSalePercentage",
                                                        postfix: "%"
                                                    },
                                                    {
                                                        label: "Ads เซลล์",
                                                        key: "totalAmountAdminPercentage",
                                                        postfix: "%"
                                                    },
                                                    {
                                                        label: "แอดรวม",
                                                        key: "totalAmountSumUpSalePercentage",
                                                        postfix: "%"
                                                    },
                                                    {
                                                        label: "ค่าแอดรวม",
                                                        key: "totalAds",
                                                        postfix: ""
                                                    }
                                                ].map(({ label, key, postfix }) => {

                                                    const isPercentageField = !["totalAds"].includes(key);

                                                    const currentVal = isPercentageField
                                                        ? parseFloat(currentMonth?.percentageData?.[key]) || 0
                                                        : parseFloat(currentMonth?.[key]) || 0;

                                                    const lastVal = isPercentageField
                                                        ? parseFloat(lastMonth?.percentageData?.[key]) || 0
                                                        : parseFloat(lastMonth?.[key]) || 0;

                                                    const { formattedDifference, color, arrow } = getDifference(currentVal, lastVal);

                                                    const currentValueDisplay = currentVal.toLocaleString("en-US", {
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 2
                                                    });

                                                    return (
                                                        <div key={key} className="grid grid-cols-2 gap-4 text-lg">
                                                            <span className="text-start text-nowrap">{label}</span>
                                                            <span className="text-end flex items-center">
                                                                <span className="text-black">
                                                                    {currentValueDisplay}{postfix}
                                                                </span>
                                                                {lastVal !== 0 && (
                                                                    <span className={`ml-2 text-sm font-semibold ${color}`}>
                                                                        {arrow} {formattedDifference}{postfix}
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
                                        แอดรวม
                                    </div>
                                </div>
                            </div>
                            <CardBody className="flex sm:flex-col md:grid md:grid-row gap-4 p-1">
                                <div className="flex flex-col items-center w-full h-full overflow-hidden">
                                    <div className="text-center">
                                        <span className="text-4xl font-bold text-black">
                                            {(
                                                parseFloat(currentMonth?.percentageData?.totalAmountSumUpSalePercentage) || 0
                                            ).toLocaleString("en-US", {
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 2
                                            })}
                                            %
                                        </span>
                                    </div>
                                    {(() => {
                                        const { formattedDifference, color, arrow } = getDifference(
                                            currentMonth?.percentageData?.totalAmountSumUpSalePercentage,
                                            lastMonth?.percentageData?.totalAmountSumUpSalePercentage
                                        );
                                        return (
                                            <div className={`text-sm font-semibold flex items-center ${color}`}>
                                                {arrow}
                                                <span className="ml-1">
                                                    {formattedDifference}%
                                                </span>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </CardBody>
                        </>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}

export default Box3;
