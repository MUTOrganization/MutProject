import { Card, CircularProgress, Tab, Tabs } from "@heroui/react";
import { lazy, Suspense, useMemo, useState } from "react";
import { useAppContext } from "../../../../contexts/AppContext";
import { SESSION_STORAGE_KEYS } from "@/configs/sessionStorageKeys";

const DepartmentManageTab = lazy(() => import('./subPages/DepartmentManageTab'))
const RoleManageTab = lazy(() => import('./subPages/RoleManageTab'))
export default function DepartmentAndRoleManage(){
    const [activateTab, setActivateTab] = useState(sessionStorage.getItem(SESSION_STORAGE_KEYS.DEP_AND_ROLE_TABS)??"department");
    const {currentUser, accessCheck, agent: { selectedAgent }} = useAppContext()

    const allowTabs = useMemo(() => {
        return {
            department: accessCheck.haveAny([]),
            role: accessCheck.haveAny([]),
        }
    }, [currentUser])

    const handleTabChange = (key) => {
        setActivateTab(key);
        sessionStorage.setItem(SESSION_STORAGE_KEYS.DEP_AND_ROLE_TABS, key)
    }
    return(
        <section className="w-full">
            <Card className="flex sm:p-4 max-h-[calc(100vh-120px)] max-w-screen-2xl overflow-hidden" shadow="none" radius="sm">
                <Tabs
                aria-label="department-and-role-manage-tabs"
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
                onSelectionChange={handleTabChange}
                >
                    {
                        allowTabs.department &&
                        <Tab
                            key="department"
                            aria-label="department-tab"
                            title={
                            <div className="flex items-center space-x-2">
                                <span>จัดการแผนก</span>
                            </div>
                            }
                        >
                            <Suspense fallback={<div className="w-full flex justify-center mt-4"><CircularProgress /></div>}>
                                <DepartmentManageTab />
                            </Suspense>
                        </Tab>
                    }
                    {
                        allowTabs.role &&
                        <Tab
                            key="role"
                            aria-label="role-tab"
                            title={
                            <div className="flex items-center space-x-2">
                                <span>จัดการตำแหน่ง</span>
                            </div>
                            }
                        >
                            <Suspense fallback={<div className="w-full flex justify-center mt-4"><CircularProgress /></div>}>
                                <RoleManageTab />
                            </Suspense>
                        </Tab>
                    }


                </Tabs>
            </Card>
        </section>
    )
}