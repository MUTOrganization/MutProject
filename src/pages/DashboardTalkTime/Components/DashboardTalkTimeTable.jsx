import React, { useMemo } from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

function DashboardTalkTimeTable({ data = [], talkTimeData = {}, selectedTeam = [], selectedUsername = [] }) {
    // Merge `team` from `data` into `talkTimeData`
    const mergedTalkTimeData = useMemo(() => {
        if (!talkTimeData?.currentMonth) return [];

        const dataMap = new Map(data.map(item => [item.username, item.team || "ยังไม่มีทีม"]));

        return talkTimeData.currentMonth.map(item => ({
            ...item,
            team: dataMap.get(item.adminUser) || "ยังไม่มีทีม",
        }));
    }, [data, talkTimeData]);

    // Filter based on selectedTeam and selectedUsername
    const filteredData = useMemo(() => {
        if (!mergedTalkTimeData.length) return [];

        let filtered = mergedTalkTimeData;

        if (selectedTeam.length > 0) {
            filtered = filtered.filter(item => selectedTeam.includes(item.team));
        }

        if (selectedUsername.length > 0) {
            filtered = filtered.filter(item => selectedUsername.includes(item.adminUser));
        }

        return filtered;
    }, [mergedTalkTimeData, selectedTeam, selectedUsername]);
    
    return (
        <Card shadow="none" radius="sm">
            <CardBody>
                <Table removeWrapper shadow="none" radius="md" className="max-h-[720px] overflow-y-auto scrollbar-hide">
                    <TableHeader>
                        <TableColumn className="text-center">พนักงานขาย</TableColumn>
                        <TableColumn className="text-center">ทีม</TableColumn>
                        <TableColumn className="text-center">จำนวนการรับสาย</TableColumn>
                        <TableColumn className="text-center">จำนวนสายที่ได้คุย</TableColumn>
                        <TableColumn className="text-center">ระยะเวลาการสนทนา (นาที)</TableColumn>
                        <TableColumn className="text-center">ค่าเฉลี่ยระยะเวลาการสนทนา (นาที)</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {filteredData.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="text-center">{item.adminUser}</TableCell>
                                <TableCell className="text-center">{item.team}</TableCell>
                                <TableCell className="text-center">{item.callIn || 0}</TableCell>
                                <TableCell className="text-center">{item.callOut || 0}</TableCell>
                                <TableCell className="text-center">{parseFloat(item.totalTime || 0).toFixed(2)}</TableCell>
                                <TableCell className="text-center">
                                    {item.totalCall > 0
                                        ? (parseFloat(item.totalTime || 0) / item.totalCall).toFixed(2)
                                        : "0.00"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardBody>
        </Card>
    );
}

export default DashboardTalkTimeTable;
