import { Card, CardBody, CircularProgress, Tab, Tabs } from "@nextui-org/react";
import { Suspense, useEffect, useState } from "react";
import TopUpManagementSubPage from "./subPages/TopUpManagementSubPage";
import CheckRemainingBalance from "./subPages/CheckRemainingBalance";

function TopupManagements() {
    const [tabActive, setTabActive] = useState('tab_topupManage');

    useEffect(() => {
        setTabActive(localStorage.getItem('topUpManage') ?? 'tab_topupManage');
    }, []);

    return (
        <section className="w-full">
            <Card className="flex p-4 h-full min-h-[700px] w-full shadow-none">
                <Tabs
                    variant="underlined" color="primary"
                    aria-label="tab-submenu"
                    selectedKey={tabActive}
                    onSelectionChange={(key) => { setTabActive(key); localStorage.setItem('topUpManage', key) }}
                    classNames={{
                        tabList:
                            "gap-6 w-full relative rounded-none p-0 border-b border-divider max-sm:mx-4",
                        cursor: "w-full bg-[#22d3ee]",
                        tab: "max-w-fit px-0 h-12",
                        tabContent: "group-data-[selected=true]:text-[#06b6d4]",
                    }}>
                    <Tab
                        key={'tab_topupManage'}
                        title={
                            <div className="flex items-center space-x-2">
                                <span>จัดการเติมเงิน</span>
                            </div>
                        } >
                    </Tab>
                    <Tab
                        key={'tab_topupCheckBalance'}
                        title={
                            <div className="flex items-center space-x-2">
                                <span>ตรวจสอบยอดคงเหลือ</span>
                            </div>
                        } />
                </Tabs>
                <CardBody>
                    <div>
                        <Suspense fallback={<div className="w-full flex justify-center mt-4"><CircularProgress /></div>}>
                            {
                                tabActive == 'tab_topupManage' ?
                                    <TopUpManagementSubPage />
                                    :
                                    <CheckRemainingBalance />
                            }
                        </Suspense>

                    </div>
                </CardBody>
            </Card>
        </section>
    )
}


export default TopupManagements;