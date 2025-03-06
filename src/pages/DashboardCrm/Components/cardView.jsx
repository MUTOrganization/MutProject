import React, { useState, useMemo } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Divider,
    Chip,
    Tooltip,
    Spinner,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Button
} from '@nextui-org/react';

import {
    formatCurrencyNoDollars,
    formatCurrencyNoDollars2Fixed
} from '@/pages/DashboardOverView/utils/currencyUtils';

import { InfomationIcon } from '@/component/Icons';

function CardView({
    data,
    lastMonth,
    selectedTeam,
    selectedUsername,
    findUsername,
    isLoading,
    orderType = "all"
}) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedCard, setSelectedCard] = useState(null);

    const getComparisonColor = (currentValue, lastValue) => {
        const c = parseFloat(currentValue ?? 0);
        const l = parseFloat(lastValue ?? 0);
        if (c > l) return "text-green-600";
        if (c < l) return "text-red-600";
        return "text-gray-500";
    };

    const getDifference = (currentValue, lastValue, formatFn = (v) => v) => {
        if (lastValue === null || lastValue === undefined) {
            return {
                difference: '0',
                arrow: '',
                color: 'text-gray-500'
            };
        }
        const c = parseFloat(currentValue ?? 0);
        const l = parseFloat(lastValue ?? 0);
        const diff = c - l;
        const arrow = diff > 0 ? '▲' : diff < 0 ? '▼' : '';
        return {
            difference: formatFn(Math.abs(diff)),
            color: getComparisonColor(c, l),
            arrow
        };
    };

    const filteredData = useMemo(() => {
        if (!Array.isArray(data)) return [];

        let result = [...data];

        if (selectedTeam.length > 0 && !selectedTeam.includes("all")) {
            result = result.filter(item => {
                const t = item.team || "ยังไม่มีทีม";
                return selectedTeam.includes(t);
            });
        }

        if (selectedUsername.length > 0 && !selectedUsername.includes("all")) {
            result = result.filter(item => selectedUsername.includes(item.username));
        }

        if (findUsername && typeof findUsername === 'string') {
            const lower = findUsername.toLowerCase();
            result = result.filter(item =>
                item.username.toLowerCase().includes(lower)
            );
        }

        if (orderType === 'new') {
            result = result.filter(item => parseFloat(item.newOrder ?? 0) > 0);
        } else if (orderType === 'old') {
            result = result.filter(item => parseFloat(item.oldOrder ?? 0) > 0);
        }

        result.sort((a, b) => {
            const aVal = parseFloat(a.totalAmountSumUpSale ?? 0);
            const bVal = parseFloat(b.totalAmountSumUpSale ?? 0);
            return bVal - aVal;
        });

        return result;
    }, [data, selectedTeam, selectedUsername, findUsername, orderType]);

    const fullSortedData = useMemo(() => {
        if (!Array.isArray(data)) return [];
        const cloned = [...data];
        cloned.sort((a, b) => {
            const aVal = parseFloat(a.totalAmountSumUpSale ?? 0);
            const bVal = parseFloat(b.totalAmountSumUpSale ?? 0);
            return bVal - aVal;
        });
        return cloned;
    }, [data]);

    const totalSum = useMemo(() => {
        if (!Array.isArray(filteredData)) return {};

        return filteredData.reduce((acc, item) => {
            const lastItem = Array.isArray(lastMonth)
                ? lastMonth.find(l => l.username === item.username)
                : null;

            acc.totalAmount = (acc.totalAmount ?? 0) + parseFloat(item.totalAmount ?? 0);
            acc.totalOrder = (acc.totalOrder ?? 0) + parseFloat(item.totalOrder ?? 0);
            acc.oldOrder = (acc.oldOrder ?? 0) + parseFloat(item.oldOrder ?? 0);
            acc.newOrder = (acc.newOrder ?? 0) + parseFloat(item.newOrder ?? 0);
            acc.oldSale = (acc.oldSale ?? 0) + parseFloat(item.oldSale ?? 0);
            acc.newSale = (acc.newSale ?? 0) + parseFloat(item.newSale ?? 0);
            acc.totalUpSale = (acc.totalUpSale ?? 0) + parseFloat(item.totalUpSale ?? 0);
            acc.totalUpSaleAmount =
                (acc.totalUpSaleAmount ?? 0) + parseFloat(item.totalUpSaleAmount ?? 0);
            acc.totalAmountSumUpSale =
                (acc.totalAmountSumUpSale ?? 0) + parseFloat(item.totalAmountSumUpSale ?? 0);

            if (lastItem) {
                acc.lastTotalAmount =
                    (acc.lastTotalAmount ?? 0) + parseFloat(lastItem.totalAmount ?? 0);
                acc.lastTotalOrder =
                    (acc.lastTotalOrder ?? 0) + parseFloat(lastItem.totalOrder ?? 0);
                acc.lastOldOrder =
                    (acc.lastOldOrder ?? 0) + parseFloat(lastItem.oldOrder ?? 0);
                acc.lastNewOrder =
                    (acc.lastNewOrder ?? 0) + parseFloat(lastItem.newOrder ?? 0);
                acc.lastOldSale =
                    (acc.lastOldSale ?? 0) + parseFloat(lastItem.oldSale ?? 0);
                acc.lastNewSale =
                    (acc.lastNewSale ?? 0) + parseFloat(lastItem.newSale ?? 0);
                acc.lastTotalUpSale =
                    (acc.lastTotalUpSale ?? 0) + parseFloat(lastItem.totalUpSale ?? 0);
                acc.lastTotalUpSaleAmount =
                    (acc.lastTotalUpSaleAmount ?? 0) + parseFloat(lastItem.totalUpSaleAmount ?? 0);
                acc.lastTotalAmountSumUpSale =
                    (acc.lastTotalAmountSumUpSale ?? 0) + parseFloat(lastItem.totalAmountSumUpSale ?? 0);
            } else {

                acc.lastTotalAmount = (acc.lastTotalAmount ?? null);
                acc.lastTotalOrder = (acc.lastTotalOrder ?? null);
                acc.lastOldOrder = (acc.lastOldOrder ?? null);
                acc.lastNewOrder = (acc.lastNewOrder ?? null);
                acc.lastOldSale = (acc.lastOldSale ?? null);
                acc.lastNewSale = (acc.lastNewSale ?? null);
                acc.lastTotalUpSale = (acc.lastTotalUpSale ?? null);
                acc.lastTotalUpSaleAmount = (acc.lastTotalUpSaleAmount ?? null);
                acc.lastTotalAmountSumUpSale = (acc.lastTotalAmountSumUpSale ?? null);
            }

            return acc;
        }, {});
    }, [filteredData, lastMonth]);

    if (isLoading) {
        return <Spinner size='lg' className='flex justify-center mx-auto' />;
    }

    const buildCardSections = (currentData, lastData) => {
        const oldFields = (orderType === 'new')
            ? []
            : [
                {
                    label: "ยอดขายลูกค้าเก่า",
                    value: parseFloat(currentData.oldSale ?? 0),
                    lastValue: lastData ? parseFloat(lastData.oldSale ?? 0) : null,
                    format: formatCurrencyNoDollars2Fixed
                },
                {
                    label: "ออเดอร์ลูกค้าเก่า",
                    value: parseFloat(currentData.oldOrder ?? 0),
                    lastValue: lastData ? parseFloat(lastData.oldOrder ?? 0) : null,
                    format: formatCurrencyNoDollars
                },
            ];

        const newFields = (orderType === 'old')
            ? []
            : [
                {
                    label: "ยอดขายลูกค้าใหม่",
                    value: parseFloat(currentData.newSale ?? 0),
                    lastValue: lastData ? parseFloat(lastData.newSale ?? 0) : null,
                    format: formatCurrencyNoDollars2Fixed
                },
                {
                    label: "ออเดอร์ลูกค้าใหม่",
                    value: parseFloat(currentData.newOrder ?? 0),
                    lastValue: lastData ? parseFloat(lastData.newOrder ?? 0) : null,
                    format: formatCurrencyNoDollars
                },
            ];

        let sections = [
            {
                label: "ยอดขายรวม",
                value: parseFloat(currentData.totalAmountSumUpSale ?? 0),
                lastValue: lastData ? parseFloat(lastData.totalAmountSumUpSale ?? 0) : null,
                format: formatCurrencyNoDollars2Fixed
            },
            {
                label: "ยอดขาย",
                value: parseFloat(currentData.totalAmount ?? 0),
                lastValue: lastData ? parseFloat(lastData.totalAmount ?? 0) : null,
                format: formatCurrencyNoDollars2Fixed
            },
            { divider: true },
        ];

        if (oldFields.length > 0) {
            sections.push(...oldFields);
            sections.push({ divider: true });
        }
        if (newFields.length > 0) {
            sections.push(...newFields);
            sections.push({ divider: true });
        }

        sections.push(
            {
                label: "ออเดอร์รวม",
                value: parseFloat(currentData.totalOrder ?? 0),
                lastValue: lastData ? parseFloat(lastData.totalOrder ?? 0) : null,
                format: formatCurrencyNoDollars
            },
            { divider: true },
            {
                label: "ยอดอัพเซล",
                value: parseFloat(currentData.totalUpSaleAmount ?? 0),
                lastValue: lastData ? parseFloat(lastData.totalUpSaleAmount ?? 0) : null,
                format: formatCurrencyNoDollars
            },
            {
                label: "ออเดอร์อัพเซล",
                value: parseFloat(currentData.totalUpSale ?? 0),
                lastValue: lastData ? parseFloat(lastData.totalUpSale ?? 0) : null,
                format: formatCurrencyNoDollars
            }
        );

        return sections;
    };

    return (
        <div>
            <section>
                <Card shadow="none" radius="sm" className="flex flex-col items-center">
                    <CardHeader className="w-full flex justify-center">
                        <span className="text-xl font-bold text-blue-500">
                            สรุปยอดขายทั้งหมด
                        </span>
                    </CardHeader>
                    <CardBody>
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                            {[
                                {
                                    title: "ยอดขายรวม",
                                    value: totalSum.totalAmountSumUpSale,
                                    lastValue: totalSum.lastTotalAmountSumUpSale,
                                    format: formatCurrencyNoDollars2Fixed
                                },
                                {
                                    title: "ยอดขาย",
                                    value: totalSum.totalAmount,
                                    lastValue: totalSum.lastTotalAmount,
                                    format: formatCurrencyNoDollars2Fixed
                                },
                                {
                                    title: "ยอดอัพเซล",
                                    value: totalSum.totalUpSaleAmount,
                                    lastValue: totalSum.lastTotalUpSaleAmount,
                                    format: formatCurrencyNoDollars2Fixed
                                },
                                {
                                    title: "ออเดอร์รวม",
                                    value: totalSum.totalOrder,
                                    lastValue: totalSum.lastTotalOrder,
                                    format: formatCurrencyNoDollars
                                },

                                ...(orderType === 'new'
                                    ? []
                                    : [{
                                        title: "ออเดอร์ลูกค้าเก่า",
                                        value: totalSum.oldOrder,
                                        lastValue: totalSum.lastOldOrder,
                                        format: formatCurrencyNoDollars,
                                        oldSale: totalSum.oldSale,
                                        lastOldSale: totalSum.lastOldSale
                                    }]
                                ),

                                ...(orderType === 'old'
                                    ? []
                                    : [{
                                        title: "ออเดอร์ลูกค้าใหม่",
                                        value: totalSum.newOrder,
                                        lastValue: totalSum.lastNewOrder,
                                        format: formatCurrencyNoDollars,
                                        newSale: totalSum.newSale,
                                        lastNewSale: totalSum.lastNewSale
                                    }]
                                ),
                                {
                                    title: "ออเดอร์อัพเซล",
                                    value: totalSum.totalUpSale,
                                    lastValue: totalSum.lastTotalUpSale,
                                    format: formatCurrencyNoDollars
                                }
                            ].map((item, idx) => {
                                const { difference, color, arrow } = getDifference(
                                    item.value,
                                    item.lastValue,
                                    item.format
                                );


                                const isOldOrNewOrder =
                                    item.title === "ออเดอร์ลูกค้าใหม่" ||
                                    item.title === "ออเดอร์ลูกค้าเก่า";

                                return (
                                    <Card
                                        key={idx}
                                        className="bg-blue-50"
                                        radius="md"
                                        shadow="none"
                                    >
                                        <CardBody className="relative">
                                            {isOldOrNewOrder && (
                                                <div className="absolute top-1 left-2">
                                                    <Popover showArrow offset={5} placement="top">
                                                        <PopoverTrigger>
                                                            <Button isIconOnly variant="light" color="primary">
                                                                <InfomationIcon size={20} />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent>
                                                            <div className="px-2 py-1 text-xs">
                                                                <div className="text-sm font-bold mb-1">
                                                                    รายละเอียด {item.title}
                                                                </div>
                                                                {item.title === "ออเดอร์ลูกค้าใหม่" ? (
                                                                    <>
                                                                        {typeof item.newSale === "number" &&
                                                                            typeof item.lastNewSale === "number" && (
                                                                                <div className="flex items-center gap-2 mt-1">
                                                                                    <span className='text-lg'>
                                                                                        ยอดขายลูกค้าใหม่:{" "}
                                                                                        {formatCurrencyNoDollars2Fixed(item.newSale)}
                                                                                    </span>
                                                                                    {(() => {
                                                                                        const diffSale = getDifference(
                                                                                            item.newSale,
                                                                                            item.lastNewSale,
                                                                                            formatCurrencyNoDollars2Fixed
                                                                                        );
                                                                                        return (
                                                                                            <span className={`font-bold text-sm ${diffSale.color}`}>
                                                                                                {diffSale.arrow} {diffSale.difference}
                                                                                            </span>
                                                                                        );
                                                                                    })()}
                                                                                </div>
                                                                            )}
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {typeof item.oldSale === "number" &&
                                                                            typeof item.lastOldSale === "number" && (
                                                                                <div className="flex items-center gap-2 mt-1">
                                                                                    <span className='text-lg'>
                                                                                        ยอดขายลูกค้าเก่า:{" "}
                                                                                        {formatCurrencyNoDollars2Fixed(item.oldSale)}
                                                                                    </span>
                                                                                    {(() => {
                                                                                        const diffSale = getDifference(
                                                                                            item.oldSale,
                                                                                            item.lastOldSale,
                                                                                            formatCurrencyNoDollars2Fixed
                                                                                        );
                                                                                        return (
                                                                                            <span className={`font-bold text-sm ${diffSale.color}`}>
                                                                                                {diffSale.arrow} {diffSale.difference}
                                                                                            </span>
                                                                                        );
                                                                                    })()}
                                                                                </div>
                                                                            )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            )}

                                            <div className="flex flex-col items-end">
                                                <span className="block text-gray-500 text-sm">
                                                    {item.title}
                                                </span>
                                                <div className="col-span-9 flex flex-col items-end text-right">
                                                    <span className="block text-2xl font-bold text-gray-800">
                                                        {item.format(item.value)}
                                                    </span>
                                                    <span
                                                        className={`text-xs font-bold flex items-center gap-1 ${color}`}
                                                    >
                                                        <span style={{ fontSize: "10px" }}>
                                                            {arrow}
                                                        </span>
                                                        {difference}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                );
                            })}
                        </div>
                    </CardBody>
                </Card>
            </section>

            <section className="py-4">
                <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:max-h-[60vh] overflow-y-auto scrollbar-hide">
                    {filteredData.map((item, idx) => {
                        const actualRank =
                            fullSortedData.findIndex(u => u.username === item.username) + 1;

                        const lastItem = Array.isArray(lastMonth)
                            ? lastMonth.find(l => l.username === item.username)
                            : null;

                        const currentMonthData = item;
                        const forcedLastData = lastItem ?? null;

                        const cardSections = buildCardSections(currentMonthData, forcedLastData);

                        return (
                            <Tooltip
                                content="กดเพื่อดูรายละเอียด"
                                color="primary"
                                key={`tooltip-${idx}`}
                            >
                                <Card
                                    shadow="none"
                                    radius="sm"
                                    isPressable
                                    onPress={() => {
                                        setSelectedCard({
                                            rank: actualRank,
                                            username: item.username,
                                            team: item.team,
                                            details: cardSections
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
                                                            ? "bg-[#fefbf0] text-[#f6a55a]"
                                                            : actualRank === 2
                                                                ? "bg-[#f4f9fb] text-[#acb1b8]"
                                                                : actualRank === 3
                                                                    ? "bg-[#F4E0D3] text-[#8B5E30]"
                                                                    : "bg-[#ebefff] text-[#8c8ccd]"
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
                                                {cardSections.map((sec, idx2) =>
                                                    sec.divider ? (
                                                        <Divider key={`divider-${idx2}`} />
                                                    ) : (
                                                        <div
                                                            key={`section-${idx2}`}
                                                            className="flex justify-between items-center"
                                                        >
                                                            <span className="text-sm">{sec.label}</span>
                                                            <div className="flex items-center gap-1">
                                                                <span className="font-bold text-sm">
                                                                    {sec.format(sec.value)}
                                                                </span>
                                                                {sec.lastValue != null && (
                                                                    <span
                                                                        className={`text-xs font-bold flex items-center gap-1 ${getComparisonColor(
                                                                            sec.value,
                                                                            sec.lastValue
                                                                        )}`}
                                                                    >
                                                                        {getDifference(sec.value, sec.lastValue).arrow}{" "}
                                                                        {sec.format(
                                                                            getDifference(sec.value, sec.lastValue).difference
                                                                        )}
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
            </section>

            <Modal isOpen={isOpen} onClose={onOpenChange}>
                <ModalContent>
                    {selectedCard && (
                        <>
                            <ModalHeader>
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
                                                ? "bg-[#fefbf0] text-[#f6a55a]"
                                                : selectedCard.rank === 2
                                                    ? "bg-[#f4f9fb] text-[#acb1b8]"
                                                    : selectedCard.rank === 3
                                                        ? "bg-[#F4E0D3] text-[#8B5E30]"
                                                        : "bg-[#ebefff] text-[#8c8ccd]"
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
                                        {selectedCard.team
                                            ? `ทีม ${selectedCard.team}`
                                            : "ยังไม่มีทีม"}
                                    </Chip>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <div className="space-y-4">
                                    {selectedCard.details.map((sec, i3) =>
                                        sec.divider ? (
                                            <Divider key={`divider-${i3}`} />
                                        ) : (
                                            <div
                                                key={`section-${i3}`}
                                                className="flex justify-between items-center"
                                            >
                                                <span className="text-sm">{sec.label}</span>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-bold text-sm">
                                                        {sec.format(sec.value)}
                                                    </span>
                                                    {sec.lastValue != null && (
                                                        <span
                                                            className={`text-xs font-bold flex items-center gap-1 ${getComparisonColor(
                                                                sec.value,
                                                                sec.lastValue
                                                            )}`}
                                                        >
                                                            {getDifference(sec.value, sec.lastValue).arrow}{" "}
                                                            {sec.format(
                                                                getDifference(sec.value, sec.lastValue).difference
                                                            )}
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
        </div>
    );
}

export default CardView;
