import { Checkbox, DateRangePicker, Select, SelectItem, Tab, Tabs } from "@heroui/react"
import React, { createContext, useEffect, useState } from 'react'
import ControlBar from '../components/OthersCostComponent/ControlBar'
import Contents from '../components/OthersCostComponent/Contents'
import WithDraw from '../components/OthersCostComponent/WithDraw';
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

  const [isAdd, setIsAdd] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [search, setSearch] = useState('')
  const [data, setData] = useState([])
  const [typeData, setTypeData] = useState([])
  const [isManageType, setIsManageType] = useState(false)
  const [isAction, setIsAction] = useState(false)
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

  return (
    <div className='body-container'>
      <Data.Provider value={{
        isAdd, setIsAdd, isEdit, setIsEdit, search, setSearch, dateRange, setDateRange, data, setData, isAction, setIsAction, currentUser, selectedAgent, typeData, setTypeData,
        isManageType, setIsManageType, typeValue, setTypeValue, getDataOtherExpenses
      }}>
        <ControlBar expensesDate={expensesDate} setExpensesDate={setExpensesDate} />
        <Contents isLoading={isLoading} />
      </Data.Provider>
    </div >
  )
}

export default TabsOthersCost