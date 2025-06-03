import { Button } from "@heroui/react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";

export default function AlertDeleteChatRoom({ isOpen, onClose, currentChatRoom }){
    return(
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>แชทถูกลบ</ModalHeader>
                <ModalBody>
                    <p>กลุ่มแชทนี้ถูกลบโดยผู้ดูแลกลุ่มแล้ว</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onPress={onClose}>ปิด</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}