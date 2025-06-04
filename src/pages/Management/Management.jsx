import React, { lazy, Suspense, useEffect, useState } from "react";
import { DotIcon } from "@/component/Icons";
import { useNavigate } from "react-router-dom";
import SideMenu from "./Components/SideMenuManage";
import { Accordion, AccordionItem, CircularProgress } from "@heroui/react";
import { useAppContext } from "../../contexts/AppContext";

const AgentManage = lazy(() => import("./Pages/AgentManage/AgentManagePage"));
const ManageUser = lazy(() => import("./Pages/UserManage/ManageUser"));
const DepartmentAndRoleManage = lazy(() => import("./Pages/DepartmentAndRolesManage/DepartmentAndRoleManage"));
const MasterAccess = lazy(() => import("./Pages/AccessManage/MasterAccess"));
import Page403 from "../Page403";

function Management() {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState(sessionStorage.getItem('managePageMenu') ?? null);
  const [isForbidden, setIsForbidden] = useState(false);

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
      if (initialComponent) {
        setActiveComponent(initialComponent);
        sessionStorage.setItem('managePageMenu', initialComponent);
      } else {
        setActiveComponent(null);
        sessionStorage.removeItem('managePageMenu');
        setIsForbidden(true);
      }
    }
  }, [activeComponent]);

  const list = {
    การจัดการ: {
      // Home: { display: "จัดการหน้าแรก", component: <ManageHome />, access: [ACCESS.home.manage_home] },
      accessManage: { display: "จัดการสิทธิ์", component: <MasterAccess />, access: [] },
      agentManage: { display: "จัดการตัวแทน", component: <AgentManage />, access: [] },
      depAndRole: {
        display: "จัดการแผนกและตำแหน่ง",
        component: <DepartmentAndRoleManage />,
        access: [

        ]
      },
      usersManage: { display: 'จัดการผู้ใช้งาน', component: <ManageUser />, access: [] },
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
              {items[activeComponent]?.display ?? items["depAndRole"].display}
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
            aria-label="Menu"
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
                              }}
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
          {isForbidden ? <Page403 />
            :
            <Suspense fallback={<div className="w-full flex justify-center mt-4"><CircularProgress /></div>}>
              {items[activeComponent]?.component}
            </Suspense>
          }
        </div>
      </div>
    </section>
  );
}

export default Management;
