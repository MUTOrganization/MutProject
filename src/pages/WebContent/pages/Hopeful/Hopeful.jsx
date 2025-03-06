import React, { useState } from "react";
import { Card, Button, useDisclosure, Image } from "@nextui-org/react";
import { PlusIcon, DeleteIcon, EditIcon } from "@/component/Icons";
import AddListModal from "./component/AddListModal";
import EditListModal from "./component/EditListModal";
import DeleteConfirmationModal from "./component/DeleteConfirmationModal";
import { useNavigate } from "react-router-dom";
import fetchProtectedData from "../../../../../utils/fetchData";
import { URLS } from "@/config";
import { useLists } from "./utils/fetchData/fetchList";
import { toastError, toastSuccess, toastWarning } from "@/component/Alert";
import { ACCESS } from "@/configs/access";
import { useAppContext } from "@/contexts/AppContext";
function Hopeful() {
  const currentData = useAppContext();
  const { lists, isLoading, fetchLists } = useLists();

  const [isDeleteEditMode, setIsDeleteEditMode] = useState(false);
  const [selectedListForEdit, setSelectedListForEdit] = useState(null);
  const [selectedListForDelete, setSelectedListForDelete] = useState(null);

  const navigate = useNavigate();

  // ฟังก์ชันลบ List ในเซิร์ฟเวอร์ และรีเฟรชข้อมูล
  const handleDeleteList = async (id) => {
    try {
      await fetchProtectedData.delete(
        `${URLS.WebContent.deleteList}?list_id=${id}`
      );
      // ลบเสร็จแล้วเรียก fetchLists() เพื่อโหลดข้อมูลใหม่
      await fetchLists();
    } catch (error) {
      console.error("Error deleting list:", error);
      toastError("ลบรายการไม่สำเร็จ");
    } finally {
      toastSuccess("ลบรายการสำเร็จ");
    }
  };

  // Hook สำหรับควบคุม Modal ต่าง ๆ
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

  // เมื่อคลิกที่ List จะไปหน้า Detail โดยส่ง list_id ไปใน URL
  const onSelectList = (list) => {
    navigate(`/content-hopeful/list/${list.list_id}`);
  };

  // เปิด Modal สร้าง List
  const handleOpenCreateModal = () => {
    onAddOpen();
  };

  // เปิด Modal แก้ไข List
  const handleOpenEditModal = (list) => {
    setSelectedListForEdit(list);
    onEditOpen();
  };

  // เปิด Modal ลบ List
  const handleOpenDeleteModal = (list) => {
    setSelectedListForDelete(list);
    onDeleteOpen();
  };

  // ฟังก์ชันยืนยันลบใน DeleteConfirmationModal
  const confirmDelete = async () => {
    if (!selectedListForDelete) return;
    await handleDeleteList(selectedListForDelete.list_id);
    onDeleteClose();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5 mt-10">
      {/* Header */}
      <div className="flex flex-col items-center font-prompt">
        <img
          src="/img/con-hope.png"
          alt="Logo"
          className="w-56 h-auto filter invert"
        />

        <h1 className="md:text-5xl text-2xl">Hopeful Content</h1>

        <p className="md:text-xl text-md">กรุณาเลือก Content ที่ต้องการใช้</p>
      </div>

      {/* Toggle button for edit/delete mode */}
      {currentData.accessCheck.haveAny([
        ACCESS.admin_content.admin_content,
      ]) && (
        <div className="flex gap-4 mt-4">
          <Button
            auto
            onPress={() => setIsDeleteEditMode((prev) => !prev)}
            variant="bordered"
          >
            {isDeleteEditMode ? "บันทึก Content" : "จัดการ Content"}
          </Button>
        </div>
      )}

      {/* Grid displaying Lists */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 md:gap-10 pb-20 gap-1 p-2">
          {lists.map((list) => (
            <div key={list.list_id} className="relative ">
              <Card
                shadow="sm"
                isPressable={!isDeleteEditMode} // ✅ ป้องกันการกดเข้า List เมื่ออยู่ในโหมดแก้ไข
                className="hover:opacity-80 transition flex flex-col mx-auto items-center cursor-pointer w-36 h-36 md:w-56 md:h-56"
                onPress={() => {
                  if (!isDeleteEditMode) {
                    onSelectList(list);
                  }
                }}
              >
                {/* ✅ รูปขยายใหญ่ขึ้น */}
                <img
                  src={list.list_image}
                  alt={list.list_name}
                  className="w-full h-full object-cover rounded-lg"
                />

                {/* ✅ ปุ่มแก้ไขอยู่ตรงกลาง เมื่อเปิดโหมดจัดการ */}
                {isDeleteEditMode && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg z-10">
                    <Button
                      isIconOnly
                      auto
                      size="lg"
                      variant="like"
                      color="warning"
                      className="z-10"
                      onPress={() => handleOpenEditModal(list)}
                    >
                      <EditIcon className="text-5xl text-white" />
                    </Button>
                  </div>
                )}
              </Card>

              {/* ✅ ชื่อของไอเท็มอยู่ด้านล่าง */}
              <p className="mt-4 text-sm text-center">{list.list_name}</p>

              {/* ✅ ปุ่มลบอยู่มุมขวาบน เมื่อเปิดโหมดจัดการ */}
              {isDeleteEditMode && (
                <Button
                  isIconOnly
                  auto
                  size="md"
                  variant="like"
                  color="error"
                  className="absolute top-2 right-2 z-20"
                  onPress={() => handleOpenDeleteModal(list)}
                >
                  <DeleteIcon className="text-2xl text-white" />
                </Button>
              )}
            </div>
          ))}

          {/* Card for creating a new list */}
          {currentData.accessCheck.haveAny([
            ACCESS.admin_content.admin_content,
          ]) && (
            <div className="relative mx-auto">
              <Card
                shadow="sm"
                isPressable
                className="hover:opacity-80 transition flex flex-col items-center cursor-pointer"
                onPress={handleOpenCreateModal}
              >
                <div className="flex flex-col items-center justify-center w-36 h-36 md:w-56 md:h-56 rounded-lg">
                  <PlusIcon />
                  <p className="mt-2 text-sm text-center">สร้าง List ใหม่</p>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Modal for adding a new list */}
      <AddListModal
        isOpen={isAddOpen}
        onOpenChange={onAddOpenChange}
        onClose={onAddClose}
        // หลังสร้างเสร็จ ให้รีโหลดข้อมูลใหม่
        fetchData={fetchLists}
      />

      {/* Modal for editing a list */}
      {isEditOpen && (
        <EditListModal
          isOpen={isEditOpen}
          onOpenChange={onEditOpenChange}
          onClose={onEditClose}
          list={selectedListForEdit}
          // หลังแก้ไขเสร็จ ให้รีโหลดข้อมูลใหม่
          fetchData={fetchLists}
        />
      )}

      {/* Modal for confirming deletion */}
      {isDeleteOpen && (
        <DeleteConfirmationModal
          isOpen={isDeleteOpen}
          onOpenChange={onDeleteOpenChange}
          onClose={onDeleteClose}
          listName={selectedListForDelete?.list_name}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

export default Hopeful;
