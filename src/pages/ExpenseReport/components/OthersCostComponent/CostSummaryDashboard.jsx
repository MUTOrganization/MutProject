import { Spinner } from '@nextui-org/react';
import React, { useEffect, useState, useMemo } from 'react';
import { formatNumber } from '../../../../component/FormatNumber';
import { URLS } from '../../../../config';
import fetchProtectedData from '../../../../../utils/fetchData';
import { formatDateObject } from '../../../../component/DateUtiils';
import { CommissionData, sumCommissionData } from '../../../Commission/Components/YearlyContent/CommissionData';
import { calculate } from '../../../../component/Calculate';
import { useCommissionContext } from '../../../Commission/CommissionContext';
import { useAppContext } from '../../../../contexts/AppContext';

function CostSummaryDashboard({ dateRange, contextData, currentUser }) {
    const { isSettingLoaded } = useCommissionContext();
    const { agent } = useAppContext();
    const { selectedAgent } = agent;

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [otherExpenses, setOtherExpenses] = useState([]);
    const [adsExpenses, setAdsExpenses] = useState([]);
    const [commissionPercent, setCommissionPercent] = useState([]);

    useEffect(() => {
        const fetchCommissionSettings = async () => {
            try {
                const url = `${URLS.setting.getCommissionSettingByBusiness}?businessId=${selectedAgent.id}`;
                const res = await fetchProtectedData.get(url);
                setCommissionPercent(res.data);
            } catch (error) {
                console.error('Error fetching commission settings:', error);
            }
        };

        fetchCommissionSettings();
    }, [selectedAgent, dateRange]);

    const fetchAll = async (controller) => {
        setIsLoading(true);
        try {
            const [comData, otherExpensesData, adsData] = await Promise.all([
                fetchProtectedData.post(
                    `${URLS.commission.getFullYear}`,
                    {
                        username: 'all',
                        businessId: selectedAgent.id,
                        startDate: formatDateObject(dateRange.start),
                        endDate: formatDateObject(dateRange.end),
                        ownerId: selectedAgent.id,
                    },
                    { signal: controller.signal }
                ),
                fetchProtectedData.get(
                    `${URLS.OTHEREXPENSES}/getOtherExpenses?businessId=${selectedAgent.id}&startDate=${formatDateObject(dateRange.start)}&endDate=${formatDateObject(dateRange.end)}`
                ),
                fetchProtectedData.post(`${URLS.ADSFORM}/getAds`, {
                    teamAds: 'all',
                    businessId: selectedAgent.id,
                    startDate: formatDateObject(dateRange.start),
                    endDate: formatDateObject(dateRange.end),
                }),
            ]);

            const processedData = comData.data.map((item) => {
                const userStatus = {
                    probStatus: item.probStatus,
                    roleId: item.roleId,
                };
                const commDataSet = item.data.map((e) => new CommissionData(e, userStatus, commissionPercent));
                const userSum = sumCommissionData(commDataSet);
                return { ...item, data: userSum };
            });

            setData(processedData);
            setOtherExpenses(otherExpensesData.data);
            setAdsExpenses(adsData.data);
            setIsLoading(false);
        } catch (error) {
            console.log('Error:', error);
        } finally {
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        // if (isSettingLoaded && commissionPercent.length > 0) {
        //     setData([]);
        //     setOtherExpenses([]);
        //     setAdsExpenses([]);
        //     fetchAll(controller);
        // }
        setData([]);
        setOtherExpenses([]);
        setAdsExpenses([]);
        fetchAll(controller);
        return () => controller.abort();

    }, [commissionPercent, selectedAgent, dateRange, isSettingLoaded]);

    const totalAds = useMemo(() => {
        return adsExpenses.length > 0
            ? adsExpenses.reduce((sum, item) => sum + parseFloat(item.ads || 0), 0)
            : 0;
    }, [adsExpenses]);
    console.log(adsExpenses)

    const totalCom = useMemo(() => {
        return selectedAgent.id !== 1 && data.length > 0
            ? data.reduce((sum, item) => sum + parseFloat(item?.data?.commission || 0), 0)
            : 0;
    }, [data, selectedAgent]);

    const totalOther = useMemo(() => {
        return otherExpenses.length > 0
            ? otherExpenses.reduce((sum, item) => {
                const listTotal = item.lists.reduce((listSum, listItem) => listSum + (parseFloat(listItem.totalAmount) || 0), 0);
                return sum + listTotal;
            }, 0)
            : 0;
    }, [otherExpenses]);

    const totalExpenses = useMemo(() => totalAds + totalCom + totalOther, [totalAds, totalCom, totalOther]);
    const totalSale = useMemo(() => {
        return data.length > 0
            ? data.reduce((sum, item) => {
                const income = parseFloat(calculate('+', item.data.adminIncome, item.data.upsaleIncome)) || 0;
                return sum + income;
            }, 0)
            : 0;
    }, [data]);

    const calculatePercentage = (value, total) => (total ? ((value / total) * 100).toFixed(2) : 0);

    return (
        <div className="mt-4 space-y-12">
            <div className="flex flex-row space-x-5 px-6 py-3 mb-3">
                <div className="flex flex-col border-2 rounded-lg py-3 px-8">
                    <span className="text-slate-500 text-sm">ยอดคงเหลือ</span>
                    <span className="text-2xl">
                        {isLoading ? (
                            <Spinner />
                        ) : (
                            formatNumber(Math.abs(calculate('-', totalExpenses, totalSale))) || '0'
                        )}
                    </span>                </div>
                <div className="flex flex-col border-2 rounded-lg py-3 px-8">
                    <span className="text-slate-500 text-sm">ยอดขาย</span>
                    <span className="text-2xl">{isLoading ? (<Spinner />) : (formatNumber(totalSale))}</span>
                </div>

                <div className="flex flex-row items-center border-2 rounded-lg py-3 px-8 space-x-8">
                    <div className="flex flex-col text-sm">
                        <span className="text-slate-500">รวมค่าใช้จ่าย</span>
                        <span className="text-2xl">{isLoading ? (<Spinner />) : (formatNumber(totalExpenses))}</span>
                    </div>

                    <div className="border-1 h-12 ms-5"></div>

                    <div className="flex flex-col text-sm">
                        <span className="text-slate-500">ค่าคอมมิชชั่น</span>
                        <span className="text-2xl text-slate-600">{isLoading ? <Spinner /> : formatNumber(totalCom)}</span>
                        <span className="text-xs text-green-500">{calculatePercentage(totalCom, totalExpenses)}%</span>
                    </div>

                    <div className="border-1 h-12 ms-5"></div>

                    <div className="flex flex-col text-sm">
                        <span className="text-slate-500">ค่า ADS</span>
                        <span className="text-2xl text-slate-600">{isLoading ? <Spinner /> : formatNumber(totalAds)}</span>
                        <span className="text-xs text-green-500">{calculatePercentage(totalAds, totalExpenses)}%</span>
                    </div>

                    <div className="border-1 h-12 ms-5"></div>

                    <div className="flex flex-col text-sm">
                        <span className="text-slate-500">ค่าใช้จ่ายอื่นๆ</span>
                        <span className="text-2xl text-slate-600">{isLoading ? <Spinner /> : formatNumber(totalOther)}</span>
                        <span className="text-xs text-green-500">{calculatePercentage(totalOther, totalExpenses)}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CostSummaryDashboard;
