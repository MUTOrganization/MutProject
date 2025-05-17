import {
    CalendarDate,
    endOfMonth,
    endOfYear,
    startOfMonth,
    startOfYear,
    today,
  } from "@internationalized/date";
  import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Select,
    SelectItem,
  } from "@heroui/react";
  import dayjs from "dayjs";
  import { months } from "dayjs/locale/th";
  import { useEffect, useState } from "react";
  
  export default function QuaterSelecter({
    value,
    onChange,
    className,
    modeState: externalMode,
    onModeChange,
  }) {
    const [internalMode, setInternalMode] = useState("ปี");
    // state สำหรับเก็บรายชื่อเดือนที่ผู้ใช้เลือก (initial จากค่าใน props.value)
    const [selectedMonths, setSelectedMonths] = useState([value?.start?.month]);
  
    // state สำหรับเก็บไตรมาสที่เลือก (1-4)
    const [selectedQuarter, setSelectedQuarter] = useState(1);
  
    const dateMode = externalMode ?? internalMode;
    const setDateMode = onModeChange ?? setInternalMode;
  
    const defaultRange = {
      start: startOfMonth(today()),
      end: endOfMonth(today()),
    };
  
    const firstYear = 2019;
    const thisYear = new Date().getFullYear();
  
    // สลับโหมด 'เดือน' 'ไตรมาส' และ 'ปี'
    function handleModeChange(mode) {
      setDateMode(mode);
      if (mode === "เดือน") {
        // default เป็นเดือนปัจจุบัน
        handleMonthMultiChange([today().month], today().year);
      } else if (mode === "ปี") {
        handleYearChange(thisYear);
      } else if (mode === "ไตรมาส") {
        // default เป็น Q1 ของปีปัจจุบัน (หรือจะเอา Q ปัจจุบันก็ได้)
        handleQuarterChange(1, thisYear);
      }
    }
  
    /**
     * เลือกหลายเดือน (multi)
     * คำนวณหาช่วงวันที่ (start/end) จาก minMonth - maxMonth
     * @param {number[]} monthsArray  array ของเลขเดือน (1-12)
     * @param {number} year           ปีที่เลือก
     */
    function handleMonthMultiChange(monthsArray, year) {
      setSelectedMonths(monthsArray);
      if (monthsArray.length > 0) {
        const minMonth = Math.min(...monthsArray);
        const maxMonth = Math.max(...monthsArray);
        const start = startOfMonth(new CalendarDate(year, minMonth, 1));
        const end = endOfMonth(new CalendarDate(year, maxMonth, 1));
        onChange({ start, end });
      } else {
        onChange(defaultRange);
      }
    }
  
    /**
     * เลือกปีเดียวทั้งปี
     * @param {number} year 
     */
    function handleYearChange(year) {
      const _date = new CalendarDate(year, 1, 1);
      const start = startOfYear(_date);
      const end = endOfYear(_date);
      onChange({ start, end });
    }
  
    /**
     * เลือกไตรมาส (quarter) ในปีที่กำหนด
     * Q1 = เดือน 1-3
     * Q2 = เดือน 4-6
     * Q3 = เดือน 7-9
     * Q4 = เดือน 10-12
     * @param {number} quarter  1|2|3|4
     * @param {number} year 
     */
    function handleQuarterChange(quarter, year) {
      setSelectedQuarter(quarter);
      // ตัวอย่างคำนวณ startMonth และ endMonth จาก quarter
      const startMonth = (quarter - 1) * 3 + 1; // 1->1, 2->4, 3->7, 4->10
      const endMonth = quarter * 3;             // 1->3, 2->6, 3->9, 4->12
  
      const start = startOfMonth(new CalendarDate(year, startMonth, 1));
      const end = endOfMonth(new CalendarDate(year, endMonth, 1));
      onChange({ start, end });
    }
  
    return (
      <div className={"w-full sm:max-w-[350px] " + className}>
        <div className="flex max-sm:flex-col items-center gap-2 w-full">
          {/* โหมดการเลือก: เดือน / ไตรมาส / ปี */}
          <div className="flex flex-col items-center">
            <div className="flex flex-row items-center gap-4">
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered" className="capitalize">
                    {dateMode}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  variant="flat"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={[dateMode]}
                  onSelectionChange={(keys) =>
                    handleModeChange(Array.from(keys)[0])
                  }
                >
                  <DropdownItem key="เดือน">เดือน</DropdownItem>
                  <DropdownItem key="ไตรมาส">ไตรมาส</DropdownItem>
                  <DropdownItem key="ปี">ปี</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
  
          <div className="w-full">
            {/* ------------------ MODE: MONTH ------------------ */}
            {dateMode === "เดือน" && (
              <div className="flex border-3 rounded-2xl">
                {/* Select สำหรับปี */}
                <Select
                  label="เลือกปี"
                  disallowEmptySelection
                  className="w-40"
                  classNames={{
                    trigger: "bg-white rounded-r-none",
                  }}
                  variant="flat"
                  selectedKeys={new Set([String(value.start.year)])}
                  onSelectionChange={(keys) =>
                    handleMonthMultiChange(
                      selectedMonths,
                      Number(Array.from(keys)[0])
                    )
                  }
                >
                  {[...Array(thisYear - firstYear + 1).keys()].map((e) => {
                    const yearVal = thisYear - e;
                    return (
                      <SelectItem
                        key={yearVal}
                        textValue={String(yearVal)}
                        value={String(yearVal)}
                      >
                        {yearVal}
                      </SelectItem>
                    );
                  })}
                </Select>
  
                <div className="w-[3px] bg-gray-300 my-2"></div>
  
                {/* Select  */}
                <Select
                  label="เลือกเดือน"
                  disallowEmptySelection
                  className="w-full"
                  classNames={{
                    trigger: "bg-white rounded-l-none",
                  }}
                  variant="flat"
                  selectedKeys={new Set(selectedMonths.map(String))}
                  onSelectionChange={(keys) =>
                    handleMonthMultiChange(
                      Array.from(keys).map((k) => Number(k)),
                      value.start.year
                    )
                  }
                >
                  {months.map((monthName, index) => {
                    const monthNumber = index + 1; // index เริ่มจาก 0
                    return (
                      <SelectItem
                        key={String(monthNumber)}
                        value={String(monthNumber)}
                      >
                        {monthName}
                      </SelectItem>
                    );
                  })}
                </Select>
              </div>
            )}
  
            {/* ------------------ MODE: QUARTER ------------------ */}
            {dateMode === "ไตรมาส" && (
              <div className="flex border-3 rounded-2xl">
                {/* Select สำหรับปี */}
                <Select
                  label="เลือกปี"
                  disallowEmptySelection
                  className="w-40"
                  classNames={{
                    trigger: "bg-white rounded-r-none",
                  }}
                  variant="flat"
                  selectedKeys={new Set([String(value.start.year)])}
                  onSelectionChange={(keys) =>
                    handleQuarterChange(
                      selectedQuarter,
                      Number(Array.from(keys)[0])
                    )
                  }
                >
                  {[...Array(thisYear - firstYear + 1).keys()].map((e) => {
                    const yearVal = thisYear - e;
                    return (
                      <SelectItem
                        key={yearVal}
                        textValue={String(yearVal)}
                        value={String(yearVal)}
                      >
                        {yearVal}
                      </SelectItem>
                    );
                  })}
                </Select>
  
                <div className="w-[3px] bg-gray-300 my-2"></div>
  
                {/* Select สำหรับไตรมาส (Q1-Q4) แบบ single */}
                <Select
                  label="เลือกไตรมาส"
                  disallowEmptySelection
                  className="w-full"
                  classNames={{
                    trigger: "bg-white rounded-l-none",
                  }}
                  variant="flat"
                  selectionMode="single"
                  selectedKeys={new Set([String(selectedQuarter)])}
                  onSelectionChange={(keys) =>
                    handleQuarterChange(
                      Number(Array.from(keys)[0]),
                      value.start.year
                    )
                  }
                >
                  <SelectItem key="1" value="1">ไตรมาส 1</SelectItem>
                  <SelectItem key="2" value="2">ไตรมาส 2</SelectItem>
                  <SelectItem key="3" value="3">ไตรมาส 3</SelectItem>
                  <SelectItem key="4" value="4">ไตรมาส 4</SelectItem>
                </Select>
              </div>
            )}
  
            {/* ------------------ MODE: YEAR ------------------ */}
            {dateMode === "ปี" && (
              <Select
                label="เลือกปี"
                disallowEmptySelection
                className="w-full"
                variant="bordered"
                selectedKeys={new Set([String(value.start.year)])}
                onSelectionChange={(keys) =>
                  handleYearChange(Number(Array.from(keys)[0]))
                }
              >
                {[...Array(thisYear - firstYear + 1).keys()].map((e) => {
                  const yearVal = thisYear - e;
                  return (
                    <SelectItem
                      key={yearVal}
                      textValue={String(yearVal)}
                      value={String(yearVal)}
                    >
                      {yearVal}
                    </SelectItem>
                  );
                })}
              </Select>
            )}
          </div>
        </div>
      </div>
    );
  }
  