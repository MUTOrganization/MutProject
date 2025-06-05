import { useAppContext } from "@/contexts/AppContext";
import Department from "@/models/department";
import departmentService from "@/services/departmentService";
import { useEffect, useMemo, useState } from "react";
import DepartmentTable from "../components/DepartmentComponents/DepartmentTable";
import { toastError } from "@/component/Alert";
import DepFormModal from "../components/DepartmentComponents/DepFormModal";
import DepDeleteModal from "../components/DepartmentComponents/DepDeleteModal";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import agentService from "@/services/agentService";
import Agent from "@/models/agent";

export default function ManageDepartmentTab(){
    const { currentUser} = useAppContext()
    const [departmentList, setDepartmentList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    /** @type {[Array<Agent>]} */
    const [agentList, setAgentList] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState(currentUser.agent);

    /** @type {Map<number, Department>} */
    const departmentMap = useMemo(() => {
        return new Map(departmentList.map(dep => [dep.departmentId, dep]));
    }, [departmentList]);

    useEffect(() => {
        if(currentUser.baseRole !== 'SUPER_ADMIN') return;
        try{
            agentService.getAgent().then(data => {
                setAgentList(data);
            });
        }catch(err){
            console.error(err);
            toastError('ไม่สามารถดึงข้อมูลตัวแทนได้');
        }
    }, [currentUser])

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

    function handleAgentChange(value){
        if(value === null) return;
        setSelectedAgent(agentList.find(agent => agent.agentId === Number(value)));
    }

    return(
        <div>
            <div className="flex mb-4">
                {
                    currentUser.baseRole === 'SUPER_ADMIN' &&
                    <div className="max-w-64">
                        <Autocomplete
                            aria-label='ตัวแทน'
                            variant='bordered'
                            label='ตัวแทน'
                            placeholder='เลือกตัวแทน'
                            onSelectionChange={handleAgentChange}
                            selectedKey={`${selectedAgent.agentId}`}
                        >   
                            {agentList.map(item => (
                                <AutocompleteItem key={item.agentId} >{item.name}</AutocompleteItem>
                            ))}
                        </Autocomplete>

                    </div>
                }
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
                selectedAgent={selectedAgent}
                onSubmit={() => {
                    refreshDepartmentList();
                }}
            />
            <DepDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                selectedAgent={selectedAgent}
                selectedDepartment={selectedDepartment}
                onSubmit={() => {
                    refreshDepartmentList();
                }}
            />
            
        </div>
    )
}