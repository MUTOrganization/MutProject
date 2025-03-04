import React, { useState, useEffect } from "react";
import {
  Card,
  Checkbox,
  Button,
  CardBody,
  Select,
  SelectItem,
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  Tooltip
} from "@nextui-org/react";
import { useAppContext } from "../../contexts/AppContext";
import {
  today,
  startOfMonth,
  endOfMonth,
} from "@internationalized/date";
import { formatDateObject, formatDateRange } from "../../component/DateUtiils";
import TotalSaleSection from "./Components/TotalSaleSection";
import OrderRank from "./Components/OrderRank";
import { URLS } from "../../config";
import fetchProtectedData from "../../../utils/fetchData";
import TableView from './Components/tableVeiw';
import DateSelector from "../../component/DateSelector";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { HFRefresh } from "@/component/Icons";

function DashboardSummary() {

  dayjs.locale("th");
  const [vatRate, setVatRate] = useState(false);
  const { currentUser } = useAppContext();

  const [dateRange, setDateRange] = useState({
    start: startOfMonth(today()),
    end: endOfMonth(today()),
  });

  const [selectedView, setSelectedView] = React.useState(new Set(["แดชบอร์ด"]));

  const [agentData, setAgentData] = useState([]);
  const [listAgentData, setListAgentData] = useState([]);

  const [selectedAgent, setSelectedAgent] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const selectedAgentValue = Array.from(selectedAgent)[0];

  const [selectedNameList, setSelectedNameList] = useState(new Set(['all']));
  const selectedNameListValue = Array.from(selectedNameList)[0];

  const [dateMode, setDateMode] = useState('เดือน');

  const ownerId = currentUser.businessId;

  const selectedValueView = React.useMemo(
    () => Array.from(selectedView).join(", ").replaceAll("_", " "),
    [selectedView]
  );

  const fetchAgentData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchProtectedData.get(`${URLS.commission.getAgentData}/${ownerId}`);
      const agents = response.data;
      setAgentData(agents);
    } catch (error) {
      console.log('error fetching data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentData();
  }, []);

  const fetchListAgentData = async () => {
    setIsLoading(true);
    try {
      const resolvedOwnerId = ownerId === 1 ? selectedAgentValue : ownerId;
      const response = await fetchProtectedData.get(`${URLS.summary.listAgent}/${resolvedOwnerId}`);
      if (Array.isArray(response.data)) {
        setListAgentData(response.data);
      } else {
        setListAgentData([]);
      }
    } catch (error) {
      console.log('error fetching data', error);
      setListAgentData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListAgentData();
  }, [ownerId, selectedAgentValue, dateMode]);

  useEffect(() => {
    if (agentData.length > 0) {
      const matchingAgent = agentData.find(agent => String(agent.agent_id) === String(ownerId));
      if (matchingAgent) {
        setSelectedAgent(new Set([String(matchingAgent.agent_id)]));
      }
    }
  }, [agentData, ownerId, listAgentData, dateMode]);

  const handleClear = () => {
    setDateRange({
      start: startOfMonth(today()),
      end: endOfMonth(today()),
    });
    setDateMode('เดือน')
    setSelectedAgent(new Set());
    setSelectedNameList(new Set(['all']));
    vatRate(false);
  };

  const handleVatChange = (isChecked) => {
    setVatRate(isChecked);
  };

  return (
    <>
      <section title={"Summary"}>
        <Card shadow="none" radius="sm">
          <CardBody>
            <div className="flex flex-col gap-6 w-full">
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                <div className="flex flex-col items-center">
                  <div className="flex flex-row items-center gap-4">
                    <DateSelector value={dateRange} onChange={(value) => setDateRange(value)} modeState={dateMode} onModeChange={setDateMode} />
                  </div>
                </div>
                <Select
                  label="ตัวแทนขาย"
                  className="max-w-full sm:max-w-[250px] w-full"
                  variant="bordered"
                  isLoading={isLoading}
                  disallowEmptySelection
                  selectedKeys={selectedAgent}
                  onSelectionChange={(keys) => setSelectedAgent(new Set(keys))}
                >
                  {agentData.map((item) => (
                    <SelectItem key={item.agent_id} value={item.agent_name} textValue={item.nick_name}>
                      {item.agent_name} - ({item.nick_name})
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="ตัวแทนที่ขายให้เรา"
                  className="max-w-full sm:max-w-[250px] w-full"
                  variant="bordered"
                  isLoading={isLoading}
                  disallowEmptySelection
                  selectedKeys={selectedNameList}
                  onSelectionChange={(keys) => setSelectedNameList(new Set(keys))}
                >
                  <SelectItem key="all" value="all">ทั้งหมด</SelectItem>
                  {listAgentData.map((item) => (
                    <SelectItem key={item.customerOwnerId} value={item.customerOwnerId} textValue={item.nick_name}>
                      {item.name} - ({item.nick_name})
                    </SelectItem>
                  ))}
                </Select>
                {/* <div className="flex items-center gap-2">
                  <label className="text-xs">Vat 7%</label>
                  <Checkbox
                    onChange={(e) => handleVatChange(e.target.checked)}
                    isSelected={vatRate}
                    color="danger"
                    size="lg"
                  />
                </div> */}
                <Tooltip content='รีเฟรช'>
                  <Button isIconOnly radius='lg' color='primary' variant='light' onPress={handleClear}>
                    <HFRefresh size={16} />
                  </Button>
                </Tooltip>
                <div className='hidden lg:block ml-auto text-nowrap'>
                  <div className="hidden lg:block ml-auto text-nowrap">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button className="capitalize" variant="bordered">
                          {selectedValueView}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        disallowEmptySelection
                        aria-label="Single selection example"
                        selectedKeys={selectedView}
                        selectionMode="single"
                        variant="flat"
                        onSelectionChange={setSelectedView}
                      >
                        <DropdownItem key="แดชบอร์ด" description="รูปการแสดงผลสถิติแบบแดชบอร์ด">แดชบอร์ด</DropdownItem>
                        <DropdownItem key="ตาราง" description="รูปการแสดงผลสถิติแบบตาราง">ตาราง</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
        {selectedValueView === 'แดชบอร์ด' ? (
          <>
            <section className="section1">
              <TotalSaleSection startDate={formatDateObject(dateRange.start)} endDate={formatDateObject(dateRange.end)} selectedNameListValue={selectedNameListValue} selectedAgentValue={selectedAgentValue} vatRate={vatRate} dateMode={dateMode} />
            </section>
            <section className="py-4">
              <OrderRank startDate={formatDateObject(dateRange.start)} endDate={formatDateObject(dateRange.end)} selectedNameListValue={selectedNameListValue} selectedAgentValue={selectedAgentValue} vatRate={vatRate} dateMode={dateMode} />
            </section>
          </>
        ) : (
          <section className="py-4">
            <TableView startDate={formatDateObject(dateRange.start)} endDate={formatDateObject(dateRange.end)} selectedNameListValue={selectedNameListValue} selectedAgentValue={selectedAgentValue} vatRate={vatRate} />
          </section>
        )}
      </section >
      <div></div>
    </>
  );
}

export default DashboardSummary;
