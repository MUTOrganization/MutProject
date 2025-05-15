import { Card, CardBody, CircularProgress, Tab, Tabs } from "@nextui-org/react";
import { lazy, Suspense, useState } from "react";
import { useAppContext } from "../../../../contexts/AppContext";
import { ACCESS } from "../../../../configs/access";
import DefaultDepRoleManageTab from "./subPages/DefaultDepRoleManageTab";

const DepartmentManageTab = lazy(() => import('./subPages/DepartmentManage'))
const RoleManageTab = lazy(() => import('./subPages/RoleManageTab'))
export default function DepartmentAndRoleManage(){
    const [activateTab, setActivateTab] = useState(localStorage.getItem('depAndRoleTabs')??"department");
    const {currentUser, accessCheck} = useAppContext()
    return(
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
                    localStorage.setItem('depAndRoleTabs', key)
                }}
                >
                    {
                        accessCheck.haveAny([ACCESS.department.view]) &&
                        <Tab
                            key="department"
                            title={
                            <div className="flex items-center space-x-2">
                                <span>จัดการแผนก</span>
                            </div>
                            }
                        />
                    }
                    {
                        accessCheck.haveAny([ACCESS.role_manage.roleManage_view]) &&
                        <Tab
                            key="role"
                            title={
                            <div className="flex items-center space-x-2">
                                <span>จัดการตำแหน่ง</span>
                            </div>
                            }
                        />
                    }
                    {/* {
                        (accessCheck.haveAll([ACCESS.role_manage.roleManage_view, ACCESS.department.manage]) && currentUser.businessId == 1) &&
                        <Tab
                            key="defaultDepRole"
                            title={
                                <div className="flex items-center space-x-2">
                                    <span>จัดการแผนกต้นแบบให้ตัวแทน</span>
                                </div>
                            }
                        />
                    } */}


                </Tabs>
                <CardBody>
                    <div className="">
                        <Suspense fallback={<div className="w-full flex justify-center mt-4"><CircularProgress /></div>}>
                            {
                                activateTab == 'department' ?
                                <DepartmentManageTab />
                                :
                                activateTab == 'defaultDepRole' ?
                                <DefaultDepRoleManageTab />
                                :
                                <RoleManageTab />
                            }
                        </Suspense>


                    </div>
                </CardBody>
            </Card>
        </section>
    )
}