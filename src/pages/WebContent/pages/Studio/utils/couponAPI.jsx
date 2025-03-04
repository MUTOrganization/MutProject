import { useState, useEffect } from "react";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "@/config";

export async function fetchCoupon(businessId) {
  try {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const padZero = (num) => num.toString().padStart(2, "0");
    const startDateStr = `${firstDay.getFullYear()}-${padZero(firstDay.getMonth() + 1)}-${padZero(firstDay.getDate())} 00:00:00`;
    const endDateStr = `${lastDay.getFullYear()}-${padZero(lastDay.getMonth() + 1)}-${padZero(lastDay.getDate())} 23:59:59`;

    const payload = {
      startDate: startDateStr,
      endDate: endDateStr,
      businessId,
    };

    const response = await fetchProtectedData.post(
      URLS.WebContent.getCoupon,
      payload
    );
    if (response.status === 200 && response.data) {
      return response.data;
    }
    return null;
  } catch (err) {
    console.error("Error fetching coupon (POST):", err);
  }
}

export async function fetchReviewCoupon(businessId) {
  try {
    const response = await fetchProtectedData.get(
      `${URLS.WebContent.allCoupon}?businessId=${businessId}`
    );
    if (response.status === 200 && response.data) {
      return response.data;
    }
    return null;
  } catch (err) {
    console.error("Error fetching review coupon (GET):", err);
    throw err;
  }
}

export async function fetchRate() {
  try {
    const response = await fetchProtectedData.get(`${URLS.WebContent.getRate}`);
    if (response.status === 200 && response.data) {
      return response.data.rate_amount;
    }
    return null;
  } catch (err) {
    console.error("Error fetching rate (GET):", err);
    throw err;
  }
}

export function useCoupon(businessId) {
  const [couponData, setCouponData] = useState(null);
  const [reviewCoupon, setReviewCoupon] = useState(null);
  const [rate, setRate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCouponData = async () => {
    setIsLoading(true);
    try {
      const coupon = await fetchCoupon(businessId);
      setCouponData(coupon);

      const review = await fetchReviewCoupon(businessId);
      setReviewCoupon(review);

      const rateAmount = await fetchRate(businessId);
      setRate(rateAmount);
    } catch (error) {
      console.error("Error fetching coupon data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchCouponData();
    }
  }, [businessId]);

  return {
    couponData,
    reviewCoupon,
    rate,
    isLoading,
    fetchCouponData,
  };
}
