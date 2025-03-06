import React, { useState, useMemo, useEffect } from "react";
import {
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Input,
    Divider,
    Textarea,
    Chip,
} from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import fetchProtectedData from "../../../../../utils/fetchData";
import { toastSuccess, toastError } from "@/component/Alert";
import { Image } from "@nextui-org/react";
import { DeleteIcon } from "@/component/Icons";
import { ScrollArea } from "@/components/ui/scroll-area"
import { URLS } from "@/config";

function DashboardOverviewSettingBody() {
    const [selectedKeys, setSelectedKeys] = useState(new Set(["รายปี"]));

    const [selectedSettingKeys, setSelectedSettingKeys] = useState(new Set([""]));

    const [forms, setForms] = useState([]);
    const [settingData, setSettingData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [deletedIds, setDeletedIds] = useState([]);

    const selectedValue = useMemo(
        () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
        [selectedKeys]
    );

    const selectedSettingValue = useMemo(
        () => Array.from(selectedSettingKeys).join(", ").replace(/_/g, ""),
        [selectedSettingKeys]
    );

    const getChipColor = (conditionType) => {
        switch (conditionType) {
            case "รายวัน":
                return "primary";
            case "รายอาทิตย์":
                return "secondary";
            case "รายเดือน":
                return "success";
            case "รายไตรมาส":
                return "warning";
            case "รายปี":
                return "danger";
            default:
                return "default";
        }
    };

    const handleAddForm = () => {
        setIsFormVisible(true);
        setForms((prevForms) => [
            ...prevForms,
            {
                id: -(prevForms.length + 1),
                amount: "",
                content: "",
                reward: "",
                conditionType: selectedValue,
            },
        ]);
    };

    const handleRemoveForm = (id) => {
        setForms((prevForms) => prevForms.filter((form) => form.id !== id));

        if (id > 0) {
            setDeletedIds((prevDeletedIds) => [...prevDeletedIds, id]);
        }
    }

    const handleInputChange = (id, field, value) => {
        setForms((prevForms) =>
            prevForms.map((form) =>
                form.id === id ? { ...form, [field]: value } : form
            )
        );
    };

    const fetchSettingData = async () => {
        setIsLoading(true);
        try {
            const response = await fetchProtectedData.get(
                `${URLS.overView.getAllSetting}`,
                {
                    params: {
                        conditionType: selectedValue,
                    },
                }
            );
            const updatedData = response.data.map((form) => ({
                ...form,
                id: form.id,
            }));
            setSettingData(updatedData);
            setForms(updatedData);
            setIsFormVisible(updatedData.length > 0);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettingData();
    }, [selectedValue]);

    const handleSubmitForms = async () => {
        try {
            if (forms.length === 0 && deletedIds.length === 0) {
                toastError("ไม่มีข้อมูลสำหรับบันทึก");
                return;
            }

            const newForms = forms.filter((form) => form.id < 0);
            const existingForms = forms.filter((form) => form.id > 0);

            if (newForms.length > 0) {
                await fetchProtectedData.post(
                    `${URLS.overView.createSettingForm}`,
                    { forms: newForms.map(({ id, ...rest }) => rest) }
                );
            }

            if (existingForms.length > 0 || deletedIds.length > 0) {
                await fetchProtectedData.post(
                    `${URLS.overView.updateSettingForm}`,
                    {
                        forms: existingForms,
                        deletedIds,
                    }
                );
            }

            toastSuccess("บันทึกข้อมูลสำเร็จ");
            setDeletedIds([]);
            fetchSettingData();
        } catch (error) {
            console.error("Error saving data:", error);
            toastError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
    };

    const handleConditionTypeChange = (keys) => {
        setSelectedKeys(keys);
        setForms([]);
        setIsFormVisible(false);
    };

    const handleConditionSettingTypeChange = (keys) => {
        setSelectedSettingKeys(keys);
    };

    const fetchSettingValue = async () => {
        try {
            const response = await fetchProtectedData.get(
                `${URLS.overView.getOverviewConfigSetting}`
            );

            if (response.status === 200) {
                const data = response.data;
                setSelectedSettingKeys(new Set([data.settingValue]));
            } else {
                console.error("Error fetching data:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching data:", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettingValue();
    }, []);

    const handleSaveSetting = async (selectedSettingValue) => {
        try {
            await fetchProtectedData.put(`${URLS.overView.updateSettingConfig}`, {
                section: "overview",
                settingKey: "condition_type",
                settingValue: selectedSettingValue,
            });
            toastSuccess("บันทึกข้อมูลการแสดงผลสำเร็จ");
        } catch (error) {
            toastError("เกิดข้อผิดพลาดในการบันทึกข้อมูลการตั้งค่า");
        }
    };

    const isEditing = settingData.length > 0;

    return (
        <div className="space-y-4">
            <div className="flex justify-between space-y-4 items-center">
                <div className="space-x-4">
                    <span className="text-md font-semibold">เลือกรูปแบบการตั้งค่า</span>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button className="capitalize" variant="bordered">
                                {selectedValue}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label="Single selection example"
                            selectedKeys={selectedKeys}
                            selectionMode="single"
                            variant="flat"
                            onSelectionChange={handleConditionTypeChange}
                        >
                            <DropdownItem key="รายวัน">รายวัน</DropdownItem>
                            <DropdownItem key="รายอาทิตย์">รายอาทิตย์</DropdownItem>
                            <DropdownItem key="รายเดือน">รายเดือน</DropdownItem>
                            <DropdownItem key="รายไตรมาส">รายไตรมาส</DropdownItem>
                            <DropdownItem key="รายปี">รายปี</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div className="space-x-4">
                    <span className="text-md font-semibold">รูปแบบการแสดงผล</span>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button className="capitalize" variant="bordered">
                                {selectedSettingValue}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label="Single selection example"
                            selectedKeys={selectedSettingKeys}
                            selectionMode="single"
                            variant="flat"
                            onSelectionChange={handleConditionSettingTypeChange}
                        >
                            <DropdownItem key="รายวัน">รายวัน</DropdownItem>
                            <DropdownItem key="รายอาทิตย์">รายอาทิตย์</DropdownItem>
                            <DropdownItem key="รายเดือน">รายเดือน</DropdownItem>
                            <DropdownItem key="รายไตรมาส">รายไตรมาส</DropdownItem>
                            <DropdownItem key="รายปี">รายปี</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Button onPress={() => handleSaveSetting(selectedSettingValue)} color="primary" variant="flat">
                        บันทึก
                    </Button>
                </div>
            </div>
            <Divider className="my-2" />

            {isLoading ? (
                <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>
            ) : settingData.length === 0 && forms.length === 0 ? (
                <div className="flex flex-col items-center justify-center mx-auto space-y-4">
                    <p className="text-center text-gray-500">
                        ยังไม่มีการเพิ่มเงื่อนไขของ {selectedValue}
                    </p>
                    <Image
                        alt="HeroUI hero Image"
                        src="/img/FindingItems.png"
                        width={150}
                    />
                </div>
            ) : null}

            <div className="flex justify-start items-center space-x-4">
                <span className="text-md font-semibold">รายละเอียดของ {selectedValue}</span>
                <Button isIconOnly size="sm" color="primary" variant="flat" onPress={handleAddForm}>
                    <PlusIcon />
                </Button>
            </div>
            {isFormVisible && forms.length > 0 && (
                <ScrollArea className="h-[500px] w-full rounded-md">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {forms.length > 0 ? (
                                forms.map((form, index) => (
                                    <div
                                        key={form.id || index}
                                        className="w-full border rounded-lg p-4 bg-white shadow-sm"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="font-medium">ขั้นที่ {index + 1}</span>
                                            <Chip color={getChipColor(form.conditionType)} variant="flat">
                                                {form.conditionType}
                                            </Chip>
                                        </div>
                                        <div className="flex flex-col gap-1 mb-4">
                                            <label className="text-sm font-medium text-gray-700">จำนวน</label>
                                            <Input
                                                type="text"
                                                size="md"
                                                variant="bordered"
                                                placeholder="0.00"
                                                value={form.amount}
                                                startContent={
                                                    <div className="pointer-events-none flex items-center">
                                                        <span className="text-default-400 text-md">$</span>
                                                    </div>
                                                }
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^\d*\.?\d{0,2}$/.test(value)) {
                                                        handleInputChange(form.id, "amount", value);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1 mb-4">
                                            <label className="text-sm font-medium text-gray-700">รางวัล</label>
                                            <Textarea
                                                size="sm"
                                                variant="bordered"
                                                placeholder="เพิ่มรางวัล..."
                                                value={form.reward}
                                                onChange={(e) =>
                                                    handleInputChange(form.id, "reward", e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1 mb-4">
                                            <label className="text-sm font-medium text-gray-700">เงื่อนไข</label>
                                            <Textarea
                                                size="sm"
                                                variant="bordered"
                                                placeholder="เพิ่มเงื่อนไข..."
                                                value={form.content}
                                                onChange={(e) =>
                                                    handleInputChange(form.id, "content", e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <Button
                                                isIconOnly
                                                color="danger"
                                                size="md"
                                                variant="flat"
                                                onPress={() => handleRemoveForm(form.id)}
                                            >
                                                <DeleteIcon />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 w-full">
                                    ยังไม่มีฟอร์ม กรุณาเพิ่มฟอร์มใหม่
                                </p>
                            )}
                        </div>

                        <Divider className="my-2" />
                    </div>
                </ScrollArea>
            )}
            <div className="flex justify-end">
                <Button color="primary" onPress={handleSubmitForms}>
                    {isEditing ? "บันทึกการแก้ไขข้อมูล" : "บันทึกข้อมูล"}
                </Button>
            </div>
        </div>
    );
}

export default DashboardOverviewSettingBody;
