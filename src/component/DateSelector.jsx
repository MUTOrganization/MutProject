import { CalendarDate, endOfMonth, endOfYear, fromDate, startOfMonth, startOfYear, today } from "@internationalized/date";
import { Button, ButtonGroup, DatePicker, DateRangePicker, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Select, SelectItem } from "@nextui-org/react";
import dayjs from "dayjs";
import { months } from "dayjs/locale/th";
import { useEffect, useLayoutEffect, useState } from "react";

export default function DateSelector({value, onChange, className, modeState: externalMode, onModeChange, 
    isShowDateRange = true,
    isShowDay = true,
    isShowMonth = true,
    isShowYear = true,
}) {
    const [internalMode, setInternalMode] = useState('ช่วงวัน')

    const dateMode = externalMode ?? internalMode;
    const setDateMode = onModeChange ?? setInternalMode;

    const defaultRange = {
        start: startOfMonth(today()),
        end: endOfMonth(today()),
    }
    
    useEffect(() => {
        if(!value){
            onChange(defaultRange)
        }
    },[])

    function handleModeChange(mode) {
        setDateMode(mode)
        if(mode === 'ช่วงวัน'){
            handleDateRangeChange(defaultRange);
        }else if(mode === 'วัน'){
            handleDateChange(today());
        }else if(mode === 'เดือน'){
            handleMonthChange(today().month, today().year)
        }else if(mode === 'ปี'){
            handleYearChange(thisYear)
        }
    }
    const firstYear = 2019;
    const thisYear = new Date().getFullYear();

    /** @param {CalendarDate} dateRange  */
    function handleDateRangeChange(dateRange){
        if(dateRange === 'today'){
            const date = today();
            onChange({start: date, end: date});
        }else if(dateRange === 'thisMonth'){
            const date = today();
            const start = startOfMonth(date);
            const end = endOfMonth(date);
            onChange({start, end});
        }else if(dateRange === 'prevMonth'){
            const date = today().subtract({months: 1});
            const start = startOfMonth(date);
            const end = endOfMonth(date);
            onChange({start, end})
        }else{
            onChange(dateRange)
        }
    }
    function handleDateChange(date){
        onChange({start: date, end: date})
    }
    
    function handleMonthChange(month, year){
        const _date = new CalendarDate(year, month, 1);
        const start = startOfMonth(_date);
        const end = endOfMonth(_date);
        onChange({start, end})
    }
    function handleYearChange(year){
        const _date = new CalendarDate(year, 1, 1);
        const start = startOfYear(_date);
        const end = endOfYear(_date);
        onChange({start, end})
    }

    return (
        <div className={"w-full sm:max-w-[350px] " + className}>
            <div className="flex max-sm:flex-col items-center gap-2 w-full">
                <div className="flex flex-col items-center">
                    <div className="flex flex-row items-center gap-4">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    variant="bordered"
                                    className="capitalize"
                                >
                                    {dateMode}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                variant="flat"
                                disallowEmptySelection
                                selectionMode="single"
                                selectedKeys={[dateMode]}
                                onSelectionChange={(keys) => handleModeChange(Array.from(keys)[0])}
                            >
                                {isShowDateRange && <DropdownItem key="ช่วงวัน">ช่วงวัน</DropdownItem>}
                                {isShowDay && <DropdownItem key="วัน">วัน</DropdownItem>}
                                {isShowMonth && <DropdownItem key="เดือน">เดือน</DropdownItem>}
                                {isShowYear && <DropdownItem key="ปี">ปี</DropdownItem>}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
                <div className="w-full">
                {
                    dateMode === 'ช่วงวัน' ?
                    <DateRangePicker
                        label="เลือกวันที่"
                        className="w-full"
                        variant="bordered"
                        visibleMonths={2}
                        pageBehavior="single"
                        value={value ?? defaultRange}
                        onChange={(value) => handleDateRangeChange(value)}
                        size="md"
                        CalendarTopContent={
                            <ButtonGroup
                                fullWidth
                                className="px-3 pb-2 pt-3 bg-content1 [&>button]:text-default-500 [&>button]:border-default-200/60"
                                radius="full"
                                size="sm"
                                variant="bordered"
                            >
                                <Button onPress={() => handleDateRangeChange('today')}>วันนี้</Button>
                                <Button onPress={() => handleDateRangeChange('thisMonth')}>เดือนนี้</Button>
                                <Button onPress={() => handleDateRangeChange('prevMonth')}>เดือนที่แล้ว</Button>
                            </ButtonGroup>
                        }
                    />
                    : dateMode === 'วัน' ?
                    <DatePicker
                        key="day"
                        id="datePicker"
                        variant="bordered"
                        placeholder="Select Date"
                        value={value.start}
                        onChange={(value) => handleDateChange(value)}
                        className="w-full"
                        label="เลือกวันที่"
                    />
                    : dateMode === 'เดือน' ?
                    <div className="flex border-3 rounded-2xl">
                        <Select
                            label="เลือกปี"
                            disallowEmptySelection
                            className="w-40"
                            classNames={{
                                trigger: 'bg-white rounded-r-none'
                            }}
                            variant="flat"
                            selectedKeys={new Set([String(value.start.year)])}
                            onSelectionChange={(keys) => handleMonthChange(value.start.month, Number(Array.from(keys)[0]))}
                        >
                            {[...Array(thisYear - firstYear + 1).keys()].map((e) => (
                                <SelectItem key={thisYear - e} textValue={thisYear - e}>{thisYear - e}</SelectItem>
                            ))}
                        </Select>
                        <div className="w-[3px] bg-gray-300 my-2"></div>
                        <Select
                            label="เลือกเดือน"
                            disallowEmptySelection
                            className="w-full"
                            classNames={{
                                trigger: 'bg-white rounded-l-none'
                            }}
                            variant="flat"
                            selectedKeys={new Set([String(value.start.month)])}
                            onSelectionChange={(keys) => handleMonthChange(Number(Array.from(keys)[0]), value.start.year)}
                        >
                            {months.map((month, index) => (
                            <SelectItem key={index + 1} value={String(month)}>
                                {month}
                            </SelectItem>
                            ))}
                        </Select>
                    </div>
                    :
                    <Select
                        label="เลือกปี"
                        disallowEmptySelection
                        className="w-full"
                        variant="bordered"
                        selectedKeys={new Set([String(value.start.year)])}
                        onSelectionChange={(keys) => handleYearChange(Number(Array.from(keys)[0]))}
                    >
                        {[...Array(thisYear - firstYear + 1).keys()].map((e) => (
                            <SelectItem key={thisYear - e} textValue={thisYear - e}>{thisYear - e}</SelectItem>
                        ))}
                    </Select>
                }
                </div>

            </div>
        </div>
    )
}