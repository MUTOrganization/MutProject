import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Pagination,
  Select,
  SelectItem,
  Card,
  useDisclosure,
  Image,
  Tooltip,
} from "@nextui-org/react";
import AddGroupModal from "./components/AddGroupModal";
import EditGroupModal from "./components/EditGroupModal";
import DeleteGroupConfirmationModal from "./components/DeleteGroupConfirmationModal";
import { useParams, useNavigate } from "react-router-dom";
import { URLS } from "@/config";
import { useLists } from "../../utils/fetchData/fetchList";
import fetchProtectedData from "../../../../../../../utils/fetchData";
import { PlusIcon, EditIcon, DeleteIcon, CopyIcon } from "@/component/Icons";
import { getUniqueData, getFilteredGroups } from "../../utils/filter";
import { formatMonthThaiandYear } from "@/component/DateUtiils";
import { ACCESS } from "@/configs/access";
import { useAppContext } from "@/contexts/AppContext";

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

function ListDetail() {
  const currentData = useAppContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const { lists, isLoading, fetchLists } = useLists();

  const [list, setList] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedEditGroup, setSelectedEditGroup] = useState(null);
  const [selectedDeleteGroup, setSelectedDeleteGroup] = useState(null);
  const [isManageMode, setIsManageMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState([]);
  const [selectedYear, setSelectedYear] = useState([]);

  useEffect(() => {
    if (lists && lists.length > 0) {
      const foundList = lists.find((l) => l.list_id === Number(id));
      if (foundList) {
        setList(foundList);
        let updatedGroups = foundList.groups || [];

        // กรองเฉพาะ group_status === 1 ถ้าไม่มีสิทธิ์ดูทั้งหมด
        const canViewAllStatus = currentData.accessCheck.haveAny([
          ACCESS.admin_content.admin_content,
        ]);
        if (!canViewAllStatus) {
          updatedGroups = updatedGroups.filter(
            (group) => group.group_status === 1
          );
        }

        // แปลง group_date เป็นรูปแบบ "YYYY-MM-DD" โดยใช้ Timezone ไทย
        updatedGroups = updatedGroups
          .map((group) => {
            if (group.group_date) {
              const dateObj = new Date(group.group_date);
              const thaiDateString = dateObj.toLocaleDateString("en-CA", {
                timeZone: "Asia/Bangkok",
              });
              return { ...group, group_date: thaiDateString };
            }
            return group;
          })
          .sort((a, b) => new Date(b.group_date) - new Date(a.group_date)); // เรียงจากวันที่ล่าสุดไปหาเก่าสุด

        setGroups(updatedGroups);
      } else {
        console.error("List not found for ID:", id);
      }
    }
  }, [lists, id, currentData]);

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

  // ฟังก์ชันสำหรับ duplicate group
  const handleDuplicateGroup = async (group) => {
    try {
      const formData = new FormData();
      formData.append("list_id", list.list_id);
      formData.append("group_name", group.group_name + " (Copy)");
      formData.append("group_category", group.group_category);
      formData.append("group_date", group.group_date);
      formData.append("group_image", group.group_image);
      formData.append("group_status", group.group_status);

      const response = await fetchProtectedData.post(
        URLS.WebContent.createGroup,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (!response || response.status !== 200) {
        throw new Error("Failed to duplicate group");
      }
      console.log("Group duplicated successfully:", response.data);
      await fetchLists();
    } catch (error) {
      console.error("Error duplicating group:", error);
    }
  };

  const handleDeleteGroup = async (id) => {
    try {
      await fetchProtectedData.delete(
        `${URLS.WebContent.deleteGroup}?group_id=${id}`
      );
      await fetchLists();
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const confirmDelete = async () => {
    if (!selectedDeleteGroup) return;
    await handleDeleteGroup(selectedDeleteGroup.group_id);
    onDeleteClose();
  };

  const uniqueCategories = useMemo(() => {
    return getUniqueData(groups, "group_category");
  }, [groups]);

  const uniqueYears = useMemo(() => {
    const yearArray = groups
      .map((group) => {
        if (group.group_date) {
          const parts = group.group_date.split("-");
          return parts[0];
        }
        return null;
      })
      .filter((year) => year !== null);
    return [...new Set(yearArray)];
  }, [groups]);

  // ฟิลเตอร์ groups ตาม category, month, year
  const filteredGroups = useMemo(() => {
    return getFilteredGroups(
      groups,
      months,
      selectedCategory,
      selectedMonth,
      selectedYear
    );
  }, [groups, selectedCategory, selectedMonth, selectedYear]);

  if (isLoading || !list) {
    return <div>Loading...</div>;
  }

  const handleOpenCreateModal = () => {
    onAddOpen();
  };

  const handleOpenEditModal = (group) => {
    setSelectedEditGroup(group);
    onEditOpen();
  };

  const handleOpenDeleteModal = (group) => {
    setSelectedDeleteGroup(group);
    onDeleteOpen();
  };

  return (
    <div className="container mx-auto px-6 py-6 bg-white flex flex-col">
      {/* ปุ่มย้อนกลับ & ฟิลเตอร์ */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex w-full md:w-1/3 mb-4 md:mb-0">
          <Button color="secondary" onPress={() => navigate(-1)}>
            🔙 กลับ
          </Button>
        </div>
        <div className="flex flex-col md:flex-row w-full md:w-2/4 gap-4">
          <Select
            label="หมวดหมู่"
            placeholder="ทั้งหมด"
            selectedKeys={new Set(selectedCategory)}
            onSelectionChange={(e) => setSelectedCategory(Array.from(e))}
            selectionMode="multiple"
            disallowEmptySelection={false}
            className="w-full"
          >
            {uniqueCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="ปี"
            placeholder="ทั้งหมด"
            selectedKeys={new Set(selectedYear)}
            onSelectionChange={(e) => setSelectedYear(Array.from(e))}
            selectionMode="multiple"
            disallowEmptySelection={false}
            className="w-full"
          >
            {uniqueYears.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {/* หัวข้อ List & โหมดจัดการ */}
      {currentData.accessCheck.haveAny([
        ACCESS.admin_content.admin_content,
      ]) && (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">{list.list_name}</h1>
          <Button
            color={isManageMode ? "warning" : "primary"}
            onPress={() => setIsManageMode(!isManageMode)}
          >
            {isManageMode ? "❌ ออกจากโหมดจัดการ" : "⚙️ เปิดโหมดจัดการ"}
          </Button>
        </div>
      )}

      {/* Grid Layout สำหรับ Group */}
      <div className="flex-grow h-[450px] md:h-screen overflow-y-auto pb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredGroups.map((group) => {
            const canAdmin = currentData.accessCheck.haveAny([
              ACCESS.admin_content.admin_content,
            ]);

            // ข้อมูลที่จะโชว์ใน Tooltip
            const tooltipContent = (
              <div className="text-sm">
                <p>หมวดหมู่: {group.group_category}</p>
                <p>วันที่: {formatMonthThaiandYear(group.group_date)}</p>
                <p>รายละเอียด: {group.group_description}</p>
              </div>
            );

            return (
              <div key={group.group_id} className="relative">
                {/* Tooltip ครอบ Card */}
                <Tooltip
                  content={tooltipContent}
                  color="primary"
                  placement="top"
                  // เปิด-ปิดตามต้องการ
                  // showArrow
                >
                  <Card
                    shadow="sm"
                    isPressable={!isManageMode}
                    className="w-full h-56 flex items-center justify-center transition"
                    onPress={() => {
                      if (!isManageMode) {
                        navigate(
                          `/content-hopeful/list/${list.list_id}/group/${group.group_id}`
                        );
                      }
                    }}
                  >
                    <Image
                      src={group.group_image}
                      alt={group.group_name}
                      className="w-full h-full object-cover drop-shadow-lg"
                    />
                    {isManageMode && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg z-10">
                        <Button
                          isIconOnly
                          auto
                          size="lg"
                          variant="like"
                          color="warning"
                          className="z-10"
                          onPress={() => handleOpenEditModal(group)}
                        >
                          <EditIcon className="text-5xl text-white" />
                        </Button>
                      </div>
                    )}
                    {canAdmin && (
                      <span
                        className={
                          "absolute top-2 left-2 z-20 px-2 py-1 text-xs font-semibold rounded-full " +
                          (group.group_status === 1
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white")
                        }
                      >
                        {group.group_status === 1 ? "ใช้งาน" : "ไม่ใช้งาน"}
                      </span>
                    )}
                  </Card>
                </Tooltip>

                <span className="text-sm font-medium flex justify-center mt-2">
                  {group.group_name}
                </span>
                <span className="text-sm font-medium flex justify-center mt-2">
                  {formatMonthThaiandYear(group.group_date)}
                </span>

                {isManageMode && (
                  <div className="absolute top-2 right-2 z-20 flex space-x-2">
                    <Button
                      isIconOnly
                      auto
                      size="md"
                      variant="like"
                      color="primary"
                      onPress={() => handleDuplicateGroup(group)}
                    >
                      <CopyIcon className="text-2xl text-white" />
                    </Button>
                    <Button
                      isIconOnly
                      auto
                      size="md"
                      variant="like"
                      color="error"
                      onPress={() => handleOpenDeleteModal(group)}
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
                <p className="mt-2 text-sm text-center">สร้าง List ใหม่</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      <AddGroupModal
        isOpen={isAddOpen}
        onOpenChange={onAddOpenChange}
        onClose={onAddClose}
        listId={list?.list_id}
        fetchGroups={fetchLists}
      />

      {selectedEditGroup && (
        <EditGroupModal
          isOpen={isEditOpen}
          onOpenChange={onEditOpenChange}
          onClose={onEditClose}
          group={selectedEditGroup}
          fetchGroups={fetchLists}
        />
      )}
      {selectedDeleteGroup && (
        <DeleteGroupConfirmationModal
          isOpen={isDeleteOpen}
          onOpenChange={onDeleteOpenChange}
          onClose={onDeleteClose}
          groupName={selectedDeleteGroup.group_name}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

export default ListDetail;
