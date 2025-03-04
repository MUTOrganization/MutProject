import { Avatar, AvatarGroup, Button, Checkbox, Chip, Image, Input, Radio, RadioGroup, Select, SelectItem, Tab, Tabs } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../../../contexts/AppContext";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "../../../../../config";
import { AlertQuestion, toastError, toastSuccess, toastWarning } from "../../../../../component/Alert";
import moment from "moment";
import { AlertColorIcon, DeleteIcon, HintIcon, InfomationIcon } from "@/component/Icons";
import ModalCoppySetting from "../components/ModalCoppySetting";


function SettingConditionMedal() {
    //context
    const { currentUser } = useAppContext();

    //data list from api
    const [listDepartment, setListDepartment] = useState([]); //แผนก
    const [listRole, setListRole] = useState([]); //ตำแหน่ง
    const [listMedal, setListMedal] = useState([]); //เหรียญ
    const [listAwardCondition, setListAwardCondition] = useState([]); //เงื่อนไขเหรียญ

    //loadgin data
    const [depLoading, setDepLoading] = useState(false);
    const [roleLoading, setRoleLoading] = useState(false);

    //Input form
    const [inputRadio, setInputRadio] = useState(1);
    const [selectedDep, setSelectedDep] = useState();
    const [selectedRole, setSelectedRole] = useState();

    //Tab active
    const [tabActive, setTabActive] = useState('normal');

    const [inputSaleRookie, setInputSaleRookie] = useState();

    //เพิ่มเหรียญรางวัลที่จะตั้งค่า (เหรียญเป้าหมาย)
    const [addTargetSettingMedal, setAddTargetSettingMedal] = useState([{
        id: 1,
        targetMedal: '',
        conditions: [{
            id: 1,
            medalId: null,
            amount: 1
        }]
    }]);

    //เพิ่มเหรียญเป้าหมายจากทีมที่ดูแล
    const [teamTargetSettingMedal, setTeamTargetSettingMedal] = useState([{
        id: 1,
        amount: '', // กำหนดค่าเริ่มต้นเป็น string ว่าง
        conditions: [{
            id: 1,
            medalId: null,
            months: 1,
        }]
    }]);

    // เพิ่ม state สำหรับเงื่อนไขที่ 2
    const [saleTargetSettingMedal, setSaleTargetSettingMedal] = useState([{
        id: 1,
        amount: '',
        conditions: [{
            id: 1,
            medalId: null,
            months: 1,
        }]
    }]);

    // เพิ่ม state สำหรับเก็บสถานะว่ามีข้อมูลเก่าหรือไม่
    const [hasExistingData, setHasExistingData] = useState(false);

    // เพิ่ม state สำหรับควบคุม modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // เพิ่ม state สำหรับควบคุม modal
    const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

    // เพิ่ม state สำหรับ modal
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [updatePayload, setUpdatePayload] = useState(null);

    // เพิ่ม state สำหรับ Ads
    const [adsTargetSettingMedal, setAdsTargetSettingMedal] = useState([{
        id: 1,
        amount: '',
        conditions: [{
            id: 1,
            medalId: null,
            months: 1,
            adsPercent: ''
        }]
    }]);

    // #region Handlers for Form Inputs
    const handleDepartmentChange = (e) => {
        const selectedDepId = e.target.value;
        setSelectedDep(selectedDepId);
    };

    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
    };

    // #endregion

    // #region Handlers for Medal/Award Conditions
    const handleTargetMedalChange = (targetId, value) => {
        setAddTargetSettingMedal(prev =>
            prev.map(item =>
                item.id === targetId
                    ? { ...item, targetMedal: value.toString() }
                    : item
            )
        );
    };

    const handleConditionChange = (targetId, conditionId, field, value) => {
        setAddTargetSettingMedal(prev =>
            prev.map(item =>
                item.id === targetId
                    ? {
                        ...item,
                        conditions: item.conditions.map(condition =>
                            condition.id === conditionId
                                ? { ...condition, [field]: value }
                                : condition
                        )
                    }
                    : item
            )
        );
    };

    const handleTeamTargetMedalChange = (targetId, field, value) => {
        setTeamTargetSettingMedal(prev =>
            prev.map(item =>
                item.id === targetId
                    ? { ...item, [field]: value }
                    : item
            )
        );
    };

    const handleTeamConditionChange = (targetId, conditionId, field, value) => {
        setTeamTargetSettingMedal(prev =>
            prev.map(item =>
                item.id === targetId
                    ? {
                        ...item,
                        conditions: item.conditions.map(condition =>
                            condition.id === conditionId
                                ? {
                                    ...condition,
                                    [field]: value,
                                }
                                : condition
                        )
                    }
                    : item
            )
        );
    };
    // #endregion

    // #region Handlers for Adding/Removing Conditions
    const addTargetSettingMedalFunc = () => {
        setAddTargetSettingMedal(prev => [
            ...prev,
            createNewTargetSetting(prev.length + 1)
        ]);
    };

    const removeTargetSettingMedalFunc = (id) => {
        setAddTargetSettingMedal(prev => prev.filter(item => item.id !== id));
    };

    const addTeamTargetSettingMedalFunc = () => {
        setTeamTargetSettingMedal(prev => [
            ...prev,
            {
                id: prev.length + 1,
                amount: '', // เปลี่ยนจาก targetMedal เป็น amount
                conditions: [{
                    id: 1,
                    medalId: null,
                    months: 1
                }]
            }
        ]);
    };

    const removeTeamTargetSettingMedalFunc = (id) => {
        setTeamTargetSettingMedal(prev => prev.filter(item => item.id !== id));
    };

    // เพิ่มฟังก์ชันสำหรับเพิ่มเงื่อนไขใหม่
    const addConditionFunc = (targetId) => {
        setAddTargetSettingMedal(prev =>
            prev.map(item =>
                item.id === targetId
                    ? {
                        ...item,
                        conditions: [
                            ...item.conditions,
                            createNewCondition(item.conditions.length + 1)
                        ]
                    }
                    : item
            )
        );
    };
    // #endregion

    // #region Handlers for Sale Conditions
    const handleSaleTargetMedalChange = (targetId, field, value) => {
        setSaleTargetSettingMedal(prev =>
            prev.map(item =>
                item.id === targetId
                    ? { ...item, [field]: value }
                    : item
            )
        );
    };

    const handleSaleConditionChange = (targetId, conditionId, field, value) => {
        setSaleTargetSettingMedal(prev =>
            prev.map(item =>
                item.id === targetId
                    ? {
                        ...item,
                        conditions: item.conditions.map(condition =>
                            condition.id === conditionId
                                ? {
                                    ...condition,
                                    [field]: value,
                                }
                                : condition
                        )
                    }
                    : item
            )
        );
    };

    const addSaleTargetSettingMedalFunc = () => {
        setSaleTargetSettingMedal(prev => [
            ...prev,
            {
                id: prev.length + 1,
                amount: '',
                conditions: [{
                    id: 1,
                    medalId: null,
                    months: selectedDep == '12523' ? 12 : 1,
                    adsPercent: selectedDep == '12523' ? '' : undefined
                }]
            }
        ]);
    };

    const removeSaleTargetSettingMedalFunc = (targetId) => {
        setSaleTargetSettingMedal(prev =>
            prev.filter(item => item.id !== targetId)
        );
    };

    const addSaleConditionFunc = (targetId) => {
        setSaleTargetSettingMedal(prev =>
            prev.map(item =>
                item.id === targetId
                    ? {
                        ...item,
                        conditions: [
                            ...item.conditions,
                            {
                                id: item.conditions.length + 1,
                                medalId: null,
                                months: selectedDep == '12523' ? 12 : 1,
                                adsPercent: selectedDep == '12523' ? '' : undefined
                            }
                        ]
                    }
                    : item
            )
        );
    };

    const removeSaleConditionFunc = (targetId, conditionId) => {
        setSaleTargetSettingMedal(prev =>
            prev.map(item =>
                item.id === targetId
                    ? {
                        ...item,
                        conditions: item.conditions.filter(
                            condition => condition.id !== conditionId
                        )
                    }
                    : item
            )
        );
    };
    // #endregion

    // #region Handlers for Ads Conditions
    const handleAdsTargetMedalChange = (targetId, field, value) => {
        setAdsTargetSettingMedal(prev =>
            prev.map(item =>
                item.id === targetId
                    ? { ...item, [field]: value }
                    : item
            )
        );
    };

    const handleAdsConditionChange = (targetId, conditionId, field, value) => {
        setAdsTargetSettingMedal(prev =>
            prev.map(item =>
                item.id === targetId
                    ? {
                        ...item,
                        conditions: item.conditions.map(condition =>
                            condition.id === conditionId
                                ? { ...condition, [field]: value }
                                : condition
                        )
                    }
                    : item
            )
        );
    };

    const addAdsTargetSettingMedalFunc = () => {
        setAdsTargetSettingMedal(prev => [
            ...prev,
            {
                id: prev.length + 1,
                amount: '',
                conditions: [{
                    id: 1,
                    medalId: null,
                    months: 1,
                    adsPercent: ''
                }]
            }
        ]);
    };

    const removeAdsTargetSettingMedalFunc = (id) => {
        setAdsTargetSettingMedal(prev => prev.filter(item => item.id !== id));
    };

    const addAdsConditionFunc = (targetId) => {
        setAdsTargetSettingMedal(prev =>
            prev.map(item =>
                item.id === targetId
                    ? {
                        ...item,
                        conditions: [
                            ...item.conditions,
                            {
                                id: item.conditions.length + 1,
                                medalId: null,
                                months: 1,
                                adsPercent: ''
                            }
                        ]
                    }
                    : item
            )
        );
    };

    const removeAdsConditionFunc = (targetId, conditionId) => {
        setAdsTargetSettingMedal(prev =>
            prev.map(item =>
                item.id === targetId
                    ? {
                        ...item,
                        conditions: item.conditions.filter(condition => condition.id !== conditionId)
                    }
                    : item
            )
        );
    };
    // #endregion

    // #region Utility Functions
    const createNewTargetSetting = (id) => ({
        id: id,
        targetMedal: '', // กำหนดค่าเริ่มต้นเป็น string ว่าง
        conditions: [{
            id: 1,
            medalId: null,
            amount: 0,
        }]
    });

    const createNewCondition = (id) => ({
        id,
        medalId: null,
        amount: 0
    });

    const formatNumberWithCommas = (value) => {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handleRadioChange = (value) => {
        if (hasExistingData) {
            return;
        }

        setInputRadio(value);

        if (value === 2) {
            setSaleTargetSettingMedal([{
                id: 1,
                amount: '',
                conditions: [{
                    id: 1,
                    medalId: null,
                    months: 1
                }]
            }]);
        } else if (value === 4) {
            setSaleTargetSettingMedal([{
                id: 1,
                amount: '',
                conditions: [{
                    id: 1,
                    medalId: null,
                    months: 1,
                    adsPercent: ''
                }]
            }]);
        }

        if (value === 1) {
            setTeamTargetSettingMedal([{
                id: 1,
                amount: '',
                conditions: [{
                    id: 1,
                    medalId: null,
                    months: 1,
                }]
            }]);
        } else if (value === 3) {
            setAddTargetSettingMedal([{
                id: 1,
                targetMedal: null,
                conditions: [{
                    id: 1,
                    medalId: null,
                    amount: 1
                }]
            }]);
            setTeamTargetSettingMedal([{
                id: 1,
                amount: '',
                conditions: [{
                    id: 1,
                    medalId: null,
                    months: 1,
                }]
            }]);
        }
    };
    // #endregion

    // #region API Calls
    const fetchAward = async () => {
        setDepLoading(true);
        setRoleLoading(true);
        try {
            const [depData, roleData, medal] = await Promise.all([
                fetchProtectedData.get(URLS.departments.getHqDepartments),
                fetchProtectedData.get(URLS.roles.getall),
                fetchProtectedData.get(URLS.award.getMedals)
            ]);

            setListDepartment(depData.data);
            setListRole(roleData.data);
            setListMedal(medal.data);
        } catch {
            toastError("เกิดข้อผิดพลาด", "การดึงข้อมูลจากเซิฟเวอร์ล้มเหลว โปรดลองใหม่อีกครั้ง");
        } finally {
            setDepLoading(false);
            setRoleLoading(false);
        }
    };

    const [saveLoading, setSaveLoading] = useState(false);
    const fetchAddCondition = async (data) => {
        setSaveLoading(true);
        try {
            const response = await fetchProtectedData.post(URLS.award.addCondition, data);
            if (response.status === 201) {
                toastSuccess("บันทึกข้อมูลเรียบร้อย");
            }
        } catch (err) {
            if (err.response.data.error.includes("Duplicated")) {
                toastError("เกิดข้อผิดพลาด", "ไม่สามารถตั้งค่าเงื่อนไขได้ เนื่องจากมีการตั้งค่าในตำแหน่งนี้เรียบร้อยแล้ว");
            } else {
                toastError("เกิดข้อผิดพลาด", "ระบบไม่สามารถบันทึกข้อมูลได้ โปรดลองใหม่อีกครั้ง");
            }
        } finally {
            setSaveLoading(false);
        }
    }
    const [awardConditionLoading, setAwardConditionLoading] = useState(false);
    const fetchAwardCondition = async () => {
        if (!selectedRole) return;

        setAwardConditionLoading(true);
        try {
            const response = await fetchProtectedData.get(URLS.award.getConditions, {
                params: {
                    baseRole: selectedRole,
                    year: moment().year()
                }
            });
            const data = response.data;
            setListAwardCondition(data);

            if (data && data.length > 0) {
                setHasExistingData(true);
            } else {
                setHasExistingData(false);
                resetFormData();
            }

        } catch {
            toastError("เกิดข้อผิดพลาด", "การดึงข้อมูลจากเซิฟเวอร์ล้มเหลว โปรดลองใหม่อีกครั้ง");
        } finally {
            setAwardConditionLoading(false);
        }
    };

    const fetchUpdateCondition = async (data) => {
        setSaveLoading(true);
        try {
            const response = await fetchProtectedData.put(
                `${URLS.award.updateCondition}/${data.id}`,
                data
            );
            if (response.status === 200) {
                toastSuccess("บันทึกข้อมูลเรียบร้อย");
            }
        } catch (err) {
            if (err.response?.data?.isDuplicate) {
                toastError("เกิดข้อผิดพลาด", "มีการตั้งค่าเงื่อนไขนี้แล้ว");
            } else {
                toastError("เกิดข้อผิดพลาด", "ระบบไม่สามารถบันทึกข้อมูลได้ โปรดลองใหม่อีกครั้ง");
            }
        } finally {
            setSaveLoading(false);
        }
    };

    // เพิ่มฟังก์ชัน fetchUpdateAdsCondition
    const fetchUpdateAdsCondition = async (data) => {
        setSaveLoading(true);
        try {
            const response = await fetchProtectedData.put(URLS.award.updateAdsCondition, data);
            if (response.status === 200) {
                toastSuccess("บันทึกข้อมูลเรียบร้อย");
            }
        } catch (err) {
            toastError("เกิดข้อผิดพลาด", "ระบบไม่สามารถบันทึกข้อมูลได้ โปรดลองใหม่อีกครั้ง");
        } finally {
            setSaveLoading(false);
        }
    };

    // #endregion

    //#region Use Effect
    useEffect(() => {
        fetchAward();
    }, [])

    useEffect(() => {
        if (selectedRole) {
            fetchAwardCondition();
        }
    }, [selectedRole])

    useEffect(() => {
        setSelectedRole(listRole.filter(role => role.depId == selectedDep)[0]?.id)

    }, [selectedDep])


    useEffect(() => {
        if (listAwardCondition.length > 0) {
            const condition = listAwardCondition[0];
            const conditionData = condition.condition;

            setHasExistingData(true);
            setInputRadio(condition.type === 'Sale' ? 2 : condition.type === 'TeamSale' ? 3 : condition.type === 'Ads' ? 4 : 1);

            if (condition.type === 'Sale') {
                if (conditionData && conditionData.length > 0) {
                    setSaleTargetSettingMedal(
                        conditionData.map((target, index) => ({
                            id: index + 1,
                            amount: target.amount.toLocaleString(),
                            conditions: target.condition.map((cond, condIndex) => ({
                                id: condIndex + 1,
                                months: cond.months,
                                adsPercent: cond.adsPercent ? cond.adsPercent.toLocaleString() : '',
                                medalId: cond.medalId
                            }))
                        }))
                    );
                    if (condition.rookieAmount) {
                        const formattedRookieAmount = condition.rookieAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        setInputSaleRookie(formattedRookieAmount);
                    } else {
                        setTabActive('normal');
                    }
                }
            } else if (condition.type === 'TeamSale') {
                if (conditionData && conditionData.length > 0) {
                    setTeamTargetSettingMedal(conditionData.map((target, index) => ({
                        id: index + 1,
                        amount: target.amount ? target.amount.toLocaleString() : '0',
                        conditions: target.condition.map((cond, condIndex) => ({
                            id: condIndex + 1,
                            months: cond.months ? cond.months.toString() : '1',
                            medalId: cond.medalId || null
                        }))
                    })));
                }
            } else if (condition.type === 'Ads') {
                if (conditionData && conditionData.length > 0) {
                    setAdsTargetSettingMedal(
                        conditionData.map((target, index) => ({
                            id: index + 1,
                            amount: target.amount.toLocaleString(),
                            conditions: target.condition.map((cond, condIndex) => ({
                                id: condIndex + 1,
                                months: cond.months,
                                medalId: cond.medalId,
                                adsPercent: cond.adsPercent ? cond.adsPercent.toLocaleString() : ''
                            }))
                        }))
                    );
                }
            } else {
                if (conditionData && conditionData.length > 0) {
                    setAddTargetSettingMedal(conditionData.map((target, index) => ({
                        id: index + 1,
                        targetMedal: target.medalId.toString(),
                        conditions: target.condition.map((cond, condIndex) => ({
                            id: condIndex + 1,
                            medalId: cond.medalId,
                            amount: cond.amount
                        }))
                    })));
                }
            }
        } else {
            setHasExistingData(false);
            setInputSaleRookie('');
            setTabActive('normal');
            setInputRadio(1);
            setAdsTargetSettingMedal([{
                id: 1,
                amount: '',
                conditions: [{
                    id: 1,
                    medalId: null,
                    months: 1,
                    adsPercent: ''
                }]
            }]);
            setSaleTargetSettingMedal([{
                id: 1,
                amount: '',
                conditions: [{
                    id: 1,
                    medalId: null,
                    months: 1,
                }]
            }]);
            setTeamTargetSettingMedal([{
                id: 1,
                amount: '',
                conditions: [{
                    id: 1,
                    medalId: null,
                    months: 1,
                }]
            }]);
            setAddTargetSettingMedal([{
                id: 1,
                targetMedal: null,
                conditions: [{
                    id: 1,
                    medalId: null,
                    amount: 1
                }]
            }]);
        }
    }, [listAwardCondition]);
    // #endregion

    // #region Render Functions
    const renderConditionFunc = (v) => {
        if (v === 2) { // กรณี Sale
            return (
                <div className="space-y-4">
                    <Tabs variant="underlined" size="md" color="primary" onSelectionChange={setTabActive}>
                        <Tab key={'normal'} title={'เงื่อนไขทั่วไป'} />
                        <Tab key={'newEmployee'} title={'เงื่อนไขพนักงานใหม่'} />
                    </Tabs>

                    {tabActive === 'newEmployee' &&
                        <div className="flex justify-start items-center space-x-2 text-md ">
                            <div className="flex justify-start items-center space-x-1">
                                <p>ยอดขายเป้าหมาย</p>
                                <Input
                                    placeholder="กรอกยอดขาย"
                                    size="md"
                                    variant="bordered"
                                    className="w-56 items-center"
                                    aria-label="กรอกยอดขาย"
                                    value={inputSaleRookie}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^\d.]/g, '');
                                        const parts = value.split('.');
                                        let formattedValue = parts[0];
                                        if (parts.length > 1) {
                                            formattedValue += '.' + parts[1].slice(0, 2);
                                        }
                                        formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                        setInputSaleRookie(formattedValue);
                                    }}
                                />
                            </div>
                            <HintIcon />
                            <p>เงื่อนไข </p>
                            <p className="font-bold">ต้องทำยอดขายตามที่กำหนด</p>
                            <p>ภายใน</p>
                            <p className="font-bold"> 4 เดือน</p>
                            <p>นับจากวันที่เข้าทำงาน</p>
                        </div>
                    }

                    <div className="max-h-[400px] overflow-auto scrollbar-hide">
                        {tabActive === 'normal' && saleTargetSettingMedal.map((item, index) => (
                            <div key={item.id} className="space-y-4 mb-10">
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex flex-col">
                                            <p>ยอดขายเป้าหมาย</p>
                                            <Input
                                                type="text"
                                                variant="bordered"
                                                size="sm"
                                                value={item.amount}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                                    if (value) {
                                                        const formattedValue = formatNumberWithCommas(value);
                                                        handleSaleTargetMedalChange(item.id, 'amount', formattedValue);
                                                    } else {
                                                        handleSaleTargetMedalChange(item.id, 'amount', '');
                                                    }
                                                }}
                                                className="w-40"
                                            />
                                        </div>

                                        {item.id !== 1 && (
                                            <div className="mt-auto">
                                                <Button
                                                    size="sm"
                                                    color="danger"
                                                    variant="flat"
                                                    onPress={() => removeSaleTargetSettingMedalFunc(item.id)}>
                                                    ลบรายการนี้
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                </div>

                                <div className="">
                                    <p>เงื่อนไข</p>
                                    {item.conditions.map((condition, ix) => (
                                        <div key={condition.id} className="flex justify-start w-[1200px] items-center space-x-4 my-4 text-nowrap">
                                            <Select
                                                placeholder="จำนวนเดือน"
                                                size="md"
                                                label="จำนวน"
                                                labelPlacement="outside-left"
                                                items={[...Array(12)].map((_, i) => ({ value: i + 1, label: i + 1 }))}
                                                variant="bordered"
                                                className="w-56 items-center"
                                                disallowEmptySelection
                                                aria-label="เลือกจำนวนเดือน"
                                                onChange={(e) => handleSaleConditionChange(item.id, condition.id, 'months', parseInt(e.target.value))}
                                                value={condition.months}
                                                defaultSelectedKeys={condition.months ? [condition.months.toString()] : ['1']}
                                            >
                                                {(monthItem) => (
                                                    <SelectItem
                                                        key={monthItem.value}
                                                        value={monthItem.value}
                                                        textValue={monthItem.label.toString()}
                                                    >
                                                        {monthItem.label}
                                                    </SelectItem>
                                                )}
                                            </Select>
                                            <p>เดือน  จะได้เหรียญรางวัล</p>
                                            <Select
                                                items={listMedal}
                                                placeholder="เลือกเหรียญรางวัล"
                                                size="md"
                                                variant="bordered"
                                                className="w-56 items-center"
                                                disallowEmptySelection
                                                aria-label="เลือกเหรียญรางวัล"
                                                onChange={(e) => handleSaleConditionChange(item.id, condition.id, 'medalId', e.target.value)}
                                                selectedKeys={condition.medalId ? [condition.medalId.toString()] : []}
                                            >
                                                {item => (
                                                    <SelectItem
                                                        key={item.id}
                                                        value={item.id}
                                                        textValue={item.name}
                                                    >
                                                        {item.name}
                                                    </SelectItem>
                                                )}
                                            </Select>

                                            {condition.id !== 1 && (
                                                <Button
                                                    isIconOnly
                                                    color="danger"
                                                    variant="flat"
                                                    onPress={() => removeSaleConditionFunc(item.id, condition.id)}>
                                                    <DeleteIcon />
                                                </Button>
                                            )}

                                            {ix === (item.conditions.length - 1) && tabActive === 'normal' &&
                                                <Button
                                                    size="md"
                                                    color="primary"
                                                    variant="flat"
                                                    onPress={() => addSaleConditionFunc(item.id)}>
                                                    เพิ่มเงื่อนไข
                                                </Button>
                                            }
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-start items-center space-x-4">
                        {tabActive === 'normal' &&
                            <Button
                                variant="flat"
                                color="primary"
                                onPress={addSaleTargetSettingMedalFunc}>
                                เพิ่มยอดขายเป้าหมาย
                            </Button>
                        }
                        <Button
                            variant="flat"
                            color="success"
                            className="ml-4"
                            isLoading={saveLoading}
                            onPress={handleSaveSaleCondition}>
                            บันทึกข้อมูล
                        </Button>
                    </div>
                </div>
            )
        } else if (v === 4) {
            return (
                <div className="max-h-[400px] overflow-auto scrollbar-hide">
                    {tabActive === 'normal' && adsTargetSettingMedal.map((item, index) => (
                        <div key={item.id} className="space-y-4 mb-10">
                            <div className="flex items-center justify-start space-x-4">
                                <div className="flex flex-col">
                                    <p>ยอดขายเป้าหมาย (รายปี)</p>
                                    <Input
                                        type="text"
                                        variant="bordered"
                                        size="sm"
                                        value={item.amount}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^0-9]/g, '');
                                            if (value) {
                                                const formattedValue = formatNumberWithCommas(value);
                                                handleAdsTargetMedalChange(item.id, 'amount', formattedValue);
                                            } else {
                                                handleAdsTargetMedalChange(item.id, 'amount', '');
                                            }
                                        }}
                                        className="w-40"
                                    />
                                </div>

                                {item.id !== 1 && (
                                    <div className="mt-auto">
                                        <Button
                                            size="sm"
                                            color="danger"
                                            variant="flat"
                                            onPress={() => removeAdsTargetSettingMedalFunc(item.id)}>
                                            ลบรายการนี้
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="">
                                <p>เงื่อนไข</p>
                                {item.conditions.map((condition, ix) => (
                                    <div key={condition.id} className="flex justify-start w-[1200px] items-center space-x-4 my-4 text-nowrap">
                                        <div className="flex items-center space-x-3">
                                            <p>ค่า Ads ไม่เกิน (%)</p>
                                            <Input
                                                type="text"
                                                variant="bordered"
                                                size="md"
                                                value={condition.adsPercent || ''}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                                    if (value) {
                                                        if (parseInt(value) <= 100) {
                                                            handleAdsConditionChange(item.id, condition.id, 'adsPercent', value);
                                                        }
                                                    } else {
                                                        handleAdsConditionChange(item.id, condition.id, 'adsPercent', '');
                                                    }
                                                }}
                                                className="w-40"
                                            />
                                        </div>

                                        <p>เดือน  จะได้เหรียญรางวัล</p>
                                        <Select
                                            items={listMedal}
                                            placeholder="เลือกเหรียญรางวัล"
                                            size="md"
                                            variant="bordered"
                                            className="w-56 items-center"
                                            disallowEmptySelection
                                            aria-label="เลือกเหรียญรางวัล"
                                            onChange={(e) => handleAdsConditionChange(item.id, condition.id, 'medalId', e.target.value)}
                                            selectedKeys={condition.medalId ? [condition.medalId.toString()] : []}
                                        >
                                            {(item) => (
                                                <SelectItem
                                                    key={item.id}
                                                    value={item.id}
                                                    textValue={item.name}
                                                >
                                                    {item.name}
                                                </SelectItem>
                                            )}
                                        </Select>



                                        {item.conditions.length > 1 && (
                                            <Button
                                                isIconOnly
                                                color="danger"
                                                variant="flat"
                                                onPress={() => removeAdsConditionFunc(item.id, condition.id)}>
                                                <DeleteIcon />
                                            </Button>
                                        )}

                                        {ix === (item.conditions.length - 1) && (
                                            <Button
                                                size="sm"
                                                variant="flat"
                                                color="primary"
                                                onPress={() => addAdsConditionFunc(item.id)}>
                                                เพิ่มเงื่อนไข
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-start items-center pt-2">
                        <Button
                            color="primary"
                            variant="flat"
                            onPress={addAdsTargetSettingMedalFunc}
                        >
                            เพิ่มยอดขายเป้าหมาย
                        </Button>

                        <Button
                            variant="flat"
                            color="success"
                            className="ml-4"
                            isLoading={saveLoading}
                            onPress={handleSaveAdsCondition}>
                            บันทึกข้อมูล
                        </Button>
                    </div>
                </div>
            );
        } else if (v == 1) {
            return (
                <div className="w-full text-nowrap space-y-4">
                    <div className="max-h-[400px] overflow-auto scrollbar-hide border-t-1">
                        {addTargetSettingMedal.map((item) => (
                            <div key={item.id} className="space-y-4 mt-5 mb-10">
                                <div className="flex justify-start items-center space-x-4">
                                    <p>เลือกเหรียญเป้าหมาย</p>
                                    <Select
                                        items={listMedal}
                                        placeholder="เลือกเหรียญเป้าหมาย"
                                        size="md"
                                        variant="bordered"
                                        className="max-w-xs items-center"
                                        disallowEmptySelection
                                        aria-label="เลือกเหรียญเป้าหมาย"
                                        onChange={(e) => handleTargetMedalChange(item.id, e.target.value)}
                                        value={item.targetMedal?.toString()}
                                        selectedKeys={item.targetMedal ? [item.targetMedal?.toString()] : []}
                                    >
                                        {(item) => (
                                            <SelectItem
                                                key={item.id?.toString()}
                                                value={item.id?.toString()}
                                                textValue={item.name}
                                            >
                                                {item.name}
                                            </SelectItem>
                                        )}
                                    </Select>

                                    {item.id !== 1 && (
                                        <Button
                                            size="md"
                                            color="danger"
                                            variant="flat"
                                            onPress={() => removeTargetSettingMedalFunc(item.id)}>
                                            ลบรายการนี้
                                        </Button>
                                    )}
                                </div>

                                <div className="px-14">
                                    <p>เงื่อนไข</p>
                                    {item.conditions.map((condition, ix) => (
                                        <div key={condition.id} className="flex justify-start w-[800px] items-center space-x-4 my-4">
                                            <p>เหรียญ</p>
                                            <Select
                                                items={listMedal}
                                                placeholder="เลือกเหรียญเงื่อนไข"
                                                size="md"
                                                variant="bordered"
                                                className="w-56 items-center"
                                                aria-label="เลือกเหรียญเงื่อนไข"
                                                disallowEmptySelection
                                                onChange={(e) => handleConditionChange(item.id, condition.id, 'medalId', e.target.value)}
                                                selectedKeys={condition.medalId ? [condition.medalId] : []}
                                            >
                                                {item => (
                                                    <SelectItem
                                                        key={item.id.toString()}
                                                        value={item.id.toString()}
                                                        textValue={item.name}
                                                    >
                                                        {item.name}
                                                    </SelectItem>
                                                )}
                                            </Select>

                                            <Input
                                                label="จำนวน"
                                                labelPlacement="outside-left"
                                                variant="bordered"
                                                size="md"
                                                placeholder="0"
                                                aria-label="input-amount"
                                                className="w-44"
                                                value={condition.amount}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/[^\d]/g, '');
                                                    const formattedValue = formatNumberWithCommas(value);
                                                    handleConditionChange(item.id, condition.id, 'amount', formattedValue);
                                                }}
                                            />


                                            {condition.id !== 1 && (
                                                <Button
                                                    size="md"
                                                    color="danger"
                                                    variant="flat"
                                                    isIconOnly
                                                    startContent={<DeleteIcon />}
                                                    className="text-lg"
                                                    onPress={() => {
                                                        setAddTargetSettingMedal(prev =>
                                                            prev.map(target =>
                                                                target.id === item.id
                                                                    ? {
                                                                        ...target,
                                                                        conditions: target.conditions.filter(c => c.id !== condition.id)
                                                                    }
                                                                    : target
                                                            )
                                                        );
                                                    }}>
                                                </Button>
                                            )}

                                            {ix === (item.conditions.length - 1) &&
                                                <Button
                                                    size="md"
                                                    color="primary"
                                                    variant="flat"
                                                    onPress={() => addConditionFunc(item.id)}>
                                                    เพิ่มเงื่อนไข
                                                </Button>
                                            }

                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-start items-center pt-2">
                        <Button
                            color="primary"
                            variant="flat"
                            onPress={addTargetSettingMedalFunc}>
                            เพิ่มเหรียญเป้าหมาย
                        </Button>

                        <Button
                            variant="flat"
                            color="success"
                            className="ml-4"
                            isLoading={saveLoading}
                            onPress={handleSaveMedalCondition}>
                            บันทึกข้อมูล
                        </Button>
                    </div>
                </div>
            )
        } else if (v == 3) {
            return (
                <div className="w-full text-nowrap space-y-4">
                    <div className="max-h-[400px] overflow-auto scrollbar-hide border-t-1">
                        {teamTargetSettingMedal.map((item) => (
                            <div key={item.id} className="space-y-4 mt-5 mb-10">
                                <div className="flex justify-start items-center space-x-3">
                                    <p>ยอดขายเป้าหมายของทีม</p>
                                    <Input
                                        type="text"
                                        variant="bordered"
                                        size="sm"
                                        value={item.amount}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^0-9]/g, '');
                                            if (value) {
                                                const formattedValue = formatNumberWithCommas(value);
                                                handleTeamTargetMedalChange(item.id, 'amount', formattedValue);
                                            } else {
                                                handleTeamTargetMedalChange(item.id, 'amount', '');
                                            }
                                        }}
                                        className="w-40"
                                    />

                                    {item.id !== 1 && (
                                        <Button
                                            size="md"
                                            color="danger"
                                            variant="flat"
                                            onPress={() => removeTeamTargetSettingMedalFunc(item.id)}>
                                            ลบรายการนี้
                                        </Button>
                                    )}
                                </div>

                                <div className="">
                                    <p>เงื่อนไข</p>
                                    {item.conditions.map((condition, ix) => (
                                        <div key={condition.id} className="flex justify-start w-[800px] items-center space-x-4 my-4">
                                            <Select
                                                placeholder="จำนวนเดือน"
                                                size="md"
                                                label="จำนวน"
                                                labelPlacement="outside-left"
                                                items={[...Array(12)].map((_, i) => ({ value: i + 1, label: i + 1 }))}
                                                variant="bordered"
                                                className="w-56 items-center"
                                                disallowEmptySelection
                                                aria-label="เลือกจำนวนเดือน"
                                                onChange={(e) => handleTeamConditionChange(item.id, condition.id, 'months', parseInt(e.target.value))}
                                                value={condition.months}
                                                defaultSelectedKeys={condition.months ? [condition.months.toString()] : ['1']}
                                            >
                                                {(monthItem) => (
                                                    <SelectItem
                                                        key={monthItem.value}
                                                        value={monthItem.value}
                                                        textValue={monthItem.label.toString()}
                                                    >
                                                        {monthItem.label}
                                                    </SelectItem>
                                                )}
                                            </Select>
                                            <p>เดือน  จะได้เหรียญรางวัล</p>
                                            <Select
                                                items={listMedal}
                                                placeholder="เลือกเหรียญรางวัล"
                                                size="md"
                                                variant="bordered"
                                                className="w-56 items-center"
                                                disallowEmptySelection
                                                aria-label="เลือกเหรียญรางวัล"
                                                onChange={(e) => handleTeamConditionChange(item.id, condition.id, 'medalId', e.target.value)}
                                                selectedKeys={condition.medalId ? [condition.medalId.toString()] : []}
                                            >
                                                {item => (
                                                    <SelectItem
                                                        key={item.id}
                                                        value={item.id}
                                                        textValue={item.name}
                                                    >
                                                        {item.name}
                                                    </SelectItem>
                                                )}
                                            </Select>

                                            {condition.id !== 1 && (
                                                <Button
                                                    size="md"
                                                    color="danger"
                                                    variant="flat"
                                                    isIconOnly
                                                    onPress={() => {
                                                        setTeamTargetSettingMedal(prev =>
                                                            prev.map(target =>
                                                                target.id === item.id
                                                                    ? {
                                                                        ...target,
                                                                        conditions: target.conditions.filter(c => c.id !== condition.id)
                                                                    }
                                                                    : target
                                                            )
                                                        );
                                                    }}>
                                                    <DeleteIcon />
                                                </Button>
                                            )}

                                            {ix === (item.conditions.length - 1) &&
                                                <Button
                                                    size="md"
                                                    color="primary"
                                                    variant="flat"
                                                    onPress={() => addTeamConditionFunc(item.id)}>
                                                    เพิ่มเงื่อนไข
                                                </Button>
                                            }
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-start items-center pt-2">
                        <Button
                            color="primary"
                            variant="flat"
                            onPress={addTeamTargetSettingMedalFunc}>
                            เพิ่มยอดขายเป้าหมาย
                        </Button>

                        <Button
                            variant="flat"
                            color="success"
                            className="ml-4"
                            isLoading={saveLoading}
                            onPress={handleSaveTeamCondition}>
                            บันทึกข้อมูล
                        </Button>
                    </div>
                </div>
            )
        }
    };
    // #endregion

    // #region บันทึกข้อมูล
    const validateMedalCondition = () => {
        if (!selectedRole) {
            toastWarning('กรุณาเลือกตำแหน่ง', 'กรุณาเลือกตำแหน่งก่อนบันทึกข้อมูล');
            return false;
        }

        for (const target of addTargetSettingMedal) {
            if (!target.targetMedal) {
                toastWarning('กรุณาเลือกรางวัล', 'กรุณาเลือกรางวัลให้ครบทุกเป้าหมาย');
                return false;
            }

            for (const condition of target.conditions) {
                if (!condition.medalId) {
                    toastWarning('กรุณาเลือกเหรียญ', 'กรุณาเลือกเหรียญให้ครบทุกเงื่อนไข');
                }
                if (!condition.amount || condition.amount <= 0) {
                    toastWarning('กรุณากรอกจำนวนเหรียญ', 'กรุณากรอกจำนวนเหรียญให้ครบทุกเงื่อนไข และต้องมากกว่า 0');
                    return false;
                }
            }
        }

        return true;
    };

    const handleSaveMedalCondition = async () => {
        if (!validateMedalCondition()) {
            return;
        }

        const preparedData = {
            baseRole: selectedRole,
            type: 'OwnUser',
            year: moment().year(),
            businessId: currentUser.businessId,
            condition: JSON.stringify(addTargetSettingMedal.map((target, index) => ({
                tier: index,
                medalId: target.targetMedal,
                condition: target.conditions.map(cond => ({
                    medalId: cond.medalId,
                    amount: parseInt(cond.amount)
                }))
            })))
        };

        if (hasExistingData) {
            const updateData = {
                id: listAwardCondition[0].id,
                ...preparedData,
                updateBy: currentUser.userName
            };
            await fetchUpdateCondition(updateData);
            await fetchAwardCondition();
        } else {
            await fetchAddCondition({
                ...preparedData,
                createBy: currentUser.userName
            });
            await fetchAwardCondition();
        }
    };

    const validateSaleCondition = () => {
        for (let i = 0; i < saleTargetSettingMedal.length; i++) {
            const target = saleTargetSettingMedal[i];

            if (!target.amount || parseFloat(target.amount.replace(/,/g, '')) <= 0) {
                toastWarning('กรุณากรอกยอดขาย', 'กรุณากรอกยอดขายให้มากกว่า 0');
                return false;
            }

            if (i > 0) {
                const currentAmount = parseFloat(target.amount.replace(/,/g, ''));
                const previousAmount = parseFloat(saleTargetSettingMedal[i - 1].amount.replace(/,/g, ''));

                if (currentAmount <= previousAmount) {
                    toastWarning(
                        'ยอดขายไม่ถูกต้อง',
                        `ยอดขายเป้าหมายของ ลำดับ ${i + 1} (${target.amount} บาท) ต้องมากกว่ายอดขายของ อันที่ ${i} (${saleTargetSettingMedal[i - 1].amount} บาท)`
                    );
                    return false;
                }
            }

            for (const condition of target.conditions) {
                if (condition.months <= 0) {
                    toastWarning('กรุณากรอกจำนวนเดือน', 'กรุณากรอกจำนวนเดือนให้มากกว่า 0');
                    return false;
                }

                if (!condition.medalId) {
                    toastWarning('กรุณาเลือกเหรียญรางวัล', 'กรุณาเลือกเหรียญรางวัลให้ครบทุกเงื่อนไข');
                    return false;
                }
            }
        }
        return true;
    };

    const handleSaveSaleCondition = async () => {
        if (!validateSaleCondition()) {
            return;
        }

        const preparedData = {
            baseRole: selectedRole,
            type: 'Sale',
            year: moment().year(),
            businessId: currentUser.businessId,
            condition: JSON.stringify(saleTargetSettingMedal.map((target, index) => ({
                tier: index,
                amount: parseFloat(target.amount.replace(/,/g, '')),
                condition: target.conditions.map(cond => ({
                    months: parseInt(cond.months),
                    medalId: cond.medalId,
                }))
            }))),
            rookieAmount: inputRadio === 2 ? (inputSaleRookie ? parseFloat(inputSaleRookie.replace(/,/g, '')) : undefined) : undefined,
            createBy: currentUser.userName
        };

        try {
            let response;
            if (hasExistingData) {
                response = await fetchProtectedData.put(
                    URLS.award.updateMultipleCondition,
                    preparedData
                );
            } else {
                response = await fetchProtectedData.post(
                    URLS.award.addCondition,
                    preparedData
                );
            }

            if (response.status === 200 || response.status === 201) {
                toastSuccess('บันทึกข้อมูลสำเร็จ');
                fetchSettingAndMedal();
            }
        } catch (error) {
            if (error.response?.data?.isDuplicate) {
                toastError('เกิดข้อผิดพลาด', 'มีการตั้งค่าเงื่อนไขนี้แล้ว');
            } else {
                toastError('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้');
            }
        }
    };

    const validateTeamCondition = () => {
        for (const target of teamTargetSettingMedal) {
            if (!target.amount || parseFloat(target.amount.replace(/,/g, '')) <= 0) {
                toastWarning('กรุณากรอกยอดขาย', 'กรุณากรอกยอดขายให้มากกว่า 0');
                return false;
            }

            for (const condition of target.conditions) {
                if (condition.months <= 0) {
                    toastWarning('กรุณากรอกจำนวนเดือน', 'กรุณากรอกจำนวนเดือนให้มากกว่า 0');
                    return false;
                }
                if (!condition.medalId) {
                    toastWarning('กรุณาเลือกเหรียญรางวัล', 'กรุณาเลือกเหรียญรางวัลให้ครบทุกเงื่อนไข');
                    return false;
                }
            }
        }
        return true;
    };

    const handleSaveTeamCondition = async () => {
        if (!validateTeamCondition()) {
            return;
        }

        const preparedData = {
            baseRole: selectedRole,
            type: 'TeamSale',
            year: moment().year(),
            businessId: currentUser.businessId,
            condition: JSON.stringify(teamTargetSettingMedal.map((target, index) => ({
                tier: index,
                amount: parseFloat((target.amount || '0').replace(/,/g, '')),
                condition: target.conditions.map(cond => ({
                    months: parseInt(cond.months || '1'),
                    medalId: cond.medalId
                }))
            })))
        };

        const conditions = JSON.parse(preparedData.condition);

        for (const target of conditions) {
            for (const condition of target.condition) {
                if (!condition.medalId) {
                    toastWarning('ข้อมูลไม่ถูกต้อง', 'ไม่พบข้อมูลเหรียญรางวัล กรุณาลองใหม่อีกครั้ง');
                    return;
                }
            }
        }

        if (hasExistingData) {
            const updateData = {
                id: listAwardCondition[0].id,
                ...preparedData,
                updateBy: currentUser.userName
            };
            await fetchUpdateCondition(updateData);
            await fetchAwardCondition();
        } else {
            await fetchAddCondition({
                ...preparedData,
                createBy: currentUser.userName
            });
            await fetchAwardCondition();
        }
    };
    // #endregion

    const addTeamConditionFunc = (targetId) => {
        setTeamTargetSettingMedal(prev =>
            prev.map(item => {
                if (item.id === targetId) {
                    return {
                        ...item,
                        conditions: [
                            ...item.conditions,
                            {
                                id: item.conditions.length + 1,
                                months: 1,
                                medalId: ''
                            }
                        ]
                    };
                }
                return item;
            })
        );
    };

    const fetchDeleteCondition = async (id) => {
        setDeleteLoading(true);
        try {
            const response = await fetchProtectedData.delete(
                `${URLS.award.deleteCondition}/${id}`
            );
            if (response.status === 200) {
                toastSuccess("ลบข้อมูลเรียบร้อย");
                setInputRadio(1);
                setHasExistingData(false);
                setAddTargetSettingMedal([{
                    id: 1,
                    targetMedal: '',
                    conditions: [{
                        id: 1,
                        medalId: '',
                        amount: ''
                    }]
                }]);
                setSaleTargetSettingMedal([{
                    id: 1,
                    amount: '',
                    adsPercent: '',
                    conditions: [{
                        id: 1,
                        months: '',
                        medalId: ''
                    }]
                }]);
                setTeamTargetSettingMedal([{
                    id: 1,
                    amount: '',
                    conditions: [{
                        id: 1,
                        months: '',
                        medalId: ''
                    }]
                }]);
                setInputSaleRookie('');
                setTabActive('normal');
            }
        } catch (err) {
            toastError("เกิดข้อผิดพลาด", "ระบบไม่สามารถลบข้อมูลได้ โปรดลองใหม่อีกครั้ง");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteCondition = () => {
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            if (selectedDep == '12523') {
                await fetchDeleteMultipleCondition();
            } else {
                await fetchDeleteCondition(listAwardCondition[0].id);
            }
            await fetchAwardCondition();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting condition:', error);
            toastError("เกิดข้อผิดพลาด", "ระบบไม่สามารถลบข้อมูลได้ โปรดลองใหม่อีกครั้ง");
        }
    };

    const resetFormData = () => {
        setInputRadio(1);
        setAddTargetSettingMedal([{
            id: 1,
            targetMedal: '',
            conditions: [{
                id: 1,
                medalId: '',
                amount: ''
            }]
        }]);
        setSaleTargetSettingMedal([{
            id: 1,
            amount: '',
            adsPercent: '',
            conditions: [{
                id: 1,
                months: '',
                medalId: ''
            }]
        }]);
        setTeamTargetSettingMedal([{
            id: 1,
            amount: '',
            conditions: [{
                id: 1,
                months: '',
                medalId: ''
            }]
        }]);
        setInputSaleRookie('');
        setTabActive('normal');
    };

    const handleCopySetting = () => {
        if (!selectedRole) {
            toastWarning('กรุณาเลือกตำแหน่ง', 'กรุณาเลือกตำแหน่งก่อนคัดลอกการตั้งค่า');
            return;
        }
        setIsCopyModalOpen(true);
    };

    const fetchUpdateMultipleCondition = async (data) => {
        setSaveLoading(true);
        try {
            const response = await fetchProtectedData.put(
                URLS.award.updateMultipleCondition,
                data
            );

            if (response.status === 200) {
                toastSuccess("บันทึกข้อมูลเรียบร้อย");
            }
        } catch (err) {
            if (err.response?.data?.isDuplicate) {
                toastError("เกิดข้อผิดพลาด", "มีการตั้งค่าเงื่อนไขนี้แล้ว");
            } else {
                toastError("เกิดข้อผิดพลาด", "ระบบไม่สามารถบันทึกข้อมูลได้ โปรดลองใหม่อีกครั้ง");
            }
        } finally {
            setSaveLoading(false);
        }
    };

    const fetchDeleteMultipleCondition = async () => {
        setDeleteLoading(true);
        try {

            const response = await fetchProtectedData.put(URLS.award.deleteAdsCondition, {
                year: listAwardCondition[0].year
            });

            if (response.status === 200) {
                toastSuccess("ลบข้อมูลเรียบร้อย");
                setInputRadio(1);
                setHasExistingData(false);
                resetFormData();
            }
        } catch (err) {
            toastError("เกิดข้อผิดพลาด", "ระบบไม่สามารถลบข้อมูลได้ โปรดลองใหม่อีกครั้ง");
        } finally {
            setDeleteLoading(false);
            setIsDeleteModalOpen(false);
        }
    };

    const handleSaveAdsCondition = async () => {
        if (!validateAdsCondition()) {
            return;
        }

        const preparedData = {
            baseRole: listRole.filter(role => role.depId == '12523').map(role => role.id),
            type: 'Ads',
            year: moment().year(),
            businessId: currentUser.businessId,
            condition: JSON.stringify(adsTargetSettingMedal.map((target, index) => ({
                tier: index,
                amount: parseFloat(target.amount.replace(/,/g, '')),
                condition: target.conditions.map(cond => ({
                    months: 12,
                    medalId: cond.medalId,
                    adsPercent: inputRadio === 4 ? parseInt(cond.adsPercent) : 0
                }))
            }))),
            createBy: currentUser.userName
        };


        if (hasExistingData) {
            const updateData = {
                id: listAwardCondition[0].id,
                ...preparedData,
                updateBy: currentUser.userName
            };
            setUpdatePayload(updateData);
            setIsUpdateModalOpen(true);
        } else {
            await fetchAddCondition(preparedData);
            await fetchAwardCondition();
        }
    };

    // เพิ่มฟังก์ชันสำหรับ handle การ confirm update
    const handleConfirmUpdate = async () => {
        if (updatePayload) {
            await fetchUpdateAdsCondition(updatePayload);
            await fetchAwardCondition();
            setIsUpdateModalOpen(false);
            setUpdatePayload(null);
        }
    };

    const validateAdsCondition = () => {
        // ตรวจสอบว่ามีการเลือกตำแหน่งหรือไม่
        if (!selectedRole) {
            toastWarning('กรุณาเลือกตำแหน่ง', 'กรุณาเลือกตำแหน่งก่อนบันทึกข้อมูล');
            return false;
        }

        // ตรวจสอบข้อมูลในแต่ละเป้าหมาย
        for (const target of adsTargetSettingMedal) {
            // ตรวจสอบยอดขาย
            if (!target.amount || parseFloat(target.amount.replace(/,/g, '')) <= 0) {
                toastWarning('กรุณากรอกยอดขาย', 'กรุณากรอกยอดขายให้ครบทุกเป้าหมาย และต้องมากกว่า 0');
                return false;
            }

            // ตรวจสอบเงื่อนไขย่อย
            for (const condition of target.conditions) {
                // ตรวจสอบการเลือกเหรียญ
                if (!condition.medalId) {
                    toastWarning('กรุณาเลือกเหรียญ', 'กรุณาเลือกเหรียญให้ครบทุกเงื่อนไข');
                    return false;
                }

                // ตรวจสอบค่า Ads Percent
                if (!condition.adsPercent) {
                    toastWarning('กรุณากรอกค่า Ads', 'กรุณากรอกค่า Ads ให้ครบทุกเงื่อนไข และไม่เกิน 100%');
                    return false;
                }

                if (parseInt(condition.adsPercent) > 100) {
                    toastWarning('ค่า Ads ไม่ถูกต้อง', 'ค่า Ads ต้องไม่เกิน 100%');
                    return false;
                }
            }
        }

        return true;
    };

    return (
        <>
            <AlertQuestion
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="ยืนยันการลบ"
                content={selectedDep == '12523'
                    ? "คุณต้องการลบการตั้งค่าเงื่อนไขของทุกตำแหน่งในแผนกนี้ใช่หรือไม่ ? การลบข้อมูลนี้จะทำให้ข้อมูลที่ตั้งค่าไว้ก่อนหน้าของตัวแทนหายไปทั้งหมด"
                    : "คุณต้องการลบการตั้งค่าเงื่อนไขนี้ใช่หรือไม่ ? การลบข้อมูลนี้จะทำให้ข้อมูลที่ตั้งค่าไว้ก่อนหน้านี้หายไปทั้งหมดในการตั้งค่าของตำแหน่งนี้"
                }
                confirmText="ลบ"
                cancelText="ยกเลิก"
                icon="warning"
                color="danger"
                isLoading={deleteLoading}
            />

            <AlertQuestion
                isOpen={isUpdateModalOpen}
                onClose={() => {
                    setIsUpdateModalOpen(false);
                    setUpdatePayload(null);
                }}
                onConfirm={handleConfirmUpdate}
                title="ยืนยันการแก้ไข"
                content="คุณต้องการแก้ไขการตั้งค่าเงื่อนไขนี้ใช่หรือไม่ ? การแก้ไขข้อมูลนี้จะส่งผลให้ตัวแทนทั้งหมดต้องตั้งค่าใหม่"
                confirmText="ยืนยัน"
                cancelText="ยกเลิก"
                icon="warning"
                color="warning"
                isLoading={saveLoading}
            />

            <ModalCoppySetting
                isOpen={isCopyModalOpen}
                closed={() => setIsCopyModalOpen(false)}
                listRole={listRole}
                listMedal={listMedal}
                onCopy={(copiedData) => {
                    setInputRadio((copiedData.type === 'Sale' ? 2 : copiedData.type === 'Ads' ? 4 : copiedData.type === 'TeamSale' ? 3 : 1));
                    if (copiedData.type === 'Sale') {
                        setSaleTargetSettingMedal(
                            copiedData.condition.map((target, index) => ({
                                id: index + 1,
                                amount: target.amount.toLocaleString(),
                                conditions: target.condition.map((cond, condIndex) => ({
                                    id: condIndex + 1,
                                    months: cond.months?.toString() || '1',
                                    medalId: cond.medalId?.toString()
                                }))
                            }))
                        );
                        if (copiedData.rookieAmount) {
                            setInputSaleRookie(copiedData.rookieAmount.toLocaleString());
                        }
                    } else if (copiedData.type === 'Ads') {
                        setSaleTargetSettingMedal(
                            copiedData.condition.map((target, index) => ({
                                id: index + 1,
                                amount: target.amount.toLocaleString(),
                                conditions: target.condition.map((cond, condIndex) => ({
                                    id: condIndex + 1,
                                    months: cond.months?.toString() || '1',
                                    medalId: cond.medalId?.toString(),
                                    adsPercent: cond.adsPercent?.toString() || ''
                                }))
                            }))
                        );
                    } else if (copiedData.type === 'TeamSale') {
                        setTeamTargetSettingMedal(
                            copiedData.condition.map((target, index) => ({
                                id: index + 1,
                                amount: target.amount.toLocaleString(),
                                conditions: target.condition.map((cond, condIndex) => ({
                                    id: condIndex + 1,
                                    months: cond.months?.toString() || '1',
                                    medalId: cond.medalId?.toString()
                                }))
                            }))
                        );
                    } else {
                        setAddTargetSettingMedal(
                            copiedData.condition.map((target, index) => ({
                                id: index + 1,
                                targetMedal: listMedal.find(medal => medal.id == target.medalId)?.id?.toString(),
                                conditions: target.condition.map((cond, condIndex) => ({
                                    id: condIndex + 1,
                                    medalId: cond.medalId?.toString(),
                                    amount: cond.amount
                                }))
                            }))
                        );
                    }
                }}
            />

            <div className="flex w-full h-full gap-4 items-start max-lg:flex-wrap max-lg:h-full max-lg:overflow-auto max-lg:scrollbar-hide">
                <div className="flex-1 space-y-4">
                    <div className="flex space-x-4">
                        <Select
                            onChange={handleDepartmentChange}
                            value={selectedDep}
                            items={listDepartment.filter(dep => dep.isHq === 1)}
                            label='เลือกแผนก'
                            placeholder="เลือกแผนกสำหรับตั้งค่า"
                            className="text-nowrap items-center max-w-xs"
                            labelPlacement="outside-left"
                            disallowEmptySelection
                            variant="bordered"
                            isLoading={depLoading}
                            size="md"
                            isDisabled={listDepartment.length === 0}>
                            {(item) => (
                                <SelectItem key={item.id.toString()} value={item.id.toString()} endContent={item.isHq === 1 && <Chip size="sm" variant="flat" color="success">สำนักงานใหญ่</Chip>}>
                                    {item.departmentName}
                                </SelectItem>
                            )}
                        </Select>
                        <Select
                            onChange={handleRoleChange}
                            value={selectedRole}
                            items={listRole.filter(x => x.depId == selectedDep)}
                            label='เลือกตำแหน่ง'
                            placeholder={`${listRole.filter(x => x.depId == selectedDep).length === 0 ? 'โปรดเลือกแผนกก่อน' : 'เลือกตำแหน่งสำหรับตั้งค่า'}`}
                            className="text-nowrap items-center max-w-xs"
                            labelPlacement="outside-left"
                            variant="bordered"
                            disallowEmptySelection
                            isDisabled={(listRole.filter(x => x.depId == selectedDep).length === 0 || selectedDep == '12523') ? true : false}
                            size="md"
                            selectedKeys={selectedDep == '12523' ? 'all' : ''}
                            selectionMode="single">
                            {(item) => (
                                <SelectItem key={item.id} value={item.id}>
                                    {item.roleName}
                                </SelectItem>
                            )}
                        </Select>

                        {selectedRole &&
                            <Button
                                size="md"
                                variant="flat"
                                color="primary"
                                onPress={handleCopySetting}
                            >
                                คัดลอกการตั้งค่า
                            </Button>
                        }

                        {hasExistingData &&
                            <Button
                                size="md"
                                variant="flat"
                                color="danger"
                                onPress={handleDeleteCondition}
                            >
                                ลบการตั้งค่า
                            </Button>
                        }
                    </div>

                    {selectedRole ? (
                        <>
                            <div className="py-4">
                                <RadioGroup
                                    label="เลือกเงื่อนไข"
                                    orientation="horizontal"
                                    value={inputRadio}
                                    onValueChange={(value) => {
                                        if (!hasExistingData) {
                                            handleRadioChange(value);
                                        }
                                    }}
                                    isDisabled={hasExistingData}
                                >
                                    <Radio value={1} isDisabled={hasExistingData && inputRadio !== 1}>
                                        จากเหรียญของผู้ที่ดูแลอยู่
                                    </Radio>
                                    <Radio value={2} isDisabled={hasExistingData && inputRadio !== 2}>
                                        จากยอดขาย
                                    </Radio>
                                    <Radio value={3} isDisabled={hasExistingData && inputRadio !== 3}>
                                        จากยอดขายของทีมที่ดูแล
                                    </Radio>
                                    <Radio value={4} isDisabled={hasExistingData && inputRadio !== 4}>
                                        ยอดขายทีม Ads
                                    </Radio>
                                </RadioGroup>
                            </div>

                            <div className="w-full">
                                {renderConditionFunc(inputRadio)}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 mt-4 bg-gray-50 rounded-lg">
                            <InfomationIcon className="w-12 h-12 text-gray-400 mb-2" />
                            <p className="text-gray-600 text-lg">
                                กรุณาเลือกแผนกและตำแหน่งที่ต้องการตั้งค่า
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default SettingConditionMedal;