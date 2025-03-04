import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Card,
  Button,
} from "@nextui-org/react";
import * as XLSX from "xlsx";
import { readFileData } from "../utils/readFileData";
import { URLS } from "@/config";
import fetchProtectedData from "../../../../utils/fetchData";
import { useAppContext } from "@/contexts/AppContext";
import { chunkArray } from "../utils/calculateNC";
import { toastError,toastSuccess,toastWarning } from "@/component/Alert";

// ฟังก์ชันแปลงเลขเดือน -> ชื่อเดือนภาษาไทย
function mapMonthNumberToName(monthNum) {
  switch (monthNum) {
    case 1:
      return "มกราคม";
    case 2:
      return "กุมภาพันธ์";
    case 3:
      return "มีนาคม";
    case 4:
      return "เมษายน";
    case 5:
      return "พฤษภาคม";
    case 6:
      return "มิถุนายน";
    case 7:
      return "กรกฎาคม";
    case 8:
      return "สิงหาคม";
    case 9:
      return "กันยายน";
    case 10:
      return "ตุลาคม";
    case 11:
      return "พฤศจิกายน";
    case 12:
      return "ธันวาคม";
    default:
      return String(monthNum);
  }
}

// ใน Excel ไม่มี prodName มีแค่ code, agent, qty, monthyear
// เราจะสร้าง "prodName" ในตารางด้วยการ map code -> productName
const colMap = [
  { oldName: "รหัสสินค้า", newName: "code", uid: "code" },
  { oldName: "ชื่อตัวเเทน", newName: "agent", uid: "agent" },
  { oldName: "จำนวนกล่อง", newName: "qty", uid: "qty", numeric: true },
  { oldName: "ปีเเละเดือน", newName: "monthyear", uid: "monthyear" },
];

