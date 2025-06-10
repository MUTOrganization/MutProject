import { getAccessByAgentId, getAccessByRoleId } from "@/services/accessService";
import { Button, Card, Checkbox, Spinner, Tooltip } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { groupArray, moveToFirstOfArray } from "@/utils/arrayFunc";
import { toastError, toastSuccess, toastWarning } from "@/component/Alert";
import roleService from "@/services/roleService";
import { useAppContext } from "@/contexts/AppContext";

export default function RoleAccessBox({ selectedRole, onSubmit = () => {}, allowEdit }) {
    const {currentUser} = useAppContext();
    const [accessList, setAccessList] = useState([]);
    const [roleAccessList, setRoleAccessList] = useState([]);
    const [editAccessList, setEditAccessList] = useState(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const accessGroups = useMemo(() => {
        return groupArray(accessList, "accessGroupName");
    }, [accessList])

    useEffect(() => {
        setIsLoading(true);
        getAccessByAgentId(currentUser.agent.agentId).then((data) => {
            setAccessList(data.map(e => ({...e, accessGroupName: e.accessGroup.groupName})));
        }).catch((err) => {
            console.log(err);
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลสิทธิ์ได้')
        }).finally(() => {
            setIsLoading(false);
        })
    }, [])

    async function fetchRoleAccess(controller){
        setIsLoading(true);
        getAccessByRoleId(selectedRole.roleId, controller).then((data) => {
            setRoleAccessList(data);
            setEditAccessList(new Set(data.map(e => e.accessId)));
        }).catch((err) => {
            if (err.name === "CanceledError") {
                return;
            }
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลสิทธิ์ได้')
            console.error(err);
        }).finally(() => {
            setIsLoading(false);
        })
    }

    useEffect(() => {
        if (!selectedRole) return;
        const controller = new AbortController();
        
        fetchRoleAccess(controller);

        return () => {
            controller.abort();
        }
    }, [selectedRole])

    function handleCheckAccess(accessId){
        const copy = new Set(editAccessList);
        if(copy.has(accessId)){
            copy.delete(accessId);
        }else{
            copy.add(accessId);
        }
        setEditAccessList(copy);
    }

    async function handleSubmit(){
        try{
            setIsSubmitting(true);
            const isHq = selectedRole.isHq;
            if(isHq){
                const {deletedCount, updatedCount, haveNoAccessAgent} = await roleService.updateRoleAccessHq(selectedRole.roleId, Array.from(editAccessList));
                if(haveNoAccessAgent.length > 0){
                    toastWarning('บันทึกสำเร็จ', 'มีการเพิ่มสิทธิ์ที่บางตัวแทนไม่มีสิทธิ์ใช้งาน');
                }else{
                    toastSuccess('บันทึกสำเร็จ', 'สิทธิ์ของตำแหน่งถูกบันทึกเรียบร้อย')
                }
            }else{
                await roleService.updateRoleAccess(selectedRole.roleId, Array.from(editAccessList));
                toastSuccess('บันทึกสำเร็จ', 'สิทธิ์ของตำแหน่งถูกบันทึกเรียบร้อย')
            }
            fetchRoleAccess();
            onSubmit();
        }catch(err){
            console.error(err);
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกสิทธิ์ได้')
        }finally{
            setIsSubmitting(false);
        }
    }
    const haveAccess = useMemo(() => {
        const accessMap = new Map(accessList.map(e => [e.accessId, e]));
        return roleAccessList.filter(e => accessMap.has(e.accessId));
    }, [roleAccessList, accessList])
    return (
        <div className="size-full">
            <Card shadow="sm" className="size-full p-4">
            {
            selectedRole ?
                <div className="flex flex-col">
                    <div className="flex font-bold border-b py-2 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div>จัดการสิทธิ์ของตำแหน่ง {selectedRole?.roleName}</div>
                            <Tooltip content={`มีสิทธิ์ ${haveAccess.length} จาก ${accessList.length} สิทธิ์`}>
                                <span className="text-sm text-gray-500">({haveAccess.length} / {accessList.length})</span>
                            </Tooltip>
                        </div>
                        {
                            allowEdit && (
                                <div className="flex items-center gap-2">
                                    <Button size="sm" color="primary" onPress={handleSubmit} isLoading={isSubmitting}>บันทึก</Button>
                                </div>
                            )
                        }
                    </div>
                    <div className="flex flex-col pt-4 max-h-[500px] max-md:h-[500px] overflow-y-auto scrollbar-hide relative">
                    {
                        moveToFirstOfArray(Object.keys(accessGroups), (groupName) => groupName === "General").map(groupName => {
                            const group = accessGroups[groupName];
                            return (
                                <div key={groupName} className="">
                                    <div className="font-bold">{groupName}</div>
                                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-4 pb-4 mb-6 border-b px-2">
                                    { group.map(access => {
                                        return (
                                            <div key={access.accessId}>
                                                <Checkbox
                                                    isDisabled={!allowEdit}
                                                    isSelected={editAccessList.has(access.accessId)}
                                                    onChange={() => handleCheckAccess(access.accessId)}
                                                >
                                                    {access.accessName}
                                                </Checkbox>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })
                    }
                        {
                            isLoading &&
                            <div className="absolute top-0 left-0 size-full flex justify-center items-center">
                                <Spinner />
                            </div>
                        }
                    </div>
                    
                </div>
            :
            <div className="flex justify-center mt-12 font-bold relative">
                <div>โปรดเลือกตำแหน่งที่ต้องการจัดการสิทธิ์</div>
                {
                    isLoading &&
                    <div className="absolute top-0 right-0 size-full flex justify-center items-center">
                        <Spinner />
                    </div>
                }
            </div>
            }
            </Card>
        </div>
    )
}