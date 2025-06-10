import agentService from "@/services/agentService";
import { Modal, ModalBody, ModalContent, ModalHeader, Input, Button, ModalFooter, Tooltip, Alert } from "@heroui/react";
import { useState } from "react";
import { PlusIcon } from "@/component/Icons";
import { MessageCircleQuestion } from "lucide-react";
import { toastError, toastSuccess, toastWarning } from "@/component/Alert";

function AddAgentModal({ isOpen, onClose, fetchAgentList }) {
    const [code, setCode] = useState('')
    const [name, setName] = useState('')
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

    //* เพิ่มตัวแทน
    const handleSubmit = async () => {
        setIsLoading(true)

        if (!validate()) {
            setError('กรุณากรอกข้อมูลให้ครบหรือกรอกให้ถูกต้อง')
            setIsLoading(false)
            toastWarning('ไม่สามารถเพิ่มตัวแทนได้', 'กรุณากรอกข้อมูลให้ครบหรือกรอกให้ถูกต้อง')
            return
        }


        await agentService.addAgent(name, code).then((res) => {
            toastSuccess('เพิ่มตัวแทนสำเร็จ')
            onClose()
            fetchAgentList()
        }).catch((err) => {
            console.log(err.response.data.error)
            if (err.status === 400) {
                const e = err.response.data.error;
                setError('รหัสตัวแทนหรือชื่อตัวแทนนี้มีอยู่ในระบบแล้ว', e)
                toastWarning('ไม่สามารถเพิ่มตัวแทนได้', e)
            } else {
                toastError('ไม่สามารถเพิ่มตัวแทนได้', 'เนื่องจากมีข้อผิดพลาดทางระบบ')
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
                        <p className="text-2xl font-semibold">เพิ่มตัวแทน</p>
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
                                className="text-white"
                                description={error}
                            />
                        )}


                        <Input
                            label="รหัสตัวแทน"
                            value={code}
                            description={code}
                            onChange={(e) => setCode(e.target.value.trim().toUpperCase())}
                            variant="bordered"
                            labelPlacement="outside"
                            placeholder="กรุณากรอกรหัสตัวแทน"
                            onFocus={() => setError('')}
                            isRequired
                            classNames={{
                                label: "text-gray-700 font-medium",
                                input: "text-gray-800",
                                inputWrapper: "hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary"
                            }}
                        />
                        <Input
                            label="ชื่อตัวแทน"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            variant="bordered"
                            labelPlacement="outside"
                            placeholder="กรุณากรอกชื่อตัวแทน"
                            onFocus={() => setError('')}
                            isRequired
                            classNames={{
                                label: "text-gray-700 font-medium",
                                input: "text-gray-800",
                                inputWrapper: "hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary"
                            }}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="flex justify-end gap-2">
                        <Button
                            color="danger"
                            variant="light"
                            onPress={onClose}
                            isDisabled={isLoading}
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            color="primary"
                            variant="solid"
                            onPress={handleSubmit}
                            isLoading={isLoading}
                        >
                            เพิ่มตัวแทน
                        </Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddAgentModal;