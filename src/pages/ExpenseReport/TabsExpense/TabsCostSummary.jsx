import React, { createContext, useEffect, useState } from 'react'
import { useAppContext } from '../../../contexts/AppContext';
import { endOfMonth, startOfMonth, today } from '@internationalized/date';
import AgentSelector from '../../../component/AgentSelector';
import DateSelector from '../../../component/DateSelector';
import CostSummaryDashboard from '../components/OthersCostComponent/CostSummaryDashboard';
import { URLS } from '@/config';
import fetchProtectedData from '@/utils/fetchData';
import { Select, SelectItem } from "@heroui/react";
import AdsExpensesDashboard from '../components/OthersCostComponent/AdsExpensesDashboard';
import CommissionExpensesDashboard from '../components/OthersCostComponent/CommissionExpensesDashboard';
import OtherExpensesDashboard from '../components/OthersCostComponent/OtherExpensesDashboard';

export const CostSummaryData = createContext();

function TabsCostSummary() {

  const { agent } = useAppContext();
  const { selectedAgent } = agent;

  const contextData = useAppContext();
  const currentUser = contextData.currentUser;

  const currentMonthStart = startOfMonth(today());
  const currentMonthEnd = endOfMonth(today());

  // const [selectAgentFromModal, setSelectAgentFromModal] = useState(currentUser.businessId);
  const [dateRange, setDateRange] = useState({
    start: currentMonthStart,
    end: currentMonthEnd,
  });

  const thisYear = new Date().getFullYear();
  const firstYear = 2019;
  const [selectedYear, setSelectedYear] = useState(thisYear);

  const [commissionPercent, setCommissionPercent] = useState([]);

  const getCommissionSettings = async () => {
    try {
      const url = `${URLS.commission.commissionSetting}?businessId=${selectedAgent.id}`;
      const res = await fetchProtectedData.get(url);
      setCommissionPercent(res.data);
    } catch (error) {
      console.log('Error fetching commission settings:', error);
    }
  };

  // #region RETURN
  return (
    <>
      <div className='controlbar flex flex-row space-x-6 mt-2'>

        <DateSelector value={dateRange} onChange={setDateRange} />

        {currentUser.businessId === 1 && (
          <>
            <AgentSelector />
          </>
        )}
      </div>

      <div className="mt-4">

        <div className=''>
          <CostSummaryDashboard dateRange={dateRange} contextData={dateRange} currentUser={currentUser} />
        </div>

        <div className='mt-8'>
          <Select aria-label='year selector' placeholder='เลือกปี'
            selectedKeys={[selectedYear + '']}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            size='sm'
            color='success'
            disallowEmptySelection
            className='w-32 ms-5'
          >
            {[...Array(thisYear - firstYear + 1).keys()].map(e => {
              return <SelectItem key={thisYear - e} textValue={thisYear - e}>{thisYear - e}</SelectItem>
            })}
          </Select>
        </div>
      </div>


      <CostSummaryData.Provider value={{ dateRange, selectedYear, selectedAgent }}>
        <div className='flex flex-col lg:flex-row md:flex-row h-auto'>
          <AdsExpensesDashboard />
          <CommissionExpensesDashboard />
        </div>
        <OtherExpensesDashboard />
      </CostSummaryData.Provider>
    </>
  )
}

export default TabsCostSummary