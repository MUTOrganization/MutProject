import fetchProtectedData from "../../../../../../../utils/fetchData";
import { toastError, toastWarning, toastSuccess } from "@/component/Alert";
import { URLS } from "@/config";

export const updatedGroups = async (group, fileEdit, fetchData, closeModal) => {
  try {
    const formData = new FormData();
    formData.append("product_id", group?.id);
    formData.append("header", group.header);
    formData.append("footer", group.footer);
    formData.append("link_url", group.link);
    formData.append("status", group.status);
    formData.append("description", group.description);
    formData.append("is_show_home", group.is_show_home);

    if (fileEdit?.length > 0) {
      fileEdit.forEach((file) => {
        formData.append("image", file);
      });
    }

    console.log("Uploading FormData:", formData);
    await axios.put(`${URLS}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    fetchData();
    closeModal();
    toastSuccess("แก้ไขสินค้าสำเร็จ");
  } catch (error) {
    console.error("Error updating group:", error);
    toastWarning("โปรดตรวจสอบข้อมูลให้ครบ");
  }
};

export const createGroups = async (group, files, fetchData, closeModal) => {
  try {
    const formData = new FormData();
    formData.append("header", group.header);
    formData.append("footer", group.footer);
    formData.append("link_url", group.link);
    formData.append("status", group.status);
    formData.append("description", group.description);

    if (files?.length > 0) {
      files.forEach((file) => {
        formData.append("image", file);
      });
    }

    console.log("Uploading FormData:", formData);
    await axios.post(`${URLS}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    fetchData();
    closeModal();
    toastSuccess("เพิ่ม Group สำเร็จ");
  } catch (error) {
    console.error("Error uploading group:", error);
    toastWarning("โปรดตรวจสอบข้อมูลให้ครบ");
  }
};

export const deleteGroups = async (groupId, fetchData, closeModal) => {
  try {
    await axios.delete(URLS, {
      params: { groups_id: groupId },
    });

    fetchData();
    closeModal();
    toastSuccess("ลบ Group สำเร็จ");
  } catch (error) {
    console.error("Error deleting Group:", error);
    toastError("เกิดข้อผิดพลาดในการลบ Group");
  }
};
