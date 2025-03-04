import React, { useState, useEffect } from "react";
import { URLS } from "../../../config";
import {
  convertToThaiTimeFetch,
  formatDateThai,
} from "../../../component/DateUtiils";
import { InformationIcon } from "../../../component/Icons";
import TableDetail from "./TableDetail";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Card,
  Spinner,
} from "@nextui-org/react";
import { calculateVAT, calculateCloseRate } from "../../../component/Calculate";
import { CloseIcon } from "../../../component/Icons";
import fetchProtectedData from "../../../../utils/fetchData";
const TableDashboard = ({
  storedCheckboxes,
  daterange,
  agentId,
  filteredData
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pagestat, setPagestat] = useState([]);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "saleChannelName",
    direction: "ascending",
  });


  const customSort = (data, columnKey, direction) => {
    return data.sort((a, b) => {
      let first = a[columnKey];
      let second = b[columnKey];
      const getSortValue = (saleChannelName) => {
        if (!saleChannelName) return "5";
        if (saleChannelName.startsWith("FB000")) return `1${saleChannelName}`;
        if (saleChannelName.startsWith("LA000")) return `2${saleChannelName}`;
        return `3${saleChannelName}`;
      };

      if (columnKey === "saleChannelName") {
        first = getSortValue(a.saleChannelName);
        second = getSortValue(b.saleChannelName);
      } else if (columnKey === "closeNew") {
        first = calculateCloseRate(
          parseFloat(a.newcus || 0),
          parseFloat(a.newInbox || 0)
        );
        second = calculateCloseRate(
          parseFloat(b.newcus || 0),
          parseFloat(b.newInbox || 0)
        );
      } else if (columnKey === "closeTotal") {
        first = calculateCloseRate(
          parseFloat(a.totalorder || 0),
          parseFloat(a.totalInbox || 0)
        );
        second = calculateCloseRate(
          parseFloat(b.totalorder || 0),
          parseFloat(b.totalInbox || 0)
        );
      } else if (columnKey === "closeUpsale") {
        first = calculateCloseRate(
          parseFloat(a.upsaleOrder || 0),
          parseFloat(a.totalorder || 0)
        );
        second = calculateCloseRate(
          parseFloat(b.upsaleOrder || 0),
          parseFloat(b.totalorder || 0)
        );
      } else if (columnKey === "PercentAdsTotal") {
        first =
          parseFloat(
            calculateVAT(a.ads || 0, vatRate) /
              (parseFloat(a.sales || 0) + parseFloat(a.upsales || 0))
          ) * 100 || 0;
        second =
          parseFloat(
            calculateVAT(b.ads || 0, vatRate) /
              (parseFloat(b.sales || 0) + parseFloat(b.upsales || 0))
          ) * 100 || 0;
      } else if (columnKey === "PercentAdsSale") {
        first =
          parseFloat(
            calculateVAT(a.ads || 0, vatRate) / parseFloat(a.sales || 0)
          ) * 100 || 0;
        second =
          parseFloat(
            calculateVAT(b.ads || 0, vatRate) / parseFloat(b.sales || 0)
          ) * 100 || 0;
      } else if (columnKey === "PercentAdsNew") {
        first =
          parseFloat(
            calculateVAT(a.ads || 0, vatRate) / parseFloat(a.SalesNew || 0)
          ) * 100 || 0;
        second =
          parseFloat(
            calculateVAT(b.ads || 0, vatRate) / parseFloat(b.SalesNew || 0)
          ) * 100 || 0;
      }

      if (!isNaN(first) && !isNaN(second)) {
        first = parseFloat(first);
        second = parseFloat(second);
      }

      let cmp = first < second ? -1 : 1;
      if (direction === "descending") {
        cmp *= -1;
      }

      return cmp;
    });
  };

  // const fetchPagestat = async () => {
  //   setIsLoading(true);
  //   try {
  //     const url = `${URLS.STATSPLATFORM}/Pagestat`;
  //     const response = await fetchProtectedData.post(url, {
  //       agent: agentId,
  //       startDate: daterange.start,
  //       endDate: daterange.end,
  //     });

  //     const result = response.data;


  //     const sortedResult = customSort(
  //       result,
  //       sortDescriptor.column,
  //       sortDescriptor.direction
  //     );
  //     setPagestat(sortedResult);
  //   } catch (error) {
  //     console.error("Error fetching sales data:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  

