import { Button } from "@heroui/react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { Trash2Icon } from "lucide-react";

export default function ConfirmDeleteGroupModal({ isOpen, onClose, currentChatRoom, isLoading, onDelete }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
            <ModalHeader className="flex items-center justify-start gap-3 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">ลบกลุ่ม</h2>
                    <p className="text-sm text-gray-500">{currentChatRoom?.name}</p>
                </ModalHeader>
                <ModalBody className="flex flex-col justify-center items-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                            <Trash2Icon className="w-8 h-8 text-red-500" />
                        </div>
                        <p className="text-red-600 font-medium text-center">คุณต้องการลบกลุ่มนี้หรือไม่?<br />การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
                        <p className="text-red-500 font-bold text-2xl text-center">{currentChatRoom?.name}</p>
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
                        onPress={onDelete}
                        isLoading={isLoading}
                        className="font-medium shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        ลบกลุ่ม
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}