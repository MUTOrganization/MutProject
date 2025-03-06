import React, { useState } from "react";
import { Select, SelectItem, Pagination } from "@nextui-org/react";

const mockData = [
  { id: 1, title: "โฆษณา A", category: "สินค้า", month: "มกราคม", year: "2024" },
  { id: 2, title: "โฆษณา B", category: "บริการ", month: "กุมภาพันธ์", year: "2024" },
  { id: 3, title: "โฆษณา C", category: "สินค้า", month: "มีนาคม", year: "2024" },
  { id: 4, title: "โฆษณา D", category: "บริการ", month: "มกราคม", year: "2025" },
  { id: 5, title: "โฆษณา E", category: "อื่นๆ", month: "กุมภาพันธ์", year: "2025" },
  { id: 6, title: "โฆษณา F", category: "สินค้า", month: "มีนาคม", year: "2025" },
];

const categories = ["ทั้งหมด", "สินค้า", "บริการ", "อื่นๆ"];
const months = ["ทั้งหมด", "มกราคม", "กุมภาพันธ์", "มีนาคม"];
const years = ["ทั้งหมด", "2024", "2025"];

const FilteredGrid = () => {
  const [category, setCategory] = useState("ทั้งหมด");
  const [month, setMonth] = useState("ทั้งหมด");
  const [year, setYear] = useState("ทั้งหมด");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // กำหนดจำนวนข้อมูลต่อหน้า

  // ฟิลเตอร์ข้อมูลตามเงื่อนไขที่เลือก
  const filteredData = mockData.filter((item) => {
    return (
      (category === "ทั้งหมด" || item.category === category) &&
      (month === "ทั้งหมด" || item.month === month) &&
      (year === "ทั้งหมด" || item.year === year)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* ฟิลเตอร์ */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <Select label="หมวดหมู่" selectedKeys={[category]} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </Select>

        <Select label="เดือน" selectedKeys={[month]} onChange={(e) => setMonth(e.target.value)}>
          {months.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </Select>

        <Select label="ปี" selectedKeys={[year]} onChange={(e) => setYear(e.target.value)}>
          {years.map((y) => (
            <SelectItem key={y} value={y}>
              {y}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* แสดงข้อมูลเป็น Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {paginatedData.length > 0 ? (
          paginatedData.map((item) => (
            <div key={item.id} className="bg-gray-200 rounded-lg p-4 shadow">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.category} - {item.month} {item.year}</p>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3">ไม่พบข้อมูล</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            total={totalPages}
            initialPage={1}
            page={currentPage}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default FilteredGrid;
