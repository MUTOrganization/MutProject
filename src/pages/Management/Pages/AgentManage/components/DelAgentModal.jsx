import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Alert } from "@heroui/react";
import { toastError, toastSuccess } from "@/component/Alert";
import agentService from "@/services/agentService";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

function DelAgentModal({ isOpen, onClose, selectedAgent, fetchAgentList }) {
    const [isLoading, setIsLoading] = useState(false)

    //* ลบตัวแทน
    const handleDelete = () => {
        setIsLoading(true)
        agentService.deleteAgent(selectedAgent.agentId).then((res) => {
            toastSuccess('ลบตัวแทนสำเร็จ')
            fetchAgentList()
            onClose()
        }).catch((err) => {
            toastError('ไม่สามารถลบตัวแทนได้', 'เนื่องจากมีข้อผิดพลาดทางระบบ')
            console.log(err)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose}
            backdrop="blur"
            size="md"
            isDismissable={false}
            classNames={{
                base: "bg-white rounded-lg shadow-lg",
                header: "border-b border-gray-200",
                body: "py-6",
                closeButton: "hidden",
                footer: "border-t border-gray-200"
            }}
        >
            <ModalContent>
                <ModalHeader>
                    <div className="flex items-center gap-2">
                        <p className="text-2xl font-semibold text-gray-800">ลบตัวแทน</p>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className="flex flex-col gap-4">
                        <Alert
                            variant="bordered"
                            color="danger"
                            description="การลบตัวแทนจะไม่สามารถกู้คืนได้"
                        />
                        
                        <div className="flex flex-col gap-2">
                            <p className="text-gray-800 font-medium">คุณแน่ใจที่จะลบตัวแทนนี้หรือไม่?</p>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-gray-800 font-semibold">{selectedAgent.name}</p>
                                <p className="text-gray-600 text-sm">{selectedAgent.code}</p>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="flex justify-end gap-2">
                        <Button
                            color="default"
                            variant="light"
                            onPress={onClose}
                            isDisabled={isLoading}
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            color="danger"
                            variant="solid"
                            onPress={handleDelete}
                            isLoading={isLoading}
                        >
                            ลบตัวแทน
                        </Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default DelAgentModal;