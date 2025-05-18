import { toastError, toastSuccess } from "@/component/Alert";
import { createAccess } from "@/services/accessService";
import { Alert, Button, Chip, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, Tooltip } from "@heroui/react";
import { InfoIcon, MessageCircleQuestion } from "lucide-react";
import { useState } from "react";

function AddAccessModal({ isOpen, onClose, groupSelected, isFetchAccess }) {
    const [accessName, setAccessName] = useState("");
    const [accessCode, setAccessCode] = useState("");
    const [description, setDescription] = useState("");
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

    const handleCreateAccess = async () => {
        const isValid = await validate();
        if (!isValid) return;

        setIsLoading(true);
        const fullAccessName = `${groupSelected.groupName}_${accessName}`;

        await createAccess({
            accessName: fullAccessName,
            accessCode,
            description,
            accessGroupId: groupSelected.accessGroupId
        })
            .then(() => {
                toastSuccess("สร้างสิทธิ์สำเร็จ");
                isFetchAccess();
                handleClose();
            })
            .catch((err) => {
                console.log(err);
                if(err.response.status === 400){
                    setError('รหัสสิทธิ์นี้มีอยู่ในระบบแล้ว');
                    toastError('รหัสสิทธิ์นี้มีอยู่ในระบบแล้ว');
                }else{
                    toastError('เกิดข้อผิดพลาด', 'ไม่สามารถเพิ่มสิทธิ์ได้ กรุณาลองใหม่อีกครั้ง');
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
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">เพิ่มสิทธิ์</h2>
                    <Tooltip
                        content={
                            <div className="flex flex-col gap-3 p-2">
                                <div className="flex items-center gap-2">
                                    <InfoIcon className="w-4 h-4 text-primary" />
                                    <p className="text-sm font-medium text-gray-700">คำแนะนำในการกรอกรหัสสิทธิ์</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                                    <p className="text-sm text-gray-600">กรอกรหัสสิทธิ์เป็นตัวพิมพ์เล็กทั้งหมดและสอดคล้องกับชื่อสิทธิ์</p>
                                    <div className="space-y-2">
                                        <p className="text-xs font-medium text-gray-500">ตัวอย่าง:</p>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-gray-500">ชื่อสิทธิ์:</span>
                                                <span className="text-white bg-primary px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm">
                                                    general_sale
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-gray-500">รหัสสิทธิ์:</span>
                                                <Chip
                                                    color="primary"
                                                    variant="solid"
                                                    className="text-white text-sm font-medium shadow-sm"
                                                >
                                                    sale
                                                </Chip>
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
                            labelPlacement="outside"
                            placeholder="กรุณากรอกชื่อสิทธิ์"
                            startContent={
                                <div className="flex items-center">
                                    <span className="text-primary text-nowrap text-xs font-medium ">
                                        {groupSelected.groupName}_
                                    </span>
                                </div>
                            }
                            value={accessName}
                            onChange={(e) => setAccessName(e.target.value)}
                            description={`ชื่อเต็ม: ${groupSelected.groupName}_${accessName}`}
                        />
                    </div>

                    <div>
                        <Input
                            variant="bordered"
                            color="primary"
                            label="รหัสสิทธิ์"
                            labelPlacement="outside"
                            placeholder="กรุณากรอกรหัสสิทธิ์"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                        />
                    </div>

                    <div>
                        <Textarea
                            variant="bordered"
                            color="primary"
                            label="คำอธิบาย"
                            labelPlacement="outside"
                            placeholder="กรุณากรอกคำอธิบาย"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" color="danger" isDisabled={isLoading} onPress={handleClose}>ยกเลิก</Button>
                    <Button variant="solid" color="primary" onPress={handleCreateAccess} isLoading={isLoading}>สร้างสิทธิ์</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddAccessModal;