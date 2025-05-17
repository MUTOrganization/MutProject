import { Card, CardBody, Tab, Table, TableBody, TableColumn, TableHeader, Tabs } from "@heroui/react";
import { useState } from "react";
import AgentAccessManagePage from "./subPages/AgentAccessManagePage";

export default function AgentManage() {
    const [activateTab, setActivateTab] = useState("access")
    const tabs = {
        "access": <AgentAccessManagePage />,
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
                        key="access"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>จัดการสิทธิ์ตัวแทน</span>
                            </div>
                        }
                    />
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