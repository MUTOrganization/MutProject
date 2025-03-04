import React, { useState, useEffect } from "react";
import { DatePicker } from "@nextui-org/react";
import dayjs from "dayjs";
import { now, toCalendarDate, getLocalTimeZone } from "@internationalized/date";
import { toastError,toastSuccess,toastWarning } from "../../../component/Alert";

function DateTimeSelector({ onChange, resetDate }) {
  const [selectedStart, setSelectedStart] = useState(now(getLocalTimeZone()));
  const [selectedEnd, setSelectedEnd] = useState(now(getLocalTimeZone()));

  const toMySQLDateTime = (calendarDate) => {
    const jsDate = calendarDate.toDate(getLocalTimeZone());
    return dayjs(jsDate).format("YYYY-MM-DD HH:mm:ss");
  };

  useEffect(() => {
    if (selectedEnd.compare(selectedStart) < 0) {
      setSelectedEnd(selectedStart);
    }
  }, [selectedStart]);

  useEffect(() => {
    if (resetDate) {
      // resetDate both start and end dates to the current time
      const resetValue = now(getLocalTimeZone());
      setSelectedStart(resetValue);
      setSelectedEnd(resetValue);
      onChange({
        start: toMySQLDateTime(resetValue),
        end: toMySQLDateTime(resetValue),
      });
    }
  }, [resetDate]); // Runs when `reset` changes

  const handleStartChange = (newValue) => {
    setSelectedStart(newValue);
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
  };

  const handleEndChange = (newValue) => {
    if (newValue.compare(selectedStart) < 0) {
      toastError("ไม่สามารถเลือกวันสิ้นสุดเป็นอดีตได้ กรุณาเลือกอนาคต")
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

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Start Date-Time Picker */}
      <div className="flex flex-row items-center gap-3 w-full">
        <h3 className="text-sm font-medium text-left w-auto">
          วันเริ่มต้น :
        </h3>
        <DatePicker
          defaultValue={now(getLocalTimeZone())}
          variant="bordered"
          hideTimeZone
          showMonthAndYearPickers
          aria-label="Select start date and time"
          value={selectedStart} // Use CalendarDate object
          onChange={(value) => handleStartChange(value)}
          type="datetime"
          scrollShadowProps={{
            isEnabled: false,
          }}
          className="flex-grow"
        />
      </div>

      {/* End Date-Time Picker */}
      <div className="flex flex-row items-center gap-3 w-full">
        <h3 className="text-sm font-medium text-left w-auto">
          วันสิ้นสุด :
        </h3>
        <DatePicker
          defaultValue={now(getLocalTimeZone())}
          variant="bordered"
          hideTimeZone
          showMonthAndYearPickers
          value={selectedEnd} // Use CalendarDate object
          onChange={(value) => handleEndChange(value)}
          type="datetime"
          scrollShadowProps={{
            isEnabled: false,
          }}
          className="flex-grow"
          aria-label="Select start date and time"
        />
      </div>
    </div>
  );
}

export default DateTimeSelector;
