import { toastError, toastSuccess } from "@/component/Alert";
import { deleteAccess } from "@/services/accessService";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { Trash, Trash2Icon } from "lucide-react";
import { useState } from "react";

function DelAccess({ isOpen, onClose, accessItem, isFetchAccess }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteAccess = async () => {
        setIsLoading(true);
        await deleteAccess({ accessId: accessItem.accessId })
            .then(() => {
                toastSuccess("ลบสิทธิ์สำเร็จ");
                isFetchAccess();
                onClose();
            })
            .catch((err) => {
                console.log(err);
                toastError("เกิดข้อผิดพลาด", "ไม่สามารถลบสิทธิ์ได้");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }


    return (
        <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" isDismissable={false}>
            <ModalContent>
                <ModalHeader className="flex items-center justify-start gap-3 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">ลบสิทธิ์</h2>
                    <p className="text-sm text-gray-500">{accessItem.accessName} ({accessItem.accessCode})</p>
                </ModalHeader>
                <ModalBody className="flex flex-col justify-center items-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                            <Trash2Icon className="w-8 h-8 text-red-500" />
                        </div>
                        <p className="text-red-600 font-medium text-center">คุณต้องการลบสิทธิ์นี้หรือไม่?<br />การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
                        <p className="text-red-500 font-bold text-2xl text-center">{accessItem.accessName}</p>
                    </div>
                </ModalBody>
                <ModalFooter className="border-t border-gray-200">
                    <Button
                        variant="light"
                        color="danger"
                        onPress={onClose}
                        isDisabled={isLoading}
                        className="font-medium hover:bg-danger-50"
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        variant="solid"
                        color="danger"
                        onPress={handleDeleteAccess}
                        isLoading={isLoading}
                        className="font-medium shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        ลบสิทธิ์
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default DelAccess;