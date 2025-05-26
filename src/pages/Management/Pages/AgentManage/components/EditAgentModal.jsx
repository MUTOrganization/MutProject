import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
function EditAgentModal({ isOpen, onClose, selectedAgent }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>
                    <p className="text-2xl font-semibold text-gray-800">แก้ไขตัวแทน</p>
                </ModalHeader>
                <ModalBody>
                    <p>{selectedAgent.name}</p>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}


export default EditAgentModal;