import { Button, Card, CardBody, Checkbox, Chip, Input, Select, SelectItem, TimeInput } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { toastError, toastSuccess } from "@/component/Alert";
import fetchProtectedData from "@/utils/fetchData";
import { useAppContext } from "@/contexts/AppContext";
import AdvancedCodCuttoffSettings from "./AdvancedCodCuttoffSettings";
export default function CodCutoffSettings() {
    const { currentUser } = useAppContext();
    const [isEdit, setIsEdit] = useState(false);
    const [selectedDay, setSelectedDay] = useState("1");
    const [selectedTime, setSelectedTime] = useState({ hour: 0, minute: 0 });
    const [oldSetting, setOldSetting] = useState(null);
    const [isSetTime, setIsSetTime] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isAdvancedSetting, setIsAdvancedSetting] = useState(false);

    // const [selectedEffectMonth, setSelectedEffectMonth] = useState('nextMonth');

    // const [isWarningModalShow, setIsWarningModalShow] = useState(false);

    useEffect(() => {
        fetchSettingData();
    }, [])
    const isChanged = useMemo(() => {
        return !oldSetting || (oldSetting.day != selectedDay
            || oldSetting.time !== `${selectedTime.hour.toString().padStart(2, '0')}:${selectedTime.minute.toString().padStart(2, '0')}`
            || (!isSetTime && oldSetting.time !== '00:00'));
    }, [oldSetting, selectedDay, selectedTime, isSetTime]);

    const fetchSettingData = async () => {
        const res = await fetchProtectedData.get(URLS.setting.getCodCutoff + `/${currentUser.businessId}`);
        if (res.data) {
            setSelectedDay(res.data.day);
            const [hour, minute] = res.data.time.split(':');
            setSelectedTime({ hour: parseInt(hour), minute: parseInt(minute) });
            if (res.data.time === '00:00') {
                setIsSetTime(false);
            } else {
                setIsSetTime(true);
            }
            setOldSetting({ day: res.data.day, time: res.data.time });
        } else {
            setSelectedDay("1");
            setSelectedTime({ hour: 0, minute: 0 });
        }
    }
    const handleSave = async () => {
        const time = isSetTime ? `${selectedTime.hour.toString().padStart(2, '0')}:${selectedTime.minute.toString().padStart(2, '0')}` : '00:00';
        try {
            setIsLoading(true);
            const now = new Date();
            const res = await fetchProtectedData.post(URLS.setting.updateCodCutoff, {
                businessId: currentUser.businessId,
                day: selectedDay,
                time: time,
                createBy: currentUser.userName,
                startDate: `${now.getFullYear()}-${now.getMonth() + 1}-01`
            });
            toastSuccess('บันทึกข้อมูลสำเร็จ', 'เปลี่ยนวันตัดยอดยอดเงินเข้าของเดือนนี้เรียบร้อย');
            setOldSetting({ day: selectedDay, time: time });
            setIsEdit(false);
        } catch (err) {
            console.error(err);
            toastError('เกิดข้อผิดพลาด', 'กรุณาลองใหม่อีกครั้ง');
        } finally {
            setIsLoading(false);
        }
    }
    function handleTimeChange(time) {
        setSelectedTime({ hour: time.hour, minute: time.minute });
    }

    return (
        <section className="w-full">
            <Card className="flex p-4 max-h-[calc(100vh-120px)] w-full overflow-auto" shadow="none" radius="sm">
                <CardBody>
                    <div>
                        <div className="text-lg font-semibold mb-4">ตั้งค่าวันตัดยอดเงินเข้า</div>
                        <div className="้h-1 mb-8 ms-4 text-wrap space-y-1">
                            <p>คำอธิบาย: วันตัดยอดเงินเข้า คือ วันที่กำหนดให้ ยอดเงินที่มีการชำระเงินหลังจากวันที่กำหนดจะถูกตัดเป็นยอดยกไปเดือนถัดไป</p>
                            <div className="ps-16">
                                <p className="">ตัวอย่าง: ตั้งค่าวันตัดยอดยกเป็นวันที่ 5 ของเดือนถัดไป เวลา 00:00</p>
                                <ul className="list-disc ps-8">
                                    <li>
                                        <p className="">ออเดอร์ของเดือน <strong>มกราคม</strong> ถ้ามีการชำระเงินในวันที่ <strong>4</strong> เดือน <strong>กุมภาพันธ์</strong> จะนับเป็นยอดเงินเข้าของเดือน <strong>มกราคม</strong></p>
                                    </li>
                                    <li>
                                        <p className="">ออเดอร์ของเดือน <strong>มกราคม</strong> ถ้ามีการชำระเงินในวันที่ <strong>5</strong> เดือน <strong>กุมภาพันธ์</strong> เวลา 00:00 ขึ้นไป จะนับเป็นยอดเงินเข้าของเดือน <strong>กุมภาพันธ์</strong></p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-b border-divider mb-8"></div>
                        <div className="mb-8">
                            {/* <div className="flex justify-end">
                                <Button variant="bordered" color="primary"
                                    onPress={() => setIsAdvancedSetting(!isAdvancedSetting)}>{isAdvancedSetting ? 'ย้อนกลับ' : 'ตั้งค่าย้อนหลัง'}
                                </Button>
                            </div> */}
                            {
                                isAdvancedSetting ? 
                                    <div className="mt-4 mx-4">
                                        <AdvancedCodCuttoffSettings />
                                    </div> 
                                    :
                                    <>
                                        <div className="font-semibold mb-2">การตั้งค่าปัจจุบัน</div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex w-52">
                                                <Input value={`วันที่ ${oldSetting?.day ?? 1} ของเดือนถัดไป`} variant="bordered" isDisabled />
                                            </div>
                                            <div>เวลา</div>
                                            <div className="w-32">
                                                <TimeInput variant="bordered" size="md"
                                                    value={{ hour: oldSetting?.time.split(':')[0], minute: oldSetting?.time.split(':')[1] }}
                                                    isDisabled hourCycle={24}
                                                    granularity="minute"
                                                />
                                            </div>
                                            {
                                                isEdit ? <Button variant="bordered" color="primary" onPress={() => setIsEdit(false)}>ยกเลิก</Button>
                                                    : <Button variant="solid" color="primary" onPress={() => setIsEdit(true)}>แก้ไข</Button>
                                            }
                                        </div>
                                    </>
                            }
                        </div>
                        {
                            isEdit && (

                                <div>
                                    <div className="border-b border-divider mb-8"></div>
                                    <div className="flex items-center gap-4">
                                        <Select selectedKeys={[String(selectedDay)]}
                                            onSelectionChange={(keys) => setSelectedDay(Array.from(keys)[0])}
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
                                            <div className="w-32">
                                                <TimeInput variant="bordered" size="lg" value={isSetTime ? selectedTime : { hour: 0, minute: 0 }} isDisabled={!isSetTime} hourCycle={24} granularity="minute" onChange={handleTimeChange} />
                                            </div>
                                        </div>
                                        <div>
                                            <Button variant="solid" color="primary" isDisabled={!isChanged} onPress={handleSave}>บันทึก</Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </CardBody>
            </Card>
            {/* <AlertQuestion 
                isOpen={isWarningModalShow}
                onClose={() => setIsWarningModalShow(false)}
                title="เปลี่ยนการตั้งค่าของนี้?"
                content="คุณต้องการลบข้อมูลนี้ใช่หรือไม่? หากเปลี่ยนแล้ว"
            /> */}
        </section>
    )
}

