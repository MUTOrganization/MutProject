import { useAppContext } from "@/contexts/AppContext";
import Department from "@/models/department";
import departmentService from "@/services/departmentService";
import { useEffect, useMemo, useState } from "react";
import DepartmentTable from "../components/DepartmentComponents/DepartmentTable";
import { toastError } from "@/component/Alert";
import DepFormModal from "../components/DepartmentComponents/DepFormModal";
import DepDeleteModal from "../components/DepartmentComponents/DepDeleteModal";

export default function ManageDepartmentTab(){
    const {agent: {selectedAgent}, currentUser} = useAppContext()
    const [departmentList, setDepartmentList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    /** @type {Map<number, Department>} */
    const departmentMap = useMemo(() => {
        return new Map(departmentList.map(dep => [dep.departmentId, dep]));
    }, [departmentList]);

    async function refreshDepartmentList(){
        setIsLoading(true);
        try{
            const data = await departmentService.getDepartments(selectedAgent.agentId);
            setDepartmentList(data);
        }catch(err){
            console.error(err);
            toastError('ไม่สามารถดึงข้อมูลแผนกได้');
        }finally{
            setIsLoading(false);
        }
    }
    useEffect(() => {
        refreshDepartmentList();
    },[selectedAgent])
    
    function handleAddModalOpen(){
        setSelectedDepartment(null);
        setIsFormModalOpen(true);
    }

    function handleEditModalOpen(departmentId){
        const department = departmentMap.get(Number(departmentId));
        setSelectedDepartment(department);
        setIsFormModalOpen(true);
    }

    function handleDeleteModalOpen(departmentId){
        const department = departmentMap.get(Number(departmentId));
        setSelectedDepartment(department);
        setIsDeleteModalOpen(true);
    }

    return(
        <div>
            <div className="flex">

            </div>
            <div className="h-[600px]">
                <DepartmentTable
                    departmentList={departmentList}
                    selectedDepartmentId={selectedDepartment?.departmentId}
                    isLoading={isLoading}
                    onAddClick={() => handleAddModalOpen()}
                    onEditClick={(departmentId) => handleEditModalOpen(departmentId)}
                    onDeleteClick={(departmentId) => handleDeleteModalOpen(departmentId)}
                />
            </div>



            <DepFormModal 
                isOpen={isFormModalOpen} 
                onClose={() => setIsFormModalOpen(false)} 
                selectedDepartment={selectedDepartment} 
                onSubmit={() => {
                    refreshDepartmentList();
                }}
            />
            <DepDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                selectedDepartment={selectedDepartment}
                onSubmit={() => {
                    refreshDepartmentList();
                }}
            />
            
        </div>
    )
}