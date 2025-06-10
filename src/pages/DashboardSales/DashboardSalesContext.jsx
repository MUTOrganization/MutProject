import { useAppContext } from '@/contexts/AppContext';
import User from '@/models/user';
import agentService from '@/services/agentService';
import commissionService from '@/services/commissionService';
import settingComService from '@/services/settingComService';
import userService from '@/services/userService';
import { formatDateObject } from '@/utils/dateUtils';
import { endOfMonth, endOfYear, startOfMonth, startOfYear, today } from '@internationalized/date';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const DashboardSalesContext = createContext();

export function useDashboardSalesContext() {
    return useContext(DashboardSalesContext);
}

export function DashboardSalesProvider({ children }) {
    const { currentUser } = useAppContext();

    // BaseRole Check
    const isSuperAdmin = currentUser?.baseRole === 'SUPER_ADMIN';
    const isAdmin = currentUser?.baseRole === 'ADMIN';

    // Fetch Data
    const [commissionData, setCommissionData] = useState([])
    const [agentData, setAgentData] = useState([])
    /** @type {[User[]]} */
    const [userData, setUserData] = useState([])
    const [commissionSetting, setCommissionSetting] = useState(null)

    //  Other State
    const [isLoading, setIsLoading] = useState(true)
    const [selectAgent, setSelectAgent] = useState(isSuperAdmin ? 'ทั้งหมด' : currentUser?.agent?.agentId)
    const [selectUser, setSelectUser] = useState('ทั้งหมด')
    const [isSwitch, setIsSwitch] = useState(false)

    // Date
    const [dateMode, setDateMode] = useState('เดือน')
    const [date, setDate] = useState({
        start: startOfMonth(today()),
        end: endOfMonth(today())
    })

    //  Fetch Agent Data
    const fetchAgentData = async () => {
        try {
            const agent = await agentService.getAgent();
            setAgentData(agent)
        } catch (err) {
            console.log('Can not get Agent Data At DashboardSalesContext', err)
        }
    }

    const fetchUserData = async () => {
        try {
            const users = await userService.getAllUser(Number(selectAgent))
            setUserData(users)
        } catch (err) {
            console.log('Can not get User Data At DashboardSalesContext', err)
            setUserData([])
        }
    }

    //  Fetch Commission && Users Data
    const fetchCommissionData = async () => {
        setIsLoading(true)
        try {
            let user = selectUserParams(userData)
            const commissionData = await commissionService.getCommission(selectAgent, user, formatDateObject(date.start), formatDateObject(date.end));
            setCommissionData(commissionData)
        } catch (err) {
            console.log('Can not get Commission Data At DashboardSalesContext', err)
        } finally {
            setIsLoading(false)
        }
    }
    
    // Refresh Data
    const fetchRefreshData = async () => {
        setIsLoading(true)
        try {
            let user = selectUserParams(userData)
            const commissionData = await commissionService.getCommission(selectAgent, user, formatDateObject(date.start), formatDateObject(date.end), true);
            setCommissionData(commissionData)
        } catch (err) {
            console.error('Can not get Commission Data At DashboardSalesContext', err)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchComSettingData = async () => {
        try {
            //const roleId = selectRoleIdParams()
            const selectUserData = userData.find(u => u.username === selectUser)
            if (!selectUserData) {
                setCommissionSetting(null)
                return;
            }
            const comSetting = await settingComService.getCommissionSetting(selectUserData?.role?.roleId, selectUserData?.probStatus ? 1 : 0)
            setCommissionSetting(comSetting)
        } catch (err) {
            if (err.response.status === 404) {
                setCommissionSetting({})
            } else {
                console.error('Can not get Commission Setting Data At DashboardSalesContext', err)
                setCommissionSetting(null)
            }
        }
    }

    const selectRoleIdParams = () => {
        if (isSuperAdmin) {
            if (selectUser === 'ทั้งหมด') return;
            const userRoleId = userData.find(u => u?.username === selectUser)?.role?.roleId
            return userRoleId
        } else {
            return currentUser.role.roleId
        }
    }

    const selectUserParams = (users) => {
        if (!users || users.length === 0) return [];

        if ((isSuperAdmin || isAdmin)) {
            if (selectUser === 'ทั้งหมด') {
                return users.map(u => u.username);
            } else {
                return [selectUser];
            }
        } else {
            return [currentUser.username];
        }
    }


    useEffect(() => {
        fetchAgentData();
    }, [])

    useEffect(() => {
        if (selectAgent !== 'ทั้งหมด' && userData.length > 0) {
            fetchCommissionData();
            fetchComSettingData();
        }
    }, [date, selectUser, selectAgent, userData])


    useEffect(() => {
        if (agentData.length > 0 && selectAgent === 'ทั้งหมด') {
            setSelectAgent(agentData[0]?.agentId)
        }
    }, [agentData])

    useEffect(() => {
        fetchUserData()
        if (currentUser.baseRole === 'SUPER_ADMIN' || currentUser.baseRole === 'ADMIN') {
            setSelectUser('ทั้งหมด')
        } else {
            setSelectUser(currentUser.username)
        }
    }, [selectAgent])

    // Get Commission
    const getCommissionData = () => {
        return commissionData.reduce((acc, curr) => {
            return acc + curr.data.reduce((sum, item) => sum + Number(item.commission || 0), 0)
        }, 0)
    }

    // Get Total Sales
    const getProfit = () => {
        return commissionData.reduce((acc, curr) => {
            return acc + curr.data.reduce((sum, item) => sum + Number(item.adminIncome || 0), 0)
        }, 0)
    }

    // Get Order
    const getOrder = () => {
        return commissionData.reduce((acc, curr) => {
            return acc + curr.data.reduce((sum, item) => sum + Number(item.orderCount || 0), 0)
        }, 0)
    }

    // Get Paid Income
    const getPaidIncome = () => {
        return commissionData.reduce((acc, curr) => {
            return acc + curr.data.reduce((sum, item) => sum + Number(item.adminLiftIncome || 0), 0)
        }, 0)
    }

    // Gte Money Status
    const getMoneyStatus = () => {
        const result = {
            summary: { income: 0, paidIncome: 0, orderCount: 0, paidOrderCount: 0 }
        };

        commissionData.forEach(user => {
            user.data.forEach(item => {
                item.paymentTypes.forEach(pt => {
                    const type = pt.type;
                    if (!result[type]) {
                        result[type] = {
                            income: 0,
                            paidIncome: 0,
                            orderCount: 0,
                            paidOrderCount: 0
                        };
                    }
                    if (!isSwitch) {
                        result[type].income += Number(pt.income || 0);
                        result[type].paidIncome += Number(pt.paidIncome || 0);

                        result.summary.income += Number(pt.income || 0);
                        result.summary.paidIncome += Number(pt.paidIncome || 0);
                    } else {
                        result[type].orderCount += Number(pt.orderCount || 0);
                        result[type].paidOrderCount += Number(pt.paidOrderCount || 0);

                        result.summary.orderCount += Number(pt.orderCount || 0);
                        result.summary.paidOrderCount += Number(pt.paidOrderCount || 0);
                    }
                });
            });
        });

        return result;
    };

    const getOrderStatus = () => {
        const result = {
            wait: { amount: 0, count: 0 },
            onDelivery: { amount: 0, count: 0 },
            finished: { amount: 0, count: 0 },
            returned: { amount: 0, count: 0 },
            upsaleReturned: { amount: 0, count: 0 }
        };

        commissionData.forEach(user => {
            user.data.forEach(item => {
                const status = item.orderStatus;
                if (status) {
                    Object.keys(status).forEach(key => {
                        result[key].amount += Number(status[key].amount || 0);
                        result[key].count += Number(status[key].count || 0);
                    });
                }
            });
        });

        return result;
    };
    
    const value = {
        currentUser,
        commissionData,
        agentData,
        userData,
        isLoading,
        setIsLoading,
        getCommissionData,
        getProfit,
        getOrder,
        getPaidIncome,
        getMoneyStatus,
        isSwitch,
        setIsSwitch,
        getOrderStatus,
        date,
        setDate,
        dateMode,
        setDateMode,
        selectAgent,
        setSelectAgent,
        selectUser,
        setSelectUser,
        selectUser,
        isSuperAdmin,
        isAdmin,
        fetchRefreshData,
        commissionSetting
    };

    return (
        <DashboardSalesContext.Provider value={value}>
            {children}
        </DashboardSalesContext.Provider>
    );
}
