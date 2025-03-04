import React, { useState, useEffect, useMemo, useCallback } from "react";
import fetchProtectedData from "../../../../utils/fetchData";
import { URLS } from "../../../config";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Card,
} from "@nextui-org/react";
import {
  calculateVAT,
  calculateCloseRate,
  calculateGroupedData,
} from "../../../component/Calculate";
import { FacebookIcon, LineIcon } from "../../../component/Icons";

function TableDetail({
  saleChannelName,
  startDate,
  endDate,
  agentId,
  vatRate,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [dataAds, setDataAds] = useState([]);
  const [dataSale, setDataSale] = useState([]);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "total_sales",
    direction: "descending",
  });
  const fetchPagestat = async () => {
    setIsLoading(true);
    try {
      const pagestatUrl = `${URLS.STATSPLATFORM}/PagestatUser`;
      const saleUserUrl = `${URLS.STATSPLATFORM}/saleUser`; // Add the URL for saleUser

      // Execute both requests in parallel using Promise.all
      const [pagestatResponse, saleUserResponse] = await Promise.all([
        fetchProtectedData.post(pagestatUrl, {
          agent: agentId,
          startDate: startDate,
          endDate: endDate,
          CODE: saleChannelName,
        }),
        fetchProtectedData.post(saleUserUrl, {
          agent: agentId,
          startDate: startDate,
          endDate: endDate,
          CODE: saleChannelName,
        }),
      ]);

      setDataAds(pagestatResponse.data);
      setDataSale(saleUserResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (saleChannelName !== null) {
      fetchPagestat();
    }
  }, [agentId, startDate, endDate, saleChannelName]);

  const formattedValue = (value) =>
    value ? new Intl.NumberFormat().format(value) : "0";

  const vat = vatRate ? 7 : 0;

  const combinedArray = [...dataAds, ...dataSale].reduce((acc, entry) => {
    const existingEntry = acc.find(
      (item) => item.sales_name === entry.sales_name
    );

    if (existingEntry) {
      // ถ้ามีอยู่แล้ว ให้เพิ่มข้อมูลใน entry ที่ตรงกัน
      if (entry.totalAdsAmount) {
        existingEntry.totalAdsAmount = calculateVAT(
          parseFloat(entry.totalAdsAmount) || 0,
          vat
        );
      }
      if (entry.img) {
        existingEntry.img = entry.img;
      }
      if (entry.sales) {
        existingEntry.sales += parseFloat(entry.sales) || 0;
      }
      if (entry.SalesNew) {
        existingEntry.SalesNew += parseFloat(entry.SalesNew) || 0;
      }
      if (entry.SalesOld) {
        existingEntry.SalesOld += parseFloat(entry.SalesOld) || 0;
      }
      if (entry.name) {
        existingEntry.name = entry.name || "";
      }
      if (entry.pageName) {
        existingEntry.pageName = entry.pageName;
      }
      if (entry.newInbox) {
        existingEntry.newInbox += parseFloat(entry.newInbox) || 0;
      }
      if (entry.newcus) {
        existingEntry.newcus += parseFloat(entry.newcus) || 0;
      }
      if (entry.oldInbox) {
        existingEntry.oldInbox += parseFloat(entry.oldInbox) || 0;
      }
      if (entry.oldcus) {
        existingEntry.oldcus += parseFloat(entry.oldcus) || 0;
      }
      if (entry.UpsaleOrder) {
        existingEntry.UpsaleOrder += parseFloat(entry.UpsaleOrder) || 0;
      }
      if (entry.upsale) {
        existingEntry.upsale += parseFloat(entry.upsale) || 0;
      }
    } else {
      // ถ้ายังไม่มี ให้สร้าง entry ใหม่ใน array
      acc.push({
        sales_name: entry.sales_name,
        totalAdsAmount: entry.totalAdsAmount
          ? parseFloat(entry.totalAdsAmount)
          : 0,
        sales: entry.sales ? parseFloat(entry.sales) : 0,
        SalesNew: entry.SalesNew ? parseFloat(entry.SalesNew) : 0,
        SalesOld: entry.SalesOld ? parseFloat(entry.SalesOld) : 0,
        newInbox: entry.newInbox ? parseFloat(entry.newInbox) : 0,
        newcus: entry.newcus ? parseFloat(entry.newcus) : 0,
        oldInbox: entry.oldInbox ? parseFloat(entry.oldInbox) : 0,
        oldcus: entry.oldcus ? parseFloat(entry.oldcus) : 0,
        UpsaleOrder: entry.UpsaleOrder ? parseFloat(entry.UpsaleOrder) : 0,
        upsale: entry.upsale ? parseFloat(entry.upsale) : 0,
        name: entry.name || entry.sales_name,
        pageName: entry.pageName,
      });
    }
    return acc;
  }, []);

  const sortedItems = useMemo(() => {
    return [...combinedArray].sort((a, b) => {
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
  }, [combinedArray, sortDescriptor]);

  const columns = [
    { uid: "name", name: "ชื่อเซลล์" },
    { uid: "sales", name: "ยอดขายรวม", sortable: true },
    { uid: "SalesNew", name: "ยอดขายลูกค้าใหม่", sortable: true },
    { uid: "SalesOld", name: "ยอดขายลูกค้าเก่า", sortable: true },
    { uid: "totalOrder", name: "ออเดอร์รวม", sortable: true },
    { uid: "oldcus", name: "ออเดอร์ลูกค้าเก่า", sortable: true },
    { uid: "newcus", name: "ออเดอร์ลูกค้าใหม่", sortable: true },
    { uid: "newInbox", name: "New Inbox", sortable: true },
    { uid: "oldInbox", name: "Old Inbox", sortable: true },
    { uid: "total_inbox", name: "Total Inbox", sortable: true },
    { uid: "totalAdsAmount", name: "Total Ads", sortable: true },
  ];
  const renderCell = (item, columnKey) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "name":
        return (
          <div className="flex justify-center">
            <p className="text-bold text-sm">{cellValue}</p>
          </div>
        );
      case "sales":
        return (
          <div className="flex justify-center">
            <p className="text-bold text-sm">{formatCurrency(cellValue)}</p>
          </div>
        );
      case "SalesNew":
        return (
          <div className="flex justify-center">
            <p className="text-bold text-sm">{formatCurrency(cellValue)}</p>
          </div>
        );
      case "SalesOld":
        return (
          <div className="flex justify-center">
            <p className="text-bold text-sm">{formatCurrency(cellValue)}</p>
          </div>
        );
      case "totalOrder":
        return (
          <div className="flex justify-center">
            <p className="text-bold text-sm">
              {formatCurrencyNoDollars(
                parseInt(item.newcus) + parseInt(item.oldcus)
              )}
            </p>
          </div>
        );
      case "oldcus":
        return (
          <div className="flex justify-center">
            <p className="text-bold text-sm">
              {formatCurrencyNoDollars(cellValue)}
            </p>
          </div>
        );
      case "newcus":
        return (
          <div className="flex justify-center">
            <p className="text-bold text-sm">
              {formatCurrencyNoDollars(cellValue)}
            </p>
          </div>
        );
      case "newInbox":
        return (
          <div className="flex justify-center">
            <p className="text-bold text-sm">
              {formatCurrencyNoDollars(cellValue)}
            </p>
          </div>
        );
      case "oldInbox":
        return (
          <div className="flex justify-center">
            <p className="text-bold text-sm">
              {formatCurrencyNoDollars(cellValue)}
            </p>
          </div>
        );
      case "total_inbox":
        return (
          <div className="flex justify-center">
            <p className="text-bold text-sm">
              {formatCurrencyNoDollars(
                parseInt(item.newInbox) + parseInt(item.oldInbox)
              )}
            </p>
          </div>
        );
      case "totalAdsAmount":
        return (
          <div className="flex justify-center">
            <p className="text-bold text-sm">
              {formatCurrency(parseFloat(item[columnKey]))}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const totalSum = useMemo(() => {
    return combinedArray.reduce((sum, item) => {
      return {
        totalSales: (sum.totalSales || 0) + (parseFloat(item.sales) || 0),
        totalSalesNew:
          (sum.totalSalesNew || 0) + (parseFloat(item.SalesNew) || 0),
        totalSalesOld:
          (sum.totalSalesOld || 0) + (parseFloat(item.SalesOld) || 0),
        totalOrder:
          (sum.totalOrder || 0) +
          (parseFloat(item.oldcus) || 0) +
          (parseFloat(item.newcus) || 0),
        totaloldcus: (sum.totaloldcus || 0) + (parseFloat(item.oldcus) || 0),
        totalnewcus: (sum.totalnewcus || 0) + (parseFloat(item.newcus) || 0),
        totalnewInbox:
          (sum.totalnewInbox || 0) + (parseFloat(item.newInbox) || 0),
        totaloldInbox:
          (sum.totaloldInbox || 0) + (parseFloat(item.oldInbox) || 0),
        totalInbox:
          (sum.totalInbox || 0) +
          (parseFloat(item.newInbox) || 0) +
          (parseFloat(item.oldInbox) || 0),
        totalAdsAmount:
          (sum.totalAdsAmount || 0) + (parseFloat(item.totalAdsAmount) || 0),
        totalUpsale: (sum.totalUpsale || 0) + (parseFloat(item.upsale) || 0),
        totalUpsaleOrder:
          (sum.totalUpsaleOrder || 0) + (parseFloat(item.UpsaleOrder) || 0),
      };
    }, {});
  }, [combinedArray]);

  const renderIcon = (channelName) => {
    if (!channelName) {
      return null;
    }
    if (channelName.startsWith("FB")) {
      return <FacebookIcon className="text-blue-600" />;
    } else if (channelName.startsWith("LA")) {
      return <LineIcon className="text-green-500" />;
    } else {
      return null;
    }
  };

  const renderSummaryCell = () => {
    const totalCloseRateNew = calculateCloseRate(
      totalSum.totalnewcus,
      totalSum.totalnewInbox
    );
    const totalCloseRate = calculateCloseRate(
      totalSum.totalOrder,
      totalSum.totalInbox
    );
    const totalCloseRateUpsale = calculateCloseRate(
      totalSum.totalUpsaleOrder,
      totalSum.totalOrder
    );

    const totalPercentAds =
      parseFloat(
        parseFloat(totalSum.totalAdsAmount) /
          (parseFloat(totalSum.totalSales || 0) +
            parseFloat(totalSum.totalUpsale || 0))
      ) * 100 || 0;
    const totalPercentAdsSale =
      (parseFloat(totalSum.totalAdsAmount || 0) /
        parseFloat(totalSum.totalSales || 0)) *
        100 || 0;
    const totalPercentAdsNew =
      (parseFloat(totalSum.totalAdsAmount || 0) /
        parseFloat(totalSum.totalSalesNew || 0)) *
        100 || 0;

    return (
      <Card className="p-4 space-y-2" shadow="none" radius="sm">
        {/* Summary Grid */}
        <div className="grid grid-cols-2  md:grid-cols-4 gap-2">
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <span className="block text-gray-500 text-xs">ยอดขายรวม</span>
            <span className="block text-md lg:text-xl font-bold text-gray-800">
              ฿{formattedValue(totalSum.totalSales)}
            </span>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <span className="block text-gray-500 text-xs">ออเดอร์รวม</span>
            <span className="block text-md lg:text-xl font-bold text-gray-800">
              {formattedValue(totalSum.totalOrder)}
            </span>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <span className="block text-gray-500 text-xs">ยอดขายอัพเซลล์</span>
            <span className="block text-md lg:text-xl font-bold text-gray-800">
              ฿{formattedValue(totalSum.totalUpsale)}
            </span>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <span className="block text-gray-500 text-xs">ออเดอร์อัพเซลล์</span>
            <span className="block text-md lg:text-xl font-bold text-gray-800">
              {formattedValue(totalSum.totalUpsaleOrder)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2  md:grid-cols-7 gap-2">
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <span className="block text-gray-500 text-xs">ค่า Ads</span>
            <span className="block text-md lg:text-xl font-bold text-gray-800">
              ฿{formattedValue(totalSum.totalAdsAmount)}
            </span>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <span className="block text-gray-500 text-xs">% Ads รวม</span>
            <span className="block text-md lg:text-xl font-bold text-gray-800">
              {formattedValue(totalPercentAds)} %
            </span>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <span className="block text-gray-500 text-xs">% Ads แอดมิน</span>
            <span className="block text-md lg:text-xl font-bold text-gray-800">
              {formattedValue(totalPercentAdsSale)} %
            </span>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <span className="block text-gray-500 text-xs">
              % Ads ลูกค้าใหม่
            </span>
            <span className="block text-md lg:text-xl font-bold text-gray-800">
              {formattedValue(totalPercentAdsNew)} %
            </span>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <span className="block text-gray-500 text-xs">
              % ปิดการขายลูกค้าใหม่
            </span>
            <span className="block text-md lg:text-xl font-bold text-gray-800">
              {formattedValue(totalCloseRateNew)} %
            </span>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <span className="block text-gray-500 text-xs">% ปิดการขาย</span>
            <span className="block text-md lg:text-xl font-bold text-gray-800">
              {formattedValue(totalCloseRate)} %
            </span>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <span className="block text-gray-500 text-xs">% การอัพเซลล์</span>
            <span className="block text-md lg:text-xl font-bold text-gray-800">
              {formattedValue(totalCloseRateUpsale)} %
            </span>
          </div>
        </div>
      </Card>
    );
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "N/A";
    const number = Number(amount);
    const formattedNumber = number
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `฿${formattedNumber}`;
  };

  const formatCurrencyNoDollars = (amount) => {
    if (amount === undefined || amount === null) return "N/A";

    const number = Number(amount);
    const formattedNumber = number
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return `${formattedNumber}`;
  };
  console.log(combinedArray);

  return (
    <>
      {combinedArray.length > 0 && combinedArray[0].pageName && (
        <h2 className="text-md lg:text-xl font-bold text-black mb-2 text-center">
          {combinedArray[0].pageName}
        </h2>
      )}

      <div className="flex justify-center items-center space-x-2 mb-3">
        {renderIcon(saleChannelName)}
        <h3 className="text-lg font-bold text-black">
          {saleChannelName || "ไม่มีชื่อเพจ"}
        </h3>
      </div>
      <section>
        <div>{renderSummaryCell()}</div>
      </section>
      <section className="hidden lg:block">
        <Table
          aria-label="ยังไม่มีข้อมูล"
          removeWrapper
          className="max-h-[700px] overflow-y-auto scrollbar-hide p-2"
          isHeaderSticky
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                className="text-center"
                allowsSorting={column.sortable}
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
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            ))}
            {!isLoading && (
              <TableRow className="bg-slate-200 border-0 z-10 sticky bottom-0 rounded-lg">
                <TableCell
                  className="text-center font-bold"
                  style={{ borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}
                >
                  รวมทั้งหมด
                </TableCell>
                <TableCell className="text-center font-bold">
                  {formatCurrency(totalSum.totalSales)}
                </TableCell>
                <TableCell className="text-center font-bold">
                  {formatCurrency(totalSum.totalSalesNew)}
                </TableCell>
                <TableCell className="text-center font-bold">
                  {formatCurrencyNoDollars(totalSum.totalSalesOld)}
                </TableCell>
                <TableCell className="text-center font-bold">
                  {formatCurrencyNoDollars(totalSum.totalOrder)}
                </TableCell>
                <TableCell className="text-center font-bold">
                  {formatCurrencyNoDollars(totalSum.totaloldcus)}
                </TableCell>
                <TableCell className="text-center font-bold">
                  {formatCurrencyNoDollars(totalSum.totalnewcus)}
                </TableCell>
                <TableCell className="text-center font-bold">
                  {formatCurrencyNoDollars(totalSum.totalnewInbox)}
                </TableCell>
                <TableCell className="text-center font-bold">
                  {formatCurrencyNoDollars(totalSum.totaloldInbox)}
                </TableCell>
                <TableCell className="text-center font-bold">
                  {formatCurrencyNoDollars(totalSum.totalInbox)}
                </TableCell>
                <TableCell
                  className="text-center font-bold"
                  style={{
                    borderTopRightRadius: 4,
                    borderBottomRightRadius: 4,
                  }}
                >
                  {formatCurrency(totalSum.totalAdsAmount)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
    </>
  );
}

export default TableDetail;
