import { ConfirmCancelButtons } from "@/component/Buttons";
import { URLS } from "@/config";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { Checkbox, Chip, Select, SelectItem, Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { useAppContext } from "@/contexts/AppContext";
import { Input, Textarea } from "@nextui-org/react";
import moment from "moment";
import { toastError, toastSuccess } from "@/component/Alert";
import { Spinner } from "@nextui-org/react";
import { DeleteIcon, CopyIcon } from "@/component/Icons";

function ModalSettingAwards({ open, closed, selectedDepData, listDepData, medalData, listMedalData, awardData, isRefresh , selectedYear }) {
    const { currentUser } = useAppContext();
    const [selectedDep, setSelectedDep] = useState(selectedDepData);
    const [selectedMedal, setSelectedMedal] = useState(medalData?.id);
    const [isAllPosition, setIsAllPosition] = useState(false);
    const [listPosition, setListPosition] = useState([]);
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingPosition, setLoadingPosition] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // State สำหรับเก็บข้อมูลรางวัลแต่ละตำแหน่ง
    const [roleAwards, setRoleAwards] = useState([]);

    // เพิ่ม state สำหรับเก็บตำแหน่งที่เลือกแล้ว
    const [selectedPositions, setSelectedPositions] = useState(new Set([]));

    // เพิ่ม state และฟังก์ชันสำหรับ modal copy
    const [openCopyModal, setOpenCopyModal] = useState(false);

    // เพิ่ม state สำหรับ error validation
    const [errors, setErrors] = useState({
        title: { state: false, message: '' },
        desc: { state: false, message: '' }
    });

    const getListPosition = async (depId) => {
        setLoadingPosition(true);
        try {
            const res = await fetchProtectedData.get(URLS.roles.getByDep + '/' + depId);
            setListPosition(res.data);

            setSelectedPositions(new Set(res.data.map(pos => pos.id.toString())));
            const existingAwards = awardData.find(award => award.medalId == medalData.id)?.awards || [];

            setRoleAwards(res.data.map(role => {
                const existingAward = existingAwards.find(award => award.roleId === role.id);
                return {
                    awardId: existingAward?.awardId || null,
                    roleId: role.id,
                    roleName: role.roleName,
                    roleLevel: role.roleLevel,
                    awardTitle: existingAward?.awardTitle || '',
                    awardDesc: existingAward?.awardDesc || '',
                    image: existingAward?.image || null
                };
            }));
        } catch (err) {
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลตำแหน่งได้');
        } finally {
            setLoadingPosition(false);
        }
    };

    // เพิ่มฟังก์ชันตรวจสอบข้อมูล
    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            title: { state: false, message: '' },
            desc: { state: false, message: '' }
        };

        if (isAllPosition) {
            // ตรวจสอบกรณีตั้งค่าทุกตำแหน่ง
            if (!roleAwards[0]?.awardTitle?.trim()) {
                newErrors.title = { state: true, message: 'กรุณากรอกหัวข้อของรางวัล' };
                isValid = false;
            }
            if (!roleAwards[0]?.awardDesc?.trim()) {
                newErrors.desc = { state: true, message: 'กรุณากรอกรายละเอียดของรางวัล' };
                isValid = false;
            }
        } else {
            // ตรวจสอบกรณีตั้งค่าแยกตำแหน่ง
            const selectedAwards = roleAwards.filter(award => 
                selectedPositions.has(award.roleId.toString())
            );

            // ตรวจสอบว่ามีการเลือกตำแหน่งหรือไม่
            if (selectedPositions.size === 0) {
                toastError('กรุณาเลือกตำแหน่งอย่างน้อย 1 ตำแหน่ง');
                return false;
            }

            // ตรวจสอบว่าตำแหน่งที่เลือกมีการกรอกข้อมูลครบหรือไม่
            const hasEmptyFields = selectedAwards.some(award => 
                !award.awardTitle?.trim() || !award.awardDesc?.trim()
            );

            if (hasEmptyFields) {
                toastError('กรุณากรอกข้อมูลให้ครบทุกตำแหน่งที่เลือก');
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };


    const handleUpdateAward = async () => {
        if (!validateForm()) return;

        setLoadingSave(true);
        try {
            const filteredRoleAwards = isAllPosition
                ? listPosition.map(pos => ({
                    roleId: pos.id,
                    roleName: pos.roleName,
                    awardTitle: roleAwards[0].awardTitle.trim(),
                    awardDesc: roleAwards[0].awardDesc.trim(),
                    image: roleAwards[0].image
                }))
                : roleAwards
                    .filter(award => 
                        selectedPositions.has(award.roleId.toString()) &&
                        award.awardTitle?.trim() && 
                        award.awardDesc?.trim()
                    )
                    .map(award => ({
                        ...award,
                        awardTitle: award.awardTitle.trim(),
                        awardDesc: award.awardDesc.trim()
                    }));

            const payload = {
                medalId: selectedMedal,
                depId: selectedDep,
                roleAwardList: filteredRoleAwards,
                year: selectedYear || moment().year(),
                createBy: currentUser.userName
            };

            const response = await fetchProtectedData.post(URLS.award.updateAward, payload);
            if (response.status === 201) {
                toastSuccess('บันทึกข้อมูลสำเร็จ');
                isRefresh();
                handleClose();
            }
        } catch (err) {
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้');
        } finally {
            setLoadingSave(false);
        }
    };

    const handleInputChange = (roleId, field, value) => {
        setRoleAwards(prev => prev.map(award =>
            award.roleId === roleId ? { ...award, [field]: value } : award
        ));
    }

    const handleDeleteAward = async (awardId) => {
        if (!awardId) return;

        setDeletingId(awardId);
        try {
            const response = await fetchProtectedData.delete(URLS.award.deleteAward + '/' + awardId);
            if (response.status === 200) {
                toastSuccess('ลบข้อมูลสำเร็จ');
                isRefresh();
                setRoleAwards(prev => prev.map(award => {
                    if (award.awardId === awardId) {
                        return {
                            ...award,
                            awardId: null,
                            awardTitle: '',
                            awardDesc: '',
                            image: null
                        };
                    }
                    return award;
                }));
            }
        } catch (err) {
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถลบข้อมูลได้');
        } finally {
            setDeletingId(null);
        }
    };

    // เพิ่มฟังก์ชันสำหรับคัดลอกข้อมูล
    const handleCopyAwards = (sourceMedalId) => {
        const sourceAwards = awardData.find(award => award.medalId === sourceMedalId)?.awards || [];
        
        // คัดลอกข้อมูลรางวัลจากเหรียญต้นทาง
        setRoleAwards(prev => prev.map(role => {
            const sourceAward = sourceAwards.find(award => award.roleId === role.roleId);
            return {
                ...role,
                awardTitle: sourceAward?.awardTitle || role.awardTitle,
                awardDesc: sourceAward?.awardDesc || role.awardDesc,
                image: sourceAward?.image || role.image
            };
        }));
        
        setOpenCopyModal(false);
    };

    useEffect(() => {
        if (selectedDep || open) {
            getListPosition(selectedDep);
            isRefresh();
        }
    }, [selectedDep, selectedMedal, open]);

    useEffect(() => {
        if (open) {
            setSelectedDep(selectedDepData);
            setSelectedMedal(medalData?.id);
        }
    }, [open]);

    const handleClose = () => {
        closed(false);
    }

    return (
        <Modal isOpen={open} onClose={handleClose} backdrop="opaque" className="h-[800px] overflow-auto scrollbar-hide" size="4xl">
            <ModalContent>
                <ModalHeader className="text-lg bg-blue-100 text-primary font-bold flex items-center justify-center">
                    <p>ตั้งค่าของรางวัล</p>
                </ModalHeader>
                <ModalBody>
                    <div className="h-full p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-3 w-full text-sm">
                                <div className="flex space-x-3 items-center text-nowrap">
                                    <p>แผนก : </p>
                                    {/* <Select
                                        variant="bordered"
                                        size="sm"
                                        label="แผนก"
                                        labelPlacement="inside"
                                        className="w-52"
                                        aria-label="แผนก"
                                        selectionMode="single"
                                        disallowEmptySelection
                                        isDisabled
                                        defaultSelectedKeys={[selectedDepData?.toString()]}
                                        onChange={e => setSelectedDep(e.target.value)}
                                    >
                                        {listDepData.filter(item => item.isHq === 1).map(item => (
                                            <SelectItem key={item.id.toString()} value={item.id} endContent={item.isHq === 1 && <Chip size="sm" variant="flat" color="success">สำนักงานใหญ่</Chip>}>
                                                {item.departmentName}
                                            </SelectItem>
                                        ))}
                                    </Select> */}
                                    <Chip size="md" variant="dot" color="primary">{listDepData.find(item => item.id == selectedDepData)?.departmentName}</Chip>
                                </div>
                                <div className="flex space-x-3 items-center">
                                    <p>เหรียญ :</p>
                                    {/* <Select
                                        variant="bordered"
                                        size="sm"
                                        label="เหรียญ"
                                        labelPlacement="inside"
                                        className="w-52"
                                        aria-label="เหรียญ"
                                        disallowEmptySelection
                                        isDisabled
                                        value={selectedMedal}
                                        onChange={e => setSelectedMedal(e.target.value)}
                                        defaultSelectedKeys={[medalData?.id?.toString()]}
                                    >
                                        {listMedalData.map(item => (
                                            <SelectItem key={item.id.toString()} value={item.id}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </Select> */}


                                    <Chip size="md" variant="dot" color="success">{medalData?.name}</Chip>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 text-nowrap">
                                <Button
                                    size="sm"
                                    variant="light"
                                    color="primary"
                                    startContent={<CopyIcon />}
                                    onPress={() => setOpenCopyModal(true)}
                                >
                                    คัดลอกจากเหรียญอื่น
                                </Button>
                                <Checkbox
                                    size="lg"
                                    color="primary"
                                    isSelected={isAllPosition}
                                    onValueChange={setIsAllPosition}
                                >
                                    ตั้งค่าให้กับทุกตำแหน่ง
                                </Checkbox>
                            </div>
                        </div>

                        <div>
                            {isAllPosition ?
                                <>
                                    <p>ตั้งค่าให้กับทุกตำแหน่ง</p>
                                </>
                                :
                                <>
                                    <p>ตั้งค่าให้กับตำแหน่งที่เลือก</p>
                                </>
                            }
                        </div>

                        {loadingPosition ? (
                            <div className="flex justify-center items-center p-8">
                                <Spinner size="lg" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {isAllPosition ? (
                                    // กรณีตั้งค่าทุกตำแหน่ง
                                    <div className="space-y-4 p-4 border rounded-lg">
                                        <div className="font-semibold mb-2">ตั้งค่าสำหรับทุกตำแหน่ง ({listPosition.length} ตำแหน่ง)</div>
                                        <Input
                                            label="หัวข้อของรางวัล"
                                            placeholder="กรอกหัวข้อของรางวัล"
                                            value={roleAwards[0]?.awardTitle || ''}
                                            onChange={(e) => handleInputChange(roleAwards[0]?.roleId, 'awardTitle', e.target.value)}
                                            variant="bordered"
                                            isInvalid={errors.title.state}
                                            errorMessage={errors.title.message}
                                            onFocus={() => setErrors(prev => ({ ...prev, title: { state: false, message: '' } }))}
                                        />
                                        <Textarea
                                            label="รายละเอียดของรางวัล"
                                            placeholder="กรอกรายละเอียดของรางวัล"
                                            value={roleAwards[0]?.awardDesc || ''}
                                            onChange={(e) => handleInputChange(roleAwards[0]?.roleId, 'awardDesc', e.target.value)}
                                            variant="bordered"
                                            minRows={4}
                                            isInvalid={errors.desc.state}
                                            errorMessage={errors.desc.message}
                                            onFocus={() => setErrors(prev => ({ ...prev, desc: { state: false, message: '' } }))}
                                        />
                                    </div>
                                ) : (
                                    // กรณีตั้งค่าแยกตำแหน่ง
                                    <div className="space-y-6 max-h-[500px] overflow-auto scrollbar-hide">
                                        {/* ส่วนเลือกตำแหน่ง */}
                                        <div className="p-4 max-w-xs">
                                            <Select
                                                label="เลือกตำแหน่ง"
                                                placeholder="เลือกตำแหน่งที่ต้องการเพิ่มข้อมูล"
                                                selectionMode="multiple"
                                                variant="bordered"
                                                disallowEmptySelection
                                                selectedKeys={selectedPositions}
                                                onSelectionChange={setSelectedPositions}
                                                className="w-full"
                                            >
                                                {listPosition.map((pos) => (
                                                    <SelectItem
                                                        key={pos.id}
                                                        value={pos.id}
                                                        textValue={pos.roleName}
                                                    >
                                                        {pos.roleName}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        </div>

                                        {roleAwards
                                            .sort((a, b) => b.roleLevel - a.roleLevel)
                                            .filter(award => selectedPositions.has(award.roleId.toString()))
                                            .map((award) => {

                                                return (
                                                    <div key={award.roleId} className="p-4 border rounded-lg space-y-4">
                                                        <div className="flex justify-between items-center">
                                                            <div className="font-semibold">ตำแหน่ง: {award.roleName}</div>
                                                            {award.awardId && (
                                                                <Button
                                                                    isIconOnly
                                                                    color="danger"
                                                                    variant="flat"
                                                                    size="sm"
                                                                    isLoading={deletingId === award.awardId}
                                                                    onPress={() => handleDeleteAward(award.awardId)}
                                                                >
                                                                    <DeleteIcon className="text-2xl" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                        <Input
                                                            label="หัวข้อของรางวัล"
                                                            placeholder="กรอกหัวข้อของรางวัล"
                                                            value={award.awardTitle}
                                                            onChange={(e) => handleInputChange(award.roleId, 'awardTitle', e.target.value)}
                                                            variant="bordered"
                                                        />
                                                        <Textarea
                                                            label="รายละเอียดของรางวัล"
                                                            placeholder="กรอกรายละเอียดของรางวัล"
                                                            value={award.awardDesc}
                                                            onChange={(e) => handleInputChange(award.roleId, 'awardDesc', e.target.value)}
                                                            variant="bordered"
                                                            minRows={4}
                                                        />
                                                    </div>
                                                )
                                            })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <ConfirmCancelButtons
                        onCancel={handleClose}
                        onConfirm={handleUpdateAward}
                        isLoading={loadingSave}
                        isDisabledCancel={loadingSave}
                        confirmText="บันทึกข้อมูล"
                    />
                </ModalFooter>
            </ModalContent>

            {/* เพิ่ม Modal สำหรับเลือกเหรียญที่จะคัดลอก */}
            <Modal 
                isOpen={openCopyModal} 
                onClose={() => setOpenCopyModal(false)}
                size="sm"
            >
                <ModalContent>
                    <ModalHeader className="flex text-lg font-bold text-primary justify-center items-center bg-blue-100">
                        คัดลอกข้อมูลจากเหรียญ
                    </ModalHeader>
                    <ModalBody>
                        <div className="space-y-4 p-4">
                            <p className="text-sm text-gray-600">เลือกเหรียญที่ต้องการคัดลอกข้อมูล</p>
                            <Select
                                label="เหรียญต้นทาง"
                                variant="bordered"
                                className="w-full"
                            >
                                {listMedalData
                                    .filter(medal => medal.id !== medalData?.id) // กรองเหรียญปัจจุบันออก
                                    .map(medal => (
                                        <SelectItem 
                                            key={medal.id} 
                                            value={medal.id}
                                            onPress={() => handleCopyAwards(medal.id)}
                                        >
                                            {medal.name}
                                        </SelectItem>
                                    ))
                                }
                            </Select>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button 
                            color="danger" 
                            variant="light" 
                            onPress={() => setOpenCopyModal(false)}
                        >
                            ยกเลิก
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Modal>
    )
}

export default ModalSettingAwards;