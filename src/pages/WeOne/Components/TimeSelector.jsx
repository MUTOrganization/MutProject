import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { toastError } from "../../../component/Alert";
import { now, toCalendarDate, getLocalTimeZone } from "@internationalized/date";
const toMySQLTime = (calendarDate) => {
    const jsDate = calendarDate.toDate(getLocalTimeZone());
    return dayjs(jsDate).format("HH:mm:ss"); // เฉพาะเวลา
  };
  

function TimeSelector({ onChange, resetTime }) {
  const [selectedStartTime, setSelectedStartTime] = useState(toMySQLTime(now(getLocalTimeZone())));
  const [selectedEndTime, setSelectedEndTime] = useState(toMySQLTime(now(getLocalTimeZone())));

  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    setSelectedStartTime(newStartTime);

    // ถ้าเวลาสิ้นสุดก่อนเวลาเริ่มต้น ให้ปรับเวลาสิ้นสุดให้เท่ากับเวลาเริ่มต้น
    if (newStartTime > selectedEndTime) {
      setSelectedEndTime(newStartTime);
      onChange({
        start: newStartTime,
        end: newStartTime,
      });
    } else {
      onChange({
        start: newStartTime,
        end: selectedEndTime,
      });
    }
  };

  const handleEndTimeChange = (e) => {
    const newEndTime = e.target.value;

    if (newEndTime < selectedStartTime) {
      toastError("ไม่สามารถเลือกเวลาสิ้นสุดก่อนเวลาเริ่มต้นได้");
      setSelectedEndTime(selectedStartTime);
      onChange({
        start: selectedStartTime,
        end: selectedStartTime,
      });
    } else {
      setSelectedEndTime(newEndTime);
      onChange({
        start: selectedStartTime,
        end: newEndTime,
      });
    }
  };

  useEffect(() => {
    if (resetTime) {
      // รีเซ็ตเวลาเริ่มต้นและสิ้นสุดกลับไปที่ค่าเริ่มต้น
      const defaultTime = "12:00";
      setSelectedStartTime(defaultTime);
      setSelectedEndTime(defaultTime);
      onChange({
        start: defaultTime,
        end: defaultTime,
      });
    }
  }, [resetTime]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* เวลาเริ่มต้น */}
      <div className="flex flex-row items-center gap-3 w-full">
        <h3 className="text-sm font-medium text-left w-auto">
          เวลาเริ่มต้น:
        </h3>
        <input
          type="time"
          value={selectedStartTime}
          onChange={handleStartTimeChange}
          className="border rounded-xl p-1 flex-grow font-light text-center"
        />
      </div>

      {/* เวลาสิ้นสุด */}
      <div className="flex flex-row items-center gap-3 w-full">
        <h3 className="text-sm font-medium text-left w-auto">
          เวลาสิ้นสุด:
        </h3>
        <input
          type="time"
          value={selectedEndTime}
          onChange={handleEndTimeChange}
          className="border rounded-xl p-1 flex-grow font-light text-center"
        />
      </div>
    </div>
  );
}

export default TimeSelector;
