import { toastError, toastSuccess } from "@/component/Alert";
import { createGroupAccess } from "@/services/accessService";
import { Alert, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, Tooltip } from "@heroui/react";
import { MessageCircleQuestion } from "lucide-react";
import { useState } from "react";

function AddGroupModal({ isOpen, onClose, isFetchGroup }) {

    const [groupName, setGroupName] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);



    async function validate() {
        if (!groupName.trim() || !description.trim()) {
            const text = "กรุณากรอกชื่อหมวดหมู่สิทธิ์และคำอธิบาย";
            toastError(text);
            setError(text);
            return false;
        }
        return true;
    }

    const handleCreateGroup = async () => {
        const isValid = await validate();
        if (!isValid) return;

        setIsLoading(true);
        await createGroupAccess({ groupName, description })
            .then((data) => {
                toastSuccess("สร้างหมวดหมู่สิทธิ์สำเร็จ");
                isFetchGroup();
                handleClose();
            })
            .catch((err) => {
                if(err.response.status === 400){
                    setError('หมวดหมู่สิทธิ์นี้มีอยู่ในระบบแล้ว');
                    toastError('หมวดหมู่สิทธิ์นี้มีอยู่ในระบบแล้ว');
                }else{
                    toastError('เกิดข้อผิดพลาด', 'ไม่สามารถเพิ่มหมวดหมู่สิทธิ์ได้ กรุณาลองใหม่อีกครั้ง');
                }
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    const handleClose = () => {
        setGroupName("");
        setDescription("");
        setError(null);
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} backdrop="blur" isDismissable={false}>
            <ModalContent>
                <ModalHeader className="flex items-center justify-start gap-3">
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">เพิ่มหมวดหมู่สิทธิ์</h2>
                    <Tooltip content="ตัวอย่าง : หมวดหมู่ทั่วไป" placement="bottom-start" color="success" className="text-white">
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
                            label="ชื่อหมวดหมู่สิทธิ์"
                            placeholder="กรุณากรอกชื่อหมวดหมู่สิทธิ์"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                    </div>

                    <div>
                        <Textarea
                            variant="bordered"
                            color="primary"
                            label="คำอธิบายหมวดหมู่สิทธิ์"
                            placeholder="กรุณากรอกคำอธิบายหมวดหมู่สิทธิ์"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                </ModalBody>
                <ModalFooter>
                    <Button variant="light" color="danger" isDisabled={isLoading} onPress={onClose}>ยกเลิก</Button>
                    <Button variant="solid" color="primary" onPress={handleCreateGroup} isLoading={isLoading}>สร้างหมวดหมู่</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddGroupModal;