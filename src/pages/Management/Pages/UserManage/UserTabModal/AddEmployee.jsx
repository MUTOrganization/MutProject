import { toastError, toastSuccess, toastWarning } from '@/component/Alert'
import HqChip from '@/component/HqChip'
import { useAppContext } from '@/contexts/AppContext'
import departmentService from '@/services/departmentService'
import roleService from '@/services/roleService'
import userService from '@/services/userService'
import { Autocomplete, AutocompleteItem, Button, Input, Spinner } from '@heroui/react'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal'
import { Select, SelectItem } from '@nextui-org/select'
import React, { useEffect, useState } from 'react'

function AddEmployee({ isOpen, onClose, fetchData, departmentId, userList, isSuperAdmin, selector, isManager }) {
    const { currentUser } = useAppContext()

    // Fetch Role
    const [roleData, setRoleData] = useState([])

    // User Data
    const [userData, setUserData] = useState({
        username: '',
        name: '',
        nickname: '',
        password: '',
        roleId: null
    })

    // Other State
    const [selectDepartment, setSelectDepartment] = useState(null)

    // Loading
    const [isLoadingAddUser, setIsLoadingAddUser] = useState(false)

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

    const handleValidate = () => {
        if (userList?.some(u => u.username.toLowerCase() === userData.username.toLowerCase())) {
            toastWarning('คำเตือน', 'รหัสพนักงานนี้มีอยู่ในระบบแล้ว')
            return true
        }
        if (!userData.username.trim() || !userData.password.trim() || !userData.name.trim() || !userData.nickname.trim() || !userData.roleId || userData.roleId === null) {
            toastWarning('คำเตือน', 'กรุณากรอกข้อมูลให้ครบ')
            return true
        }
        return false
    }

    const AddEmployee = async () => {
        if (handleValidate()) {
            return
        }
        setIsLoadingAddUser(true)
        try {
            await userService.createUser(userData.username, userData.name, userData.nickname, userData.password, null, userData.roleId)
            await fetchData()
            onClose()
            toastSuccess('สำเร็จ', 'เพิ่มพนักงานสำเร็จ')
        } catch (err) {
            if (err?.response?.status === 400) {
                toastWarning('คำเตือน', 'รหัสพนักงานนี้มีอยู่ในระบบแล้ว')
                return
            }
            // console.log('Can not Add Employee', err)
            // toastError('ไม่สำเร็จ', 'เพิ่มพนักงานไม่สำเร็จ')
        } finally {
            setIsLoadingAddUser(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === ' ') {
            e.preventDefault();
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} isKeyboardDismissDisabled={false} isDismissable={false} backdrop='blur'>
            <ModalContent>
                <ModalHeader>เพิ่มพนักงาน</ModalHeader>
                <ModalBody className='space-y-2'>
                    <div className='w-full flex flex-row justify-between items-center space-x-2'>
                        <Input maxLength={20} onKeyDown={handleKeyDown} aria-label='รหัสพนักงาน' placeholder='รหัสพนักงาน' onChange={(e) => setUserData(prev => ({ ...prev, username: e.target.value }))} />
                        <Input maxLength={20} onKeyDown={handleKeyDown} aria-label='รหัสผ่าน' placeholder='รหัสผ่าน' onChange={(e) => setUserData(prev => ({ ...prev, password: e.target.value }))} />
                    </div>
                    <div className='w-full flex flex-row justify-between items-center space-x-2'>
                        <Input aria-label='ชื่อ' placeholder='ชื่อ - นามสกุล' onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} />
                    </div>
                    <Input aria-label='ชื่อเล่น' placeholder='ชื่อเล่น' onChange={(e) => setUserData(prev => ({ ...prev, nickname: e.target.value }))} />
                    <div className='w-full flex flex-row justify-between items-center space-x-2'>
                        <div className='w-full'>
                            <span className='text-xs text-slate-500'>แผนก</span>
                            <Autocomplete allowsEmptyCollection isRequired aria-label='แผนก' placeholder='แผนก' selectedKey={`${selectDepartment}`} onSelectionChange={(value) => setSelectDepartment(Number(value) || null)}>
                                {departmentId.map(department => (
                                    <AutocompleteItem key={department.departmentId} value={department.departmentId} endContent={department.isHq ? <HqChip /> : null} className='text-xs text-slate-500'>
                                        {department.departmentName}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>
                        <div className='w-full'>
                            <span className='text-xs text-slate-500'>ตำแหน่ง</span>
                            <Autocomplete isRequired aria-label='ตำแหน่ง' placeholder='ตำแหน่ง' isDisabled={selectDepartment === null} selectedKey={`${userData.roleId}`} onSelectionChange={(value) => setUserData(prev => ({ ...prev, roleId: Number(value) || null }))}>
                                {roleData?.map(role => (
                                    <AutocompleteItem key={role?.roleId} value={role?.roleId} className='text-xs text-slate-500'>
                                        {role?.roleName}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' size='sm' className='px-8' onPress={AddEmployee}>
                        {isLoadingAddUser && <Spinner color='white' size='sm' />}
                        <span>บันทึก</span>
                    </Button>
                    <Button size='sm' className='px-8' onPress={() => onClose()}>ยกเลิก</Button>
                </ModalFooter>
            </ModalContent>
        </Modal >
    )
}

export default AddEmployee
