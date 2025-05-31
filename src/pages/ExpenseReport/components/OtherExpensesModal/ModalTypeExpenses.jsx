import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal"
import { Button, Input } from "@heroui/react"
import React, { useState } from 'react'
import { toast } from 'sonner'
import expensesService from '@/services/expensesService'

function ModalTypeExpenses({ isOpen, onClose, currentUser, typeData, getTypeData, isSuperAdmin, selectAgent }) {

    const [newTypeName, setNewTypeName] = useState('')

    const InsertData = async () => {
        if (typeData.find(e => e.typeName === newTypeName)) {
            toast.error('ประเภทนี้มีอยู่ในระบบแล้ว')
            return;
        } else {
            try {
                await expensesService.addExpensesType('insert', isSuperAdmin ? Number(selectAgent) : currentUser.agent.agentId, newTypeName)
                await getTypeData()
                toast.success('เพิ่มข้อมูลสำเร็จ', { position: 'top-right' })
                onClose()
            } catch (error) {
                console.log('Something Wrong', error)
            }
        }

    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} className="overflow-hidden">
            <ModalContent>
                <ModalHeader>เพิ่มประเภทค่าใช้จ่าย</ModalHeader>
                <ModalBody>
                    <Input type="text" placeholder='ประเภท' onChange={(e) => setNewTypeName(e.target.value)} size='md' />
                </ModalBody>
                <ModalFooter>
                    <Button size='sm' color="danger" variant="light" onPress={onClose}>
                        Close
                    </Button>
                    <Button size='sm' color="primary" onPress={() => { InsertData(); }}>
                        เพิ่ม
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ModalTypeExpenses
