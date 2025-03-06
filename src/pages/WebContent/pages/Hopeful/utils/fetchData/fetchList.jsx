// useLists.js
import { useState, useEffect } from "react";
import fetchProtectedData from "../../../../../../../utils/fetchData";
import { URLS } from "@/config";

export function useLists() {
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLists = async () => {
    setIsLoading(true);
    try {
      const response = await fetchProtectedData.get(URLS.WebContent.getList);
      setLists(response.data);
    } catch (error) {
      console.error("Error fetching list content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return {
    lists,
    isLoading,
    fetchLists, 
  };
}
