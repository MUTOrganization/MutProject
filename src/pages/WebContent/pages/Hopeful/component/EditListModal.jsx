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
import { DeleteIcon, ImportFileIcon } from "@/component/Icons";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "@/config"; // <== และ URLS
import { toastError, toastSuccess, toastWarning } from "@/component/Alert";

const EditListModal = ({ isOpen, onOpenChange, onClose, list, fetchData }) => {
  const fileInputRef = useRef(null);
  const [listName, setListName] = useState("");
  const [files, setFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (list) {
      setListName(list.list_name || "");
      setImagePreview(list.list_image || "");
      setFiles([]);
    }
  }, [list]);

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

  const handleSubmit = async () => {
    if (!listName) {
      toastWarning("กรุณาใส่ชื่อรายการ");
      return;
    }
    if (!list) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("list_id", list.list_id);
      formData.append("list_name", listName);
      if (files.length > 0) {
        formData.append("image", files[0]);
      }
      await fetchProtectedData.put(`${URLS.WebContent.updateList}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (typeof fetchData === "function") {
        await fetchData();
      }
      onClose();
      setFiles([]);
      setImagePreview("");
      setListName("");
    } catch (error) {
      console.error("Error updating list:", error);
      toastError("แก้ไขรายการไม่สำเร็จ");
    } finally {
      setIsLoading(false);
      toastSuccess("แก้ไขรายการสำเร็จ");
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <h2 className="text-xl">แก้ไข List</h2>
            </ModalHeader>
            <ModalBody>
              {/* ส่วนจัดการรูปภาพ */}
              <section>
                <h1 className="flex justify-center items-center md:text-xl font-prompt mb-3">
                  รูปปกของ List
                </h1>
                <div className="border-2 border-dashed border-gray-400 p-4 flex flex-col justify-center items-center min-h-[300px] w-full">
                  {imagePreview ? (
                    <div className="relative flex flex-col justify-center w-full space-y-5">
                      <div className="flex  justify-center ">
                        <Image
                          src={imagePreview}
                          alt="preview"
                          className="max-w-full max-h-[300px] object-contain rounded cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        />
                      </div>
                      <div className="flex flex-col  justify-center text-center font-prompt text-sm ">
                        <p>กดเพื่อเปลี่ยนรูปภาพ</p>
                        <p>**จำเป็นต้องมีรูปภาพ**</p>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="editImageUpload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <ImportFileIcon className="w-10 h-10 text-gray-400" />
                      <p>กดเพื่อเพิ่มรูปภาพ</p>
                    </label>
                  )}
                  <input
                    ref={fileInputRef}
                    id="editImageUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </section>

              {/* ส่วนแก้ไขชื่อ List */}
              <Input
                clearable
                underlined
                fullWidth
                label="ชื่อ List"
                placeholder="ชื่อ List"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
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
              <Button auto onPress={handleSubmit} isLoading={isLoading}>
                บันทึกการแก้ไข
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditListModal;
