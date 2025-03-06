import React, { useEffect, useMemo, useState } from 'react'
import { URLS } from '../../../config'
import { useAppContext } from '../../../contexts/AppContext'
import fetchProtectedData from '../../../../utils/fetchData';
import { Accordion, AccordionItem, Avatar, Button, ButtonGroup, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { formatNumber } from '../../../component/FormatNumber';
import { MdOutlinePriceCheck } from 'react-icons/md';
import { ACCESS } from '../../../configs/access';
import { formatDateObject } from '@/component/DateUtiils';
import { CommissionData, sumCommissionData } from '@/pages/Commission/Components/YearlyContent/CommissionData';
import { calculate } from '@/component/Calculate';

function TeamView({ isUserInConfirmCommission, handleOpenModal, selectedKeys,
    handleSelectionChange, onFilterUpdate, getTeam, dateRange, selectedEmployee, currentData, selectedAgent }) {
    const { currentUser } = useAppContext();
    const [teamData, setTeamData] = useState([])
    const [getDataByLeader, setGetDataByLeader] = useState([])
    const [leaderData, setLeaderData] = useState([])
    const [teamName, setTeamName] = useState([])
    const [teamSelect, setTeamSelect] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState([])
    const [sortedCommissionDetails, setSortedCommissionDetails] = useState([])

    const tableColumns = [
        { key: 'username', text: 'รหัส', className: 'text-center' },
        { key: 'paidIncome', text: 'ยอดเงินเข้า', className: 'text-center' },
        { key: 'liftIncome', text: 'ยอดยก', className: 'text-center' },
        { key: 'nextLiftIncome', text: 'ยอดยกไปเดือนหน้า', className: 'text-center' },
        { key: 'delivery', text: 'ค่าส่งสุทธิ', className: 'text-center' },
        { key: 'liftDelivery', text: 'ยอดยกค่าส่ง', className: 'text-center' },
        { key: 'nextLiftDelivery', text: 'ยอดยกค่าส่งไปเดือนหน้า', className: 'text-center' },
        { key: 'totalIncome', text: 'ยอดเงินเข้าสุทธิ', className: 'text-center' },
        { key: 'totalDelivery', text: 'ยอดค่าส่งสุทธิ', className: 'text-center' },
        { key: 'netIncome', text: 'ยอดเงินสุทธิ', className: 'text-center' },
        { key: 'finedAmount', text: 'ค่าปรับ', className: 'text-center' },
        { key: 'commission', text: 'ค่าคอม', className: 'text-center' },
        { key: 'Ict', text: 'Incentive', className: 'text-center' },
    ];

    async function fetchAll() {
        setIsLoading(true)
        try {
            const [teamData, leaderData, commData] = await Promise.all([
                fetchProtectedData.get(`${URLS.teams.getByManager}/${currentUser.userName}`),
                fetchProtectedData.get(`${URLS.teams.getByLeader}/${currentUser.userName}`),
                fetchProtectedData.post(`${URLS.commission.getCommission}`, {
                    username: 'all',
                    businessId: selectedAgent,
                    startDate: formatDateObject(dateRange.start),
                    endDate: formatDateObject(dateRange.end),
                })
            ])
            const teams = []
            teamData.data.forEach(e => {
                teams.push(...e.teams)
            })
            const data = commData.data.map(item => {
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
            setTeamData(teams)
            setGetDataByLeader(leaderData.data)
            setSortedCommissionDetails(data)
            setIsLoading(false);
        } catch (error) {
            console.log('Error', error)
        } finally {
        }
    }
    console.log(sortedCommissionDetails)
    useEffect(() => {
        fetchAll()
    }, [teamSelect, dateRange])

    useEffect(() => {
        const names = teamData.map((e) => e.name);
        setTeamName(names);
    }, [teamData]);

    useEffect(() => {
        if (!teamSelect) {
            if (teamData && teamData.length > 0) {
                setTeamSelect(teamData[0].name);
            } else if (getDataByLeader && getDataByLeader.length > 0) {
                setTeamSelect(getDataByLeader[0].name);
            }
        }
    }, [getDataByLeader, teamData]);

    let AllData = []
    // const filterItem = useMemo(() => {
    //     if (teamData.length > 0) {
    //         const selectedTeam = teamData.find((team) => team.name === teamSelect);
    //         if (!selectedTeam) return [];

    //         return sortedCommissionDetails.filter((user) =>
    //             selectedTeam.members.some((member) => member.username === user.username)
    //         );
    //     }
    //     if (getDataByLeader.length > 0) {
    //         const selectedTeam = getDataByLeader.find((team) => team.name === teamSelect);
    //         if (!selectedTeam) return [];

    //         return sortedCommissionDetails.filter((user) =>
    //             selectedTeam.members.some((member) => member.username === user.username)
    //         );
    //     }
    // }, [teamSelect, getDataByLeader, sortedCommissionDetails, selectedEmployee]);

    const filterItem = useMemo(() => {
        let combinedTeams = [...teamData, ...getDataByLeader].sort((a, b) => a.name.localeCompare(b.name));
        const selectedTeam = combinedTeams.find((team) => team.name === teamSelect);

        if (!selectedTeam) return [];

        AllData = sortedCommissionDetails.filter((user) =>
            selectedTeam.members.some((member) => member.username === user.username)
        );

        return AllData;
    }, [teamSelect, getDataByLeader, teamData, sortedCommissionDetails, selectedEmployee]);
    console.log(filterItem)
    useEffect(() => {
        onFilterUpdate(filterItem)
        if (teamData && teamData.length > 0) {
            getTeam(teamData)
        }
        if (getDataByLeader && getDataByLeader.length > 0) {
            getTeam(getDataByLeader)
        }
    }, [filterItem, onFilterUpdate, getTeam]);

    const handleAlert = () => {
        if (isLoading) {
            return (
                <div className="bg-white/80 z-50 flex justify-center flex-col items-center py-8 rounded-md mt-8">
                    <Spinner />
                    <span>Loading...</span>
                </div>
            );
        }

        return (
            <div className="bg-white/80 z-50 flex justify-center flex-col items-center py-8 rounded-md">
                <span className='text-slate-500'>ไม่มีข้อมูล</span>
            </div>
        );
    };

    return (
        <>
            <div className='my-4 flex flex items-center'>
                {/* ดูทีมของตัวเอง */}
                {getDataByLeader && getDataByLeader.length > 0 ? (
                    <div className='flex flex-row items-center space-x-2'>
                        <span className='text-sm text-slate-600 bg-white rounded-md px-4 py-2'>ทีมที่เป็นหัวหน้า</span>
                        <ButtonGroup className=''>
                            {getDataByLeader.map((item, index) => (
                                <Button onPress={() => setTeamSelect(item.name)} className={`bg-white border-r-2 border-slate-100 text-slate-500 hover:scale-110 hover:bg-blue-500 hover:text-white ${index === 0 ? 'rounded-l-md' : 'rounded-none'} ${teamSelect.includes(item.name) && 'scale:110 bg-blue-500 text-white'} `}>
                                    ทีม ({item.name})
                                </Button>
                            ))}
                        </ButtonGroup>
                    </div>
                ) : (
                    <>
                        <div>
                            <span className='text-sm text-slate-500'>ไม่มีทีมที่เป็นหัวหน้า</span>
                        </div>
                    </>
                )}
                <div className='px-4 text-lg text-slate-600'>|</div>
                {/* ดูทั้งทีม */}
                {teamData && teamData.length > 0 ? (
                    <div className='flex flex-row items-center space-x-2'>
                        <span className='text-sm text-slate-600 bg-white rounded-md px-4 py-2'>ทีมที่ดูแล</span>
                        <ButtonGroup className=''>
                            {teamName.sort((a, b) => a.localeCompare(b)).map((item, index) => (
                                <Button onPress={() => setTeamSelect(item)} className={`bg-white border-r-2 border-slate-100 text-slate-500 hover:scale-110 hover:bg-blue-500 hover:text-white ${index === 0 ? 'rounded-l-md' : 'rounded-none'} ${teamSelect.includes(item) && 'scale:110 bg-blue-500 text-white'} `}>
                                    ทีม ({item})
                                </Button>
                            ))}
                        </ButtonGroup>
                    </div>
                ) : (
                    <div>
                        <span className='text-sm text-slate-500'>ไม่มีทีมที่ดูแล</span>
                    </div>
                )}
            </div>

            {filterItem && filterItem.length > 0 ? (
                <Table aria-label="Example static collection table" radius='sm' className='max-h-[720px] rounded-md overflow-y-auto mt-4 p-2 overflow-x-auto scrollbar-hide bg-white'
                    shadow='none'
                    isHeaderSticky
                    removeWrapper
                    selectionMode="multiple"
                    selectedKeys={selectedKeys}
                    onSelectionChange={handleSelectionChange}
                >
                    <TableHeader columns={tableColumns} className="text-center">
                        {(column) => (
                            <TableColumn
                                key={column.name}
                                className={`text-sm ${column.name === 'username' ? 'text-start' : 'text-end'}`}
                                allowsSorting={true}
                            >
                                {column.text}
                            </TableColumn>
                        )}
                    </TableHeader>

                    <TableBody>
                        {filterItem.length > 0 ? filterItem.map((user, index) => (
                            <TableRow onClick={() => handleOpenModal(user)} className={`h-12 cursor-pointer ${isUserInConfirmCommission(user.username) ? 'bg-green-100 text-green-500' : ''}`} key={`${user.username}-${index}`} >
                                <TableCell className='text-center'>{user.username}</TableCell>
                                <TableCell className='text-center'>{formatNumber(calculate("+", user.data.adminPaidIncome, user.data.upsalePaidIncome)) || 0}</TableCell>
                                <TableCell className='text-center'>{formatNumber(calculate("+", user.data.adminLiftIncome, user.data.upsaleLiftIncome)) || 0}</TableCell>
                                <TableCell className='text-center'>
                                    <span className='bg-blue-200 px-3 rounded-xl text-blue-500 py-0.5'>
                                        {formatNumber(calculate("+", user.data.adminNextLiftIncome, user.data.upsaleNextLiftIncome))}
                                    </span>
                                </TableCell>
                                <TableCell className='text-center'>{formatNumber(calculate("+", user.data.adminDelivery, user.data.upsaleDelivery)) || 0}</TableCell>
                                <TableCell className='text-center'>{formatNumber(calculate("+", user.data.adminLiftDelivery, user.data.upsaleLiftDelivery)) || 0}</TableCell>
                                <TableCell className='text-center'>
                                    <span className='bg-green-200 px-3 rounded-xl text-green-500 py-0.5'>
                                        {formatNumber(calculate("+", user.data.adminNextLiftDelivery, user.data.upsaleNextLiftDelivery))}
                                    </span>
                                </TableCell>
                                <TableCell className='text-center'>{formatNumber(calculate("+", calculate("+", user.data.adminPaidIncome, user.data.upsalePaidIncome), calculate("+", parseFloat(user.data.adminLiftIncome) || 0, parseFloat(user.data.upsaleLiftIncome) || 0))) || 0}</TableCell>
                                <TableCell className='text-center'>{formatNumber(calculate("+", calculate("+", user.data.adminDelivery, user.data.upsaleDelivery), calculate("+", user.data.adminLiftDelivery, user.data.upsaleLiftDelivery))) || 0}</TableCell>
                                <TableCell className='text-center'>{formatNumber(user.data.netIncome) || 0}</TableCell>
                                <TableCell className='text-center'>{formatNumber(user.data.finedAmount) || 0}</TableCell>
                                <TableCell className='text-center'>{formatNumber(user.data.commission) || 0}</TableCell>
                                <TableCell className='text-center'>{formatNumber(user.data.incentive) || 0}</TableCell>
                            </TableRow>
                        )) : null}
                        <TableRow aria-disabled className="sticky bottom-0 bg-slate-100 border-0 z-10 rounded-lg h-12 shadow-md">
                            <TableCell className="font-bold text-center">รวม</TableCell>
                            <TableCell className="text-slate-600 font-bold text-center">
                                {formatNumber(
                                    filterItem.reduce(
                                        (sum, item) => sum + (parseFloat(calculate("+", item.data.adminPaidIncome, item.data.upsalePaidIncome)) || 0),
                                        0
                                    )
                                )}
                            </TableCell>
                            <TableCell className="text-slate-600 font-bold text-center">
                                {formatNumber(
                                    filterItem.reduce(
                                        (sum, item) => sum + (parseFloat(calculate("+", item.data.adminLiftIncome, item.data.upsaleLiftIncome)) || 0),
                                        0
                                    )
                                )}
                            </TableCell>
                            <TableCell className="text-slate-600 font-bold text-center">
                                <span className='bg-blue-200 px-3 rounded-xl text-blue-500 py-0.5'>
                                    {formatNumber(
                                        filterItem.reduce(
                                            (sum, item) => sum + (parseFloat(calculate("+", item.data.adminNextLiftIncome, item.data.upsaleNextLiftIncome)) || 0),
                                            0
                                        )
                                    )}
                                </span>
                            </TableCell>
                            <TableCell className="text-slate-600 font-bold text-center">
                                {formatNumber(
                                    filterItem.reduce(
                                        (sum, item) => sum + (parseFloat(calculate("+", item.data.adminDelivery, item.data.upsaleDelivery)) || 0),
                                        0
                                    )
                                )}
                            </TableCell>
                            <TableCell className="text-slate-600 font-bold text-center">
                                {formatNumber(
                                    filterItem.reduce(
                                        (sum, item) => sum + (parseFloat(calculate("+", item.data.adminLiftDelivery, item.data.upsaleLiftDelivery)) || 0),
                                        0
                                    )
                                )}
                            </TableCell>
                            <TableCell className="text-slate-600 font-bold text-center">
                                <span className='bg-blue-200 px-3 rounded-xl text-blue-500 py-0.5'>
                                    {formatNumber(
                                        filterItem.reduce(
                                            (sum, item) => sum + (parseFloat(calculate("+", item.data.adminNextLiftDelivery, item.data.upsaleNextLiftDelivery)) || 0),
                                            0
                                        )
                                    )}
                                </span>
                            </TableCell>
                            <TableCell className="text-slate-600 font-bold text-center">
                                {formatNumber(
                                    filterItem.reduce(
                                        (sum, item) => {
                                            const adminIncome = calculate("+", item.data.adminPaidIncome, item.data.adminLiftIncome || 0);
                                            const upsaleIncome = calculate("+", item.data.upsalePaidIncome, item.data.upsaleLiftIncome || 0);
                                            const total = calculate("+", adminIncome, upsaleIncome);
                                            return sum + (parseFloat(total) || 0);
                                        }, 0
                                    )
                                )}
                            </TableCell>
                            <TableCell className="text-slate-600 font-bold text-center">
                                {formatNumber(
                                    filterItem.reduce(
                                        (sum, item) => sum + (parseFloat(calculate("+", calculate("+", item.data.adminDelivery, item.data.upsaleDelivery), calculate("+", item.data.adminLiftDelivery, item.data.upsaleLiftDelivery))) || 0),
                                        0
                                    )
                                )}
                            </TableCell>
                            <TableCell className="text-slate-600 font-bold text-center">
                                {formatNumber(
                                    filterItem.reduce(
                                        (sum, item) => sum + (parseFloat(item.data.netIncome) || 0),
                                        0
                                    )
                                )}
                            </TableCell>
                            <TableCell className="text-slate-600 font-bold text-center">
                                {formatNumber(
                                    filterItem.reduce(
                                        (sum, item) => sum + (parseFloat(item.data.finedAmount) || 0),
                                        0
                                    )
                                )}
                            </TableCell>
                            <TableCell className="text-slate-600 font-bold text-center">
                                {formatNumber(
                                    filterItem.reduce(
                                        (sum, item) => sum + (parseFloat(item.data.commission) || 0),
                                        0
                                    )
                                )}
                            </TableCell>
                            <TableCell className="text-slate-600 font-bold text-center">
                                {formatNumber(
                                    filterItem.reduce(
                                        (sum, item) => sum + (parseFloat(item.data.incentive) || 0),
                                        0
                                    )
                                )}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table >
            ) : (
                handleAlert()
            )}
        </>
    )
}

export default TeamView
