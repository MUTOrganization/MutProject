import { getAccess, getAccessByRoleId } from "@/services/accessService";
import { Button, Card, Checkbox, Spinner, Tooltip } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { groupArray } from "@/utils/arrayFunc";
import { toastError, toastSuccess } from "@/component/Alert";
import roleService from "@/services/roleService";

export default function RoleAccessBox({ selectedRole, onSubmit = () => {} }) {
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
        getAccess().then((data) => {
            setAccessList(data.map(e => ({...e, accessGroupName: e.accessGroup.groupName})));
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setIsLoading(false);
        })
    }, [])

    useEffect(() => {
        if (!selectedRole) return;
        const controller = new AbortController();
        setIsLoading(true);
        getAccessByRoleId(selectedRole.roleId, controller).then((data) => {
            setRoleAccessList(data);
            setEditAccessList(new Set(data.map(e => e.accessId)));
        }).catch((err) => {
            if (err.name !== "AbortError") {
                return;
            }
            console.error(err);
        }).finally(() => {
            setIsLoading(false);
        })

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
                await roleService.updateRoleAccessHq(selectedRole.roleId, Array.from(editAccessList));
            }else{
                await roleService.updateRoleAccess(selectedRole.roleId, Array.from(editAccessList));
            }
            toastSuccess('บันทึกสำเร็จ', 'สิทธิ์ของตำแหน่งถูกบันทึกเรียบร้อย')
            onSubmit();
        }catch(err){
            console.error(err);
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกสิทธิ์ได้')
        }finally{
            setIsSubmitting(false);
        }
    }

    return (
        <div className="size-full">
            <Card shadow="sm" className="size-full p-4">
            {
            selectedRole ?
                <div className="flex flex-col">
                    <div className="flex font-bold border-b py-2 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div>จัดการสิทธิ์ของตำแหน่ง {selectedRole?.roleName}</div>
                            <Tooltip content={`มีสิทธิ์ ${roleAccessList.length} จาก ${accessList.length} สิทธิ์`}>
                                <span className="text-sm text-gray-500">({roleAccessList.length} / {accessList.length})</span>
                            </Tooltip>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button size="sm" color="primary" onPress={handleSubmit} isLoading={isSubmitting}>บันทึก</Button>
                        </div>
                    </div>
                    <div className="flex flex-col pt-4 max-h-[500px] max-md:h-[500px] overflow-y-auto scrollbar-hide relative">
                    {
                        Object.keys(accessGroups).map(groupName => {
                            const group = accessGroups[groupName];
                            return (
                                <div key={groupName} className="">
                                    <div className="font-bold">{groupName}</div>
                                    <div className="grid grid-cols-2 gap-y-2 mt-4 pb-4 mb-6 border-b px-2">
                                    { group.map(access => {
                                        return (
                                            <div key={access.accessId}>
                                                <Checkbox
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