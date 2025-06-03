import { Checkbox, DateRangePicker, Select, SelectItem, Tab, Tabs } from "@heroui/react"
import React, { createContext, useEffect, useState } from 'react'
import ControlBar from '../components/OthersCostComponent/ControlBar'
import Contents from '../components/OthersCostComponent/Contents'
import { useAppContext } from '../../../contexts/AppContext';
import { endOfMonth, startOfMonth, today } from '@internationalized/date';
import expensesService from "@/services/expensesService";
import { formatDateObject } from "@/utils/dateUtils";
import agentService from "@/services/agentService";

export const Data = createContext();

function TabsOthersCost() {

  const contextData = useAppContext();
  const currentUser = contextData.currentUser;
  const { agent } = useAppContext();
  const { selectedAgent } = agent;

  const [isAction, setIsAction] = useState(false)
  const [searchText, setSearchText] = useState('')

  // BaseRole Check
  const isSuperAdmin = currentUser?.baseRole === 'SUPER_ADMIN'
  const isAdmin = currentUser?.baseRole === 'ADMIN'
  const isManager = currentUser?.baseRole === 'MANAGER'

  // Fetch Data
  const [typeData, setTypeData] = useState([])
  const [data, setData] = useState([])
  const [agentData, setAgentData] = useState([])

  // Select Data
  const [typeValue, setTypeValue] = useState("ทั้งหมด")
  const [selectAgent, setSelectAgent] = useState(null)

  // Loading
  const [isLoading, setIsLoading] = useState(false)

  // Date
  const startDate = startOfMonth(today())
  const endDate = endOfMonth(today())
  const [expensesDate, setExpensesDate] = useState(today())
  const [dateRange, setDateRange] = useState({
    start: startDate,
    end: endDate,
  });

  // Fetch ExpensesData

  const fetchAgent = async () => {
    try {
      const agent = await agentService.getAgent()
      setAgentData(agent)
    } catch (error) {
      console.error('ไม่สามารถดึงข้อมูลได้:', error);
    }
  }

  const getDataOtherExpenses = async () => {
    setIsLoading(true)
    try {
      const expenses = await expensesService.getExpensesDetails(isSuperAdmin ? Number(selectAgent) : currentUser.agent.agentId, formatDateObject(dateRange.start), formatDateObject(dateRange.end))
      setData(expenses);
      setIsLoading(false)
    } catch (error) {
      console.error('ไม่สามารถดึงข้อมูลได้:', error);
    }
  }

  useEffect(() => {
    fetchAgent();
  }, [])

  useEffect(() => {
    if (selectAgent !== null) {
      getDataOtherExpenses();
    }
  }, [selectAgent, dateRange])

  useEffect(() => {
    if (agentData.length > 0 && selectAgent === null) {
      setSelectAgent(agentData[0]?.agentId)
    }
  }, [agentData])

  const filterByDateRange = (itemDate) => {
    if (!dateRange || !dateRange.start || !dateRange.end) {
      return true;
    }

    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    const dateTarget = new Date(itemDate);
    return dateTarget >= startDate && dateTarget <= endDate;
  };

  const filterData = data?.filter(item => {
    const matchesType = typeValue === 'ทั้งหมด' || item.expensesType.typeName === typeValue;
    const matchesDateRange = filterByDateRange(item.expensesDate);
    const martchText = item.remarks.toLowerCase().includes(searchText?.toLowerCase())
    const matchisActvive = item?.expensesType?.status === true

    return matchesDateRange && matchesType && martchText && matchisActvive
  });


  return (
    <div className='body-container'>
      <Data.Provider value={{
        dateRange, setDateRange, data, setData, isAction, setIsAction, currentUser, selectedAgent, typeData, setTypeData,
        typeValue, setTypeValue, getDataOtherExpenses, typeValue, filterData
      }}>
        <ControlBar expensesDate={expensesDate} setExpensesDate={setExpensesDate} setSearchText={setSearchText} searchText={searchText} isSuperAdmin={isSuperAdmin} setSelectAgent={setSelectAgent} selectAgent={selectAgent} agentData={agentData} />
        <Contents isLoading={isLoading} isSuperAdmin={isSuperAdmin} selectAgent={selectAgent} />
      </Data.Provider>
    </div >
  )
}

export default TabsOthersCost