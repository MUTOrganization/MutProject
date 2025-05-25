import { GroupListBox, GroupListItem } from "@/component/GroupListBox";
import { useAppContext } from "@/contexts/AppContext"
import { Button, Select, SelectItem, Tooltip } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import departmentService from "@/services/departmentService";
import Department from "@/models/department";
import HqChip from "@/component/HqChip";
import { PlusIcon, SortDesc } from "lucide-react";

export default function RoleManageTab() {
    const { currentUser } = useAppContext()
    /** @type {[Department[]]} */
    const [departmentList, setDepartmentList] = useState([])
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState(null);


    async function fetchDepartmentList(){
        try{
            setIsLoading(true);
            const data = await departmentService.getDepartments(currentUser.agent.agentId);
            data.sort((a, b) => a.isHq ? -1 : 1);
            setDepartmentList(data);
            if(selectedDepartmentId === null && data.length > 0){
                setSelectedDepartmentId(String(data[0].departmentId));
            }
        }catch(err){
            console.error(err);
            toastError('ไม่สามารถดึงข้อมูลแผนกได้');
        }finally{
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchDepartmentList();
    }, [])

    const selectedDepartment = useMemo(() => {
        return departmentList.find(d => String(d.departmentId) === selectedDepartmentId);
    }, [selectedDepartmentId, departmentList])

    const roleList = useMemo(() => {
        return departmentList.find(d => String(d.departmentId) === selectedDepartmentId)?.roles || [];
    }, [selectedDepartmentId, departmentList])

    return (
        <div className="">
            <div className="flex mb-4 mt-2">
                <div className="w-full max-w-[280px]">
                    <Select
                        aria-label="ตัวเลือกแผนก"
                        variant="bordered"
                        label="แผนก"
                        placeholder="เลือกแผนก"
                        isLoading={isLoading}
                        disallowEmptySelection
                        selectedKeys={selectedDepartmentId ? [String(selectedDepartmentId)] : []}
                        onChange={(e) => {
                            setSelectedDepartmentId(e.target.value);
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
            <div className="flex h-[600px]">
                <div className="max-w-[320px] grow">
                    <GroupListBox 
                        title="ตำแหน่ง" 
                        selectedItem={String(selectedRoleId)} 
                        onSelectItem={(id) => setSelectedRoleId(id)} 
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
                                    {role.roleName}
                                </GroupListItem>
                            )
                        })}
                    </GroupListBox>
                </div>
            </div>
        </div>
    )
}