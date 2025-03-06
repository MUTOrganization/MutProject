import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import DefaultLayout from '../../layouts/default';
import { Card, CardBody, Select, SelectItem, Button, Spinner, Switch, cn, useDisclosure, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Tooltip } from '@nextui-org/react';
import { HFRefresh, BlubLightIcon, LightBlubIcon } from '../../component/Icons';
import { today, startOfMonth, endOfMonth } from '@internationalized/date';
import { useAppContext } from '../../contexts/AppContext';
import fetchProtectedData from '../../../utils/fetchData';
import { URLS } from '../../config';
import DateSelector from '../../component/DateSelector';
import DashboardTalkTimeTop from './Components/DashboardTalkTimeTop';
import DashboardTalkTimeGraph from './Components/DashboardTalkTimeChart';
import DashboardTalkTimeCard from './Components/DashboardTalkTimeCard';
import RankingCardTalkTime from './Components/RankingCardTalkTime';
import ComparedModal from './Components/comparedModal';
import { useUniqueItems, useCombinedUniqueItems } from '../../../utils/uniqueItems';
import { useLeaderContext } from '../DashboardCrm/contexts/LeaderContext';
import { ACCESS } from "../../configs/access";
import TalkTimeTable from './Components/TalkTimeTable';
import { UploadIcon } from 'lucide-react';

