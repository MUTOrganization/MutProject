import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
function DelAgentModal({ isOpen, onClose, selectedAgent }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>
                    <p className="text-2xl font-semibold text-gray-800">ลบตัวแทน</p>
                </ModalHeader>
                <ModalBody>
                    <p className="text-gray-800">คุณแน่ใจที่จะลบตัวแทนนี้หรือไม่?</p>
                    <p className="text-gray-800">{selectedAgent.name}</p>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}



export default DelAgentModal;