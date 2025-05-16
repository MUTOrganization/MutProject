import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal'
import { Button, Input } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import fetchProtectedData from '../../../../../utils/fetchData'
import { URLS } from '../../../../config'
import { toast } from 'sonner'
import expensesService from '@/services/expensesService'

function ModalTypeExpenses({ isOpen, onClose, selectedAgent, currentUser, setTypeData, setTypeName, typeName, setIsManageType }) {

    const InsertData = async () => {
        try {
            await expensesService.addExpensesType('insert', currentUser.agent.id, typeName)
            toast.success('เพิ่มข้อมูลสำเร็จ', { position: 'top-right' })
            setIsManageType(true)
        } catch (error) {
            console.log('Something Wrong', error)
        }
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader>เพิ่มประเภทค่าใช้จ่าย</ModalHeader>
                <ModalBody>
                    <Input type="text" placeholder='ประเภท' onChange={(e) => setTypeName(e.target.value)} size='md' />
                </ModalBody>
                <ModalFooter>
                    <Button size='sm' color="danger" variant="light" onPress={onClose}>
                        Close
                    </Button>
                    <Button size='sm' color="primary" onPress={() => { onClose(); InsertData(); }}>
                        เพิ่ม
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ModalTypeExpenses
