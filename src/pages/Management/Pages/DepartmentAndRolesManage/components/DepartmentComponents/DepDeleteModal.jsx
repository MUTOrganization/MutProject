import { toastError } from "@/component/Alert";
import departmentService from "@/services/departmentService";
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { useState } from "react";

export default function DepDeleteModal({isOpen, onClose = () => {}, selectedDepartment, onSubmit = () => {}}){
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(){
        try{
            setIsLoading(true);
            await departmentService.deleteDepartment(selectedDepartment.departmentId);
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
                            <p className="text-lg font-bold">ลบแผนก</p>
                            <p className="text-sm text-gray-500">{selectedDepartment.departmentName}</p>
                        </div>
                    </div>
                </ModalHeader>
                <ModalBody className="border-b border-t py-8">
                    <p>คุณต้องการลบแผนกนี้หรือไม่</p>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" color="danger" onPress={onClose}>ยกเลิก</Button>
                    <Button color="primary" onPress={handleSubmit} isLoading={isLoading}>ยืนยัน</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )         
}