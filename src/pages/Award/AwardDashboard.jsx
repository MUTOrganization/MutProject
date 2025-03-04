import React, { useEffect, useMemo, useState } from 'react'
import DefaultLayout from '../../layouts/default'
import fetchProtectedData from '../../../utils/fetchData'
import { URLS } from '../../config'
import { useAppContext } from '../../contexts/AppContext'
import { Accordion, AccordionItem, Select, SelectItem, Avatar, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Chip, user, Image } from '@nextui-org/react'
import { formatNumber } from '@/component/FormatNumber'
import RankColor from './ConstantData'
import TypeColor from './ConstantData'
import ModalMoreDataAwardDashboard from './Modals/ModalMoreDataAwardDashboard'
import { sortArray } from '../../../utils/arrayFunc'
import AgentSelector from '@/component/AgentSelector'
import ConstantData from './ConstantData'
import EmployeeSelector from '@/component/EmployeeSelector'
// import {Avatar, AvatarIcon} from "@heroui/react";

function AwardDashboard() {
  const { agent } = useAppContext()
  const { selectedAgent } = agent;
  const contextData = useAppContext();
  const currentUser = contextData.currentUser;
  const [getMedal, setGetMedal] = useState([])
  const [getUserAwards, setGetUserAwards] = useState([])
  const thisYear = new Date().getFullYear()
  const firstYear = 2019;
  const [selectedYear, setSelctedYear] = useState(thisYear)
  const [selectedMedal, setSelectedMedal] = useState('0');
  const [selectedData, setSelectedData] = useState([])
  const [openModalMoreData, setOpenModalMoreData] = useState(false)
  const [userData, setUserData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isLoading, setIsLoading] = useState(false)
  const [filterRank, setFilterRank] = useState([])
  const [selectedSort, setSelectedSort] = useState('all');
  // const [selectAgentFromModal, setSelectAgentFromModal] = useState(currentUser.businessId);
  const [userInfo, setUserInfo] = useState([])
  const [getDepartment, setGetDepartment] = useState([])

  const rankColor = ConstantData.RankColor()
  const typeColor = ConstantData.TypeColor()

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const medalIdParam = selectedMedal !== '0' ? `&medalId=${selectedMedal}` : '';
      const [medals, userAwards, userInfo, departments] = await Promise.all([
        fetchProtectedData.get(`${URLS.award.getMedals}?&businessId=${selectedAgent.id}`),
        fetchProtectedData.get(`${URLS.award.getUserAwards}?year=${selectedYear}&businessId=${selectedAgent.id}${medalIdParam}`),
        fetchProtectedData.get(`${URLS.users.getAll}?businessId=${selectedAgent.id}`),
        fetchProtectedData.get(`${URLS.departments.getWithRoles}?businessId=${selectedAgent.id}`)
      ])
      setGetMedal(medals.data)
      setGetUserAwards(Array.isArray(userAwards.data) ? userAwards.data : [])
      setUserInfo(userInfo.data)
      setGetDepartment(departments.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false)
    }
  }
  const fetchUserData = async (controller) => {
    try {
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
    }
  };

  // useEffect(() => {
  //   if (contextData.agent && contextData.agent.selectedAgent && contextData.agent.selectedAgent.id) {
  //     setSelectAgentFromModal(contextData.agent.selectedAgent.id)
  //   }
  //   else {
  //     setSelectAgentFromModal(currentUser.selectedAgent.id === 1 ? '0' : currentUser.businessId)
  //   }
  // }, []);

  useEffect(() => {
    // setGetMedal([])
    setGetUserAwards([])
    fetchData()
  }, [selectedYear, selectedMedal, selectedAgent])

  useEffect(() => {
    const controller = new AbortController()
    fetchUserData(controller)
    return () => {
      controller.abort();
    }
  }, [selectedAgent])

  const filterData = useMemo(() => {

    let filteredUsers = (Array.isArray(getUserAwards) ? getUserAwards : [])
      // .filter(user => selectedType === 'all' || user.type === selectedType)
      .filter(user => selectedType === 'all' || getDepartment.some(department => department.name === selectedType && department.id === userInfo.find(info => info.username === user.username)?.depId))
      .filter(user => selectedEmployee === 'all' || user.username === selectedEmployee)
      .map(user => ({
        ...user,
        totalSales: user.monthlyAwards?.reduce((acc, a) => acc + a.totalSale, 0) || 0
      }))
      .sort((a, b) => b.totalSales - a.totalSales);

    if (selectedSort === 'top3') {
      const departmentGroups = {};
      filteredUsers.forEach(item => {
        const departmentName = userInfo?.find(user => user?.username === item?.username)?.depName;
        if (!departmentGroups[departmentName]) {
          departmentGroups[departmentName] = [];
        }
        departmentGroups[departmentName].push(item);
      });

      filteredUsers = Object.values(departmentGroups)
        .map(group => group.slice(0, 3))
        .flat();
    }

    return filteredUsers;
  }, [getUserAwards, selectedEmployee, selectedType, selectedSort, selectedAgent]);

  // const uniqueTypes = [...new Set((Array.isArray(getUserAwards) ? getUserAwards : []).map(item => item.type))];

  // const handleEmployeeSelection = (keys) => {
  //   const username = Array.from(keys)[0];

  //   if (username === 'all') {
  //     setSelectedEmployee('all');
  //     return;
  //   }
  //   setSelectedEmployee(username);
  // };

  const handleEmployeeSelection = (keys) => {
    //const username = Array.from(keys)[0];
    if (keys === 'all') {
      setSelectedEmployee('all');
      return;
    }
    // const findUser = userData.find(e => e.username === username);
    setSelectedEmployee(keys);
  };

  return (
    <div className='body bg-gray-50 h-auto p-6 rounded-2xl mt-4'>
      {/* FilterBar */}
      <div className='p-2 w-full flex flex-row justify-start items-center space-x-4'>
        <div className='bg-white rounded-2xl px-6 py-1 border-1 border-slate-200'>
          <span>Filter</span>
        </div>
        {/* Border */}
        <div className='border-1 border-slate-400 h-6 w-0.5'></div>
        {/* Year */}
        <Select aria-label='year selector' placeholder='เลือกปี'
          selectedKeys={[selectedYear + '']}
          onChange={(e) => setSelctedYear(Number(e.target.value))}
          size='sm'
          color='primary'
          disallowEmptySelection
          className='w-32'
        >
          {[...Array(thisYear - firstYear + 1).keys()].map(e => {
            return <SelectItem key={thisYear - e} textValue={thisYear - e}>{thisYear - e}</SelectItem>
          })}
        </Select>
        {currentUser.businessId === 1 && (
          <>
            <AgentSelector />
          </>
        )}
        {/* Medal */}
        <Select
          variant="bordered"
          className='w-48 shadow-sm'
          disallowEmptySelection
          selectedKeys={new Set([String(selectedMedal)])}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setSelectedMedal(selectedKey);
          }}
        >
          <SelectItem key={"0"} value={"0"}>เหรียญทั้งหมด</SelectItem>
          {getMedal.map((item) => (
            <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
          ))}
        </Select>
        {/* Type */}
        <Select
          className='w-48'
          variant="bordered"
          selectedKeys={[selectedType]}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setSelectedType(selectedKey);
          }}
        >
          <SelectItem key="all" value="all">ทุกแผนก</SelectItem>
          {getDepartment.map((type) => (
            <SelectItem key={type.name} value={type.name}>{type.name}</SelectItem>
          ))}
        </Select>
        {/* RankOrde */}
        <Select
          className='w-2/12'
          variant="bordered"
          selectedKeys={[selectedSort]}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setSelectedSort(selectedKey);
          }}
        >
          <SelectItem key="all" value="all">การแสดงผลทั้งหมด</SelectItem>
          <SelectItem key="top3" value="top3">3 อันดับแรกของแต่ละแผนก</SelectItem>
        </Select>
        {/* Employee */}
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
      </div>

      {/* Body */}
      <div className='bg-white p-4 rounded-2xl mt-4'>
        <div className='max-h-[720px] overflow-y-auto scrollbar-hide'>
          <Table isStriped className='table w-full text-sm text-slate-600' removeWrapper shadow='none' isHeaderSticky aria-label="Example static collection table">
            <TableHeader className='bg-slate-100'>
              <TableColumn className='text-center'>User</TableColumn>
              <TableColumn className='text-center'>ตำแหน่ง</TableColumn>
              <TableColumn className='text-center'>เหรียญ</TableColumn>
              <TableColumn className='text-center'>รางวัล</TableColumn>
              <TableColumn className='text-center'>ยอดขายรวม</TableColumn>
              <TableColumn className='text-center'></TableColumn>
            </TableHeader>

            <TableBody items={filterData} className='' loadingContent={<Spinner />} isLoading={isLoading}>
              {item => (
                <TableRow key={item.username} className='hover:bg-slate-50 cursor-pointer h-16 border-b-1 border-slate-100'>
                  <TableCell className='text-center w-2/12'>
                    <div className='flex items-center space-x-4 justify-start pl-4 rounded-full'>
                      <Avatar size='lg' src={userInfo.find(a => a?.username === item.username)?.displayImgUrl} />
                      <div className='flex flex-col items-start'>
                        <span>{item.username}</span>
                        <span className='text-slate-400'>{userInfo.find(a => a?.username === item.username)?.name}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col justify-center items-center space-y-2'>
                      <span className='font-bold'>{userInfo.find(a => a?.username === item.username)?.depName || '-'}</span>
                      <span className='text-slate-400'>{userInfo.find(a => a?.username === item.username)?.roleName}</span>
                    </div>
                  </TableCell>
                  <TableCell className='text-center'>
                    <span className='px-4 py-0.5 rounded-full' style={{
                      color: rankColor[item.award?.medalName]?.textColor,
                      backgroundColor: rankColor[item.award?.medalName]?.bc,
                    }}>
                      {item.award?.medalName || '-'}
                    </span>
                  </TableCell>
                  <TableCell className='text-center'>{item.award?.awardTitle || 'ไม่ได้รางวัล'}</TableCell>
                  <TableCell className='text-center'>{formatNumber(item.monthlyAwards?.reduce((acc, a) => acc += a.totalSale, 0)) || 0}</TableCell>
                  <TableCell className='text-center' onClick={() => { setOpenModalMoreData(true); setSelectedData(item); }}><span className='bg-blue-100 text-blue-500 cursor-pointer hover:bg-blue-200 px-2 py-1 rounded-md'>ข้อมูลเพิ่มเติม</span></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {openModalMoreData && (
        <ModalMoreDataAwardDashboard
          isOpen={openModalMoreData}
          onClose={() => setOpenModalMoreData(false)}
          selectedData={selectedData}
        />
      )}
    </div>
  )
}

export default AwardDashboard
