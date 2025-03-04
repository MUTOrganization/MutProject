import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ItemsIcon,BathThaiIcon } from "@/component/Icons";

// ข้อมูลในแต่ละเดือน





// -------------------- CUSTOM TOOLTIP --------------------
function CustomTooltip({ active, payload, label, selectedValueShow }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  // ตรวจสอบว่าเรากำลังดู "จำนวนยอดขาย" หรือ "จำนวนรายการ"
  const isSales = selectedValueShow === "จำนวนยอดขาย";
  const value = payload[0].value;

  // แปลงฟอร์แมตตัวเลข
  const displayValue = isSales ? `$${value}` : `${value} Items`;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "6px",
        padding: "8px 12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        fontSize: "14px",
        color: "#333",
      }}
    >
      {/* แสดงชื่อเดือนด้านบน */}
      <div style={{ marginBottom: "6px", fontWeight: 600 }}>{label}</div>

      {/* แสดงไอคอน + label + value */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {/* ไอคอน */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            color: isSales ? "#fa6342" : "#34a853",
          }}
        >
          {isSales ? <BathThaiIcon /> : <ItemsIcon />}
        </span>
        {/* ข้อความ */}
        <span>
          {isSales ? "ยอดขาย" : "จำนวนรายการ"}: {displayValue}
        </span>
      </div>
    </div>
  );
}

// -------------------- MAIN COMPONENT --------------------
export default function ChartSummary({ showSales, chartData }) {

  const selectedValueShow = useMemo(
    () => Array.from(showSales)[0], // รับค่าแรกจาก Set
    [showSales]
  );

  // ใช้ dataKey ตามค่าที่เลือก
  const dataKey = selectedValueShow;
  const isSales = selectedValueShow === "จำนวนยอดขาย";

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: -10, bottom: 0 }}
        >
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#888", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#888", fontSize: 12 }}
            tickFormatter={(val) => (isSales ? `฿${val.toLocaleString()}` : val.toLocaleString())}
          />
          <Tooltip
            content={<CustomTooltip selectedValueShow={selectedValueShow} />}
          />
          <Bar
            dataKey={dataKey}
            fill={isSales ? "#fa6342" : "#34a853"}
            radius={[4, 4, 0, 0]}
          >
            <LabelList
              dataKey={dataKey}
              position="top"
              formatter={(val) => (isSales ? `฿${val.toLocaleString()}` : val.toLocaleString())}
              fill="#444"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

