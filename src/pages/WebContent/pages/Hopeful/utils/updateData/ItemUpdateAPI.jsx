import fetchProtectedData from "../../../../../../../utils/fetchData";
import { toastError,toastWarning,toastSuccess } from "@/component/Alert";
import { URLS } from "@/config";


export const updatedItems = async (Item, fileEdit, fetchData, closeModal) => {
    try {
        const formData = new FormData();
        formData.append("product_id", Item?.id);
        formData.append("header", Item.header);
        formData.append("footer", Item.footer);
        formData.append("link_url", Item.link);
        formData.append("status", Item.status);
        formData.append("description", Item.description);
        formData.append("is_show_home", Item.is_show_home);

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
        console.error("Error updating Item:", error);
        toastWarning("โปรดตรวจสอบข้อมูลให้ครบ");
    }
};

export const createItems = async (Item, files, fetchData, closeModal) => {
    try {
        const formData = new FormData();
        formData.append("header", Item.header);
        formData.append("footer", Item.footer);
        formData.append("link_url", Item.link);
        formData.append("status", Item.status);
        formData.append("description", Item.description);

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
        console.error("Error uploading Item:", error);
        toastWarning("โปรดตรวจสอบข้อมูลให้ครบ");
    }
};

export const deleteItems= async (ItemId, fetchData, closeModal) => {
    try {
        await axios.delete(URLS.api.deleteLists, {
            params: { items_id: ItemId },
        });

        fetchData();
        closeModal();
        toastSuccess("ลบ List สำเร็จ");
    } catch (error) {
        console.error("Error deleting List:", error);
        toastError("เกิดข้อผิดพลาดในการลบ List");
    }
};
