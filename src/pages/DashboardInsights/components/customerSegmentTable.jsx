import React, { useMemo, useState } from 'react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@nextui-org/table';
import { Avatar, Chip, Select, SelectItem, Input, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { Phone, UploadIcon } from 'lucide-react';
import { SearchIcon } from '@/component/Icons';
import {
    capitalize,
    customerData,
    columns,
    INITIAL_VISIBLE_COLUMNS,
    getFilteredUsers,
    getHeaderColumns
} from '../utils/utils';
import { ChevronDownIcon } from '../../../component/Icons';

const users = [
    { id: 'HA0000015', name: 'สมชาย ใจดี', phone: '0891234567', recency: 99, frequency: 10, monetary: '900,000.00', aov: '90,000.00', segment: 'Champions', chipColor: 'primary', data: [7000, 40000, 5000, 17000, 20000, 30000] },
    { id: 'HA02', name: 'ปิยะดา รักสงบ', phone: '0829876543', recency: 99, frequency: 10, monetary: '900,000.00', aov: '90,000.00', segment: 'Loyalty', chipColor: 'secondary', data: [7000, 40000, 5000, 17000, 20000, 30000] },
    { id: 'HA03', name: 'วีรชัย กล้าหาญ', phone: '0817654321', recency: 99, frequency: 10, monetary: '900,000.00', aov: '90,000.00', segment: 'Potential', chipColor: 'success', data: [7000, 40000, 5000, 17000, 20000, 30000] },
    { id: 'HA04', name: 'สุภาพร ศรีสุข', phone: '0804567890', recency: 99, frequency: 10, monetary: '900,000.00', aov: '90,000.00', segment: "Can't Lose", chipColor: 'danger', data: [7000, 40000, 5000, 17000, 20000, 30000] }
];

function CustomerSegmentTable() {
    const [selectedSegment, setSelectedSegment] = useState("all");
    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [searchQuery, setSearchQuery] = useState("");

    const filteredUsers = useMemo(() => getFilteredUsers(users, selectedSegment, searchQuery), [selectedSegment, searchQuery]);
    const headerColumns = useMemo(() => getHeaderColumns(columns, visibleColumns), [visibleColumns]);

    const topContent = useMemo(() => (
        <div className="flex flex-col gap-4">
            <span className="font-semibold text-lg">
                RFM Segment {""}
                <span className="text-sm text-gray-500">(กลุ่มลูกค้า)</span>
            </span>
            <div className="flex justify-between gap-3 items-end">
                <Select
                    disableSelectorIconRotation
                    className="max-w-xs"
                    labelPlacement="outside"
                    variant='bordered'
                    selectedKeys={[selectedSegment]}
                    disallowEmptySelection
                    onSelectionChange={(keys) => setSelectedSegment(Array.from(keys)[0])}
                >
                    {customerData.map((customer) => (
                        <SelectItem key={customer.key}>{customer.label}</SelectItem>
                    ))}
                </Select>
                <div className='flex justify-between space-x-4'>
                    <Input
                        variant='bordered'
                        className="w-72 max-w-xs"
                        placeholder="ค้นหาด้วยชื่อลูกค้าหรือเบอร์โทร"
                        startContent={<SearchIcon />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Dropdown>
                        <DropdownTrigger>
                            <Button endContent={<ChevronDownIcon className="text-small" />} variant="bordered">
                                คอลลัม
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            closeOnSelect={false}
                            selectedKeys={visibleColumns}
                            selectionMode="multiple"
                            onSelectionChange={setVisibleColumns}
                        >
                            {columns.map((column) => (
                                <DropdownItem key={column.uid} className="capitalize">
                                    {capitalize(column.name)}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                    <Button
                        color='success'
                        variant='flat'
                        startContent={<UploadIcon size={16} />}
                        className="shrink-0"
                    >
                        Export CSV
                    </Button>
                </div>
            </div>
        </div>
    ), [selectedSegment, searchQuery, visibleColumns]);

    return (
        <div>
            <div radius='sm' shadow='none'>
                <Table topContent={topContent} radius='sm' shadow='none'>
                    <TableHeader>
                        {headerColumns.map((column) => (
                            <TableColumn key={column.uid}>{column.name}</TableColumn>
                        ))}
                    </TableHeader>
                    <TableBody emptyContent='ไม่พบข้อมูล'>
                        {filteredUsers.map((user, index) => (
                            <TableRow key={index}>
                                {headerColumns.map((column) => (
                                    <TableCell key={column.uid}>
                                        {column.uid === "customer" ? (
                                            <div className='flex items-center gap-2'>
                                                <Avatar size='md' src='https://i.pravatar.cc/150?u=a04258114e29026702d' />
                                                <div className='flex flex-col'>
                                                    <span className='font-medium'>{user.name}</span>
                                                    <div className='flex items-center gap-1 text-gray-500 text-sm'>
                                                        <Phone size={16} className='text-green-500' />
                                                        <span>{user.phone}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : column.uid === "segment" ? (
                                            <Chip variant='flat' color={user.chipColor}>{user.segment}</Chip>
                                        ) : (
                                            user[column.uid]
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default CustomerSegmentTable;
