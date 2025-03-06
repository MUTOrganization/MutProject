import React, { useMemo, useEffect } from "react";
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
    talkTimedata,
    leaderData
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
        const currentMonthData = data?.currentMonth || [];

        if (comparedSelectedTeam.length > 0) {
            return currentMonthData.filter((item) =>
                comparedSelectedTeam.includes(item.team || "ยังไม่มีทีม")
            );
        }

        return currentMonthData.filter((item) =>
            comparedSelectedUsername.includes(item.username)
        );
    }, [data, comparedSelectedUsername, comparedSelectedTeam]);

    const talkTimeMap = useMemo(() => {
        return talkTimedata?.currentMonth?.reduce((map, talk) => {
            map[talk.adminUser] = talk;
            return map;
        }, {});
    }, [talkTimedata]);

    const aggregatedTeamData = useMemo(() => {
        if (comparedSelectedTeam.length > 0) {
            return comparedSelectedTeam.map((team) => {
                const teamData = data?.currentMonth?.filter((item) =>
                    item.team === team || (!item.team && team === "ยังไม่มีทีม")
                ) || [];

                return teamData.reduce(
                    (sum, item) => {
                        const talkTimeItem = talkTimedata?.currentMonth?.find((talk) => talk.adminUser === item.username) || {};
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
    }, [data, comparedSelectedTeam, talkTimedata]);

    const selectedData = filteredData.slice(0, 2);
    const isTeamComparison = comparedSelectedTeam.length === 2;

    const handleReset = () => {
        setComparedSelectedTeam([]);
        setComparedSelectedUsername([]);
    }

    useEffect(() => {
        if (leaderData?.isLeader && leaderData?.teams?.length > 0) {
            setComparedSelectedTeam(leaderData.teams);
        } else if (leaderData?.isLeader && (!leaderData?.teams || leaderData?.teams.length === 0)) {
            setComparedSelectedTeam([]);
        }
    }, [leaderData, setComparedSelectedTeam]);

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">เปรียบเทียบข้อมูล</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-1 space-x-4 py-4 items-center">
                                <Select
                                    label="ทีม"
                                    placeholder={
                                        leaderData?.isManager
                                            ? "เลือกทีม"
                                            : leaderData?.isLeader
                                                ? "ทีมของคุณถูกล็อกไว้"
                                                : leaderData?.isStaff
                                                    ? "ทีมของคุณ"
                                                    : "ไม่มีข้อมูลทีม"
                                    }
                                    isDisabled={!leaderData?.isManager && (leaderData?.isLeader || leaderData?.isStaff)}
                                    variant="bordered"
                                    isLoading={isLoading}
                                    selectionMode="multiple"
                                    selectedKeys={new Set(comparedSelectedTeam)}
                                    onSelectionChange={(keys) => setComparedSelectedTeam(Array.from(keys).slice(0, 2))}
                                    className="max-w-full w-full"
                                >
                                    {leaderData?.isManager &&
                                        uniqueTeam.map((team) => (
                                            <SelectItem key={team} value={team}>
                                                {team}
                                            </SelectItem>
                                        ))}

                                    {!leaderData?.isManager &&
                                        leaderData?.teams?.map((team) => (
                                            <SelectItem key={team} value={team}>
                                                {team}
                                            </SelectItem>
                                        ))}
                                </Select>
                                <Select
                                    label="เลือกพนักงานขาย (เลือกได้ 2 คน)"
                                    placeholder={
                                        leaderData?.isManager
                                            ? "เลือกพนักงานขาย"
                                            : leaderData?.isLeader
                                                ? "พนักงานขายในทีมของคุณ"
                                                : leaderData?.isStaff
                                                    ? "พนักงานขายของคุณ"
                                                    : "ไม่มีข้อมูลพนักงานขาย"
                                    }
                                    variant="bordered"
                                    selectionMode="multiple"
                                    selectedKeys={new Set(comparedSelectedUsername)}
                                    onSelectionChange={(keys) =>
                                        setComparedSelectedUsername(Array.from(keys).slice(0, 2))
                                    }
                                    isLoading={isLoading}
                                    className="max-w-full w-full"
                                >
                                    {uniqueUsername
                                        .filter(([username, team]) => {

                                            if (leaderData?.isManager) {
                                                return true;
                                            }

                                            if (leaderData?.isLeader && leaderData?.teams) {
                                                return leaderData.teams.includes(team);
                                            }

                                            if (leaderData?.isStaff) {
                                                return username === leaderData.username;
                                            }

                                            return false;
                                        })
                                        .map(([username]) => (
                                            <SelectItem key={username} value={username}>
                                                {username}
                                            </SelectItem>
                                        ))}
                                </Select>
                                <Tooltip content='รีเฟรช'>
                                    <Button isIconOnly radius='lg' color='primary' variant='light' onPress={handleReset}>
                                        <HFRefresh size={24} />
                                    </Button>
                                </Tooltip>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {comparedSelectedTeam.length === 2
                                    ? aggregatedTeamData.map((teamData, idx) => {
                                        const otherTeamData = aggregatedTeamData[idx === 0 ? 1 : 0] || {};
                                        const cardSections = [
                                            { label: "ยอดขายรวม", value: teamData.totalAmountSumUpSale, compare: otherTeamData.totalAmountSumUpSale || 0, format: formatCurrency },
                                            { label: "ยอดขาย", value: teamData.totalAmount, compare: otherTeamData.totalAmount || 0, format: formatCurrency },
                                            { divider: true },
                                            { label: "ออเดอร์รวม", value: teamData.totalOrder, compare: otherTeamData.totalOrder || 0, format: formatCurrencyNoDollars },
                                            { label: "ออเดอร์ลูกค้าเก่า", value: teamData.oldOrder, compare: otherTeamData.oldOrder || 0, format: formatCurrencyNoDollars },
                                            { label: "ออเดอร์ลูกค้าใหม่", value: teamData.newOrder, compare: otherTeamData.newOrder || 0, format: formatCurrencyNoDollars },
                                            { divider: true },
                                            { label: "ยอดอัพเซล", value: teamData.totalUpSaleAmount, compare: otherTeamData.totalUpSaleAmount || 0, format: formatCurrency },
                                            { label: "ออเดอร์อัพเซล", value: teamData.totalUpSale, compare: otherTeamData.totalUpSale || 0, format: formatCurrencyNoDollars },
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

                                            const cardSections = [
                                                { label: "ยอดขายรวม", value: item.totalAmountSumUpSale, compare: otherUser.totalAmountSumUpSale || 0, format: formatCurrency },
                                                { label: "ยอดขาย", value: item.totalAmount, compare: otherUser.totalAmount || 0, format: formatCurrency },
                                                { divider: true },
                                                { label: "ออเดอร์รวม", value: item.totalOrder, compare: otherUser.totalOrder || 0, format: formatCurrencyNoDollars },
                                                { label: "ออเดอร์ลูกค้าเก่า", value: item.oldOrder, compare: otherUser.oldOrder || 0, format: formatCurrencyNoDollars },
                                                { label: "ออเดอร์ลูกค้าใหม่", value: item.newOrder, compare: otherUser.newOrder || 0, format: formatCurrencyNoDollars },
                                                { divider: true },
                                                { label: "ยอดอัพเซล", value: item.totalUpSaleAmount, compare: otherUser.totalUpSaleAmount || 0, format: formatCurrency },
                                                { label: "ออเดอร์อัพเซล", value: item.totalUpSale, compare: otherUser.totalUpSale || 0, format: formatCurrencyNoDollars },
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
