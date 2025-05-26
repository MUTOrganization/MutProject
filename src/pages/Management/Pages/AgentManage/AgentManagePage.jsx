import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import { useMemo, useState } from "react";
import AgentAccessManagePage from "./subPages/AgentAccessManagePage";
import AgentPage from "./subPages/AgentPage";
import { SESSION_STORAGE_KEYS } from "@/configs/sessionStorageKeys";
import { useAppContext } from "@/contexts/AppContext";

export default function AgentManage() {
    const {currentUser, accessCheck} = useAppContext()
    const [activateTab, setActivateTab] = useState(sessionStorage.getItem(SESSION_STORAGE_KEYS.AGENT_TABS)??"agent");

    const allowTabs = useMemo(() => {
        return {
            agent: accessCheck.haveAny([]),
            access: accessCheck.haveAny([]),
        }
    }, [currentUser])

    const handleTabChange = (key) => {
        setActivateTab(key);
        sessionStorage.setItem(SESSION_STORAGE_KEYS.AGENT_TABS, key)
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
                    onSelectionChange={handleTabChange}
                >
                    {
                        allowTabs.agent &&
                        <Tab
                            key="agent"
                            title={
                                <div className="flex items-center space-x-2">
                                    <span>จัดการตัวแทน</span>
                                </div>
                            }
                        >
                            <AgentPage />
                        </Tab>
                    }
                    {
                        allowTabs.access &&
                        <Tab
                            key="access"
                            title={
                                <div className="flex items-center space-x-2">
                                    <span>จัดการสิทธิ์ตัวแทน</span>
                                </div>
                            }
                    >
                            <AgentAccessManagePage />
                        </Tab>
                    }
                </Tabs>
            </Card>
        </section>
    )
}