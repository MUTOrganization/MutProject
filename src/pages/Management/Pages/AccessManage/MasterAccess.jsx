import { Button, Card, CardBody, CardHeader, Tab, Tabs } from "@heroui/react";
import { CustomFormatDate } from "@/utils/dateUtils";
import { useEffect, useState } from "react";
import { DeleteIcon, EditIcon } from "lucide-react";
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
            getAccess(),
            getGroupAccess()
        ])

        setGroupList(groupAccess)
        setAccessList(access)
        setGroupSelected(groupAccess[0])
        setIsLoading(false)
    }

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
            <CardBody className="flex flex-row gap-4">
                {/* หมวดหมู่สิทธิ์ */}
                <GroupList groupList={groupList} groupSelected={groupSelected} setGroupSelected={setGroupSelected} />
                {/* รายการสิทธิ์ */}
                <AccessList />
            </CardBody>
        </Card>
    )
}

export default MasterAccess;