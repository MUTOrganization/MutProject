import React, { useMemo } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { Select, SelectItem, Card, CardBody, Divider, Chip, Button, Tooltip } from "@nextui-org/react";
import { HFRefresh } from "../../../component/Icons";

const ComparedModal = ({
    isOpen,
    onOpenChange,
    comparedSelectedUsername,
    setComparedSelectedUsername,
    comparedSelectedTeam,
    setComparedSelectedTeam,
    uniqueTeam,
    uniqueUsername,
    isLoading,
    data,
    talkTimeData,
}) => {

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return "0";
        const number = Number(amount);
        return `฿${number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    };

    const formatCurrencyNoDollars = (amount) => {
        if (amount === undefined || amount === null) return "0";
        const number = Number(amount);
        return `${number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    };

    const formatCurrencyNoDollars2Fixed = (amount) => {
        if (amount === undefined || amount === null) return "0";
        const number = Number(amount);
        return `${number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    };

    const getComparisonColor = (value1, value2) => {
        if (value1 > value2) return "text-green-600";
        if (value1 < value2) return "text-red-600";
        return "text-gray-500";
    };

    const getDifference = (value1, value2, format = (val) => val) => {
        const diff = value1 - value2;
        return {
            formattedDiff: format(Math.abs(diff)),
            color: diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : "text-gray-500",
            arrow: diff > 0 ? "▲" : diff < 0 ? "▼" : "",
        };
    };

    const filteredData = useMemo(() => {
        if (comparedSelectedTeam.length > 0) {
            return data?.currentMonth.filter((item) => comparedSelectedTeam.includes(item.team || "ยังไม่มีทีม"));
        }
        return data?.currentMonth.filter((item) => comparedSelectedUsername.includes(item.username));
    }, [data, comparedSelectedUsername, comparedSelectedTeam]);

    const talkTimeMap = useMemo(() => {
        return talkTimeData?.currentMonth?.reduce((map, talk) => {
            map[talk.adminUser] = talk;
            return map;
        }, {});
    }, [talkTimeData]);

    const aggregatedTeamData = useMemo(() => {
        if (comparedSelectedTeam.length > 0) {
            return comparedSelectedTeam.map((team) => {
                const teamData = data?.currentMonth.filter((item) => item.team === team || (!item.team && team === "ยังไม่มีทีม"));
                return teamData.reduce(
                    (sum, item) => {
                        const talkTimeItem = talkTimeData?.currentMonth?.find((talk) => talk.adminUser === item.username) || {};
                        return {
                            teamName: team,
                            totalAmountSumUpSale: (sum.totalAmountSumUpSale || 0) + (parseFloat(item.totalAmountSumUpSale) || 0),
                            totalAmount: (sum.totalAmount || 0) + (parseFloat(item.totalAmount) || 0),
                            totalOrder: (sum.totalOrder || 0) + (parseFloat(item.totalOrder) || 0),
                            oldOrder: (sum.oldOrder || 0) + (parseFloat(item.oldOrder) || 0),
                            newOrder: (sum.newOrder || 0) + (parseFloat(item.newOrder) || 0),
                            totalUpSaleAmount: (sum.totalUpSaleAmount || 0) + (parseFloat(item.totalUpSaleAmount) || 0),
                            totalUpSale: (sum.totalUpSale || 0) + (parseFloat(item.totalUpSale) || 0),
                            callIn: (sum.callIn || 0) + (parseInt(talkTimeItem.callIn) || 0),
                            callOut: (sum.callOut || 0) + (parseInt(talkTimeItem.callOut) || 0),
                            totalTime: (sum.totalTime || 0) + (parseFloat(talkTimeItem.totalTime) || 0),
                            averageTime: (sum.averageTime || 0) + (parseFloat(talkTimeItem.averageTime) || 0),
                        };
                    },
                    {
                        teamName: team,
                        totalAmountSumUpSale: 0,
                        totalAmount: 0,
                        totalOrder: 0,
                        oldOrder: 0,
                        newOrder: 0,
                        totalUpSaleAmount: 0,
                        totalUpSale: 0,
                        callIn: 0,
                        callOut: 0,
                        totalTime: 0,
                        averageTime: 0,
                    }
                );
            });
        }
        return [];
    }, [data, comparedSelectedTeam, talkTimeData]);

    const selectedData = filteredData.slice(0, 2);
    const isTeamComparison = comparedSelectedTeam.length === 2;

    const handleReset = () => {
        setComparedSelectedTeam([]);
        setComparedSelectedUsername([]);
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">เปรียบเทียบข้อมูล</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-1 space-x-4 items-center mb-12">
                                <Select
                                    label="ทีม"
                                    placeholder="เลือกทีม (เลือกได้ 2 ทีม)"
                                    variant="bordered"
                                    isLoading={isLoading}
                                    selectionMode="multiple"
                                    selectedKeys={new Set(comparedSelectedTeam)}
                                    onSelectionChange={(keys) => {
                                        const slicedKeys = Array.from(keys).slice(0, 2);
                                        setComparedSelectedTeam(slicedKeys);
                                    }}
                                    className="max-w-full"
                                >
                                    {uniqueTeam.map((team) => (
                                        <SelectItem key={team} value={team}>
                                            {team}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Select
                                    label="พนักงานขาย"
                                    placeholder="เลือกพนักงานขาย (เลือกได้ 2 คน)"
                                    variant="bordered"
                                    selectedKeys={new Set(comparedSelectedUsername)}
                                    selectionMode="multiple"
                                    isLoading={isLoading}
                                    onSelectionChange={(keys) => {
                                        const slicedKeys = Array.from(keys).slice(0, 2);
                                        setComparedSelectedUsername(slicedKeys);
                                    }}
                                    className="max-w-full"
                                >
                                    {uniqueUsername.map((username) => (
                                        <SelectItem key={username} value={username}>
                                            {username}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Tooltip content="รีเฟรช">
                                    <Button isIconOnly radius="lg" color="primary" variant="light" onPress={handleReset}>
                                        <HFRefresh size={24} />
                                    </Button>
                                </Tooltip>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {comparedSelectedTeam.length === 2
                                    ? aggregatedTeamData.map((teamData, idx) => {
                                        const otherTeamData = aggregatedTeamData[idx === 0 ? 1 : 0] || {};
                                        const cardSections = [
                                            { divider: true },
                                            { label: "จำนวนการรับสาย", value: teamData.callIn, compare: otherTeamData.callIn || 0, format: formatCurrencyNoDollars },
                                            { label: "จำนวนสายที่ได้คุย", value: teamData.callOut, compare: otherTeamData.callOut || 0, format: formatCurrencyNoDollars },
                                            { divider: true },
                                            { label: "ระยะเวลาการสนทนาทั้งหมด (นาที)", value: teamData.totalTime, compare: otherTeamData.totalTime || 0, format: formatCurrencyNoDollars2Fixed },
                                            { label: "ค่าเฉลี่ยระยะเวลาการสนทนาทั้งหมด (นาที)", value: teamData.averageTime, compare: otherTeamData.averageTime || 0, format: formatCurrencyNoDollars2Fixed },
                                        ];

                                        return (
                                            <Card key={idx} shadow="sm" radius="md">
                                                <CardBody>
                                                    <div className="w-full flex justify-between items-center mb-2">
                                                        <span className="font-bold">{teamData.teamName || "ยังไม่มีทีม"}</span>
                                                    </div>
                                                    <div className="space-y-2 w-full">
                                                        {cardSections.map((section, idx) => {
                                                            if (section.divider) return <Divider key={idx} />;
                                                            const { formattedDiff, color, arrow } = getDifference(
                                                                section.value || 0,
                                                                section.compare || 0,
                                                                section.format
                                                            );
                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    className="flex justify-between items-center"
                                                                >
                                                                    <span>{section.label}</span>
                                                                    <span className={`font-bold ${color} text-md`}>
                                                                        {section.format(section.value)}{" "}
                                                                        <span className="text-sm">
                                                                            {arrow} {formattedDiff}
                                                                        </span>
                                                                    </span>

                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        );
                                    })
                                    : comparedSelectedUsername.length === 2
                                        ? selectedData.map((item, idx) => {
                                            const otherUser = selectedData[idx === 0 ? 1 : 0] || {};
                                            const talkTimeCurrent = talkTimeMap[item.username] || {};
                                            const otherTalkTime = talkTimeMap[otherUser.username] || {};

                                            const cardSections = [
                                                { label: "จำนวนการรับสาย", value: talkTimeCurrent.callIn || 0, compare: otherTalkTime.callIn || 0, format: formatCurrencyNoDollars },
                                                { label: "จำนวนสายที่ได้คุย", value: talkTimeCurrent.callOut || 0, compare: otherTalkTime.callOut || 0, format: formatCurrencyNoDollars },
                                                { divider: true },
                                                { label: "ระยะเวลาการสนทนาทั้งหมด (นาที)", value: talkTimeCurrent.totalTime || 0, compare: otherTalkTime.totalTime || 0, format: formatCurrencyNoDollars2Fixed },
                                                { label: "ค่าเฉลี่ยระยะเวลาการสนทนาทั้งหมด (นาที)", value: talkTimeCurrent.averageTime || 0, compare: otherTalkTime.averageTime || 0, format: formatCurrencyNoDollars2Fixed },
                                            ];

                                            return (
                                                <Card key={idx} shadow="sm" radius="md">
                                                    <CardBody>
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-full flex justify-between items-center mb-2">
                                                                <span className="font-bold">{item.username}</span>
                                                                <Chip color="primary" variant="flat">{item.team || "ยังไม่มีทีม"}</Chip>
                                                            </div>
                                                            <Divider className="my-2" />
                                                            <div className="space-y-2 w-full">
                                                                {cardSections.map((section, idx) => {
                                                                    if (section.divider) return <Divider key={idx} />;
                                                                    const { formattedDiff, color, arrow } = getDifference(
                                                                        section.value || 0,
                                                                        section.compare || 0,
                                                                        section.format
                                                                    );
                                                                    return (
                                                                        <div
                                                                            key={idx}
                                                                            className="flex justify-between items-center"
                                                                        >
                                                                            <span className="text-md">{section.label}</span>
                                                                            <span className={`font-bold ${color} text-md`}>
                                                                                {section.format(section.value)}{" "}
                                                                                <span className="text-sm">
                                                                                    {arrow} {formattedDiff}
                                                                                </span>
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            );
                                        })
                                        : <div className="text-center text-gray-500 col-span-2">
                                            กรุณาเลือกทีมหรือพนักงานขายให้ครบ 2 เพื่อแสดงการเปรียบเทียบ
                                        </div>}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onPress={onClose}>
                                ปิด
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>

    );
};

export default ComparedModal;
