import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { Card, DateRangePicker, Select, SelectItem, CardBody, Avatar, Chip, Button, ButtonGroup, Switch, cn, Tooltip, CardHeader, Divider, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import {
    today,
    startOfMonth,
    endOfMonth,
    CalendarDate,
} from "@internationalized/date";
import OwnCommission from './Components/ownCommission.jsx';
import CommissionContent from './Components/comissionContent.jsx'
import fetchProtectedData from '@/utils/fetchData.js';
import { useAppContext } from '../../contexts/AppContext.jsx';
import { URLS } from '../../config.js';
import { HFRefresh } from '../../component/Icons.jsx';
import YearlyContent from './Components/YearlyContent/YearlyContent.jsx';
import { toastError } from '../../component/Alert.jsx';
import { ACCESS } from '../../configs/accessids';
import { useCommissionContext } from './CommissionContext.jsx';
import { CommissionData, sumCommissionData } from './Components/YearlyContent/CommissionData.js';
import DateSelector from '../../component/DateSelector.jsx';
import { cFormatter } from '@/utils/numberFormatter.js';
import { ExportExcel } from '@/utils/exportExcel.js';
import OrderDataModal from './Components/OrderDataModal.jsx';
import ld from 'lodash';

export const animals = [
    { key: "cat", label: "Cat" },
    { key: "dog", label: "Dog" },
    { key: "elephant", label: "Elephant" },
    { key: "lion", label: "Lion" },
    { key: "tiger", label: "Tiger" },
    { key: "giraffe", label: "Giraffe" },
    { key: "dolphin", label: "Dolphin" },
    { key: "penguin", label: "Penguin" },
    { key: "zebra", label: "Zebra" },
    { key: "shark", label: "Shark" },
    { key: "whale", label: "Whale" },
    { key: "otter", label: "Otter" },
    { key: "crocodile", label: "Crocodile" },
];


function CommissionBody() {
    const isDev = useMemo(() => process.env.NODE_ENV === 'development', []);

    const { currentUser, agent, accessCheck } = useAppContext();
    const { agentList, selectedAgent, setSelectedAgentFromId, loadAgent } = agent;
    const isAllViewUser = accessCheck.haveOne('');
    const isTeamViewUser = accessCheck.haveOne('');
    const isAllOwnerViewUser = accessCheck.haveOne('');

    const isSelfOnly = !isAllViewUser && !isTeamViewUser && !isAllOwnerViewUser;

    const { setCommData, usersCommData, setUsersCommData, settingData, isSettingLoaded, setOrderFilter } = useCommissionContext();

    const [ownAgentList, setOwnAgentList] = useState([]);
    const [selectedOwnAgent, setSelectOwnAgent] = useState(isAllOwnerViewUser ? 'all' : selectedAgent.id);
    const [loadOwnAgent, setLoadOwnAgent] = useState(false);

    const [agentUserList, setAgentUserList] = useState([])
    const [loadAgentUserList, setLoadAgentUserList] = useState(false);

    const thisYear = new Date().getFullYear();
    const firstYear = 2019;
    const [dateRange, setDateRange] = useState({
        start: startOfMonth(today()),
        end: endOfMonth(today()),
    });
    const [selectedEmployee, setSelectedEmployee] = useState(!isSelfOnly ? 'all' : currentUser.userName);
    const [userData, setUserData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCommLoading, setIsCommLoading] = useState(false);
    const [isCommission, setIsCommission] = useState(false);

    const [dateMode, setDateMode] = useState('เดือน');
    const [isYearlyContentOpened, setIsYearlyContentOpened] = useState(false);
    const [isYearlyView, setIsYearlyView] = useState(false);
    const [selectedYear, setSelectedYear] = useState(thisYear);
    const [isYearlyContentLoading, setIsYearlyContentLoading] = useState(false);
    const [yearlyContentData, setYearlyContentData] = useState([]);

    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)

    const [supervisorCommission, setSupervisorCommission] = useState(new CommissionData({}));
    const isSupervisorView = isTeamViewUser && selectedEmployee === 'all';

    const abortControllerRef = useRef(null);

    useEffect(() => {
        setOrderFilter(p => ({
            ...p,
            // dateRange: dateRange,
            salesName: selectedEmployee,
            selectedOwnAgent: selectedOwnAgent === 'all' ? ownAgentList.map(e => e.id) : selectedOwnAgent,
            selectedAgent: selectedAgent.id
        }));
    }, [selectedEmployee, selectedAgent, selectedOwnAgent])

    async function fetchCommissionData(controller) {
        const formatDateObject = (dateObj) => {
            if (!dateObj) return null;
            const year = dateObj.year;
            const month = String(dateObj.month).padStart(2, "0");
            const day = String(dateObj.day).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };
        try {
            setIsCommLoading(true);
            const userToFetch = selectedEmployee !== 'all' ? [selectedEmployee] 
            : isTeamViewUser ? [...userData.map(e => e.username), currentUser.userName] 
            : userData.map(e => e.username);
            const [response] = await Promise.all(
                [
                    fetchProtectedData.post(URLS.commission.getCommission, {
                        username: userToFetch,
                        startDate: formatDateObject(dateRange.start),
                        endDate: formatDateObject(dateRange.end),
                        //businessId: selectedAgent.id,
                        businessId: selectedOwnAgent === 'all' ? ownAgentList.map(e => e.id) : selectedOwnAgent
                    }, {
                        signal: controller?.signal
                    }),
                ]
            )
            let data;
            data = response.data.filter(e => !isTeamViewUser || e.username !== currentUser.userName).map(item => {
                const commDataSet = item.data.map(saleData => {
                    return new CommissionData({...saleData});
                });
                const userSum = sumCommissionData(commDataSet);
                return {
                    ...item,
                    data: userSum,
                }
            });
            setUsersCommData(data);
            const sum = sumCommissionData(data.map(e => e.data));
            setCommData(sum)
            if(isTeamViewUser) {
                const supervisorCommission = response.data.find(e => e.username === currentUser.userName);
                if(supervisorCommission) {
                    const supervisorSum = sumCommissionData(supervisorCommission.data.map(e => new CommissionData({...e})));
                    setSupervisorCommission(supervisorSum);
                }
            }
        } catch (err) {
            if (err.name === 'CanceledError') {
                console.log('Abort');
                return;
            }
            console.error(isDev ? err : 'Error fetching commissionData');
            toastError('เกิดข้อผิดพลาด', 'กรุณาลองใหม่อีกครั้ง');
        } finally {
            setIsCommLoading(false)
        }
    }

    const fetchUserData = async (controller) => {
        const type = isAllViewUser ? 'all' : isTeamViewUser ? accessCheck.haveOne(ACCESS.team.manager) ? 'manager' : accessCheck.haveOne(ACCESS.team.leader) ? 'leader' : 'all' : 'all';
        try {
            setIsLoading(true)
            const response = await fetchProtectedData.get(`${type === 'all' ? URLS.users.getAll : URLS.users.getManageUsers}`, {
                params: { businessId: selectedAgent.id, type },
                signal: controller.signal
            });
            setUserData(response.data);
        } catch (err) {
            if (err.name === 'CanceledError') {
                return;
            }
            console.error('Error fetching user data');
            toastError('เกิดข้อผิดพลาด', 'กรุณาลองใหม่อีกครั้ง');
        } finally {
            setIsLoading(false)
        }
    };

    async function fetchOwnAgent(controller) {
        try {
            setLoadOwnAgent(true)
            const response = await fetchProtectedData.get(URLS.agent.getOwnAgent + "/" + selectedAgent.id, {
                signal: controller.signal
            })
            setOwnAgentList(response.data)
        } catch (err) {
            console.error('error fetching Own Agent');
            toastError('เกิดข้อผิดพลาด', 'กรุณาลองใหม่อีกครั้ง');
        } finally {
            setLoadOwnAgent(false)
        }
    }

    useEffect(() => {
        setSelectOwnAgent(isAllOwnerViewUser ? 'all' : selectedAgent.id)
        const controller = new AbortController()
        if (isAllOwnerViewUser) {
            fetchOwnAgent(controller)
        }
        if (!isSelfOnly) {
            fetchUserData(controller)
        }
        return () => {
            controller.abort();
        }
    }, [selectedAgent])

    useEffect(() => {
        if (!isSettingLoaded || loadOwnAgent) return;
        const controller = new AbortController()
        fetchCommissionData(controller);
        return () => {
            controller.abort();
        }
    }, [selectedEmployee, settingData, dateRange, selectedOwnAgent, ownAgentList, userData])

    // const handleAgentSelect = (keys) => {
    //     setSelectedEmployee('all')
    //     setSelectedAgentFromId(Array.from(keys)[0])
    // }

    const handleEmployeeSelection = (keys) => {
        //const username = Array.from(keys)[0];
        if (keys === 'all') {
            setSelectedEmployee('all');
            return;
        }
        // const findUser = userData.find(e => e.username === username);
        setSelectedEmployee(keys);
    };

    async function handleRefresh() {
        if (abortControllerRef.current) {
            abortControllerRef.current?.abort();
        }
        abortControllerRef.current = new AbortController();
        if (isYearlyView) {
            fetchCommissionYearlyData(abortControllerRef.current);
        } else {
            fetchCommissionData(abortControllerRef.current);
        }
    }

    const exportExcelFunc = () => {
        const filterDepData = ld.groupBy(usersCommData.map(user => ({
            ...user,
            depName: user.depName || "ไม่มีแผนก"
        })), 'depName');
        const dataSheets = Object.keys(filterDepData).map(dep => {
            return {
                sheetName: dep || "ไม่มีแผนก",
                data: filterDepData[dep].map(x => ({
                    'ทีม': x.teamName,
                    'พนักงาน': x.username,
                    'จำนวนออเดอร์': cFormatter(x.data.orderCount),
                    'จำนวนออเดอร์ อัพเซลล์': cFormatter(x.data.upsaleOrderCount),
                    'ยอดขาย แอดมิน': cFormatter(x.data.adminIncome, 2),
                    'ยอดขาย อัพเซลล์': cFormatter(x.data.upsaleIncome, 2),
                    'ยอดเงินเข้า แอดมิน': cFormatter(x.data.adminPaidIncome, 2),
                    'ยอดเงิน อัพเซลล์': cFormatter(x.data.upsalePaidIncome, 2),
                    'ยอดยกมา แอดมิน': cFormatter(x.data.adminLiftIncome, 2),
                    'ยอดยกมา อัพเซลล์': cFormatter(x.data.upsaleLiftIncome, 2),
                    'ยอดยกไป แอดมิน': cFormatter(x.data.adminNextLiftIncome, 2),
                    'ยอดยกไป อัพเซลล์': cFormatter(x.data.upsaleNextLiftIncome, 2),
                    'ค่าส่ง แอดมิน': cFormatter(x.data.adminDelivery, 2),
                    'ค่าส่งอัพเซลล์': cFormatter(x.data.upsaleDelivery, 2),
                    'ยอดยกมาค่าส่ง แอดมิน': cFormatter(x.data.adminLiftDelivery, 2),
                    'ยอดยกมาค่าส่ง อัพเซลล์': cFormatter(x.data.upsaleLiftDelivery, 2),
                    'ยอดยกไปค่าส่ง แอดมิน': cFormatter(x.data.adminNextLiftDelivery, 2),
                    'ยอดยกไปค่าส่ง อัพเซลล์': cFormatter(x.data.upsaleNextLiftDelivery, 2),
                    'ยอดเงินเข้ารวม': cFormatter(x.data.totalIncome, 2),
                    'ยอดค่าส่งรวม': cFormatter(x.data.totalDelivery, 2),
                    'ยอดเงินเข้าสุทธิ': cFormatter(x.data.netIncome, 2),
                    'ค่าคอมมิชชั่น': cFormatter(x.data.commission, 2)
                }))
            }
        })

        dataSheets.push({
            sheetName: 'ทั้งหมด',
            data: usersCommData.map(x => ({
                'ทีม': x.teamName,
                'แผนก': x.depName || "ไม่มีแผนก",
                'พนักงาน': x.username,
                'จำนวนออเดอร์': cFormatter(x.data.orderCount),
                'จำนวนออเดอร์ อัพเซลล์': cFormatter(x.data.upsaleOrderCount),
                'ยอดขาย แอดมิน': cFormatter(x.data.adminIncome, 2),
                'ยอดขาย อัพเซลล์': cFormatter(x.data.upsaleIncome, 2),
                'ยอดเงินเข้า แอดมิน': cFormatter(x.data.adminPaidIncome, 2),
                'ยอดเงิน อัพเซลล์': cFormatter(x.data.upsalePaidIncome, 2),
                'ยอดยกมา แอดมิน': cFormatter(x.data.adminLiftIncome, 2),
                'ยอดยกมา อัพเซลล์': cFormatter(x.data.upsaleLiftIncome, 2),
                'ยอดยกไป แอดมิน': cFormatter(x.data.adminNextLiftIncome, 2),
                'ยอดยกไป อัพเซลล์': cFormatter(x.data.upsaleNextLiftIncome, 2),
                'ค่าส่ง แอดมิน': cFormatter(x.data.adminDelivery, 2),
                'ค่าส่งอัพเซลล์': cFormatter(x.data.upsaleDelivery, 2),
                'ยอดยกมาค่าส่ง แอดมิน': cFormatter(x.data.adminLiftDelivery, 2),
                'ยอดยกมาค่าส่ง อัพเซลล์': cFormatter(x.data.upsaleLiftDelivery, 2),
                'ยอดยกไปค่าส่ง แอดมิน': cFormatter(x.data.adminNextLiftDelivery, 2),
                'ยอดยกไปค่าส่ง อัพเซลล์': cFormatter(x.data.upsaleNextLiftDelivery, 2),
                'ยอดเงินเข้ารวม': cFormatter(x.data.totalIncome, 2),
                'ยอดค่าส่งรวม': cFormatter(x.data.totalDelivery, 2),
                'ยอดเงินเข้าสุทธิ': cFormatter(x.data.netIncome, 2),
                'ค่าคอมมิชชั่น': cFormatter(x.data.commission, 2)
            }))
        })

        ExportExcel(`ข้อมูล ${dateRange.start.toString()} - ${dateRange.end.toString()}`, dataSheets)
    }


    async function fetchCommissionYearlyData(controller) {
        setIsYearlyContentLoading(true);
        try {
            const userToFetch = selectedEmployee !== 'all' ? [selectedEmployee] : userData.map(e => e.username);
            const response = await fetchProtectedData.post(URLS.commission.getCommission, {
                username: userToFetch,
                businessId: selectedOwnAgent === 'all' ? ownAgentList.map(e => e.id) : selectedOwnAgent,
                year: selectedYear,
            }, {
                signal: controller?.signal
            })
            const data = [...Array(12).keys()].map(e => new CommissionData({ monthIndex: e, month: `${selectedYear}-${e + 1}` }));
            response.data.forEach(item => {
                item.data.forEach(month => {
                    const commDataSet = new CommissionData({...month});
                    data[month.monthIndex] = sumCommissionData([data[month.monthIndex], commDataSet]);
                    data[month.monthIndex].monthIndex = month.monthIndex;
                    data[month.monthIndex].month = month.month
                });
            });
            setYearlyContentData(data.filter((e) => !(selectedYear === new Date().getFullYear() && e.monthIndex > new Date().getMonth())));
        } catch (err) {
            if (err.name === 'CanceledError') {
                return;
            }
            console.error('Error fetching commissionDataYearly');
            toastError('เกิดข้อผิดพลาด', 'กรุณาลองใหม่อีกครั้ง');
        } finally {
            setIsYearlyContentLoading(false);
        }

    }
    console.log(supervisorCommission);
    useEffect(() => {
        if (!isSettingLoaded) return;
        if (!isYearlyContentOpened) return;
        const controller = new AbortController();
        fetchCommissionYearlyData(controller);
        return () => {
            controller.abort();
        }
    }, [selectedYear, isYearlyContentOpened, selectedEmployee, settingData, selectedOwnAgent])
    return (
        <section title="Dashboard Sales">
            <section>
                <Card className="shadow-none" radius="sm">
                    <CardBody>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:space-x-4 space-y-4 sm:space-y-0 sm:gap-y-4 sm:items-center items-start w-full">
                            {isYearlyView ?
                                <div className='w-48'>
                                    <Select aria-label='year selector' label='เลือกปี'
                                        selectedKeys={[selectedYear + '']}
                                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                                        variant='bordered'
                                        disallowEmptySelection
                                    >
                                        {[...Array(thisYear - firstYear + 1).keys()].map(e => {
                                            return <SelectItem key={thisYear - e} textValue={thisYear - e}>{thisYear - e}</SelectItem>
                                        })}
                                    </Select>
                                </div>
                                :
                                <DateSelector value={dateRange} onChange={(value) => setDateRange(value)} modeState={dateMode} onModeChange={setDateMode} isShowDateRange={false}/>
                            }
                            {/* {!isYearlyView && (
                                <Button
                                    color="primary"
                                    variant="flat"
                                    onPress={() => setIsCommission(!isCommission)}
                                    endContent={isCommission ? '' : <MoneyBeggingIcon />}
                                >
                                    {isCommission ? 'กลับ' : 'ดูค่าคอมมิชชัน'}
                                </Button>
                            )} */}

                            {isCommission &&
                                <Button size='sm' color='primary' variant='solid' onPress={exportExcelFunc}>Export Excel</Button>
                            }
                            <Tooltip content="รีเฟรช">
                                <Button isIconOnly color='primary' variant='light' className='text-lg' isDisabled={isCommLoading}
                                    onPress={() => handleRefresh()}>
                                    <HFRefresh />
                                </Button>
                            </Tooltip>
                            {!isCommission && (
                                <div className='flex flex-1 justify-end'>
                                    <div className='flex flex-col items-center space-y-1'>
                                        <Switch
                                            aria-label='swith to yearly screen'
                                            isSelected={isYearlyView}
                                            onChange={(e) => setIsYearlyView(p => {
                                                if (!isYearlyContentOpened) setIsYearlyContentOpened(true);
                                                if (p) {
                                                    sessionStorage.setItem('commissionYearlyView', 'false');
                                                    return false
                                                } else {
                                                    sessionStorage.setItem('commissionYearlyView', 'true');
                                                    return true
                                                }
                                            })}
                                        >
                                            สรุปรายปี
                                        </Switch>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardBody>
                </Card>
            </section>
            {!isCommission ? (
                <>
                    {!isYearlyView ?
                        <div>
                            <section className="py-4">
                                <CommissionContent
                                    isLoading={isCommLoading}
                                    dateRange={dateRange}
                                    selectedEmployee={selectedEmployee}
                                    selectedAgentValue={String(selectedAgent.id)}
                                onOpenModalClick={() => setIsOrderModalOpen(true)}
                                />
                            </section>
                        </div>
                        :
                        <section className='py-4'>
                            <YearlyContent data={yearlyContentData} isLoading={isYearlyContentLoading} selectedYear={selectedYear} />
                        </section>
                    }
                </>
            ) : (
                <section className="py-4">
                    <OwnCommission
                        isLoading={isCommLoading}
                        userList={selectedEmployee === 'all' ? userData : userData.filter(e => e.username === selectedEmployee)}
                    />
                </section>
            )}
            <OrderDataModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} userList={userData} isLoading={isLoading} />
        </section>
    );
}

export default CommissionBody;
