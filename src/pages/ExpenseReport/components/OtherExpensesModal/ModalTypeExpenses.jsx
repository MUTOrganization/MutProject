import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal"
import { Button, Input, Spinner } from "@heroui/react"
import React, { useState } from 'react'
import { toast } from 'sonner'
import expensesService from '@/services/expensesService'
import { toastError, toastSuccess, toastWarning } from "@/component/Alert"

function ModalTypeExpenses({ isOpen, onClose, currentUser, typeData, getTypeData, isSuperAdmin, selectAgent }) {

    const [newTypeName, setNewTypeName] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleValidate = () => {
        const newValue = newTypeName.trim()

        if (typeData.some(e => e.typeName.trim().toLowerCase() === newValue.toLowerCase())) {
            toastWarning('คำเตือน', 'ประเภทนี้มีอยู่ในระบบแล้ว')
            return true;
        }
        if (!newValue) {
            toastWarning('คำเตือน', 'กรุณากรอกชื่อประเภท')
            return true;
        }
        return false;
    }

    const InsertData = async () => {
        if (handleValidate()) {
            return;
        } else {
            setIsLoading(true)
            try {
                await expensesService.addExpensesType('insert', isSuperAdmin ? Number(selectAgent) : currentUser.agent.agentId, newTypeName)
                await getTypeData()
                onClose()
                setIsLoading(false)
                toastSuccess('สำเร็จ', 'เพิ่มประเภทค่าใช้จ่ายเรียบร้อย')
                onClose()
            } catch (error) {
                console.log('Something Wrong', error)
                toastError('ผิดพลาด', 'เพิ่มประเภทค่าใช้จ่ายไม่สำเร็จ')
            }
        }

    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} className="overflow-hidden">
            <ModalContent>
                <ModalHeader>เพิ่มประเภทค่าใช้จ่าย</ModalHeader>
                <ModalBody>
                    <Input type="text" placeholder='ประเภท'
                        onKeyDown={(e) => {
                            if (e.key === ' ') {
                                e.preventDefault();
                            }
                        }} onChange={(e) => setNewTypeName(e.target.value)} size='md' />
                </ModalBody>
                <ModalFooter>
                    <Button size='sm' color="danger" variant="light" onPress={onClose}>
                        Close
                    </Button>
                    <Button size='sm' color="primary" onPress={InsertData}>
                        {isLoading && <Spinner color="white" size="sm" />}
                        เพิ่ม
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ModalTypeExpenses
