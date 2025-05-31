import { useAppContext } from '@/contexts/AppContext'
import roleService from '@/services/roleService'
import userService from '@/services/userService'
import { Button, Input } from '@heroui/react'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal'
import { Select, SelectItem } from '@nextui-org/select'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

function EditEmployeeModal({ isOpen, onClose, selectUserData, fetchData, departmentId, isSuperAdmin, selector }) {
    const { currentUser } = useAppContext()
    const [selectDepartment, setSelectDepartment] = useState(selectUserData?.department?.departmentId || null);

    // Fetch Data
    const [roleData, setRoleData] = useState([])

    const [userData, setUserData] = useState({
        name: selectUserData.name,
        nickname: selectUserData.nickname,
        probStatus: selectUserData.probStatus ? '1' : '0',
        roleId: selectUserData.role.roleId || null,
    })

    const probItem = [
        { key: '1', value: 'ผ่านการทดลองงาน' },
        { key: '0', value: 'ไม่ผ่านการทดลองงาน' }
    ]

    // Fetch Current Role
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

    const handleUpdate = async () => {
        try {
            await userService.updateUser(userData, [selectUserData.username])
            toast.success('บันทึกข้อมูลพนักงานเรียบร้อย')
            fetchData()
        } catch (err) {
            console.log(err)
            toast.error('บันทึกข้อมูลพนักงานไม่สำเร็จ')
        }
    }
    const isDisabled = userData.name === '' || userData.nickname === '' || userData.roleId === null

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className='space-x-2'><span className='text-slate-500'>แก้ไขข้อมูลพนักงาน</span> <span className='text-blue-500'>( {selectUserData.username} )</span></ModalHeader>
                <ModalBody className=''>
                    <div className='flex flex-row justify-between items-center space-x-2'>
                        <Input aria-label='ชื่อ' size='sm' placeholder='ชื่อ-นามสกุล' value={userData.name} onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} />
                    </div>
                    <Input type="text" size='sm' aria-label='ชื่อเล่น' placeholder='ชื่อเล่น' value={userData.nickname} onChange={(e) => setUserData(prev => ({ ...prev, nickname: e.target.value }))} />
                    <div className='flex flex-row justify-between items-center space-x-2'>
                        <div className='w-full'>
                            <span className='text-xs text-slate-500'>แผนก</span>
                            <Select aria-label='แผนก' size='sm' defaultSelectedKeys={[String(selectDepartment)]} onChange={(e) => setSelectDepartment(Number(e.target.value) || null)}>
                                {departmentId.map((department) => (
                                    <SelectItem key={department.departmentId} value={department.departmentId}>{department.departmentName}</SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className='w-full'>
                            <span className='text-xs text-slate-500'>ตำแหน่ง</span>
                            <Select aria-label='ตำแหน่ง' size='sm' defaultSelectedKeys={[String(userData.roleId)]} onChange={(e) => setUserData(prev => ({ ...prev, roleId: Number(e.target.value) || null }))}>
                                {roleData?.map((role) => (
                                    <SelectItem key={role.roleId} value={role.roleId}>{role.roleName}</SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <Select aria-label='สถานะการทดลองงาน' defaultSelectedKeys={[String(userData.probStatus)]} size='sm' className='mt-1' onChange={(e) => setUserData(prev => ({ ...prev, probStatus: e.target.value }))}>
                        {probItem.map((item) => (
                            <SelectItem key={item.key} value={item.key}>{item.value}</SelectItem>
                        ))}
                    </Select>
                </ModalBody>
                <ModalFooter className='my-2'>
                    <Button size='sm' color='primary' isDisabled={isDisabled} className='px-6' onPress={() => { handleUpdate(); onClose() }}>บันทึก</Button>
                    <Button size='sm' className='px-6' onPress={onClose}>ยกเลิก</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EditEmployeeModal
