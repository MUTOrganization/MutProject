import React, { useState, useEffect, useMemo } from "react";
import {
  Card as NextUICard,
  useDisclosure,
  Checkbox,
  DateRangePicker,
  DatePicker,
  Switch,
  Card,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  cn,
  Spinner,
  CardBody,
  Select,
  SelectItem,
} from "@nextui-org/react";
import DefaultLayout from "../../layouts/default";
import { PrimaryButton } from "../../component/Buttons";
import { today, startOfMonth, endOfMonth } from "@internationalized/date";
import CardGrid from "./components/CardGrid";
import { FilterIcon } from "../../component/Icons";
import TableDashboard from "./components/TableDashboard";
import { formatDateObject, formatDateRange } from "../../component/DateUtiils";
import { useAppContext } from "../../contexts/AppContext";
import { URLS } from "../../config";
import DateSelector from "../../component/DateSelector";

import fetchProtectedData from "../../../utils/fetchData";
import { convertToThaiTimeFetch } from "../../component/DateUtiils";
import TableDetail from "./components/TableDetail";
import { calculateVAT } from "../../component/Calculate";

const getUniqueUsernames = (data, key) => {
  return Array.from(new Set(data.map((item) => item[key]))).sort();
};

const getFilteredData = (data, selectedPlatform, selectedPage) => {
  let filtered = data;

  // กรองข้อมูลตามแพลตฟอร์ม
  if (selectedPlatform.length > 0) {
    filtered = filtered.filter((item) =>
      selectedPlatform.includes(item.saleChannel)
    );
  }

  // กรองข้อมูลตามเพจ
  if (selectedPage.length > 0) {
    filtered = filtered.filter((item) =>
      selectedPage.includes(item.saleChannelName)
    );
  }

  return filtered;
};

