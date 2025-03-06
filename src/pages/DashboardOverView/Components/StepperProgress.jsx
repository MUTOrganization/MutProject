import { Card, Chip } from "@nextui-org/react";
import React from "react";
import { formatCurrencyNoDollarsWithFixed } from "../utils/currencyUtils";
import { Skeleton } from "@/components/ui/skeleton"
import useOverViewSettingData from "../fetchData/overViewSettingData";

function StepperProgress({ totalAmount, isLoading }) {

    const { settingData, isLoadingSetting } = useOverViewSettingData();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center">
                <Card className="bg-white w-full p-6" shadow="none" radius="sm">
                    <div className="space-y-4">
                        <Skeleton className="h-3 w-3/5 mx-auto rounded-lg" />
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="flex flex-col items-center text-center">
                                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <Card className="bg-white w-full p-4" shadow="none" radius="sm">
                <div className="flex items-center justify-between mb-6">
                    {settingData.map((item, index) => {
                        const targetAmount = parseFloat(item.amount);
                        const isCompleted = totalAmount >= targetAmount;

                        return (
                            <React.Fragment key={item.id || index}>
                                <div className="flex flex-col items-center text-center">
                                    <div
                                        className={`w-8 h-8 flex items-center justify-center rounded-full mb-2 ${isCompleted
                                            ? "bg-gradient-to-r from-green-400 to-green-600 text-white"
                                            : "bg-gradient-to-r from-blue-200 to-blue-300 text-gray-600"
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        ) : (
                                            <span className="font-semibold">{index + 1}</span>
                                        )}
                                    </div>
                                    <p
                                        className={`text-sm font-semibold ${isCompleted ? "text-green-500" : "text-gray-500"
                                            }`}
                                    >
                                        {item.content}
                                    </p>
                                </div>

                                {index < settingData.length - 1 && (
                                    <div
                                        className={`flex-1 h-2 mx-2 rounded-full ${isCompleted ? "bg-green-500" : "bg-blue-300"
                                            }`}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {settingData.map((item, index) => {
                        const targetAmount = parseFloat(item.amount);
                        const isCompleted = totalAmount >= targetAmount;

                        return (
                            <div
                                key={item.id || index}
                                className={`flex flex-col items-start justify-between p-6 transition-transform duration-300 rounded-md ${isCompleted
                                    ? "bg-green-50 border-green-500 hover:scale-105"
                                    : "bg-blue-50 border-gray-300 hover:scale-105"
                                    }`}
                            >
                                <h2 className="text-lg font-bold mb-4">{item.content}</h2>
                                <p className="text-sm mb-4">
                                    <span className="font-semibold text-gray-700">{item.reward}</span>
                                </p>
                                <Chip
                                    color={isCompleted ? "success" : "primary"}
                                    variant="flat"
                                >
                                    {isCompleted ? "สำเร็จแล้ว" : "รอเป้าหมาย"}
                                </Chip>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
}

export default StepperProgress;
