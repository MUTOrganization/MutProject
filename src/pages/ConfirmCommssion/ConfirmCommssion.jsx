import React, { useEffect, useMemo, useState } from 'react';
import DefaultLayout from '../../layouts/default';
import { Input, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, DateRangePicker, Spinner, DateInput, DatePicker, Avatar, Chip, Checkbox, Button, ButtonGroup, Switch } from '@nextui-org/react';
import fetchProtectedData from '../../../utils/fetchData';
import { URLS } from '../../config';
import { endOfMonth, startOfMonth, today } from '@internationalized/date';
import AgentSelector from '../../component/AgentSelector';
import { useAppContext } from '../../contexts/AppContext';
import ModalManageCom from './Components/Modals/ModalManageCom';
import { FaCheck, FaEdit, FaTrash } from 'react-icons/fa';
import { MdOutlinePriceCheck } from "react-icons/md";
import { defaultDate, formatDateObject, formatDateThaiAndTime } from '../../component/DateUtiils';
import CutOffModal from './Components/Modals/CutOffModal';
import DateSelector from '../../component/DateSelector';
import { CommissionData, sumCommissionData } from '../Commission/Components/YearlyContent/CommissionData';
import { useCommissionContext } from '../Commission/CommissionContext';
import { cFormatter } from '../../../utils/numberFormatter';
import { ExportExcel } from '../../../utils/exportExcel';
import { sortArray } from '../../../utils/arrayFunc';
import ModalMultipleCom from './Components/Modals/ModalMultipleCom';
import { calculate } from '../../component/Calculate';
import { formatNumber } from '../../component/FormatNumber';
import { ACCESS } from '../../configs/access';
import TableCom from './Components/Table';
import TeamView from './Components/TeamView';
import EmployeeSelector from '@/component/EmployeeSelector';

