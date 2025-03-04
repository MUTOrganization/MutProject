import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Card,
  Pagination,
  Input,
  useDisclosure,
  Tooltip,
  Select,
  SelectItem,
  Chip,
} from "@nextui-org/react";
import AddItemModal from "./components/AddItemModal";
import EditItemModal from "./components/EditItemModal";
import DeleteItemModal from "./components/DeleteItemModal";
import { useParams, useNavigate } from "react-router-dom";
import { URLS } from "@/config";
import { useLists } from "../../utils/fetchData/fetchList";
import fetchProtectedData from "../../../../../../../utils/fetchData";
import { PlusIcon, EditIcon, DeleteIcon, CopyIcon } from "@/component/Icons";

import { ACCESS } from "@/configs/access";
import { useAppContext } from "@/contexts/AppContext";

function GroupDetail() {
  // เรียก hook ต่าง ๆ ที่ระดับบนสุด
  const currentData = useAppContext();
  const { lists, isLoading, fetchLists } = useLists();
  const { id, groupid } = useParams();
  const navigate = useNavigate();

  const [selectedMonth, setSelectedMonth] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]); // state สำหรับฟิลเตอร์สถานะ
  const [group, setGroup] = useState(null);
  const [isManageMode, setIsManageMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onOpenChange: onAddOpenChange,
    onClose: onAddClose,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [selectedEditItem, setSelectedEditItem] = useState(null);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState(null);

  const months = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  // ฟังก์ชันแปลงสถานะให้แสดงเป็นข้อความที่ต้องการ
  const getStatusLabel = (status) => {
    const statusStr = String(status);
    return statusStr === "1"
      ? "มีโปรเจคตัดต่อ"
      : statusStr === "0"
        ? "ธรรมดา"
        : statusStr;
  };
console.log(group);

  // ฟิลเตอร์ไอเท็มตามข้อความค้นหา, เดือน และสถานะ
  const filteredItems = useMemo(() => {
    if (!group || !group.items) return [];
    return group.items.filter((item) => {
      // เงื่อนไขค้นหาข้อความ (ไม่คำนึงถึงตัวพิมพ์)
      const searchCondition =
        item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.item_description.toLowerCase().includes(searchQuery.toLowerCase());

      // เงื่อนไขกรองตามเดือน (ถ้ามีการเลือกเดือน)
      let monthCondition = true;
      if (selectedMonth.length > 0) {
        if (!item.item_date) return false;
        const utcDate = new Date(item.item_date);
        const thaiDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
        const monthIndex = thaiDate.getMonth();
        if (monthIndex < 0 || monthIndex > 11) return false;
        const monthName = months[monthIndex];
        monthCondition = selectedMonth.includes(monthName);
      }

      // เงื่อนไขกรองตามสถานะ (ถ้ามีการเลือกสถานะ) โดยเปรียบเทียบเป็น string
      let statusCondition = true;
      if (selectedStatus.length > 0) {
        statusCondition = selectedStatus.includes(String(item.item_status));
      }

      return searchCondition && monthCondition && statusCondition;
    });
  }, [group, searchQuery, selectedMonth, selectedStatus, months]);

  // คำนวณรายชื่อเดือนที่มีอยู่ใน group.items (หลังแปลง timezone)
  const uniqueMonths = useMemo(() => {
    if (!group || !group.items) return [];
    const monthsArray = group.items
      .map((item) => {
        if (item.item_date) {
          const utcDate = new Date(item.item_date);
          const thaiDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
          const monthIndex = thaiDate.getMonth();
          if (monthIndex >= 0 && monthIndex < 12) {
            return months[monthIndex];
          }
        }
        return null;
      })
      .filter((m) => m !== null);
    return [...new Set(monthsArray)];
  }, [group, months]);

  // คำนวณรายชื่อสถานะที่มีอยู่ใน group.items โดยแปลงเป็น string
  const uniqueStatuses = useMemo(() => {
    if (!group || !group.items) return [];
    const statusesArray = group.items
      .map((item) => String(item.item_status))
      .filter((status) => status !== null && status !== undefined);
    return [...new Set(statusesArray)];
  }, [group]);

  // ดึงข้อมูล Group ที่ตรงกับ id และ groupid
  useEffect(() => {
    const foundList = lists.find((l) => l.list_id === Number(id));
    if (foundList) {
      const foundGroup = foundList.groups.find(
        (g) => g.group_id === Number(groupid)
      );
      if (foundGroup) {
        // ตรวจสอบว่ามี items หรือไม่และจัดเรียง items โดยใช้ item_date
        if (foundGroup.items && Array.isArray(foundGroup.items)) {
          const sortedItems = foundGroup.items.sort(
            (a, b) => new Date(a.item_date) - new Date(b.item_date)
          );
          setGroup({ ...foundGroup, items: sortedItems });
        } else {
          setGroup(foundGroup);
        }
      } else {
        console.error("Group not found");
      }
    } else {
      console.error("List not found");
    }
  }, [lists, id, groupid]);

  if (!group) {
    return <div>Loading...</div>;
  }

  // ฟังก์ชันสำหรับ duplicate ไอเท็ม
  const handleDuplicateItem = async (item) => {
    console.log(item);
    const formattedDate = new Date(item.item_date).toLocaleDateString("en-CA", {
      timeZone: "Asia/Bangkok",
    });

    try {
      const formData = new FormData();
      formData.append("group_id", group.group_id);
      formData.append("item_name", item.item_name + " (Copy)");
      formData.append("item_description", item.item_description);
      formData.append("drive_link", item.drive_link);
      formData.append("item_status", item.item_status);
      formData.append("item_date", formattedDate);

      const response = await fetchProtectedData.post(
        URLS.WebContent.createItem,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (!response || response.status !== 200) {
        throw new Error("Failed to duplicate item");
      }
      console.log("Item duplicated successfully:", response.data);
      await fetchLists();
    } catch (error) {
      console.error("Error duplicating item:", error);
    }
  };

  // ฟังก์ชันสำหรับลบไอเท็ม
  const handleDeleteItem = async (id) => {
    try {
      await fetchProtectedData.delete(
        `${URLS.WebContent.deleteItem}?item_id=${id}`
      );
      await fetchLists();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // ฟังก์ชันยืนยันลบไอเท็ม
  const confirmDelete = async () => {
    if (!selectedDeleteItem) return;
    await handleDeleteItem(selectedDeleteItem.item_id);
    onDeleteClose();
  };

  const handleOpenCreateModal = () => {
    onAddOpen();
  };

  const handleOpenEditModal = (item) => {
    setSelectedEditItem(item);
    onEditOpen();
  };

  const handleOpenDeleteModal = (item) => {
    setSelectedDeleteItem(item);
    onDeleteOpen();
  };

  return (
    <div className="container mx-auto px-6 py-6 bg-white ">
      {/* ปุ่มย้อนกลับ, ฟิลเตอร์เดือน, ฟิลเตอร์สถานะ และช่องค้นหา */}
      <div className="flex flex-col md:flex-row justify-between md:items-center items-start mb-6 gap-5">
        <div>
          <Button color="secondary" onPress={() => navigate(-1)}>
            🔙 กลับ
          </Button>
        </div>
        <div className="flex flex-col md:flex-row gap-5 w-full justify-end">
          <Select
            label="สิทธิพิเศษสำหรับคุณ"
            placeholder="ทั้งหมด"
            selectedKeys={new Set(selectedStatus)}
            onSelectionChange={(keys) => setSelectedStatus(Array.from(keys))}
            selectionMode="multiple"
            disallowEmptySelection={false}
            className="w-full md:w-48"
          >
            {uniqueStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {getStatusLabel(status)}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="เดือน"
            placeholder="ทั้งหมด"
            selectedKeys={new Set(selectedMonth)}
            onSelectionChange={(keys) => setSelectedMonth(Array.from(keys))}
            selectionMode="multiple"
            disallowEmptySelection={false}
            className="w-full md:w-48"
          >
            {uniqueMonths.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </Select>

          <Input
            clearable
            underlined
            fullWidth
            label="🔍 ค้นหาไอเท็ม"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:max-w-xs"
          />
        </div>
      </div>

      {/* ชื่อ Group และปุ่มเปลี่ยนโหมดจัดการ */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">{group.group_name}</h1>
        {currentData.accessCheck.haveAny([
          ACCESS.admin_content.admin_content,
        ]) && (
          <Button
            color={isManageMode ? "warning" : "primary"}
            onPress={() => setIsManageMode((prev) => !prev)}
          >
            {isManageMode ? "❌ ออกจากโหมดจัดการ" : "⚙️ เปิดโหมดจัดการ"}
          </Button>
        )}
      </div>

      {/* Grid Layout สำหรับแสดงไอเท็ม */}
      <div className="flex-grow h-[500px] md:h-screen overflow-y-auto pb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            // กำหนด Tooltip content ให้แสดงรายละเอียดของไอเท็ม
            const tooltipContent = (
              <div className="text-sm">
                <p>
                  <strong>ชื่อ:</strong> {item.item_name}
                </p>
                <p>
                  <strong>รายละเอียด:</strong> {item.item_description}
                </p>
                {item.item_date && (
                  <p>
                    <strong>เดือน:</strong>{" "}
                    {(() => {
                      const utcDate = new Date(item.item_date);
                      const thaiDate = new Date(
                        utcDate.getTime() + 7 * 60 * 60 * 1000
                      );
                      const monthIndex = thaiDate.getMonth();
                      return months[monthIndex];
                    })()}
                  </p>
                )}
                <p>
                  <strong>สถานะ:</strong> {getStatusLabel(item.item_status)}
                </p>
              </div>
            );

            return (
              <div key={item.item_id} className="relative">
                <Tooltip
                  content={tooltipContent}
                  color="primary"
                  placement="top"
                >
                  <Card
                    shadow="sm"
                    isPressable={!isManageMode}
                    className="w-full h-56 flex items-center justify-center hover:opacity-80 transition cursor-pointer"
                    onPress={() => {
                      if (!isManageMode && item.drive_link) {
                        window.open(item.drive_link, "_blank");
                      }
                    }}
                  >
                    <img
                      src={item.item_image}
                      alt={item.item_name}
                      className="w-full h-full object-cover"
                    />
                    {item.item_status !== 0 && (
                      <Chip
                        className="absolute top-2 left-2 z-30 text-white"
                        color="success"
                      >
                        {getStatusLabel(item.item_status)}
                      </Chip>
                    )}
                    {isManageMode && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg z-10">
                        <Button
                          isIconOnly
                          auto
                          size="lg"
                          variant="like"
                          color="warning"
                          className="z-10"
                          onPress={() => handleOpenEditModal(item)}
                        >
                          <EditIcon className="text-5xl text-white" />
                        </Button>
                      </div>
                    )}
                  </Card>
                </Tooltip>
                <p className="mt-2 text-sm text-center cursor-default">
                  {item.item_name}
                </p>
                {isManageMode && (
                  <div className="absolute top-2 right-2 z-20 flex space-x-2">
                    <Button
                      isIconOnly
                      auto
                      size="md"
                      variant="like"
                      color="primary"
                      onPress={() => handleDuplicateItem(item)}
                    >
                      <CopyIcon className="text-2xl text-white" />
                    </Button>
                    <Button
                      isIconOnly
                      auto
                      size="md"
                      variant="like"
                      color="error"
                      onPress={() => handleOpenDeleteModal(item)}
                    >
                      <DeleteIcon className="text-2xl text-white" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
          {currentData.accessCheck.haveAny([
            ACCESS.admin_content.admin_content,
          ]) && (
            <Card
              shadow="sm"
              isPressable
              className="hover:opacity-80 transition flex flex-col items-center cursor-pointer h-56"
              onPress={handleOpenCreateModal}
            >
              <div className="flex flex-col items-center justify-center w-36 h-36 md:w-56 md:h-56 rounded-lg">
                <PlusIcon />
                <p className="mt-2 text-sm text-center">สร้าง Items ใหม่</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Modal สำหรับเพิ่ม, แก้ไข และลบ Item */}
      <AddItemModal
        isOpen={isAddOpen}
        onOpenChange={onAddOpenChange}
        onClose={onAddClose}
        groupId={group?.group_id}
        fetchItems={fetchLists}
      />
      {selectedEditItem && (
        <EditItemModal
          isOpen={isEditOpen}
          onOpenChange={onEditOpenChange}
          onClose={onEditClose}
          item={selectedEditItem}
          fetchItems={fetchLists}
        />
      )}
      {selectedDeleteItem && (
        <DeleteItemModal
          isOpen={isDeleteOpen}
          onOpenChange={onDeleteOpenChange}
          onClose={onDeleteClose}
          itemName={selectedDeleteItem.item_name}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

export default GroupDetail;
