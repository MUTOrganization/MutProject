import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardBody,
  Select,
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownMenu,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  SelectItem,
  Tabs,
  Tab,
  Input,
  Checkbox,
} from "@nextui-org/react";
import {
  ImportFileIcon,
  FilterColumsIcon,
  SettingIcon2,
  ArrowDownStreamlineUltimateIcon,
  ArrowUpStreamlineUltimateIcon,
  SettingIcon,
  MonitorGraphIcon,
  TableToolIcon,
} from "../../component/Icons";
import {
  endOfMonth,
  startOfMonth,
  today,
  startOfYear,
  endOfYear,
} from "@internationalized/date";
import QuaterSelecter from "../../component/QuaterSelecter";
import SettingPriceProd from "./components/ModalManage/SettingPriceProd";
import { columns } from "./config";
import { ImportIcon } from "lucide-react";
import Dashboard from "./components/Dashboard";
import ImportExcel from "./components/ImportExcel";
import TableData from "./components/TableData";
import { formatMonthObject } from "@/component/DateUtiils";
import { useAppContext } from "@/contexts/AppContext";
import fetchProtectedData from "../../../utils/fetchData";
import { URLS } from "@/config";
import { toastSuccess, toastError, toastWarning } from "@/component/Alert";
import { PrimaryButton } from "@/component/Buttons";

const getFilteredData = (data, selectedAgents, selectedProducts) => {
  let filtered = data;

  // กรองข้อมูลตามแพลตฟอร์ม
  if (selectedAgents.length > 0) {
    filtered = filtered.filter((item) => selectedAgents.includes(item.agent));
  }

  // กรองข้อมูลตามเพจ
  if (selectedProducts.length > 0) {
    filtered = filtered.filter((item) =>
      selectedProducts.includes(item.productName)
    );
  }
  return filtered;
};

