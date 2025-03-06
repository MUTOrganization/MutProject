import React, { useState, useEffect, useMemo } from "react";
import TableAds from "../components/Ads/TableAds";
import { useAppContext } from "@/contexts/AppContext";
import { startOfMonth, endOfMonth, today } from "@internationalized/date";
import FormInputAds from "../components/Ads/FormInputAds";
import {
  useDisclosure,
  Select,
  SelectItem,
  Checkbox,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Card,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownMenu,
  Button,
} from "@nextui-org/react";
import { URLS } from "@/config";
import fetchProtectedData from "../../../../utils/fetchData";
import { formatDateObject } from "@/component/DateUtiils";
import { convertToThaiTimeFetch } from "@/component/DateUtiils";
import DateSelector from "@/component/DateSelector";
import { getUniqueUsernames } from "../components/Ads/settingAds";
import { PrimaryButton, IconButton } from "@/component/Buttons";
import {
  PlusIcon,
  BathThaiIcon,
  BoxIcon,
  FreeIcon,
  CommissionIcon,
  MonitorGraphIcon,
  TableToolIcon,
} from "@/component/Icons";
import { formatCurrency, formatNumberWithSign } from "@/component/FormatNumber";
import { getFilteredData } from "../components/Ads/settingAds";
import { calculate, calculateVAT } from "@/component/Calculate";

