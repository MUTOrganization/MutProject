import { Card, Tab, Tabs } from "@nextui-org/react";
import { useState } from "react";
import SetPenaltySubpage from "./subPages/SetPenaltySubpage";
import SettingManagePenalty from "./subPages/SettingManagePenalty";
import { useAppContext } from "../../../../contexts/AppContext";


function ReturnFineSetting() {
    const { currentUser } = useAppContext();
    const [tabActive, setTabActive] = useState(localStorage.getItem('settingPenalty') || 'setting_penalty')
    const listMenu = {
        setting_penalty: <SetPenaltySubpage />,
        setting_penalty_manage: <SettingManagePenalty />
    }

    return (
        <Card className="flex p-4 h-fit max-h-[800px] shadow-none">
            <Tabs
                variant="underlined" color="primary"
                aria-label="tab-submenu"
                selectedKey={tabActive}
                onSelectionChange={(key) => { setTabActive(key); localStorage.setItem('settingPenalty', key) }}
                classNames={{
                    tabList:
                        "gap-6 w-full relative rounded-none p-0 border-b border-divider max-sm:mx-4",
                    cursor: "w-full bg-[#22d3ee]",
                    tab: "max-w-fit px-0 h-12",
                    tabContent: "group-data-[selected=true]:text-[#06b6d4]",
                }}>
                <Tab key={'setting_penalty'} title='ตั้งค่า ค่าปรับออเดอร์ตีกลับ' />
                {currentUser.businessId === 1 && <Tab key={'setting_penalty_manage'} title='ตั้งค่า ค่าปรับออเดอร์ตีกลับแต่ละตัวแทน' />}
            </Tabs>

            <div className="w-full h-full p-10">
                {listMenu[tabActive]}
            </div>
        </Card>
    )
}


export default ReturnFineSetting;