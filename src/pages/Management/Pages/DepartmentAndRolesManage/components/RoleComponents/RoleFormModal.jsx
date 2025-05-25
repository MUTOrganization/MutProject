import { Button, Input } from "@heroui/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Select, SelectItem } from "@nextui-org/select"
import { useEffect, useState } from "react";

// import Select from "react-select"

export default function RoleFormModal({ isOpen, onClose = () => {}, selectedRole, selectedDepartment, roleList, onSubmit = () => {}, isLoading = false }) {
    const [editingRole, setEditingRole] = useState({
        roleName: '',
        roleLevelAttachType: 'lower', // 
        attachRole: 1, // id ของ ตำแหน่งที่เลือก
    });

    useEffect(() => {
        setEditingRole({
            roleName: selectedRole?.roleName ?? '',
            roleLevel: selectedRole?.roleLevel ?? 1,
        });
    }, [selectedRole]);

    function handleInputChange(key, value){
        setEditingRole({
            ...editingRole,
            [key]: value,
        });
    }

    function handleSubmit(){
        onSubmit(editingRole);
    }
    console.log(roleList);
    return (
        <Modal isOpen={isOpen} onClose={onClose} aria-label="role-form-modal">
            <ModalContent>
                <ModalHeader>เพิ่มตำแหน่ง</ModalHeader>
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
                            />
                        </div>
                        {
                            roleList.length > 0 && 
                            <div className="mt-8">
                                <label className="ms-2 text-sm text-primary">ระดับตำแหน่ง</label>
                                <div className="flex gap-2">
                                    {/* <Select
                                        options={[{value: 'lower', label: 'ต่ำกว่า'}, {value: 'higher', label: 'สูงกว่า'}]}
                                        value={editingRole.roleLevelAttachType}
                                        onChange={(e) => handleInputChange('roleLevelAttachType', e.value)}
                                    /> */}
                                    <Select
                                        aria-label="role-level-attach-type"
                                        placeholder="กรุณาเลือกระดับตำแหน่ง"
                                        selectedKeys={[editingRole.roleLevelAttachType]}
                                        onValueChange={(e) => handleInputChange('roleLevelAttachType', e)}
                                    >
                                        <SelectItem value="lower">ต่ำกว่า</SelectItem>
                                        <SelectItem value="higher">สูงกว่า</SelectItem>
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
                            สร้างตำแหน่ง
                        </Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}