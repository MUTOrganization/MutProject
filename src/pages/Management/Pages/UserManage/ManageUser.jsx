import { Card, CardBody, CircularProgress, Tab, Tabs } from "@heroui/react";
import { lazy, Suspense, useState } from "react";
import { useAppContext } from "../../../../contexts/AppContext";
import { ACCESS } from "../../../../configs/accessids";

const UserProbationManageTab = lazy(() => import('./subPages/UserProbationManage'))
const UserRoleManageTab = lazy(() => import('./subPages/UserRoleTab'))
const UserStartWorkDateManage = lazy(() => import('./subPages/UserStartWorkDateManage'))
const UserManageTab = lazy(() => import('./subPages/UserManageTab'))
export default function UserManage() {
    const [activateTab, setActivateTab] = useState(sessionStorage.getItem('userManageTabs') ?? "user");
    const { accessCheck } = useAppContext()

    const tabsDic = {
        "user": <UserManageTab />,
        "role": <UserRoleManageTab />,
        "probation": <UserProbationManageTab />,
        "workStartDate": <UserStartWorkDateManage />
    }
    return (
        <section className="w-full">
            <Card className="flex sm:p-4 max-h-[calc(100vh-120px)] max-w-screen-2xl overflow-hidden" shadow="none" radius="sm">
                <Tabs
                    aria-label="Options"
                    color="primary"
                    variant="underlined"
                    classNames={{
                        tabList:
                            "gap-6 w-full relative rounded-none p-0 border-b border-divider max-sm:mx-4",
                        cursor: "w-full bg-[#22d3ee]",
                        tab: "max-w-fit px-0 h-12",
                        tabContent: "group-data-[selected=true]:text-[#06b6d4]",
                    }}
                    selectedKey={activateTab}
                    onSelectionChange={(key) => {
                        setActivateTab(key);
                        sessionStorage.setItem('userManageTabs', key)
                    }}
                >
                    {
                        accessCheck.haveAny([]) &&
                        <Tab
                            key="user"
                            title={
                                <div className="flex items-center space-x-2">
                                    <span>จัดการพนักงาน</span>
                                </div>
                            }
                        />
                    }
                    {
                        accessCheck.haveAny(['FIX']) &&
                        <Tab
                            key="role"
                            title={
                                <div className="flex items-center space-x-2">
                                    <span>จัดการตำแหน่ง</span>
                                </div>
                            }
                        />
                    }
                    {
                        accessCheck.haveAny(['FIX']) &&
                        <Tab
                            key="probation"
                            title={
                                <div className="flex items-center space-x-2">
                                    <span>จัดการสถานะการทดลองงาน</span>
                                </div>
                            }
                        />
                    }
                    {
                        accessCheck.haveAny([]) &&
                        <Tab
                            key="workStartDate"
                            title={
                                <div className="flex items-center space-x-2">
                                    <span>จัดการวันเริ่มทำงาน</span>
                                </div>
                            }
                        />
                    }

                </Tabs>
                <CardBody>
                    <div className="">
                        <Suspense fallback={<div className="w-full flex justify-center mt-4"><CircularProgress /></div>}>
                            {tabsDic[activateTab]}
                        </Suspense>

                    </div>
                </CardBody>
            </Card>
        </section>
    )
}