import React, { useState, useMemo } from 'react'
import { Card, Spinner, Chip, Button, Tooltip } from "@heroui/react"
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell
} from "@heroui/react";
import {
    Modal,
    ModalContent,
    ModalBody,
} from "@heroui/react";
import { useCommissionContext } from '../CommissionContext';
import { cFormatter } from '@/utils/numberFormatter';
import { CommissionData } from './YearlyContent/CommissionData';

function ownCommission({ isLoading, userList }) {
    const ctx = useCommissionContext();
    const sumCommData = ctx.commData;
    const [isMoreInfoModalOpen, setIsMoreInfoModalOpen] = useState(false);
    const usersCommData = useMemo(() => {
        return userList.map(user => {
            const findUser = ctx.usersCommData.find(e => e.username === user.username)
            if(findUser){
                return findUser
            }else{
                return {
                    username: user.username,
                    probStatus: user.probStatus,
                    depId: user.depId,
                    depName: user.depName,
                    roleId: user.roleId,
                    roleName: user.roleName,
                    teamId: user.teamId,
                    teamName: user.teamName,
                    data: new CommissionData({},{})
                }
            }
        })
    },[ctx.usersCommData, userList])

    const [sortDescriptor, setSortDescriptor] = useState({
        column: 'username',
        direction: 'ascending'
    });

    const tableFormattedUserCommData = useMemo(() => {
        return usersCommData.map(item => {
            return {
                username: item.username,
                depId: item.depId,
                depName: item.depName,
                roleId: item.roleId,
                roleName: item.roleName,
                teamId: item.teamId,
                team: item.teamName ?? '--',
                paidIncome: item.data.adminPaidIncome + item.data.upsalePaidIncome,
                liftIncome: item.data.adminLiftIncome + item.data.upsaleLiftIncome,
                nextLiftIncome: item.data.adminNextLiftIncome + item.data.upsaleNextLiftIncome,
                nextLiftAndUnpaid: item.data.adminNextLiftIncome + item.data.upsaleNextLiftIncome + item.data.adminUnpaid + item.data.upsaleUnpaid,
                delivery: item.data.adminDelivery + item.data.upsaleDelivery,
                liftDelivery: item.data.adminLiftDelivery + item.data.upsaleLiftDelivery,
                nextLiftDelivery: item.data.adminNextLiftDelivery + item.data.upsaleNextLiftDelivery,
                totalIncome: item.data.totalIncome,
                totalDelivery: item.data.totalDelivery,
                netIncome: item.data.netIncome,
                commission: item.data.commission,
                incentive: item.data.incentive,
            }
        })
    }, [usersCommData]);
    const sortedUsersCommData = useMemo(() => {
        return [...tableFormattedUserCommData].sort((a, b) => {
            if(sortDescriptor.column === 'username'){
                const factor = sortDescriptor.direction === 'ascending' ? 1 : -1;
                return factor * (a[sortDescriptor.column].localeCompare(b[sortDescriptor.column]));
            }else if(sortDescriptor.column === 'team'){
                const factor = sortDescriptor.direction === 'ascending' ? 1 : -1;
                const aValue = a[sortDescriptor.column] ?? '';
                const bValue = b[sortDescriptor.column] ?? '';
                return factor * (aValue.localeCompare(bValue));
            }else {
                const factor = sortDescriptor.direction === 'ascending' ? 1 : -1;
                return factor * (a[sortDescriptor.column] - b[sortDescriptor.column]);
            }

        });
    }, [tableFormattedUserCommData, sortDescriptor]);

    const tableColumns = [
        { name: 'username', text: 'ชื่อ' },
        { name: 'team', text: 'ทีม' },
        { name: 'paidIncome', text: 'ยอดเงินเข้า' },
        { name: 'liftIncome', text: 'ยอดยก' },
        { name: 'nextLiftIncome', text: 'ยอดยกไปเดือนหน้า' },
        { name: 'delivery', text: 'ค่าส่ง' },
        { name: 'liftDelivery', text: 'ยอดยกค่าส่ง' },
        { name: 'nextLiftDelivery', text: 'ยอดยกค่าส่งไปเดือนหน้า' },
        { name: 'totalIncome', text: 'ยอดเงินเข้ารวม' },
        { name: 'totalDelivery', text: 'ยอดค่าส่งรวม' },
        { name: 'netIncome', text: 'ยอดเงินเข้าสุทธิ' },
        { name: 'commission', text: 'ค่าคอมมิชชั่น' },
        { name: 'incentive', text: 'ค่าอินเซนทีฟ' },
        { name: 'detail', text: '' }
    ]

    
    const classNames = useMemo(() => ({
        row: [
            "hover:bg-blue-200",
            "group",
            "transition-colors",
            "duration-300",
        ],
        td: [
            "border-b",
            "border-gray-100",
            "text-center",
            "group-hover:bg-blue-50",
        ],
    }), []);

    return (
        <div>

            <Card radius='sm' shadow='none' className='p-2'>
                <div className='shadow-none'>
                    <Table
                        className="max-h-[720px] overflow-y-auto overflow-x-auto scrollbar-hide"
                        classNames={classNames}
                        isHeaderSticky
                        radius='sm'
                        color='primary'
                        removeWrapper
                        sortDescriptor={sortDescriptor}
                        onSortChange={(sortDescriptor) => setSortDescriptor(sortDescriptor)}
                    >
                        <TableHeader columns={tableColumns} className="text-center">
                            {(column) => (
                                <TableColumn
                                    key={column.name}
                                    className={`text-sm ${column.name === 'username' ? 'text-start' : 'text-end'}`}
                                    allowsSorting={column.name === 'detail' ? false : true}
                                >
                                    {column.text}
    
                                </TableColumn>
    
                            )}
                        </TableHeader>
                        <TableBody items={sortedUsersCommData} emptyContent={"ไม่พบข้อมูล"}
                            loadingState={isLoading ? "loading" : undefined}
                            isLoading={isLoading}
                            loadingContent={<Spinner color="primary" />}
    
                        >
                            {sortedUsersCommData.map(item => {
                                const className = 'text-bold text-sm text-end';
                                const data = item.data;
                                return (
                                    <TableRow key={item.username}>
                                        <TableCell className={className + ' !text-start'}>{item.username}</TableCell>
                                        <TableCell className={className + ' !text-start'}>{item.team}</TableCell>
                                        <TableCell className={className}>{cFormatter(item.paidIncome, 2)}</TableCell>
                                        <TableCell className={className}>{cFormatter(item.liftIncome, 2)}</TableCell>
                                        <TableCell className={className + '!text-center'}>
                                            <div>
                                                <Tooltip
                                                    content={`เข้าแล้ว: ${cFormatter(item.nextLiftIncome, 2)}  / ${cFormatter(item.nextLiftAndUnpaid, 2)}`}
                                                    color='primary'
                                                    className='text-white text-md'
                                                >
    
                                                    <Chip color='primary' variant='flat' size='sm' className='cursor-pointer'>
                                                        {cFormatter(item.nextLiftIncome, 2)}
                                                    </Chip>
                                                </Tooltip>
                                            </div>
    
                                        </TableCell>
                                        <TableCell className={className}>{cFormatter(item.delivery, 2)}</TableCell>
                                        <TableCell className={className}>{cFormatter(item.liftDelivery, 2)}</TableCell>
                                        <TableCell className={className}>{cFormatter(item.nextLiftDelivery, 2)}</TableCell>
                                        <TableCell className={className}>{cFormatter(item.totalIncome, 2)}</TableCell>
                                        <TableCell className={className}>{cFormatter(item.totalDelivery, 2)}</TableCell>
                                        <TableCell className={className}>{cFormatter(item.netIncome, 2)}</TableCell>
                                        <TableCell className={className}>{cFormatter(item.commission, 2)}</TableCell>
                                        <TableCell className={className}>{cFormatter(item.incentive, 2)}</TableCell>
                                        <TableCell className={className}>
                                            <Button 
                                                size='sm' 
                                                color='primary' 
                                                variant='flat' 
                                                radius='lg'
                                                className='cursor-pointer' 
                                                onPress={() => setIsMoreInfoModalOpen(true)}
                                            >
                                                ดูข้อมูลเพิ่มเติม
                                            </Button>
                                        </TableCell>
    
                                    </TableRow>
                                )
                            })}
                            <TableRow className='sticky bottom-0 bg-slate-100 border-0 z-10 rounded-lg'>
                                <TableCell className='font-bold text-center'>รวม</TableCell>
                                <TableCell className='font-bold text-center'></TableCell>
                                <TableCell className='font-bold text-end'>{cFormatter(sumCommData.adminPaidIncome + sumCommData.upsalePaidIncome, 2)}</TableCell>
                                <TableCell className='font-bold text-end'>{cFormatter(sumCommData.adminLiftIncome + sumCommData.upsaleLiftIncome, 2)}</TableCell>
                                <TableCell className='text-center'>
                                    <div>
                                        <Tooltip
                                            content={`เข้าแล้ว: ${cFormatter(sumCommData.adminNextLiftIncome + sumCommData.upsaleNextLiftIncome, 2)}  / ${cFormatter(sumCommData.adminNextLiftIncome + sumCommData.upsaleNextLiftIncome + sumCommData.adminUnpaid + sumCommData.upsaleUnpaid, 2)}`}
                                            color='primary'
                                            className='text-white text-md'
                                        >
                                            <Chip color='primary' variant='flat' size='sm' className='cursor-pointer'>
                                                <div className='font-bold'>
                                                    {cFormatter(sumCommData.adminNextLiftIncome + sumCommData.upsaleNextLiftIncome, 2)}
                                                </div>
                                            </Chip>
                                        </Tooltip>
                                    </div>
                                </TableCell>
                                <TableCell className='font-bold text-end'>{cFormatter(sumCommData.adminDelivery + sumCommData.upsaleDelivery, 2)}</TableCell>
                                <TableCell className='font-bold text-end'>{cFormatter(sumCommData.adminLiftDelivery + sumCommData.upsaleLiftDelivery, 2)}</TableCell>
                                <TableCell className='font-bold text-end'>{cFormatter(sumCommData.adminNextLiftDelivery + sumCommData.upsaleNextLiftDelivery, 2)}</TableCell>
                                <TableCell className='font-bold text-end'>{cFormatter(sumCommData.totalIncome, 2)}</TableCell>
                                <TableCell className='font-bold text-end'>{cFormatter(sumCommData.totalDelivery, 2)}</TableCell>
                                <TableCell className='font-bold text-end'>{cFormatter(sumCommData.netIncome, 2)}</TableCell>
                                <TableCell className='font-bold text-end'>{cFormatter(sumCommData.commission, 2)}</TableCell>
                                <TableCell className='font-bold text-end'>{cFormatter(sumCommData.incentive, 2)}</TableCell>
                                <TableCell className='font-bold text-end'></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </Card>
            <DetailModal isOpen={isMoreInfoModalOpen} onClose={() => setIsMoreInfoModalOpen(false)} data={usersCommData} isLoading={isLoading} sumCommData={sumCommData} />
        </div>
    )
}

