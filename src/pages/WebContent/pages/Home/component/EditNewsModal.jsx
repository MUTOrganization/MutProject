import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Image,
} from "@nextui-org/react";
import { ImportFileIcon } from "@/component/Icons";
import { toastError, toastSuccess, toastWarning } from "@/component/Alert";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "@/config";

export default function EditNewsModal({
  isOpen,
  onOpenChange,
  selectedNews,
  onClose,
  fetchNews,
}) {
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [newsLink, setNewsLink] = useState("");
  const [files, setFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // โหลดค่าเริ่มต้นของ selectedNews เมื่อ modal ถูกเปิด
  useEffect(() => {
    if (selectedNews) {
      setName(selectedNews.news_title || "");
      setNewsLink(selectedNews.news_link || "");
      setImagePreview(selectedNews.news_image || "");
      setFiles([]);
    }
  }, [selectedNews]);

  // เมื่อผู้ใช้เลือกไฟล์ใหม่
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFiles([selectedFile]);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ฟังก์ชันอัปเดต List โดยใช้ PUT /update/selectedNews
  const handleSubmit = async () => {
    // ตรวจสอบว่ามีรูปหรือไม่
    if (!name) {
      // อาจจะใช้ alert, toast หรือ UI เตือนอะไรก็ได้
      toastWarning("กรุณาใส่ชื่อรายการ");
      return;
    }
    if (!selectedNews) return; // ถ้าไม่มี selectedNews ไม่ทำงานต่อ
    setIsLoading(true);

    try {
      // สร้าง FormData สำหรับส่ง multipart/form-data
      const formData = new FormData();
      formData.append("news_id", selectedNews.id); // ส่ง list_id ที่ได้จาก selectedNews
      formData.append("news_title", name);
      formData.append("news_link", newsLink);

      // ถ้า user เลือกไฟล์ใหม่ จึงค่อย append
      if (files.length > 0) {
        formData.append("image", files[0]); // key "image" ต้องตรงกับฝั่ง backend
      }

      // เรียก PUT ไปยัง endpoint update/selectedNews
      await fetchProtectedData.put(`${URLS.WebContent.updateNews}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // หากต้องการรีเฟรชข้อมูลใหม่หลังอัปเดตสำเร็จ
      if (typeof fetchNews === "function") {
        await fetchNews();
      }

      // ปิด Modal และเคลียร์ค่า
      onClose();
      setFiles([]);
      setImagePreview("");
      setName("");
      setNewsLink("");
    } catch (error) {
      console.error("Error updating selectedNews:", error);
      toastError("แก้ไขรายการไม่สำเร็จ");
    } finally {
      setIsLoading(false);
      toastSuccess("แก้ไขรายการสำเร็จ");
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>แก้ไขข่าวสาร</ModalHeader>
        <ModalBody>
          {/* อัปโหลดรูปภาพ */}
          <section>
            <h1 className="flex justify-center items-center font-prompt mb-3">
              รูปปกข่าว (แก้ไข)
            </h1>
            <div className="border-2 border-dashed border-gray-400 p-4 flex flex-col justify-center items-center min-h-[200px] w-full">
              {imagePreview ? (
                <div className="relative flex flex-col justify-center w-full">
                  <Image
                    src={imagePreview}
                    alt="preview"
                    className="max-w-full max-h-[300px] object-contain rounded cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  />
                  <div className="flex flex-col  justify-center text-center font-prompt text-sm ">
                    <p>กดเพื่อเปลี่ยนรูปภาพ</p>
                    <p>**จำเป็นต้องมีรูปภาพ**</p>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="newsImageUpload"
                  className="p-6 text-center rounded-md cursor-pointer w-full max-w-lg flex flex-col items-center justify-center"
                >
                  <ImportFileIcon className="w-10 h-10 text-gray-400" />
                  <p>กดเพื่อเพิ่มรูปภาพ</p>
                </label>
              )}
              <input
                id="newsImageUpload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple={false}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </section>

          {/* ฟิลด์กรอกข้อมูลข่าว */}
          <div className="space-y-3 mt-4">
            <Input
              label="หัวข้อข่าว (news_title)"
              name="news_title"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Link ข่าวสาร (ไม่จำเป็น)"
              name="news_link"
              value={newsLink}
              onChange={(e) => setNewsLink(e.target.value)}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="flat"
            onPress={() => onOpenChange(false)}
          >
            ยกเลิก
          </Button>
          <Button auto onPress={handleSubmit} isLoading={isLoading}>
            บันทึก
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