function ConfirmCommssion() {

    const { agent, accessCheck } = useAppContext();
    const { selectedAgent } = agent;
    const contextData = useAppContext();
    const currentUser = contextData.currentUser;
    const currentData = useAppContext();

    const currentMonthStart = startOfMonth(today());
    const currentMonthEnd = endOfMonth(today());
    const { setCommData, usersCommData, setUsersCommData, settingData, isSettingLoaded } = useCommissionContext();
    const isAllViewUser = accessCheck.haveOne(ACCESS.commisson.confirmCommission);

    const [data, setData] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(currentData.accessCheck.haveAny([ACCESS.commisson.confirmCommission_AllUser]) ? 'all' : currentUser.userName);
    const [userData, setUserData] = useState([]);
    const [commissionDetails, setCommissionDetails] = useState([])
    const [commissionPercent, setCommissionPercent] = useState([])
    const [selectAgentFromModal, setSelectAgentFromModal] = useState(selectedAgent.id);
    const [isLoading, setIsLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [selectData, setSelectData] = useState(null)
    const [percent, setPercent] = useState(null)
    const [confirmCommssionData, setConfirmCommssion] = useState([])
    const [cutOffModal, setCutOffModal] = useState(false)
    const [getCutCommssionDate, setGetCutCommissionDate] = useState([])
    const [modalAction, setModalAction] = useState('')
    const [isActionEdit, setIsActionEdit] = useState(false)
    const [multipleCommissionModal, setMultipleCommissionModal] = useState(false)
    const [selectedKeys, setSelectedKeys] = useState(new Set());
    const [filteredData, setFilteredData] = useState([]);
    const [isCheckedConfirm, setIsCheckedConfirm] = useState(true)
    const [isTeamView, setIsTeamView] = useState(false)
    const [teamFilteredData, setTeamFilteredData] = useState([]);
    const [getTeamForExport, setGetTeamForExport] = useState([]);
    const [dateMode, setDateMode] = useState('เดือน');
    // const [selectedOwnAgent, setSelectOwnAgent] = useState(isAllOwnerViewUser ? 'all' : selectedAgent.id);

    const handleTeamFilterUpdate = (filteredData) => {
        setTeamFilteredData(filteredData);
    };
    const [dateRange, setDateRange] = useState({
        start: currentMonthStart,
        end: currentMonthEnd,
    });

    const getCutoffDateForNextMonth = (dateRange) => {
        const selectedDate = new Date(dateRange.start.year, dateRange.start.month - 1);
        const nextMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 2);
        return formatDateThaiAndTime(nextMonth)
    };
    const [cutOffDate, setCutOffDate] = useState(getCutoffDateForNextMonth(dateRange))

    // #region เอาข้อมูล ค่าคอมที่ยืนยันแล้ว    
    const getConfirmCommssionData = async () => {
        setIsLoading(true)
        let month = `${dateRange.start.year}-${dateRange.start.month.toString().padStart(2, '0')}`
        const url = `${URLS.commission.confirmCommission}/getMonthlyCommssion?businessId=${selectedAgent.id}&monthIndex=${month}&year=${dateRange.start.year}`
        try {
            const res = await fetchProtectedData.get(url)
            setConfirmCommssion(res.data)
            console.log(confirmCommssionData)
            console.log(dateRange.start.month)
        } catch (error) {
            console.log('Something Wrong', error)
        } finally {
            setIsLoading(false)
        }
    }

    // #region เอาข้อมูล Setting ของ Commission
    const getSettingCommission = async () => {
        setIsLoading(true)
        try {
            const url = `${URLS.setting.getCommissionSettingByBusiness}?businessId=${selectedAgent.id}`;
            const res = await fetchProtectedData.get(url)
            setCommissionPercent(res.data)
        } catch (error) {
            console.log('Something Wrong', error)
        } finally {
            setIsLoading(false)
        }
    }

    // #region เอาข้อมูลค่าคอมทั้งหมด
    const getData = async () => {
        const url = `${URLS.commission.getCommission}`;
        try {
            setIsLoading(true)
            const res = await fetchProtectedData.post(url, {
                username: selectedEmployee,
                businessId: selectedAgent.id,
                startDate: formatDateObject(dateRange.start),
                endDate: formatDateObject(dateRange.end),
            });
            const data = res.data.map(item => {
                const userStatus = {
                    probStatus: item.probStatus,
                    roleId: item.roleId
                }
                const commDataSet = item.data.map(e => new CommissionData(e, userStatus));
                const userSum = sumCommissionData(commDataSet);
                return {
                    ...item,
                    data: userSum,
                }
            });
            setData(data);
            setIsLoading(false)
        } catch (error) {
            // console.log('Something went wrong:', error);
        }
    };
    
    // #region เอาข้อมูลวันตัดรอบ    
    const handlegetCutoffCommissionDate = async () => {
        setIsLoading(true)
        let monthSet = `${dateRange.start.year}-${dateRange.start.month}`
        const url = `${URLS.commission.confirmCommission}/get-cutoff-commission?businessId=${selectedAgent.id}&monthSet=${monthSet}`
        try {
            const res = await fetchProtectedData.get(url)
            setGetCutCommissionDate(res.data)
        } catch (error) {
            console.log('Something went wrong:', error);
        } finally {
            setIsLoading(false)
        }
    }
    // #region เอาข้อมูล User    
    const fetchUserData = async (controller) => {
        try {
            setIsLoading(true)
            const response = await fetchProtectedData.get(`${URLS.users.getAll}`, {
                params: { businessId: selectedAgent.id },
                signal: controller.signal
            });
            setUserData(response.data);
        } catch (err) {
            if (err.name === 'CanceledError') {
                console.log('abort2');
                return;
            }
            console.error('Error fetching user data:', err);
        } finally {
            setIsLoading(false)
        }
    };

    // #region All UseEffect
    useEffect(() => {
        setData([]);
        setCommissionDetails([]);
        setConfirmCommssion([]);
    }, [dateRange, selectedAgent, selectedEmployee]);

    // useEffect(() => {
    //     if (!isSettingLoaded || isLoading) return;
    //     const controller = new AbortController()
    //     getData(controller);
    //     return () => {
    //         controller.abort();
    //     }
    // }, [selectedEmployee, commissionPercent, dateRange, selectedAgent])

    // useEffect(() => {
    //     if (!selectedEmployee) {
    //          setSelectedEmployee(currentUser.role === "Manager" ? 'all' : currentUser.userName);
    //     }
    // }, [currentUser, selectedEmployee]);

    useEffect(() => {
        // if (selectedEmployee === null) {
        //     if (currentData.accessCheck.haveAny([ACCESS.commisson.confirmCommission_TeamView])) {
        //         if (isTeamView) {
        //             setSelectedEmployee('all');
        //         } else {
        //             setSelectedEmployee(currentUser.userName);
        //         }
        //     } else if (currentData.accessCheck.haveAny([ACCESS.commisson.confirmCommission_AllUser])) {
        //         setSelectedEmployee('all');
        //     } else {
        //         setSelectedEmployee(currentUser.userName);
        //     }
        // } else if (isTeamView) {
        //     // Force 'all' selection in team view mode
        //     setSelectedEmployee('all');
        // } else if (!isTeamView && selectedEmployee === 'all' &&
        //     currentData.accessCheck.haveAny([ACCESS.commisson.confirmCommission_TeamView])) {
        //     // Reset to user's name when switching from team view to individual view
        //     setSelectedEmployee(currentUser.userName);
        // }
        if (!selectedEmployee) {
            if (currentData.accessCheck.haveAny([ACCESS.commisson.confirmCommission_TeamView])) {
                setSelectedEmployee(currentUser.userName);
            } else if (currentData.accessCheck.haveAny([ACCESS.commisson.confirmCommission_AllUser])) {
                setSelectedEmployee('all');
            } else {
                setSelectedEmployee(currentUser.userName);
            }
        }

    }, [currentUser, selectedEmployee, currentData, isTeamView]);

    useEffect(() => {
        const controller = new AbortController()
        fetchUserData(controller)
        return () => {
            controller.abort();
        }
    }, [selectedAgent])

    useEffect(() => {
        if (selectedEmployee) {
            getData();
        }
    }, [selectedEmployee, selectedAgent, dateRange]);

    useEffect(() => {
        getData(); //เอาข้อมูลค่าคอมทั้งหมด
        getSettingCommission(); //เอาข้อมูล Setting ของ Commission
        getConfirmCommssionData();  //เอาข้อมูลค่าคอมทั้งหมด
        handlegetCutoffCommissionDate(); //เอาเดือนรอบตัดแต่ละ ตัวแทน
    }, [selectedAgent, dateRange, selectedEmployee])

    useEffect(() => {
        if (isActionEdit) {
            getData();
            getSettingCommission();
            getConfirmCommssionData()
            handlegetCutoffCommissionDate();
            setIsActionEdit(false);
        }
    }, [isActionEdit]);

    // useEffect(() => {
    //     if (contextData.agent && contextData.agent.selectedAgent && contextData.agent.selectedAgent.id) {
    //         setSelectAgentFromModal(contextData.agent.selectedAgent.id)
    //     }
    //     else {
    //         setSelectAgentFromModal(currentUser.businessId === 1 ? '0' : currentUser.businessId)
    //     }
    // }, []);

    useEffect(() => {
        if (currentData.accessCheck.haveAny([ACCESS.commisson.confirmCommission_AllUser]) || currentData.accessCheck.haveAny([ACCESS.commisson.confirmCommission_TeamView])) {
            if (selectedKeys === 'all') {
                isTeamView ? setFilteredData(teamFilteredData) : setFilteredData(sortedCommissionDetails)
            }
        }
    }, [selectedKeys, selectedEmployee, currentData, isTeamView])

    useEffect(() => {
        if (!isTeamView) {
            setSelectedKeys(new Set());
            setFilteredData([]);
        }
    }, [isTeamView]);

    // useEffect(() => {
    //     if (currentUser.role === 'Staff') {
    //         setIsCheckedConfirm(true)
    //     }
    // }, [])

    // #region End UseEffect
    const handleCalCommission = (netAmount, user) => {
        if (isNaN(netAmount) || netAmount === 0) {
            return 0;
        }
        const com_setting = commissionPercent.find(
            (e) =>
                e.department === user.depName &&
                e.role === user.roleName &&
                e.prob_status === user.probStatus
        );
        if (!com_setting || !Array.isArray(com_setting.tier_list?.percentage)) {
            return 0;
        }
        for (let item of com_setting.tier_list.percentage) {
            setPercent(item.percentage)
            const maxAmount = parseInt(item.maxAmount, 10);
            const minAmount = parseInt(item.minAmount, 10);
            const percentage = parseFloat(item.percentage) / 100;

            if (maxAmount === 0 && minAmount === 0) {
                return netAmount * percentage;
            }
            if (netAmount >= minAmount && netAmount <= maxAmount) {
                return netAmount * percentage;
            }
        }
    }

    const isUserInConfirmCommission = (username) => {
        return confirmCommssionData.some(data => {
            const conditionsMet =
                data.username === username
            return conditionsMet;
        });
    };

    const isUserArray = (user) => {
        return confirmCommssionData.some(data =>
            user.some(item => item.username === data.username)
        );
    };

    useEffect(() => {
        if (data.length === 0) return;

        const updatedCommissionDetails = data.map(user => {
            //ยอดเงินเข้า
            const adminIncome = user.data.adminPaidIncome || 0 // ยอดเงินเข้าแอดมิน
            const upsaleIncome = user.data.upsalePaidIncome || 0  // ยอดเงินเข้าอัพเซล

            // ยอดเงินเข้าสุทธิ
            const incomeAmount = calculate("+", adminIncome, upsaleIncome) || 0; //ยอดเงินเข้า
            const liftingBalance = calculate("+", parseFloat(user.data.adminLiftIncome) || 0, parseFloat(user.data.upsaleLiftIncome) || 0); // ยอดยก
            const iftingBalanceNextMonth = calculate("+", user.data.adminNextLiftIncome, user.data.upsaleNextLiftIncome) // ยอดยกไปเดือนหน้า

            const netIncomeAmount = calculate("+", incomeAmount, liftingBalance) // ยอดเงินสุทธิ Final

            // ยอดค่าส่งสุทธิ
            const netShippingCost = calculate("+", user.data.adminDelivery, user.data.upsaleDelivery) // ค่าส่งสุทธิ
            const shippingCostRaised = calculate("+", user.data.adminLiftDelivery, user.data.upsaleLiftDelivery) // ยอดยกค่าส่ง

            const shippingCostRaisedNextMonth = user.data.deliveryNextMonth  // ยอดยกค่าส่งไปเดือนหน้า

            const netShippingAmount = calculate("+", netShippingCost, shippingCostRaised) // ยอดค่าส่งสุทธิ Final

            // ยอดเงินสุทธิ
            const netAmount = calculate("-", netIncomeAmount, netShippingAmount)
            return {
                username: user.username,
                teamName: user.teamName,
                incomeAmount: incomeAmount, //ยอดเงินเข้า
                liftingBalance: liftingBalance, // ยอดยก
                iftingBalanceNextMonth: iftingBalanceNextMonth || 0, // ยอดยกไปเดือนหน้า
                netShippingCost: netShippingCost, // ค่าส่งสุทธิ
                shippingCostRaised: calculate("+", user.data.adminLiftDelivery, user.data.upsaleLiftDelivery), // ยอดยกค่าส่ง
                shippingCostRaisedNextMonth: calculate("+", user.data.adminNextLiftDelivery, user.data.upsaleNextLiftDelivery) || 0, // ยอดยกค่าส่งไปเดือนหน้า
                netIncomeAmount: netIncomeAmount || 0, // ยอดเงินเข้าสุทธิ
                netShippingAmount: netShippingAmount || 0, // ยอดค่าส่งสุทธิ
                netAmount: netAmount || 0, // ยอดเงินสุทธิ
                //commission: handleCalCommission(netAmount, user) || 0, // ค่าคอม
                probStatus: user.probStatus,
                depName: user.depName,
                roleName: user.roleName,
                commission: user.data.commission || 0, // ค่าคอม
                // SubData-------------------
                adminIncome: user.data.adminIncome || 0, // ยอดแอดมิน
                adminPaidIncome: user.data.adminPaidIncome || 0, // ยอดเงินเข้าแอดมิน
                upSaleIncome: user.data.upsalePaidIncome || 0, // ยอดเงินเข้าอัพเซล
                adminSale: user.data.adminIncome || 0, // ยอดขายแอดมิน
                upSale: user.data.upsaleIncome || 0, // ยอดอัพเซล
                adminLift: user.data.adminLiftIncome, //ยอดยกแอดมิน
                upsaleLift: user.data.upsaleLiftIncome, // ยอดยกอัพเซล
                orders: user.data.oldCustomerOrderCount || 0, // ออเดอร์
                orderUpsale: user.data.newCustomerOrderCount || 0, // ออเดอร์อัพเซล
                adminDelivery: user.data.adminDelivery || 0, // ยอดค่าส่งแอดมิน
                upsaleDelivery: user.data.upsaleDelivery || 0,  // ยอดค่าส่งอัพเซล
                adminLiftDelivery: user.data.adminLiftDelivery || 0, // ยอดยกค่าส่งแอดมิน
                upsaleLiftDelivery: user.data.upsaleLiftDelivery || 0,  // ยอดยกค่าส่งอัพเซล
                adminNextLiftIncome: user.data.adminNextLiftIncome || 0, // ยอดยกแอดมินไปเดือนหน้า
                upsaleNextLiftIncome: user.data.upsaleNextLiftIncome || 0, // ยอดอัพเซลไปเดือนหน้า
                adminNextLiftDelivery: user.data.adminNextLiftDelivery || 0, // ค่าส่งแอดมินไปเดือนหน้า
                upsaleNextLiftDelivery: user.data.upsaleNextLiftDelivery || 0, // ค่าส่งอัพเซลไปเดือนหน้า
                finedAmount: user.data.finedAmount || 0, // ค่าปรับ
                adminUnpaid: user.data.adminUnpaid || 0, // ยอดเงินค้างแอดมิน
                upsaleUnpaid: user.data.upsaleUnpaid || 0, // ยอดเงินค้างอัพเซล
                // totalSale: calculate("+", adminIncome, upSale) || 0 // ยอดขาย
            }

        });

        setCommissionDetails(updatedCommissionDetails.flat());
    }, [data, commissionPercent]);

    const handleOpenModal = (e) => {
        setSelectData(e)
        setOpenModal(true)
    }

    const handleCloseModal = (e) => {
        if (e === 'cf_com') {
            setOpenModal(false)
        }
        if (e === 'cutOffDate') {
            setCutOffModal(false)
        }
        if (e === 'multiplecom') {
            setMultipleCommissionModal(false)
        }
    }

    const sortedCommissionDetails = useMemo(() => {
        // When isCheckedConfirm is false, show only confirmed records
        if (!isCheckedConfirm) {
            return data.filter(e => 
                confirmCommssionData.some(a => e.username === a.username)
            );
        }
        
        // When isCheckedConfirm is true, show all records sorted by confirmation status
        return data.slice().sort((a, b) => {
            // First sort by confirmation status - unconfirmed records first
            const aIsInConfirm = confirmCommssionData.some(c => c.username === a.username);
            const bIsInConfirm = confirmCommssionData.some(c => c.username === b.username); 
            
            if (aIsInConfirm !== bIsInConfirm) {
                return aIsInConfirm ? 1 : -1;
            }

            // If confirmation status is the same, sort by username
            return a.username.localeCompare(b.username);
        });
    }, [isCheckedConfirm, data, confirmCommssionData]);

    // #region Export to Excel
    const handleExport = () => {
        if (!sortedCommissionDetails.length && !teamFilteredData.length) {
            alert("No data to export.");
            return;
        }

        let formatSheet = [];

        if (isTeamView) {
            // Export for Team View
            formatSheet = getTeamForExport.map(team => ({
                sheetName: `Team_${team.name}`,
                data: team.members.map(member => {
                    const item = sortedCommissionDetails.find(
                        detail => detail.username === member.username
                    );

                    if (!item) return {};

                    const percent = item.netAmount !== 0
                        ? ((item.commission / item.netAmount) * 100).toFixed(2) + '%'
                        : '0.00%';

                    return {
                        Team: team.name,
                        Username: item.username,
                        'ยอดเงินเข้า': item.incomeAmount,
                        'ยอดยก': item.liftingBalance,
                        'ยอดยกไปเดือนหน้า': item.iftingBalanceNextMonth,
                        'ค่าส่งสุทธิ': item.netShippingCost,
                        'ยอดยกค่าส่ง': item.shippingCostRaised,
                        'ยอดยกค่าส่งไปเดือนหน้า': item.shippingCostRaisedNextMonth,
                        'ยอดเงินเข้าสุทธิ': item.netIncomeAmount,
                        'ยอดค่าส่งสุทธิ': item.netShippingAmount,
                        'ยอดเงินสุทธิ': item.netAmount,
                        'ค่าปรับ': item.finedAmount,
                        'ค่าคอม': item.commission,
                        'เปอร์เซ็นต์': percent,
                    };
                }),
            }));
        } else {
            // Export for Global View
            formatSheet = [
                {
                    sheetName: 'commission_All',
                    data: sortedCommissionDetails.map(item => {
                        const percent = item.netAmount !== 0
                            ? ((item.commission / item.netAmount) * 100).toFixed(2) + '%'
                            : '0.00%';

                        return {
                            Username: item.username,
                            'ยอดเงินเข้า': item.incomeAmount,
                            'ยอดยก': item.liftingBalance,
                            'ยอดยกไปเดือนหน้า': item.iftingBalanceNextMonth,
                            'ค่าส่งสุทธิ': item.netShippingCost,
                            'ยอดยกค่าส่ง': item.shippingCostRaised,
                            'ยอดยกค่าส่งไปเดือนหน้า': item.shippingCostRaisedNextMonth,
                            'ยอดเงินเข้าสุทธิ': item.netIncomeAmount,
                            'ยอดค่าส่งสุทธิ': item.netShippingAmount,
                            'ยอดเงินสุทธิ': item.netAmount,
                            'ค่าปรับ': item.finedAmount,
                            'ค่าคอม': item.commission,
                            'เปอร์เซ็นต์': percent,
                        };
                    }),
                },
            ];
        }
        // Export Excel
        ExportExcel('commission_export', formatSheet);
    };

    // const handleEmployeeSelection = (keys) => {
    //     const username = Array.from(keys)[0];

    //     if (username === 'all') {
    //         setSelectedEmployee('all');
    //         return;
    //     }
    //     setSelectedEmployee(username);
    // };

    const handleEmployeeSelection = (keys) => {
        if (!keys) return;

        if (keys === 'all') {
            setSelectedEmployee('all');
            return;
        }
        setSelectedEmployee(keys);
    };

    const handleSelectionChange = (keys) => {
        setSelectedKeys(keys);

        if (isTeamView) {
            // Handle team view logic
            const selectedKeysArray = Array.from(keys);
            const selectedData = teamFilteredData.filter((item, index) =>
                selectedKeysArray.includes(`${item.username}-${index}`)
            );
            setFilteredData(selectedData);
        } else {
            // Handle individual view logic
            const selectedKeysArray = Array.from(keys);
            const selectedData = sortedCommissionDetails.filter((item, index) =>
                selectedKeysArray.includes(`${item.username}-${index}`)
            );
            setFilteredData(selectedData);
        }
    };

    const isCutoffDateReached = () => {
        const filterDate = getCutCommssionDate.find(item => {
            const currentDate = new Date();
            const formattedCurrentDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

            const targetDate = item.cutoff_date; // Assuming monthSet is in "YYYY-MM-DD" format

            return targetDate === formattedCurrentDate;
        });

        return filterDate !== undefined;
    };

    // #region RETURN
    return (
        <>
            {/* ControlBar */}
            <div className='controlbar bg-white p-6 rounded-md'>
                <div className='form flex flex-col lg:flex-row space-x-0 space-y-4 lg:space-y-0 lg:space-x-4 justify-between items-center'>
                    <div className='flex flex-col lg:flex-row space-y-4 lg:space-y-0 space-x-0 lg:space-x-6 w-full lg:w-9/12'>
                        {(currentData.accessCheck.haveAny([ACCESS.commisson.confirmCommission_TeamView]) || currentData.accessCheck.haveAny([ACCESS.commisson.confirmCommission_AllUser])) && (
                            <div className='flex flex-row space-x-2 items-center'>
                                <span className='text-sm'>ดูแบบทีม</span>
                                <Switch onValueChange={() => setIsTeamView(!isTeamView)} />
                            </div>
                        )}
                        <DateSelector value={dateRange} onChange={(value) => setDateRange(value)} modeState={dateMode} onModeChange={setDateMode} isShowDateRange={false} />
                        {currentData.accessCheck.haveAny([ACCESS.commisson.confirmCommission_AllUser]) && (
                            <>
                                {/* <Select
                                    label="เลือกพนักงาน"
                                    className="lg:w-72 w-full"
                                    variant="bordered"
                                    disallowEmptySelection
                                    onSelectionChange={handleEmployeeSelection}
                                >
                                    <SelectItem key="all" textValue="ทั้งหมด">
                                        ทั้งหมด
                                    </SelectItem>
                                    {sortArray(userData, 'username').map((user) => (
                                        <SelectItem key={user.username} textValue={user.username}>
                                            <div className="flex items-center p-1 gap-3">
                                                <Avatar
                                                    src={user.displayImgUrl || ''}
                                                    color="primary"
                                                    isBordered
                                                    name={user.nickName ? user.nickName.charAt(0) : "?"}
                                                    size="md"
                                                />
                                                <div className="flex flex-col flex-grow">
                                                    <span className="text-sm font-bold">
                                                        {user.username.replace(/[^a-zA-Z0-9!@#$%^&*(),.?":{}|<>_\-\s]/g, '')}
                                                    </span>
                                                    <p className="text-sm text-slate-600">{user.name || user.nickName || '-'}</p>
                                                </div>
                                                <div className="flex flex-col items-center ml-auto gap-1">
                                                    <Chip size="sm" color={user.depName === 'CRM' ? 'success' : 'warning'} variant="flat">
                                                        {user.depName ?? '--'}
                                                    </Chip>
                                                    <p className="text-xs text-slate-600 text-center">{user.roleName}</p>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </Select> */}
                                <div>
                                    <EmployeeSelector
                                        employeeList={userData}
                                        selectedEmployee={selectedEmployee}
                                        onSelected={handleEmployeeSelection}
                                        label="เลือกพนักงานขาย"
                                    />
                                </div>
                            </>
                        )}
                        {currentUser.businessId === 1 && (
                            <>
                                <AgentSelector />
                            </>
                        )}
                    </div>


                    <div className='flex flex-row items-center space-x-4'>
                        <div>
                            <button onPress={handleExport} className='px-6 py-1.5 bg-green-100 text-green-500 rounded-md text-sm hover:bg-green-300 hover:text-white '>Export To Excel</button>
                        </div>
                    </div>

                    {(filteredData.length > 1 || selectedKeys === 'all') && (
                        <div className='absolute bottom-16 right-10 z-50'>
                            <div onClick={() => setMultipleCommissionModal(true)} data-tip='ยืนยันทั้งหมด' className='tooltip px-5 py-5 bg-blue-500 text-white rounded-full border-4 border-blue-200 hover:scale-110 transition duration-150 ease-in cursor-pointer'>
                                <span><MdOutlinePriceCheck className='text-4xl' /></span>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            <div className={`flex flex-row text-sm ${currentUser.role === 'Staff' || isTeamView === true ? 'justify-end' : 'justify-between'} items-center relative`}>
                {currentData.accessCheck.haveAny([ACCESS.commisson.confirmCommission_AllUser]) && !isTeamView && (
                    <div className='space-x-3 flex items-center'>
                        <ButtonGroup>
                            <Button onPress={() => setIsCheckedConfirm(true)} className={`${isCheckedConfirm ? 'bg-blue-500 text-white hover:bg-blue-400' : 'bg-white text-black hover:bg-blue-400 hover:text-white'}`} >ดูทั้งหมด</Button>
                            <Button onPress={() => setIsCheckedConfirm(false)} className={`${!isCheckedConfirm ? 'bg-blue-500 text-white hover:bg-blue-400' : 'bg-white text-black hover:bg-blue-400 hover:text-white'}`} >ยืนยันแล้ว</Button>
                        </ButtonGroup>
                    </div>
                )}
                <div className={`${isTeamView ? 'md:absolute lg:absolute -top-3 right-0 sm:block' : 'flex flex-row items-center space-x-4'} relative`}>
                    <div >
                        <button className='px-'></button>
                    </div>
                    <div className='bg-red-200 py-2 px-4 space-x-2 rounded-md my-3'>
                        <span className="font-bold text-red-500">วันตัดรอบ</span>
                        {getCutCommssionDate.map(item => (
                            <span className="font-bold text-red-500">
                                {formatDateThaiAndTime(item.cutoff_date)}
                            </span>
                        ))}
                        {currentData.accessCheck.haveAny([ACCESS.commisson.confirmCommission_CutoffDate]) && (
                            <span className='text-red-500 underline underline-offset-4 font-bold cursor-pointer hover:text-white' onClick={() => setCutOffModal(!cutOffModal)}>กำหนดวันตัดรอบใหม่</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Body Table */}
            {isTeamView ? (
                <TeamView dateRange={dateRange} setSelectedEmployee={setSelectedEmployee} sortedCommissionDetails={sortedCommissionDetails} currentData={currentData} isUserInConfirmCommission={isUserInConfirmCommission} selectedKeys={selectedKeys} handleSelectionChange={handleSelectionChange} handleOpenModal={handleOpenModal} onFilterUpdate={(data) => setTeamFilteredData(data)} getTeam={(data) => setGetTeamForExport(data)} selectedAgent={selectedAgent.id} />
            ) : (
                <TableCom selectedKeys={selectedKeys} handleSelectionChange={handleSelectionChange} selectAgent={selectedAgent.id} isLoading={isLoading} data={data} sortedCommissionDetails={sortedCommissionDetails} isUserInConfirmCommission={isUserInConfirmCommission} handleOpenModal={handleOpenModal} />
            )}

            {openModal && (
                <ModalManageCom
                    isOpen={openModal}
                    onClose={() => handleCloseModal('cf_com')}
                    data={selectData}
                    cal={calculate}
                    formatNumber={formatNumber}
                    calculateCom={handleCalCommission}
                    percent={percent}
                    currentUser={currentUser}
                    dateRange={dateRange}
                    getCutCommssionDate={getCutCommssionDate}
                    validateUser={isUserInConfirmCommission}
                    confirmCommssionData={confirmCommssionData}
                    getCutoffDateForNextMonth={getCutoffDateForNextMonth}
                    setIsActionEdit={setIsActionEdit}
                    selectAgent={selectedAgent.id}
                    isCutoffDateReached={isCutoffDateReached}
                />

            )}

            {cutOffModal && (
                <CutOffModal
                    isOpen={cutOffModal}
                    onClose={() => handleCloseModal('cutOffDate')}
                    currentUser={currentUser}
                    selectAgent={selectedAgent.id}
                    getCutCommssionDate={getCutCommssionDate}
                    action={modalAction}
                    setIsActionEdit={setIsActionEdit}
                    dateRange={dateRange}
                    getCutoffDateForNextMonth={getCutoffDateForNextMonth}
                    setCutOffDate={setCutOffDate}
                    cutoffDate={cutOffDate}
                />
            )}

            {multipleCommissionModal && (
                <ModalMultipleCom
                    isOpen={multipleCommissionModal}
                    onClose={() => handleCloseModal('multiplecom')}
                    data={filteredData}
                    formatNumber={formatNumber}
                    comdata={sortedCommissionDetails}
                    isAll={selectedKeys}
                    selectAgent={selectedAgent.id}
                    dateRange={dateRange}
                    currentUser={currentUser}
                    setIsActionEdit={setIsActionEdit}
                    validateUser={isUserArray}
                    confirmCommssionData={confirmCommssionData}
                    isCutoffDateReached={isCutoffDateReached}
                />
            )}
        </>
        // End Return
    );
}

export default ConfirmCommssion;
