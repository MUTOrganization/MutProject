import React, { useState, useEffect, useMemo } from 'react';
import TableCrm from './Components/tableCrm';
import RankingCard from './Components/rankingCard';
import {
    Card,
    CardBody,
    Select,
    SelectItem,
    Button,
    Tooltip,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    useDisclosure,
    Checkbox
} from '@nextui-org/react';
import { SearchIcon, HFRefresh, LightBlubIcon, BlubLightIcon } from '../../component/Icons';
import { today, startOfMonth, endOfMonth } from "@internationalized/date";
import { useAppContext } from '../../contexts/AppContext';
import { Input } from '@nextui-org/input';
import CardView from './Components/cardView';
import fetchProtectedData from './../../../utils/fetchData';
import { URLS } from '../../config';
import DateSelector from '../../component/DateSelector';
import ComparedModal from './Components/comparedModal';
import { formatDateObject, useUniqueItems, useUniqueTeam } from "./utils/crmUtils";
import { ACCESS } from "../../configs/access";
import { useLeaderContext } from './contexts/LeaderContext';

function DashboardCrm() {
    const [dateRange, setDateRange] = useState({
        start: startOfMonth(today()),
        end: endOfMonth(today()),
    });
    const [selectedUsername, setSelectedUsername] = useState(["all"]);
    const [selectedTeam, setSelectedTeam] = useState(["all"]);
    const [findUsername, setFindUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({ currentMonth: [], lastMonth: [] });
    const [comparedSelectedUsername, setComparedSelectedUsername] = useState([]);
    const [comparedSelectedTeam, setComparedSelectedTeam] = useState([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [dateMode, setDateMode] = useState('เดือน');
    const [selectedKeys, setSelectedKeys] = useState(new Set(["การ์ด"]));
    const [isHovered, setIsHovered] = useState(false);
    const [isPercentageSelected, setIsPercentageSelected] = useState(true);

    console.log(data)

    // สำหรับกรณี Multi Agent
    const [agentData, setAgentData] = useState([]);
    const [listAgentData, setListAgentData] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState(new Set());
    const selectedAgentValue = Array.from(selectedAgent)[0];

    // เพิ่ม State เก็บประเภทออเดอร์ (ทั้งหมด, ลูกค้าเก่า, ลูกค้าใหม่)
    const [orderType, setOrderType] = useState("all");

    const selectedValue = useMemo(
        () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
        [selectedKeys]
    );
    const [selectedNameList, setSelectedNameList] = useState(new Set(['all']));
    const selectedNameListValue = Array.from(selectedNameList)[0];

    const appContext = useAppContext();
    const currentUser = appContext.currentUser;
    const ownerId = currentUser.businessId;

    const hasViewAllAccess = appContext.accessCheck.haveAny([ACCESS.dashboard_crm.crm_view_all]);
    const hasComparedAccess = appContext.accessCheck.haveAny([ACCESS.dashboard_crm.compared_access]);

    const { leaderData, isLeaderLoading, fetchLeaderData } = useLeaderContext();

    useEffect(() => {
        if (agentData.length > 0) {
            const matchingAgent = agentData.find(agent => String(agent.agent_id) === String(ownerId));
            if (matchingAgent) {
                setSelectedAgent(new Set([String(matchingAgent.agent_id)]));
            }
        }
    }, [agentData, ownerId]);

    const fetchAgentData = async () => {
        setIsLoading(true);
        try {
            const response = await fetchProtectedData.get(`${URLS.commission.getAgentData}/${ownerId}`);
            const agents = response.data;
            setAgentData(agents);
        } catch (error) {
            console.log('error fetching data', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAgentData();
    }, []);

    const fetchListAgentData = async () => {
        setIsLoading(true);
        try {
            const resolvedOwnerId = ownerId === 1 ? selectedAgentValue : ownerId;
            const response = await fetchProtectedData.get(`${URLS.summary.listAgent}/${resolvedOwnerId}`);
            if (Array.isArray(response.data)) {
                setListAgentData(response.data);
            } else {
                setListAgentData([]);
            }
        } catch (error) {
            console.log('error fetching data', error);
            setListAgentData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchListAgentData();
    }, [ownerId, selectedAgentValue, dateMode]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fetchProtectedData.post(`${URLS.dashboardCrm.getCrmData}`, {
                startDate: formatDateObject(dateRange.start),
                endDate: formatDateObject(dateRange.end),
                ownerId: selectedNameListValue,
                customOwnerId: selectedAgentValue,
                dateMode: dateMode,
                selectedNameList: selectedNameListValue
            });
            setData(response.data);
        } catch (error) {
            console.log("Error fetching CRM data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderData();
        fetchData();
    }, [dateRange.start, dateRange.end, selectedAgentValue, selectedNameListValue]);

    const uniqueUsername = useUniqueItems(data.currentMonth, "username", "team", "ยังไม่มีทีม");
    const uniqueTeam = useUniqueTeam(data.currentMonth, "team", "team", "ยังไม่มีทีม");

    // ถ้า ownerId === 1 (CEO) ให้ไม่จำกัดสิทธิ์ เลือกได้ทั้งหมด
    useEffect(() => {
        if (ownerId === 1) {
            setSelectedUsername(["all"]);
            setSelectedTeam(["all"]);
        } else if (leaderData?.isStaff) {
            setSelectedUsername([leaderData.username]);
            setSelectedTeam(leaderData.teams || []);
        } else if (hasViewAllAccess) {
            setSelectedUsername(["all"]);
            setSelectedTeam(["all"]);
        } else if (leaderData?.isLeader || leaderData?.isManager) {
            setSelectedTeam(leaderData.teams || []);
            const usernamesInTeam = uniqueUsername
                .filter(([username, team]) => leaderData.teams?.includes(team))
                .map(([username]) => username);
            setSelectedUsername(usernamesInTeam);
        } else {
            setSelectedTeam([]);
        }
    }, [leaderData, hasViewAllAccess, uniqueTeam, ownerId]);

    const handleReset = () => {
        setDateRange({
            start: startOfMonth(today()),
            end: endOfMonth(today()),
        });
        if (leaderData?.isStaff) {
            setSelectedUsername([leaderData.username]);
            setSelectedTeam(leaderData.teams || []);
        } else if (hasViewAllAccess || ownerId === 1) {
            setSelectedUsername(["all"]);
            setSelectedTeam(["all"]);
        } else if (leaderData?.isManager || leaderData?.isLeader) {
            const usernamesInTeam = uniqueUsername
                .filter(([username, team]) => leaderData.teams?.includes(team))
                .map(([username]) => username);
            setSelectedUsername(usernamesInTeam);
            setSelectedTeam(leaderData.teams || []);
        } else {
            setSelectedUsername([]);
            setSelectedTeam([]);
        }
        setFindUsername('');
        setSelectedNameList(new Set(['all']));
        setDateMode('เดือน');
        // รีเซ็ต orderType เป็น all
        setOrderType("all");
    };

    return (
        <section title={'แดชบอร์ด CRM'}>
            <div className='space-y-4'>
                <section>
                    <Card shadow='none' radius='sm'>
                        <CardBody>
                            <div className='flex items-center w-full'>
                                <div className='flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-center w-full'>
                                    <DateSelector
                                        value={dateRange}
                                        onChange={(value) => setDateRange(value)}
                                        modeState={dateMode}
                                        onModeChange={setDateMode}
                                    />
                                    {ownerId === 1 && (
                                        <Select
                                            label="ตัวแทนขาย"
                                            className="max-w-full sm:max-w-[250px] w-full"
                                            variant="bordered"
                                            isLoading={isLoading}
                                            disallowEmptySelection
                                            selectedKeys={selectedAgent}
                                            onSelectionChange={(keys) => setSelectedAgent(new Set(keys))}
                                        >
                                            {agentData.map((item) => (
                                                <SelectItem key={item.agent_id} value={item.agent_name} textValue={item.nick_name}>
                                                    {item.agent_name} - ({item.nick_name})
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    )}
                                    {(ownerId === 1 || appContext.accessCheck.haveAny([ACCESS.dashboard_crm.view_agent_sale])) && (
                                        <Select
                                            label="ตัวแทนที่ขายให้เรา"
                                            className="max-w-full sm:max-w-[200px] w-full"
                                            variant="bordered"
                                            isLoading={isLoading}
                                            disallowEmptySelection
                                            selectedKeys={selectedNameList}
                                            onSelectionChange={(keys) => setSelectedNameList(new Set(keys))}
                                        >
                                            <SelectItem key="all" value="all">ทั้งหมด</SelectItem>
                                            {listAgentData.map((item) => (
                                                <SelectItem key={item.customerOwnerId} value={item.customerOwnerId} textValue={item.nick_name}>
                                                    {item.name} - ({item.nick_name})
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    )}

                                    <Select
                                        label="พนักงานขาย"
                                        placeholder={
                                            (hasViewAllAccess || ownerId === 1)
                                                ? "เลือกพนักงานขายทั้งหมด"
                                                : leaderData?.isManager
                                                    ? "พนักงานขายในทีมของคุณ"
                                                    : leaderData?.isLeader
                                                        ? "พนักงานขายในทีมของคุณ"
                                                        : leaderData?.isStaff
                                                            ? "ข้อมูลพนักงานขายของคุณ"
                                                            : "ไม่มีข้อมูลพนักงานขาย"
                                        }
                                        variant="bordered"
                                        selectedKeys={new Set(selectedUsername)}
                                        selectionMode="multiple"
                                        isLoading={isLoading}
                                        disallowEmptySelection
                                        onSelectionChange={(keys) => {
                                            const keysArray = Array.from(keys);
                                            if (keysArray.includes("all") && keysArray.length > 1) {
                                                setSelectedUsername(keysArray.filter(key => key !== "all"));
                                            } else {
                                                setSelectedUsername(keysArray);
                                            }
                                        }}
                                        className="max-w-full sm:max-w-[200px] w-full"
                                        isDisabled={ownerId !== 1 &&
                                            !hasViewAllAccess &&
                                            (!leaderData?.isManager && (leaderData?.isLeader || leaderData?.isStaff))
                                        }
                                    >
                                        <SelectItem key="all" value="all" textValue='ทั้งหมด'>
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedUsername(["all"]);
                                                }}
                                            >
                                                ทั้งหมด
                                            </div>
                                        </SelectItem>

                                        {uniqueUsername
                                            .filter(([username, team]) => {
                                                if (hasViewAllAccess || ownerId === 1) {
                                                    return true;
                                                }
                                                if (leaderData?.isManager && leaderData?.teams) {
                                                    return leaderData.teams.includes(team);
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
                                                <SelectItem
                                                    key={username}
                                                    value={username}
                                                    onPress={(e) => {
                                                        e.stopPropagation();
                                                        if (selectedUsername.includes("all")) {
                                                            setSelectedUsername([username]);
                                                        }
                                                    }}
                                                >
                                                    {username}
                                                </SelectItem>
                                            ))}
                                    </Select>

                                    {!leaderData?.isStaff && (
                                        <Input
                                            label="ค้นหา"
                                            placeholder="ค้นหาด้วยชื่อพนักงาน"
                                            variant="bordered"
                                            className="max-w-full sm:max-w-[200px] w-full"
                                            value={findUsername}
                                            onChange={(e) => setFindUsername(e.target.value)}
                                            endContent={<SearchIcon />}
                                        />
                                    )}

                                    <Select
                                        label="ทีม"
                                        placeholder={
                                            (hasViewAllAccess || ownerId === 1)
                                                ? "เลือกทีมทั้งหมด"
                                                : leaderData?.isManager
                                                    ? "เลือกทีมของคุณ"
                                                    : leaderData?.isLeader
                                                        ? "ทีมของคุณถูกล็อกไว้"
                                                        : leaderData?.isStaff
                                                            ? "ทีมของคุณ"
                                                            : "ไม่มีข้อมูลทีม"
                                        }
                                        isDisabled={ownerId !== 1 &&
                                            !hasViewAllAccess &&
                                            (!leaderData?.isManager && (leaderData?.isLeader || leaderData?.isStaff))
                                        }
                                        disallowEmptySelection
                                        variant="bordered"
                                        isLoading={isLoading}
                                        selectionMode="multiple"
                                        selectedKeys={new Set(selectedTeam)}
                                        onSelectionChange={(keys) => {
                                            const keysArray = Array.from(keys);
                                            if (keysArray.includes("all") && keysArray.length > 1) {
                                                setSelectedTeam(keysArray.filter(key => key !== "all"));
                                            } else {
                                                setSelectedTeam(keysArray);
                                            }
                                        }}
                                        className="max-w-full sm:max-w-[200px] w-full"
                                    >
                                        <SelectItem key="all" value="all" textValue='ทั้งหมด'>
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedTeam(["all"]);
                                                }}
                                            >
                                                ทั้งหมด
                                            </div>
                                        </SelectItem>
                                        {(hasViewAllAccess || ownerId === 1)
                                            ? uniqueTeam.map((team) => (
                                                <SelectItem key={team} value={team}>
                                                    {team}
                                                </SelectItem>
                                            ))
                                            : leaderData?.isManager
                                                ? leaderData?.teams?.map((team) => (
                                                    <SelectItem key={team} value={team}>
                                                        {team}
                                                    </SelectItem>
                                                ))
                                                : leaderData?.teams?.map((team) => (
                                                    <SelectItem key={team} value={team}>
                                                        {team}
                                                    </SelectItem>
                                                ))}
                                    </Select>

                                    {/* เพิ่ม Select สำหรับออเดอร์: ลูกค้าเก่า / ลูกค้าใหม่ / ทั้งหมด */}
                                    <Select
                                        label="ออเดอร์"
                                        placeholder='เลือกค้นหาตามออเดอร์'
                                        variant='bordered'
                                        className="max-w-full sm:max-w-[200px] w-full"
                                        selectionMode="single"
                                        disallowEmptySelection
                                        selectedKeys={new Set([orderType])}
                                        onSelectionChange={(keys) => {
                                            const val = Array.from(keys)[0];
                                            setOrderType(val); // "all", "old", "new"
                                        }}
                                    >
                                        <SelectItem key="all">ทั้งหมด</SelectItem>
                                        <SelectItem key="old">ออเดอร์ลูกค้าเก่า</SelectItem>
                                        <SelectItem key="new">ออเดอร์ลูกค้าใหม่</SelectItem>
                                    </Select>

                                    {appContext.accessCheck.haveAll([hasComparedAccess]) && (
                                        <Button
                                            color="primary"
                                            variant="flat"
                                            onPress={() => { onOpen(); }}
                                        >
                                            เปรียบเทียบ
                                        </Button>
                                    )}
                                    <Tooltip content='รีเฟรช'>
                                        <Button
                                            isIconOnly
                                            radius='lg'
                                            color='primary'
                                            variant='light'
                                            onPress={handleReset}
                                        >
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
                                <div className='hidden lg:block ml-auto text-nowrap text-center'>
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button className="capitalize" variant="bordered">
                                                {selectedValue}
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu
                                            disallowEmptySelection
                                            aria-label="เลือกมุมมอง"
                                            selectedKeys={selectedKeys}
                                            selectionMode="single"
                                            variant="flat"
                                            onSelectionChange={setSelectedKeys}
                                        >
                                            <DropdownItem key="การ์ด" description="รูปการแสดงผลสถิติแบบการ์ด">
                                                การ์ด
                                            </DropdownItem>
                                            {appContext.accessCheck.haveAny([ACCESS.dashboard_crm.view_all_ranking]) && (
                                                <DropdownItem key="อันดับ" description="แสดงผลอันดับ">
                                                    อันดับ
                                                </DropdownItem>
                                            )}
                                            <DropdownItem key="ตาราง" description="รูปการแสดงผลสถิติแบบตาราง">
                                                ตาราง
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </section>

                {/* ส่วนแสดงผลข้อมูล */}
                <section>
                    <div className="block sm:hidden md:hidden">
                        <CardView
                            data={data.currentMonth}
                            lastMonth={data.lastMonth}
                            selectedUsername={selectedUsername}
                            selectedTeam={selectedTeam}
                            findUsername={findUsername}
                            isLoading={isLoading}
                            leaderData={leaderData}
                            isPercentageSelected={isPercentageSelected}
                            // ส่ง orderType ไปยัง CardView เผื่อกรองข้อมูลต่อ
                            orderType={orderType}
                        />
                    </div>
                    <div className="hidden sm:block md:block">
                        {selectedValue === "ตาราง" ? (
                            <TableCrm
                                currentMonthData={data.currentMonth}
                                lastMonthData={data.lastMonth}
                                selectedUsername={selectedUsername}
                                selectedTeam={selectedTeam}
                                findUsername={findUsername}
                                isLoading={isLoading}
                                // ส่ง orderType ไปยัง TableCrm เพื่อนำไปกรองออเดอร์เก่า/ใหม่ได้
                                orderType={orderType}
                            />
                        ) : selectedValue === "การ์ด" ? (
                            <CardView
                                data={data.currentMonth}
                                lastMonth={data.lastMonth}
                                isLoading={isLoading}
                                selectedUsername={selectedUsername}
                                selectedTeam={selectedTeam}
                                findUsername={findUsername}
                                // รับ orderType ไปกรอง
                                orderType={orderType}
                            />
                        ) : (
                            <RankingCard
                                startDate={formatDateObject(dateRange.start)}
                                endDate={formatDateObject(dateRange.end)}
                                ownerId={currentUser.businessId}
                                customOwnerId={currentUser.businessId}
                                dateMode={dateMode}
                                selectedTeam={selectedTeam}
                                selectedUsername={selectedUsername}
                                findUsername={findUsername}
                                // รับ orderType ได้เช่นกัน
                                orderType={orderType}
                            />
                        )}
                    </div>
                </section>

                <ComparedModal
                    data={data}
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    comparedSelectedUsername={comparedSelectedUsername}
                    setComparedSelectedUsername={setComparedSelectedUsername}
                    comparedSelectedTeam={comparedSelectedTeam}
                    setComparedSelectedTeam={setComparedSelectedTeam}
                    uniqueUsername={uniqueUsername}
                    uniqueTeam={uniqueTeam}
                    isLoading={isLoading}
                    leaderData={leaderData}
                />
            </div>
        </section>
    );
}

export default DashboardCrm;
