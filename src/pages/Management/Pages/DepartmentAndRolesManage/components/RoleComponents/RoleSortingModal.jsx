import { toastError, toastSuccess } from "@/component/Alert";
import SortableDragAndDrop from "@/component/DragAndDrop/SortableDragAndDrop";
import { MenuIcon } from "@/component/Icons";
import roleService from "@/services/roleService";
import { Button, Card } from "@heroui/react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { SortDesc } from "lucide-react";
import { useEffect, useState } from "react";

export default function RoleSortingModal({isOpen, onClose = () => {}, selectedDepartment, roleList, onSubmit = () => {}}){
    const [isOrderChange, setIsOrderChange] = useState(false);
    const [sortingRoleList, setSortingRoleList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        setSortingRoleList(roleList);
    }, [roleList])


    async function handleSubmit(){
        try{
            setIsLoading(true);
            const isHq = selectedDepartment.isHq;
            if(isHq){
                await roleService.updateRoleLevelHq(selectedDepartment.departmentId, sortingRoleList);
            }else{
                await roleService.updateRoleLevel(sortingRoleList);
            }
            toastSuccess('สำเร็จ', 'เรียงลำดับตำแหน่งเรียบร้อย');
            onSubmit();
            onClose();
        }catch(err){
            console.error(err);
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถเรียงลำดับตำแหน่งได้');
        }finally{
            setIsLoading(false);
        }
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose} aria-label="role-sorting-modal">
            <ModalContent>
                <ModalHeader>
                    <div className="flex items-center gap-2">
                        <span className="text-primary"><SortDesc size={20}/> </span> เรียงลำดับตำแหน่ง แผนก <span className="ms-2 font-bold text-primary">{selectedDepartment?.departmentName}</span>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className=" mx-8 mb-4 p-3">
                        <div className="flex space-x-4">
                            {
                                sortingRoleList.length > 1 &&
                                <div className=" flex flex-col justify-between py-4">
                                    <div>สูงกว่า</div>
                                    <div>ต่ำกว่า</div>
                                </div>
                            }
                            <div className="flex-1">
                                <SortableDragAndDrop
                                    items={sortingRoleList.map(item => ({...item, id: item.roleId}))}
                                    keyFieldName={'id'}
                                    onChange={(newOrder) => {
                                        setIsOrderChange(true);
                                        setSortingRoleList(newOrder);
                                    }}
                                >
                                    {(item, index) => (
                                        <div key={item.roleId} className="mb-2">
                                            <Card shadow="sm" className="">
                                                <div className="flex justify-between items-center p-4">
                                                    <div>{item.roleName}</div>
                                                    <div><MenuIcon/></div>
                                                </div>
                                            </Card>
                                        </div>
                                    )}
                                </SortableDragAndDrop>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="flex gap-2 mt-4 justify-end">
                        <Button type="button" variant="light" color="danger" onPress={onClose}>
                            ยกเลิก
                        </Button>
                        <Button type="submit" color="primary" onPress={handleSubmit} isLoading={isLoading} isDisabled={!isOrderChange}>
                            ยืนยัน
                        </Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
