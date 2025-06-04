import { Button, Card, CardBody, CardHeader, Tab, Tabs } from "@heroui/react";
import { useEffect, useState } from "react";
import GroupList from "./components/GroupList";
import AccessList from "./components/AccessList";
import { getAccess, getGroupAccess } from "@/services/accessService";


function MasterAccess() {
    const [groupList, setGroupList] = useState([]);
    const [accessList, setAccessList] = useState([]);
    const [groupSelected, setGroupSelected] = useState(null);
    const [isLoading, setIsLoading] = useState(false);



    async function fetchGetData() {
        setIsLoading(true)
        const [access, groupAccess] = await Promise.all([
            getAccess(false),
            getGroupAccess(false)
        ])

        setGroupList(groupAccess)
        setAccessList(access)
        setGroupSelected(groupAccess[0])
        setIsLoading(false)
    }

    const allAccessByGroupId = accessList.filter(access => access.accessGroupId === groupSelected.accessGroupId)

    useEffect(() => {
        fetchGetData()
    }, [])



    return (
        <Card className="p-4 min-h-full" shadow="none">
            <CardHeader>
                <Tabs
                    aria-label="tab-master-access"
                    color="primary"
                    variant="underlined"
                    fullWidth
                    classNames={{
                        tabList:
                            "gap-6 w-full relative rounded-none p-0 border-b border-divider max-sm:mx-4",
                        cursor: "w-full bg-[#22d3ee]",
                        tab: "max-w-fit px-0 h-12 text-md",
                        tabContent: "group-data-[selected=true]:text-[#06b6d4]",
                    }}
                >
                    <Tab key="1" title="จัดการสิทธิ์" />
                </Tabs>
            </CardHeader>
            <CardBody className="flex flex-row gap-4 max-md:flex-col">
                {/* หมวดหมู่สิทธิ์ */}
                <GroupList groupList={groupList} isLoading={isLoading} groupSelected={groupSelected} setGroupSelected={setGroupSelected} isFetchGroup={fetchGetData} />
                {/* รายการสิทธิ์ */}
                <AccessList accessList={allAccessByGroupId} groupSelected={groupSelected} isFetchAccess={fetchGetData} isLoading={isLoading} />
            </CardBody>
        </Card>
    )
}

export default MasterAccess;