console.log(pagestat);

  const vatRate = storedCheckboxes.vat ? 7 : 0;

  useEffect(() => {
    setPagestat(filteredData)
  }, [agentId, daterange]);

  const handleSortChange = (columnKey) => {
    const direction =
      sortDescriptor.direction === "ascending" ? "descending" : "ascending";
    setSortDescriptor({ column: columnKey, direction });

    const sortedResult = customSort(pagestat, columnKey, direction);
    setPagestat(sortedResult);
  };

  const handleInfoClick = (item) => {
    setSelectedCard(item);
    setIsDetailsVisible(true);
  };

  const closeDetails = () => {
    setIsDetailsVisible(false);
    setSelectedCard(null);
  };

  const totalSalesNew = pagestat.reduce(
    (total, item) => total + parseFloat(item.SalesNew || 0),
    0
  );
  const totalSalesOld = pagestat.reduce(
    (total, item) => total + parseFloat(item.SalesOld || 0),
    0
  );
  const totalSales = pagestat.reduce(
    (total, item) => total + parseFloat(item.sales || 0),
    0
  );
  const totalNewCus = pagestat.reduce(
    (total, item) => total + parseFloat(item.newcus || 0),
    0
  );
  const totalOldCus = pagestat.reduce(
    (total, item) => total + parseFloat(item.oldcus || 0),
    0
  );
  const totalOrders = pagestat.reduce(
    (total, item) => total + parseFloat(item.totalorder || 0),
    0
  );
  const totalNewInbox = pagestat.reduce(
    (total, item) => total + parseFloat(item.newInbox || 0),
    0
  );
  const totalOldInbox = pagestat.reduce(
    (total, item) => total + parseFloat(item.oldInbox || 0),
    0
  );
  const totalSumInbox = pagestat.reduce(
    (total, item) => total + parseFloat(item.totalInbox || 0),
    0
  );

  const totalUpsale = pagestat.reduce(
    (total, item) => total + parseFloat(item.upsales || 0),
    0
  );

  const totalUpsaleOrder = pagestat.reduce(
    (total, item) => total + parseFloat(item.upsaleOrder || 0),
    0
  );
  const totalAds = pagestat.reduce(
    (total, item) => total + calculateVAT(parseFloat(item.ads || 0), vatRate),
    0
  );

  
  const totalCloseRateNew = calculateCloseRate(totalNewCus, totalNewInbox);
  const totalCloseRate = calculateCloseRate(totalOrders, totalSumInbox);
  const totalCloseRateUpsale = calculateCloseRate(
    totalUpsaleOrder,
    totalOrders
  );

  const totalPercentAds =
    parseFloat(
      parseFloat(totalAds || 0) /
        (parseFloat(totalSales || 0) + parseFloat(totalUpsale || 0))
    ) * 100 || 0;
  const totalPercentAdsSale =
    parseFloat(totalAds / parseFloat(totalSales || 0)) * 100 || 0;
  const totalPercentAdsNew =
    parseFloat(totalAds / parseFloat(totalSalesNew || 0)) * 100 || 0;

  const columns = [
    { uid: "saleChannelName", name: "ช่องทางการขาย" },
    { uid: "SalesNew", name: "ยอดขายใหม่" },
    { uid: "SalesOld", name: "ยอดขายเก่า" },
    { uid: "sales", name: "ยอดขายรวม" },
    { uid: "upsales", name: "ยอดขายอัพเซลล์" },
    { uid: "newcus", name: "ออเดอร์ลูกค้าใหม่" },
    { uid: "oldcus", name: "ออเดอร์ลูกค้าเก่า" },
    { uid: "totalorder", name: "ออเดอร์ลูกค้ารวม" },
    { uid: "upsaleOrder", name: "ออเดอร์อัพเซลล์" },
    { uid: "newInbox", name: "ยอดทักใหม่" },
    { uid: "oldInbox", name: "ยอดทักเก่า" },
    { uid: "totalInbox", name: "ยอดทักรวม" },
    { uid: "ads", name: "Ads" },
    { uid: "closeNew", name: "% ปิดการขายลูกค้าใหม่" },
    { uid: "closeTotal", name: "% ปิดการขายรวม" },
    { uid: "closeUpsale", name: "% การอัพเซลล์" },
    { uid: "PercentAdsTotal", name: "% ADS รวม" },
    { uid: "PercentAdsSale", name: "% ADS ของ Admin" },
    { uid: "PercentAdsNew", name: "% ADS ลูกค้าใหม่" },
  ];
  const visibleColumns = columns.filter(
    (column) => storedCheckboxes[column.uid] !== false
  );

  const renderCell = (item, columnKey) => {
    const formattedValue = (value) =>
      value ? new Intl.NumberFormat().format(value) : "0";

    const costAds = calculateVAT(item.ads || 0, vatRate);
    const PercentAdsTotal =
      parseFloat(
        costAds / (parseFloat(item.sales || 0) + parseFloat(item.upsales || 0))
      ) * 100 || 0;
    const PercentAdsSale =
      parseFloat(costAds / parseFloat(item.sales || 0)) * 100 || 0;
    const PercentAdsNew =
      parseFloat(costAds / parseFloat(item.SalesNew || 0)) * 100 || 0;

    switch (columnKey) {
      case "saleChannelName":
        return item.saleChannelName || "ไม่พบเพจ";
      case "SalesNew":
        return formattedValue(item[columnKey]);
      case "SalesOld":
        return formattedValue(item[columnKey]);
      case "sales":
        return formattedValue(item[columnKey]);
      case "ads":
        return `฿${formattedValue(costAds.toFixed(2))}`;
      case "newcus":
        return formattedValue(item[columnKey]);
      case "oldcus":
        return formattedValue(item[columnKey]);
      case "totalorder":
        return formattedValue(item[columnKey]);
      case "newInbox":
        return formattedValue(item[columnKey]);
      case "oldInbox":
        return formattedValue(item[columnKey]);
      case "upsales":
        return formattedValue(item[columnKey]);
      case "upsaleOrder":
        return formattedValue(item[columnKey]);
      case "closeNew":
        return `${calculateCloseRate(parseFloat(item.newcus || 0), parseFloat(item.newInbox || 0))} %`;
      case "closeTotal":
        return `${calculateCloseRate(parseFloat(item.totalorder || 0), parseFloat(item.totalInbox || 0))} %`;
      case "closeUpsale":
        return `${calculateCloseRate(parseFloat(item.upsaleOrder || 0), parseFloat(item.totalorder || 0))} %`;
      case "PercentAdsTotal":
        return `${PercentAdsTotal.toFixed(2)} %`;
      case "PercentAdsSale":
        return `${PercentAdsSale.toFixed(2)} %`;
      case "PercentAdsNew":
        return `${PercentAdsNew.toFixed(2)} %`;
      case "totalInbox":
        return formattedValue(item[columnKey]);
      default:
        return null;
    }
  };

  const renderSummaryCell = (columnKey) => {
    const formattedValue = (value) =>
      value ? new Intl.NumberFormat().format(value) : "0";
    switch (columnKey) {
      case "saleChannelName":
        return "รวมทั้งหมด";
      case "SalesNew":
        return `฿${formattedValue(totalSalesNew)}`;
      case "SalesOld":
        return `฿${formattedValue(totalSalesOld)}`;
      case "sales":
        return `฿${formattedValue(totalSales)}`;
      case "newcus":
        return formattedValue(totalNewCus);
      case "oldcus":
        return formattedValue(totalOldCus);
      case "totalorder":
        return formattedValue(totalOrders);
      case "newInbox":
        return formattedValue(totalNewInbox);
      case "oldInbox":
        return formattedValue(totalOldInbox);
      case "totalInbox":
        return formattedValue(totalSumInbox);
      case "upsales":
        return formattedValue(totalUpsale);
      case "upsaleOrder":
        return formattedValue(totalUpsaleOrder);
      case "closeNew":
        return `${formattedValue(totalCloseRateNew)} %`;
      case "closeTotal":
        return `${formattedValue(totalCloseRate)} %`;
      case "closeUpsale":
        return `${formattedValue(totalCloseRateUpsale)} %`;
      case "ads":
        return `฿${formattedValue(totalAds.toFixed(2))}`;
      case "PercentAdsTotal":
        return `${totalPercentAds.toFixed(2)} %`;
      case "PercentAdsSale":
        return `${totalPercentAdsSale.toFixed(2)} %`;
      case "PercentAdsNew":
        return `${totalPercentAdsNew.toFixed(2)} %`;
      default:
        return null;
    }
  };

  return (
    <>
      <section
        className={`${
          isDetailsVisible ? "translate-x-full hidden" : "translate-x-0 block"
        }`}
      >
        <Card
          shadow="none"
          radius="sm"
          className="h-[720px] w-full overflow-hidden"
        >
          <Table
            aria-label="Sales Data Table"
            className="h-full overflow-x-auto overflow-y-auto  p-2 w-full"
            removeWrapper
            isHeaderSticky
          >
            <TableHeader columns={visibleColumns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  onClick={() => handleSortChange(column.uid)}
 
                  className={`cursor-pointer ${
                    sortDescriptor.column === column.uid
                      ? "text-blue-500 font-bold"
                      : ""
                  }`}
                >
                  {column.name}
                  {sortDescriptor.column === column.uid && (
                    <span>
                      {sortDescriptor.direction === "ascending" ? "↓" : "↑"}
                    </span>
                  )}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={pagestat}
              emptyContent={"ยังไม่มีข้อมูล"}
              loadingState={isLoading ? "loading" : undefined}
              loadingContent={<Spinner color="primary" />}
            >
              {pagestat.map((item) => (
                <TableRow
                  key={item.saleChannelName}
                  onClick={() => handleInfoClick(item)}
                  className="hover:bg-custom-menu hover:text-white cursor-pointer"
                >
                  {visibleColumns.map((column) => (
                    <TableCell key={column.uid} align="center">
                      {renderCell(item, column.uid)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {/* Summary row for totals */}
              <TableRow className="font-bold bg-slate-100 rounded-lg z-10 sticky bottom-0">
                {visibleColumns.map((column, index) => (
                  <TableCell
                    key={column.uid}
                    align="center"
                    className={`px-4 py-2 ${
                      index === 0 ? "rounded-l-lg" : ""
                    } ${
                      index === visibleColumns.length - 1 ? "rounded-r-lg" : ""
                    }`}
                  >
                    {renderSummaryCell(column.uid)}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </section>

    
        {isDetailsVisible && selectedCard && (
          <Card className="p-5 h-full" shadow="none" radius="sm">
            <div className="flex justify-end items-center">
              <Button
                onPress={closeDetails}
                className="text-black hover:text-custom-redlogin"
                variant="like"
              >
                <CloseIcon />
              </Button>
            </div>

            <TableDetail
              saleChannelName={selectedCard.saleChannelName}
              totalUpsale={totalUpsale}
              totalUpsaleOrder={totalUpsaleOrder}
              agentId={agentId}
              startDate={daterange.start}
              endDate={daterange.end}
              vatRate={vatRate}
              totalAds={totalAds}
              totalCloseRateUpsale={totalCloseRateUpsale}
            />
          </Card>
        )}
    
    </>
  );
};

export default TableDashboard;
