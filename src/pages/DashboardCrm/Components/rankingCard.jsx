import React, { useMemo } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Divider,
    Spinner
} from "@nextui-org/react";
import useRankingData from "../utils/fetchRankingData";
import {
    formatCurrencyNoDollars2Fixed,
    formatCurrencyNoDollars
} from "@/pages/DashboardOverView/utils/currencyUtils";
import { ScrollArea } from "@/components/ui/scroll-area";

function getMedalData(rank) {
    switch (rank) {
        case 1:
            return {
                bgColor: "bg-[#fefbf0]",
                textColor: "text-[#f6a55a]",
                medalEmoji: "🥇",
            };
        case 2:
            return {
                bgColor: "bg-[#f4f9fb]",
                textColor: "text-[#acb1b8]",
                medalEmoji: "🥈",
            };
        case 3:
            return {
                bgColor: "bg-[#F4E0D3]",
                textColor: "text-[#8B5E30]",
                medalEmoji: "🥉",
            };
        default:
            return {
                bgColor: "bg-[#ebefff]",
                textColor: "text-[#8c8ccd]",
                medalEmoji: "",
            };
    }
}

function getRankChange(oldRank, newRank) {
    if (!oldRank) {
        return { arrow: "", color: "text-gray-400", diff: "New" };
    }
    const diff = oldRank - newRank;
    if (diff > 0) {
        return { arrow: "▲", color: "text-green-600", diff: `${diff}` };
    } else if (diff < 0) {
        return { arrow: "▼", color: "text-red-600", diff: `${Math.abs(diff)}` };
    } else {
        return { arrow: "-", color: "text-gray-400", diff: "0" };
    }
}

