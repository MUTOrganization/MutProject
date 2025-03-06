import React, { useState, useMemo, useImperativeHandle, forwardRef } from 'react';
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell
} from '@nextui-org/table';
import { Card, Chip, Spinner } from '@nextui-org/react';
import { formatCurrencyNoDollars2Fixed, formatCurrencyNoDollars } from '@/pages/DashboardOverView/utils/currencyUtils';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function TalkTimeTable(
    {
        data,
        talkTimeData,
        selectedUsername,
        selectedTeam,
        findUsername,
        isLoading,
    },
    ref
) {
    const [sortDescriptor, setSortDescriptor] = useState({
        column: 'username',
        direction: 'ascending'
    });

    const currentMonthData = data?.currentMonth || [];
    const talkTimeCurrent = talkTimeData?.currentMonth || [];

    const mergedData = useMemo(() => {
        const talkMap = new Map(talkTimeCurrent.map(t => [t.adminUser, t]));
        return currentMonthData.map(item => {
            const t = talkMap.get(item.username) || {};
            return {
                ...item,
                callIn: t.callIn || 0,
                callOut: t.callOut || 0,
                totalCall: t.totalCall || 0,
                totalTime: t.totalTime || 0,
                averageTime: t.averageTime || 0
            };
        });
    }, [currentMonthData, talkTimeCurrent]);

    const filteredData = useMemo(() => {
        let filtered = [...mergedData];

        if (selectedTeam?.length > 0) {
            filtered = filtered.filter(item => {
                const teamName = item.team || 'ยังไม่มีทีม';
                return selectedTeam.includes(teamName);
            });
        }

        if (selectedUsername?.length > 0) {
            filtered = filtered.filter(item => selectedUsername.includes(item.username));
        }

        if (findUsername && typeof findUsername === 'string') {
            const lower = findUsername.toLowerCase();
            filtered = filtered.filter(item => {
                const uname = (item.username || '').toLowerCase();
                const name = (item.name || '').toLowerCase();
                const nick = (item.nickName || '').toLowerCase();
                return uname.includes(lower) || name.includes(lower) || nick.includes(lower);
            });
        }

        return filtered;
    }, [mergedData, selectedTeam, selectedUsername, findUsername]);

    const compareValues = (a, b, columnKey) => {
        switch (columnKey) {
            case 'username':
                return (a.username || '').localeCompare(b.username || '');
            case 'team':
                return (a.team || '').localeCompare(b.team || '');
            case 'callIn':
                return (Number(a.callIn) || 0) - (Number(b.callIn) || 0);
            case 'callOut':
                return (Number(a.callOut) || 0) - (Number(b.callOut) || 0);
            case 'totalCall':
                return (Number(a.totalCall) || 0) - (Number(b.totalCall) || 0);
            case 'totalTime':
                return (Number(a.totalTime) || 0) - (Number(b.totalTime) || 0);
            case 'avgTime': {
                const aAvg = (a.totalCall || 0) > 0 ? a.totalTime / a.totalCall : 0;
                const bAvg = (b.totalCall || 0) > 0 ? b.totalTime / b.totalCall : 0;
                return aAvg - bAvg;
            }
            default:
                return 0;
        }
    };

    const sortedData = useMemo(() => {
        const { column, direction } = sortDescriptor;
        const sorted = [...filteredData];
        sorted.sort((a, b) => {
            const cmp = compareValues(a, b, column);
            return direction === 'descending' ? -cmp : cmp;
        });
        return sorted;
    }, [filteredData, sortDescriptor]);

    const { sumCallIn, sumCallOut, sumTotalCall, sumTotalTime, overallAvg } = useMemo(() => {
        let callIn = 0;
        let callOut = 0;
        let totalCall = 0;
        let totalTime = 0;

        sortedData.forEach(item => {
            callIn += Number(item.callIn || 0);
            callOut += Number(item.callOut || 0);
            totalCall += Number(item.totalCall || 0);
            totalTime += Number(item.totalTime || 0);
        });

        const avg = totalCall > 0 ? (totalTime / totalCall).toFixed(2) : '0.00';

        return {
            sumCallIn: callIn,
            sumCallOut: callOut,
            sumTotalCall: totalCall,
            sumTotalTime: totalTime,
            overallAvg: avg
        };
    }, [sortedData]);

    const classNames = useMemo(
        () => ({
            row: ['hover:bg-blue-200', 'group', 'transition-colors', 'duration-300'],
            td: ['p-2', 'border-b', 'border-gray-100', 'group-hover:bg-blue-50']
        }),
        []
    );

    // 2) ประกาศฟังก์ชัน exportToExcel ไว้ใน component ลูก
    const exportToExcel = () => {
        try {
            // เตรียมข้อมูลให้อยู่ในรูป Array ของ Object
            // หรือรูป JSON เพื่อส่งเข้า XLSX.utils.json_to_sheet ได้
            const exportData = sortedData.map(item => {
                const totalCall = Number(item.totalCall) || 0;
                const totalTime = Number(item.totalTime) || 0;
                const avgTime = totalCall > 0 ? (totalTime / totalCall).toFixed(2) : '0.00';

                return {
                    'พนักงานขาย': item.username,
                    'ทีม': item.team || 'ยังไม่มีทีม',
                    'สายเข้า (Call In)': item.callIn || 0,
                    'สายออก (Call Out)': item.callOut || 0,
                    'รวมจำนวนสาย': totalCall,
                    'รวมเวลาคุย (นาที)': totalTime,
                    'ค่าเฉลี่ย (นาที/สาย)': avgTime
                };
            });

            // สร้าง Worksheet จาก JSON
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            // สร้าง Workbook ใหม่
            const workbook = XLSX.utils.book_new();
            // เพิ่ม Worksheet ลงใน Workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'TalkTime');

            // บันทึกไฟล์เป็น .xlsx
            XLSX.writeFile(workbook, 'talk_time_export.xlsx');
        } catch (err) {
            console.error('Export Excel Error: ', err);
        }
    };

    // 3) ทำให้ฟังก์ชัน exportToExcel สามารถถูกเรียกจากภายนอกผ่าน ref
    useImperativeHandle(ref, () => ({
        exportToExcel
    }));

    return isLoading ? (
        <Spinner />
    ) : (
        <Card shadow="none" radius="sm" className="p-2">
            <Table
                aria-label="สถิติการโทร (ตาราง)"
                className="max-h-[500px] overflow-y-auto scrollbar-hide"
                isHeaderSticky
                removeWrapper
                shadow="none"
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
                classNames={classNames}
            >
                <TableHeader>
                    <TableColumn key="username" allowsSorting className="text-sm">
                        พนักงานขาย
                    </TableColumn>
                    <TableColumn key="team" allowsSorting className="text-sm">
                        ทีม
                    </TableColumn>
                    <TableColumn key="callIn" allowsSorting className="text-sm">
                        จำนวนสายเข้า (สาย)
                    </TableColumn>
                    <TableColumn key="callOut" allowsSorting className="text-sm">
                        จำนวนสายออก (สาย)
                    </TableColumn>
                    <TableColumn key="totalCall" allowsSorting className="text-sm">
                        รวมจำนวนสาย
                    </TableColumn>
                    <TableColumn key="totalTime" allowsSorting className="text-sm">
                        ระยะเวลาการสนทนา (นาที)
                    </TableColumn>
                    <TableColumn key="avgTime" allowsSorting className="text-sm">
                        ค่าเฉลี่ย (นาที/สาย)
                    </TableColumn>
                </TableHeader>
                <TableBody emptyContent="ไม่พบข้อมูล">
                    {sortedData.map((item, index) => {
                        const totalCall = Number(item.totalCall) || 0;
                        const totalTime = Number(item.totalTime) || 0;
                        const avgTime = totalCall > 0 ? (totalTime / totalCall).toFixed(2) : '0.00';

                        return (
                            <TableRow key={item.username || index}>
                                <TableCell>{item.username}</TableCell>
                                <TableCell>
                                    <Chip color="primary" variant="flat">
                                        {item.team || 'ยังไม่มีทีม'}
                                    </Chip>
                                </TableCell>
                                <TableCell>{formatCurrencyNoDollars(item.callIn || 0)}</TableCell>
                                <TableCell>{formatCurrencyNoDollars(item.callOut || 0)}</TableCell>
                                <TableCell>{formatCurrencyNoDollars(totalCall)}</TableCell>
                                <TableCell>{formatCurrencyNoDollars2Fixed(totalTime)}</TableCell>
                                <TableCell>{avgTime}</TableCell>
                            </TableRow>
                        );
                    })}
                    {sortedData.length > 0 && (
                        <TableRow className="bg-slate-200 border-0 sticky bottom-0 p-2">
                            <TableCell
                                className="font-bold"
                                style={{ borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}
                            >
                                รวมทั้งหมด
                            </TableCell>
                            <TableCell className="font-bold" />
                            <TableCell className="font-bold">
                                {formatCurrencyNoDollars(sumCallIn)}
                            </TableCell>
                            <TableCell className="font-bold">
                                {formatCurrencyNoDollars(sumCallOut)}
                            </TableCell>
                            <TableCell className="font-bold">
                                {formatCurrencyNoDollars(sumTotalCall)}
                            </TableCell>
                            <TableCell className="font-bold">
                                {formatCurrencyNoDollars2Fixed(sumTotalTime)}
                            </TableCell>
                            <TableCell
                                className="font-bold"
                                style={{ borderTopRightRadius: 4, borderBottomRightRadius: 4 }}
                            >
                                {overallAvg}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Card>
    );
}

export default forwardRef(TalkTimeTable);
