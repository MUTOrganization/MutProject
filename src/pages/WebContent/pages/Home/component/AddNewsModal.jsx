import React, { useState, useRef, useMemo } from "react";
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

import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "@/config";
import { toastError, toastSuccess, toastWarning } from "@/component/Alert";

export default function AddNewsModal({
  isOpen,
  onOpenChange,
  onClose,
  fetchNews,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [newsLink, setNewsLink] = useState("");
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const previewMedia = useMemo(() => {
    return files.length > 0 ? [URL.createObjectURL(files[0])] : [];
  }, [files]);

  const handleFileSelection = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFiles([selectedFile]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!files[0]) {
      toastWarning("กรุณาอัปโหลดรูปภาพก่อน");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("news_title", name);
      formData.append("image", files[0]);
      formData.append("news_link", newsLink);

      await fetchProtectedData.post(`${URLS.WebContent.createNews}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ถ้ามีฟังก์ชัน fetchData (ส่งมาจาก parent) เอาไว้รีโหลดรายการหลังสร้างสำเร็จ
      if (typeof fetchNews === "function") {
        await fetchNews();
      }

      // เคลียร์ค่าฟอร์มและปิด Modal
      setName("");
      setNewsLink("");
      setFiles([]);
      onClose();
    } catch (error) {
      console.error("Error creating:", error);
    } finally {
      toastSuccess("เพิ่มรายการสำเร็จ");
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>เพิ่มข่าวสารใหม่</ModalHeader>
        <ModalBody>
          {/* อัปโหลดรูปภาพ */}
          <section>
            <h1 className="flex justify-center items-center font-prompt mb-3">
              รูปปกข่าว
            </h1>
            <div className="border-2 border-dashed border-gray-400 p-4 flex flex-col justify-center items-center min-h-[200px] w-full">
              {previewMedia.length > 0 ? (
                <div className="relative flex justify-center w-full">
                  <Image
                    src={previewMedia[0]}
                    alt="preview"
                    className="max-w-full max-h-[300px] object-contain rounded cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  />
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
                onChange={handleFileSelection}
              />
            </div>
          </section>

          {/* ฟิลด์กรอกข้อมูลข่าว */}
          <div className="space-y-3 mt-4">
            <Input
              label="หัวข้อข่าวสาร"
              required
              clearable
              underlined
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Link ข่าวสาร (ไม่จำเป็น)"
              clearable
              underlined
              fullWidth
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
          <Button
            auto
            color="primary"
            onPress={handleSave}
            isLoading={isLoading}
          >
            บันทึก
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
