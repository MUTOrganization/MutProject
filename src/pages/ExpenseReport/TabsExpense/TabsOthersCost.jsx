import { Checkbox, DateRangePicker, Select, SelectItem, Tab, Tabs } from "@heroui/react"
import React, { createContext, useEffect, useState } from 'react'
import ControlBar from '../components/OthersCostComponent/ControlBar'
import Contents from '../components/OthersCostComponent/Contents'
import { useAppContext } from '../../../contexts/AppContext';
import { endOfMonth, startOfMonth, today } from '@internationalized/date';
import expensesService from "@/services/expensesService";
import { formatDateObject } from "@/utils/dateUtils";

export const Data = createContext();

function TabsOthersCost() {

  const contextData = useAppContext();
  const currentUser = contextData.currentUser;
  const { agent } = useAppContext();
  const { selectedAgent } = agent;

  const [isAction, setIsAction] = useState(false)
  const [searchText, setSearchText] = useState('')

  // Fetch Data
  const [typeData, setTypeData] = useState([])
  const [data, setData] = useState([])

  // Select Type
  const [typeValue, setTypeValue] = useState("ทั้งหมด")

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
  const getDataOtherExpenses = async () => {
    setIsLoading(true)
    try {
      const res = await expensesService.getExpensesDetails(currentUser.agent.agentId, formatDateObject(dateRange.start), formatDateObject(dateRange.end))
      setData(res);
      setIsLoading(false)
    } catch (error) {
      console.error('ไม่สามารถดึงข้อมูลได้:', error);
    }
  }

  useEffect(() => {
    getDataOtherExpenses();
  }, [selectedAgent, dateRange])

  const filterByDateRange = (itemDate) => {
    if (!dateRange || !dateRange.start || !dateRange.end) {
      return true;
    }

    const startDate = new Date(dateRange.start.year, dateRange.start.month - 1, dateRange.start.day);
    const endDate = new Date(dateRange.end.year, dateRange.end.month - 1, dateRange.end.day);
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
        <ControlBar expensesDate={expensesDate} setExpensesDate={setExpensesDate} setSearchText={setSearchText} searchText={searchText} />
        <Contents isLoading={isLoading} />
      </Data.Provider>
    </div >
  )
}

export default TabsOthersCost