import React, { useState, useMemo } from "react";
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
  Pagination,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@heroui/react";
import { EditIcon, DeleteIcon } from "@/component/Icons";
import { columnsAds } from "./settingAds";
import { formatDateThai, formatDateThaiAndTime } from "@/utils/dateUtils";
import { calculateVAT } from "@/component/Calculate";
import { ConfirmCancelButtons } from "@/component/Buttons";
import { toastError,toastSuccess,toastWarning } from "@/component/Alert";
import fetchProtectedData from "@/utils/fetchData";
import { URLS } from "@/config";

function TableAds({ filteredData, vatRate, isLoading,agentId,onDataChange }) {
  // เก็บสถานะ Sort
  const [sortConfig, setSortConfig] = useState({
    column: "date_time",
    direction: "ascending",
  });
  const [selectedId, setSelectedId] = useState(null);
  const [selectededit, setSelectededit] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState("25");
  const [currentPage, setCurrentPage] = useState(1);
  const handleRowsPerPageChange = (key) => {
    // key จะเป็น String เช่น "50", "100"
    setRowsPerPage(key);
    setCurrentPage(1);
  };

  const {
    isOpen: isModalDeletUser,
    onOpen: onOpenModalDeletUser,
    onOpenChange: onOpenChangeModalDeletUser,
  } = useDisclosure();

  const {
    isOpen: isModalSetUser,
    onOpen: onOpenModalSetUser,
    onOpenChange: onOpenChangeModalSetUser,
  } = useDisclosure();

  // คำนวณข้อมูลที่ sort แล้ว
  const sortedItems = useMemo(() => {
    const cloned = [...filteredData];
    const { column, direction } = sortConfig;
    if (!column) return cloned;

    cloned.sort((a, b) => {
      const first = a[column];
      const second = b[column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return direction === "descending" ? -cmp : cmp;
    });
    return cloned;
  }, [sortConfig, filteredData]);

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

  // ฟิลด์คำนวณ VAT
  const vat = vatRate ? 7 : 0;

  // ฟังก์ชัน render แต่ละเซลล์
  const renderCell = (item, columnKey) => {
    const formattedValue = (value) =>
      value ? new Intl.NumberFormat().format(value) : "0";

    const costAds = calculateVAT(item.ads || 0, vat);

    switch (columnKey) {
      case "date_time":
        return formatDateThai(item[columnKey]);
      case "code":
        return (
          <>
            <div className="flex flex-col">
              <Tooltip
                content={`บันทึกเมื่อ ${formatDateThai(item.created_at, 'datetime')}`}
              >
                <span>
                  <p className="text-bold text-small capitalize">
                    {item.code || item.page}
                  </p>
                  <p className="text-bold text-tiny capitalize text-default-400">
                    แพลตฟอร์ม {item.platform}
                  </p>
                </span>
              </Tooltip>
            </div>{" "}
          </>
        );
      case "teamAds":
        return item[columnKey];
      case "ads":
        // แปลงเป็นสกุลเงินพร้อม comma
        return `฿${formattedValue(costAds.toFixed(2))}`;
      case "created_at":
        return formatDateThai(item[columnKey], 'datetime');
      case "actions":
        // ตัวอย่างการใส่ปุ่ม Edit / Delete
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip
              content="Edit user"
              delay={0}
              closeDelay={0}
              motionProps={{
                variants: {
                  exit: {
                    opacity: 0,
                    transition: {
                      duration: 0.1,
                      ease: "easeIn",
                    },
                  },
                  enter: {
                    opacity: 1,
                    transition: {
                      duration: 0.15,
                      ease: "easeOut",
                    },
                  },
                },
              }}
            >
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => {
                  onOpenModalSetUser();
                  setSelectededit(item);
                }}
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip
              color="danger"
              content="Delete user"
              delay={0}
              closeDelay={0}
              motionProps={{
                variants: {
                  exit: {
                    opacity: 0,
                    transition: {
                      duration: 0.1,
                      ease: "easeIn",
                    },
                  },
                  enter: {
                    opacity: 1,
                    transition: {
                      duration: 0.15,
                      ease: "easeOut",
                    },
                  },
                },
              }}
            >
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => {
                  onOpenModalDeletUser();
                  setSelectedId(item);
                }}
              >
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return null;
    }
  };

  const handleUpdateUser = async () => {
    if (selectededit) {
      try {
        const formattedAds = parseFloat(selectededit.ads).toFixed(2);

        await fetchProtectedData.put(
          `${URLS.ADSFORM}/updateAds/${selectededit.id}`,
          {
            ads: formattedAds,
            businessId: agentId,
          }
        );
        // แจ้ง parent ว่าข้อมูลเปลี่ยนแล้ว
        if (onDataChange) {
          onDataChange();
        }
        setSelectededit([]); // หรือ reset state ตามต้องการ
        onOpenChangeModalSetUser(false);
        toastSuccess("แก้ไขสำเร็จ");
      } catch (error) {
        console.error("Error updating user:", error);
        toastError("Event has not been created");
      }
    }
  };

  const handleConfirmDeleteUser = async () => {
    if (selectedId) {
      await handleDeleteUser(selectedId.id);
      onOpenChangeModalDeletUser(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await fetchProtectedData.delete(`${URLS.ADSFORM}/deleteAds/${id}`);
      // เมื่อ delete สำเร็จ ก็แจ้ง parent
      if (onDataChange) {
        onDataChange();
      }
      toastSuccess("ลบสำเร็จ");
    } catch (error) {
      console.error("Error deleting user:", error);
      toastError("ลบไม่สำเร็จ");
    }
  };
  return (
    <div className="flex-1 ">
      {/* กำหนด Card ให้สูงคงที่ พร้อมทำเป็น Flex Col */}
      <Card
        className="h-[400px] w-full overflow-hidden flex flex-col"
        shadow="none"
      >
        {/* ส่วนที่ให้ตารางเลื่อน (scroll) ได้ */}
        <div className="flex-1 overflow-auto">
          <Table
            isHeaderSticky
            isCompact
            className="h-full overflow-x-auto overflow-y-auto  w-full hover:cursor-default"
            shadow="none"
            aria-label="Example table with custom cells and pagination"
            sortDescriptor={sortConfig}
            topContentPlacement="outside"
            onSortChange={setSortConfig}
          >
            <TableHeader columns={columnsAds}>
              {(col) => (
                <TableColumn
                  key={col.uid}
                  align={col.uid === "actions" ? "center" : "start"}
                  allowsSorting={col.sortable}
                >
                  {col.name}
                </TableColumn>
              )}
            </TableHeader>

            <TableBody
              items={paginatedItems} // ข้อมูลตามหน้าปัจจุบัน
              emptyContent={"ยังไม่มีข้อมูล"} // ถ้าไม่มี
              loadingState={isLoading ? "loading" : undefined}
              loadingContent={<Spinner color="primary" />}
            >
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Footer: Dropdown เลือกจำนวนต่อหน้า + Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
        {/* เลือกจำนวนแถวต่อหน้า */}
        <div className="flex items-center gap-2 text-sm">
          <span>จำนวนข้อมูลต่อหน้า:</span>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat">{rowsPerPage}</Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={new Set([rowsPerPage])}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0];
                handleRowsPerPageChange(value);
              }}
            >
              <DropdownItem key="50">50</DropdownItem>
              <DropdownItem key="100">100</DropdownItem>
              <DropdownItem key="150">150</DropdownItem>
              <DropdownItem key="200">200</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* Pagination ของ NextUI */}
        <Pagination
          showControls
          total={totalPages} // จำนวนหน้าทั้งหมด
          page={currentPage} // หน้าปัจจุบัน
          onChange={setCurrentPage} // เปลี่ยนหน้าด้วย setCurrentPage
          size="md"
          color="primary"
        />
        <Modal
          isOpen={isModalSetUser}
          onOpenChange={onOpenChangeModalSetUser}
          isDismissable={false}
          isKeyboardDismissDisabled={true}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  <h3>Edit User</h3>
                </ModalHeader>
                <ModalBody>
                  <Input
                    isReadOnly
                    label="วันที่"
                    value={
                      selectededit ? formatDateThai(selectededit.date_time) : ""
                    }
                    onChange={(e) =>
                      setSelectededit({
                        ...selectededit,
                        date_time: e.target.value,
                      })
                    }
                  />
                  <Input
                    isReadOnly
                    label="ชื่อ"
                    value={selectededit ? selectededit.teamAds : ""}
                    onChange={(e) =>
                      setSelectededit({
                        ...selectededit,
                        teamAds: e.target.value,
                      })
                    }
                  />
                  <Input
                    isReadOnly
                    label="รหัสเพจ"
                    value={selectededit ? selectededit.code : ""}
                    onChange={(e) =>
                      setSelectededit({
                        ...selectededit,
                        code: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    label="ค่าแอด"
                    isRequired
                    placeholder="ค่าแอดของบัญชี"
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">฿</span>
                      </div>
                    }
                    value={selectededit ? selectededit.ads : ""}
                    onChange={(e) =>
                      setSelectededit({
                        ...selectededit,
                        ads: e.target.value,
                      })
                    }
                  />
                </ModalBody>
                <ModalFooter>
                  <ConfirmCancelButtons
                    onConfirm={handleUpdateUser}
                    onCancel={onClose}
                    confirmText={"ยืนยัน"}
                    cancelText={"ยกเลิก"}
                    size={"sm"}
                  />
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <Modal
          isOpen={isModalDeletUser}
          onOpenChange={onOpenChangeModalDeletUser}
          isDismissable={false}
          isKeyboardDismissDisabled={true}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  <h3>ลบค่าแอดแพลตฟอร์ม {selectedId.platform}</h3>
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-2">
                    <p className="text-gray-700 text-base leading-relaxed">
                      ต้องการลบค่าแอดเพจ{" "}
                      <span className="font-semibold text-gray-900">
                        {selectedId.code || selectedId.page}
                      </span>{" "}
                      วันที่{" "}
                      <span className="font-semibold text-gray-900">
                        {formatDateThai(selectedId.date_time)}
                      </span>{" "}
                      นี้หรือไม่
                    </p>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <ConfirmCancelButtons
                    onConfirm={handleConfirmDeleteUser}
                    onCancel={onClose}
                    confirmText={"ยืนยัน"}
                    cancelText={"ยกเลิก"}
                    size={"sm"}
                  />
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

export default TableAds;
