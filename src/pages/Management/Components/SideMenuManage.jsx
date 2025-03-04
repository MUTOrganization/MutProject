import React, { useEffect, useState } from "react";
import { Card, Accordion, AccordionItem } from "@nextui-org/react";
import { useAppContext } from "../../../contexts/AppContext";

function SideMenuManage({ setActiveComponent, activeComponent, list }) {
  const { accessCheck } = useAppContext()
  const isActive = (component) => activeComponent === component;

  return (
    <section className="max-h-screen w-1/7">
      <Card className="px-3" shadow="none" radius="sm">
        <div className="flex justify-center">
          <div className="flex-grow overflow-auto transition-all duration-700 scrollbar-hide">
            <Accordion defaultExpandedKeys={["การจัดการ"]} className="w-full">
              {Object.entries(list).map(([menuName, items]) => {
                return (
                  <AccordionItem
                    key={menuName}
                    aria-label={`${menuName} Menu`}
                    title={menuName}
                  >
                    <ul>
                      {Object.entries(items).map(([itemName, itemMenu]) => {
                        const isHide = (Array.isArray(itemMenu.access) && !accessCheck.haveAny(itemMenu.access));
                        if(isHide){
                          return null
                        }
                        return (
                          <li key={itemName}>
                            <div
                              onClick={() => setActiveComponent(itemName)}
                              className={`rounded-none py-2 flex items-center cursor-pointer hover:bg-custom-menu-hover transition-colors duration-200 ${isActive(itemName)
                                ? "bg-custom-menu-hover border-r-4 border-custom-menu text-black"
                                : ""
                                }`}
                            >
                              <span className="ml-4">{itemMenu.display}</span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>
      </Card>
    </section>
  );
}

export default SideMenuManage;
