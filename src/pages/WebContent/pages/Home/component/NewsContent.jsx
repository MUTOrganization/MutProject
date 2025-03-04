// NewsContent.jsx
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  Image,
  Button,
  useDisclosure,
  Tooltip,
} from "@nextui-org/react";
import AddNewsModal from "./AddNewsModal";
import EditNewsModal from "./EditNewsModal";
import DeleteNewsModal from "./DeleteNewsModal";
import { EditIcon, DeleteIcon } from "@/component/Icons";
import { useNews } from "../../Hopeful/utils/fetchData/fetchNews";
import { toastError, toastSuccess, toastWarning } from "@/component/Alert";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "@/config";
import { useAppContext } from "@/contexts/AppContext";
import { ACCESS } from "@/configs/access";

export default function NewsContent() {
  const currentData = useAppContext();
  const { news, isLoading, fetchNews } = useNews();
  const [isManagement, setIsManagement] = useState(false);

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

  const [selectedNewsForEdit, setSelectedNewsForEdit] = useState(null);
  const [selectedNewsForDelete, setSelectedNewsForDelete] = useState(null);

  const openAddModal = () => {
    onAddOpen();
  };

  const openEditModal = (item) => {
    setSelectedNewsForEdit(item);
    onEditOpen();
  };

  const openDeleteModal = (item) => {
    setSelectedNewsForDelete(item);
    onDeleteOpen();
  };

  const handleDeleteNews = async (id) => {
    try {
      await fetchProtectedData.delete(
        `${URLS.WebContent.deleteNews}?news_id=${id}`
      );
      await fetchNews();
    } catch (error) {
      console.error("Error deleting", error);
      toastError("ลบรายการไม่สำเร็จ");
    } finally {
      toastSuccess("ลบรายการสำเร็จ");
    }
  };
  const confirmDelete = async () => {
    if (!selectedNewsForDelete) return;
    await handleDeleteNews(selectedNewsForDelete.id);
    onDeleteClose();
  };

  return (
    <div className="md:min-w-[900px] mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-4xl font-bold">ข่าวสารและประกาศ</h2>
        {currentData.accessCheck.haveAny([
          ACCESS.admin_content.admin_content,
        ]) && (
          <Button
            onPress={() => setIsManagement(!isManagement)}
            color="primary"
            variant="flat"
          >
            {isManagement ? "กลับ" : "โหมดจัดการ"}
          </Button>
        )}
      </div>

      {/* Grid displaying Lists */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {news.map((item) => (
            <div className="relative md:h-[400px] h-[300px] md:w-[400px]">
              <Tooltip
                content={
                  <div className="bg-blue-600 text-white font-bold text-xl p-3 rounded shadow-xl">
                    {item.news_title}
                  </div>
                }
                placement="top"
                color="primary"
              >
                <Card
                  className="h-full w-full"
                  isPressable
                  onPress={() => {
                    if (!isManagement && item.news_link) {
                      window.open(item.news_link, "_blank");
                    }
                  }}
                >
                  <Image
                    removeWrapper
                    alt="Card background"
                    className="z-0 w-full h-full object-cover"
                    src={item.news_image}
                  />
                </Card>
              </Tooltip>
              {isManagement && (
                <div className="flex gap-10">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg z-10">
                    <Button
                      isIconOnly
                      auto
                      size="lg"
                      variant="like"
                      color="warning"
                      className="z-10"
                      onPress={() => openEditModal(item)}
                    >
                      <EditIcon className="text-5xl text-white" />
                    </Button>
                  </div>

                  <Button
                    isIconOnly
                    auto
                    size="md"
                    variant="like"
                    color="error"
                    className="absolute top-2 right-2 z-20"
                    onPress={() => openDeleteModal(item)}
                  >
                    <DeleteIcon className="text-2xl text-white" />
                  </Button>
                </div>
              )}
            </div>
          ))}
          {currentData.accessCheck.haveAny([
            ACCESS.admin_content.admin_content,
          ]) && (
            <div
              onClick={openAddModal}
              className="border-dashed border-2 border-gray-300 rounded-lg md:h-[400px] h-[300px] md:w-[400px] flex items-center justify-center cursor-pointer hover:bg-gray-50 transition"
            >
              <span className="text-2xl text-gray-400 font-bold">
                + เพิ่มข่าวสาร
              </span>
            </div>
          )}
        </div>
      )}

      <AddNewsModal
        isOpen={isAddOpen}
        onOpenChange={onAddOpenChange}
        fetchNews={fetchNews}
        onClose={onAddClose}
      />
      <EditNewsModal
        isOpen={isEditOpen}
        onOpenChange={onEditOpenChange}
        selectedNews={selectedNewsForEdit}
        onClose={onEditClose}
        fetchNews={fetchNews}
      />
      <DeleteNewsModal
        onConfirmDelete={confirmDelete}
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        newsItem={selectedNewsForDelete}
      />
    </div>
  );
}
