import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Pagination,
  Input,
  Chip,
  CardFooter,
} from "@nextui-org/react";
import { PlusIcon, DeleteIcon } from "@/component/Icons";
import fetchProtectedData from "../../../../../utils/fetchData";
import { URLS } from "@/config";
import { toastError,toastSuccess,toastWarning } from "@/component/Alert";

const columns = [
  { uid: "type", name: "ประเภทสินค้า", sortable: true },
  { uid: "orderNo", name: "รหัสสินค้า", sortable: true },
  { uid: "name", name: "ชื่อสินค้า", sortable: true },
  { uid: "price", name: "ราคา", sortable: true },
  { uid: "action", name: "" },
];

function SettingPriceProd({ onClose, user }) {
  const [products, setProducts] = useState([]);
  const [removedIds, setRemovedIds] = useState([]);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "name",
    direction: "ascending",
  });

  const [newOrderNo, setNewOrderNo] = useState("");
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = async () => {
    try {
      const response = await fetchProtectedData.get(
        `${URLS.DASHBOARDNIGHTCORE}/getProducts`
      );
      const data = response.data || [];
      const formatted = data.map((item) => ({
        id: item.id,
        type: parseFloat(item.price) === 0 ? "สินค้าแถม" : "สินค้าขาย",
        orderNo: item.orderNo,
        name: item.productName,
        price: item.price,
        isNew: false,
      }));
      setProducts(formatted);
      setRemovedIds([]);
    } catch (err) {
      console.error("Error fetching products:", err);
      toastError("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const sortedRows = useMemo(() => {
    if (!sortDescriptor.column) return products;
    const cloned = [...products];
    cloned.sort((a, b) => {
      let first = a[sortDescriptor.column];
      let second = b[sortDescriptor.column];
      const fnum = parseFloat(first);
      const snum = parseFloat(second);
      if (!isNaN(fnum) && !isNaN(snum)) {
        return sortDescriptor.direction === "descending"
          ? snum - fnum
          : fnum - snum;
      } else {
        first = String(first).toLowerCase();
        second = String(second).toLowerCase();
        if (first < second)
          return sortDescriptor.direction === "descending" ? 1 : -1;
        if (first > second)
          return sortDescriptor.direction === "descending" ? -1 : 1;
        return 0;
      }
    });
    return cloned;
  }, [products, sortDescriptor]);

  // Pagination
  const totalItems = sortedRows.length;
  const totalPages = Math.max(Math.ceil(totalItems / itemsPerPage), 1);
  if (currentPage > totalPages) setCurrentPage(totalPages);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  let currentPageRows = sortedRows.slice(startIndex, endIndex);

  // แถวเพิ่มสินค้า
  if (currentPage === totalPages) {
    currentPageRows = [...currentPageRows, { id: "newRow", isNew: true }];
  }

  const handleAddNewRow = () => {
    const nameTrim = newName.trim();
    const orderNoTrim = newOrderNo.trim();
    if (!orderNoTrim) {
      toastWarning("กรุณากรอกรหัสสินค้า");
      return;
    }
    if (!nameTrim) {
      toastWarning("กรุณากรอกชื่อสินค้า");
      return;
    }

    const isDuplicateName = products.some(
      (p) => p.name.toLowerCase() === nameTrim.toLowerCase()
    );
    const isDuplicateOrderNo = products.some(
      (p) => p.orderNo.toLowerCase() === orderNoTrim.toLowerCase()
    );
    if (isDuplicateOrderNo) {
      toastWarning("รหัสสินค้าซ้ำ กรุณาตรวจสอบอีกครั้ง");
      return;
    }
    if (isDuplicateName) {
      toastWarning("ชื่อสินค้าซ้ำ กรุณาตรวจสอบอีกครั้ง");
      return;
    }

    const priceNum = parseFloat(newPrice) || 0;
    const typeValue = priceNum === 0 ? "สินค้าแถม" : "สินค้าขาย";

    const newObj = {
      id: Date.now(),
      type: typeValue,
      orderNo: orderNoTrim,
      name: nameTrim,
      price: priceNum,
      isNew: true,
    };
    setProducts((prev) => [...prev, newObj]);
    toastSuccess("เพิ่มสินค้า");
    setNewOrderNo("");
    setNewName("");
    setNewPrice("");
  };

  const removeProduct = (id) => {
    const found = products.find((p) => p.id === id);
    if (found && !found.isNew) {
      setRemovedIds((prev) => [...prev, id]);
    }
    setProducts((prev) => prev.filter((item) => item.id !== id));
    toastSuccess("ลบสินค้า");
  };

  const handleChange = (id, field, value) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        let updated = { ...item, [field]: value };
        if (field === "price") {
          const numVal = parseFloat(value) || 0;
          updated.type = numVal === 0 ? "สินค้าแถม" : "สินค้าขาย";
        }
        return updated;
      })
    );
  };

  const handleSaveClick = async () => {
    try {
      const nameSet = new Set();
      const orderNoSet = new Set();

      for (const item of products) {
        const lowerName = String(item.name).trim().toLowerCase();
        const lowerOrderNo = String(item.orderNo).trim().toLowerCase();
        if (nameSet.has(lowerName)) {
          toastWarning("พบชื่อสินค้าซ้ำ กรุณาตรวจสอบก่อนบันทึก");
          return;
        }
        if (orderNoSet.has(lowerOrderNo)) {
          toastWarning("พบรหัสสินค้าซ้ำ กรุณาตรวจสอบก่อนบันทึก");
          return;
        }
        nameSet.add(lowerName);
        orderNoSet.add(lowerOrderNo);
      }

      // Delete
      for (const rid of removedIds) {
        await fetchProtectedData.delete(
          `${URLS.DASHBOARDNIGHTCORE}/deleteProduct/${rid}`
        );
      }
      // Post/Put
      for (const item of products) {
        if (item.isNew && item.id !== "newRow") {
          await fetchProtectedData.post(
            `${URLS.DASHBOARDNIGHTCORE}/createProduct`,
            {
              orderNo: item.orderNo,
              productName: item.name,
              price: item.price,
              user_created_at: user,
            }
          );
        } else if (!item.isNew && item.id !== "newRow") {
          await fetchProtectedData.put(
            `${URLS.DASHBOARDNIGHTCORE}/updateProduct/${item.id}`,
            {
              orderNo: item.orderNo,
              productName: item.name,
              price: item.price,
              user_created_at: user,
            }
          );
        }
      }
      await fetchProducts();
      toastSuccess("บันทึกข้อมูลสำเร็จ");
      onClose();
    } catch (err) {
      console.error(err);
      toastError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <Card
      // 1) กำหนดความสูง card
      className="shadow-none h-[650px]"
    >
      {/* 2) ส่วนที่สกรอลล์ในตาราง */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <Table
          aria-label="Product Price Table"
          shadow="none"
          containerCss={{
            minHeight: "100%",
          }}
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
          isHeaderSticky
          bordered
          sticked
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                allowsSorting={column.sortable}
                width={column.uid === "action" ? "130px" : "auto"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={currentPageRows}>
            {(item) => {
              // แถว newRow
              if (item.id === "newRow" && item.isNew) {
                return (
                  <TableRow key="newRow">
                    {(columnKey) => {
                      if (columnKey === "orderNo") {
                        return (
                          <TableCell>
                            <Input
                              type="text"
                              value={newOrderNo}
                              onChange={(e) => setNewOrderNo(e.target.value)}
                              placeholder="รหัสสินค้าใหม่..."
                              className="max-w-full"
                              variant="bordered"
                            />
                          </TableCell>
                        );
                      } else if (columnKey === "name") {
                        return (
                          <TableCell>
                            <Input
                              type="text"
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              placeholder="ชื่อสินค้าใหม่..."
                              className="max-w-full"
                              variant="bordered"
                            />
                          </TableCell>
                        );
                      } else if (columnKey === "price") {
                        return (
                          <TableCell>
                            <Input
                              type="number"
                              value={newPrice}
                              onChange={(e) => setNewPrice(e.target.value)}
                              placeholder="ราคา..."
                              className="max-w-full"
                              variant="bordered"
                            />
                          </TableCell>
                        );
                      } else if (columnKey === "type") {
                        return <TableCell>-</TableCell>;
                      } else if (columnKey === "action") {
                        return (
                          <TableCell>
                            <Button
                              size="sm"
                              onPress={handleAddNewRow}
                              variant="flat"
                              color="primary"
                              isIconOnly
                            >
                              <PlusIcon />
                            </Button>
                          </TableCell>
                        );
                      } else {
                        return <TableCell />;
                      }
                    }}
                  </TableRow>
                );
              }

              // แถวปกติ
              return (
                <TableRow key={item.id}>
                  {(columnKey) => {
                    if (columnKey === "type") {
                      return (
                        <TableCell>
                          <Chip
                            variant="flat"
                            size="sm"
                            color={
                              item.type === "สินค้าแถม" ? "primary" : "success"
                            }
                            className="text-small"
                          >
                            {item.type}
                          </Chip>
                        </TableCell>
                      );
                    } else if (columnKey === "orderNo") {
                      return (
                        <TableCell>
                          <Input
                            type="text"
                            value={item.orderNo}
                            onChange={(e) =>
                              handleChange(item.id, "orderNo", e.target.value)
                            }
                            className="max-w-full"
                            variant="bordered"
                          />
                        </TableCell>
                      );
                    } else if (columnKey === "name") {
                      return (
                        <TableCell>
                          <Input
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              handleChange(item.id, "name", e.target.value)
                            }
                            className="max-w-full"
                            variant="bordered"
                          />
                        </TableCell>
                      );
                    } else if (columnKey === "price") {
                      return (
                        <TableCell>
                          <Input
                            type="number"
                            value={item.price}
                            onChange={(e) =>
                              handleChange(item.id, "price", e.target.value)
                            }
                            className="max-w-full"
                            variant="bordered"
                          />
                        </TableCell>
                      );
                    } else if (columnKey === "action") {
                      return (
                        <TableCell>
                          <Button
                            size="sm"
                            variant="flat"
                            color="error"
                            onPress={() => removeProduct(item.id)}
                            isIconOnly
                          >
                            <DeleteIcon />
                          </Button>
                        </TableCell>
                      );
                    }
                    return <TableCell>{item[columnKey]}</TableCell>;
                  }}
                </TableRow>
              );
            }}
          </TableBody>
        </Table>
      </div>

      <div className="p-5">
        {/* ถ้ามี Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mb-2">
            <Pagination
              total={totalPages}
              page={currentPage}
              onChange={setCurrentPage}
              color="primary"
            />
          </div>
        )}

        <div className="flex justify-end items-center">
          <Button color="danger" variant="light" onPress={onClose} size="sm">
            ปิด
          </Button>
          <Button
            color="primary"
            onPress={handleSaveClick}
            size="sm"
            className="ml-4"
          >
            Save
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default SettingPriceProd;