function TabsAdsNextGen() {
  const [isLoading, setIsLoading] = useState(false);
  const [dataSale, setDataSale] = useState({
    currentMonth: [],
    lastMonth: [],
  });
  const [dataAds, setDataAds] = useState({
    currentMonth: [],
    lastMonth: [],
  });

  const [vatRate, setVatRate] = useState(false);
  const { currentUser } = useAppContext();
  const agentId = currentUser?.businessId;
  const username = currentUser?.userName;
  const nickname = currentUser?.nickname;

  const [dateRange, setDateRange] = useState({
    start: startOfMonth(today()),
    end: endOfMonth(today()),
  });
  const [dateMode, setDateMode] = useState("เดือน");

  const teamAdsValue =
    currentUser.role !== "Staff" ? "all" : nickname || username;

  const [selectedPlatform, setSelectedPlatform] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedPage, setSelectedPage] = useState([]);

  const [platformOptions, setPlatformOptions] = useState([]);
  const [allPages, setAllPages] = useState([]);

  const {
    isOpen: isModalAddAds,
    onOpen: onOpenModalAddAds,
    onOpenChange: onOpenChangeModalAddAds,
  } = useDisclosure();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1) Fetch sale+ads (2 API)
      const saleUrl = `${URLS.ADSFORM}/totalSaleAdsCompare`;
      const adsUrl = `${URLS.ADSFORM}/getAdsCompare`;

      const [saleResponse, adsResponse] = await Promise.all([
        fetchProtectedData.post(saleUrl, {
          agent: agentId,
          startDate: formatDateObject(dateRange.start),
          endDate: formatDateObject(dateRange.end),
          teamAds: teamAdsValue,
          dateMode: dateMode,
        }),
        fetchProtectedData.post(adsUrl, {
          teamAds: teamAdsValue,
          businessId: agentId,
          startDate: formatDateObject(dateRange.start),
          endDate: formatDateObject(dateRange.end),
          dateMode: dateMode,
        }),
      ]);

      setDataSale({
        currentMonth: saleResponse.data?.currentMonth ?? [],
        lastMonth: saleResponse.data?.lastMonth ?? [],
      });

      const currentAds = adsResponse.data?.currentMonth ?? [];
      const lastAds = adsResponse.data?.lastMonth ?? [];

      // Convert datetime
      const currentAdsConverted = currentAds.map((item) => ({
        ...item,
        date_time: convertToThaiTimeFetch(item.date_time),
      }));
      const lastAdsConverted = lastAds.map((item) => ({
        ...item,
        date_time: convertToThaiTimeFetch(item.date_time),
      }));

      setDataAds({
        currentMonth: currentAdsConverted,
        lastMonth: lastAdsConverted,
      });

      // 2) Fetch platform (ทีเดียว)
      const teamAdsValueLocal = teamAdsValue; // same logic
      const platformRes = await fetchProtectedData.post(
        `${URLS.ADSFORM}/getPlatform`,
        {
          businessId: agentId,
          teamAds: teamAdsValueLocal,
        }
      );
      setPlatformOptions(platformRes.data);

      // 3) Fetch all pages (ทีเดียว)
      const pagesRes = await fetchProtectedData.get(
        `${URLS.ADSFORM}/getlistPageAds`,
        {
          params: {
            businessId: agentId,
            teamAds: teamAdsValueLocal,
          },
        }
      );
      // เอาเฉพาะ active
      const activePages = pagesRes.data.filter(
        (p) => p.statusPage === "Active"
      );
      setAllPages(activePages);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedUser([]);
    setSelectedPlatform([]);
    setSelectedPage([]);
  };
  useEffect(() => {
    fetchData();
  }, [agentId, dateRange]);

  const uniquePlatform = useMemo(() => {
    // ถ้าไม่มีการเลือกแพลตฟอร์ม ให้ใช้ข้อมูลทั้งหมด
    const filteredDataByPlatform =
      selectedPlatform.length > 0
        ? dataAds.currentMonth?.filter((item) =>
            selectedPlatform.includes(item.platform)
          )
        : dataAds.currentMonth;

    // ดึงเฉพาะแพลตฟอร์มที่ไม่ซ้ำ
    return getUniqueUsernames(filteredDataByPlatform, "platform");
  }, [dataAds.currentMonth, selectedPlatform]);

  const uniqueUsername = useMemo(() => {
    const filteredDataByPage =
      selectedPage.length > 0
        ? dataAds.currentMonth?.filter((item) =>
            selectedPage.includes(item.code)
          )
        : dataAds.currentMonth;

    return getUniqueUsernames(filteredDataByPage, "teamAds");
  }, [dataAds.currentMonth, selectedPage]);

  const uniquePage = useMemo(() => {
    // กรองข้อมูลตามแพลตฟอร์มและผู้ใช้ ถ้ามีการเลือก
    const filteredDataByPage =
      selectedPlatform.length > 0 || selectedUser.length > 0
        ? dataAds.currentMonth?.filter((item) => {
            const matchesPlatform =
              selectedPlatform.length > 0
                ? selectedPlatform.includes(item.platform)
                : true;
            const matchesUser =
              selectedUser.length > 0
                ? selectedUser.includes(item.teamAds)
                : true;
            return matchesPlatform && matchesUser;
          })
        : dataAds.currentMonth;

    // ดึงเฉพาะเพจที่ไม่ซ้ำ
    return getUniqueUsernames(filteredDataByPage, "code");
  }, [dataAds.currentMonth, selectedPlatform, selectedUser]);

  const handleVatChange = (isChecked) => {
    setVatRate(isChecked);
  };

  // Filtered สำหรับ currentMonth
  const filteredDataCurrentAds = useMemo(() => {
    const vat = vatRate ? 7 : 0;
    return getFilteredData(
      dataAds.currentMonth,
      selectedPlatform,
      selectedUser,
      selectedPage
    ).map((item) => ({
      ...item,
      adsWithVat: calculateVAT(parseFloat(item.ads || 0), vat),
    }));
  }, [
    dataAds.currentMonth,
    selectedPlatform,
    selectedUser,
    selectedPage,
    vatRate,
  ]);

  // Filtered สำหรับ currentMonth
  const filteredDataLastAds = useMemo(() => {
    const vat = vatRate ? 7 : 0;
    return getFilteredData(
      dataAds.lastMonth,
      selectedPlatform,
      selectedUser,
      selectedPage
    ).map((item) => ({
      ...item,
      adsWithVat: calculateVAT(parseFloat(item.ads || 0), vat),
    }));
  }, [
    dataAds.lastMonth,
    selectedPlatform,
    selectedUser,
    selectedPage,
    vatRate,
  ]);

  const filteredDataCurrentSale = useMemo(() => {
    return getFilteredData(
      dataSale.currentMonth,
      selectedPlatform,
      selectedUser,
      selectedPage
    );
  }, [dataSale.currentMonth, selectedPlatform, selectedUser, selectedPage]);

  const filteredDataLastSale = useMemo(() => {
    return getFilteredData(
      dataSale.lastMonth,
      selectedPlatform,
      selectedUser,
      selectedPage
    );
  }, [dataSale.lastMonth, selectedPlatform, selectedUser, selectedPage]);

  const totalAdsCurrent = useMemo(
    () =>
      filteredDataCurrentAds.reduce((sum, item) => sum + item.adsWithVat, 0),
    [filteredDataCurrentAds]
  );
  const totalAdsLast = useMemo(
    () => filteredDataLastAds.reduce((sum, item) => sum + item.adsWithVat, 0),
    [filteredDataLastAds]
  );
  const totalSaleCurrent = useMemo(
    () =>
      filteredDataCurrentSale.reduce(
        (sum, item) => sum + parseFloat(item.admin || 0),
        0
      ),
    [filteredDataCurrentSale]
  );
  const totalSaleLast = useMemo(
    () =>
      filteredDataLastSale.reduce(
        (sum, item) => sum + parseFloat(item.admin || 0),
        0
      ),
    [filteredDataLastSale]
  );
  const totalUpsaleCurrent = useMemo(
    () =>
      filteredDataCurrentSale.reduce(
        (sum, item) => sum + parseFloat(item.upsale || 0),
        0
      ),
    [filteredDataCurrentSale]
  );
  const totalUpsaleLast = useMemo(
    () =>
      filteredDataLastSale.reduce(
        (sum, item) => sum + parseFloat(item.upsale || 0),
        0
      ),
    [filteredDataLastSale]
  );

  const totalSalesNewCurrent = useMemo(
    () =>
      filteredDataCurrentSale.reduce(
        (sum, item) => sum + parseFloat(item.SalesNew || 0),
        0
      ),
    [filteredDataCurrentSale]
  );
  const totalSalesNewLast = useMemo(
    () =>
      filteredDataLastSale.reduce(
        (sum, item) => sum + parseFloat(item.SalesNew || 0),
        0
      ),
    [filteredDataLastSale]
  );

  const totalPercentAdsCurrent =
    parseFloat(totalUpsaleCurrent || totalSaleCurrent) > 0
      ? (parseFloat(totalAdsCurrent || 0) /
          (parseFloat(totalSaleCurrent || 0) +
            parseFloat(totalUpsaleCurrent || 0) || 1)) *
        100
      : 0;

  const totalPercentAdsLast =
    parseFloat(totalUpsaleLast || totalSaleLast) > 0
      ? (parseFloat(totalAdsLast || 0) /
          (parseFloat(totalSaleLast || 0) + parseFloat(totalUpsaleLast || 0) ||
            1)) *
        100
      : 0;

  const totalPercentAdsSaleCurrent =
    parseFloat(totalSaleCurrent) > 0
      ? (parseFloat(totalAdsCurrent || 0) /
          (parseFloat(totalSaleCurrent || 0) || 1)) *
        100
      : 0;

  const totalPercentAdsSaleLast =
    parseFloat(totalSaleLast) > 0
      ? (parseFloat(totalAdsLast || 0) /
          (parseFloat(totalSaleLast || 0) || 1)) *
        100
      : 0;

  const totalPercentAdsNewCurrent =
    parseFloat(totalSalesNewCurrent) > 0
      ? (parseFloat(totalAdsCurrent || 0) / parseFloat(totalSalesNewCurrent)) *
        100
      : 0;

  const totalPercentAdsNewLast =
    parseFloat(totalSalesNewLast) > 0
      ? (parseFloat(totalAdsLast || 0) / parseFloat(totalSalesNewLast)) * 100
      : 0;

  const getDifference = (currentValue, lastValue) => {
    const current = parseFloat(currentValue) || 0;
    const last = parseFloat(lastValue) || 0;
    const difference = current - last;

    let arrow = "";
    let color = "text-gray-500";
    let formattedDifference = "0";

    if (difference < 0) {
      arrow = "▼";
      color = "text-green-600";
      formattedDifference = difference.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    } else if (difference > 0) {
      arrow = "▲";
      color = "text-red-600";
      formattedDifference = formatNumberWithSign(difference);
    }

    return {
      difference,
      formattedDifference,
      color,
      arrow,
    };
  };

  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex lg:justify-between justify-center">
        <div className="flex  flex-col md:flex-row sm:space-x-4  space-y-4 sm:space-y-0 lg:items-center w-64 lg:w-full  md:w-full md:justify-between">
          <div className="flex md:flex-row flex-col gap-4  items-center ">
            <div className="flex md:flex-row flex-col gap-4  items-center min-w-full">
              <DateSelector
                value={dateRange}
                onChange={(value) => setDateRange(value)}
                modeState={dateMode}
                onModeChange={setDateMode}
              />

              <Select
                label="แพลตฟอร์ม"
                placeholder="ทั้งหมด"
                variant="bordered"
                className="min-w-48"
                onSelectionChange={(keys) =>
                  setSelectedPlatform(Array.from(keys))
                }
                selectedKeys={new Set(selectedPlatform)}
                selectionMode="multiple"
                disallowEmptySelection={false} // Allow deselection to filter all
              >
                {uniquePlatform.map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="เพจ"
                placeholder="ทั้งหมด"
                variant="bordered"
                className="min-w-48"
                onSelectionChange={(keys) => setSelectedPage(Array.from(keys))}
                selectedKeys={new Set(selectedPage)}
                selectionMode="multiple"
                disallowEmptySelection={false}
              >
                {uniquePage.map((page) => (
                  <SelectItem key={page} value={page}>
                    {page}
                  </SelectItem>
                ))}
              </Select>

              {teamAdsValue === "all" && (
                <Select
                  label="ผู้บันทึกค่าแอด"
                  placeholder="ทั้งหมด"
                  variant="bordered"
                  className="min-w-32"
                  onSelectionChange={(keys) =>
                    setSelectedUser(Array.from(keys))
                  }
                  selectedKeys={new Set(selectedUser)}
                  selectionMode="multiple"
                  disallowEmptySelection={false} // Allow deselection to filter all
                >
                  {uniqueUsername.map((teamAds) => (
                    <SelectItem key={teamAds} value={teamAds}>
                      {teamAds}
                    </SelectItem>
                  ))}
                </Select>
              )}
            </div>
            <div className="hidden md:flex flex-col items-center  w-full gap-2">
              <PrimaryButton
                text="ล้างการค้นหา"
                size="sm"
                onPress={handleClear}
                className="text-black hover:bg-custom-redlogin hover:text-white bg-gray-100"
              />{" "}
            </div>

            <div className="hidden md:flex flex-col items-center  w-full gap-2">
              <Checkbox
                onChange={(e) => handleVatChange(e.target.checked)} // Pass the checked value
                isSelected={vatRate}
                color="danger"
                size="lg"
              >
                {" "}
                <label className="text-xs block">Vat 7%</label>
              </Checkbox>
            </div>

            <div className="md:hidden flex items-center w-full">
              <div>
                <PrimaryButton
                  text="ล้างการค้นหา"
                  size="sm"
                  onPress={handleClear}
                  className="text-black hover:bg-custom-redlogin hover:text-white bg-gray-100"
                />{" "}
              </div>

              <div className="flex flex-col items-center  w-full gap-2">
                <label className="text-xs block">Vat 7%</label>
                <Checkbox
                  onChange={(e) => handleVatChange(e.target.checked)} // Pass the checked value
                  isSelected={vatRate}
                  color="danger"
                  size="lg"
                ></Checkbox>
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="flex flex-col lg:flex-row items-center  justify-between gap-4 p-3 ">
                  <div className=" md:hidden flex items-center justify-center gap-3">
                    <IconButton
                      text={
                        isLoading ? ( // ✅ เงื่อนไขถูกต้อง
                          <Spinner
                            color="white"
                            className="mx-auto"
                            size="sm"
                          />
                        ) : (
                          <PlusIcon />
                        )
                      }
                      size="md"
                      onPress={onOpenModalAddAds}
                      isDisabled={isLoading} // ✅ ป้องกันกดตอนโหลด
                      className="bg-green-600 text-white "
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="hidden md:flex  flex-col lg:flex-row items-center  justify-between gap-4 p-3 ">
              <div>
              <IconButton
                      text={
                        isLoading ? ( // ✅ เงื่อนไขถูกต้อง
                          <Spinner
                            color="white"
                            className="mx-auto"
                            size="sm"
                          />
                        ) : (
                          <PlusIcon />
                        )
                      }
                      size="md"
                      onPress={onOpenModalAddAds}
                      isDisabled={isLoading} // ✅ ป้องกันกดตอนโหลด
                      className="bg-green-600 text-white "
                    />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card shadow="sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="tracking-tight text-sm font-medium">
                ยอดแอดรวม
              </div>
            </div>
            <div className="p-6 pt-0">
              {isLoading ? (
                <Spinner color="primary" className="mx-auto" size="sm" />
              ) : (
                <>
                  {/* แสดงค่าปัจจุบัน (Current) */}
                  <div className="text-2xl font-bold">
                    {formatCurrency(totalAdsCurrent) || 0}
                  </div>

                  {/* เรียก getDifference มาเปรียบเทียบกับค่าของ Last */}
                  {(() => {
                    const { formattedDifference, arrow, color } = getDifference(
                      totalAdsCurrent, // current
                      totalAdsLast // last
                    );
                    return (
                      <div className={`text-sm mt-1 ${color}`}>
                        {arrow} {formattedDifference}
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          </Card>
          <Card shadow="sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="tracking-tight text-sm font-medium">
                % ADS ลูกค้าใหม่
              </div>
            </div>
            <div className="p-6 pt-0">
              {isLoading ? (
                <Spinner color="primary" className="mx-auto" size="sm" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {`${totalPercentAdsNewCurrent.toFixed(2)} %`}
                  </div>
                  {(() => {
                    const { formattedDifference, arrow, color } = getDifference(
                      totalPercentAdsNewCurrent,
                      totalPercentAdsNewLast
                    );
                    return (
                      <div className={`text-sm mt-1 ${color}`}>
                        {arrow} {formattedDifference}
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          </Card>
          <Card shadow="sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="tracking-tight text-sm font-medium">
                % ADS รวม
              </div>
            </div>
            <div className="p-6 pt-0">
              {isLoading ? (
                <Spinner color="primary" className="mx-auto" size="sm" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {`${totalPercentAdsCurrent.toFixed(2)} %`}
                  </div>
                  {(() => {
                    const { formattedDifference, arrow, color } = getDifference(
                      totalPercentAdsCurrent,
                      totalPercentAdsLast
                    );
                    return (
                      <div className={`text-sm mt-1 ${color}`}>
                        {arrow} {formattedDifference}
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          </Card>
          <Card shadow="sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center justify-between gap-5">
                <div className="tracking-tight text-sm font-medium">
                  % ADS เซลล์
                </div>
              </div>
            </div>
            <div className="p-6 pt-0">
              {isLoading ? (
                <Spinner color="primary" className="mx-auto" size="sm" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {`${totalPercentAdsSaleCurrent.toFixed(2)} %`}
                  </div>
                  {(() => {
                    const { formattedDifference, arrow, color } = getDifference(
                      totalPercentAdsSaleCurrent,
                      totalPercentAdsSaleLast
                    );
                    return (
                      <div className={`text-sm mt-1 ${color}`}>
                        {arrow} {formattedDifference}
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          </Card>
          <Card shadow="sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center justify-between gap-5">
                <div className="tracking-tight text-sm font-medium">
                  จำนวนรายการ
                </div>
              </div>
            </div>
            <div className="p-6 pt-0">
              {isLoading ? (
                <Spinner color="primary" className="mx-auto" size="sm" />
              ) : (
                <>
                  {/* แสดงค่าปัจจุบัน (Current) */}
                  <div className="text-2xl font-bold">
                    {filteredDataCurrentAds.length || 0}
                  </div>

                  {/* เรียก getDifference มาเปรียบเทียบกับค่าของ Last */}
                  {(() => {
                    const { formattedDifference, arrow, color } = getDifference(
                      filteredDataCurrentAds.length, // current
                      filteredDataLastAds.length // last
                    );
                    return (
                      <div className={`text-sm mt-1 ${color}`}>
                        {arrow} {formattedDifference}
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          </Card>
        </div>
      </section>

      <section className="max-h-full min-h-[400px] w-full">
        <TableAds
          vatRate={vatRate}
          filteredData={filteredDataCurrentAds}
          isLoading={isLoading}
          agentId={agentId}
          onDataChange={fetchData} // ถ้าแก้ไขหรือลบสำเร็จ → fetchData ใหม่
        />
      </section>

      <FormInputAds
        agentId={agentId}
        nickname={nickname}
        username={username}
        isOpen={isModalAddAds}
        onOpenChange={onOpenChangeModalAddAds}
        onSubmitSuccess={fetchData} // ถ้า submit สำเร็จ → fetchData ใหม่
        platformOptions={platformOptions}
        pageData={allPages}
      />
    </div>
  );
}

export default TabsAdsNextGen;
