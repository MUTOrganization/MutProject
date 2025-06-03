import { Card, CardBody, Tab, Tabs } from "@heroui/react"
import { useEffect, useState } from "react"
import SetCommission from "./SetCommission"
import CommissionSettingsTable from "./CommissionSettingsTable"
import fetchProtectedData from "@/utils/fetchData";
import { toastError } from "@/component/Alert";
import { useAppContext } from "@/contexts/AppContext";
import departmentService from "@/services/departmentService";

export default function CommissionSettings() {
    const {currentUser} = useAppContext();
    const [departmentList, setDepartmentList] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const fetchDepartmentData = async () => {
        setIsLoading(true);
        try {
            const res = await departmentService.getDepartments(currentUser.agent.agentId);
            setDepartmentList(res);
            console.log(res);
        } catch (error) {
            toastError('เกิดข้อผิดพลาด', 'กรุณาลองใหม่อีกครั้ง')
            console.error('error fetching data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartmentData();
    }, [])

    const [activateTab, setActivateTab] = useState("set")
    const tabs = {
        // "table": <CommissionSettingsTable departmentData={departmentList} depLoading={isLoading} />,
        "set": <SetCommission departmentData={departmentList} depLoading={isLoading} />,
    }
    return (
        <section className="w-full">
            <Card className="flex p-4 max-h-[calc(100vh-120px)]" shadow="none" radius="sm">
                <Tabs
                    aria-label="Options"
                    color="primary"
                    variant="underlined"
                    classNames={{
                        tabList:
                            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                        cursor: "w-full bg-[#22d3ee]",
                        tab: "max-w-fit px-0 h-12",
                        tabContent: "group-data-[selected=true]:text-[#06b6d4]",
                    }}
                    selectedKey={activateTab}
                    onSelectionChange={(key) => setActivateTab(key)}
                >
                    <Tab
                        key="set"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>ตั้งค่า Commission</span>
                            </div>
                        }
                    />
                    {/* <Tab
                        key="table"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>การตั้งค่า Commission ทั้งหมด</span>
                            </div>
                        }
                    /> */}
                </Tabs>
                <CardBody>
                    <div className="">
                        {tabs[activateTab]}
                    </div>
                </CardBody>

            </Card>
        </section>
    )
}