import { Input } from "@heroui/input"
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal"
import { Button } from "@heroui/react"
import React, { useContext, useState } from 'react'
import { useAppContext } from '../../../../contexts/AppContext'
import { toast } from 'sonner'
import expensesService from '@/services/expensesService'
import { Data } from '../../TabsExpense/TabsOthersCost'

function ModalActionType({ isOpen, onClose, action, selectData, id, isCloseType, getTypeData, typeData }) {

  const { currentUser } = useAppContext()
  const { isAction, setIsAction, getDataOtherExpenses } = useContext(Data)
  const [newValue, setNewValue] = useState('')

  const handleEdit = async () => {
    if (typeData?.find(e => e.typeName === newValue)) {
      toast.error('ประเภทนี้มีอยู่ในระบบแล้ว')
      return;
    } else {
      try {
        await expensesService.editExpensesType(action, id, newValue)
        await getTypeData()
        await getDataOtherExpenses()
        toast.success('แก้ไขข้อมูลสำเร็จ', { position: 'top-right' })
        setIsAction(!isAction)
      } catch (error) {
        console.log('Something Wrong', error)
      }
    }
  }

  const handleDelete = async () => {
    try {
      await expensesService.ChangeExpensestypeStatus(action, id, isCloseType)
      await getTypeData()
      await getDataOtherExpenses()
      toast.success('ปิดการใช้งานสำเร็จ', { position: 'top-right' })
      setIsAction(!isAction)
    } catch (error) {
      console.log('Something Wrong', error)
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>
          {action === 'edit' ? 'แก้ไขประเภท' : 'ปิดการใช้งาน'}
        </ModalHeader>
        <ModalBody>
          {action === 'edit' ?
            (
              <>
                <Input label='ชื่อประเภท' onChange={(e) => setNewValue(e.target.value)} placeholder={selectData} type='text'></Input>
              </>
            )
            :
            (<>
              <Input label='ประเภท' placeholder={selectData} type='text'></Input>
            </>)}
        </ModalBody>
        <ModalFooter>
          {action === 'edit' ?
            (<>
              <Button size='sm' color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button size='sm' color="primary" onPress={() => { onClose(); handleEdit(); }}>
                ยืนยันการแก้ไข
              </Button>
            </>) :
            (<>
              <Button size='sm' color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button size='sm' color={isCloseType ? 'danger' : 'primary'} onPress={() => { onClose(); handleDelete(); }}>
                <span className='text-white'>{isCloseType ? 'ยืนยันการปิดการใช้งาน' : 'ยืนยันการเปิดการใช้งาน'}</span>
              </Button>
            </>)}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ModalActionType
