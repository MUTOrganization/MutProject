import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Textarea,
  Select,
  SelectItem,
  Switch,
  Chip,
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

const AddItemModal = ({
  isOpen,
  onClose,
  groupId,
  fetchItems,
  onOpenChange,
}) => {
  const [itemName, setItemName] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [itemDescription, setItemDescription] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [itemImage, setItemImage] = useState(null);
  // เลือกเฉพาะเดือน (แสดงชื่อเดือน)
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setItemImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!groupId) {
      console.error("Error: groupId is missing!");
      return;
    }
    if (!selectedMonth) {
      console.error("Error: month is not selected!");
      return;
    }

    // คำนวณเดือนจากชื่อเดือนที่เลือก แล้วใช้ปีปัจจุบันและวัน "01"
    const monthIndex = months.indexOf(selectedMonth) + 1; // 1-12
    const formattedMonth = String(monthIndex).padStart(2, "0");
    const currentYear = new Date().getFullYear();
    const formattedDate = `${currentYear}-${formattedMonth}-01`; // YYYY-MM-DD

    setIsLoading(true);
    const formData = new FormData();
    formData.append("group_id", groupId);
    formData.append("item_name", itemName);
    formData.append("item_description", itemDescription);
    formData.append("drive_link", driveLink);
    formData.append("item_date", formattedDate);
    formData.append("item_status", isEnabled ? 1 : 0);

    if (itemImage) {
      formData.append("image", itemImage);
    }

    try {
      const response = await fetchProtectedData.post(
        URLS.WebContent.createItem,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (!response || response.status !== 200) {
        throw new Error("Failed to create item");
      }

      console.log("Item created successfully:", response.data);

      if (fetchItems) {
        await fetchItems();
      }

      setItemName("");
      setItemDescription("");
      setDriveLink("");
      setItemImage(null);
      setSelectedMonth("");
      onClose();
      toastSuccess('เพิ่ม Link สำเร็จ')
    } catch (error) {
      console.error("Error creating item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} onOpenChange={onOpenChange} >
      <ModalContent>
        <ModalHeader>สร้าง Item ใหม่</ModalHeader>
        <ModalBody>
          <Input
            clearable
            underlined
            fullWidth
            label="ชื่อ Item"
            placeholder="ชื่อ Item"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Textarea
            clearable
            underlined
            fullWidth
            label="คำอธิบาย"
            placeholder="คำอธิบายเพิ่มเติม"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
          />
          <Input
            clearable
            underlined
            fullWidth
            label="ลิงก์เพิ่มเติม (Google Drive)"
            placeholder="วางลิงก์ที่นี่"
            value={driveLink}
            onChange={(e) => setDriveLink(e.target.value)}
          />

          <Select
            label="เดือน"
            selectedKeys={new Set([selectedMonth])}
            onSelectionChange={(keys) => {
              // keys เป็น Set ดังนั้นแปลงเป็น array แล้วเลือกค่าแรก
              const month = Array.from(keys)[0] || "";
              setSelectedMonth(month);
            }}
          >
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </Select>
          <div className="flex items-center justify-between mt-4">
            <span>สิทธิพิเศษสำหรับ Aclog</span>{" "}
            <Chip
              color={isEnabled ? "success" : "danger"}
              className="text-white"
            >
              {isEnabled ? "มีสิทธิ์" : "ไม่มีสิทธิ์"}
            </Chip>
            <Switch
              isSelected={isEnabled}
              onChange={() => setIsEnabled((prev) => !prev)}
            />
          </div>

          {/* อัปโหลดรูปภาพ */}
          <div className="border-2 border-dashed border-gray-400 p-4 flex flex-col items-center justify-center min-h-[200px] mt-4">
            {itemImage ? (
              <div className="relative">
                <img
                  src={URL.createObjectURL(itemImage)}
                  alt="preview"
                  className="max-w-full max-h-[200px] object-contain rounded cursor-pointer"
                  onClick={() =>
                    document.getElementById("itemImageUpload").click()
                  }
                />
              </div>
            ) : (
              <label
                htmlFor="itemImageUpload"
                className="cursor-pointer flex flex-col items-center"
              >
                📷 คลิกเพื่อเพิ่มรูปภาพ
                <p>**จำเป็นต้องมีรูปภาพ**</p>
              </label>
            )}
            <input
              id="itemImageUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </ModalBody>

        <ModalFooter>
          <Button auto flat color="error" onPress={onClose}>
            ❌ ยกเลิก
          </Button>
          <Button auto onPress={handleSubmit} isLoading={isLoading}>
            💾 สร้าง Item
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddItemModal;