function ImportExcel({ setSelectedKeys }) {
  const { currentUser: user } = useAppContext();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);         // data ที่จะแสดงในตาราง
  const [agentList, setAgentList] = useState([]);
  const [products, setProducts] = useState([]); // จาก API getProducts

  // Sorting descriptor
  const [sortDescriptor, setSortDescriptor] = useState({
    column: null,
    direction: "ascending",
  });

  const fileInputRef = useRef(null);

  // เรียก API agent + products
  const fetchDataName = async () => {
    try {
      const urlUserSale = `${URLS.DASHBOARDNIGHTCORE}/getAgentName`;
      const listPageResponse = await fetchProtectedData.get(urlUserSale);
      setAgentList(listPageResponse.data || []);
    } catch (error) {
      toastError("เกิดข้อผิดพลาดในการดึงชื่อตัวเเทน")
      console.error("Error fetching data:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetchProtectedData.get(
        `${URLS.DASHBOARDNIGHTCORE}/getProducts`
      );
      // สมมติ fields: { id, orderNo, productName, price, type }
      setProducts(response.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      toastError("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า");
    }
  };

  useEffect(() => {
    fetchDataName();
    fetchProducts();
  }, []);

  // แปลง "YYYY-MM" -> "มกราคม YYYY"
  function renderMonthYear(yyyymm) {
    if (!yyyymm || typeof yyyymm !== "string") return yyyymm;
    const [yyyy, mm] = yyyymm.split("-");
    const monthInt = parseInt(mm, 10);
    const monthName = mapMonthNumberToName(monthInt);
    return `${monthName} ${yyyy}`;
  }

  // ปุ่ม Import
  const handleSingleImportButton = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // เมื่อเลือกไฟล์
  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const aoa = await readFileData(file);

      // สร้างตาราง
      const { finalColumns, finalRows } = transformToTableData(aoa, products);
      setColumns(finalColumns);
      setRows(finalRows);
    } catch (error) {
      console.error(error);
      toastError("เกิดข้อผิดพลาดในการอ่านไฟล์");
    }
  };

  // Remove file
  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setColumns([]);
    setRows([]);
  };

  // Template
  const handleDownloadTemplate = () => {
    const headerRow = colMap.map((c) => c.oldName); // ["code", "Agent", "จำนวน", "MonthYear"]
    const templateData = [headerRow];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "template.xlsx");
  };

  // -------------
  // transform
  // -------------
  function transformToTableData(aoa, productList) {
    if (!aoa || aoa.length < 2) return { finalColumns: [], finalRows: [] };

    // กำหนด columns ในตาราง
    let finalColumns = [
      { uid: "code", name: "Code", sortable: true },
      { uid: "prodName", name: "Prod.Name", sortable: true }, // map จาก code -> productName
      { uid: "agent", name: "Agent", sortable: true },
      { uid: "qty", name: "จำนวน", sortable: true },
      { uid: "type", name: "ประเภทสินค้า", sortable: false },
      { uid: "monthyear", name: "เดือน ปี", sortable: false },
    ];

    // Header Excel
    const header = aoa[0];
    const dataRows = aoa.slice(1);

    // indexMap
    const indexMap = {};
    colMap.forEach((cm) => {
      indexMap[cm.uid] = header.indexOf(cm.oldName);
    });

    let finalRows = dataRows
      .map((rowArr, rowIndex) => {
        const isEmpty = rowArr.every(
          (cell) => String(cell || "").trim() === ""
        );
        if (isEmpty) return null;

        const rowData = { id: `row-${rowIndex}` };
        // 1) อ่านค่า Excel
        colMap.forEach((cm) => {
          const colIdx = indexMap[cm.uid];
          let val = "";
          if (colIdx >= 0 && colIdx < rowArr.length) {
            val = rowArr[colIdx];
            if (cm.numeric) {
              const parsed = parseFloat(val);
              val = isNaN(parsed) ? 0 : parsed;
            }
          }
          rowData[cm.uid] = val;
        });

        return rowData;
      })
      .filter(Boolean);

    // 2) carryDownMerge ถ้าต้องการ
    finalRows = carryDownMerge(finalRows, {
      fields: ["code", "monthyear"],
      requireField: "agent",
    });

    // 3) จาก code -> หา productName + type
    finalRows = finalRows.map((rowData) => {
      const codeLower = String(rowData["code"] || "").trim().toLowerCase();
      // หาใน productList (มี orderNo = code ?)
      const found = productList.find(
        (p) =>
          String(p.orderNo || "").trim().toLowerCase() === codeLower
      );

      rowData["prodName"] = found ? found.productName : "ไม่พบสินค้า";
      // สมมติ price = 0 => สินค้าแถม, >0 => สินค้าขาย
      if (found) {
        rowData["type"] = parseFloat(found.price) === 0 ? "สินค้าแถม" : "สินค้าขาย";
      } else {
        rowData["type"] = "ไม่มีสินค้าในคลัง!!";
      }

      return rowData;
    });

    return { finalColumns, finalRows };
  }

  // carryDown
  function carryDownMerge(rowArray, { fields, requireField }) {
    for (let i = 1; i < rowArray.length; i++) {
      const current = rowArray[i];
      const previous = rowArray[i - 1];
      if (String(current[requireField] || "").trim() !== "") {
        fields.forEach((f) => {
          if (String(current[f] || "").trim() === "") {
            current[f] = previous[f];
          }
        });
      }
    }
    return rowArray;
  }

  // -------------
  // บันทึกข้อมูล (Bulk Insert by chunk)
  // -------------
  const handleSave = async () => {
    if (rows.length === 0) {
      toastError("ยังไม่มีข้อมูลสำหรับบันทึก");
      return;
    }

    const dataToSave = rows.map(({ id, ...rest }) => ({
      ...rest,
      user_created_at: user?.userName || "",
    }));

    const chunkSize = 200;
    const chunks = chunkArray(dataToSave, chunkSize);

    try {
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const response = await fetchProtectedData.post(
          `${URLS.DASHBOARDNIGHTCORE}/addFileImportPurchase`,
          chunk
        );
        if (response.status !== 200 || !response.data.success) {
          throw new Error(
            "ไม่สามารถบันทึก chunk ที่ " +
              (i + 1) +
              ": " +
              response.data.message
          );
        }
      }

      toastSuccess("บันทึกข้อมูลทั้งหมดสำเร็จแล้ว");
      setSelectedKeys(new Set(["แดชบอร์ด"]));
    } catch (error) {
      console.error("Error calling API:", error);
      toastError("เกิดข้อผิดพลาดบางอย่างในการบันทึกข้อมูล");
    }
  };

  // -------------
  // Sorting
  // -------------
  const sortedRows = useMemo(() => {
    if (!sortDescriptor.column) return rows;
    const cloned = [...rows];
    cloned.sort((a, b) => {
      let first = a[sortDescriptor.column];
      let second = b[sortDescriptor.column];
      const fnum = parseFloat(first);
      const snum = parseFloat(second);
      if (!isNaN(fnum) && !isNaN(snum)) {
        return sortDescriptor.direction === "descending" ? snum - fnum : fnum - snum;
      } else {
        first = String(first).toLowerCase();
        second = String(second).toLowerCase();
        if (first < second) return sortDescriptor.direction === "descending" ? 1 : -1;
        if (first > second) return sortDescriptor.direction === "descending" ? -1 : 1;
        return 0;
      }
    });
    return cloned;
  }, [rows, sortDescriptor]);

  // เพิ่ม "agentNickName" ไว้ถัดจาก "agent"
  const columnsWithNick = useMemo(() => {
    if (columns.length === 0) return [];
    const extraCol = { uid: "agentNickName", name: "ชื่อเล่น (Agent)", sortable: false };
    const agentIndex = columns.findIndex((c) => c.uid === "agent");
    const newCols = [...columns];
    newCols.splice(agentIndex + 1, 0, extraCol);
    return newCols;
  }, [columns]);

  return (
    <div className="flex-1 space-y-4 pt-4">
      <Card className="flex flex-col gap-6 items-center justify-center p-4 w-full">
        <section className="flex items-center gap-4 w-full">
          <Button variant="bordered" color="primary" onPress={handleSingleImportButton}>
            Import File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            style={{ display: "none" }}
            onChange={handleFileSelected}
          />

          {columnsWithNick.length > 0 && (
            <Button onPress={handleRemoveFile} variant="bordered" color="danger">
              Remove
            </Button>
          )}

          <Button onPress={handleDownloadTemplate} variant="bordered" color="primary">
            Download Template
          </Button>

          <Button onPress={handleSave} variant="bordered" color="success">
            บันทึก
          </Button>
        </section>

        {/* ตาราง */}
        {columnsWithNick.length > 0 && sortedRows.length > 0 ? (
          <div className="w-full">
            <Table
              shadow="none"
              aria-label="Excel Data Table"
              sortDescriptor={sortDescriptor}
              onSortChange={setSortDescriptor}
              isHeaderSticky
              className="h-[600px]"
              bordered
            >
              <TableHeader columns={columnsWithNick}>
                {(column) => {
                  const colIndex = columnsWithNick.findIndex((c) => c.uid === column.uid);
                  const isFirst = colIndex === 0;
                  return (
                    <TableColumn
                      key={column.uid}
                      allowsSorting={column.sortable}
                      css={{
                        position: isFirst ? "sticky" : "static",
                        left: isFirst ? 0 : "auto",
                        zIndex: isFirst ? 999 : "auto",
                        backgroundColor: "white",
                      }}
                    >
                      {column.name}
                    </TableColumn>
                  );
                }}
              </TableHeader>
              <TableBody items={sortedRows}>
                {(item) => (
                  <TableRow key={item.id}>
                    {(columnKey) => {
                      const colIndex = columnsWithNick.findIndex(
                        (c) => c.uid === columnKey
                      );
                      const isFirst = colIndex === 0;

                      // monthyear => แปลง "2024-01" -> "มกราคม 2024"
                      if (columnKey === "monthyear") {
                        const displayText = renderMonthYear(item[columnKey]);
                        return (
                          <TableCell
                            key={columnKey}
                            css={{
                              position: isFirst ? "sticky" : "static",
                              left: isFirst ? 0 : "auto",
                              backgroundColor: "white",
                              zIndex: isFirst ? 998 : "auto",
                            }}
                          >
                            {displayText}
                          </TableCell>
                        );
                      }

                      // agentNickName
                      if (columnKey === "agentNickName") {
                        const found = agentList.find(
                          (ag) => ag.agent_id === item.agent
                        );
                        const nick = found ? found.nick_name : "N/A";
                        return (
                          <TableCell
                            key={columnKey}
                            css={{
                              position: isFirst ? "sticky" : "static",
                              left: isFirst ? 0 : "auto",
                              backgroundColor: "white",
                              zIndex: isFirst ? 998 : "auto",
                            }}
                          >
                            {nick}
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell
                          key={columnKey}
                          css={{
                            position: isFirst ? "sticky" : "static",
                            left: isFirst ? 0 : "auto",
                            backgroundColor: "white",
                            zIndex: isFirst ? 998 : "auto",
                          }}
                        >
                          {item[columnKey]}
                        </TableCell>
                      );
                    }}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center h-[600px]">
            กรุณา Import ไฟล์ที่มีคอลัมน์ "code" (เชื่อมกับสินค้าในคลัง) เพื่อทดสอบ
          </div>
        )}
      </Card>
    </div>
  );
}

export default ImportExcel;
