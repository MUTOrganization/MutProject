import { toastError, toastSuccess } from "@/component/Alert";
import { deleteGroupAccess } from "@/services/accessService";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

function DelGroupModal({ isOpen, onClose, groupItem, isFetchGroup }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteGroup = async () => {
        setIsLoading(true);
        await deleteGroupAccess({ groupId: groupItem.accessGroupId })
            .then(() => {
                toastSuccess("ลบหมวดหมู่สิทธิ์สำเร็จ");
                isFetchGroup();
                handleClose();
            })
            .catch((err) => {
                console.log(err)
                toastError("เกิดข้อผิดพลาด", "ไม่สามารถลบหมวดหมู่สิทธิ์ได้ กรุณาลองใหม่อีกครั้ง");
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    const handleClose = () => {
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} backdrop="blur" isDismissable={false}>
            <ModalContent>
                <ModalHeader className="flex items-center justify-start gap-3 border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">ลบหมวดหมู่สิทธิ์</h2>
                    <span className="text-sm text-gray-500 font-medium">{groupItem.groupName || ''}</span>
                </ModalHeader>
                <ModalBody className="py-6">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                            <Trash2Icon className="w-8 h-8 text-red-500" />
                        </div>
                        <p className="text-red-600 font-medium text-center">คุณต้องการลบหมวดหมู่สิทธิ์นี้หรือไม่?<br />การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
                        <p className="text-red-500 font-bold text-2xl text-center">{groupItem.groupName}</p>
                    </div>
                </ModalBody>
                <ModalFooter className="border-t pt-4">
                    <Button
                        variant="light"
                        color="default"
                        isDisabled={isLoading}
                        onPress={onClose}
                        className="font-medium"
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        variant="solid"
                        color="danger"
                        onPress={handleDeleteGroup}
                        isLoading={isLoading}
                        className="font-medium shadow-sm hover:shadow-md transition-shadow"
                    >
                        ลบหมวดหมู่
                    </Button>
                </ModalFooter>
            </ModalContent>

        </Modal>
    )
}


export default DelGroupModal;