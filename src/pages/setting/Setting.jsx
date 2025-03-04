import React, { useEffect, useState } from "react";
import DefaultLayout from "../../layouts/default";
import { DotIcon } from "../../component/Icons";
import SideMenuSetting from "./Components/SideMenuSetting";
import SetCommission from "./Pages/CommissionSettings/CommissionSettings";
import SetIncentive from "./Pages/SetIncentive";
import SetModuleDepartment from "./Pages/SetModuleDepartment";
import SetModuleRole from "./Pages/SetModuleRole";
import ReturnFineSetting from "./Pages/ReturnFineSetting/ReturnFineSetting";
import CodCutoffSettings from "./Pages/CodCutoffSettings/CodCutoffSettings";
import MasterSettingAward from "./Pages/SettingAward/MasterSettingAward";
import DashboardOverviewSettings from "./Pages/DashboardOverviewSettings/DashboardOverviewSettings";
import { useAppContext } from "@/contexts/AppContext";
import AgentSettingAward from "./Pages/SettingAward/subPages/AgentSettingAward";
import MasterSettingOKR from "./SettingOKR/MasterSettingOKR";


function Setting() {
  const [activeComponent, setActiveComponent] = useState(localStorage.getItem('settingPage') ?? 'SetCommission')
  // const getComponentTitle = () => {
  //   switch (activeComponent) {
  //     case "SetCommission":
  //       return "ตั้งค่า Commission";
  //     case "SetIncentive":
  //       return "ตั้งค่า Incentive";
  //     case "SetModuleDepartment":
  //       return "ตั้งค่าตามแผนก";
  //     case "SetModuleRole":
  //       return "ตั้งค่าตามตำแหน่ง";
  //     case "SetConnect":
  //       return "ตั้งค่าการดึงข้อมูล";
  //     case "SetUserConnect":
  //       return "ตั้งค่าเเพลตฟอร์ม";
  //     case "SetReturnFine":
  //       return 'คั้งค่า ค่าปรับออเดอร์ตีกลับ'
  //     default:
  //       return "จัดการสิทธิ์การเข้าถึง";
  //   }
  // };

  // const renderComponent = () => {
  //   switch (activeComponent) {
  //     case "SetCommission":
  //       return <SetCommission />;
  //     case "SetIncentive":
  //       return <SetIncentive />;
  //     case "SetModuleDepartment":
  //       return <SetModuleDepartment />;
  //     case "SetModuleRole":
  //       return <SetModuleRole />;
  //     case "SetReturnFine":
  //       return <ReturnFineSetting />
  //     default:
  //       return <SetCommission />;
  //   }
  // };

  const { currentUser } = useAppContext();

  const listMenu = {
    SetCommission: { display: "ตั้งค่า Commission", component: <SetCommission /> },
    // SetReturnFine: { display: "ตั้งค่า ค่าปรับ", component: <ReturnFineSetting /> },
    SetCodCutoff: { display: "ตั้งค่า วันตัดยอดเงินเข้า", component: <CodCutoffSettings /> },
    // SetHopefulAward: { display: "ตั้งค่า Hopeful Award", component: <MasterSettingAward /> },
    // SetOverview: { display: "ตั้งค่า แดชบอร์ดยอดสั่งซื้อ", component: <DashboardOverviewSettings /> },
    // SetAgentAward: { display: "ตั้งค่า Award ทีม Ads", component: <AgentSettingAward /> },
    // SetOKR: { display: "ตั้งค่า OKR", component: <MasterSettingOKR /> },
  };

  const getComponentTitle = () => {
    return listMenu[activeComponent]?.display || "จัดการสิทธิ์การเข้าถึง";
  };

  const renderComponent = () => {
    return listMenu[activeComponent]?.component || <SetCommission />;
  };



  return (
    <section
      title={
        <>
          <div className="flex items-center space-x-2">
            <span>ตั้งค่า</span> <DotIcon />
            <span className="flex items-center text-sm font-normal ml">
              {getComponentTitle()}
            </span>
          </div>
        </>
      }
    >
      <div className="flex">
        <div className="flex flex-row h-fit min-h-full flex-1">
          <SideMenuSetting
            listMenu={listMenu}
            setActiveComponent={setActiveComponent}
            activeComponent={activeComponent}
          />
        </div>
        <div className="w-full min-h-full mx-2">{listMenu[activeComponent]?.component || <SetCommission />}</div>
      </div>
    </section>
  );
}

export default Setting;
