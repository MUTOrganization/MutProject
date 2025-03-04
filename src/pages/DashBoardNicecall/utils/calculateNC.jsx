
import { useMemo } from "react";

export function calculateTotals(data) {
    const result = {
      totalPriceSold: 0,  // รวม totalPrice ที่เป็นสินค้าขาย
      totalQtySold: 0,    // รวม qty ที่เป็นสินค้าขาย
      totalQtyFree: 0,    // รวม qty ที่เป็นสินค้าแถม
      totalCommission: 0, // รวม commission
      totalFinalCommission: 0 // รวม finalCommission
    };
  
    data.forEach(item => {
      if (item.type === "สินค้าขาย") {
        result.totalPriceSold += parseFloat(item.totalPrice || 0);
        result.totalQtySold += parseInt(item.qty || 0, 10);
      } else if (item.type === "สินค้าแถม") {
        result.totalQtyFree += parseInt(item.qty || 0, 10);
      }
  
      result.totalCommission += parseFloat(item.commission || 0);
      result.totalFinalCommission += parseFloat(item.finalCommission || 0);
    });
  
    return result;
  }

  export function compareSales(currentMonthSales, previousMonthSales) {
    if (previousMonthSales === 0) {
      // ป้องกันการหารศูนย์
      return currentMonthSales > 0
        ? "+∞%" // หรือ "ยอดเพิ่มขึ้นจาก 0"
        : "0%"; // หรือ "ยอดยังเป็น 0"
    }
  
    const difference = currentMonthSales - previousMonthSales;
    const percentageChange = (difference / previousMonthSales) * 100;
  
    // ถ้า difference > 0 => เพิ่ม "+"
    // ถ้า difference < 0 => "-"
    // ถ้า difference = 0 => "" (ไม่มีเครื่องหมาย)
    let sign = "";
    if (difference > 0) sign = "+";
    else if (difference < 0) sign = "-";
  
    return sign + Math.abs(percentageChange).toFixed(1) + "%";
  }
  

  export const groupAndCalculate = (data) => {
    // 1) รวมข้อมูลตาม type / productName
    const groupedData = data.reduce((acc, item) => {
      const { type, productName, qty, price } = item;
      if (!acc[type]) {
        acc[type] = {};
      }
      if (!acc[type][productName]) {
        acc[type][productName] = { totalQty: 0, totalPrice: 0 };
      }
  
      acc[type][productName].totalQty += qty;
  
      // สินค้าแถมให้ totalPrice = 'FREE'
      if (type === "สินค้าแถม") {
        acc[type][productName].totalPrice = "FREE";
      } else {
        acc[type][productName].totalPrice += qty * (price || 0);
      }
  
      return acc;
    }, {});
  
    // 2) สร้าง result ใหม่ เพื่อ sort เฉพาะ 'สินค้าขาย'
    const result = {};
  
    Object.keys(groupedData).forEach((type) => {
      // ถ้าไม่ใช่ 'สินค้าขาย' ไม่เปลี่ยนลำดับ
      if (type !== "สินค้าขาย") {
        result[type] = groupedData[type];
        return;
      }
  
      // ถ้าเป็น 'สินค้าขาย' -> แปลงเป็น array เพื่อ sort
      // entries = [ [productName, {totalQty, totalPrice}], ...]
      const entries = Object.entries(groupedData[type]);
  
      // sort เรียงจาก totalQty มาก → น้อย
      // ถ้าอยากเรียงตาม totalPrice ให้เปลี่ยนเงื่อนไขเอง
      entries.sort(([, a], [, b]) => b.totalPrice - a.totalPrice);
  
      // 3) แปลงกลับเป็น object ตามลำดับที่ sort แล้ว
      const sortedObj = {};
      for (const [productName, info] of entries) {
        sortedObj[productName] = info;
      }
  
      result[type] = sortedObj;
    });
  
    return result;
  };
  


// ฟังก์ชันแปลงข้อมูล
export const useChartData = (data) => {
  return useMemo(() => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // กรองเฉพาะ "สินค้าขาย" และจัดกลุ่มตามเดือน
    const groupedData = data
      .filter((item) => item.type === "สินค้าขาย") // กรองเฉพาะสินค้าขาย
      .reduce((acc, item) => {
        const [yearStr, monthStr] = item.orderMonthyear.split("-"); // ดึง year กับ month (เป็น string)
        const monthIndex = parseInt(monthStr, 10) - 1; // ดึงเดือน (index 0-11)
        const month = monthNames[monthIndex]; // แปลง index เป็นชื่อเดือน

        if (!acc[month]) {
          acc[month] = { month, จำนวนยอดขาย: 0, จำนวนรายการ: 0 };
        }

        acc[month].จำนวนยอดขาย += parseFloat(item.price) || 0; // รวมยอดขาย
        acc[month].จำนวนรายการ += item.qty || 0; // รวมจำนวนรายการ

        return acc;
      }, {});

    // แปลงจาก Object กลับเป็น Array
    const result = Object.values(groupedData);

    // เรียงลำดับจากเดือนต้นปี -> ปลายปี
    const sortedResult = result.sort(
      (a, b) =>
        monthNames.indexOf(a.month) - monthNames.indexOf(b.month)
    );

    return sortedResult;
  }, [data]);
};



export function chunkArray(array, chunkSize) {
  const results = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const slice = array.slice(i, i + chunkSize);
    results.push(slice);
  }
  return results;
}