function DashboardTalkTime() {
    const [dateRange, setDateRange] = useState({
        start: startOfMonth(today()),
        end: endOfMonth(today()),
    });
    const [selectedUsername, setSelectedUsername] = useState([]);
    const [findUsername, setFindUsername] = useState('');
    const [selectedTeam, setSelectedTeam] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({ currentMonth: [], lastMonth: [] });
    const [talkTimeData, setTalkTimeData] = useState([]);
    const [talkTimeChartData, setTalkTimeChartData] = useState([]);
    const [viewSwitch, setViewSwitch] = useState(false);
    const [comparedSelectedUsername, setComparedSelectedUsername] = useState([]);
    const [comparedSelectedTeam, setComparedSelectedTeam] = useState([]);
    const [dateMode, setDateMode] = useState('เดือน');
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedKeys, setSelectedKeys] = useState(new Set(["กราฟ"]));
    const [isHovered, setIsHovered] = useState(false);
    const { leaderData, isLeaderLoading, fetchLeaderData } = useLeaderContext();

    const tableRef = useRef(null);

    const handleExportExcel = () => {
        if (tableRef.current) {
            tableRef.current.exportToExcel();
        }
    };

    const selectedValue = useMemo(
        () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
        [selectedKeys],
    );

    const appContext = useAppContext();
    const currentUser = appContext.currentUser;
    const hasViewAllAccess = appContext.accessCheck.haveAny([ACCESS.dashboard_talk_time.talk_time_view_all]);

    const formatDateObject = (dateObj) => {
        if (!dateObj) return null;
        const year = dateObj.year;
        const month = String(dateObj.month).padStart(2, '0');
        const day = String(dateObj.day).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const selectedUsernameSet = useMemo(() => new Set(selectedUsername), [selectedUsername]);
    const selectedTeamSet = useMemo(() => new Set(selectedTeam), [selectedTeam]);

    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        const startDate = formatDateObject(dateRange.start);
        const endDate = formatDateObject(dateRange.end);
        try {
            const [crmResponse, talkTimeResponse, talkTimeChartResponse] = await Promise.all([
                fetchProtectedData.post(`${URLS.dashboardCrm.getCrmData}`, {
                    startDate,
                    endDate,
                    ownerId: currentUser?.businessId,
                    customOwnerId: currentUser?.businessId,
                    dateMode: dateMode,
                    selectedNameList: 'all'
                }),
                fetchProtectedData.get(`${URLS.dashboardCrm.getTalkTime}`, {
                    params: {
                        startDate,
                        endDate,
                        businessId: currentUser?.businessId,
                        dateMode: dateMode
                    },
                }),
                fetchProtectedData.get(`${URLS.dashboardCrm.getTalkTimeChart}`, {
                    params: {
                        startDate,
                        endDate,
                        businessId: currentUser?.businessId,
                        adminUser: selectedUsername,
                    },
                }),
            ]);

            const currentMonthData = crmResponse.data?.currentMonth || [];
            const lastMonthData = crmResponse.data?.lastMonth || [];

            setData({
                currentMonth: currentMonthData,
                lastMonth: lastMonthData,
            });

            setTalkTimeData(talkTimeResponse.data);

            const currentMonthUsers = talkTimeResponse?.data?.currentMonth?.map((item) => ({
                username: item.adminUser,
                team: item.team || "ยังไม่มีทีม",
            })) || [];
            const lastMonthUsers = talkTimeResponse?.data?.lastMonth?.map((item) => ({
                username: item.adminUser,
                team: item.team || "ยังไม่มีทีม",
            })) || [];
            const allAdminUsers = [...new Map([...currentMonthUsers, ...lastMonthUsers].map((user) => [user.username, user])).values()];

            const usernameToTeamMap = new Map(
                currentMonthData.concat(lastMonthData).map((item) => [item.username, item.team || "ยังไม่มีทีม"])
            );

            const updatedChartData = talkTimeChartResponse.data.map((item) => ({
                ...item,
                team: usernameToTeamMap.get(item.adminUser) || "ยังไม่มีทีม",
            }));

            setTalkTimeChartData(updatedChartData);

            const existingDataMap = new Map(currentMonthData.concat(lastMonthData).map((item) => [item.username, item]));

            setData((prevData) => {
                const updatedExistingData = prevData.currentMonth.map((item) => ({
                    ...item,
                    team: existingDataMap.get(item.username)?.team || item.team || "ยังไม่มีทีม",
                }));

                const newUsers = allAdminUsers.filter(
                    (user) => !updatedExistingData.some((item) => item.username === user.username)
                );

                return {
                    currentMonth: [
                        ...updatedExistingData,
                        ...newUsers.map((user) => ({
                            username: user.username,
                            team: user.team,
                        })),
                    ],
                    lastMonth: lastMonthData,
                };
            });
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [dateRange.start, dateRange.end, selectedUsername, currentUser.businessId]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const uniqueUsername = useCombinedUniqueItems(data, ["currentMonth", "lastMonth"], "username");
    const uniqueTeam = useCombinedUniqueItems(data, ["currentMonth", "lastMonth"], "team", "ยังไม่มีทีม");

    const filteredUsernames = useMemo(() => {
        if (leaderData?.isStaff) {
            return uniqueUsername.filter(username => username === leaderData.username);
        }
        if (hasViewAllAccess) {
            return uniqueUsername;
        }
        if (leaderData?.isManager || leaderData?.isLeader) {
            return uniqueUsername.filter(username => leaderData.teams?.includes(username));
        }
        return [];
    }, [uniqueUsername, leaderData, hasViewAllAccess]);

    const filteredTeams = useMemo(() => {
        if (hasViewAllAccess) {
            return uniqueTeam;
        }
        if (leaderData?.isManager || leaderData?.isLeader) {
            return leaderData?.teams || [];
        }
        if (leaderData?.isStaff) {
            return leaderData?.teams ? leaderData.teams : [];
        }
        return [];
    }, [uniqueTeam, leaderData, hasViewAllAccess]);

    useEffect(() => {
        if (leaderData?.isStaff) {
            setSelectedUsername([leaderData.username]);
            setSelectedTeam(leaderData.teams || []);
        } else if (hasViewAllAccess) {
            setSelectedTeam([]);
        } else if (leaderData?.isManager || leaderData?.isLeader) {
            setSelectedTeam(leaderData.teams || []);
        } else {
            setSelectedTeam([]);
        }
    }, [leaderData, hasViewAllAccess]);

    // handleReset ห่อด้วย useCallback
    const handleReset = useCallback(() => {
        setDateRange({
            start: startOfMonth(today()),
            end: endOfMonth(today()),
        });

        if (leaderData?.isStaff) {
            setSelectedUsername([leaderData.username]);
        } else if (hasViewAllAccess) {
            setSelectedUsername([]);
        } else if (leaderData?.isManager || leaderData?.isLeader) {
            const usernamesInTeam = uniqueUsername
                .filter((username) => leaderData.teams?.includes(username))
                .map((username) => username);
            setSelectedUsername(usernamesInTeam);
        } else {
            setSelectedUsername([]);
        }

        setDateMode('เดือน');
    }, [leaderData, hasViewAllAccess, uniqueUsername]);

    return (
        <section title="แดชบอร์ด Talk Time">
            <div className="space-y-4">
                <section>
                    <Card shadow="none" radius="sm">
                        <CardBody>
                            <div className="flex items-center w-full">
                                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-center w-full">
                                    <DateSelector
                                        value={dateRange}
                                        onChange={(value) => setDateRange(value)}
                                        modeState={dateMode}
                                        onModeChange={setDateMode}
                                    />
                                    <Select
                                        label="พนักงานขาย"
                                        placeholder={
                                            leaderData?.isStaff
                                                ? "ข้อมูลพนักงานขายของคุณ"
                                                : hasViewAllAccess
                                                    ? "เลือกพนักงานขายทั้งหมด"
                                                    : leaderData?.isManager || leaderData?.isLeader
                                                        ? "พนักงานขายในทีมของคุณ"
                                                        : "ไม่มีข้อมูลพนักงานขาย"
                                        }
                                        variant="bordered"
                                        selectedKeys={selectedUsernameSet}
                                        isDisabled={!hasViewAllAccess && (!leaderData?.isManager && (leaderData?.isLeader || leaderData?.isStaff))}
                                        selectionMode="multiple"
                                        isLoading={isLoading}
                                        onSelectionChange={(keys) => setSelectedUsername(Array.from(keys))}
                                        className="max-w-full sm:max-w-[200px] w-full"
                                    >
                                        {filteredUsernames.map((username) => (
                                            <SelectItem key={username} value={username}>
                                                {username}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <Select
                                        label="ทีม"
                                        placeholder={
                                            hasViewAllAccess
                                                ? "เลือกทีมทั้งหมด"
                                                : leaderData?.isManager
                                                    ? "เลือกทีมของคุณ"
                                                    : leaderData?.isLeader
                                                        ? "ทีมของคุณถูกล็อกไว้"
                                                        : leaderData?.isStaff
                                                            ? "ทีมของคุณ"
                                                            : "ไม่มีข้อมูลทีม"
                                        }
                                        isDisabled={!hasViewAllAccess && (!leaderData?.isManager && (leaderData?.isLeader || leaderData?.isStaff))}
                                        variant="bordered"
                                        isLoading={isLoading}
                                        selectionMode="multiple"
                                        selectedKeys={selectedTeamSet}
                                        onSelectionChange={(keys) => setSelectedTeam(Array.from(keys))}
                                        className="max-w-full sm:max-w-[200px] w-full"
                                    >
                                        {filteredTeams.map((team) => (
                                            <SelectItem key={team} value={team}>
                                                {team}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    {appContext.accessCheck.haveAny([ACCESS.dashboard_talk_time.compared_talk_time_access]) && (
                                        <Button color="primary" variant="flat" onPress={onOpen}>
                                            เปรียบเทียบ
                                        </Button>
                                    )}
                                    <Button color='success' variant='flat' onPress={handleExportExcel} startContent={<UploadIcon size={16} />}>EXPORT EXCEL</Button>
                                    <Tooltip content="รีเฟรช">
                                        <Button isIconOnly radius="lg" color="primary" variant="light" onPress={handleReset}>
                                            <HFRefresh size={16} />
                                        </Button>
                                    </Tooltip>
                                </div>
                                <Tooltip
                                    content={<div className="text-sm">การเปรียบเทียบข้อมูลจะเปรียบเทียบจากเดือนที่แล้วและวันที่แล้ว</div>}
                                    offset={15}
                                    closeDelay={0}
                                    delay={0}
                                >
                                    <span
                                        isIconOnly
                                        variant="light"
                                        className="hidden lg:block mr-4"
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                    >
                                        {isHovered ? <BlubLightIcon /> : <LightBlubIcon />}
                                    </span>
                                </Tooltip>
                                <div className="hidden lg:block ml-auto text-nowrap">
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button className="capitalize" variant="bordered">
                                                {selectedValue}
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu
                                            disallowEmptySelection
                                            aria-label="Single selection example"
                                            selectedKeys={selectedKeys}
                                            selectionMode="single"
                                            variant="flat"
                                            onSelectionChange={setSelectedKeys}
                                        >
                                            <DropdownItem key="การ์ด" description="รูปการแสดงผลสถิติแบบการ์ด">การ์ด</DropdownItem>
                                            {appContext.accessCheck.haveAny([ACCESS.dashboard_talk_time.view_all_talk_time_ranking]) && (
                                                <DropdownItem key="อันดับ" description="แสดงผลอันดับ">อันดับ</DropdownItem>
                                            )}
                                            <DropdownItem key="กราฟ" description="รูปการแสดงผลสถิติแบบกราฟ">กราฟ</DropdownItem>
                                            <DropdownItem key="ตาราง" description="รูปการแสดงผลสถิติแบบตาราง">ตาราง</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </section>
                <section>
                    {selectedValue !== "อันดับ" && (
                        <DashboardTalkTimeTop
                            data={data}
                            talkTimeData={talkTimeData}
                            selectedUsername={selectedUsername}
                            selectedTeam={selectedTeam}
                            findUsername={findUsername}
                            isLoading={isLoading}
                        />
                    )}
                </section>
                <section>
                    {selectedValue === "การ์ด" ? (
                        <DashboardTalkTimeCard
                            data={data}
                            talkTimeData={talkTimeData}
                            selectedUsername={selectedUsername}
                            selectedTeam={selectedTeam}
                            findUsername={findUsername}
                            isLoading={isLoading}
                        />
                    ) : selectedValue === "อันดับ" ? (
                        <RankingCardTalkTime
                            data={data}
                            talkTimeData={talkTimeData}
                            selectedUsername={selectedUsername}
                            selectedTeam={selectedTeam}
                            findUsername={findUsername}
                            isLoading={isLoading}
                        />
                    ) : selectedValue === "ตาราง" ? (
                        <TalkTimeTable
                            data={data}
                            ref={tableRef}
                            talkTimeData={talkTimeData}
                            selectedUsername={selectedUsername}
                            selectedTeam={selectedTeam}
                            findUsername={findUsername}
                            isLoading={isLoading}
                        />
                    ) : (
                        <DashboardTalkTimeGraph
                            data={data}
                            dateMode={dateMode}
                            talkTimeData={talkTimeData}
                            talkTimeChartData={talkTimeChartData}
                            selectedUsername={selectedUsername}
                            selectedTeam={selectedTeam}
                            findUsername={findUsername}
                            isLoading={isLoading}
                        />
                    )
                    }
                </section>
                <ComparedModal
                    data={data}
                    talkTimeData={talkTimeData}
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    comparedSelectedUsername={comparedSelectedUsername}
                    setComparedSelectedUsername={setComparedSelectedUsername}
                    comparedSelectedTeam={comparedSelectedTeam}
                    setComparedSelectedTeam={setComparedSelectedTeam}
                    uniqueUsername={uniqueUsername}
                    uniqueTeam={uniqueTeam}
                    isLoading={isLoading}
                />
            </div>
        </section>
    );
}

export default DashboardTalkTime;
