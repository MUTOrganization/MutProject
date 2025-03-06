import React, { useState, useRef, useMemo } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  ModalContent,
  Image,
} from "@nextui-org/react";
import { DeleteIcon, ImportFileIcon } from "@/component/Icons";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "@/config";
import { toastSuccess, toastWarning, toastError } from "@/component/Alert";

function AddListModal({ isOpen, onOpenChange, onClose, fetchData }) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [newListName, setNewListName] = useState("");

  // สร้าง URL Preview จากไฟล์ที่เลือก
  const previewMedia = useMemo(() => {
    return files.length > 0 ? [URL.createObjectURL(files[0])] : [];
  }, [files]);

  // เมื่อเลือกไฟล์ใหม่
  const handleFileSelection = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFiles([selectedFile]); // จำกัดให้เลือกได้ครั้งละ 1 ไฟล์
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
      formData.append("list_name", newListName);
      formData.append("image", files[0]);

      await fetchProtectedData.post(`${URLS.WebContent.createList}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ถ้ามีฟังก์ชัน fetchData (ส่งมาจาก parent) เอาไว้รีโหลดรายการหลังสร้างสำเร็จ
      if (typeof fetchData === "function") {
        await fetchData();
      }

      // เคลียร์ค่าฟอร์มและปิด Modal
      setNewListName("");
      setFiles([]);
      onClose();
    } catch (error) {
      console.error("Error creating new list:", error);
    } finally {
      toastSuccess("เพิ่มรายการสำเร็จ");
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h2 className="text-xl">{"สร้าง List ใหม่"}</h2>
            </ModalHeader>
            <ModalBody>
              {/* ส่วนแสดงตัวอย่างรูปภาพ / อัพโหลด */}
              <section>
                <h1 className="flex justify-center items-center md:text-xl font-prompt mb-3">
                  รูปปกของ List
                </h1>
                <div className="border-2 border-dashed border-gray-400 p-4 flex flex-col justify-center items-center min-h-[300px] w-full">
                  {previewMedia.length > 0 ? (
                    <div className="relative flex flex-col justify-center w-full">
                      <Image
                        src={previewMedia[0]}
                        alt="preview"
                        className="max-w-full max-h-[300px] object-contain rounded cursor-pointer"
                        onClick={() => fileInputRef.current.click()}
                      />
                      <p className="text-center mt-3">กดที่รูปเพื่อเปลี่ยนรูปภาพ</p>
                    </div>
                  ) : (
                    <label
                      htmlFor="imageUpload"
                      className="p-6 text-center rounded-md cursor-pointer w-full max-w-lg flex flex-col items-center justify-center"
                    >
                      <ImportFileIcon className="w-10 h-10 text-gray-400" />
                      <p>กดเพื่อเพิ่มรูปภาพ</p>
                    </label>
                  )}

                  <input
                    required
                    ref={fileInputRef}
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    multiple={false}
                    className="hidden"
                    onChange={handleFileSelection}
                  />
                </div>
              </section>

              {/* Input สำหรับชื่อ List */}
              <Input
                required
                clearable
                underlined
                fullWidth
                label="ชื่อ List"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
              />
            </ModalBody>

            <ModalFooter>
              <Button
                auto
                flat
                color="error"
                onPress={() => onOpenChange(false)}
              >
                ยกเลิก
              </Button>
              <Button auto onPress={handleSave} isLoading={isLoading}>
                {"สร้าง"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default AddListModal;
