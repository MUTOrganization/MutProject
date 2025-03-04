import { useState, useEffect } from "react";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "@/config";
import { useAppContext } from "@/contexts/AppContext";

export function useStudio() {
  const businessId = useAppContext().currentUser.businessId;
  const [studio, setStudio] = useState([]);
  const [bookingPrivilege, setBookingPrivilege] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชันดึงข้อมูลจากเซิร์ฟเวอร์ (ทั้ง studio และ booking privilege)
  const fetchStudio = async () => {
    setIsLoading(true);
    try {
      const results = await Promise.allSettled([
        fetchProtectedData.get(URLS.WebContent.getBookings),
        fetchProtectedData.post(URLS.WebContent.accessBooking, {
          business_id: businessId,
        }),
      ]);

      // ถ้า fetch ได้ studio ให้เอาข้อมูลมา ถ้าไม่ได้ให้ตั้งเป็นอาร์เรย์ว่าง
      if (results[0].status === "fulfilled") {
        setStudio(results[0].value.data);
      } else {
        setStudio([]);
      }

      // ถ้า fetch ได้ bookingPrivilege ให้เอาข้อมูลมา ถ้าไม่ได้ให้ตั้งเป็น null
      if (results[1].status === "fulfilled") {
        setBookingPrivilege(results[1].value.data);
      } else {
        setBookingPrivilege(null);
      }
    } catch (error) {
      console.error("Error fetching studio or booking privilege:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudio();
    // eslint-disable-next-line
  }, []);

  return {
    studio,
    bookingPrivilege,
    isLoading,
    fetchStudio, // เผื่อเรียกซ้ำจากภายนอก
  };
}
