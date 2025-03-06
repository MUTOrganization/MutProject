import { Card, CardBody, CircularProgress, Tab, Tabs } from "@nextui-org/react";
import DefaultLayout from "../../layouts/default";
import { Suspense, useEffect, useState } from "react";
import Topup from "./SubPages/Topup";
import PDH from "./SubPages/PenaltyDeductionHistory";

function TransactionHistory() {
    const [tabActive, setTabActive] = useState('topup');

    useEffect(() => {
        setTabActive(localStorage.getItem('trxHistory') ?? 'topup');
    }, []);

    function renderComponent() {
        switch (tabActive) {
            case 'topup':
                return <Topup />;
            case 'penaltyDeduction':
                return <PDH />
            default:
                return <Topup />;
        }
    }

    return (
        <section title={'ประวัติการทำธุรกรรม'}>
            <Card className="w-full h-full min-h-[700px] p-4" shadow="sm">
                <Tabs variant="underlined" color="primary"
                    aria-label="tab-submenu"
                    selectedKey={tabActive}
                    onSelectionChange={(key) => { setTabActive(key); localStorage.setItem('trxHistory', key) }}
                    classNames={{
                        tabList:
                            "gap-6 w-full relative rounded-none p-0 border-b border-divider max-sm:mx-4",
                        cursor: "w-full bg-[#22d3ee]",
                        tab: "max-w-fit px-0 h-12",
                        tabContent: "group-data-[selected=true]:text-[#06b6d4]",
                    }}>
                    <Tab key={'topup'} title='เติมเงิน' />
                    <Tab key={'penaltyDeduction'} title='ค่าปรับ' />
                </Tabs>

                <CardBody>
                    <Suspense fallback={<div className="w-full flex justify-center mt-4"><CircularProgress /></div>}>
                        {renderComponent()}
                    </Suspense>
                </CardBody>
            </Card>
        </section>
    )
}


export default TransactionHistory;