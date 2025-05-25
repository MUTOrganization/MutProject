import { GroupListBox, GroupListItem } from "@/component/GroupListBox";
import { useAppContext } from "@/contexts/AppContext"
import { Button, Select, SelectItem, Tooltip } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import departmentService from "@/services/departmentService";
import Department from "@/models/department";
import HqChip from "@/component/HqChip";
import { Delete, Edit, PlusIcon, SortDesc } from "lucide-react";
import RoleFormModal from "../components/RoleComponents/RoleFormModal";
import Role from "@/models/roles";
import RoleDeleteModal from "../components/RoleComponents/RoleDeleteModal";
import RoleSortingModal from "../components/RoleComponents/RoleSortingModal";
import RoleAccessBox from "../components/RoleComponents/RoleAccessBox";

export default function RoleManageTab() {
    const { currentUser } = useAppContext()
    /** @type {[Department[]]} */
    const [departmentList, setDepartmentList] = useState([])
    /** @type {[Department | null]} */
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    /** @type {[Role | null]} */
    const [selectedRole, setSelectedRole] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSortModalOpen, setIsSortModalOpen] = useState(false);

    async function fetchDepartmentList(){
        try{
            setIsLoading(true);
            const data = await departmentService.getDepartments(currentUser.agent.agentId);
            data.sort((a, b) => a.isHq ? -1 : 1);
            setDepartmentList(data);
            if(data.length > 0){
                if(selectedDepartment === null){
                    setSelectedDepartment(data[0]);
                }else{
                    const foundDepartment = data.find(d => String(d.departmentId) === String(selectedDepartment.departmentId));
                    if(foundDepartment){
                        setSelectedDepartment(foundDepartment);
                    }
                }
            }
        }catch(err){
            console.error(err);
            toastError('ไม่สามารถดึงข้อมูลแผนกได้');
        }finally{
            setTimeout(() => {
                setIsLoading(false);
            }, 200)
        }
    }

    useEffect(() => {
        fetchDepartmentList();
    }, [])

    useEffect(() => {
        setSelectedRole(null);
    }, [selectedDepartment])

    const roleList = useMemo(() => {
        return selectedDepartment?.roles || [];
    }, [selectedDepartment, departmentList])

    function handleSelectDepartment(departmentId){
        const foundDepartment = departmentList.find(d => String(d.departmentId) === departmentId);
        if(foundDepartment){
            setSelectedDepartment(foundDepartment);
        }
    }

    function handleSelectRole(roleId){
        const foundRole = roleList.find(r => String(r.roleId) === roleId);
        if(foundRole){
            setSelectedRole(foundRole);
        }
    }

    function handleAddClick(){
        setSelectedRole(null);
        setIsFormModalOpen(true);
    }

    function handleEditClick(roleId){
        setSelectedRole(roleList.find(r => String(r.roleId) === String(roleId)));
        setIsFormModalOpen(true);
    }

    function handleDeleteClick(roleId){
        setSelectedRole(roleList.find(r => String(r.roleId) === String(roleId)));
        setIsDeleteModalOpen(true);
    }

    function handleSortRoleClick(){
        setIsSortModalOpen(true);
    }


    return (
        <div className="max-h-[720px] overflow-auto scrollbar-hide">
            <div className="flex mb-4 mt-2">
                <div className="w-full max-w-[280px]">
                    <Select
                        aria-label="ตัวเลือกแผนก"
                        variant="bordered"
                        label="แผนก"
                        placeholder="เลือกแผนก"
                        isLoading={isLoading}
                        disallowEmptySelection
                        selectedKeys={selectedDepartment ? [String(selectedDepartment.departmentId)] : []}
                        onChange={(e) => {
                            handleSelectDepartment(e.target.value);
                        }}
                    >
                        {departmentList.map(department => {
                            return (
                                <SelectItem key={department.departmentId} value={String(department.departmentId)} endContent={department.isHq ? <HqChip /> : null}>
                                    {department.departmentName}
                                </SelectItem>
                            )
                        })}
                    </Select>
                </div>
            </div>
            <div className="flex max-md:flex-col md:h-[600px] space-x-8 max-md:space-x-0 max-md:space-y-8">
                <div className="w-[320px] max-md:w-full max-md:h-[400px]">
                    <GroupListBox 
                        title="ตำแหน่ง" 
                        selectedItem={String(selectedRole?.roleId)} 
                        onSelectItem={(id) => handleSelectRole(id)} 
                        isLoading={isLoading} 
                        emptyText="ไม่พบตำแหน่ง"
                        HeaderRightContent={  (selectedDepartment?.isHq && currentUser.baseRole !== "SUPER_ADMIN")
                            ? null
                            : <div className="flex items-center gap-2">
                                <Tooltip content="เปลี่ยนลำดับตำแหน่ง">
                                    <Button
                                        isIconOnly
                                        variant="light"
                                        color="primary"
                                        size="sm"
                                        onPress={() => handleSortRoleClick()}
                                        isDisabled={!selectedDepartment || roleList.length <= 1}
                                    >
                                        <SortDesc size={20} />
                                    </Button>
                                </Tooltip>
                                <Tooltip content="เพิ่มตำแหน่ง">
                                    <Button
                                        isIconOnly
                                        variant="light"
                                        color="success"
                                        size="sm"
                                        onPress={() => handleAddClick()}
                                        isDisabled={!selectedDepartment}
                                    >
                                        <PlusIcon size={20} />
                                    </Button>
                                </Tooltip>
                            </div>
                        }
                    >
                        {roleList.map(role => {
                            return (
                                <GroupListItem key={role.roleId}>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-2">
                                            <div className="text-sm font-medium">{role.roleName}</div>
                                        </div>
                                        <div className="flex items-center transition-all duration-200 opacity-0 group-hover:opacity-100">
                                            <Button isIconOnly variant="light" color="danger" size="sm" onPress={() => handleDeleteClick(role.roleId)}>
                                                <Delete size={14} />
                                            </Button>
                                            <Button isIconOnly variant="light" color="primary" size="sm" onPress={() => handleEditClick(role.roleId)}>
                                                <Edit size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                </GroupListItem>
                            )
                        })}
                    </GroupListBox>
                </div>
                <div className="grow max-md:w-full max-md:h-[600px] p-1 overflow-auto scrollbar-hide">
                    <RoleAccessBox selectedRole={selectedRole} />
                </div>
            </div>



            <RoleFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                selectedRole={selectedRole}
                selectedDepartment={selectedDepartment}
                roleList={roleList}
                isLoading={isLoading}
                onSubmit={() => {
                    fetchDepartmentList();
                }}
            />
            <RoleDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                selectedRole={selectedRole}
                onSubmit={() => {
                    fetchDepartmentList();
                }}
            />
            <RoleSortingModal
                isOpen={isSortModalOpen}
                onClose={() => setIsSortModalOpen(false)}
                selectedDepartment={selectedDepartment}
                roleList={roleList}
                onSubmit={() => {
                    fetchDepartmentList();
                }}
            />
        </div>
    )
}