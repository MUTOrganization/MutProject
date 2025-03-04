import { useState, useEffect } from "react";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "@/config";
import { useAppContext } from "@/contexts/AppContext";
// สมมติว่า ACCESS ถูก import จากที่ใดที่หนึ่ง
import { ACCESS } from "@/configs/access";

export function useCase() {
  const currentData = useAppContext();
  const businessId = currentData.currentUser.businessId;
  const [caseReview, setCaseReview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCase = async () => {
    setIsLoading(true);
    try {
      const response = await fetchProtectedData.get(URLS.WebContent.getCase);
      let data = response.data;
      // หากผู้ใช้ไม่มีสิทธิ์ admin_content ให้กรองข้อมูลตาม businessId
      if (!currentData.accessCheck.haveAny([ACCESS.admin_content.admin_content])) {
        data = data.filter((item) => item.business_id === businessId);
      }
      setCaseReview(data);
    } catch (error) {
      console.error("Error fetching list content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCase();
  }, []);

  return {
    caseReview,
    isLoading,
    fetchCase,
  };
}