function DashBoardNightcore() {
  const user = useAppContext().currentUser;
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set(["แดชบอร์ด"]));
  const currentMonthStart = startOfYear(today());
  const currentMonthEnd = endOfYear(today());
  const [commissionValue, setCommissionValue] = useState(30);
  const [dateRange, setDateRange] = useState({
    start: currentMonthStart,
    end: currentMonthEnd,
  });

  const [data, setData] = useState({ currentMonth: [], lastMonth: [] });

  console.log(data);

  console.log(
    formatMonthObject(dateRange.start),
    formatMonthObject(dateRange.end)
  );

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
    [selectedKeys]
  );

  const agentOptions = useMemo(() => {
    const map = {};
    data.currentMonth.forEach((row) => {
      if (!map[row.agent]) {
        map[row.agent] = {
          agent: row.agent,
          agentCode: row.agentCode,
          agentNickName: row.agentNickName,
        };
      }
    });
    const arr = Object.values(map);
    return [...arr];
  }, [data]);

  const productOptions = useMemo(() => {
    const map = {};
    data.currentMonth.forEach((row) => {
      if (!map[row.productName]) {
        map[row.productName] = {
          productName: row.productName,
          price: row.price,
        };
      }
    });
    const arr = Object.values(map);
    return [...arr];
  }, [data]);

  const fetchDataFn = async (monthStartStr, monthEndStr) => {
    setIsLoading(true);
    try {
      // เรียก API: โค้ดสมมติว่าใช้ POST
      const response = await fetchProtectedData.post(
        `${URLS.DASHBOARDNIGHTCORE}/getPurchaseSummary`,
        {
          startMonth: monthStartStr,
          endMonth: monthEndStr,
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("error fetching data", error);
      toastError("ระบบมีปัญหากรุณารีเฟรช");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const startMonth = formatMonthObject(dateRange.start);
    const endMonth = formatMonthObject(dateRange.end);
    fetchDataFn(startMonth, endMonth);
  }, [dateRange]);

  const {
    isOpen: isOpenManagePrice,
    onOpen: onOpenMangePrice,
    onClose: onCloseManagePrice,
  } = useDisclosure();

  const filteredDataCurrent = useMemo(() => {
    const filtered = getFilteredData(
      data.currentMonth,
      selectedAgents,
      selectedProducts
    );
    const result = filtered.map((row) => {
      const baseTotal = parseFloat(row.totalPrice) || 0;
      const commission = baseTotal * (commissionValue / 100);
      const finalCommission = commission * 0.97;
      return {
        ...row,
        commission: commission.toFixed(2),
        finalCommission: finalCommission.toFixed(2),
      };
    });
    return result;
  }, [data, selectedAgents, selectedProducts, commissionValue]);

  const filteredDataLastMonth = useMemo(() => {
    const filtered = getFilteredData(
      data.lastMonth,
      selectedAgents,
      selectedProducts
    );
    const result = filtered.map((row) => {
      const baseTotal = parseFloat(row.totalPrice) || 0;
      const commission = baseTotal * (commissionValue / 100);
      const finalCommission = commission * 0.97;
      return {
        ...row,
        commission: commission.toFixed(2),
        finalCommission: finalCommission.toFixed(2),
      };
    });
    return result;
  }, [data, selectedAgents, selectedProducts, commissionValue]);

  const handleClear = () => {
    setSelectedAgents([]);
    setSelectedProducts([]);
  };

  return (
    <div shadow="none" radius="sm">
      <Card>
        <CardBody>
          <div
            // กำหนด flex + wrap (มือถือขึ้นได้หลายแถว, desktop บังคับแถวเดียว)
            className="flex flex-col gap-4 lg:flex-row lg:flex-nowrap w-full items-center"
          >
            {selectedValue !== "นำเข้าข้อมูล" && (
              <>
                <QuaterSelecter value={dateRange} onChange={setDateRange} />

                <Select
                  label="ตัวแทนจำหน่าย"
                  placeholder="ทั้งหมด"
                  variant="bordered"
                  selectionMode="multiple"
                  isLoading={isLoading}
                  selectedKeys={new Set(selectedAgents)}
                  onSelectionChange={(keys) =>
                    setSelectedAgents(Array.from(keys))
                  }
                  disallowEmptySelection={false}
                  className="max-w-full lg:max-w-[300px] lg:min-w-[300px]"
                >
                  {agentOptions.map((ag) => {
                    return (
                      <SelectItem key={ag.agent} textValue={[ag.agent]}>
                        {/* แสดง 2 บรรทัด */}
                        <div className="flex flex-col">
                          <span>{ag.agent}</span>
                          {ag.agentCode !== null && (
                            <span className="text-tiny text-default-400">
                              {ag.agentCode} - {ag.agentNickName}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </Select>

                {/* ตัวอย่าง Select Products */}
                <Select
                  label="รายการสินค้า"
                  placeholder="ทั้งหมด"
                  variant="bordered"
                  selectionMode="multiple"
                  isLoading={isLoading}
                  selectedKeys={new Set(selectedProducts)}
                  onSelectionChange={(keys) =>
                    setSelectedProducts(Array.from(keys))
                  }
                  className="max-w-full lg:max-w-[350px] lg:min-w-[350px]"
                  disallowEmptySelection={false}
                >
                  {productOptions.map((p) => {
                    return (
                      <SelectItem key={p.productName} textValue={p.productName}>
                        <div className="flex flex-col">
                          <span>{p.productName}</span>
                          <span className="text-tiny text-default-400">
                            ราคา ฿{p.price || 0}
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </Select>

                <div className="max-w-[130px]">
                  <Input
                    label="สัดส่วนคอมมิชชั่น"
                    variant="bordered"
                    type="number"
                    value={commissionValue}
                    onChange={(e) => setCommissionValue(Number(e.target.value))}
                    endContent={"%"}
                    size="md"
                  />
                </div>
                <div>
                  <label className="text-xs block">ล้างการค้นหา</label>
                  <PrimaryButton
                    text="Reset"
                    size="sm"
                    onPress={handleClear}
                    className="text-black hover:bg-custom-redlogin hover:text-white bg-gray-100"
                  />
                </div>
              </>
            )}

            {selectedValue === "นำเข้าข้อมูล" && (
              <div className="flex text-2xl p-3">
                ข้อมูลเข้าระบบเป็นไฟล์ xlsx ,xls ,csv
              </div>
            )}
            <div className="hidden lg:block ml-auto text-nowrap text-center">
              <div className=" flex items-center justify-between gap-3">
                {selectedValue === "นำเข้าข้อมูล" && (
                  <Button
                    startContent={<SettingIcon2 />}
                    className="capitalize"
                    variant="bordered"
                    onPress={onOpenMangePrice}
                  >
                    จัดการราคาสินค้า
                  </Button>
                )}
                
                <Dropdown>
                  <DropdownTrigger>
                    <Button className="capitalize" variant="bordered">
                      {selectedValue}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    aria-label="เลือกมุมมอง"
                    selectedKeys={selectedKeys}
                    selectionMode="single"
                    variant="flat"
                    onSelectionChange={setSelectedKeys}
                  >
                    <DropdownItem
                      startContent={<MonitorGraphIcon />}
                      key="แดชบอร์ด"
                      description="รูปการแสดงผลสถิติแบบแดชบอร์ด"
                    >
                      แดชบอร์ด
                    </DropdownItem>
                    <DropdownItem
                      startContent={<TableToolIcon />}
                      key="ตาราง"
                      description="รูปการแสดงผลสถิติแบบตาราง"
                    >
                      ตาราง
                    </DropdownItem>
                    <DropdownItem
                      startContent={<ImportIcon />}
                      key="นำเข้าข้อมูล"
                      description="นำเข้าไฟล์ XLSX เข้าระบบ"
                    >
                      นำเข้าข้อมูล
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <section className="max-h-screen min-h-[700px] w-full">
        {selectedValue === "แดชบอร์ด" && (
          <Dashboard
            currentMonth={filteredDataCurrent}
            lastMonth={filteredDataLastMonth}
          />
        )}
        {selectedValue === "ตาราง" && (
          <TableData currentMonth={filteredDataCurrent} />
        )}
        {selectedValue === "นำเข้าข้อมูล" && (
          <ImportExcel setSelectedKeys={setSelectedKeys} />
        )}
      </section>

      <Modal
        isOpen={isOpenManagePrice}
        onClose={onCloseManagePrice}
        size="5xl"
        className="min-h-[80vh]  max-h-[80vh]"
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-2xl">
                การจัดการราคาสินค้า
              </ModalHeader>
              <ModalBody>
                <SettingPriceProd onClose={onClose} user={user.userName} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default DashBoardNightcore;
