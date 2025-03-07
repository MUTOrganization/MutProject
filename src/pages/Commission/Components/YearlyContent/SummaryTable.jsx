import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { sortArray } from "../../../../../utils/arrayFunc";
import { CommissionData } from "./CommissionData";
import { cFormatter } from "../../../../../utils/numberFormatter";
import { useAppContext } from "../../../../contexts/AppContext";
import { Chip, CircularProgress, Spinner } from "@nextui-org/react";
import lodash from 'lodash';
/**
 * 
 * @param {{
 *    data: [CommissionData],
 *    isLoading: Boolean,
 * }} param0 
 * @returns 
 */
export default function SummaryTable({ data, isLoading, selectedYear}){
    const {currentUser} = useAppContext()
    const currentDate = {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    }
    const userData = {
        departmentName: currentUser.department, 
        roleName: currentUser.role, 
        probStatus: currentUser.probStatus
    }
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "monthIndex",
        direction: "ascending",
    })
    const monthStr = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
        'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
        'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
    ]

    const sortedRows = useMemo(() => {
        return sortArray(data, sortDescriptor.column, sortDescriptor.direction);
    },[sortDescriptor, data])

    
 
    return(
        <div>
            <Table
                aria-label="summaryTable"
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
                removeWrapper
                
            >
                <TableHeader>
                    <TableColumn key={'monthIndex'} align="center" allowsSorting >เดือน</TableColumn>
                    <TableColumn key={'orderCount'} align="end" allowsSorting >จำนวนออเดอร์</TableColumn>
                    <TableColumn key={'totalIncome'} align="end" allowsSorting >ยอดเงินเข้ารวม</TableColumn>
                    <TableColumn key={'netIncome'} align="end" allowsSorting >ยอดเงินสุทธิ</TableColumn>
                    <TableColumn key={'commission'} align="end" allowsSorting >คอมมิชชั่น</TableColumn>
                </TableHeader>
                <TableBody items={sortedRows} loadingContent={<Spinner />}  isLoading={isLoading}>
                    {sortedRows.map(item => {
                        const fields = ['orderCount','totalIncome','netIncome','commission'];
                        return(
                            <TableRow key={item.monthIndex}>
                                <TableCell className="text-center">{item.monthIndex + 1} {/*currentDate.year === selectedYear && currentDate.month === item.monthIndex + 1 && '(ปัจจุบัน)'*/}</TableCell>
                                {
                                    fields.map(field => {
                                        const value = field === 'orderCount' ? cFormatter(item[field], 0) : cFormatter(item[field], 2)
                                        return(
                                            <TableCell key={field} className="text-end px-6">{value}</TableCell>
                                        )
                                    })
                                }
                            </TableRow>
                        )
                    } )}
                    <TableRow className="sticky bottom-0 bg-slate-200 border-0 z-10 rounded-lg">
                        <TableCell className="font-bold">รวม</TableCell>
                        <TableCell className="font-bold px-6">{cFormatter(lodash.sumBy(data,'orderCount'),0)}</TableCell>
                        <TableCell className="font-bold px-6">{cFormatter(lodash.sumBy(data,'totalIncome'),2)}</TableCell>
                        <TableCell className="font-bold px-6">{cFormatter(lodash.sumBy(data,'netIncome'),2)}</TableCell>
                        <TableCell className="font-bold px-6">{cFormatter(lodash.sumBy(data,'commission'),2)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}