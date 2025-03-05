import { Input } from '@nextui-org/input'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal'
import { Button } from '@nextui-org/react'
import React, { act, useState } from 'react'
import { URLS } from '../../../../config'
import fetchProtectedData from '../../../../../utils/fetchData'
import { useAppContext } from '../../../../contexts/AppContext'
import { toast } from 'sonner'

function ModalActionType({ isOpen, onClose, action, selectData, id, setIsManageType, setIsAction }) {

  const { currentUser } = useAppContext()

  const [newValue, setNewValue] = useState('')

  const handleEdit = async () => {
    const url = `${URLS.OTHEREXPENSES}/manageExpenses`
    try {
      const res = await fetchProtectedData.post(url, {
        action: 'edit',
        id: id,
        typeExpenses: newValue,
        update_By: currentUser.userName
      })
      toast.success('แก้ไขข้อมูลสำเร็จ', { position: 'top-right' })
      setIsAction(true)
    } catch (error) {
      console.log('Something Wrong', error)
    }
  }

  const handleDelete = async () => {
    const url = `${URLS.OTHEREXPENSES}/manageExpenses`
    try {
      const res = await fetchProtectedData.post(url, {
        action: 'delete',
        id: id,
      })
      toast.success('ลบข้อมูลสำเร็จ', { position: 'top-right' })
      setIsAction(true)
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
                ยืนยันการปิดการใช้งาน
              </Button>
            </>)}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ModalActionType