function StatsPlatform() {
  const [selectedPlatform, setSelectedPlatform] = useState([]);
  const [selectedPage, setSelectedPage] = useState([]);

  const [pagestat, setPagestat] = useState([]);
  console.log(pagestat);

  const { currentUser } = useAppContext();
  const agentId = currentUser?.businessId;
  const {
    isOpen: isFilterModalOpen,
    onOpen: openFilterModal,
    onOpenChange: onFilterModalChange,
  } = useDisclosure();

  const {
    isOpen: isDetailModalOpen,
    onOpen: openDetailModal,
    onOpenChange: onDetailModalChange,
  } = useDisclosure();

  const [switchCard, setSwitchCard] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const [dateRange, setDateRange] = useState({
    start: startOfMonth(today()),
    end: endOfMonth(today()),
  });
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(() => {
    const savedCheckboxes = localStorage.getItem("selectedCheckboxes");
    return savedCheckboxes
      ? JSON.parse(savedCheckboxes)
      : {
          SalesNew: true,
          SalesOld: true,
          sales: true,
          newcus: true,
          oldcus: true,
          totalorder: true,
          ads: true,
          newInbox: true,
          oldInbox: true,
          totalInbox: true,
          PercentAdsNew: false,
          PercentAdsSale: false,
          PercentAdsTotal: false,
          closeNew: false,
          closeTotal: false,
          closeUpsale: true,
          totalCloseAds: false,
          vat: true,
          upsales: true,
          upsaleOrder: true,
        };
  });
  const [isLoading, setIsLoading] = useState(false);

  const customSort = (data) => {
    return data.sort((a, b) => {
      const getPrimarySortValue = (saleChannel) => {
        if (!saleChannel) return "5"; // กำหนดลำดับสุดท้ายถ้า `saleChannel` ไม่มีค่า
        const firstChar = saleChannel[0];
        if (firstChar === "F") return "1"; // ตัวแรกเป็น "F" เช่น Facebook
        if (firstChar === "L") return "2"; // ตัวแรกเป็น "L" เช่น Lazada
        if (firstChar === "S") return "3"; // ตัวแรกเป็น "S" เช่น Shopee
        return "4"; // ลำดับอื่นๆ
      };

      const getSecondarySortValue = (saleChannelName) => {
        if (!saleChannelName) return "Z"; // หากไม่มีชื่อช่องทางการขาย ให้จัดลำดับท้ายสุด
        return saleChannelName; // เรียงตามชื่อช่องทางการขาย
      };

      // เรียกใช้ฟังก์ชันเพื่อดึงค่าที่ใช้ในการเปรียบเทียบ
      const primarySortA = getPrimarySortValue(a.saleChannel);
      const primarySortB = getPrimarySortValue(b.saleChannel);

      if (primarySortA !== primarySortB) {
        // หากค่าหลักแตกต่าง ให้เรียงตามค่าหลัก
        return primarySortA.localeCompare(primarySortB);
      }

      // หากค่าหลักเหมือนกัน ให้เรียงตามค่ารอง (saleChannelName)
      const secondarySortA = getSecondarySortValue(a.saleChannelName);
      const secondarySortB = getSecondarySortValue(b.saleChannelName);

      return secondarySortA.localeCompare(secondarySortB);
    });
  };

  const fetchPagestat = async () => {
    setIsLoading(true);
    try {
      const url = `${URLS.STATSPLATFORM}/Pagestat`;
      const response = await fetchProtectedData.post(url, {
        agent: agentId,
        startDate: formatDateObject(dateRange.start),
        endDate: formatDateObject(dateRange.end),
      });

      const result = response.data;
      const formattedResult = result.map((sale) => ({
        ...sale,
        date_time: convertToThaiTimeFetch(sale.date),
      }));

      const sortedResult = customSort(formattedResult);
      setPagestat(sortedResult);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPagestat();
  }, [agentId, dateRange]);

  console.log(pagestat);

  useEffect(() => {
    localStorage.setItem(
      "selectedCheckboxes",
      JSON.stringify(selectedCheckboxes)
    );
  }, [selectedCheckboxes, switchCard]);

  const handleCheckboxSelection = (key) => {
    setSelectedCheckboxes((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleSave = () => {
    localStorage.setItem(
      "selectedCheckboxes",
      JSON.stringify(selectedCheckboxes)
    );
    onFilterModalChange(false);
  };

  const handleViewDetails = (card) => {
    setSelectedCard(card);
    console.log(selectedCard);

    openDetailModal(); // Open the modal
  };

  const formattedValue = (value) =>
    value ? new Intl.NumberFormat().format(value) : "0";

  const renderSummaryCell = () => {
    return (
      <Card
        className="grid grid-cols-7 gap-2 p-4 bg-white shadow-lg rounded-lg"
        shadow="none"
        radius="sm"
      >
        {/* Title Inside the Card */}
        <div className="col-span-full mb-2 text-center">
          <h2 className="text-xl font-bold text-blue-500">
            สรุปยอดขาย (DASHBOARD SUMMARY)
          </h2>
        </div>

        {/* Summary Grid */}
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <span className="block text-gray-500 text-xs">ยอดขายทั้งหมด</span>
          <span className="block text-xl font-bold text-gray-800">
            ฿{formattedValue(totalSales)}
          </span>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <span className="block text-gray-500 text-xs">
            จำนวนออเดอร์ทั้งหมด
          </span>
          <span className="block text-xl font-bold text-gray-800">
            {formattedValue(totalOrders)}
          </span>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <span className="block text-gray-500 text-xs">ยอดขายอัพเซลล์</span>
          <span className="block text-xl font-bold text-gray-800">
            ฿{formattedValue(totalUpsale)}
          </span>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <span className="block text-gray-500 text-xs">ออเดอร์ลูกค้าใหม่</span>
          <span className="block text-xl font-bold text-gray-800">
            {formattedValue(totalNewCus)}
          </span>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <span className="block text-gray-500 text-xs">ยอดขายใหม่</span>
          <span className="block text-xl font-bold text-gray-800">
            ฿{formattedValue(totalSalesNew)}
          </span>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <span className="block text-gray-500 text-xs">Inbox ใหม่</span>
          <span className="block text-xl font-bold text-gray-800">
            {formattedValue(totalNewInbox)}
          </span>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <span className="block text-gray-500 text-xs">ค่า Ads</span>
          <span className="block text-xl font-bold text-gray-800">
            {formattedValue(totalAds)}
          </span>
        </div>
      </Card>
    );
  };

  const getUniqueSaleChannels = (data) => {
    const channels = new Set(data.map((item) => item.saleChannel || "Unknown"));
    return Array.from(channels);
  };

  const groupDataBySaleChannel = (data, channels) => {
    const grouped = {};

    channels.forEach((channel) => {
      const filteredData = data.filter((item) => item.saleChannel === channel);
      if (filteredData.length > 0) {
        grouped[channel] = filteredData;
      }
    });

    return grouped;
  };

  useEffect(() => {
    const updateSetSwitchCard = () => {
      if (window.innerWidth < 640) {
        setSwitchCard(false);
      }
    };
    updateSetSwitchCard();
    window.addEventListener("resize", updateSetSwitchCard);
    return () => window.removeEventListener("resize", updateSetSwitchCard);
  }, []);
  const vatRate = selectedCheckboxes.vat ? 7 : 0;
  const uniquePlatform = useMemo(() => {
    // กรองข้อมูลเพื่อเอาค่าที่ไม่ใช่ null
    const nonNullData = pagestat.filter((item) => item.saleChannel !== null);

    // ถ้ามีการเลือกเพจ กรองข้อมูลตามเพจ
    const filteredDataByPage =
      selectedPage.length > 0
        ? nonNullData.filter((item) =>
            selectedPage.includes(item.saleChannelName)
          )
        : nonNullData;

    // ถ้ามีการเลือกแพลตฟอร์ม กรองข้อมูลต่อ
    const filteredDataByPlatform =
      selectedPlatform.length > 0
        ? filteredDataByPage.filter((item) =>
            selectedPlatform.includes(item.saleChannel)
          )
        : filteredDataByPage;

    // ดึงเฉพาะแพลตฟอร์มที่ไม่ซ้ำ
    return getUniqueUsernames(filteredDataByPlatform, "saleChannel");
  }, [pagestat, selectedPage, selectedPlatform]);

  const uniquePage = useMemo(() => {
    // แทนค่าที่เป็น null ด้วย "ไม่พบชื่อเพจ"
    const dataWithDefaultPageName = pagestat.map((item) => ({
      ...item,
      saleChannelName: item.saleChannelName || "ไม่พบชื่อเพจ",
    }));

    // กรองข้อมูลเฉพาะที่เกี่ยวข้องกับแพลตฟอร์ม ถ้ามีการเลือกแพลตฟอร์ม
    const filteredDataByPlatform =
      selectedPlatform.length > 0
        ? dataWithDefaultPageName.filter((item) =>
            selectedPlatform.includes(item.saleChannel)
          )
        : dataWithDefaultPageName;

    // ดึงเพจทั้งหมดที่ไม่ซ้ำ (ไม่กรองออกจาก Dropdown)
    return getUniqueUsernames(filteredDataByPlatform, "saleChannelName");
  }, [pagestat, selectedPlatform]);

  const filteredData = useMemo(() => {
    const filtered = getFilteredData(pagestat, selectedPlatform, selectedPage);

    // เพิ่ม adsWithVat หลังจากกรองข้อมูลเสร็จ
    return filtered.map((item) => ({
      ...item,
    }));
  }, [pagestat, selectedPlatform, selectedPage, vatRate]);

  const uniqueChannels = getUniqueSaleChannels(filteredData); // Get unique channels
  const groupedData = groupDataBySaleChannel(filteredData, uniqueChannels); // Group data

  const totalSalesNew = filteredData.reduce(
    (total, item) => total + parseFloat(item.SalesNew || 0),
    0
  );

  const totalSales = filteredData.reduce(
    (total, item) => total + parseFloat(item.sales || 0),
    0
  );
  const totalNewCus = filteredData.reduce(
    (total, item) => total + parseFloat(item.newcus || 0),
    0
  );

  const totalOrders = filteredData.reduce(
    (total, item) => total + parseFloat(item.totalorder || 0),
    0
  );
  const totalNewInbox = filteredData.reduce(
    (total, item) => total + parseFloat(item.newInbox || 0),
    0
  );

  const totalUpsale = filteredData.reduce(
    (total, item) => total + parseFloat(item.upsales || 0),
    0
  );

  const totalAds = filteredData.reduce(
    (total, item) => total + calculateVAT(parseFloat(item.ads || 0), vatRate),
    0
  );

  const handleClear = () => {
    setSelectedPlatform([]);
    setSelectedPage([]);
  };

  return (
    <section title={"Stats Platform"}>
      <NextUICard radius="sm" shadow="none">
        <CardBody>
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Search Type Section */}

            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-center lg:w-full w-64">
              <DateSelector
                value={dateRange}
                onChange={(value) => setDateRange(value)}
              />

              {/* Reset Button Section */}
              <div className="flex flex-col lg:flex-row gap-3">
                <div>
                  <Select
                    label="แพลตฟอร์ม"
                    placeholder="ทั้งหมด"
                    variant="bordered"
                    className="w-64"
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
                </div>
                <div>
                  <Select
                    label="เพจ"
                    placeholder="ทั้งหมด"
                    variant="bordered"
                    className="w-64"
                    onSelectionChange={(keys) =>
                      setSelectedPage(Array.from(keys))
                    }
                    selectedKeys={new Set(selectedPage)}
                    selectionMode="multiple"
                    disallowEmptySelection={false} // Allow deselection to filter all
                  >
                    {uniquePage.map((page) => (
                      <SelectItem key={page} value={page}>
                        {page}
                      </SelectItem>
                    ))}
                  </Select>
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
              </div>
              {/* Switch Section */}
              <div className="hidden lg:flex flex-col items-center mt-4 lg:mt-0">
                <label className="text-xs block text-center">
                  เปลี่ยนมุมมอง
                </label>
                <Switch
                  defaultSelected
                  size="lg"
                  onValueChange={setSwitchCard}
                  isSelected={switchCard}
                  classNames={{
                    base: cn(
                      "inline-flex flex-row-reverse items-center justify-between cursor-pointer rounded-lg gap-1",
                      "data-[selected=true]:border-none mt-2 mb-2"
                    ),
                    wrapper: "p-0 h-4 overflow-visible",
                    thumb: cn(
                      "w-7 h-7 group-data-[hover=true]:border-none group-data-[selected=true]:ml-7",
                      "group-data-[pressed=true]:w-4 group-data-[selected]:group-data-[pressed]:ml-2"
                    ),
                  }}
                />
              </div>
              <div className="hidden lg:flex flex-col items-center mt-4 lg:mt-0">
                <label className="text-xs block">ค่า Vat</label>
                <Checkbox
                  isSelected={selectedCheckboxes.vat}
                  onChange={() => handleCheckboxSelection("vat")}
                >
                  VAT 7%
                </Checkbox>
              </div>
            </div>

            {/* Filter or VAT Section */}
            {!switchCard ? (
              <></>
            ) : (
              <div className="lg:flex flex-col justify-between items-center mt-4 lg:mt-0  hidden lg:mr-10 gap-2">
                <label className="text-xs block">คอลัมน์</label>
                <FilterIcon
                  className=" hover:cursor-pointer"
                  onClick={openFilterModal}
                />
              </div>
            )}
          </div>
        </CardBody>
      </NextUICard>

      <div className={`flex-grow transition-transform duration-500 `}>
        <div
          className={` transition-transform duration-500 ${switchCard ? "animate-slide-right" : "animate-slide-left"} `}
        >
          {!switchCard ? (
            <div className="mt-3">
              <div className="mb-3 shadow-none">
                {isLoading ? (
                  <Spinner
                    color="primary"
                    className="flex justify-center items-center"
                  />
                ) : (
                  <div className="hidden lg:block">{renderSummaryCell()}</div>
                )}
              </div>
              <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:max-h-[60vh] overflow-y-auto scrollbar-hide shadow-none w-full">
                {/* Grouped FB cards */}
                {Object.entries(groupedData).map(([channel, items]) => (
                  <React.Fragment key={channel}>
                    <div className="col-span-full flex items-center justify-center rounded-lg bg-white p-4 shadow-none">
                      <h3 className="text-lg font-bold text-black">
                        {channel}
                      </h3>
                    </div>

                    {items.map((item) => (
                      <CardGrid
                        key={item.saleChannelName}
                        item={item}
                        onViewDetails={() =>
                          item.saleChannelName
                            ? handleViewDetails(item.saleChannelName)
                            : null
                        }
                        disabled={!item.saleChannelName}
                        vatRate={vatRate}
                        isLoading={isLoading}
                        selectedCheckboxes={selectedCheckboxes}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </section>
            </div>
          ) : (
            <div>
              <section className="mt-4">
                <TableDashboard
                  storedCheckboxes={selectedCheckboxes}
                  daterange={formatDateRange(dateRange)}
                  agentId={agentId}
                  filteredData={filteredData}
                />
              </section>
            </div>
          )}
        </div>
      </div>
      {/* Modal filter */}
      <Modal
        backdrop="opaque"
        isOpen={isFilterModalOpen}
        onOpenChange={onFilterModalChange}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
        className="max-w-3xl w-full"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-2xl">
                {"ตั้งค่าการแสดงคอลัมน์"}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col space-y-6 ">
                  {/* ยอดทัก Section */}
                  <div>
                    <label className="block mb-2 text-base font-semibold">
                      ยอดทัก
                    </label>
                    <div className="flex space-x-4">
                      <Checkbox
                        isSelected={selectedCheckboxes.newInbox}
                        onChange={() => handleCheckboxSelection("newInbox")}
                      >
                        ยอดทักใหม่
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.oldInbox}
                        onChange={() => handleCheckboxSelection("oldInbox")}
                      >
                        ยอดทักเก่า
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.totalInbox}
                        onChange={() => handleCheckboxSelection("totalInbox")}
                      >
                        ยอดทักรวม
                      </Checkbox>
                    </div>
                  </div>

                  {/* ยอดขาย Section */}
                  <div>
                    <label className="block mb-2 text-base font-semibold">
                      ยอดขาย
                    </label>
                    <div className="flex space-x-4">
                      <Checkbox
                        isSelected={selectedCheckboxes.SalesNew}
                        onChange={() => handleCheckboxSelection("SalesNew")}
                      >
                        ยอดขายลูกค้าใหม่
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.SalesOld}
                        onChange={() => handleCheckboxSelection("SalesOld")}
                      >
                        ยอดขายลูกค้าเก่า
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.sales}
                        onChange={() => handleCheckboxSelection("sales")}
                      >
                        ยอดขายรวม
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.upsales}
                        onChange={() => handleCheckboxSelection("upsales")}
                      >
                        ยอดขายอัพเซลล์
                      </Checkbox>
                    </div>
                  </div>

                  {/* ออเดอร์ Section */}
                  <div>
                    <label className="block mb-2 text-base font-semibold">
                      ออเดอร์
                    </label>
                    <div className="flex space-x-4">
                      <Checkbox
                        isSelected={selectedCheckboxes.newcus}
                        onChange={() => handleCheckboxSelection("newcus")}
                      >
                        ออเดอร์ลูกค้าใหม่
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.oldcus}
                        onChange={() => handleCheckboxSelection("oldcus")}
                      >
                        ออเดอร์ลูกค้าเก่า
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.totalorder}
                        onChange={() => handleCheckboxSelection("totalorder")}
                      >
                        ออเดอร์รวม
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.upsaleOrder}
                        onChange={() => handleCheckboxSelection("upsaleOrder")}
                      >
                        ออเดอร์อัพเซลล์
                      </Checkbox>
                    </div>
                  </div>

                  {/* ค่า Ads Section */}
                  <div>
                    <label className="block mb-2 text-base font-semibold">
                      ค่า Ads
                    </label>
                    <div className="flex space-x-4">
                      <Checkbox
                        isSelected={selectedCheckboxes.ads}
                        onChange={() => handleCheckboxSelection("ads")}
                      >
                        ค่า Ads
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.PercentAdsNew}
                        onChange={() =>
                          handleCheckboxSelection("PercentAdsNew")
                        }
                      >
                        % Ads ลูกค้าใหม่
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.PercentAdsSale}
                        onChange={() =>
                          handleCheckboxSelection("PercentAdsSale")
                        }
                      >
                        % Ads Admin
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.PercentAdsTotal}
                        onChange={() =>
                          handleCheckboxSelection("PercentAdsTotal")
                        }
                      >
                        % Ads
                      </Checkbox>
                    </div>
                  </div>

                  {/* การปิดการขาย Section */}
                  <div>
                    <label className="block mb-2 text-base font-semibold">
                      การปิดการขาย
                    </label>
                    <div className="flex space-x-4">
                      <Checkbox
                        isSelected={selectedCheckboxes.closeNew}
                        onChange={() => handleCheckboxSelection("closeNew")}
                      >
                        % ปิดการขายลูกค้าใหม่
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.closeTotal}
                        onChange={() => handleCheckboxSelection("closeTotal")}
                      >
                        % ปิดการขายรวม
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.closeUpsale}
                        onChange={() => handleCheckboxSelection("closeUpsale")}
                      >
                        % การอัพเซลล์
                      </Checkbox>
                    </div>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <PrimaryButton
                  onPress={() => {
                    handleSave(); // Save on confirm button click
                    onClose();
                  }}
                  text="ปิด"
                  variant="light"
                  className="text-black hover:bg-custom-redlogin hover:text-white"
                  size={"sm"}
                  color="error"
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        backdrop="opaque"
        isOpen={isDetailModalOpen}
        onOpenChange={onDetailModalChange}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: { duration: 0.3, ease: "easeOut" },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: { duration: 0.2, ease: "easeIn" },
            },
          },
        }}
        className="max-w-9xl w-full"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-2xl"></ModalHeader>
          <ModalBody>
            {pagestat
              .filter((item) => item.saleChannelName === selectedCard)
              .map((item) => (
                <div key={item.saleChannelName}>
                  <TableDetail
                    saleChannelName={item.saleChannelName}
                    agentId={agentId}
                    startDate={formatDateObject(dateRange.start)}
                    endDate={formatDateObject(dateRange.end)}
                    vatRate={vatRate}
                  />
                </div>
              ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </section>
  );
}

export default StatsPlatform;