export default ownCommission

function DetailModal({isOpen, onClose, data, isLoading, sumCommData}){

    const [sortDescriptor, setSortDescriptor] = useState({
        column: 'username',
        direction: 'ascending'
    });
    const tableFormattedData = useMemo(() => {
        return data.map(item => {
            return {
                username: item.username,
                depId: item.depId,
                depName: item.depName,
                roleId: item.roleId,
                roleName: item.roleName,
                teamId: item.teamId,
                team: item.teamName ?? '--',
                adminPaidIncome: item.data.adminPaidIncome,
                upsalePaidIncome: item.data.upsalePaidIncome,
                adminIncome: item.data.adminIncome,
                upsaleIncome: item.data.upsaleIncome,
                adminLiftIncome: item.data.adminLiftIncome,
                upsaleLiftIncome: item.data.upsaleLiftIncome,
                orderCount: item.data.orderCount,
                upsaleOrderCount: item.data.upsaleOrderCount,
                adminDelivery: item.data.adminDelivery,
                upsaleDelivery: item.data.upsaleDelivery,
                adminLiftDelivery: item.data.adminLiftDelivery,
                upsaleLiftDelivery: item.data.upsaleLiftDelivery,
            }
        })
    }, [data])

    const sortedUsersCommData = useMemo(() => {
        return [...tableFormattedData].sort((a, b) => {
            if(sortDescriptor.column === 'username'){
                const factor = sortDescriptor.direction === 'ascending' ? 1 : -1;
                return factor * (a[sortDescriptor.column].localeCompare(b[sortDescriptor.column]));
            }else if(sortDescriptor.column === 'team'){
                const factor = sortDescriptor.direction === 'ascending' ? 1 : -1;
                const aValue = a[sortDescriptor.column] ?? '';
                const bValue = b[sortDescriptor.column] ?? '';
                return factor * (aValue.localeCompare(bValue));
            }else {
                const factor = sortDescriptor.direction === 'ascending' ? 1 : -1;
                return factor * (a[sortDescriptor.column] - b[sortDescriptor.column]);
            }

        });
    }, [tableFormattedData, sortDescriptor]);

    const modalColumns = [
        { name: 'username', text: 'ชื่อ' },
        { name: 'team', text: 'ทีม' },
        { name: 'adminPaidIncome', text: 'ยอดเงินเข้าแอดมิน' },
        { name: 'upsalePaidIncome', text: 'ยอดเงินเข้าอัพเซล' },
        { name: 'adminIncome', text: 'ยอดขายแอดมิน' },
        { name: 'upsaleIncome', text: 'ยอดอัพเซล' },
        { name: 'adminLiftIncome', text: 'ยอดยกแอดมิน' },
        { name: 'upsaleLiftIncome', text: 'ยอดยกอัพเซล' },
        { name: 'orderCount', text: 'ยอดออเดอร์' },
        { name: 'upsaleOrderCount', text: 'ออเดอร์อัพเซล' },
        { name: 'adminDelivery', text: 'ยอดค่าส่งแอดมิน' },
        { name: 'upsaleDelivery', text: 'ยอดค่าส่งอัพเซล' },
        { name: 'adminLiftDelivery', text: 'ยอดยกค่าส่งแอดมิน' },
        { name: 'upsaleLiftDelivery', text: 'ยอดยกค่าส่งอัพเซล' },
    ]

    const classNames = useMemo(() => ({
        row: [
            "hover:bg-blue-200",
            "group",
            "transition-colors",
            "duration-300",
        ],
        td: [
            "border-b",
            "border-gray-100",
            "text-center",
            "group-hover:bg-blue-50",
        ],
    }), []);
    return (
        <Modal isOpen={isOpen} onClose={() => onClose()}
                className="w-[2400px] max-w-full mx-auto">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <div className="font-bold text-lg text-center mt-2">ข้อมูลเพิ่มเติม</div>
                            <ModalBody>
                                <Table
                                    isStriped
                                    className="max-h-[720px] overflow-y-auto overflow-x-auto scrollbar-hide"
                                    radius='sm'
                                    color='primary'
                                    isHeaderSticky
                                    removeWrapper
                                    // topContent={TopContent}
                                    classNames={classNames}
                                    sortDescriptor={sortDescriptor}
                                    onSortChange={(sortDescriptor) => setSortDescriptor(sortDescriptor)}
                                >
                                    <TableHeader columns={modalColumns}>

                                        {(column) => (
                                            <TableColumn
                                                key={column.name}
                                                className='text-center text-sm'
                                                allowsSorting={true}
                                            >
                                                {column.text}
                                            </TableColumn>
                                        )}
                                    </TableHeader>
                                    <TableBody items={sortedUsersCommData} emptyContent={"ไม่พบข้อมูล"}
                                        loadingState={isLoading ? "loading" : undefined}
                                        loadingContent={<Spinner color="primary" />}
                                    >
                                        {sortedUsersCommData.map(item => {
                                            const className = 'text-bold text-sm text-end';
                                            return (
                                                <TableRow key={item.username}>
                                                    <TableCell className={className + ' !text-center'}>{item.username}</TableCell>
                                                    <TableCell className={className}>{item.team}</TableCell>
                                                    <TableCell className={className}>{cFormatter(item.adminPaidIncome, 2)}</TableCell>
                                                    <TableCell className={className}>{cFormatter(item.upsalePaidIncome, 2)}</TableCell>
                                                    <TableCell className={className}>{cFormatter(item.adminIncome, 2)}</TableCell>
                                                    <TableCell className={className}>{cFormatter(item.upsaleIncome, 2)}</TableCell>
                                                    <TableCell className={className}>{cFormatter(item.adminLiftIncome, 2)}</TableCell>
                                                    <TableCell className={className}>{cFormatter(item.upsaleLiftIncome, 2)}</TableCell>
                                                    <TableCell className={className}>{cFormatter(item.orderCount)}</TableCell>
                                                    <TableCell className={className}>{cFormatter(item.upsaleOrderCount)}</TableCell>
                                                    <TableCell className={className}>{cFormatter(item.adminDelivery, 2)}</TableCell>
                                                    <TableCell className={className}>{cFormatter(item.upsaleDelivery, 2)}</TableCell>
                                                    <TableCell className={className}>{cFormatter(item.adminLiftDelivery, 2)}</TableCell>
                                                    <TableCell className={className}>{cFormatter(item.upsaleLiftDelivery, 2)}</TableCell>
                                                </TableRow>
                                            )
                                        })}
                                        <TableRow className='sticky bottom-0 bg-slate-100 border-0 z-10 rounded-lg'>
                                            <TableCell className="font-bold">รวม</TableCell>
                                            <TableCell className="font-bold"></TableCell>
                                            <TableCell className="font-bold text-end">{cFormatter(sumCommData.adminPaidIncome, 2)}</TableCell>
                                            <TableCell className="font-bold text-end">{cFormatter(sumCommData.upsalePaidIncome, 2)}</TableCell>
                                            <TableCell className="font-bold text-end">{cFormatter(sumCommData.adminIncome, 2)}</TableCell>
                                            <TableCell className="font-bold text-end">{cFormatter(sumCommData.upsaleIncome, 2)}</TableCell>
                                            <TableCell className="font-bold text-end">{cFormatter(sumCommData.adminLiftIncome, 2)}</TableCell>
                                            <TableCell className="font-bold text-end">{cFormatter(sumCommData.upsaleLiftIncome, 2)}</TableCell>
                                            <TableCell className="font-bold text-end">{cFormatter(sumCommData.orderCount)}</TableCell>
                                            <TableCell className="font-bold text-end">{cFormatter(sumCommData.upsaleOrderCount)}</TableCell>
                                            <TableCell className="font-bold text-end">{cFormatter(sumCommData.adminDelivery, 2)}</TableCell>
                                            <TableCell className="font-bold text-end">{cFormatter(sumCommData.upsaleDelivery, 2)}</TableCell>
                                            <TableCell className="font-bold text-end">{cFormatter(sumCommData.adminLiftDelivery, 2)}</TableCell>
                                            <TableCell className="font-bold text-end">{cFormatter(sumCommData.upsaleLiftDelivery, 2)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
    )
}
