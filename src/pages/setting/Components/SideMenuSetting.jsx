import React, { useEffect } from "react";
import { Card, Accordion, AccordionItem } from "@nextui-org/react";
import { useAppContext } from "@/contexts/AppContext";

function SideMenuSetting({ setActiveComponent, activeComponent, listMenu }) {
  const isActive = (component) => activeComponent === component;

  const { currentUser } = useAppContext();
  const funcActiveComponent = (key) => {
    setActiveComponent(key)
    localStorage.setItem('settingPage', key)
  }

  return (
    <section className="max-h-screen w-[250px] max-w-[250px]">
      <Card className="h-full px-3" shadow="none" radius="sm">
        <div className="flex h-full justify-center">
          <div className="flex-grow overflow-auto scrollbar-hide transition-all duration-700">
            <Accordion defaultExpandedKeys={["management"]} className="w-full mt-4 p-2">
              <AccordionItem key="management" aria-label="Management Menu" title="เมนูตั้งค่า">
                <ul>
                  {Object.keys(listMenu).map((key) => {
                    const isHide = key === 'SetHopefulAward' && currentUser.businessId !== 1;
                    if (isHide) {
                      return null
                    }
                    return (
                      <li key={key}>
                        <div
                          onClick={() => funcActiveComponent(key)}
                          className={`rounded-none py-2 px-4 flex items-center  cursor-pointer 
                          hover:bg-custom-menu-hover transition-colors duration-200 
                          ${isActive(key) ? "bg-custom-menu-hover border-r-4 border-custom-menu text-black" : ""
                            }`}
                        >
                          <span className="ml-4 whitespace-nowrap text-start">{listMenu[key].display}</span>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </Card>
    </section>
  );
}

export default SideMenuSetting;
