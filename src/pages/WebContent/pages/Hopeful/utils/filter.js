export function getUniqueData(data, key) {
  return Array.from(new Set(data.map((item) => item[key]))).sort();
}

// utils/filter.js (หรือไฟล์ใดก็ได้)
export function getFilteredGroups(
  groups,
  THAI_MONTHS,
  selectedCategory,
  selectedMonth,
  selectedYear
) {
  let filtered = groups;

  if (selectedCategory.length > 0) {
    filtered = filtered.filter((item) =>
      selectedCategory.includes(item.group_category)
    );
  }

  if (selectedMonth.length > 0) {
    filtered = filtered.filter((item) => {
      if (!item.group_date) return false;

      // "YYYY-MM-DD"
      const [year, mm, dd] = item.group_date.split("-");
      const monthIndex = parseInt(mm, 10) - 1; // 0..11
      if (monthIndex < 0 || monthIndex > 11) return false;

      // แปลงเลขเดือนเป็นชื่อเดือนภาษาไทย
      const monthName = THAI_MONTHS[monthIndex];

      // เช็คว่าค่า monthName อยู่ใน selectedMonth หรือไม่
      return selectedMonth.includes(monthName);
    });
  }

  if (selectedYear.length > 0) {
    filtered = filtered.filter((item) => {
      if (!item.group_date) return false;
      const parts = item.group_date.split("-");
      const year = parts[0]; // ดึงส่วนปีจาก "YYYY-MM-DD"
      return selectedYear.includes(year);
    });
  }

  return filtered;
}
