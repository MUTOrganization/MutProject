import { toastError, toastSuccess } from "@/component/Alert";
import { URLS } from "../../../../../config";
import { Card, Input, Button, Spinner, Tooltip } from "@nextui-org/react";
import moment from "moment";
import { useEffect, useState } from "react";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { cFormatter } from "../../../../../../utils/numberFormatter";
import { useAppContext } from "@/contexts/AppContext";
import { HintIcon, InfomationIcon } from "@/component/Icons";

function AgentSettingAward() {
    const { currentUser } = useAppContext();
    //State list data api
    const [listSettingAward, setListSettingAward] = useState([])
    const [roles, setRoles] = useState([])
    const [listMedal, setListMedal] = useState([])
    const [listDepartment, setListDepartment] = useState([])
    const [bestRoleId, setBestRoleId] = useState([])

    //state loading
    const [loadingRole, setLoadingRole] = useState(false)
    const [loadingSettingAward, setLoadingSettingAward] = useState(false)
    const [loadingMedal, setLoadingMedal] = useState(false)

    // เพิ่ม state สำหรับเก็บค่าที่แก้ไข
    const [editedSettings, setEditedSettings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // แก้ไขฟังก์ชัน setInitialData
    const setInitialData = (data) => {
        if (data && data.length > 0) {
            const conditions = JSON.parse(data[0].condition);
            setListSettingAward(
                conditions.map((target, index) => ({
                    id: index + 1,
                    amount: target.amount,
                    conditions: target.condition.map((cond, condIndex) => ({
                        id: condIndex + 1,
                        months: cond.months,
                        medalId: cond.medalId,
                        adsPercent: cond.adsPercent ? cond.adsPercent.toString() : '' // เพิ่ม adsPercent ใน condition
                    }))
                }))
            );
            setEditedSettings(conditions.map(item => ({ ...item })));
            setListMedal(listMedal);
        }
    };

    const fetchDepartmentByAgent = async () => {
        try {
            const response = await fetchProtectedData.get(URLS.departments.getall, {
                params: {
                    businessId: currentUser.businessId
                }
            })

            const data = response.data
            const filterDepartment = data.filter(item => item.departmentName == 'Ads Optimizer' && item.status == '1')
            setListDepartment(filterDepartment)

        } catch (error) {
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลการเข้าถึงได้')
        }
    }

    //Function fetch data api
    const fetchRole = async () => {
        try {
            setLoadingRole(true)
            const roles = await fetchProtectedData.get(URLS.roles.getByDep + '/' + listDepartment[0].id)
            const data = roles.data;
            const listRoleId = data.map(item => item.id)

            if (currentUser.businessId !== 1) {
                const getBestRoleId = await fetchProtectedData.get(`${URLS.roles.getBaseRoleId}?roleId=${listRoleId[0]}`)
                setBestRoleId(getBestRoleId.data)
            }

            setRoles(listRoleId)

        } catch (error) {
            // toastError('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลการเข้าถึงได้')
        } finally {
            setLoadingRole(false)
        }
    }

    const fetchSettingAndMedal = async () => {
        if (roles.length <= 0) {
            return;
        }

        try {
            setLoadingSettingAward(true);
            setLoadingMedal(true);

            // ลองดึงข้อมูลของ agent ก่อน
            let awardResponse = await fetchProtectedData.get(URLS.award.getAdsCondition, {
                params: {
                    year: moment().year(),
                    roleId: roles[0],
                    isHq: null
                }
            });

            // ถ้าไม่มีข้อมูลของ agent ให้ดึงข้อมูลจาก HQ แทน
            if (!awardResponse.data) {
                awardResponse = await fetchProtectedData.get(URLS.award.getAdsCondition, {
                    params: {
                        year: moment().year(),
                        roleId: roles[0],
                        isHq: true
                    }
                });
            }

            const medalResponse = await fetchProtectedData.get(URLS.award.getMedals);

            if (awardResponse.data) {
                const baseRole = awardResponse.data.baseRole;
                const awardData = awardResponse.data.condition;

                // แยก baseRole ออกจาก condition
                const filterSeliverAndGoldSetting = awardData.map(item => {
                    const { condition, ...rest } = item;
                    return {
                        ...rest,
                        baseRole, // เก็บ baseRole ไว้ที่ระดับบนสุด
                        condition // condition ไม่มี baseRole
                    };
                });

                setListSettingAward(filterSeliverAndGoldSetting);
                // เก็บเฉพาะข้อมูลที่จะใช้ใน condition สำหรับการ save
                setEditedSettings(awardData);
            } else {
                setListSettingAward([]);
                setEditedSettings([]);
            }

            setListMedal(medalResponse.data);

        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoadingSettingAward(false);
            setLoadingMedal(false);
        }
    };

    // แก้ไขฟังก์ชัน handleAdsPercentChange
    const handleAdsPercentChange = (targetIndex, conditionIndex, value) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        if (numericValue && parseInt(numericValue) > 100) {
            return;
        }

        setEditedSettings(prev => {
            const newSettings = [...prev];
            if (newSettings[targetIndex]?.condition?.[conditionIndex]) {
                newSettings[targetIndex].condition[conditionIndex] = {
                    ...newSettings[targetIndex].condition[conditionIndex],
                    adsPercent: numericValue
                };
            }
            return newSettings;
        });

        setListSettingAward(prev => {
            const newList = [...prev];
            if (newList[targetIndex]?.condition?.[conditionIndex]) {
                newList[targetIndex].condition[conditionIndex] = {
                    ...newList[targetIndex].condition[conditionIndex],
                    adsPercent: numericValue
                };
            }
            return newList;
        });
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const payload = {
                baseRole: roles,
                condition: JSON.stringify(editedSettings),
                year: moment().year(),
                type: 'Ads',
                createBy: currentUser.userName,
                updateBy: currentUser.userName
            };

            let response;

            if (listSettingAward.length > 0) {
                const hasExistingRole = listSettingAward.some(setting => roles.includes(setting.baseRole));


                if (hasExistingRole) {
                    response = await fetchProtectedData.put(
                        URLS.award.updateMultipleCondition,
                        payload
                    );
                } else {
                    response = await fetchProtectedData.post(
                        URLS.award.addCondition,
                        payload
                    );
                }

            } else {
                response = await fetchProtectedData.post(
                    URLS.award.addCondition,
                    payload
                );
            }



            if (response.status === 200 || response.status === 201) {
                toastSuccess('บันทึกข้อมูลสำเร็จ');
                fetchSettingAndMedal();
            }
        } catch (error) {
            if (error.response?.data?.error === "Duplicated") {
                toastError('เกิดข้อผิดพลาด', 'มีข้อมูลนี้อยู่ในระบบแล้ว');
            } else {
                toastError('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartmentByAgent()
    }, [])


    useEffect(() => {
        if (listDepartment.length > 0) {
            fetchRole()
        }
    }, [listDepartment])



    useEffect(() => {
        fetchSettingAndMedal()
    }, [roles])

    return (
        <Card className="flex flex-col p-4 h-full shadow-none">
            <div className="flex items-start space-x-4">
                <h1 className="font-semibold mb-4">ตั้งค่า Award สำหรับ ทีม Ads</h1>

                <Tooltip content="ตั้งค่า Award สำหรับ ทีม Ads ตั้งค่าได้เฉพาะเหรียญ Silver และ Gold เท่านั้น" placement="bottom">
                    <div className="">
                        <HintIcon />
                    </div>
                </Tooltip>
            </div>

            {loadingSettingAward || loadingMedal ? (
                <div className="flex items-center justify-center h-[400px]">
                    <Spinner size="lg" />
                </div>
            ) : listSettingAward.filter(item => item.condition?.length > 0).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                    <InfomationIcon className="w-16 h-16 mb-4" />
                    <p className="text-xl">ไม่พบข้อมูลการตั้งค่า</p>
                    <p className="text-sm mt-2">กรุณาติดต่อ Support </p>
                </div>
            ) : (
                <>
                    <div className="w-full h-full p-4 flex flex-wrap gap-4">
                        {listSettingAward.filter(item => item.condition.length > 0).map((item, index) => {
                            return (
                                <Card key={index} shadow="sm" className="w-4/12 h-[220px] overflow-auto scrollbar-hide p-3 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                            <h1>ยอดขายเป้าหมาย (รายปี)</h1>
                                            <p className="font-semibold">{cFormatter(item.amount, 2)}</p>
                                        </div>
                                        {/* <p className="text-primary-600 font-semibold text-lg">
                                            {item.condition.map(condition =>
                                                listMedal.find(medal => medal.id == condition.medalId)?.name
                                            ).join(', ')}
                                        </p> */}
                                    </div>


                                    {item.condition.map((condition, j) => {
                                        const medalName = listMedal.find(medal => medal.id == condition.medalId)?.name;
                                        const isEditable = condition.medalId == 1 || condition.medalId == 2;
                                        return (
                                            <div key={j} className={`${j !== item.condition.length - 1 ? 'border-b-1 border-gray-200' : ''} pb-4`}>
                                                <div className="flex flex-col">
                                                    <p className="font-bold text-primary text-lg">{medalName}</p>
                                                    <div className="flex space-x-4 items-end text-nowrap">
                                                        <p>ค่า Ads ไม่เกิน</p>
                                                        <Input
                                                            placeholder="กรอกค่า Ads (%)"
                                                            size="sm"
                                                            variant="bordered"
                                                            value={condition.adsPercent || ''}
                                                            onChange={(e) => handleAdsPercentChange(index, j, e.target.value)}
                                                            className="w-40"
                                                            isDisabled={!isEditable}
                                                        />
                                                        <p className="font-bold"> %</p>
                                                    </div>

                                                </div>
                                            </div>
                                        )
                                    })}
                                </Card>
                            )
                        })}
                    </div>

                    <div className="flex justify-end mt-auto pt-4">
                        <Button
                            color="primary"
                            onPress={handleSave}
                            isLoading={isLoading}
                            className="px-8"
                        >
                            บันทึก
                        </Button>
                    </div>
                </>
            )}
        </Card>
    )
}

export default AgentSettingAward;
