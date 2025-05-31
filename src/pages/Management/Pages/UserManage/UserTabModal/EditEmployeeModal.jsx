import { toastError, toastSuccess, toastWarning } from '@/component/Alert'
import { useAppContext } from '@/contexts/AppContext'
import roleService from '@/services/roleService'
import userService from '@/services/userService'
import { Button, Input, Spinner } from '@heroui/react'
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

    const [isLoadingEdit, setIsLoadingEdit] = useState(false)

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

    const handleValidate = () => {
        if (!userData.name.trim() || !userData.nickname.trim() || !userData.roleId || userData.roleId === null) {
            toastWarning('คำเตือน', 'กรุณากรอกข้อมูลให้ครบ')
            return true
        }
        return false
    }

    const handleUpdate = async () => {
        if (handleValidate()) {
            return;
        }
        setIsLoadingEdit(true)
        try {
            await userService.updateUser(userData, [selectUserData.username])
            await fetchData()
            setIsLoadingEdit(false)
            onClose()
            toastSuccess('สำเร็จ', 'แก้ไขข้อมูลพนักงานสำเร็จ')
        } catch (err) {
            console.log(err)
            toastError('ไม่สำเร็จ', 'แก้ไขข้อมูลพนักงานไม่สำเร็จ')
        }
    }

    useEffect(() => {
        fetchRole()
    }, [selectDepartment])

    return (
        <Modal isOpen={isOpen} onClose={onClose} isKeyboardDismissDisabled={false} isDismissable={false} backdrop='blur'>
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
                            <Select aria-label='แผนก' size='sm' defaultSelectedKeys={[String(selectDepartment)]} onChange={(e) => { setSelectDepartment(Number(e.target.value) || null); setUserData(prev => ({ ...prev, roleId: null })) }}>
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
                    <Button size='sm' color='primary' className='px-8' onPress={handleUpdate}>
                        {isLoadingEdit && <Spinner color='white' size='sm' />}
                        <span>ยืนยีน</span>
                    </Button>
                    <Button size='sm' className='px-8' onPress={onClose}>ยกเลิก</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EditEmployeeModal
