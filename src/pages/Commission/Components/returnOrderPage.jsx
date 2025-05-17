import React, { useState, useEffect, useMemo } from 'react';
import DefaultLayout from '../../../layouts/default.jsx';
import { Card, DateRangePicker, Select, SelectItem, CardBody, Avatar, Chip, Button, ButtonGroup } from '@nextui-org/react';
import {
    today,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    CalendarDate,
    getLocalTimeZone
} from "@internationalized/date";
import fetchProtectedData from '../../../../utils/fetchData.js';
import { useAppContext } from '../../../contexts/AppContext.jsx';
import { URLS } from '../../../config.js';
import { ACCESS } from '../../../configs/accessids.js'
import ReturnOrderTable from './returnOrderTable.jsx';
import { IncorrectIcon, CorrectIcon } from '../../../component/Icons.jsx';
import { useNavigate } from 'react-router-dom';
import AgentSelector from '../../../component/AgentSelector.jsx';

function returnOrderPage() {
    const navigate = useNavigate();

    const [dateRange, setDateRange] = useState({
        start: startOfMonth(today()),
        end: endOfMonth(today()),
    });


    const [selectedEmployee, setSelectedEmployee] = useState(new Set(['all']));
    const selectedUsertValue = Array.from(selectedEmployee)[0];

    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedFine, setSelectedFine] = useState('');

    const [userData, setUserData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const currentData = useAppContext();

    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            const response = await fetchProtectedData.get(URLS.users.getAll, { params: { businessId: currentData.agent.selectedAgent.id } });
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
        setSelectedEmployee([0])
    }, [currentData.agent.selectedAgent.id]);

    const handleEmployeeSelection = (keys) => {
        setSelectedEmployee(new Set(keys));
        const selectedKey = Array.from(keys)[0];
        const selectedUser = userData.find(user => user.username === selectedKey);
        setSelectedDepartment(selectedUser ? selectedUser.departmentName : '');
    };

    const setThisMonth = () => {
        const currentDate = today();
        setDateRange({
            start: startOfMonth(currentDate),
            end: endOfMonth(currentDate)
        });
    };

    const setLastMonth = () => {
        const currentDate = today();
        const lastMonthStart = startOfMonth(new CalendarDate(currentDate.year, currentDate.month - 1, 1));
        const lastMonthEnd = endOfMonth(lastMonthStart);
        setDateRange({ start: lastMonthStart, end: lastMonthEnd });
    };

    const setToday = () => {
        const currentDate = today();
        setDateRange({ start: currentDate, end: currentDate });
    };

    return (
        <section title="คอมมิชชัน">
            <section>
                <Card className="shadow-none" radius="sm">
                    <CardBody>
                        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-center w-full">
                            <DateRangePicker
                                label="เลือกวันที่"
                                className="max-w-full sm:max-w-[250px] w-full"
                                variant="bordered"
                                visibleMonths={2}
                                pageBehavior="single"
                                value={dateRange}
                                onChange={(value) => setDateRange({ start: value.start, end: value.end })}
                                size="md"
                                CalendarTopContent={
                                    <ButtonGroup
                                        fullWidth
                                        className="px-3 pb-2 pt-3 bg-content1 [&>button]:text-default-500 [&>button]:border-default-200/60"
                                        radius="full"
                                        size="sm"
                                        variant="bordered"
                                    >
                                        <Button onPress={setToday}>วันนี้</Button>
                                        <Button onPress={setThisMonth}>เดือนนี้</Button>
                                        <Button onPress={setLastMonth}>เดือนที่แล้ว</Button>
                                    </ButtonGroup>
                                }
                            />
                            {currentData.accessCheck.haveAny([ACCESS.deductReturn.deduct_view_all_agent]) && currentData.currentUser.businessId === 1 && (
                                <AgentSelector />
                            )}
                            {currentData.accessCheck.haveAny([ACCESS.deductReturn.deduct_view_all]) && (
                                <Select
                                    label="เลือกพนักงานขาย"
                                    className="max-w-full sm:max-w-[350px] w-full"
                                    variant="bordered"
                                    disallowEmptySelection
                                    isLoading={isLoading}
                                    defaultSelectedKeys={["all"]} 
                                    onSelectionChange={handleEmployeeSelection}
                                    scrollShadowProps={{
                                        isEnabled: false
                                    }}
                                >
                                    <SelectItem key="all" textValue="ทั้งหมด">
                                        ทั้งหมด
                                    </SelectItem>
                                    {userData && userData.map((user) => (
                                        <SelectItem key={user.username} textValue={user.username}>
                                            <div className="flex items-center gap-2">
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {user.username}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {user.name || user.nickName || '-'}
                                                    </p>
                                                </div>
                                                {user.departmentName && (
                                                    <Chip 
                                                        size="sm" 
                                                        color={user.departmentName === 'CRM' ? 'success' : 'warning'}
                                                        variant="flat"
                                                        className="ml-auto"
                                                    >
                                                        {user.departmentName}
                                                    </Chip>
                                                )}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </Select>
                            )}
                            <Select
                                label="สถานะการปรับ"
                                placeholder="เลือกการค้นหา"
                                className="max-w-full sm:max-w-[250px] w-full"
                                variant="bordered"
                                isLoading={isLoading}
                                value={selectedFine}
                                onChange={(e) => setSelectedFine(e.target.value)}
                            >
                                <SelectItem key={1} value={1} endContent={<CorrectIcon className={'text-success'} />}>
                                    หักค่าปรับแล้ว
                                </SelectItem>
                                <SelectItem key={null} value={null} endContent={<IncorrectIcon className={'text-danger'} />}>
                                    ยังไม่ถูกหักค่าปรับ
                                </SelectItem>
                            </Select>

                            <Button variant='flat' color='primary' size='sm' onPress={() => navigate(-1)}>กลับ</Button>
                        </div>
                    </CardBody>
                </Card>
            </section>
            <section className='py-4'>
                <ReturnOrderTable dateRange={dateRange} selectedEmployee={selectedUsertValue} selectedFine={selectedFine} />
            </section>
        </section>
    )
}

export default returnOrderPage