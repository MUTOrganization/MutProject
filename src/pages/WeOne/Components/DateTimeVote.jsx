import React, { useState, useEffect } from "react";
import {
  DatePicker,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  DateInput,
  Button,
} from "@nextui-org/react"; // สมมติว่าใช้ Dropdown จาก NextUI
import dayjs from "dayjs";
import { now, toCalendarDate, getLocalTimeZone } from "@internationalized/date";
import {
  toastError,
  toastSuccess,
  toastWarning,
} from "../../../component/Alert";

function DateTimeVote({ onChange, resetDate }) {
  const [selectedStart, setSelectedStart] = useState(now(getLocalTimeZone()));
  const [selectedEnd, setSelectedEnd] = useState(now(getLocalTimeZone()));
  const [endMode, setEndMode] = useState("custom");

  const presetOptions = [
    { label: "1 ชั่วโมง", value: "1h" },
    { label: "1 วัน", value: "1d" },
    { label: "1 สัปดาห์", value: "1w" },
    { label: "1 เดือน", value: "1m" },
    { label: "1 ปี", value: "1y" },
  ];

  const toMySQLDateTime = (calendarDate) => {
    const jsDate = calendarDate.toDate(getLocalTimeZone());
    return dayjs(jsDate).format("YYYY-MM-DD HH:mm");
  };

  useEffect(() => {
    if (selectedEnd.compare(selectedStart) < 0) {
      setSelectedEnd(selectedStart);
    }
  }, [selectedStart]);

  useEffect(() => {
    if (resetDate) {
      const resetValue = now(getLocalTimeZone());
      setSelectedStart(resetValue);
      setSelectedEnd(resetValue);
      onChange({
        start: toMySQLDateTime(resetValue),
        end: toMySQLDateTime(resetValue),
      });
    }
  }, [resetDate]);

  const handleStartChange = (newValue) => {
    setSelectedStart(newValue);
    if (endMode === "custom") {
      if (selectedEnd.compare(newValue) < 0) {
        setSelectedEnd(newValue);
        onChange({
          start: toMySQLDateTime(newValue),
          end: toMySQLDateTime(newValue),
        });
      } else {
        onChange({
          start: toMySQLDateTime(newValue),
          end: toMySQLDateTime(selectedEnd),
        });
      }
    } else {
      handlePresetChange(endMode); // Recalculate preset end date
    }
  };

  const handleEndChange = (newValue) => {
    if (newValue.compare(selectedStart) < 0) {
      toastError("ไม่สามารถเลือกวันสิ้นสุดเป็นอดีตได้ กรุณาเลือกอนาคต");
      setSelectedEnd(selectedStart);
      onChange({
        start: toMySQLDateTime(selectedStart),
        end: toMySQLDateTime(selectedStart),
      });
    } else {
      setSelectedEnd(newValue);
      onChange({
        start: toMySQLDateTime(selectedStart),
        end: toMySQLDateTime(newValue),
      });
    }
  };

  const handlePresetChange = (preset) => {
    setEndMode(preset);
    let newEnd;
    switch (preset) {
      case "1h":
        newEnd = selectedStart.add({ hours: 1 });
        break;
      case "1d":
        newEnd = selectedStart.add({ days: 1 });
        break;
      case "1w":
        newEnd = selectedStart.add({ weeks: 1 });
        break;
      case "1m":
        newEnd = selectedStart.add({ months: 1 });
        break;
      case "1y":
        newEnd = selectedStart.add({ years: 1 });
        break;
      default:
        newEnd = selectedEnd; // Keep current end value
    }
    setSelectedEnd(newEnd);
    onChange({
      start: toMySQLDateTime(selectedStart),
      end: toMySQLDateTime(newEnd),
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Start Date-Time Picker */}
      <div className="flex flex-row items-center gap-3 w-full">
        <h3 className="text-sm font-medium text-left w-auto">วันเริ่มต้น :</h3>
        <DatePicker
          defaultValue={now(getLocalTimeZone())}
          variant="bordered"
          hideTimeZone
          showMonthAndYearPickers
          granularity="minute" // Only show hour and minute
          aria-label="Select start date and time"
          value={selectedStart}
          onChange={(value) => handleStartChange(value)}
          type="datetime"
          scrollShadowProps={{
            isEnabled: false,
          }}
          className="flex-grow"
        />
      </div>

      {/* End Mode Selector */}
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="flex flex-row items-center gap-6 w-full">
          <h3 className="text-sm font-medium text-left w-auto">
            รูปแบบวันสิ้นสุด :
          </h3>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="ghost">
                {endMode === "custom"
                  ? "กำหนดเอง"
                  : presetOptions.find((opt) => opt.value === endMode)?.label ||
                    "เลือก"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu onAction={(key) => handlePresetChange(key)}>
              <DropdownItem key="custom">กำหนดเอง</DropdownItem>
              {presetOptions.map((opt) => (
                <DropdownItem key={opt.value}>{opt.label}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* End Date-Time Picker */}
      {endMode !== "custom" ? (
        <div className="flex flex-row items-center gap-3 w-full">
          <h3 className="text-sm font-medium text-left w-auto">วันสิ้นสุด :</h3>
          <DateInput
            isReadOnly={endMode !== "custom"} // Enable editing only for "custom"
            granularity="minute" // Only show hour and minute
            variant="bordered"
            hideTimeZone
            showMonthAndYearPickers
            value={selectedEnd}
            onChange={(value) => handleEndChange(value)}
            type="datetime"
            scrollShadowProps={{
              isEnabled: false,
            }}
            className="flex-grow"
            aria-label="Select end date and time"
          />
        </div>
      ) : (
        <div className="flex flex-row items-center gap-3 w-full">
          <h3 className="text-sm font-medium text-left w-auto">วันสิ้นสุด :</h3>
          <DatePicker
            defaultValue={now(getLocalTimeZone())}
            variant="bordered"
            hideTimeZone
            showMonthAndYearPickers
            granularity="minute" // Only show hour and minute
            value={selectedEnd}
            onChange={(value) => handleEndChange(value)}
            type="datetime"
            scrollShadowProps={{
              isEnabled: false,
            }}
            className="flex-grow"
            aria-label="Select end date and time"
          />
        </div>
      )}
    </div>
  );
}

export default DateTimeVote;
