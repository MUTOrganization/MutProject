import React, { useState, useMemo } from 'react';
import {
    Card,
    CardBody,
    Tooltip,
    Chip,
    Divider,
    Modal,
    ModalHeader,
    ModalBody,
    ModalContent,
    useDisclosure,
    Spinner
} from '@nextui-org/react';

function DashboardTalkTimeCard({
    data,
    talkTimeData,
    selectedUsername,
    selectedTeam,
    findUsername,
    isLoading
}) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedCard, setSelectedCard] = useState(null);

    const formatCurrencyNoDollars = (amount) => {
        if (amount === undefined || amount === null) return '0';
        const number = Number(amount);
        return number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const formatCurrencyNoDollars2Fixed = (amount) => {
        if (amount === undefined || amount === null) return '0';
        const number = Number(amount);
        return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const currentMonthData = data?.currentMonth || [];

    const filteredData = useMemo(() => {
        let filtered = [...currentMonthData];

        if (selectedTeam?.length > 0) {
            filtered = filtered.filter(item => {
                const teamName = item.team || "ยังไม่มีทีม";
                return selectedTeam.includes(teamName);
            });
        }

        if (selectedUsername?.length > 0) {
            filtered = filtered.filter(item =>
                selectedUsername.includes(item.username)
            );
        }

        if (findUsername && typeof findUsername === 'string') {
            const lower = findUsername.toLowerCase();
            filtered = filtered.filter(user =>
                user.username.toLowerCase().includes(lower) ||
                user.name?.toLowerCase().includes(lower) ||
                user.nickName?.toLowerCase().includes(lower)
            );
        }

        return filtered;
    }, [currentMonthData, selectedTeam, selectedUsername, findUsername]);

    const fullSortedData = useMemo(() => {
        const talkCurrent = talkTimeData?.currentMonth || [];
        const w1 = 0.33, w2 = 0.33, w3 = 0.33;
        let maxCall = 0, maxTime = 0, maxAvg = 0;

        const tmpList = currentMonthData.map(item => {
            const t = talkCurrent.find(ti => ti.adminUser === item.username) || {};
            const c = parseFloat(t.totalCall || 0);
            const time = parseFloat(t.totalTime || 0);
            const avg = parseFloat(t.averageTime || 0);
            if (c > maxCall) maxCall = c;
            if (time > maxTime) maxTime = time;
            if (avg > maxAvg) maxAvg = avg;
            return { ...item, talkItem: t };
        });

        const withScore = tmpList.map(obj => {
            const c = parseFloat(obj.talkItem.totalCall || 0);
            const time = parseFloat(obj.talkItem.totalTime || 0);
            const avg = parseFloat(obj.talkItem.averageTime || 0);

            const callNorm = maxCall ? c / maxCall : 0;
            const timeNorm = maxTime ? time / maxTime : 0;
            const avgNorm = maxAvg ? avg / maxAvg : 0;

            const score = (w1 * callNorm) + (w2 * timeNorm) + (w3 * avgNorm);
            return { ...obj, performanceScore: score };
        });

        return withScore.sort((a, b) => b.performanceScore - a.performanceScore);
    }, [currentMonthData, talkTimeData]);

    const sortedData = useMemo(() => {
        const talkCurrent = talkTimeData?.currentMonth || [];
        const w1 = 0.33, w2 = 0.33, w3 = 0.33;
        let maxCall = 0, maxTime = 0, maxAvg = 0;

        const tmpList = filteredData.map(item => {
            const t = talkCurrent.find(ti => ti.adminUser === item.username) || {};
            const c = parseFloat(t.totalCall || 0);
            const time = parseFloat(t.totalTime || 0);
            const avg = parseFloat(t.averageTime || 0);
            if (c > maxCall) maxCall = c;
            if (time > maxTime) maxTime = time;
            if (avg > maxAvg) maxAvg = avg;
            return { ...item, talkItem: t };
        });

        const withScore = tmpList.map(obj => {
            const c = parseFloat(obj.talkItem.totalCall || 0);
            const time = parseFloat(obj.talkItem.totalTime || 0);
            const avg = parseFloat(obj.talkItem.averageTime || 0);

            const callNorm = maxCall ? c / maxCall : 0;
            const timeNorm = maxTime ? time / maxTime : 0;
            const avgNorm = maxAvg ? avg / maxAvg : 0;

            const score = (w1 * callNorm) + (w2 * timeNorm) + (w3 * avgNorm);
            return { ...obj, performanceScore: score };
        });

        return withScore.sort((a, b) => b.performanceScore - a.performanceScore);
    }, [filteredData, talkTimeData]);

    const getDifference = (currentValue, lastValue, formatFn = val => val) => {
        const curr = parseFloat(currentValue) || 0;
        const last = parseFloat(lastValue) || 0;
        const diff = curr - last;
        const arrow = diff > 0 ? "▲" : diff < 0 ? "▼" : "";
        const color =
            diff > 0 ? "text-green-600"
                : diff < 0 ? "text-red-600"
                    : "text-gray-500";

        return {
            difference: formatFn(Math.abs(diff)),
            arrow,
            color
        };
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <section className="py-0">
            <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:max-h-[60vh] overflow-y-auto scrollbar-hide">
                {sortedData.map((item) => {
                    const actualRank = fullSortedData.findIndex(
                        (fullItem) => fullItem.username === item.username
                    ) + 1;

                    const talkTimeItem = item.talkItem || {};
                    const talkTimeLast = talkTimeData?.lastMonth?.find(
                        t => t.adminUser === item.username
                    ) || {};

                    const cardSections = [
                        { divider: true },
                        {
                            label: "จำนวนสายโทรทั้งหมด",
                            value: formatCurrencyNoDollars(talkTimeItem.totalCall || 0),
                            ...getDifference(
                                talkTimeItem.totalCall || 0,
                                talkTimeLast.totalCall || 0,
                                formatCurrencyNoDollars
                            ),
                        },
                        {
                            label: "จำนวนการรับสาย (สาย)",
                            value: formatCurrencyNoDollars(talkTimeItem.callIn || 0),
                            ...getDifference(
                                talkTimeItem.callIn || 0,
                                talkTimeLast.callIn || 0,
                                formatCurrencyNoDollars
                            ),
                        },
                        {
                            label: "จำนวนสายที่ได้คุย (สาย)",
                            value: formatCurrencyNoDollars(talkTimeItem.callOut || 0),
                            ...getDifference(
                                talkTimeItem.callOut || 0,
                                talkTimeLast.callOut || 0,
                                formatCurrencyNoDollars
                            ),
                        },
                        { divider: true },
                        {
                            label: "ระยะเวลาการสนทนาทั้งหมด (นาที)",
                            value: formatCurrencyNoDollars2Fixed(talkTimeItem.totalTime || 0),
                            ...getDifference(
                                talkTimeItem.totalTime || 0,
                                talkTimeLast.totalTime || 0,
                                formatCurrencyNoDollars2Fixed
                            ),
                        },
                        {
                            label: "ค่าเฉลี่ยระยะเวลาการสนทนา (นาที)",
                            value: formatCurrencyNoDollars2Fixed(talkTimeItem.averageTime || 0),
                            ...getDifference(
                                talkTimeItem.averageTime || 0,
                                talkTimeLast.averageTime || 0,
                                formatCurrencyNoDollars2Fixed
                            ),
                        },
                    ];

                    return (
                        <Tooltip
                            key={item.username}
                            content="กดเพื่อดูรายละเอียด"
                            color="primary"
                        >
                            <Card
                                shadow="none"
                                radius="sm"
                                isPressable
                                onPress={() => {
                                    setSelectedCard({
                                        username: item.username,
                                        team: item.team,
                                        details: cardSections,
                                        rank: actualRank
                                    });
                                    onOpen();
                                }}
                            >
                                <CardBody>
                                    <div className="flex flex-col items-center">
                                        <div className="grid grid-cols-3 items-center w-full mb-2">
                                            <span
                                                className={`
                                                    inline-block
                                                    w-fit
                                                    px-2 py-1
                                                    text-sm
                                                    font-bold
                                                    rounded-full
                                                    ${actualRank === 1
                                                        ? 'bg-[#fefbf0] text-[#f6a55a]'
                                                        : actualRank === 2
                                                            ? 'bg-[#f4f9fb] text-[#acb1b8]'
                                                            : actualRank === 3
                                                                ? 'bg-[#F4E0D3] text-[#8B5E30]'
                                                                : 'bg-[#ebefff] text-[#8c8ccd]'
                                                    }
                                                `}
                                            >
                                                อันดับที่ {actualRank}
                                            </span>
                                            <span className="font-bold text-center text-sm">
                                                {item.username}
                                            </span>
                                            <Chip
                                                color="primary"
                                                variant="flat"
                                                className="justify-self-end"
                                            >
                                                {item.team ? `ทีม ${item.team}` : "ยังไม่มีทีม"}
                                            </Chip>
                                        </div>
                                        <div className="space-y-2 w-full">
                                            {cardSections.map((section, idx) =>
                                                section.divider ? (
                                                    <Divider key={idx} />
                                                ) : (
                                                    <div key={idx} className="flex justify-between items-center">
                                                        <span className="text-sm">{section.label}</span>
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-bold text-sm text-black">
                                                                {section.value}
                                                            </span>
                                                            {section.difference && (
                                                                <span
                                                                    className={`text-xs font-bold flex items-center gap-1 ${section.color}`}
                                                                >
                                                                    <span style={{ fontSize: "10px" }}>
                                                                        {section.arrow}
                                                                    </span>
                                                                    {section.difference}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Tooltip>
                    );
                })}
            </div>

            <Modal isOpen={isOpen} onClose={onOpenChange}>
                <ModalContent>
                    {selectedCard && (
                        <>
                            <ModalHeader>
                                <div className="flex items-center justify-between w-full">
                                    <div className="grid grid-cols-3 items-center w-full mb-2">
                                        <span
                                            className={`
                                                inline-block
                                                w-fit
                                                px-2 py-1
                                                text-sm
                                                font-bold
                                                rounded-full
                                                ${selectedCard.rank === 1
                                                    ? 'bg-[#fefbf0] text-[#f6a55a]'
                                                    : selectedCard.rank === 2
                                                        ? 'bg-[#f4f9fb] text-[#acb1b8]'
                                                        : selectedCard.rank === 3
                                                            ? 'bg-[#F4E0D3] text-[#8B5E30]'
                                                            : 'bg-[#ebefff] text-[#8c8ccd]'
                                                }
                                            `}
                                        >
                                            อันดับที่ {selectedCard.rank}
                                        </span>
                                        <span className="font-bold text-center text-sm">
                                            {selectedCard.username}
                                        </span>
                                        <Chip
                                            color="primary"
                                            variant="flat"
                                            className="justify-self-end"
                                        >
                                            {selectedCard.team ? `ทีม ${selectedCard.team}` : "ยังไม่มีทีม"}
                                        </Chip>
                                    </div>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <div className="space-y-4">
                                    {selectedCard.details.map((section, idx) =>
                                        section.divider ? (
                                            <Divider key={idx} />
                                        ) : (
                                            <div
                                                key={idx}
                                                className="flex justify-between items-center"
                                            >
                                                <span>{section.label}</span>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-bold">
                                                        {section.value}
                                                    </span>
                                                    {section.difference && (
                                                        <span
                                                            className={`text-xs font-bold flex items-center gap-1 ${section.color}`}
                                                        >
                                                            <span style={{ fontSize: "10px" }}>
                                                                {section.arrow}
                                                            </span>
                                                            {section.difference}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </section>
    );
}

export default DashboardTalkTimeCard;
