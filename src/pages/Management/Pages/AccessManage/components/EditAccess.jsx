import { toastError, toastSuccess } from "@/component/Alert";
import { updateAccess } from "@/services/accessService";
import { Alert, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, Tooltip } from "@heroui/react";
import { InfoIcon, MessageCircleQuestion } from "lucide-react";
import { useState } from "react";

function EditAccess({ isOpen, onClose, accessItem, isFetchAccess, groupSelected }) {
    const [accessName, setAccessName] = useState(accessItem?.accessName || '');
    const [accessCode, setAccessCode] = useState(accessItem?.accessCode?.replace(`${groupSelected.groupName}_`, "") || "");
    const [description, setDescription] = useState(accessItem?.description || "");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    async function validate() {
        if (!accessName.trim() || !accessCode.trim() || !description.trim()) {
            const text = "กรุณากรอกข้อมูลให้ครบถ้วน";
            toastError(text);
            setError(text);
            return false;
        }
        return true;
    }

    const handleUpdateAccess = async () => {
        const isValid = await validate();
        if (!isValid) return;

        setIsLoading(true);
        const fullAccessCode = `${groupSelected.groupName}_${accessCode}`;

        const payload = {
            accessId: accessItem.accessId,
            accessName: accessName,
            accessCode: fullAccessCode,
            description: description,
            accessGroupId: groupSelected.accessGroupId
        }

        await updateAccess(payload)
            .then(() => {
                toastSuccess("แก้ไขสิทธิ์สำเร็จ");
                isFetchAccess();
                handleClose();
            })
            .catch((err) => {
                if (err.response.status === 400) {
                    const e = err.response.data.error;
                    setError(e);
                    toastError(e);
                } else {
                    toastError('เกิดข้อผิดพลาด', 'ไม่สามารถแก้ไขสิทธิ์ได้ กรุณาลองใหม่อีกครั้ง');
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const handleClose = () => {
        setAccessName("");
        setAccessCode("");
        setDescription("");
        setError(null);
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} backdrop="blur" isDismissable={false}>
            <ModalContent>
                <ModalHeader className="flex items-center justify-start gap-3">
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">แก้ไขสิทธิ์</h2>
                    <Tooltip
                        content={
                            <div className="flex flex-col gap-3 p-2">
                                <div className="flex items-center gap-2">
                                    <InfoIcon className="w-4 h-4 text-primary" />
                                    <p className="text-sm font-medium text-gray-700">คำแนะนำในการกรอกรหัสสิทธิ์</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                                    <p className="text-sm text-gray-600 text-wrap w-[300px]">กรอกชื่อสิทธิ์เป็นตัวพิมพ์ใหญ๋ทั้งหมดและรหัสสิทธิ์จะถูกขึ้นต้นด้วยชื่อกลุ่มสิทธิ์ตามด้วยรหัสสิทธิ์ที่กรอกเข้าไป</p>
                                    <div className="space-y-2">
                                        <p className="text-xs font-medium text-gray-500">ตัวอย่าง:</p>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-gray-500">ชื่อสิทธิ์:</span>
                                                <span className="text-white bg-primary px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm">
                                                    GENERAL SALE
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-gray-500">รหัสสิทธิ์:</span>
                                                <span className="text-white bg-primary px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm">
                                                    General_sale
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        placement="bottom-start"
                        color="default"
                        classNames={{
                            content: "py-2 px-3 shadow-xl border border-gray-200"
                        }}
                    >
                        <MessageCircleQuestion className="w-5 h-5 text-primary" />
                    </Tooltip>
                </ModalHeader>
                <ModalBody className="flex flex-col gap-4">
                    {error && (
                        <Alert
                            variant="solid"
                            color="danger"
                            description={error}
                        />
                    )}

                    <div>
                        <Input
                            variant="bordered"
                            color="primary"
                            label="ชื่อสิทธิ์"
                            aria-label="ชื่อสิทธิ์"
                            labelPlacement="outside"
                            placeholder="กรุณากรอกชื่อสิทธิ์"
                            value={accessName}
                            onChange={(e) => setAccessName(e.target.value)}
                        />
                    </div>

                    <div>
                        <Input
                            variant="bordered"
                            color="primary"
                            label="รหัสสิทธิ์"
                            aria-label="รหัสสิทธิ์"
                            labelPlacement="outside"
                            placeholder="กรุณากรอกรหัสสิทธิ์"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            startContent={
                                <div className="flex items-center">
                                    <span className="text-primary text-nowrap text-xs font-medium ">
                                        {groupSelected.groupName}_
                                    </span>
                                </div>
                            }
                            description={`ชื่อเต็ม: ${groupSelected.groupName}_${accessCode}`}
                        />
                    </div>

                    <div>
                        <Textarea
                            variant="bordered"
                            color="primary"
                            label="คำอธิบาย"
                            aria-label="คำอธิบาย"
                            labelPlacement="outside"
                            placeholder="กรุณากรอกคำอธิบาย"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" color="danger" isDisabled={isLoading} onPress={handleClose}>ยกเลิก</Button>
                    <Button variant="solid" color="primary" onPress={handleUpdateAccess} isLoading={isLoading}>บันทึก</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EditAccess;