import { toastError } from "@/component/Alert";
import { ConfirmCancelButtons } from "@/component/Buttons";
import { URLS } from "@/config";
import { Button, Card, CardBody, CardHeader, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Spinner } from "@nextui-org/react";
import moment from "moment";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { useEffect, useState } from "react";
import lodash from "lodash";
import { CompareStatus } from "../../../../../../utils/CompareStatus";
import { cFormatter } from "../../../../../../utils/numberFormatter";
import { InfomationIcon } from "@/component/Icons";

function ModalCoppySetting({ isOpen, closed, listRole = [], listMedal = [], onCopy }) {
    // #region States
    const [awardCondition, setAwardCondition] = useState([]);
    const [listDepartment, setListDepartment] = useState([]);
    const [listAward, setListAward] = useState([]);
    const [loading, setLoading] = useState(false);
    const [groupYear, setGroupYear] = useState({});
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState(listDepartment[0]?.id);
    // #endregion

    // #region Handlers for Modal
    const handleClose = () => {
        if (!loading) { // ป้องกันการปิด modal ระหว่าง loading
            closed(false);
        }
    }

    const handleConfirm = () => {
        if (!loading) {
            closed(false);
        }
    }
    // #endregion

    // #region Fetch Data
    const fetchAwardCondition = async () => {
        setLoading(true);
        try {
            const [settingData, awardData] = await Promise.all([
                fetchProtectedData.get(URLS.award.getConditions, {
                    params: {
                        year: selectedYear || moment().year() - 1
                    }
                }),
                fetchProtectedData.get(URLS.award.getMedals),
            ]);
            const data = settingData.data;
            setAwardCondition(data);
            setListAward(awardData.data);
            const groupedData = lodash.groupBy(data, 'year');
            setGroupYear(groupedData);

            const years = Object.keys(groupedData);
            if (years.length > 0) {
                setSelectedYear(years[0]);
            }
        } catch (error) {
            toastError("เกิดข้อผิดพลาด", "ระบบไม่สามารถดึงข้อมูลได้ โปรดลองใหม่อีกครั้ง");
        } finally {
            setLoading(false);
        }
    }

    const fetchDepartment = async () => {
        const data = await fetchProtectedData.get(URLS.departments.getHqDepartments);
        setListDepartment(data.data);
    }
    // #endregion

    //#region Use Effect
    useEffect(() => {
        if (isOpen) {
            fetchDepartment();
            fetchAwardCondition();
        }
    }, [isOpen]);

    useEffect(() => {
        if (selectedYear) {
            fetchAwardCondition();
        }
    }, [selectedYear]);

    //#endregion

    const renderType = (type, item) => {
        switch (type) {
            case 'Sale':
            case 'Ads':
                return (
                    <div className="max-h-[300px] overflow-auto scrollbar-hide">
                        <p>เงื่อนไขการตั้งค่า</p>
                        {item.condition.map((condition, index) => {
                            return (
                                <div key={index} className="gap-2 m-2 border-b-2 pb-2 border-gray-300 ml-5 text-sm max-h-[200px] overflow-auto scrollbar-hide">
                                    <div className="flex flex-col space-y-2">
                                        <div className="flex justify-start items-center">
                                            <p>เป้าหมายยอดขาย :</p>
                                            <p className="ml-2 font-semibold">{cFormatter(condition.amount, 2)}</p>
                                        </div>



                                        <div className="text-nowrap">
                                            {condition.condition.map((cod, codIndex) => {
                                                return (
                                                    <div key={codIndex} className="flex justify-between items-center space-x-3">
                                                        <div>
                                                            <p className="text-nowrap">จำนวนเดือนเป้าหมาย </p>
                                                            <p className="font-semibold">{cod.months} เดือน</p>
                                                            <p className="font-semibold">ค่า Ads ไม่เกิน{cod.adsPercent}%</p>
                                                        </div>


                                                        <div>
                                                            <p>เหรียญที่จะได้รับ </p>
                                                            <p className="font-semibold">{listAward.find(medal => medal.id == cod.medalId)?.name}</p>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
            case 'OwnUser':
                return (
                    <div>
                        <p>เงื่อนไขการตั้งค่า</p>
                        {item.condition.map((condition, index) => {
                            return (
                                <div key={index} className="gap-2 m-2  border-b-2 pb-2 border-gray-300 ml-5 text-sm max-h-[200px] overflow-auto scrollbar-hide">
                                    <div className="flex items-center space-x-3">
                                        <p>เหรียญเป้าหมาย :</p>
                                        <p className="font-semibold ml-2">{listAward.find(medal => medal.id == condition.medalId)?.name}</p>
                                    </div>
                                    <div className=" text-nowrap">
                                        {condition.condition.map((cod, codIndex) => {
                                            return (
                                                <div key={codIndex} className="flex justify-between items-center space-x-3">
                                                    <div>
                                                        <p className="text-nowrap">จำนวนเหรียญเงื่อนไข </p>
                                                        <p className=" font-semibold">{cod.amount} เหรียญ</p>
                                                    </div>

                                                    <div>
                                                        <p>เหรียญเงื่อนไข </p>
                                                        <p className=" font-semibold">{listMedal.find(x => x.id == cod.medalId)?.name}</p>
                                                    </div>
                                                </div>
                                            )
                                        })}

                                    </div>

                                </div>
                            )
                        })}
                    </div>
                )
            case 'TeamSale':
                return (
                    <div className="max-h-[300px]   overflow-auto scrollbar-hide">
                        <p>เงื่อนไขการตั้งค่า</p>
                        {item.condition.map((condition, index) => {
                            return (
                                <div key={index} className="gap-2 m-2  border-b-2 pb-2 border-gray-300 ml-5 text-sm max-h-[200px] overflow-auto scrollbar-hide">
                                    <div className=" flex justify-start items-center">
                                        <p>เป้าหมายยอดขายทีม :</p>
                                        <p className="ml-2 font-semibold">{cFormatter(condition.amount, 2)}</p>
                                    </div>

                                    <div className=" text-nowrap">
                                        {condition.condition.map((cod, codIndex) => {
                                            return (
                                                <div key={codIndex} className="flex justify-between items-center space-x-3">
                                                    <div>
                                                        <p className="text-nowrap">จำนวนเดือนเป้าหมาย </p>
                                                        <p className=" font-semibold">{cod.months} เดือน</p>
                                                    </div>

                                                    <div>
                                                        <p>เหรียญที่จะได้รับ </p>
                                                        <p className=" font-semibold">{listAward.find(medal => medal.id == cod.medalId)?.name}</p>
                                                    </div>
                                                </div>
                                            )
                                        })}

                                    </div>
                                </div>

                            )
                        })}
                    </div>
                )
            default:
                return 'ไม่มีการตั้งค่า';
        }
    }

    const handleCopy = (item) => {
        const copiedData = {
            type: item.type,
            year: item.year,
            condition: item.condition,
            rookieAmount: item.rookieAmount,
            baseRole: item.baseRole
        };

        closed(false);
        onCopy(copiedData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            backdrop="opaque"
            size="5xl"
        >
            <ModalContent>
                {loading ? (
                    <div className="flex justify-center items-center p-8">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <>
                        <ModalHeader className="text-2xl font-bold bg-blue-100 text-primary flex justify-center">
                            <h1>คัดลอกการตั้งค่า</h1>
                        </ModalHeader>
                        <ModalBody>
                            <div className="p-2">
                                <div className="flex justify-end gap-2">
                                    <Select
                                        label="ปีการตั้งค่า"
                                        labelPlacement="inside"
                                        variant="bordered"
                                        className="w-1/5"
                                        size="sm"
                                        value={selectedYear}
                                        defaultSelectedKeys={[selectedYear]}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                    >
                                        {Array.from({ length: new Date().getFullYear() - 2019 + 1 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                            <SelectItem key={year} value={year}>
                                                {year.toString()}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                                {!groupYear[selectedYear] || groupYear[selectedYear].length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-20">
                                        <InfomationIcon className="w-16 h-16 text-gray-400 mb-4" />
                                        <p className="text-gray-600 text-lg text-center">
                                            ไม่พบข้อมูลการตั้งค่าในปี {selectedYear}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap w-full justify-center gap-10 p-4 max-h-[620px] overflow-auto scrollbar-hide">
                                        {groupYear[selectedYear].map((item, index) => {
                                            const role = listRole.find(role => role.id == item.baseRole);
                                            const department = listDepartment.find(dep => dep.id == role.depId);
                                            return (
                                                <Card key={index} className="w-2/5 h-[500px] p-2" shadow="sm" radius="sm">
                                                    <CardHeader className="flex justify-between">
                                                        <div>
                                                            <h1 className="text-lg text-black/80">ตำแหน่ง {role?.roleName}</h1>
                                                            <Chip size="sm" color="primary" variant="dot">{department.departmentName}</Chip>
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            color="primary"
                                                            variant="solid"
                                                            onPress={() => handleCopy(item)}
                                                        >
                                                            คัดลอก
                                                        </Button>
                                                    </CardHeader>
                                                    <CardBody>
                                                        <div className="flex">
                                                            <p>ประเภทการตั้งค่า : </p>
                                                            <p className="font-semibold ml-2"> {CompareStatus(item.type, {
                                                                'Sale': 'เงื่อนไขจากยอดขาย',
                                                                'OwnUser': 'เงื่อนไขจากเหรียญของผู้ที่ดูแล',
                                                                'TeamSale': 'เงื่อนไขจากยอดขายของทีม',
                                                                'Ads': 'เงื่อนไขจากยอดขายและค่า Ads'
                                                            })}</p>
                                                        </div>

                                                        {renderType(item.type, item)}


                                                        {item.rookieAmount &&
                                                            <div className="flex justify-start items-center text-sm">
                                                                <p>การตั้งค่าสำหรับ Rookie : </p>
                                                                <p className="font-semibold ml-2">{cFormatter(item.rookieAmount, 2)}</p>
                                                            </div>
                                                        }
                                                    </CardBody>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            {/* <ConfirmCancelButtons
                                onConfirm={handleConfirm}
                                onCancel={handleClose}
                                confirmColor="primary"
                                confirmText="คัดลอก"
                                disabled={loading}
                            /> */}
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default ModalCoppySetting;
