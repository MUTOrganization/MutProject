import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";
import fetchProtectedData from "../../../../../../../../utils/fetchData";
import { URLS } from "@/config";
import { toastError, toastSuccess, toastWarning } from "@/component/Alert";

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

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 11 }, (_, i) => String(currentYear - 5 + i));

const AddGroupModal = ({
  isOpen,
  onOpenChange,
  onClose,
  listId,
  fetchGroups,
}) => {
  const [groupName, setGroupName] = useState("");
  const [groupCategory, setGroupCategory] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupImage, setGroupImage] = useState(null);
  const [selectedYear, setSelectedYear] = useState(""); // ✅ เลือกปี
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setGroupImage(e.target.files[0]);
  };

  const handleSaveGroup = async () => {
    if (!listId) {
      console.error("Error: listId is missing!");
      return;
    }

    if (!groupImage) {
      toastWarning("กรุณาใส่รูปภาพ");
      return;
    }

    const formattedDate = `${selectedYear}-01-01`; // ✅ บันทึกเป็น YYYY-MM-DD โดยให้วันเป็น 01 เสมอ

    setIsLoading(true);
    const formData = new FormData();
    formData.append("list_id", listId);
    formData.append("group_name", groupName);
    formData.append("group_category", groupCategory);
    formData.append("group_description", groupDescription);
    formData.append("group_date", formattedDate); // ✅ ส่ง `group_date` ไปที่ API

    if (groupImage) {
      formData.append("image", groupImage);
    }

    try {
      // ✅ ส่งข้อมูลไปยัง API
      const response = await fetchProtectedData.post(
        URLS.WebContent.createGroup,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (!response || response.status !== 200) {
        throw new Error("Failed to create group");
      }

      console.log("Group created successfully:", response.data);

      // ✅ รีโหลด Groups ใน ListDetail หลังจากสร้างสำเร็จ
      if (fetchGroups) {
        await fetchGroups();
      }

      // ✅ ปิด Modal และรีเซ็ตค่า
      setGroupName("");
      setGroupCategory("");
      setGroupDescription("");
      setGroupImage(null);
      setSelectedYear("");
      onClose();
    } catch (error) {
      console.error("Error creating group:", error);
      toastError("เพิ่มรายการไม่สำเร็จ");
    } finally {
      setIsLoading(false);
      toastSuccess("เพิ่มรายการสำเร็จ");
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <h2 className="text-xl">สร้าง Group ใหม่</h2>
            </ModalHeader>
            <ModalBody>
              <Input
                clearable
                underlined
                fullWidth
                label="ชื่อ Group"
                placeholder="ชื่อ Group"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />

              <Input
                clearable
                underlined
                fullWidth
                label="หมวดหมู่"
                placeholder="หมวดหมู่"
                value={groupCategory}
                onChange={(e) => setGroupCategory(e.target.value)}
                className="mt-4"
              />

              <Input
                clearable
                underlined
                fullWidth
                label="รายละเอียด Group"
                placeholder="รายละเอียดเพิ่มเติม"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                className="mt-4"
              />

              {/* ✅ เลือกเดือนและปี */}
              <div className="flex gap-4 mt-4">
                <Select
                  label="ปี"
                  selectedKeys={[selectedYear]}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* อัปโหลดรูปภาพ */}
              <div className="border-2 border-dashed border-gray-400 p-4 flex flex-col items-center justify-center min-h-[200px] mt-4">
                {groupImage ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(groupImage)}
                      alt="preview"
                      className="max-w-full max-h-[200px] object-contain rounded cursor-pointer"
                      onClick={() =>
                        document.getElementById("groupImageUpload").click()
                      }
                    />
                  </div>
                ) : (
                  <label
                    htmlFor="groupImageUpload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    📷 คลิกเพื่อเพิ่มรูปภาพ
                  </label>
                )}
                <input
                  id="groupImageUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </ModalBody>

            <ModalFooter>
              <Button auto flat color="error" onPress={onClose}>
                ยกเลิก
              </Button>
              <Button auto onPress={handleSaveGroup} isLoading={isLoading}>
                สร้าง
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddGroupModal;
