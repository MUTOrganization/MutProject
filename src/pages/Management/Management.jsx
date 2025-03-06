import React, { useEffect, useState } from "react";
import DefaultLayout from "../../layouts/default";
import SideMenu from "./Components/SideMenuManage";
import ManageHome from "./Pages/ManageHome";
import StatusHopefulHeroes from "./Pages/StatusHopefulHeroes";
import { DotIcon } from "../../component/Icons";
import AgentManage from "./Pages/AgentManage/AgentManagePage";
import Permission from "./Pages/Permission";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { Toaster } from "sonner";
import ManageUser from "./Pages/UserManage/ManageUser";
import fetchProtectedData from "../../../utils/fetchData";
import { URLS } from "../../config";
import { useAppContext } from "../../contexts/AppContext";
import { ACCESS } from "../../configs/access";
import DepartmentAndRoleManage from "./Pages/DepartmentAndRolesManage/DepartmentAndRoleManage";
import TeamPage from "./Pages/TeamManage/TeamPage";
import DepPersonelManagement from "./Pages/DepartmentPersonelManagement";
import SetConnect from "./Components/SetConnect";
import SetUserConnect from "./Components/SetUserConnect";
import TopupManagements from "./Pages/Topup/TopupManagement";

function Management({ title }) {

  const [activeComponent, setActiveComponent] = useState(sessionStorage.getItem('managePageMenu') ?? null);

  const { accessCheck } = useAppContext()

  const handleItemClick = (itemName) => {
    const item = items[itemName];
    if (Array.isArray(item.access) && accessCheck.haveAny(item.access)) {
      setActiveComponent(itemName);
      sessionStorage.setItem('managePageMenu', itemName);
    } else {

      console.warn("คุณไม่มีสิทธิ์เข้าถึง Component นี้");
    }
  };

  useEffect(() => {
    if (!activeComponent) {
      const initialComponent = Object.keys(items).find(itemKey => {
        const item = items[itemKey];
        return Array.isArray(item.access) && accessCheck.haveAny(item.access);
      });
      setActiveComponent(initialComponent || null);
    }
  }, []);

  const list = {
    การจัดการ: {
      Home: { display: "จัดการหน้าแรก", component: <ManageHome />, access: [ACCESS.home.manage_home] },
      accessManage: { display: "จัดการสิทธิ์", component: <Permission />, access: [ACCESS.access_manage.access_view] },
      agentManage: { display: "จัดการตัวแทน", component: <AgentManage />, access: [ACCESS.agentManage.view] },
      depAndRole: {
        display: "จัดการแผนกและตำแหน่ง",
        component: <DepartmentAndRoleManage />,
        access: [
          ACCESS.role_manage.roleManage_view,
          ACCESS.department.view
        ]
      },
      depPersonelManagement: { display: 'จัดการบุคลากรภายในแผนก', component: <DepPersonelManagement />, access: [ACCESS.department_members_manage] },
      usersManage: { display: 'จัดการผู้ใช้งาน', component: <ManageUser />, access: [ACCESS.userManage.view, ACCESS.role_manage.userRole_view] },
      topUpManage: { display: 'จัดการเติมเงิน', component: <TopupManagements />, access: [ACCESS.topup_manage.topup_view] },
      team: { display: "จัดการทีม", component: <TeamPage />, access: [ACCESS.team.manager, ACCESS.team.leader, ACCESS.team.team_view_all] },
      Pancake: { display: "จัดการเชื่อมต่อ Pancake", component: <SetConnect />, access: [ACCESS.pancake.manage_pancake] },
      Account: { display: "จัดการข้อมูล Pancake", component: <SetUserConnect />, access: [ACCESS.pancake.manage_pancake] },
      // roleManage: { display: "จัดการตำแหน่ง" , component: <RoleManage />, access: [ACCESS.role_manage.roleManage_view, ACCESS.role_manage.userRole_view]}
    },
  };

  // Flatten the list for easy lookup
  const items = {};
  Object.entries(list).forEach(([lkey, lvalue]) => {
    Object.entries(lvalue).forEach(([slkey, slvalue]) => {
      items[slkey] = slvalue;
    });
  });
  
  const [selectedAccordionKeys, setSelectedAccordionKeys] = useState(new Set([]));

  return (
    <section
      title={
        <>
          <div className="flex items-center space-x-2">
            <span className="hidden lg:block">การจัดการ</span>
            <span className="hidden lg:block">
              <DotIcon />
            </span>
            <span className="flex items-center text-sm font-normal ml-2">
              {items[activeComponent]?.display ?? items["Home"].display}
            </span>
          </div>
        </>
      }
    >

      <div className="lg:flex">
        {/* Desktop View */}
        <div className="hidden lg:grid grid-cols-[250px_1fr] max-h-screen">
          <SideMenu
            list={list}
            setActiveComponent={handleItemClick}
            activeComponent={activeComponent}
          />
        </div>
        {/* Mobile View */}
        <div className="grid max-h-screen lg:hidden mb-4">
          <Accordion
            showDivider={false}
            className="p-2 flex flex-col gap-1 w-full max-w-screen"
            variant="shadow"
            isCompact
            selectedKeys={selectedAccordionKeys}
            onSelectionChange={setSelectedAccordionKeys}
          >
            <AccordionItem
              aria-label="Menu Sub"
              startContent
              key={"1"}
              title={
                <div className="flex items-center space-x-2">
                  <span>
                    {
                      Object.entries(list).find(([menuName, items]) =>
                        Object.keys(items).includes(activeComponent)
                      )?.[0]
                    }
                  </span>
                  <DotIcon className="mx-2" />
                  <span>{items[activeComponent]?.display}</span>
                </div>
              }
            >
              <ul>
                {Object.entries(list).map(([menuName, items]) => {
                  return (
                    <div
                      key={menuName}
                      className="grid items-center justify-start px-5"
                    >
                      <h3 className="font-bold text-lg my-2">{menuName}</h3>
                      <ul className="pl-4">
                        {Object.entries(items).map(([itemName, itemMenu]) => {
                          const isHide = (Array.isArray(itemMenu.access) && !accessCheck.haveAny(itemMenu.access));
                          if (isHide) {
                            return null
                          }
                          return (
                            <li
                              key={itemName}
                              className="cursor-pointer py-1"
                              onClick={() => {
                                handleItemClick(itemName)
                                setSelectedAccordionKeys(new Set([]))
                              }} // เมื่อกดจะปิด Accordion
                            >
                              {itemMenu.display}
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )
                })}
              </ul>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="sm:px-4 flex-1">
          {items[activeComponent]?.component ?? items["Home"].component}
        </div>
      </div>









      {/* Desktop View */}
      {/* <div className=" hidden lg:grid grid-cols-[250px_1fr] max-h-screen">
        <SideMenu
          list={list}
          setActiveComponent={handleItemClick}
          activeComponent={activeComponent}
        />
        <div className="px-4">
          {items[activeComponent]?.component ?? items["Home"].component}
        </div>
      </div> */}

      {/* Mobile View */}
      {/* <div className="grid max-h-screen lg:hidden">
        <Accordion
          showDivider={false}
          className="p-2 flex flex-col gap-1 w-full max-w-screen"
          variant="shadow"
          isCompact
        >
          <AccordionItem
            aria-label="Menu Sub"
            startContent
            title={
              <div className="flex items-center space-x-2">
                <span>
                  {
                    Object.entries(list).find(([menuName, items]) =>
                      Object.keys(items).includes(activeComponent)
                    )?.[0]
                  }
                </span>
                <DotIcon className="mx-2" />
                <span>{items[activeComponent]?.display}</span>
              </div>
            }
          >
            <ul>
              {Object.entries(list).map(([menuName, items]) => (
                <div
                  key={menuName}
                  className="grid items-center justify-start px-5"
                >
                  <h3 className="font-bold text-lg my-2">{menuName}</h3>
                  <ul className="pl-4">
                    {Object.entries(items).map(([itemName, itemMenu]) => (
                      <li
                        key={itemName}
                        className="cursor-pointer py-1"
                        onPress={() => handleItemClick(itemName)} // เมื่อกดจะปิด Accordion
                      >
                        {itemMenu.display}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </ul>
          </AccordionItem>
        </Accordion> */}
      {/* Display the selected component */}
      {/* <div className="p-4">
          {items[activeComponent]?.component ?? items["Home"].component}
        </div>
      </div> */}
    </section>
  );
}

export default Management;
