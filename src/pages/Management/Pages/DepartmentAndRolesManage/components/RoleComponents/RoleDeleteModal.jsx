import { toastError, toastSuccess } from "@/component/Alert";
import roleService from "@/services/roleService";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

export default function RoleDeleteModal({isOpen, onClose = () => {}, selectedRole, onSubmit = () => {}}){
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(){
        try{
            setIsLoading(true);
            await roleService.deleteRole(selectedRole.roleId);
            toastSuccess("สำเร็จ", "ลบตำแหน่งเรียบร้อย");
            onSubmit();
            onClose();
        }catch(err){
            console.error(err);
            toastError("เกิดข้อผิดพลาด", "ไม่สามารถลบแผนกได้");
        }finally{
            setIsLoading(false);
        }
    }
    return(
        <Modal isOpen={isOpen} onClose={onClose} aria-label="department-delete-modal">
            <ModalContent>
                <ModalHeader>
                    <div>
                        <div className="flex gap-2 items-center">
                            <p className="text-lg font-bold">ลบตำแหน่ง</p>
                            <p className="text-sm text-gray-500">{selectedRole?.roleName}</p>
                        </div>
                    </div>
                </ModalHeader>
                <ModalBody className="border-b border-t py-8">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                            <Trash2Icon className="w-8 h-8 text-red-500" />
                        </div>
                        <p className="text-red-600 font-medium text-center">คุณต้องการลบตำแหน่งนี้หรือไม่?<br />การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
                        <p className="text-red-500 font-bold text-2xl text-center">{selectedRole?.roleName}</p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" color="danger" onPress={onClose}>ยกเลิก</Button>
                    <Button color="danger" onPress={handleSubmit} isLoading={isLoading}>ยืนยัน</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )         
}