function RankingCard({ startDate, endDate, ownerId, customOwnerId, dateMode, selectedTeam, selectedUsername, findUsername }) {

    const { data, isLoading } = useRankingData({
        startDate,
        endDate,
        ownerId,
        customOwnerId,
        dateMode,
    });

    const currentMonth = data?.currentMonth || [];
    const lastMonth = data?.lastMonth || [];

    if (isLoading) {
        return <Spinner size="lg" className="flex justify-center mx-auto "/>;
    }

    const sortedCurrent = [...currentMonth].sort(
        (a, b) => parseFloat(b.totalAmount) - parseFloat(a.totalAmount)
    );
    const sortedLast = [...lastMonth].sort(
        (a, b) => parseFloat(b.totalAmount) - parseFloat(a.totalAmount)
    );

    const lastMonthRankMap = {};
    sortedLast.forEach((item, idx) => {
        const rank = idx + 1;
        lastMonthRankMap[item.username] = rank;
    });

    const topThree = sortedCurrent.slice(0, 3);
    const otherRanks = sortedCurrent.slice(3);

    return (
        <section className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {topThree.map((item, index) => {
                    const rank = index + 1;
                    const { bgColor, textColor, medalEmoji } = getMedalData(rank);

                    const oldRank = lastMonthRankMap[item.username];
                    const { arrow, color, diff } = getRankChange(oldRank, rank);

                    return (
                        <Card
                            key={item.username || index}
                            shadow="none"
                            radius="sm"
                        >
                            <CardHeader className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`
                                        inline-block
                                        rounded-full
                                        px-2 py-1
                                        text-md font-bold
                                        ${bgColor} ${textColor}
                                        `}
                                    >
                                        อันดับที่ {rank}
                                    </span>
                                    <h2 className="text-md font-semibold text-gray-700">
                                        {item.username}
                                    </h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xl ${color}`}>{arrow}</span>
                                    {diff === "New" ? (
                                        <span className="text-sm text-gray-500">New</span>
                                    ) : (
                                        <span className={`text-sm font-bold ${color}`}>{diff}</span>
                                    )}
                                    <span className="text-3xl">{medalEmoji}</span>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div className="flex items-center mb-4">
                                    {item.avatar ? (
                                        <img
                                            src={item.avatar}
                                            alt={item.name}
                                            className="w-16 h-16 rounded-full object-cover mr-3"
                                        />
                                    ) : (
                                        <div
                                            className="
                                                w-16 h-16 bg-blue-500 text-white flex 
                                                items-center justify-center 
                                                rounded-full mr-3 text-xl font-bold
                                            "
                                        >
                                            {item.name?.charAt(0).toUpperCase() || ""}
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-base font-semibold text-gray-800">
                                            {item.name}
                                        </span>
                                        <div className="text-sm text-gray-500">
                                            {item.nickName || "-"}
                                        </div>
                                    </div>
                                </div>
                                <Divider className="my-2" />
                                <div className="flex justify-between items-center mt-2">
                                    <div className="flex flex-col items-start">
                                        <span className="text-lg font-bold">
                                            {formatCurrencyNoDollars2Fixed(item.totalAmount)}
                                        </span>
                                        <span className="text-md text-gray-500">
                                            💰 ยอดขาย
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-lg font-bold">
                                            {formatCurrencyNoDollars(item.totalOrder)}
                                        </span>
                                        <span className="text-md text-gray-500">
                                            📦 ออเดอร์
                                        </span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    );
                })}
            </div>

            {otherRanks.length > 0 && (
                <ScrollArea className="h-[430px] w-full rounded-md border p-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {otherRanks.map((item, idx) => {
                            const rank = 3 + (idx + 1);
                            const { bgColor, textColor } = getMedalData(rank);

                            const oldRank = lastMonthRankMap[item.username];
                            const { arrow, color, diff } = getRankChange(oldRank, rank);

                            return (
                                <Card
                                    key={item.username || `rank-${rank}`}
                                    className="bg-white"
                                    shadow="none"
                                    radius="sm"
                                >
                                    <CardBody className="flex flex-col p-4">
                                        <div className="w-full flex items-center gap-2">
                                            <span
                                                className={`
                                                    inline-block rounded-full
                                                    px-2 py-1
                                                    text-md font-bold
                                                    ${bgColor} ${textColor}
                                                `}
                                            >
                                                อันดับที่ {rank}
                                            </span>
                                            <div className="text-base font-semibold text-gray-800">
                                                {item.username}
                                            </div>
                                            <span className={`text-xl ${color}`}>
                                                {arrow}
                                            </span>
                                            {diff === "New" ? (
                                                <span className="text-sm text-gray-500 ml-1">
                                                    New
                                                </span>
                                            ) : (
                                                <span className={`text-sm font-bold ml-1 ${color}`}>
                                                    {diff}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-center mt-2">
                                            {item.avatar ? (
                                                <img
                                                    src={item.avatar}
                                                    alt={item.name}
                                                    className="w-16 h-16 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div
                                                    className="
                                                        w-16 h-16 bg-blue-500 text-white flex items-center justify-center 
                                                        rounded-full text-md font-bold
                                                    "
                                                >
                                                    {item.name?.charAt(0).toUpperCase() || ""}
                                                </div>
                                            )}
                                            <div className="mt-2 text-lg font-bold text-black">
                                                {item.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {item.nickName || "-"}
                                            </div>
                                        </div>
                                        <Divider className="my-2 w-full" />
                                        <div className="flex justify-between items-center mt-2">
                                            <div className="flex flex-col items-start">
                                                <span className="text-lg font-bold">
                                                    {formatCurrencyNoDollars2Fixed(item.totalAmount)}
                                                </span>
                                                <span className="text-md text-gray-500">
                                                    💰 ยอดขาย
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-lg font-bold">
                                                    {formatCurrencyNoDollars(item.totalOrder)}
                                                </span>
                                                <span className="text-md text-gray-500">
                                                    📦 ออเดอร์
                                                </span>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            );
                        })}
                    </div>
                </ScrollArea>
            )}
        </section>
    );
}

export default RankingCard;
