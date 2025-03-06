import React, { useState, useEffect, useMemo, useCallback } from "react";
import { URLS } from "../../../../config";
import fetchProtectedData from "../../../../../utils/fetchData";
import {
  Card,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Tooltip,
} from "@nextui-org/react";

import { calculateCloseRate } from "../../../../component/Calculate";
function Detail({ selectedCard, agentId, startDate, endDate ,saleChannelName}) {
  console.log("saleChannelName",Array.from(saleChannelName)[0],selectedCard);
  const [dataDetail, setDataDetail] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "date",
    direction: "ascending",
  });
  const formattedValue = (value) =>
    value ? new Intl.NumberFormat().format(value) : "0";
  const formatCurrencyNoDollars = (amount) => {
    if (amount === undefined || amount === null) return "N/A";

    const number = Number(amount);
    const formattedNumber = number
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return `${formattedNumber}`;
  };
  const fetchDetailUser = async () => {
    setIsLoading(true);
    try {
      const pagestatUrl = `${URLS.STATSSALE}/Detailsale`;

      const response = await fetchProtectedData.post(pagestatUrl, {
        agent: agentId,
        startDate : `${startDate} 00:00:00`,
        endDate : `${endDate} 23:59:59`,
        createBy: selectedCard,
        saleChannelName:  Array.from(saleChannelName)[0]
      });

      setDataDetail(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCard !== null) {
      fetchDetailUser();
    }
  }, [agentId, startDate, endDate, selectedCard]);





  console.log(dataDetail);
  
  const renderCell = (item, columnKey) => {

    switch (columnKey) {
      case "date":
        return <div className="text-start">{item[columnKey]}</div>;
      case "channel":
        return <div className="text-start">{item[columnKey]}</div>;
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
            <div className="text-start ml-1 cursor-pointer">{`฿${formattedValue(item[columnKey])}`}</div>
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
    { name: "วันที่", uid: "date" ,sortable: true  },
    { name: "ชื่อ", uid: "channel" },
    { name: "ยอดขายรวม", uid: "sales", sortable: true },
    { name: "ยอดขายลูกค้าใหม่", uid: "SalesNew", sortable: true },
    { name: "ยอดขายลูกค้าเก่า", uid: "SalesOld", sortable: true },
    { name: "ออเดอร์รวม", uid: "totalOrder", sortable: true },
    { name: "ออเดอร์ลูกค้าใหม่", uid: "newcus", sortable: true },
    { name: "ออเดอร์ลูกค้าเก่า", uid: "oldcus", sortable: true },
    { name: "ยอดทักรวม", uid: "totalInbox", sortable: true },
    { name: "ยอดทักใหม่", uid: "newInbox", sortable: true },
    { name: "ยอดทักเก่า", uid: "oldInbox", sortable: true },
    { name: "% ปิดการขายรวม", uid: "closeTotal", sortable: true }, // Unique uid
    {
      name: "% ปิดการขายลูกค้าใหม่",
      uid: "closeNew",
      sortable: true,
    }, // Unique uid
  ];
  const totalRow = useMemo(() => {
    const totalData = dataDetail.reduce(
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
        newInbox: 0,
        oldInbox: 0,
      }
    );

    const closeNew = calculateCloseRate(totalData.newcus, totalData.newInbox);
    const closeTotal = calculateCloseRate(
      totalData.totalOrder,
      totalData.totalInbox
    );

    return {
      date: "รวมทั้งหมด",
      ...totalData,

      closeNew,
      closeTotal,
    };
  }, [dataDetail]);

  
  const sortedItems = useMemo(() => {
    return [...dataDetail].sort((a, b) => {
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

      // Return the dataDetail based on the sort direction
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [dataDetail, sortDescriptor]);

  return (
    <div>
      {" "}
      {isLoading ? (
        <Spinner color="primary" className="flex justify-center items-center max-h-[600px]"/>
      ) : (
        <Table
          shadow="none"
          aria-label="Example table with client side sorting"
          className="max-h-[650px] scrollbar-hide overflow-y-auto p-2"
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
          removeWrapper
          isHeaderSticky
        >
          <TableHeader columns={columns}>
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
            emptyContent={"ยังไม่มีข้อมูล"}
            loadingState={isLoading ? "loading" : undefined}
            loadingContent={<Spinner color="primary" />}
          >
            {sortedItems.map((item, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
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
              {columns.map((column) => (
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
      )}
    </div>
  );
}

export default Detail;
