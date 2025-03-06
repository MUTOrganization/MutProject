import React, { useState, useMemo, useCallback } from "react";
import {
  Card,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Pagination,
  Select,
  SelectItem,
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownMenu,
} from "@nextui-org/react";
import { columns, statusOptions, capitalize } from "../config";
import { ArrowDownStreamlineUltimateIcon } from "@/component/Icons";
import { formatMonthThai } from "@/component/DateUtiils";

function TableData({ currentMonth }) {
  const INITIAL_VISIBLE_COLUMNS = [
    "orderMonthyear",
    "productName",
    "orderNo",
    "agent",
    "qty",
    "totalPrice",
    "type",
  ];
  console.log(currentMonth);
  
  // state: คอลัมน์ที่โชว์
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  // state: filter ประเภทสินค้า
  const [statusFilter, setStatusFilter] = useState("all");
  // state: sort
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "age",
    direction: "ascending",
  });
  // state: จำนวนรายการต่อหน้า (default 25)
  const [rowsPerPage, setRowsPerPage] = useState("25");
  // state: หน้า
  const [currentPage, setCurrentPage] = useState(1);

  // คอลัมน์ที่ Header จะแสดง
  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  // 1) กรองข้อมูล
  const filteredItems = useMemo(() => {
    let filtered = [...currentMonth];
    // Filter ประเภทสินค้า
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filtered = filtered.filter((item) =>
        Array.from(statusFilter).includes(item.type)
      );
    }
    // เรียงตามเดือน/ปี (orderMonthyear = "YYYY-MM")
    filtered.sort((a, b) => {
      const [aY, aM] = a.orderMonthyear.split("-").map((num) => parseInt(num, 10));
      const [bY, bM] = b.orderMonthyear.split("-").map((num) => parseInt(num, 10));
      if (aY !== bY) return aY - bY;
      return aM - bM;
    });
    return filtered;
  }, [currentMonth, statusFilter]);

  // 2) สรุปจำนวน qty และ totalPrice ทั้งหมด (ไม่ใช่เฉพาะหน้า)
  const totalQty = useMemo(() => {
    return filteredItems.reduce((acc, curr) => acc + (parseInt(curr.qty) || 0), 0);
  }, [filteredItems]);

  const totalPrice = useMemo(() => {
    return filteredItems.reduce((acc, curr) => acc + (parseFloat(curr.totalPrice) || 0), 0);
  }, [filteredItems]);

  // 3) เรียงตาม sortDescriptor (เช่น sort by column "age")
  const sortedItems = useMemo(() => {
    const cloned = [...filteredItems];
    const { column, direction } = sortDescriptor;
    if (!column) return cloned;

    cloned.sort((a, b) => {
      const first = a[column];
      const second = b[column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return direction === "descending" ? -cmp : cmp;
    });
    return cloned;
  }, [sortDescriptor, filteredItems]);

  // 4) แบ่งหน้า (Pagination)
  const pageSize = parseInt(rowsPerPage, 10) || 25;
  const totalItems = sortedItems.length;
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);

  // กันไม่ให้ currentPage เกิน
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = sortedItems.slice(startIndex, endIndex);

  // ฟังก์ชัน renderCell
  const renderCell = useCallback((rowItem, columnKey) => {
    const cellValue = rowItem[columnKey];
    switch (columnKey) {
      case "orderMonthyear":
        return <div>{formatMonthThai(cellValue)}</div>;
      case "agent":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-400">
              {rowItem.agentNickName}
            </p>
          </div>
        );
      case "type":
        return (
          <Chip
            variant="flat"
            size="sm"
            color={cellValue === "สินค้าขาย" ? "success" : "primary"}
            className="text-small"
          >
            {cellValue}
          </Chip>
        );
      default:
        return cellValue;
    }
  }, []);

  // แถวสรุป (Summary Row) -> คำนวณจากข้อมูลทั้งหมด
  const renderSummaryCell = (columnKey) => {
    const formattedValue = (value) =>
      value ? new Intl.NumberFormat().format(value) : "0";
    switch (columnKey) {
      case "orderMonthyear":
        return "รวมทั้งหมด";
      case "productName":
      case "orderNo":
      case "agent":
        return "";
      case "qty":
        return formattedValue(totalQty);
      case "totalPrice":
        return formattedValue(totalPrice);
      case "type":
        return "";
      default:
        return null;
    }
  };

  // Dropdown/Select เปลี่ยน rowsPerPage
  const handleRowsPerPageChange = (key) => {
    // key อาจเป็น "25" "50" "75" "100"
    setRowsPerPage(key);
    setCurrentPage(1); // reset page
  };

  // topContent: ส่วนหัว + Selection + Filter
  const topContent = (
    <div className="flex flex-col gap-4 px-6 py-4 pb-0">
      <div className="flex justify-between gap-3 items-center">
        {/* ส่วนหัวตาราง */}
        <div className="flex flex-col space-y-1.5 ">
          <div className="font-semibold leading-none tracking-tight">
            รายการสินค้าทั้งหมด
          </div>
          <div className="text-sm text-muted-foreground">
            มีจำนวน {filteredItems.length} รายการ
          </div>
        </div>

        <div className="flex gap-3 items-center">
          {/* Filter ประเภทสินค้า */}
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                endContent={<ArrowDownStreamlineUltimateIcon className="text-small" />}
                variant="flat"
              >
                ประเภทสินค้า
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Filter by Type"
              closeOnSelect={false}
              selectedKeys={statusFilter}
              selectionMode="multiple"
              onSelectionChange={setStatusFilter}
            >
              {statusOptions.map((option) => (
                <DropdownItem key={option} className="capitalize">
                  {capitalize(option)}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {/* Visible columns */}
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                endContent={<ArrowDownStreamlineUltimateIcon className="text-small" />}
                variant="flat"
              >
                คอลัมน์
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={visibleColumns}
              selectionMode="multiple"
              onSelectionChange={setVisibleColumns}
            >
              {columns.map((column) => (
                <DropdownItem key={column.uid} className="capitalize">
                  {capitalize(column.name)}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {/* Rows per page */}
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat">
                {`Page Size: ${rowsPerPage}`}
                <ArrowDownStreamlineUltimateIcon className="text-small ml-2" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Rows per page"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={new Set([rowsPerPage])}
              onSelectionChange={(keys) => {
                handleRowsPerPageChange(Array.from(keys)[0]);
              }}
            >
              <DropdownItem key="25">25</DropdownItem>
              <DropdownItem key="50">50</DropdownItem>
              <DropdownItem key="75">75</DropdownItem>
              <DropdownItem key="100">100</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );

  // bottomContent: Pagination (ตัวอย่าง)
  const bottomContent = (
    <div className="flex justify-center items-center pb-4 pt-0">
      {totalPages > 1 && (
        <Pagination
          total={totalPages}
          page={currentPage}
          onChange={setCurrentPage}
          color="primary"
          showControls
        />
      )}
    </div>
  );

  return (
    <div className="flex-1  pt-6">
      <Card className="h-[700px] w-full overflow-hidden">
        {topContent}
        <Table
          isHeaderSticky
          isCompact
          className="h-full overflow-x-auto overflow-y-auto pt-2  w-full"
          shadow="none"
          aria-label="Example table with custom cells and pagination"
          bottomContentPlacement="outside"
          sortDescriptor={sortDescriptor}
          topContentPlacement="outside"
          onSortChange={setSortDescriptor}
          
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>

          <TableBody emptyContent={"ไม่มีข้อมูล"} items={paginatedItems}>
            {paginatedItems.map((item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            ))}
            <TableRow className="font-bold bg-slate-100 rounded-lg z-10 sticky bottom-0">
              {headerColumns.map((col, index) => (
                <TableCell
                  key={col.uid}
                  align="center"
                  className={`px-4 py-2 
                  ${index === 0 ? "rounded-l-lg" : ""}
                  ${index === headerColumns.length - 1 ? "rounded-r-lg" : ""}`}
                >
                  {renderSummaryCell(col.uid)}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
        {bottomContent}
      </Card>
    </div>
  );
}

export default TableData;
