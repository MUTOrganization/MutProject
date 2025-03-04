import React, { useState, useEffect, useMemo } from "react";
import DefaultLayout from "../../layouts/default";
import {
  Card,
  Checkbox,
  DateRangePicker,
  DatePicker,
  Select,
  SelectItem,
  Avatar,
  Button,
  CardBody,
  useDisclosure,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider,
  Switch,
  Spinner,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import DailyColumnChart from "./components/DailyColumnChart";
import RadarChartMultipleSeries from "./components/RadarChartMultipleSeries";
import AdsPieChart from "./components/AdsPieChart";
import StackedBarChart from "./components/StackedBarChart";
import {
  formatDateObject,
  formatDateRange,
  formatDateThai,
} from "../../component/DateUtiils";
import { startOfMonth, endOfMonth, today } from "@internationalized/date";
import { useAppContext } from "../../contexts/AppContext";
import { PrimaryButton, ConfirmCancelButtons } from "../../component/Buttons";
import { URLS } from "../../config";
import fetchProtectedData from "../../../utils/fetchData";
import { SelectorIcon, FilterIcon } from "../../component/Icons";
import { ACCESS } from "../../configs/access";
import { calculateVAT } from "../../component/Calculate";
import DateSelector from "../../component/DateSelector";

const formattedValue = (value) =>
  value ? new Intl.NumberFormat().format(value) : "0";

const getUniqueUsernames = (data, key) => {
  return Array.from(new Set(data.map((item) => item[key]))).sort();
};

const getFilteredData = (
  data,
  selectedPlatform,
  selectedUser,
  selectedPage
) => {
  let filtered = data;

  // กรองข้อมูลตามแพลตฟอร์ม
  if (selectedPlatform.length > 0) {
    filtered = filtered.filter((item) =>
      selectedPlatform.includes(item.platform)
    );
  }

  // กรองข้อมูลตามเพจ
  if (selectedPage.length > 0) {
    filtered = filtered.filter((item) =>
      selectedPage.includes(item.saleChannelName)
    );
  }

  // กรองข้อมูลตามผู้ใช้
  if (selectedUser.length > 0) {
    filtered = filtered.filter((item) => selectedUser.includes(item.teamAds));
  }

  return filtered;
};

function DashBoardAds() {
  const [vatRate, setVatRate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAppContext();
  const currentData = useAppContext();
  const agentId = currentUser?.businessId;
  const username = currentUser?.userName;
  const nickname = currentUser?.nickname;
  console.log(currentData);

  const [dateRange, setDateRange] = useState({
    start: startOfMonth(today()),
    end: endOfMonth(today()),
  });

  const teamAdsValue =
    currentUser.role !== "Staff" ? "all" : nickname || username;

  const {
    isOpen: isFilterModalOpen,
    onOpen: openFilterModal,
    onOpenChange: onFilterModalChange,
  } = useDisclosure();
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({
    SalesNew: true,
    SalesOld: false,
    admin: true,
    newCus: true,
    oldCus: false,
    totalOrder: true,
    ads: true,
    newInbox: true,
    oldInbox: false,
    totalInbox: true,
    PercentAdsNew: true,
    PercentAdsSale: true,
    PercentAdsTotal: true,
    upsale: false,
    UpsaleOrder: false,
  });

  const [viewTable, setViewTable] = useState(false);
  const [viewdate, setViewDate] = useState(false);

  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState([]);
  const [selectedPage, setSelectedPage] = useState([]);

  const [data, setData] = useState([]);
  const [saleChecked, setSaleChecked] = useState(false);
  const [inboxChecked, setInboxChecked] = useState(false);
  const firstsort = viewdate ? "date" : "saleChannelName";
  const [sortDescriptor, setSortDescriptor] = useState({
    column: firstsort,
    direction: "ascending",
  });

  const handleClear = () => {
    setSelectedUser([]);
    setSelectedPlatform([]);
    setSelectedPage([]);
  };

  const fetchSalesData = async () => {
    setIsLoading(true);
    try {
      const url = `${URLS.ADSFORM}/totalSaleAds`;
      const responseSales = await fetchProtectedData.post(url, {
        agent: agentId,
        startDate: formatDateObject(dateRange.start),
        endDate: formatDateObject(dateRange.end),
        teamAds: teamAdsValue,
      });
      const resultSales = responseSales.data;

      console.log({
        agent: agentId,
        startDate: formatDateObject(dateRange.start),
        endDate: formatDateObject(dateRange.end),
        teamAds: teamAdsValue,
      });

      setData(resultSales);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const uniquePlatform = useMemo(() => {
    // ถ้าไม่มีการเลือกแพลตฟอร์ม ให้ใช้ข้อมูลทั้งหมด
    const filteredDataByPlatform =
      selectedPlatform.length > 0
        ? data.filter((item) => selectedPlatform.includes(item.platform))
        : data;

    // ดึงเฉพาะแพลตฟอร์มที่ไม่ซ้ำ
    return getUniqueUsernames(filteredDataByPlatform, "platform");
  }, [data, selectedPlatform]);

  const uniqueUsername = useMemo(() => {
    const filteredDataByPage =
      selectedPage.length > 0
        ? data.filter((item) => selectedPage.includes(item.saleChannelName))
        : data;

    return getUniqueUsernames(filteredDataByPage, "teamAds");
  }, [data, selectedPage]);

  const uniquePage = useMemo(() => {
    // กรองข้อมูลตามแพลตฟอร์มและผู้ใช้ ถ้ามีการเลือก
    const filteredDataByPage =
      selectedPlatform.length > 0 || selectedUser.length > 0
        ? data.filter((item) => {
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
        : data;

    // ดึงเฉพาะเพจที่ไม่ซ้ำ
    return getUniqueUsernames(filteredDataByPage, "saleChannelName");
  }, [data, selectedPlatform, selectedUser]);

  const groupAndSumData = (data) => {
    const grouped = data.reduce((acc, curr) => {
      const saleChannelName = curr.saleChannelName;
      const teamAds = curr.teamAds;

      if (!acc[saleChannelName]) {
        acc[saleChannelName] = {
          teamAds,
          saleChannelName,
          admin: 0,
          upsale: 0,
          ads: 0,
          newCus: 0,
          oldCus: 0,
          totalOrder: 0,
          SalesNew: 0,
          SalesOld: 0,
          UpsaleOrder: 0,
          newInbox: 0,
          oldInbox: 0,
          totalInbox: 0,
        };
      }

      acc[saleChannelName].admin += curr.admin || 0;
      acc[saleChannelName].upsale += curr.upsale || 0;
      acc[saleChannelName].newCus += curr.newCus || 0;
      acc[saleChannelName].oldCus += curr.oldCus || 0;
      acc[saleChannelName].totalOrder +=
        (curr.newCus || 0) + (curr.oldCus || 0);
      acc[saleChannelName].UpsaleOrder += curr.UpsaleOrder || 0;
      acc[saleChannelName].SalesNew += curr.SalesNew || 0;
      acc[saleChannelName].SalesOld += curr.SalesOld || 0;
      acc[saleChannelName].ads += curr.ads || 0;
      acc[saleChannelName].newInbox += curr.newInbox || 0;
      acc[saleChannelName].oldInbox += curr.oldInbox || 0;
      acc[saleChannelName].totalInbox += curr.totalInbox || 0;

      return acc;
    }, {});

    return Object.values(grouped);
  };

  const groupUser = (data) => {
    const grouped = data.reduce((acc, curr) => {
      const teamAds = curr.teamAds;
      const newInbox = curr.newInbox;
      const oldInbox = curr.oldInbox;
      const totalInbox = curr.totalInbox;

      if (!acc[teamAds]) {
        acc[teamAds] = {
          teamAds,
          admin: 0,
          upsale: 0,
          ads: 0,
          newCus: 0,
          oldCus: 0,
          totalOrder: 0,
          SalesNew: 0,
          SalesOld: 0,
          UpsaleOrder: 0,
          newInbox,
          oldInbox,
          totalInbox,
        };
      }

      acc[teamAds].admin += (curr.admin ?? 0) + (curr.upsale ?? 0);
      acc[teamAds].upsale += curr.upsale ?? 0;
      acc[teamAds].newCus += curr.newCus ?? 0;
      acc[teamAds].oldCus += curr.oldCus ?? 0;
      acc[teamAds].totalOrder += (curr.newCus ?? 0) + (curr.oldCus ?? 0);
      acc[teamAds].UpsaleOrder += curr.UpsaleOrder ?? 0;
      acc[teamAds].SalesNew += curr.SalesNew ?? 0;
      acc[teamAds].SalesOld += curr.SalesOld ?? 0;
      acc[teamAds].ads += curr.ads ?? 0;

      return acc;
    }, {});

    return Object.values(grouped);
  };

  const groupSalesByDayOfWeek = (salesData) => {
    // Helper function to get the day of the week
    const getDayOfWeek = (dateStr) => {
      const [year, month, day] = dateStr.split("-");

      const dateObj = new Date(Date.UTC(year, month - 1, day));

      const daysOfWeek = [
        "วันอาทิตย์", // Sunday
        "วันจันทร์", // Monday
        "วันอังคาร", // Tuesday
        "วันพุธ", // Wednesday
        "วันพฤหัสบดี", // Thursday
        "วันศุกร์", // Friday
        "วันเสาร์", // Saturday
      ];

      return daysOfWeek[dateObj.getUTCDay()];
    };

    const salesByDay = {
      วันจันทร์: { admin: 0, upsale: 0, ads: 0 },
      วันอังคาร: { admin: 0, upsale: 0, ads: 0 },
      วันพุธ: { admin: 0, upsale: 0, ads: 0 },
      วันพฤหัสบดี: { admin: 0, upsale: 0, ads: 0 },
      วันศุกร์: { admin: 0, upsale: 0, ads: 0 },
      วันเสาร์: { admin: 0, upsale: 0, ads: 0 },
      วันอาทิตย์: { admin: 0, upsale: 0, ads: 0 },
    };

    // Group the sales by day of the week
    salesData.forEach((item) => {
      const dayOfWeek = getDayOfWeek(item.date); // Get the day of the week in Thai

      salesByDay[dayOfWeek].admin += item.admin + item.upsale || 0; // Ensure value is not undefined
      salesByDay[dayOfWeek].upsale += item.upsale || 0; // Ensure value is not undefined
      salesByDay[dayOfWeek].ads += item.ads || 0; // Ensure value is not undefined
    });

    return salesByDay;
  };

  useEffect(() => {
    fetchSalesData();
  }, [agentId, dateRange]);

  console.log("data", data);

  const filteredData = useMemo(() => {
    const vat = vatRate ? 7 : 0;

    // ใช้ getFilteredData กรองข้อมูล
    const filtered = getFilteredData(
      data,
      selectedPlatform,
      selectedUser,
      selectedPage
    );

    // เพิ่ม adsWithVat หลังจากกรองข้อมูลเสร็จ
    return filtered.map((item) => ({
      ...item,
      adsWithVat: calculateVAT(parseFloat(item.ads || 0), vat),
    }));
  }, [data, selectedPlatform, selectedUser, selectedPage, vatRate]);

  const vat = vatRate ? 7 : 0;

  const totalAds = useMemo(
    () => filteredData.reduce((total, item) => total + item.adsWithVat, 0),
    [filteredData]
  );

  const groupedDataSales = groupAndSumData(filteredData);
  const groupuser = groupUser(filteredData);

  const dataAll = viewdate ? filteredData : groupedDataSales;

  const totalSaleNoupsale = groupedDataSales.reduce(
    (total, item) => total + parseFloat(item.admin || 0),
    0
  );

  const totalSale = groupedDataSales.reduce(
    (total, item) => total + parseFloat(item.admin || 0),
    0
  );
  const totalSaleNew = groupedDataSales.reduce(
    (total, item) => total + parseFloat(item.SalesNew || 0),
    0
  );

  const totalSaleOld = groupedDataSales.reduce(
    (total, item) => total + parseFloat(item.SalesOld || 0),
    0
  );

  const totalOrder = groupedDataSales.reduce(
    (total, item) =>
      total + parseFloat(item.newCus || 0) + parseFloat(item.oldCus || 0),
    0
  );
  const totalOrderNewcus = groupedDataSales.reduce(
    (total, item) => total + parseFloat(item.newCus || 0),
    0
  );
  const totalOrderOldCus = groupedDataSales.reduce(
    (total, item) => total + parseFloat(item.oldCus || 0),
    0
  );
  const totalOrderUpsale = groupedDataSales.reduce(
    (total, item) => total + parseFloat(item.UpsaleOrder || 0),
    0
  );
  const totalInbox = groupedDataSales.reduce(
    (total, item) => total + parseFloat(item.totalInbox || 0),
    0
  );
  const totalNewInbox = groupedDataSales.reduce(
    (total, item) => total + parseFloat(item.newInbox || 0),
    0
  );
  const totalOldInbox = groupedDataSales.reduce(
    (total, item) => total + parseFloat(item.oldInbox || 0),
    0
  );
  const totalUpsale = groupedDataSales.reduce(
    (total, item) => total + parseFloat(item.upsale || 0),
    0
  );

  const totalSalesNew = groupedDataSales.reduce(
    (total, item) => total + parseFloat(item.SalesNew || 0),
    0
  );

  const totalPercentAds =
    parseFloat(
      totalAds / (parseFloat(totalSale || 0) + parseFloat(totalUpsale || 0))
    ) * 100 || 0;

  const totalPercentAdsSale =
    parseFloat(totalAds / parseFloat(totalSale || 0)) * 100 || 0;
  const totalPercentAdsNew =
    parseFloat(totalAds / parseFloat(totalSalesNew || 0)) * 100 || 0;

  const sortedItems = useMemo(() => {
    return [...dataAll].sort((a, b) => {
      let first = a[sortDescriptor.column];
      let second = b[sortDescriptor.column];
      const firstIsNumber = !isNaN(parseFloat(first)) && isFinite(first);
      const secondIsNumber = !isNaN(parseFloat(second)) && isFinite(second);
      if (firstIsNumber && secondIsNumber) {
        first = parseFloat(first);
        second = parseFloat(second);
      } else {
        first = String(first).toLowerCase();
        second = String(second).toLowerCase();
      }
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [dataAll, sortDescriptor]);

  const renderCell = (item, columnKey) => {
    const costAds = calculateVAT(item.ads || 0, vat);

    const PercentAdsTotal =
      parseFloat(
        costAds / (parseFloat(item.admin || 0) + parseFloat(item.upsale || 0))
      ) * 100 || 0;
    const PercentAdsSale =
      parseFloat(costAds / parseFloat(item.admin || 0)) * 100 || 0;
    const PercentAdsNew =
      parseFloat(costAds / parseFloat(item.SalesNew || 0)) * 100 || 0;
    switch (columnKey) {
      case "saleChannelName":
        return <div className="text-start ">{item[columnKey]}</div>;
      case "teamAds":
        return <div className="text-start">{item[columnKey]}</div>;
      case "admin":
        // Add tooltip for Total Sales
        return (
          <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">ยอดขายไม่รวมอัพเซลล์</div>
                <div className="text-tiny">
                  {`฿${formattedValue(item.admin)}`}
                </div>
              </div>
            }
          >
            <div className="text-start ml-1 cursor-pointer">{`฿${formattedValue(parseFloat(item.admin || 0) + parseFloat(item.upsale || 0))}`}</div>
          </Tooltip>
        );
      case "upsale":
        return (
          <div className="text-start ml-1">{`฿${formattedValue(item[columnKey])}`}</div>
        );
      case "SalesNew":
        return (
          <div className="text-start ml-1">{`฿${formattedValue(item[columnKey])}`}</div>
        );
      case "SalesOld":
        return (
          <div className="text-start ml-1">{`฿${formattedValue(item[columnKey])}`}</div>
        );
      case "totalOrder":
        return (
          <div className="text-start ml-1">
            {formattedValue(item[columnKey])}
          </div>
        );
      case "UpsaleOrder":
        return (
          <div className="text-start ml-1">
            {formattedValue(item[columnKey])}
          </div>
        );
      case "newCus":
        return (
          <div className="text-start ml-1">
            {formattedValue(item[columnKey])}
          </div>
        );
      case "oldCus":
        return (
          <div className="text-start ml-1">
            {formattedValue(item[columnKey])}
          </div>
        );
      case "totalInbox":
        return (
          <div className="text-start ml-1">
            {formattedValue(item[columnKey])}
          </div>
        );
      case "newInbox":
        return (
          <div className="text-start ml-1">
            {formattedValue(item[columnKey])}
          </div>
        );
      case "oldInbox":
        return (
          <div className="text-start ml-1">
            {formattedValue(item[columnKey])}
          </div>
        );
      case "ads":
        return (
          <div className="text-start">{`฿${formattedValue(costAds.toFixed(2))}`}</div>
        );
      case "percentAdsNew":
        return (
          <div className="text-start">{`${formattedValue(PercentAdsNew.toFixed(2))} %`}</div>
        );
      case "percentAdsSale":
        return (
          <div className="text-start">{`${formattedValue(PercentAdsSale.toFixed(2))} %`}</div>
        );
      case "percentAdsTotal":
        return (
          <div className="text-start">{`${formattedValue(PercentAdsTotal.toFixed(2))} %`}</div>
        );
      default:
        return null;
    }
  };

  const columns = [
    { name: "รหัสเพจ", uid: "saleChannelName", sortable: true },
    { name: "ชื่อ", uid: "teamAds", sortable: true },
    { name: "ยอดขายรวม", uid: "admin", sortable: true },
    { name: "ยอดขายอัพเซล", uid: "upsale", sortable: true },
    { name: "ยอดขายลูกค้าใหม่", uid: "SalesNew", sortable: true },
    { name: "ยอดขายลูกค้าเก่า", uid: "SalesOld", sortable: true },
    { name: "ออเดอร์รวม", uid: "totalOrder", sortable: true },
    { name: "ออเดอร์อัพเซล", uid: "UpsaleOrder", sortable: true },
    { name: "ออเดอร์ลูกค้าใหม่", uid: "newCus", sortable: true },
    { name: "ออเดอร์ลูกค้าเก่า", uid: "oldCus", sortable: true },
    { name: "ยอดทักรวม", uid: "totalInbox", sortable: true },
    { name: "ยอดทักใหม่", uid: "newInbox", sortable: true },
    { name: "ยอดทักเก่า", uid: "oldInbox", sortable: true },
    { name: "เปอร์เซ็นแอดลูกค้าใหม่", uid: "percentAdsNew", sortable: true }, // Unique uid
    { name: "เปอร์เซ็นแอดเซลล์", uid: "percentAdsSale", sortable: true }, // Unique uid
    { name: "เปอร์เซ็นแอดรวม", uid: "percentAdsTotal", sortable: true }, // Unique uid
    { name: "ค่าแอด", uid: "ads", sortable: true },
  ];

  const renderCellDate = (item, columnKey) => {
    const formattedValue = (value) =>
      value ? new Intl.NumberFormat().format(value) : "0";

    const costAds = calculateVAT(item.ads || 0, vat);
    const PercentAdsTotal =
      parseFloat(
        costAds / (parseFloat(item.admin || 0) + parseFloat(item.upsale || 0))
      ) * 100 || 0;
    const PercentAdsSale =
      parseFloat(costAds / parseFloat(item.admin || 0)) * 100 || 0;
    const PercentAdsNew =
      parseFloat(costAds / parseFloat(item.SalesNew || 0)) * 100 || 0;
    switch (columnKey) {
      case "date":
        return <div className="text-start ">{item[columnKey]}</div>;
      case "saleChannelName":
        return <div className="text-start ">{item[columnKey]}</div>;
      case "teamAds":
        return <div className="text-start">{item[columnKey]}</div>;
      case "admin":
        return (
          <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">ยอดขายไม่รวมอัพเซลล์</div>
                <div className="text-tiny">
                  {`฿${formattedValue(item.admin)}`}
                </div>
              </div>
            }
          >
            <div className="text-start ml-1">{`฿${formattedValue(parseFloat(item.admin || 0) + parseFloat(item.upsale || 0))}`}</div>
          </Tooltip>
        );
      case "upsale":
        return (
          <div className="text-start ml-1">{`฿${formattedValue(item[columnKey])}`}</div>
        );
      case "SalesNew":
        return (
          <div className="text-start ml-1">{`฿${formattedValue(item[columnKey])}`}</div>
        );
      case "SalesOld":
        return (
          <div className="text-start ml-1">{`฿${formattedValue(item[columnKey])}`}</div>
        );
      case "totalOrder":
        return (
          <div className="text-start ml-1">
            {formattedValue(item[columnKey])}
          </div>
        );
      case "UpsaleOrder":
        return (
          <div className="text-start ml-1">
            {formattedValue(item[columnKey])}
          </div>
        );
      case "newCus":
        return (
          <div className="text-start ml-1">
            {formattedValue(item[columnKey])}
          </div>
        );
      case "oldCus":
        return (
          <div className="text-start ml-1">
            {formattedValue(item[columnKey])}
          </div>
        );
      case "totalInbox":
        return (
          <div className="text-start ml-1">
            {formattedValue(item[columnKey])}
          </div>
        );
      case "newInbox":
        return (
          <div className="text-start ml-1">
            {formattedValue(item[columnKey])}
          </div>
        );
      case "oldInbox":
        return (
          <div className="text-start ml-1">
            {formattedValue(item[columnKey])}
          </div>
        );
      case "ads":
        return (
          <div className="text-start">{`฿${formattedValue(costAds.toFixed(2))}`}</div>
        );
      case "percentAdsNew":
        return (
          <div className="text-start">{`${formattedValue(PercentAdsNew.toFixed(2))} %`}</div>
        );
      case "percentAdsSale":
        return (
          <div className="text-start">{`${formattedValue(PercentAdsSale.toFixed(2))} %`}</div>
        );
      case "percentAdsTotal":
        return (
          <div className="text-start">{`${formattedValue(PercentAdsTotal.toFixed(2))} %`}</div>
        );
      default:
        return null;
    }
  };

  const columnsDate = [
    { name: "วันที่", uid: "date", sortable: true },
    { name: "รหัสเพจ", uid: "saleChannelName", sortable: true },
    { name: "ชื่อ", uid: "teamAds", sortable: true },
    { name: "ยอดขายรวม", uid: "admin", sortable: true },
    { name: "ยอดขายอัพเซล", uid: "upsale", sortable: true },
    { name: "ยอดขายลูกค้าใหม่", uid: "SalesNew", sortable: true },
    { name: "ยอดขายลูกค้าเก่า", uid: "SalesOld", sortable: true },
    { name: "ออเดอร์รวม", uid: "totalOrder", sortable: true },
    { name: "ออเดอร์อัพเซล", uid: "UpsaleOrder", sortable: true },
    { name: "ออเดอร์ลูกค้าใหม่", uid: "newCus", sortable: true },
    { name: "ออเดอร์ลูกค้าเก่า", uid: "oldCus", sortable: true },
    { name: "ยอดทักใหม่", uid: "newInbox", sortable: true },
    { name: "เปอร์เซ็นแอดลูกค้าใหม่", uid: "percentAdsNew", sortable: true }, // Unique uid
    { name: "เปอร์เซ็นแอดเซลล์", uid: "percentAdsSale", sortable: true }, // Unique uid
    { name: "เปอร์เซ็นแอดรวม", uid: "percentAdsTotal", sortable: true }, // Unique uid
    { name: "ค่าแอด", uid: "ads", sortable: true },
  ];

  const columnAll = viewdate ? columnsDate : columns;

  const visibleColumns = columnAll.filter(
    (column) => selectedCheckboxes[column.uid] !== false
  );

  const totalRow = useMemo(() => {
    const totalData = groupedDataSales.reduce(
      (totals, item) => {
        totals.admin += parseFloat(item.admin || 0);
        totals.upsale += parseFloat(item.upsale || 0);
        totals.SalesNew += parseFloat(item.SalesNew || 0);
        totals.SalesOld += parseFloat(item.SalesOld || 0);
        totals.totalOrder += parseFloat(item.totalOrder || 0);
        totals.newCus += parseFloat(item.newCus || 0);
        totals.oldCus += parseFloat(item.oldCus || 0);
        totals.UpsaleOrder += parseFloat(item.UpsaleOrder || 0);
        totals.newInbox += parseFloat(item.newInbox || 0);
        totals.oldInbox += parseFloat(item.oldInbox || 0);
        totals.totalInbox += parseFloat(item.totalInbox || 0);
        totals.ads += calculateVAT(parseFloat(item.ads || 0), vatRate ? 7 : 0);
        return totals;
      },
      {
        admin: 0,
        upsale: 0,
        SalesNew: 0,
        SalesOld: 0,
        totalOrder: 0,
        totalInbox: 0,
        newCus: 0,
        oldCus: 0,
        ads: 0,
        UpsaleOrder: 0,
        newInbox: 0,
        oldInbox: 0,
      }
    );

    // Calculate percentages after summing totals
    const percentAdsNew = totalData.SalesNew
      ? (totalData.ads / totalData.SalesNew) * 100
      : 0;
    const percentAdsSale = totalData.admin
      ? (totalData.ads / (totalData.admin - totalData.upsale)) * 100
      : 0;
    const percentAdsTotal =
      totalData.admin + totalData.upsale
        ? (totalData.ads / (totalData.admin + totalData.upsale)) * 100
        : 0;

    return {
      saleChannelName: "รวมทั้งหมด",
      ...totalData,
      percentAdsNew,
      percentAdsSale,
      percentAdsTotal,
    };
  }, [groupedDataSales, vatRate]);

  const totalRowDate = useMemo(() => {
    const totalData = filteredData.reduce(
      (totals, item) => {
        totals.admin += parseFloat(item.admin || 0);
        totals.upsale += parseFloat(item.upsale || 0);
        totals.SalesNew += parseFloat(item.SalesNew || 0);
        totals.SalesOld += parseFloat(item.SalesOld || 0);
        totals.totalOrder += parseFloat(item.totalOrder || 0);
        totals.newCus += parseFloat(item.newCus || 0);
        totals.oldCus += parseFloat(item.oldCus || 0);
        totals.UpsaleOrder += parseFloat(item.UpsaleOrder || 0);
        totals.newInbox += parseFloat(item.newInbox || 0);
        totals.totalInbox += parseFloat(item.totalInbox || 0);
        totals.ads += calculateVAT(parseFloat(item.ads || 0), vatRate ? 7 : 0);
        return totals;
      },
      {
        admin: 0,
        upsale: 0,
        SalesNew: 0,
        SalesOld: 0,
        totalOrder: 0,
        totalInbox: 0,
        newCus: 0,
        oldCus: 0,
        ads: 0,
        UpsaleOrder: 0,
        newInbox: 0,
      }
    );

    // Calculate percentages after summing totals
    const percentAdsNew = totalData.SalesNew
      ? (totalData.ads / totalData.SalesNew) * 100
      : 0;
    const percentAdsSale = totalData.admin
      ? (totalData.ads / (totalData.admin - totalData.upsale)) * 100
      : 0;
    const percentAdsTotal =
      totalData.admin + totalData.upsale
        ? (totalData.ads / (totalData.admin + totalData.upsale)) * 100
        : 0;

    return {
      date: "รวมทั้งหมด",
      saleChannelName: "",
      teamAds: "",
      ...totalData,
      percentAdsNew,
      percentAdsSale,
      percentAdsTotal,
    };
  }, [filteredData, vatRate]);

  const handleVatChange = (isChecked) => {
    setVatRate(isChecked);
  };

  const handleViewdate = (isChecked) => {
    setViewDate(isChecked);
  };

  const handleCheckboxSelection = (key) => {
    setSelectedCheckboxes((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  return (
    <section title={"Dashboard Ads"}>
      <div className=" space-y-4">
        <Card shadow="none" radius="sm">
          <CardBody>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 max-h-screen w-full">
              {/* บล็อกซ้าย (DateSelector + Select ต่าง ๆ + Reset + Vat Switch) */}
              <div className="flex flex-col gap-4 w-full">

                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-center w-full">
                  {/* Date Selector */}
                  <DateSelector
                    value={dateRange}
                    onChange={(value) => setDateRange(value)}
                  />

                  {/* โซน Select ต่าง ๆ */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Select แพลตฟอร์ม */}
                    <div className="w-full sm:w-auto">
                      <Select
                        label="แพลตฟอร์ม"
                        placeholder="ทั้งหมด"
                        variant="bordered"
                        className="w-full sm:w-64"
                        onSelectionChange={(keys) =>
                          setSelectedPlatform(Array.from(keys))
                        }
                        selectedKeys={new Set(selectedPlatform)}
                        selectionMode="multiple"
                        disallowEmptySelection={false}
                      >
                        {uniquePlatform.map((platform) => (
                          <SelectItem key={platform} value={platform}>
                            {platform}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>

                    {/* Select เพจ */}
                    <div className="w-full sm:w-auto">
                      <Select
                        label="เพจ"
                        placeholder="ทั้งหมด"
                        variant="bordered"
                        className="w-full sm:w-64"
                        onSelectionChange={(keys) =>
                          setSelectedPage(Array.from(keys))
                        }
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
                    </div>

                    {/* Select ผู้บันทึกค่าแอด (ถ้า teamAdsValue === 'all') */}
                    {teamAdsValue === "all" && (
                      <div className="w-full sm:w-auto">
                        <Select
                          label="ผู้บันทึกค่าแอด"
                          placeholder="ทั้งหมด"
                          variant="bordered"
                          className="w-full sm:w-64"
                          onSelectionChange={(keys) =>
                            setSelectedUser(Array.from(keys))
                          }
                          selectedKeys={new Set(selectedUser)}
                          selectionMode="multiple"
                          disallowEmptySelection={false}
                        >
                          {uniqueUsername.map((teamAds) => (
                            <SelectItem key={teamAds} value={teamAds}>
                              {teamAds}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                    )}

                    {/* ปุ่ม Reset + Checkbox Vat 7% */}
                    <div className="flex items-center space-x-6">
                      <div>
                        <label className="text-xs block">ล้างการค้นหา</label>
                        <PrimaryButton
                          text="Reset"
                          size="sm"
                          onPress={handleClear}
                          className="text-black hover:bg-custom-redlogin hover:text-white bg-gray-100"
                        />
                      </div>
                      <div className="flex flex-col justify-center items-center gap-2">
                        <label className="text-xs block">Vat 7%</label>
                        <Checkbox
                          onChange={(e) => handleVatChange(e.target.checked)}
                          isSelected={vatRate}
                          color="danger"
                          size="lg"
                        />
                      </div>
                    </div>

                    {/* Tooltip + Switch (ดูรายวัน/ดูยอดรวม) ถ้ามี viewTable */}
                    {viewTable && (
                      <Tooltip
                        content={
                          viewdate ? (
                            <label className="text-xs block">
                              เลื่อนเพื่อดูยอดรวม
                            </label>
                          ) : (
                            <label className="text-xs block">
                              เลื่อนเพื่อดูรายวัน
                            </label>
                          )
                        }
                        color="primary"
                      >
                        <div className="flex flex-col justify-center items-center gap-2 ml-2">
                          {viewdate ? (
                            <label className="text-xs block">ดูรายวัน</label>
                          ) : (
                            <label className="text-xs block">ดูยอดรวม</label>
                          )}
                          <Switch
                            onChange={(e) => handleViewdate(e.target.checked)}
                            isSelected={viewdate}
                            color="danger"
                            size="md"
                          />
                        </div>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>

              {/* บล็อกขวา (ปุ่ม ดูแบบตาราง / ปุ่ม กลับ + ฟิลเตอร์) */}
              <div className="flex justify-end items-center">
                {viewTable ? (
                  <div className="flex flex-row items-center mt-4 sm:mt-0 space-x-4">
                    <Tooltip content="กรองคอลัมน์" color="primary">
                      <div>
                        <PrimaryButton
                          text={<FilterIcon />}
                          size="sm"
                          variant="like"
                          onPress={openFilterModal}
                          className="text-black"
                        />
                      </div>
                    </Tooltip>
                    <PrimaryButton
                      text="กลับ"
                      color="danger"
                      onPress={() => setViewTable(false)}
                    />
                  </div>
                ) : (
                  <PrimaryButton
                    text="ดูแบบตาราง"
                    endContent={<SelectorIcon />}
                    onPress={() => setViewTable(true)}
                  />
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        <section>
          <div className="h-full space-y-2 mb-2">
            {!viewTable ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-2">
                  {/* Top side: Cards */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
                    {/* Left Side: Two stacked cards */}
                    <div className="grid grid-cols-1 gap-2 xl:col-span-1">
                      {/* First card */}
                      <Card shadow="none" radius="sm" className="h-full p-2">
                        <CardBody>
                          {saleChecked ? (
                            <>
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div className="font-bold text-xl mb-4 lg:mb-0 xl:mb-0">
                                  ออเดอร์
                                </div>
                                <div className="flex flex-row items-center gap-4">
                                  <span>ยอดขาย</span>
                                  <Switch
                                    checked={saleChecked}
                                    onChange={(e) =>
                                      setSaleChecked(!saleChecked)
                                    } // Toggle saleChecked
                                    size="sm"
                                  />
                                  <span>ออเดอร์</span>
                                </div>
                              </div>
                              <Divider className="my-2" />
                              {isLoading ? (
                                <Spinner
                                  color="primary"
                                  className="flex justify-center items-center h-[250]"
                                />
                              ) : (
                                <div className="flex justify-between items-center ">
                                  <div>
                                    <h1 className="text-green-500 text-4xl font-bold">
                                      {`${formattedValue(totalOrder)}`}
                                    </h1>
                                  </div>

                                  <ul className="text-right p-1 space-y-1 ">
                                    <li>
                                      ออเดอร์อัพเซล:{" "}
                                      {`${formattedValue(totalOrderUpsale)}`}
                                    </li>

                                    <li>
                                      ออเดอร์ลูกค้าใหม่:{" "}
                                      {`${formattedValue(totalOrderNewcus)}`}
                                    </li>
                                    <li>
                                      ออเดอร์ลูกค้าเก่า:{" "}
                                      {`${formattedValue(totalOrderOldCus)}`}
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div className="font-bold text-xl mb-4 lg:mb-0 xl:mb-0">
                                  ยอดขาย
                                </div>
                                <div className="flex flex-row items-center gap-4">
                                  <span>ยอดขาย</span>
                                  <Switch
                                    checked={saleChecked}
                                    onChange={(e) =>
                                      setSaleChecked(!saleChecked)
                                    } // Toggle saleChecked
                                    size="sm"
                                  />
                                  <span>ออเดอร์</span>
                                </div>
                              </div>
                              <Divider className="my-2" />
                              {isLoading ? (
                                <Spinner
                                  color="primary"
                                  className="flex justify-center items-center h-[250]"
                                />
                              ) : (
                                <div className="flex justify-between items-center">
                                  <Tooltip
                                    content={
                                      <div className="px-1 py-2">
                                        <div className="text-small font-bold">
                                          ยอดขายไม่รวมอัพเซลล์
                                        </div>
                                        <div className="text-tiny">{`฿${formattedValue(totalSaleNoupsale)}`}</div>
                                      </div>
                                    }
                                  >
                                    <div>
                                      <h1 className="text-green-500 text-4xl font-bold">
                                        {`฿${formattedValue(totalSale + totalUpsale)}`}
                                      </h1>
                                    </div>
                                  </Tooltip>
                                  <ul className="text-right p-1 space-y-1">
                                    <li>
                                      ยอดอัพเซล:{" "}
                                      {`฿${formattedValue(totalUpsale)}`}
                                    </li>

                                    <li>
                                      ยอดขายลูกค้าใหม่:{" "}
                                      {`฿${formattedValue(totalSaleNew)}`}
                                    </li>
                                    <li>
                                      ยอดขายลูกค้าเก่า:{" "}
                                      {`฿${formattedValue(totalSaleOld)}`}
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </>
                          )}
                        </CardBody>
                      </Card>

                      {/* Second card */}
                      <Card shadow="none" radius="sm" className="h-full p-2">
                        <CardBody>
                          {inboxChecked ? (
                            <>
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div className="font-bold text-xl mb-4 lg:mb-0 xl:mb-0">
                                  ยอดทัก
                                </div>
                                <div className="flex flex-row items-center gap-4">
                                  <span>Ads</span>
                                  <Switch
                                    checked={inboxChecked}
                                    onChange={(e) =>
                                      setInboxChecked(!inboxChecked)
                                    } // Toggle saleChecked
                                    size="sm"
                                  />
                                  <span>ยอดทัก</span>
                                </div>
                              </div>
                              <Divider className="my-2" />
                              {isLoading ? (
                                <Spinner
                                  color="primary"
                                  className="flex justify-center items-center h-[250]"
                                />
                              ) : (
                                <div className="flex justify-between items-center">
                                  <Tooltip
                                    content={
                                      <div className="px-1 py-2">
                                        <div className="text-small font-bold">
                                          ยอดทักรวม
                                        </div>
                                      </div>
                                    }
                                  >
                                    <div>
                                      <h1 className="text-green-500 text-4xl font-bold">
                                        {`${formattedValue(totalInbox)}`}
                                      </h1>
                                    </div>
                                  </Tooltip>
                                  <ul className="text-right p-1  space-y-1">
                                    <li>
                                      ยอดทักลูกค้าใหม่:{" "}
                                      {`${formattedValue(totalNewInbox)}`}
                                    </li>
                                    <li>
                                      ยอดทักลูกค้าเก่า:{" "}
                                      {`${formattedValue(totalOldInbox)}`}
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div className="font-bold text-xl mb-4 lg:mb-0 xl:mb-0">
                                  Ads
                                </div>
                                <div className="flex flex-row items-center  space-x-2">
                                  <span>Ads</span>
                                  <Switch
                                    checked={inboxChecked}
                                    onChange={(e) =>
                                      setInboxChecked(!inboxChecked)
                                    }
                                    size="sm"
                                  />
                                  <span>ยอดทัก</span>
                                </div>
                              </div>
                              <Divider className="my-2" />
                              {isLoading ? (
                                <Spinner
                                  color="primary"
                                  className="flex justify-center items-center h-[250]"
                                />
                              ) : (
                                <div className="flex justify-between items-center">
                                  <Tooltip
                                    content={
                                      <div className="px-1 py-2">
                                        <div className="text-small font-bold">
                                          ค่าแอด
                                        </div>
                                      </div>
                                    }
                                  >
                                    <div>
                                      <h1 className="text-green-500 text-4xl font-bold">
                                        {`฿${formattedValue(totalAds.toFixed(1))}`}
                                      </h1>
                                    </div>
                                  </Tooltip>
                                  <ul className="text-right p-1  space-y-1">
                                    <li>
                                      % Ads ทั้งหมด:{" "}
                                      {`${totalPercentAds.toFixed(2)} %`}
                                    </li>
                                    <li>
                                      % Ads Admin:{" "}
                                      {`${totalPercentAdsSale.toFixed(2)} %`}
                                    </li>
                                    <li>
                                      % Ads ลูกค้าใหม่:{" "}
                                      {`${totalPercentAdsNew.toFixed(2)} %`}
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </>
                          )}
                        </CardBody>
                      </Card>
                    </div>

                    {/* Right Side: One large card */}
                    <div className="xl:col-span-2 ">
                      <Card
                        radius="sm"
                        shadow="none"
                        className="p-4 md:flex md:flex-col h-96"
                      >
                        <h3 className="text-lg font-semibold mb-4">
                          แผนภูมิแสดง % Ads ทั้งหมด
                        </h3>

                        <DailyColumnChart
                          data={filteredData}
                          vatRate={vatRate}
                          isLoading={isLoading}
                        />
                      </Card>
                    </div>
                  </div>

                  {/* Bottom section with charts */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                    {/* First Card for the Pie Chart */}
                    <Card
                      radius="sm"
                      shadow="none"
                      className="h-full p-4 md:col-span-3"
                    >
                      <h3 className="text-lg font-semibold mb-4">
                        แผนภูมิแสดงยอดขาย
                      </h3>

                      <AdsPieChart
                        data={groupuser}
                        vatRate={vatRate}
                        isLoading={isLoading}
                      />
                    </Card>

                    {/* Second Card for the Radar Chart */}
                    <Card
                      radius="sm"
                      shadow="none"
                      className="h-full p-4 md:col-span-3"
                    >
                      <h3 className="text-lg font-semibold mb-4">
                        แผนภูมิแสดงยอดขาย
                      </h3>

                      <RadarChartMultipleSeries
                        data={groupSalesByDayOfWeek(filteredData)}
                        vatRate={vatRate}
                        isLoading={isLoading}
                      />
                    </Card>

                    {/* Third Card for the Column Chart with more width */}
                    <Card
                      radius="sm"
                      shadow="none"
                      className="h-full p-4 md:col-span-6"
                    >
                      <h3 className="text-lg font-semibold mb-4">
                        แผนภูมิยอดขายรายเพจที่ดูเเล
                      </h3>
                      <StackedBarChart
                        data={filteredData}
                        isLoading={isLoading}
                      />
                    </Card>
                  </div>
                </div>
              </>
            ) : (
              <Card shadow="none" radius="sm">
                <Table
                  shadow="none"
                  aria-label="Example table with client side sorting"
                  className="max-h-[700px] min-h-[700px] overflow-y-auto  p-2"
                  sortDescriptor={sortDescriptor}
                  onSortChange={setSortDescriptor}
                  removeWrapper
                  isHeaderSticky
                >
                  <TableHeader columns={visibleColumns}>
                    {(column) => (
                      <TableColumn
                        key={column.uid}
                        allowsSorting={column.sortable}
                        className={`cursor-pointer ${
                          sortDescriptor.column === column.uid
                            ? "text-blue-500 font-bold"
                            : ""
                        }`}
                      >
                        {column.name}
                      </TableColumn>
                    )}
                  </TableHeader>
                  <TableBody
                    items={sortedItems}
                    emptyContent={"ยังไม่มีข้อมูล"}
                    loadingState={isLoading ? "loading" : undefined}
                    loadingContent={<Spinner color="primary" />}
                  >
                    {sortedItems.map((item, index) => (
                      <TableRow key={index}>
                        {visibleColumns.map((column) => (
                          <TableCell key={column.uid} align="center">
                            {viewdate
                              ? renderCellDate(item, column.uid)
                              : renderCell(item, column.uid)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                    {!isLoading && sortedItems && sortedItems.length > 0 && (
                      <TableRow
                        key="total-row"
                        className="font-bold bg-slate-100 rounded-lg z-10 sticky bottom-0"
                      >
                        {visibleColumns.map((column) => (
                          <TableCell
                            key={column.uid}
                            align="center"
                            className="font-bold"
                          >
                            {viewdate
                              ? renderCellDate(totalRowDate, column.uid)
                              : renderCell(totalRow, column.uid)}
                          </TableCell>
                        ))}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            )}
          </div>
        </section>
      </div>
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
                {"ตั้งค่าการค้นหา"}
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
                        isSelected={selectedCheckboxes.admin}
                        onChange={() => handleCheckboxSelection("admin")}
                      >
                        ยอดขายรวม
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.upsale}
                        onChange={() => handleCheckboxSelection("upsale")}
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
                        isSelected={selectedCheckboxes.newCus}
                        onChange={() => handleCheckboxSelection("newCus")}
                      >
                        ออเดอร์ลูกค้าใหม่
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.oldCus}
                        onChange={() => handleCheckboxSelection("oldCus")}
                      >
                        ออเดอร์ลูกค้าเก่า
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.totalOrder}
                        onChange={() => handleCheckboxSelection("totalOrder")}
                      >
                        ออเดอร์รวม
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.UpsaleOrder}
                        onChange={() => handleCheckboxSelection("UpsaleOrder")}
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
                </div>
              </ModalBody>

              <ModalFooter>
                <PrimaryButton
                  onPress={() => {
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
    </section>
  );
}

export default DashBoardAds;
