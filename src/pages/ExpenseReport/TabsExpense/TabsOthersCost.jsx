import { Checkbox, DateRangePicker, Select, SelectItem, Tab, Tabs } from '@nextui-org/react'
import React, { createContext, useEffect, useState } from 'react'
import ControlBar from '../components/OthersCostComponent/ControlBar'
import Contents from '../components/OthersCostComponent/Contents'
import WithDraw from '../components/OthersCostComponent/WithDraw';
import { useAppContext } from '../../../contexts/AppContext';
import { endOfMonth, startOfMonth, today } from '@internationalized/date';

export const Data = createContext();

function TabsOthersCost() {

  const contextData = useAppContext();
  const currentUser = contextData.currentUser;
  const { agent } = useAppContext();
  const { selectedAgent } = agent;

  const currentMonthStart = startOfMonth(today());
  const currentMonthEnd = endOfMonth(today());

  const [dateRange, setDateRange] = useState({
    start: currentMonthStart,
    end: currentMonthEnd,
  });

  const [isAdd, setIsAdd] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [search, setSearch] = useState('')
  const [data, setData] = useState([])
  const [typeData, setTypeData] = useState([])
  const [isManageType, setIsManageType] = useState(false)
  const [isAction, setIsAction] = useState(false)

  // WithDraw
  const [searchWithDraw, setSearchWithDraw] = useState('')
  const [searchDateWithDraw, setSearchDateWithDraw] = useState('')
  const [searchDepartment, setSearchDepartment] = useState('ทั้งหมด')

  return (
    <div className='body-container'>
      <Data.Provider value={{
        isAdd, setIsAdd, isEdit, setIsEdit, search, setSearch, dateRange, setDateRange, data, setData, searchWithDraw, setSearchWithDraw, isAction, setIsAction,
        searchDateWithDraw, setSearchDateWithDraw, searchDepartment, setSearchDepartment, currentUser, selectedAgent, typeData, setTypeData, isManageType, setIsManageType
      }}>
        <ControlBar />
        <Contents />
      </Data.Provider>
    </div>
  )
}

export default TabsOthersCost