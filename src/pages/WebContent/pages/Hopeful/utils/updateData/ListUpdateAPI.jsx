import fetchProtectedData from "../../../../../../../utils/fetchData";
import { toastError,toastWarning,toastSuccess } from "@/component/Alert";
import { URLS } from "@/config";


export const updatedLists = async (lists, fileEdit, fetchData, closeModal) => {
    try {
        const formData = new FormData();
        formData.append("product_id", lists?.id);
        formData.append("header", lists.header);
        formData.append("footer", lists.footer);
        formData.append("link_url", lists.link);
        formData.append("status", lists.status);
        formData.append("description", lists.description);
        formData.append("is_show_home", lists.is_show_home);

        if (fileEdit?.length > 0) {
            fileEdit.forEach((file) => {
                formData.append("image", file);
            });
        }

        console.log("Uploading FormData:", formData);
        await axios.put(`${URLS.api.updateProduct}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        fetchData();
        closeModal();
        toastSuccess("แก้ไขสินค้าสำเร็จ");
    } catch (error) {
        console.error("Error updating lists:", error);
        toastWarning("โปรดตรวจสอบข้อมูลให้ครบ");
    }
};

export const createLists = async (lists, files, fetchData, closeModal) => {
    try {
        const formData = new FormData();
        formData.append("header", lists.header);
        formData.append("footer", lists.footer);
        formData.append("link_url", lists.link);
        formData.append("status", lists.status);
        formData.append("description", lists.description);

        if (files?.length > 0) {
            files.forEach((file) => {
                formData.append("image", file);
            });
        }

        console.log("Uploading FormData:", formData);
        await axios.post(`${URLS.api.createProduct}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        fetchData();
        closeModal();
        toastSuccess("เพิ่ม List สำเร็จ");
    } catch (error) {
        console.error("Error uploading lists:", error);
        toastWarning("โปรดตรวจสอบข้อมูลให้ครบ");
    }
};

export const deleteLists= async (listsId, fetchData, closeModal) => {
    try {
        await axios.delete(URLS.api.deleteLists, {
            params: { lists_id: listsId },
        });

        fetchData();
        closeModal();
        toastSuccess("ลบ List สำเร็จ");
    } catch (error) {
        console.error("Error deleting List:", error);
        toastError("เกิดข้อผิดพลาดในการลบ List");
    }
};
