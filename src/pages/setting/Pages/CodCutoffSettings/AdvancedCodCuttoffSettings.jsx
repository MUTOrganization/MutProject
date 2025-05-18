import { Button, ButtonGroup, Checkbox, Modal, ModalBody, ModalContent, ModalHeader, Select, SelectItem, Spinner, TimeInput } from "@heroui/react";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { useEffect, useMemo, useState } from "react";
import { HFChevronLeft, HFChevronRight } from "@/component/Icons";
import { thaiMonths } from "@/utils/dateUtils";
import fetchProtectedData from "@/utils/fetchData";
import { URLS } from "@/config";
import { useAppContext } from "@/contexts/AppContext";
import dayjs from "dayjs";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { toastError, toastSuccess } from "@/component/Alert";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function AdvancedCodCuttoffSettings() {
    const { currentUser } = useAppContext();
    const [settings, setSettings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const [newCutoffDay, setNewCutffDay] = useState({ day: 1, time: { hour: 0, minute: 0 } });
    const [selectedMonths, setSelecotedMonths] = useState([]);
    const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);
    const [isSetTime, setIsSetTime] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    async function fetchSettings() {
        setIsLoading(true);
        try {
            const response = await fetchProtectedData.get(URLS.setting.getAllCodCutoff + `/${currentUser.businessId}`);
            setSettings(response.data.map(e => ({
                ...e,
                startDate: dayjs(e.startDate),
                endDate: e.endDate ? dayjs(e.endDate) : null
            })));
        } catch (error) {
            console.error('Error fetching cod cutoff settings:', error);
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchSettings();
    }, []);
    
    useEffect(() => {
        setSelectedMonths([]);
    }, [selectedYear]);

    function getMonthlyData(_settings, _startDate, _endDate) {
        const result = [];
        const startDate = dayjs(_startDate);
        const endDate = dayjs(_endDate);

        // วนลูปผ่านแต่ละเดือนในช่วงที่กำหนด
        for (let date = dayjs(startDate); date.isSameOrBefore(endDate, 'month'); date = date.add(1, 'month')) {
            const monthString = date.format('YYYY-MM'); // แปลงวันที่เป็นรูปแบบ 'YYYY-MM'

            // ตรวจสอบว่าเดือนนี้อยู่ในช่วงของข้อมูลใด
            const findSetting = _settings.find(item => {
                const itemStartDate = dayjs(item.startDate);
                const itemEndDate = dayjs(item.endDate);
                return date.isSameOrAfter(itemStartDate, 'month') && date.isSameOrBefore(itemEndDate, 'month');
            });

            // เพิ่มข้อมูลลงในผลลัพธ์
            const monthIndex = date.month();
            if (findSetting) {
                result.push({ monthIndex: monthIndex, month: monthString, day: findSetting.day, time: findSetting.time });
            } else {
                const currentSetting = _settings.find(e => {
                    const itemStartDate = dayjs(e.startDate);
                    const itemEndDate = dayjs(e.endDate);
                    return itemStartDate.isSameOrBefore(date, 'month') && (!e.endDate || itemEndDate.isSameOrAfter(date, 'month'));
                });
                if (currentSetting) {
                    result.push({ monthIndex: monthIndex, month: monthString, day: currentSetting.day, time: currentSetting.time });
                } else {
                    result.push({ monthIndex: monthIndex, month: monthString });
                }
            }
        }
        return result;
    }
    //รวมเดือนที่ติดกันเป็นช่วง
    /**
     * @param {string[]} months 
     * @returns {object[]}
     */
    function groupConsecutiveMonths(months) {
        // เรียงลำดับเดือนก่อน
        months.sort();
        
        const ranges = [];
        let currentRange = {
          start: null,
          end: null
        };
      
        for (let i = 0; i < months.length; i++) {
          const currentMonth = dayjs(months[i] + '-01');
          const nextMonth = i + 1 < months.length ? dayjs(months[i + 1] + '-01') : null;
          
          if (!currentRange.start) {
            currentRange.start = currentMonth;
          }
      
          // ถ้าเดือนถัดไปไม่ต่อเนื่องหรือเป็นเดือนสุดท้าย
          if (!nextMonth || nextMonth.diff(currentMonth, 'month') > 1) {
            currentRange.end = currentMonth.endOf('month'); // วันสุดท้ายของเดือนปัจจุบัน
            
            ranges.push({
              start: currentRange.start.format('YYYY-MM'),
              end: currentRange.end.format('YYYY-MM')
            });
            
            currentRange = {
              start: null,
              end: null
            };
          }
        }
      
        return ranges;
    }

    async function addAdvancedCodCutoffSetting() {
        setSubmitLoading(true);
        const time = `${newCutoffDay.time.hour.toString().padStart(2, '0')}:${newCutoffDay.time.minute.toString().padStart(2, '0')}`;
        try {
            const response = await fetchProtectedData.post(URLS.setting.addAdvancedCodCutoff, {
                businessId: currentUser.businessId,
                cutoffDay: newCutoffDay.day,
                cutoffTime: time,
                createBy: currentUser.userName,
                months: groupConsecutiveMonths(selectedMonths)
            });
            toastSuccess("เพิ่มการตั้งค่าเสร็จสิ้น");
            setIsAdvancedModalOpen(false);
            fetchSettings();
        } catch (error) {
            console.error('Error adding advanced cod cutoff setting:', error);
            toastError('เกิดข้อผิดพลาด', 'กรุณาลองใหม่อีกครั้ง');
        } finally {
            setSubmitLoading(false);
        }
    }

    //how to get all settings of a year
    const monthlySettings = useMemo(() => {
        return getMonthlyData(settings, `${selectedYear}-01-01`, `${selectedYear}-12-31`);
    }, [settings, selectedYear]);

    function handleTimeChange(time) {
        setNewCutoffDay(prev => ({ ...prev, time: { hour: time.hour, minute: time.minute } }));
    }

    function handleMonthSelectionChange(month) {
        if (month === 'all') return;
        setSelectedMonths(Array.from(month));
    }

    const groupedMonths = useMemo(() => groupConsecutiveMonths(selectedMonths), [selectedMonths]);
    return (
        <div>
            <div className="mb-4">
                <ButtonGroup>
                    <Button isIconOnly onPress={() => { if (selectedYear > 2019) setSelectedYear(selectedYear - 1) }}><HFChevronLeft /></Button>
                    <Button><strong>{selectedYear}</strong></Button>
                    <Button isIconOnly onPress={() => { if (selectedYear < new Date().getFullYear()) setSelectedYear(selectedYear + 1) }}><HFChevronRight /></Button>
                </ButtonGroup>
            </div>
            <div className="relative">
                <Table
                    aria-label="Advanced Cod Cutoff Settings"
                    removeWrapper
                    selectionMode="multiple"
                    selectedKeys={selectedMonths}
                    onSelectionChange={handleMonthSelectionChange}
                    disabledKeys={monthlySettings.filter(e => e.day).map(e => e.month.toString())}
                >
                    <TableHeader>
                        <TableColumn>เดือน</TableColumn>
                        <TableColumn>วัน-เวลาที่ตั้งค่า</TableColumn>
                    </TableHeader>
                    <TableBody isLoading={isLoading} loadingContent={<Spinner />}>
                        {thaiMonths.map((month, index) => {
                            const setting = monthlySettings.find(e => e.monthIndex === index);
                            return (
                                <TableRow key={setting.month}>
                                    <TableCell>{month}</TableCell>
                                    <TableCell>{setting.day ? `วันที่ ${setting.day} เวลา ${setting.time}` : `ไม่มีการตั้งค่า`}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                <div className="absolute bottom-0 right-0 p-4 mr-4 mb-4">
                    {
                        selectedMonths.length > 0 && (
                            <Button variant="solid" color="primary" onPress={() => setIsAdvancedModalOpen(true)}>เพิ่มการตั้งค่า</Button>
                        )
                    }
                </div>
            </div>
            <Modal
                isOpen={isAdvancedModalOpen}
                onClose={() => setIsAdvancedModalOpen(false)}
                size="2xl"
            >
                <ModalContent>
                    <ModalHeader>
                        เพิ่มการตั่งค่าเพิ่มเติม
                    </ModalHeader>
                    <ModalBody>
                        <div className="px-4">
                            <div>
                                <div className="font-bold">
                                    เดือนที่เลือก
                                </div>
                                <div className="ps-4 mb-4">
                                    {groupedMonths.map(e => {
                                        const startMonth = thaiMonths[Number(e.start.split('-')[1]) - 1];
                                        const endMonth = thaiMonths[Number(e.end.split('-')[1]) - 1];
                                        if(startMonth === endMonth) return <p key={e.start}>{startMonth}</p>;
                                        return <p key={e.start}>{startMonth} - {endMonth}</p>;
                                    })}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Select selectedKeys={[String(newCutoffDay.day)]}
                                    onSelectionChange={(keys) => setNewCutoffDay(prev => ({ ...prev, day: Array.from(keys)[0] }))}
                                    className="w-52" label="เลือกวัน"
                                    variant="bordered"
                                    disallowEmptySelection
                                >
                                    {Array.from({ length: 15 }).map((_, index) => (
                                        <SelectItem key={index + 1} textValue={`วันที่ ${index + 1} ของเดือนถัดไป`}>{index + 1}</SelectItem>
                                    ))}
                                </Select>
                                <div className="flex items-center gap-4">
                                    <Checkbox isSelected={isSetTime} onValueChange={setIsSetTime}>กำหนดเวลา?</Checkbox>
                                    {
                                        <div className="w-32">
                                            <TimeInput variant="bordered" size="lg" value={isSetTime ? newCutoffDay.time : { hour: 0, minute: 0 }} isDisabled={!isSetTime} hourCycle={24} granularity="minute" onChange={handleTimeChange} />
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="flex justify-center mt-8">
                                <Button variant="solid" color="primary" isDisabled={submitLoading} onPress={addAdvancedCodCutoffSetting}>บันทึก</Button>
                            </div>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}