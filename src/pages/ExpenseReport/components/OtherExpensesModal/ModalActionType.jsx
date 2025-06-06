import { Input } from "@heroui/input"
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal"
import { Button, Spinner } from "@heroui/react"
import React, { useContext, useMemo, useState } from 'react'
import { useAppContext } from '../../../../contexts/AppContext'
import { toast } from 'sonner'
import expensesService from '@/services/expensesService'
import { Data } from '../../TabsExpense/TabsOthersCost'
import { toastError, toastSuccess, toastWarning } from "@/component/Alert"
import { FaExclamationCircle } from "react-icons/fa"

function ModalActionType({ isOpen, onClose, action, selectData, id, isCloseType, getTypeData, typeData }) {

  const { isAction, setIsAction, getDataOtherExpenses } = useContext(Data)
  const [newValue, setNewValue] = useState(selectData)
  const [isLoading, setIsLoading] = useState(false)

  const sameClosedType = useMemo(() => {
    return typeData.find(
      (e) => e.typeName.toLowerCase() === newValue.trim().toLowerCase() && !e.status
    );
  }, [newValue, typeData]);

  const handleEdit = async () => {
    const TrimValue = newValue.trim()

    // Validate
    if (!TrimValue) {
      toastWarning('คำเตือน', 'กรุณากรอกชื่อประเภท');
      return;
    }
    // Check same type
    const sameType = typeData.find(
      (e) => e.typeName.toLowerCase() === TrimValue.toLowerCase()
    );

    setIsLoading(true);
    try {
      if (sameType) {
        if (!sameType.status) {
          await expensesService.ChangeExpensestypeStatus('close', sameType.expensesTypeId, false)
          await getTypeData()
          await getDataOtherExpenses()
          onClose()
          setIsAction(false)
          toastSuccess('สำเร็จ', 'เปิดการใช้งานสำเร็จ')
        } else {
          toastWarning('คำเตือน', 'มีประเภทนี้อยู่ในระบบแล้ว')
          setIsLoading(false);
        }
      } else {
        await expensesService.editExpensesType(action, id, newValue)
        await getTypeData()
        await getDataOtherExpenses()
        onClose()
        setIsAction(!isAction)
        toastSuccess('สำเร็จ', 'แก้ไขประเภทสำเร็จ')
      }
    } catch (error) {
      console.log('Something Wrong', error)
      toastError('ผิดพลาด', 'แก้ไขประเภทไม่สำเร็จ')
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await expensesService.ChangeExpensestypeStatus(action, id, isCloseType)
      await getTypeData()
      await getDataOtherExpenses()
      onClose()
      setIsAction(false)
      toastSuccess('สำเร็จ', 'ปิดการใช้งานสำเร็จ')
    } catch (error) {
      console.log('Something Wrong', error)
      toastError('ผิดพลาด', 'ปิดการใช้งานไม่สำเร็จ')
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>
          {action === 'edit' ? 'แก้ไขประเภท' : 'ปิดการใช้งาน'}
        </ModalHeader>
        <ModalBody>
          <>
            {action === 'edit' ?
              (
                <>
                  <Input label='ชื่อประเภท' variant="bordered"
                    onChange={(e) => setNewValue(e.target.value)} value={newValue} type='text'
                    onKeyDown={(e) => {
                      if (e.key === ' ') {
                        e.preventDefault();
                      }
                    }} />
                </>
              )
              :
              (<>
                <Input label='ประเภท' variant="bordered" isDisabled placeholder={selectData} type='text' />
                <div className="text-center w-full text-red-500 text-xs">
                    <span>หากมีรายการค่าใช้จ่ายที่เป็นประเภทนี้อยู่ ระบบจะทำการปิดการแสดงผลรายการค่าใช้จ่ายด้วย ต้องการหรือไม่?</span>
                </div>
              </>)}
            <div>
              {action === 'edit' &&
                sameClosedType &&
                newValue.trim().toLowerCase() !== selectData.toLowerCase() && (
                  <div className="text-red-500 text-sm mt-1 bg-red-100 rounded-lg p-2 w-full flex flex-col justify-center items-center space-y-2">
                    <FaExclamationCircle className="text-xl" />
                    <span className="text-xs">
                      มีประเภทนี้อยู่ในระบบและถูกปิดการใช้งานอยู่ หากกดบันทึกจะเป็นการเปิดการใช้งานแทน ต้องการหรือไม่?
                    </span>
                  </div>
                )}
            </div>
          </>
        </ModalBody>
        <ModalFooter>
          {action === 'edit' ?
            (<>
              <Button size='sm' color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button size='sm' color="primary" onPress={handleEdit}>
                {isLoading && <Spinner color="white" size="sm" />}
                ยืนยันการแก้ไข
              </Button>
            </>) :
            (<>
              <Button size='sm' color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button size='sm' color={isCloseType ? 'danger' : 'primary'} onPress={handleDelete}>
                {isLoading && <Spinner color="white" size="sm" />}
                <span className='text-white'>{isCloseType ? 'ยืนยันการปิดการใช้งาน' : 'ยืนยันการเปิดการใช้งาน'}</span>
              </Button>
            </>)}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ModalActionType
