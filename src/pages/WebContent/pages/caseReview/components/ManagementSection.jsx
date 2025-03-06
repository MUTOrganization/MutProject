import React from "react";
import { Button } from "@nextui-org/react";

export default function ManagementSection({ onBack }) {
  // ตัวอย่าง mock
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">ส่วนการจัดการ (เฉพาะแอดมิน)</h2>
      {/* แสดงตารางหรือข้อมูลที่ส่งมาทั้งหมด */}
      <p>ตารางข้อมูลเคสรีวิว... (Admin Only)</p>
      <Button color="secondary" className="mt-4" onPress={onBack}>
        กลับ
      </Button>
    </div>
  );
}
