import { Button, Card, CardBody, CardHeader, Tab, Tabs } from "@heroui/react";
import { CustomFormatDate } from "@/utils/dateUtils";
import { useState } from "react";
import { DeleteIcon, EditIcon } from "lucide-react";
import GroupList from "./components/GroupList";
import AccessList from "./components/AccessList";


function MasterAccess() {
    const [groupList, setGroupList] = useState([]);
    const [groupSelected, setGroupSelected] = useState(null);

    // mockUp ตามโครงสร้างตารางในภาพ
    const mockGroupList = [
        {
            accessGroupId: 1,
            groupName: "Genaral",
            description: "กลุ่มสิทธิ์ทั่วไป",
            createDate: "2024-06-01T10:00:00Z",
            updateDate: "2024-06-05T12:00:00Z"
        },
        {
            accessGroupId: 2,
            groupName: "Manager",
            description: "กลุ่มผู้บริหาร",
            createDate: "2024-06-02T11:00:00Z",
            updateDate: "2024-06-06T13:00:00Z"
        },
        {
            accessGroupId: 3,
            groupName: "Fix",
            description: "กลุ่มสิทธิ์งานครบวัน",
            createDate: "2024-06-03T12:00:00Z",
            updateDate: "2024-06-07T14:00:00Z"
        },
        {
            accessGroupId: 4,
            groupName: "Fix",
            description: "กลุ่มสิทธิ์งานครบวัน",
            createDate: "2024-06-03T12:00:00Z",
            updateDate: "2024-06-07T14:00:00Z"
        },
        {
            accessGroupId: 5,
            groupName: "Fix",
            description: "กลุ่มสิทธิ์งานครบวัน",
            createDate: "2024-06-03T12:00:00Z",
            updateDate: "2024-06-07T14:00:00Z"
        },
        {
            accessGroupId: 6,
            groupName: "Fix",
            description: "กลุ่มสิทธิ์งานครบวัน",
            createDate: "2024-06-03T12:00:00Z",
            updateDate: "2024-06-07T14:00:00Z"
        }
    ]



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
                <GroupList groupList={mockGroupList} groupSelected={groupSelected} setGroupSelected={setGroupSelected} />
                {/* รายการสิทธิ์ */}
                <AccessList />
            </CardBody>
        </Card>
    )
}

export default MasterAccess;