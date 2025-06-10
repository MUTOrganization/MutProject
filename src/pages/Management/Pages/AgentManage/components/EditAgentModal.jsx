import { Modal, ModalBody, ModalContent, ModalHeader, Input, Button, ModalFooter, Tooltip, Alert } from "@heroui/react";
import { useState } from "react";
import agentService from "@/services/agentService";
import { toastSuccess, toastError, toastWarning } from "@/component/Alert";
import { MessageCircleQuestion } from "lucide-react";

function EditAgentModal({ isOpen, onClose, selectedAgent, fetchAgentList }) {
    const [name, setName] = useState(selectedAgent?.name || '')
    const [code, setCode] = useState(selectedAgent?.code || '')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    //* ตรวจสอบข้อมูล
    const validate = () => {
        const c = code.trim()
        const n = name.trim()
        if (c === '' || n === '') {
            return false
        }
        return true
    }

    const handleEditAgent = async () => {
        setIsLoading(true)

        if (!validate()) {
            setError('กรุณากรอกข้อมูลให้ครบหรือกรอกให้ถูกต้อง')
            setIsLoading(false)
            toastWarning('ไม่สามารถแก้ไขตัวแทนได้', 'กรุณากรอกข้อมูลให้ครบหรือกรอกให้ถูกต้อง')
            return
        }

        await agentService.editAgent(name, code, selectedAgent.agentId).then((res) => {
            toastSuccess('บันทึกข้อมูลการแก้ไขตัวแทนสำเร็จ')
            fetchAgentList()
            onClose()
        }).catch((err) => {
            if (err.status === 400) {
                const e = err.response.data.error;
                setError(e)
                toastWarning('ไม่สามารถแก้ไขตัวแทนได้', e)
            } else {
                toastError('ไม่สามารถแก้ไขข้อมูลตัวแทนได้', 'เนื่องจากมีข้อผิดพลาดทางระบบ')
            }
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
                        <p className="text-2xl font-semibold">แก้ไขตัวแทน</p>
                        <Tooltip
                            content={
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm">รหัสตัวแทน ตัวอย่าง : HF001</p>
                                    <p className="text-sm">ชื่อตัวแทน ตัวอย่าง : Hopeful Wellness</p>
                                </div>
                            }
                            placement="bottom-start"
                            color="success"
                            className="text-white"
                        >
                            <MessageCircleQuestion className="w-5 h-5 text-primary" />
                        </Tooltip>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className="flex flex-col gap-4">
                        {error && (
                            <Alert
                                variant="solid"
                                color="warning"
                                className="text-sm text-white"
                            >
                                {error}
                            </Alert>
                        )}
                        <Input
                            label="รหัสตัวแทน"
                            placeholder="กรอกรหัสตัวแทน"
                            value={code}
                            labelPlacement="outside"
                            description={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            variant="bordered"
                            onFocus={() => setError('')}
                        />
                        <Input
                            label="ชื่อตัวแทน"
                            placeholder="กรอกชื่อตัวแทน"
                            value={name}
                            labelPlacement="outside"
                            onChange={(e) => setName(e.target.value)}
                            variant="bordered"
                            onFocus={() => setError('')}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="flex gap-2">
                        <Button
                            color="danger"
                            variant="light"
                            onPress={onClose}
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            color="primary"
                            onPress={handleEditAgent}
                            isLoading={isLoading}
                        >
                            บันทึก
                        </Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EditAgentModal;