import { Card, Tab, Tabs } from "@nextui-org/react";
import { useState } from "react";
import SettingMedal from "./subPages/SettingMedal";
import SettingConditionMedal from "./subPages/SettingConditionMedal";


function MasterSettingAward() {

    const [tabActive, setTabActive] = useState(localStorage.getItem('settingAward') || 'settingMedal')
    const listMenu = {
        settingMedal: <SettingMedal />,
        settingConditionMedal: <SettingConditionMedal />
    }


    return (
        <Card className="flex p-4 h-full  shadow-none">
            <Tabs
                variant="underlined" color="primary"
                aria-label="tab-submenu"
                selectedKey={tabActive}
                onSelectionChange={(key) => { setTabActive(key); localStorage.setItem('settingAward', key) }}
                classNames={{
                    tabList:
                        "gap-6 w-full relative rounded-none p-0 border-b border-divider max-sm:mx-4",
                    cursor: "w-full bg-[#22d3ee]",
                    tab: "max-w-fit px-0 h-12",
                    tabContent: "group-data-[selected=true]:text-[#06b6d4]",
                }}>
                <Tab key={'settingMedal'} title='ตั้งค่าเหรียญรางวัล' />
                <Tab key={'settingConditionMedal'} title='ตั้งค่าเงื่อนไขเหรียญรางวัล' />
            </Tabs>

            <div className="w-full h-full p-10">
                {listMenu[tabActive]}
            </div>
        </Card>
    )
}

export default MasterSettingAward;