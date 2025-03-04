import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Switch,
  Select,
  SelectItem,
} from "@nextui-org/react";
import fetchProtectedData from "../../../../../../../../utils/fetchData";
import { URLS } from "@/config";

// ตัวเลือกสำหรับเดือน (ภาษาไทย)
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

// ปี (ย้อนหลัง 5 ถึงอนาคต 5 ปี)
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 11 }, (_, i) => String(currentYear - 5 + i));

const EditGroupModal = ({
  isOpen,
  onOpenChange,
  onClose,
  group,
  fetchGroups,
}) => {
  const [groupName, setGroupName] = useState("");
  const [groupCategory, setGroupCategory] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupImage, setGroupImage] = useState(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // เก็บเป็นสตริงปกติ
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (group) {
      setGroupName(group.group_name || "");
      setGroupCategory(group.group_category || "");
      setGroupDescription(group.group_description || "");
      setGroupImage(group.group_image || null);
      setIsEnabled(group.group_status === 1);

      if (group.group_date) {
        const [year] = group.group_date.split("-");
        if (year) {
          setSelectedYear(year);
        }
      } else {
        setSelectedYear("");
      }
    }
  }, [group]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGroupImage(file);
    }
  };

  const handleSaveGroup = async () => {
    if (!group || !group.group_id) {
      console.error("Error: group_id is missing!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("group_id", group.group_id);

    // เฉพาะค่าที่เปลี่ยนไปจากเดิม
    if (groupName !== group.group_name) {
      formData.append("group_name", groupName);
    }
    if (groupCategory !== group.group_category) {
      formData.append("group_category", groupCategory);
    }
    if (groupDescription !== group.group_description) {
      formData.append("group_description", groupDescription);
    }
    if (isEnabled !== group.group_status) {
      formData.append("group_status", isEnabled ? 1 : 0);
    }

    // แปลงเดือน-ปี -> YYYY-MM-DD (วัน = "01")
    if (selectedYear) {
      const date = new Date(Date.UTC(selectedYear, 1, 1));
      // แปลงเป็น string ในรูปแบบ ISO แล้วตัดเฉพาะส่วนวันที่ (YYYY-MM-DD)
      const formattedDate = date.toISOString().split("T")[0];
      if (group.group_date !== formattedDate) {
        console.log(formattedDate);
        formData.append("group_date", formattedDate);
      }
    }

    // ถ้าเลือกรูปใหม่ (File object) ให้ส่งไฟล์, ถ้าเป็น URL (string) ไม่ต้อง
    if (groupImage && typeof groupImage !== "string") {
      console.log(groupImage);
      formData.append("image", groupImage);
    }

    try {
      const response = await fetchProtectedData.put(
        URLS.WebContent.updateGroup,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (!response || response.status !== 200) {
        throw new Error("Failed to update group");
      }
      console.log("Group updated successfully:", response.data);

      if (fetchGroups) {
        await fetchGroups();
      }
      onClose();
    } catch (error) {
      console.error("Error updating group:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <h2 className="text-xl">📝 แก้ไข Group</h2>
            </ModalHeader>
            <ModalBody>
              <Input
                clearable
                underlined
                fullWidth
                label="ชื่อ Group"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />

              <Input
                clearable
                underlined
                fullWidth
                label="หมวดหมู่"
                value={groupCategory}
                onChange={(e) => setGroupCategory(e.target.value)}
                className="mt-4"
              />

              <Input
                clearable
                underlined
                fullWidth
                label="รายละเอียด Group"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                className="mt-4"
              />

              {/* เลือกเดือน */}
              <div className="flex gap-4 mt-4">
                {/* เลือกปี */}
                <Select
                  label="ปี"
                  placeholder="เลือกปี"
                  selectedKeys={
                    selectedYear ? new Set([selectedYear]) : new Set([])
                  }
                  onSelectionChange={(keys) => {
                    const year = Array.from(keys)[0] || "";
                    setSelectedYear(year);
                  }}
                >
                  {years.map((year) => (
                    <SelectItem key={year}>{year}</SelectItem>
                  ))}
                </Select>
              </div>

              {/* อัปโหลดรูปภาพ */}
              <div className="border-2 border-dashed border-gray-400 p-4 flex flex-col items-center justify-center min-h-[200px] mt-4">
                {groupImage || group.group_image ? (
                  <div className="relative">
                    <img
                      src={
                        groupImage && typeof groupImage !== "string"
                          ? URL.createObjectURL(groupImage)
                          : groupImage || group.group_image
                      }
                      alt="preview"
                      className="max-w-full max-h-[200px] object-contain rounded cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    />
                  </div>
                ) : (
                  <label
                    htmlFor="groupImageUpload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    📷 คลิกเพื่อเพิ่ม/แก้ไขรูปภาพ
                  </label>
                )}
                <input
                  id="groupImageUpload"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* สถานะการใช้งาน */}
              <div className="flex items-center justify-between mt-4">
                <span>สถานะการใช้งาน</span>
                <Switch
                  isSelected={isEnabled}
                  onChange={() => setIsEnabled((prev) => !prev)}
                >
                  {isEnabled ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                </Switch>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button auto flat color="error" onPress={onClose}>
                ❌ ยกเลิก
              </Button>
              <Button auto onPress={handleSaveGroup} isLoading={isLoading}>
                💾 บันทึกการแก้ไข
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditGroupModal;
