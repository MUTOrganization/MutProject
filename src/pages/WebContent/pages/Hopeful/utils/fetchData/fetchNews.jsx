// useNews.js
import { useState, useEffect } from "react";
import fetchProtectedData from "../../../../../../../utils/fetchData";
import { URLS } from "@/config";

export function useNews() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชันดึงข้อมูลจากเซิร์ฟเวอร์
  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const response = await fetchProtectedData.get(URLS.WebContent.getNews);

      // สมมติว่ามีฟิลด์ created_at ในข้อมูล
      // เรียง descending ตาม created_at เพื่อให้ข่าวใหม่สุดอยู่ลำดับแรก
      const sortedData = response.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setNews(sortedData);
    } catch (error) {
      console.error("Error fetching news content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ดึงข้อมูลเมื่อ Hook ถูกใช้งานครั้งแรก
  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line
  }, []);

  return {
    news,
    isLoading,
    fetchNews, // เผื่ออยากเรียกซ้ำจากภายนอก
  };
}
