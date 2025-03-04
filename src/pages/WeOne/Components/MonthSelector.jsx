import {
    startOfMonth,
    endOfMonth,
    today,
    fromDate,
  } from "@internationalized/date";
  import { Select, SelectItem, Button } from "@nextui-org/react";
  import { useEffect } from "react";
  
  /**
   * Month and Year Picker Component with Reset Button
   * @param {Object} props
   * @param {{start: CalendarDate, end: CalendarDate}} props.value - The currently selected date range.
   * @param {(value: {start: CalendarDate, end: CalendarDate}) => void} props.onChange - Callback when the date range changes.
   * @param {string} props.className - Additional className for styling.
   * @returns JSX.Element
   */
  export default function MonthYearSelector({ value, onChange, className }) {
    const currentYear = today().year;
    const currentMonth = today().month - 1; // 0-based month
    const defaultRange = {
      start: startOfMonth(today()),
      end: endOfMonth(today()),
    };
  
    // Generate a list of years for selection (e.g., current year +/- 5 years)
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  
    useEffect(() => {
      if (!value) {
        onChange(defaultRange);
      }
    }, []);
  
    /** Handle Month Change */
    function handleMonthChange(month) {
      const year = value.start.year;
      const date = fromDate(new Date(year, month, 1));
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      onChange({ start, end });
    }
  
    /** Handle Year Change */
    function handleYearChange(year) {
      const month = value.start.month - 1;
      const date = fromDate(new Date(year, month, 1));
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      onChange({ start, end });
    }
  
    /** Reset to Current Month and Year */
    function resetToCurrentMonthYear() {
      onChange(defaultRange);
    }
  
    return (
      <div className={`flex gap-4 items-center ${className}`}>
        {/* Month Selector */}
        <Select
          label="เลือกเดือน"
          disallowEmptySelection
          className="w-[150px]"
          variant="flat"
          size="sm"
          selectedKeys={new Set([String(value.start.month - 1)])}
          onSelectionChange={(keys) =>
            handleMonthChange(Number(Array.from(keys)[0]))
          }
          scrollShadowProps={{
            isEnabled: false
        }}
        >
          {Array.from({ length: 12 }, (_, i) => {
            const monthName = new Date(0, i).toLocaleString("th-TH", {
              month: "long",
            });
            return (
              <SelectItem
                key={i}
                value={String(i)}
                textValue={monthName} // Ensure this matches the displayed name
              >
                {monthName}
              </SelectItem>
            );
          })}
        </Select>
  
        {/* Year Selector */}
        <Select
          label="เลือกปี"
          disallowEmptySelection
          className="w-[120px]"
          variant="flat"
          size="sm"
          selectedKeys={new Set([String(value.start.year)])}
          onSelectionChange={(keys) =>
            handleYearChange(Number(Array.from(keys)[0]))
          }
          scrollShadowProps={{
            isEnabled: false
        }}
        >
          {years.map((year) => (
            <SelectItem
              key={year}
              value={String(year)}
              textValue={String(year)} // Provide the year as the textValue
            >
              {year}
            </SelectItem>
          ))}
        </Select>
  
        {/* Reset Button */}
        <Button
          size="sm"
          auto
          flat
          color="primary"
          onPress={resetToCurrentMonthYear}
          className="min-w-[100px]"
        >
          ล้างการค้นหา
        </Button>
      </div>
    );
  }
  