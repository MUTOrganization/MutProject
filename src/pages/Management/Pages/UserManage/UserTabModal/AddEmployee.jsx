import { useAppContext } from '@/contexts/AppContext'
import departmentService from '@/services/departmentService'
import roleService from '@/services/roleService'
import userService from '@/services/userService'
import { Button, DatePicker, Input } from '@heroui/react'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal'
import { Select, SelectItem } from '@nextui-org/select'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

function AddEmployee({ isOpen, onClose, fetchData, roleId, departmentId }) {

    const { currentUser } = useAppContext()
    const [userData, setUserData] = useState({
        username: '',
        name: '',
        nickname: '',
        password: '',
        roleId: null
    })

    // Other State
    const [selectDepartment, setSelectDepartment] = useState(null)

    const AddEmployee = async () => {
        try {
            await userService.createUser(userData.username, userData.name, userData.nickname, userData.password, null, userData.roleId)
            await fetchData()
            onClose()
            toast.success('สำเร็จเพิ่มพนักงาน')
        } catch (err) {
            console.log('Can not Add Employee', err)
            toast.error('ไม่สำเร็จเพิ่มพนักงาน')
        }
    }

    const isDisabled = userData.username === '' || userData.name === '' || userData.nickname === '' || userData.password === '' || userData.roleId === null

    return (
        <Modal isOpen={isOpen} onClose={onClose} isKeyboardDismissDisabled={false} isDismissable={false} backdrop='blur'>
            <ModalContent>
                <ModalHeader>เพิ่มพนักงาน</ModalHeader>
                <ModalBody className='space-y-2'>
                    <div className='w-full flex flex-row justify-between items-center space-x-2'>
                        <Input aria-label='รหัสพนักงาน' placeholder='รหัสพนักงาน' onChange={(e) => setUserData(prev => ({ ...prev, username: e.target.value }))} />
                        <Input aria-label='รหัสผ่าน' placeholder='รหัสผ่าน' onChange={(e) => setUserData(prev => ({ ...prev, password: e.target.value }))} />
                    </div>
                    <div className='w-full flex flex-row justify-between items-center space-x-2'>
                        <Input aria-label='ชื่อ' placeholder='ชื่อ - นามสกุล' onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} />
                    </div>
                    <Input aria-label='ชื่อเล่น' placeholder='ชื่อเล่น' onChange={(e) => setUserData(prev => ({ ...prev, nickname: e.target.value }))} />
                    <div className='w-full flex flex-row justify-between items-center space-x-2'>
                        <div className='w-full'>
                            <span className='text-xs text-slate-500'>แผนก</span>
                            <Select isRequired aria-label='แผนก' placeholder='แผนก' value={selectDepartment} onChange={(e) => setSelectDepartment(Number(e.target.value) || null)}>
                                {departmentId.map(department => (
                                    <SelectItem key={department.departmentId} value={department.departmentId} className='text-xs text-slate-500'>
                                        {department.departmentName}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className='w-full'>
                            <span className='text-xs text-slate-500'>ตำแหน่ง</span>
                            <Select isRequired aria-label='ตำแหน่ง' placeholder='ตำแหน่ง' isDisabled={selectDepartment === null} value={userData.roleId} onChange={(e) => setUserData(prev => ({ ...prev, roleId: Number(e.target.value) }))}>
                                {roleId?.filter(a => a?.department?.departmentId === selectDepartment).map(role => (
                                    <SelectItem key={role?.roleId} value={role?.roleId} className='text-xs text-slate-500'>
                                        {role?.roleName}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' size='sm' className='px-6' isDisabled={isDisabled} onPress={AddEmployee}>ยืนยัน</Button>
                    <Button size='sm' onPress={() => onClose()}>ยกเลิก</Button>
                </ModalFooter>
            </ModalContent>
        </Modal >
    )
}

export default AddEmployee
