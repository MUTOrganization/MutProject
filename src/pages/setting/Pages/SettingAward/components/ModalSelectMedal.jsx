import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";


export function ModalSelectMedal({ isOpen, isClosed }) {
    return (
        <Modal isOpen={isOpen} onClose={() => isClosed(false)} backdrop="opaque" size="sm">
            <ModalContent>
                <ModalHeader className="bg-blue-100 text-primary text-xl font-bold">
                    <h1>ข้อมูลเหรียญรางวัล</h1>
                </ModalHeader>
                <ModalBody>

                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export function ModalViewImage({ isOpen, isClosed }) {
    return (
        <Modal isOpen={isOpen} onClose={() => isClosed(false)} backdrop="opaque" size="sm">
            <ModalContent>
                <ModalHeader className="bg-blue-100 text-primary text-xl font-bold">
                    <h1>ข้อมูลเหรียญรางวัล</h1>
                </ModalHeader>
                <ModalBody>

                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}