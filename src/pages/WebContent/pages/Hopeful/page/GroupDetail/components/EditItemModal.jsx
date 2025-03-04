import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Textarea,
  Image,
  Select,
  SelectItem,
  Chip,
  Switch,
} from "@nextui-org/react";
import fetchProtectedData from "../../../../../../../../utils/fetchData"; // ฟังก์ชันสำหรับ API
import { URLS } from "@/config"; // URL ของ API
import { toastError, toastSuccess, toastWarning } from "@/component/Alert";
import { getUniqueData, getFilteredGroups } from "../../../utils/filter";
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

const EditItemModal = ({
  isOpen,
  onClose,
  item,
  fetchItems,
  onEditOpenChange,
}) => {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [itemImage, setItemImage] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(""); // state สำหรับเลือกเดือน
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const fileInputRef = useRef(null); // ใช้ Ref สำหรับ input file

  useEffect(() => {
    if (item) {
      setItemName(item.item_name || "");
      setItemDescription(item.item_description || "");
      setDriveLink(item.drive_link || "");
      setItemImage(item.item_image || null);
      setIsEnabled(item.item_status || "");

      if (item.item_date) {
        // แปลงวันที่จาก UTC ไปเป็นเวลาของไทย โดยบวก 7 ชั่วโมง
        const utcDate = new Date(item.item_date);
        const thaiDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);

        // ดึงค่าเดือน (0-11)
        const monthIndex = thaiDate.getMonth();
        if (monthIndex >= 0 && monthIndex < 12) {
          setSelectedMonth(months[monthIndex]);
        } else {
          setSelectedMonth("");
        }
      }
    }
  }, [item]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setItemImage(selectedFile);
    }
  };

  // ฟังก์ชันสำหรับลบรูปภาพออกจาก state และล้างค่า input file
  const handleRemoveImage = () => {
    setItemImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveItem = async () => {
    if (!item || !item.item_id) {
      console.error("Error: item_id is missing!");
      return;
    }
    if (!itemImage) {
      toastWarning("กรุณาเพิ่มรูปภาพ");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("item_id", item.item_id);
      formData.append("item_name", itemName || "");
      formData.append("item_description", itemDescription || "");
      formData.append("drive_link", driveLink || "");
      formData.append("item_status", isEnabled ? 1 : 0);

      // ถ้ามีไฟล์ใหม่ (ไม่ใช่ string URL) ให้ส่งไฟล์ไปด้วย
      if (itemImage && typeof itemImage !== "string") {
        formData.append("image", itemImage);
      }

      // หากมีการเลือกเดือน ให้คำนวณ item_date โดยใช้ปีปัจจุบัน, เดือนที่เลือก และวัน "01"
      if (selectedMonth) {
        const monthIndex = months.indexOf(selectedMonth); // 0-11
        const currentYear = new Date().getFullYear();
        // สร้างวันที่ในรูปแบบ UTC โดยใช้ Date.UTC (เดือนเริ่มที่ 0)
        const utcDate = new Date(Date.UTC(currentYear, monthIndex, 1));
        // แปลงเป็น string ISO แล้วตัดเฉพาะส่วนวันที่ (YYYY-MM-DD)
        const formattedDate = utcDate.toISOString().split("T")[0];
        console.log(formattedDate);

        formData.append("item_date", formattedDate);
      }

      const response = await fetchProtectedData.put(
        URLS.WebContent.updateItem,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (!response || response.status !== 200) {
        throw new Error("Failed to update item");
      }

      console.log("Item updated successfully:", response.data);

      if (fetchItems) {
        await fetchItems(); // ดึงข้อมูลใหม่หลังจากแก้ไขเสร็จ
      }

      onClose();
    } catch (error) {
      console.error("Error updating item:", error);
      toastError("แก้ไขรายการไม่สำเร็จ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onEditOpenChange}
      className="max-h-[750px] overflow-y-auto"
    >
      <ModalContent>
        <ModalHeader>📝 แก้ไข Item</ModalHeader>
        <ModalBody>
          <Input
            clearable
            underlined
            fullWidth
            label="ชื่อ Item"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Textarea
            clearable
            underlined
            fullWidth
            label="คำอธิบาย"
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

          {/* ส่วนสำหรับเลือกเดือน */}
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

          {/* ส่วนสำหรับอัปโหลด/แก้ไขรูปภาพ */}
          <div className="border-2 border-dashed border-gray-400 p-4 flex flex-col items-center justify-center min-h-[200px] mt-4">
            {itemImage ? (
              <div className="relative flex flex-col items-center">
                <Image
                  src={
                    typeof itemImage === "string"
                      ? itemImage
                      : URL.createObjectURL(itemImage)
                  }
                  alt="preview"
                  className="max-w-full max-h-[200px] object-contain rounded cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                />
                <p
                  className="text-sm mt-2 cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                >
                  กดที่รูปเพื่อเปลี่ยนรูปภาพ
                </p>
                <Button auto flat color="error" onPress={handleRemoveImage}>
                  ลบรูปภาพ
                </Button>
              </div>
            ) : (
              <label
                htmlFor="itemImageUpload"
                className="cursor-pointer flex flex-col items-center"
              >
                📷 คลิกเพื่อเพิ่ม/แก้ไขรูปภาพ
              </label>
            )}
            <input
              ref={fileInputRef}
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
          <Button auto onPress={handleSaveItem} isLoading={isLoading}>
            💾 บันทึกการแก้ไข
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditItemModal;
