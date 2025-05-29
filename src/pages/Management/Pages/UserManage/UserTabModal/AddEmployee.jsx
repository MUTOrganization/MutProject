import { useAppContext } from '@/contexts/AppContext'
import departmentService from '@/services/departmentService'
import roleService from '@/services/roleService'
import userService from '@/services/userService'
import { Button, DatePicker, Input } from '@heroui/react'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal'
import { Select, SelectItem } from '@nextui-org/select'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

function AddEmployee({ isOpen, onClose, fetchData, departmentId, userList, isSuperAdmin, selector }) {
    const { currentUser } = useAppContext()

    // Fetch Role
    const [roleData, setRoleData] = useState([])

    const [userData, setUserData] = useState({
        username: '',
        name: '',
        nickname: '',
        password: '',
        roleId: null
    })
    // Other State
    const [selectDepartment, setSelectDepartment] = useState(null)

    // Get Current Role
    const fetchRole = async () => {
        try {
            const res = await roleService.getRolesByDepartmentId(isSuperAdmin ? selector.agent : currentUser.agent.agentId, Number(selectDepartment))
            setRoleData(res)
        } catch (err) {
            console.log('Can not Fetch Role At Add Employee Modal', err)
        }
    }

    useEffect(() => {
        fetchRole()
    }, [selectDepartment])

    const AddEmployee = async () => {
        if (userList?.find(u => u.username === userData.username)) {
            toast.error('รหัสพนักงานนี้มีอยู่ในระบบแล้ว')
            return
        }
        try {
            await userService.createUser(userData.username, userData.name, userData.nickname, userData.password, null, userData.roleId)
            toast.success('สำเร็จเพิ่มพนักงาน')
            fetchData()
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
                                {roleData?.map(role => (
                                    <SelectItem key={role?.roleId} value={role?.roleId} className='text-xs text-slate-500'>
                                        {role?.roleName}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' size='sm' className='px-6' isDisabled={isDisabled} onPress={() => { AddEmployee(); onClose() }}>ยืนยัน</Button>
                    <Button size='sm' onPress={() => onClose()}>ยกเลิก</Button>
                </ModalFooter>
            </ModalContent>
        </Modal >
    )
}

export default AddEmployee
