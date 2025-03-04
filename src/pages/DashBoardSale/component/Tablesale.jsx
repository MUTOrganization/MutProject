import React, { useState, useEffect, useMemo, useCallback } from "react";
import { URLS } from "../../../config";
import {
  Card,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Spinner,
  useDisclosure,
  Tooltip,
  Switch,
  CardBody,
  cn,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import fetchProtectedData from "../../../../utils/fetchData";
import {
  calculateVAT,
  calculateCloseRate,
  calculateGroupedData,
} from "../../../component/Calculate";
import TopSalesCards from "./TablesalesComponents/TopSalesCards";
import Detail from "./TablesalesComponents/Detail";
import { CloseIcon } from "../../../component/Icons";
function Tablesale({
  agentId,
  startDate,
  endDate,
  vatRate,
  storedCheckboxes,
  selectedPage,
}) {
  const formatCurrencyNoDollars = (amount) => {
    if (amount === undefined || amount === null) return "N/A";

    const number = Number(amount);
    const formattedNumber = number
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return `${formattedNumber}`;
  };
  const formattedValue = (value) =>
    value ? new Intl.NumberFormat().format(value) : "0";
  const [dataAds, setDataAds] = useState([]);
  const [dataSale, setDataSale] = useState([]);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "sales",
    direction: "descending",
  });
  const classNames = useMemo(
    () => ({
      td: [
        "p-2", 
        "border-b border-gray-200", 
        "text-center",

      ], 
    }),
    [],
  );



  const fetchPagestat = async () => {
    setIsLoading(true);
    try {
      const pagestatUrl = `${URLS.STATSSALE}/statUser`;
      const saleUserUrl = `${URLS.STATSSALE}/saleUser`; 

      // Execute both requests in parallel using Promise.all
      const [pagestatResponse, saleUserResponse] = await Promise.all([
        fetchProtectedData.post(pagestatUrl, {
          agent: agentId,
          startDate: startDate,
          endDate: endDate,
          CODE: Array.from(selectedPage)[0],
        }),
        fetchProtectedData.post(saleUserUrl, {
          agent: agentId,
          startDate: startDate,
          endDate: endDate,
          CODE: Array.from(selectedPage)[0],
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
    if (selectedPage !== null) {
      fetchPagestat();
    }
  }, [agentId, startDate, endDate, selectedPage]);

  const vat = vatRate ? 7 : 0;

  const adsMap = dataAds.reduce((acc, ads) => {
    if (!acc[ads.sales_name]) {
      acc[ads.sales_name] = 0;
    }
    acc[ads.sales_name] = parseFloat(ads.totalAdsAmount) || 0;
    return acc;
  }, {});

  const groupedData = calculateGroupedData(
    dataSale,
    adsMap,
    calculateCloseRate,
    calculateVAT,
    vat
  );
  console.log("dataAds",dataAds);
  console.log("dataSale",dataSale);
  
  


  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case "name":
        return <div className="text-start">{ item.sales_name}</div>;
      case "sales":
        // Add tooltip for Total Sales
        return (
          <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">ยอดขายรวม</div>
              </div>
            }
          >
            <div className="text-start ml-1 cursor-pointer">{`฿${formattedValue(parseFloat(item.sales || 0))}`}</div>
          </Tooltip>
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
      case "newcus":
        return (
          <div className="text-start ml-1">
            {formattedValue(item[columnKey])}
          </div>
        );
      case "oldcus":
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
      case "totalAdsAmount":
        return (
          <div className="text-start">{`฿${formatCurrencyNoDollars(item[columnKey])}`}</div>
        );
      case "PercentAdsNew":
        return (
          <div className="text-start">{`${formatCurrencyNoDollars(item[columnKey])} %`}</div>
        );
      case "PercentAdsSale":
        return (
          <div className="text-start">{`${formatCurrencyNoDollars(item[columnKey])} %`}</div>
        );

      case "closeTotal":
        return (
          <div className="text-start">{`${formatCurrencyNoDollars(item[columnKey])} %`}</div>
        );
      case "closeNew":
        return (
          <div className="text-start">{`${formatCurrencyNoDollars(item[columnKey])} %`}</div>
        );

      default:
        return null;
    }
  };
  const columns = [
    { name: "ชื่อ", uid: "name" },
    { name: "ยอดขายรวม", uid: "sales", sortable: true },
    { name: "ยอดขายลูกค้าใหม่", uid: "SalesNew", sortable: true },
    { name: "ยอดขายลูกค้าเก่า", uid: "SalesOld", sortable: true },
    { name: "ออเดอร์รวม", uid: "totalOrder", sortable: true },
    { name: "ออเดอร์ลูกค้าใหม่", uid: "newcus", sortable: true },
    { name: "ออเดอร์ลูกค้าเก่า", uid: "oldcus", sortable: true },
    { name: "ยอดทักรวม", uid: "totalInbox", sortable: true },
    { name: "ยอดทักใหม่", uid: "newInbox", sortable: true },
    { name: "ยอดทักเก่า", uid: "oldInbox", sortable: true },
    { name: "% แอดลูกค้าใหม่", uid: "PercentAdsNew", sortable: true }, // Unique uid
    { name: "% แอดเซลล์", uid: "PercentAdsSale", sortable: true }, // Unique uid
    { name: "% ปิดการขายรวม", uid: "closeTotal", sortable: true }, // Unique uid
    {
      name: "% ปิดการขายลูกค้าใหม่",
      uid: "closeNew",
      sortable: true,
    }, // Unique uid
    { name: "ค่าแอด", uid: "totalAdsAmount", sortable: true },
  ];
  const totalRow = useMemo(() => {
    const totalData = Object.values(groupedData).reduce(
      (totals, item) => {
        totals.sales += parseFloat(item.sales || 0);

        totals.SalesNew += parseFloat(item.SalesNew || 0);
        totals.SalesOld += parseFloat(item.SalesOld || 0);
        totals.totalOrder += parseFloat(item.totalOrder || 0);
        totals.newcus += parseFloat(item.newcus || 0);
        totals.oldcus += parseFloat(item.oldcus || 0);
        totals.newInbox += parseFloat(item.newInbox || 0);
        totals.oldInbox += parseFloat(item.oldInbox || 0);
        totals.totalInbox += parseFloat(item.totalInbox || 0);
        totals.totalAdsAmount += parseFloat(item.totalAdsAmount || 0);

        return totals;
      },
      {
        sales: 0,
        SalesNew: 0,
        SalesOld: 0,
        totalOrder: 0,
        totalInbox: 0,
        newcus: 0,
        oldcus: 0,
        totalAdsAmount: 0,
        newInbox: 0,
        oldInbox: 0,
      }
    );

    // Calculate percentages after summing totals
    const PercentAdsNew = totalData.SalesNew
      ? (totalData.totalAdsAmount / totalData.SalesNew) * 100
      : 0;
    const PercentAdsSale = totalData.sales
      ? (totalData.totalAdsAmount / totalData.sales) * 100
      : 0;

    const closeNew = calculateCloseRate(totalData.newcus, totalData.newInbox);
    const closeTotal = calculateCloseRate(
      totalData.totalOrder,
      totalData.newInbox
    );

    return {
      name: "สรุป",
      ...totalData,
      PercentAdsNew,
      PercentAdsSale,
      closeNew,
      closeTotal,
    };
  }, [Object.values(groupedData), vatRate]);

  const sortedItems = useMemo(() => {
    return [...Object.values(groupedData)].sort((a, b) => {
      let first = a[sortDescriptor.column];
      let second = b[sortDescriptor.column];

      // Handle undefined or null values gracefully
      if (first === undefined || first === null) first = "";
      if (second === undefined || second === null) second = "";

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

      // Return the result based on the sort direction
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [Object.values(groupedData), sortDescriptor]);

  const visibleColumns = columns.filter(
    (column) => storedCheckboxes?.[column.uid] !== false
  );
  const handleInfoClick = (item) => {
      setSelectedCard(item);
      setIsDetailsVisible(true);
  };

  const closeDetails = () => {
    setIsDetailsVisible(false);
    setSelectedCard(null);
  };

  return (
    <div>
      {isLoading ? (
        <Spinner
          color="primary"
          className="flex  justify-center items-center max-h-screen min-h-screen"
        />
      ) : (
        <>
          {!isDetailsVisible ? (
            <>
              <section className=" mt-4">
                <TopSalesCards
                  data={Object.values(groupedData)}
                  isLoading={isLoading}
                />
              </section>
              <section className="lg:block hidden">
                <Card shadow="none" radius="sm" className=" mt-4">
                  <Table
                    shadow="none"
                    aria-label="Example table with client side sorting"
                    className="max-h-full  min-h-full overflow-y-auto p-2"
                    classNames={classNames}
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
                        <TableRow
                          key={index}
                          onPress={() => handleInfoClick(item.sales_name)}
                          className="hover:bg-custom-menu hover:text-white cursor-pointer"
                        >
                          {visibleColumns.map((column) => (
                            <TableCell key={column.uid} align="center">
                              {renderCell(item, column.uid)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
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
                            {renderCell(totalRow, column.uid)}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </Card>
              </section>
            </>
          ) : (
            <Card className="p-5 max-h-[720px] mt-4 " shadow="none" radius="sm">
              <div className="flex justify-between items-center">
                <span className=" text-xl">รายละเอียดของ {selectedCard}</span>
                <Button
                  onPress={closeDetails}
                  className="text-black hover:text-custom-redlogin"
                  variant="like"
                >
                  <CloseIcon />
                </Button>
              </div>
              <Detail
                agentId={agentId}
                startDate={startDate}
                endDate={endDate}
                selectedCard={selectedCard}
                storedCheckboxes={storedCheckboxes}
                saleChannelName={selectedPage}
              />
            </Card>
          )}
        </>
      )}
    </div>
  );
}

export default Tablesale;
