import { toastError, toastSuccess, toastWarning } from "@/component/Alert";
import { useAppContext } from "@/contexts/AppContext";
import departmentService from "@/services/departmentService";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { Button, Checkbox, Input } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";

export default function DepFormModal({isOpen, onClose = () => {}, selectedDepartment, onSubmit = () => {}}) {
    const { currentUser } = useAppContext()
    const isCurrentUserHq = currentUser.agent.businessType === 'H'

    const [editingDepartment, setEditingDepartment] = useState({
        departmentName: '',
    });
    const [isHq, setIsHq] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isEdit = useMemo(() => {
        return Boolean(selectedDepartment?.departmentId);
    },[selectedDepartment])

    useEffect(() => {
        setEditingDepartment({
            departmentName: selectedDepartment?.departmentName ?? '',
        });
    }, [selectedDepartment]);

    function handleNameChange(e){
        setEditingDepartment({
            ...editingDepartment,
            departmentName: e.target.value,
        });
    }

    async function handleSubmit(){
        try{
            setIsLoading(true);
            if(isEdit){
                await departmentService.updateDepartment(selectedDepartment.departmentId, editingDepartment.departmentName);
                toastSuccess('ระบบทำการแก้ไขแผนกเรียบร้อย');
            }else{
                await departmentService.createDepartment(currentUser.agent.agentId, editingDepartment.departmentName, isHq);
                toastSuccess('ระบบทำการสร้างแผนกเรียบร้อย');
            }
            setEditingDepartment({
                departmentName: ''
            })
            onSubmit();
            onClose();
        }catch(error){
            if(error?.response?.data?.isDuplicate){
                toastWarning('ไม่สามารถสร้างแผนกได้', 'มีชื่อแผนกนี้อยู่ในระบบแล้ว');
                return;
            }
            console.error(error);
            toastError("เกิดข้อผิดพลาด", selectedDepartment?.departmentId ? "ไม่สามารถแก้ไขแผนกได้" : "ไม่สามารถสร้างแผนกได้");
            
        }finally{
            setIsLoading(false);
        }
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose} aria-label="department-form-modal">
            <ModalContent>
                <ModalHeader>เพิ่มแผนก</ModalHeader>
                <ModalBody>
                    <div className="">
                        <div>
                            <label className="ms-2 text-sm text-primary">ชื่อแผนก</label>
                            <Input
                                aria-label="department-name"
                                placeholder="กรุณากรอกชื่อแผนก"
                                variant="bordered"
                                value={editingDepartment.departmentName}
                                onChange={(e) => handleNameChange(e)}
                            />
                        </div>
                        {
                            (!isEdit && isCurrentUserHq) &&
                            <div className="mt-4">
                                <Checkbox 
                                    aria-label="checkbox สร้างให้ตัวแทน"
                                    isSelected={isHq}
                                    onChange={() => setIsHq(!isHq)}
                                >
                                    สร้างให้ตัวแทน
                                </Checkbox>
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
                            สร้างแผนก
                        </Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
