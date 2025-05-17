import { Input } from '@nextui-org/input'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal'
import { Button } from '@nextui-org/react'
import React, { act, useContext, useState } from 'react'
import { URLS } from '../../../../config'
import fetchProtectedData from '../../../../../utils/fetchData'
import { useAppContext } from '../../../../contexts/AppContext'
import { toast } from 'sonner'
import expensesService from '@/services/expensesService'
import { Data } from '../../TabsExpense/TabsOthersCost'

function ModalActionType({ isOpen, onClose, action, selectData, id, isCloseType, getTypeData }) {

  const { currentUser } = useAppContext()
  const { isAction, setIsAction, } = useContext(Data)
  const [newValue, setNewValue] = useState('')

  const handleEdit = async () => {
    try {
      await expensesService.editExpensesType(action, id, newValue)
      await getTypeData()
      toast.success('แก้ไขข้อมูลสำเร็จ', { position: 'top-right' })
      setIsAction(!isAction)
    } catch (error) {
      console.log('Something Wrong', error)
    }
  }

  const handleDelete = async () => {
    try {
      await expensesService.ChangeExpensestypeStatus(action, id, isCloseType)
      await getTypeData()
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
              <Button size='sm' color="danger" onPress={() => { onClose(); handleDelete(); }}>
                <span>{isCloseType ? 'ยืนยันการปิดการใช้งาน' : 'ยืนยันการเปิดการใช้งาน'}</span>
              </Button>
            </>)}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ModalActionType
