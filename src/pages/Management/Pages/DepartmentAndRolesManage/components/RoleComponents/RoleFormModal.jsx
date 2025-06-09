import { toastError, toastSuccess, toastWarning } from "@/component/Alert";
import roleService from "@/services/roleService";
import { Button, Input } from "@heroui/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Select, SelectItem } from "@nextui-org/select"
import { useEffect, useState } from "react";

export default function RoleFormModal({ isOpen, onClose = () => {}, selectedRole, selectedDepartment, roleList, onSubmit = () => {} }) {
    const [editingRole, setEditingRole] = useState({
        roleName: '',
    });

    const [roleLevelAttachType, setRoleLevelAttachType] = useState('lower');
    const [attachRoleId, setAttachRoleId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const isEdit = selectedRole ? true : false;

    useEffect(() => {
        if(selectedRole){
            setEditingRole({
                roleName: selectedRole.roleName,
            });
        }else{
            setEditingRole({
                roleName: '',
            });
        }
    }, [selectedRole]);

    useEffect(() => {
        if(roleList.length > 0){
            setRoleLevelAttachType('lower');
            setAttachRoleId(roleList[roleList.length - 1].roleId);
        }else{
            setRoleLevelAttachType('lower');
            setAttachRoleId(null);
        }
    },[roleList])

    function handleInputChange(key, value){
        setEditingRole({
            ...editingRole,
            [key]: value,
        });
    }

    async function handleSubmit(){
        try{
            setIsLoading(true);
            if(editingRole.roleName.trim() === ''){
                toastWarning('กรุณากรอกชื่อตำแหน่ง');
                return;
            }
            if(isEdit){
                await roleService.updateRole(selectedRole.roleId, editingRole.roleName.trim());
            }else{
                const roleAttach = roleList.find(role => String(role.roleId) === String(attachRoleId))
                const roleLevel = roleAttach ? roleLevelAttachType === 'lower' ? roleAttach.roleLevel + 1 : roleAttach.roleLevel - 1 : 1;
                await roleService.createRole(selectedDepartment.departmentId, editingRole.roleName.trim(), roleLevel);
            }
            toastSuccess('สำเร็จ', `${isEdit ? 'แก้ไข' : 'สร้าง'}ตำแหน่งเรียบร้อย`);
            onSubmit();
            onClose();
        }catch(error){
            console.log(error);
            if(error?.response?.data?.isDuplicate){
                toastWarning(`ไม่สามารถ${isEdit ? 'แก้ไข' : 'สร้าง'}ตำแหน่งได้`, 'มีชื่อตำแหน่งนี้อยู่ในระบบแล้ว');
                return;
            }
            toastError('เกิดข้อผิดพลาด', `ไม่สามารถ${isEdit ? 'แก้ไข' : 'สร้าง'}ตำแหน่งได้`);
        }finally{
            setIsLoading(false);
        }

        onSubmit(editingRole);
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} aria-label="role-form-modal">
            <ModalContent>
                <ModalHeader>{isEdit ? 'แก้ไขตำแหน่ง' : 'เพิ่มตำแหน่ง'}</ModalHeader>
                <ModalBody>
                    <div className="">
                        <div>
                            <label className="ms-2 text-sm text-primary">ชื่อตำแหน่ง</label>
                            <Input
                                aria-label="role-name"
                                placeholder="กรุณากรอกชื่อตำแหน่ง"
                                variant="bordered"
                                value={editingRole.roleName}
                                onValueChange={(e) => handleInputChange('roleName', e)}
                                validate={(value) => {
                                    if(value.trim() === ''){
                                        return 'กรุณากรอกชื่อตำแหน่ง';
                                    }
                                    return true;
                                }}
                            />
                        </div>
                        {
                            (!isEdit && roleList.length > 0) && 
                            <div className="mt-8">
                                <label className="ms-2 text-sm text-primary">ระดับตำแหน่ง</label>
                                <div className="flex gap-2">
                                    <Select
                                        aria-label="role-level-attach-type"
                                        variant="bordered"
                                        disallowEmptySelection
                                        className="w-32"
                                        selectedKeys={[roleLevelAttachType]}
                                        onSelectionChange={(e) => setRoleLevelAttachType(Array.from(e)[0])}
                                    >
                                        <SelectItem key="lower">ต่ำกว่า</SelectItem>
                                        <SelectItem key="higher">สูงกว่า</SelectItem>
                                    </Select>
                                    <Select
                                        aria-label="role-attach"
                                        variant="bordered"
                                        disallowEmptySelection
                                        className="w-32"
                                        selectedKeys={attachRoleId ? [String(attachRoleId)] : []}
                                        onSelectionChange={(e) => setAttachRoleId(Array.from(e)[0])}
                                    >
                                        {
                                            roleList.map(role => {
                                                return (
                                                    <SelectItem key={role.roleId}>{role.roleName}</SelectItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </div>
                            </div>
                        }
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="flex gap-2 mt-4 justify-end">
                        <Button type="button" variant="light" color="danger" onPress={onClose}>
                            ยกเลิก
                        </Button>
                        <Button type="submit" color="primary" onPress={handleSubmit} isLoading={isLoading}>
                            {isEdit ? 'บันทึก' : 'สร้างตำแหน่ง'}
                        </Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}