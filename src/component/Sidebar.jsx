import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ManagementIcon,
  SettingIcon,
  PadUnlockSquare,
  PadlockSquare,
  DashboardCEOIcon,
  BusinessCardHandIcon,
  MonitorGraphIcon,
} from "./Icons";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  Divider,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { ACCESS } from "@/configs/accessids";

export const mainMenuItems = {
  home: {
    path: "/home",
    text: "หน้าแรก",
    icon: <HomeIcon />,
    access: [],
  },
  Commission: {
    path: "/Dashboard-Sales",
    text: "แดชบอร์ด Sales",
    icon: <DashboardCEOIcon />,
    access: [ACCESS.Dashboard_Sales_view]

  },
  DashboardCEO: {
    path: "/Dashboard-CEO",
    text: "แดชบอร์ดผู้บริหาร",
    icon: <MonitorGraphIcon />,
    access: [ACCESS.Dashboard_Executive_view],
  },
  ExpenseReport: {
    path: "/ExpenseReport",
    text: "ค่าใช้จ่าย",
    icon: <BusinessCardHandIcon />,
    access: [ACCESS.Expense_manage],
  },
  management: {
    path: "/management",
    text: "การจัดการ",
    icon: <ManagementIcon />,
    access: [ACCESS.Management_access, ACCESS.Management_agent, ACCESS.Management_department, ACCESS.Management_role, ACCESS.Management_user],
  },
  setting: {
    path: "/setting",
    text: "การตั้งค่า",
    icon: <SettingIcon />,
    access: [ACCESS.Settings_cod, ACCESS.Settings_commission],
  }
};

function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(
    localStorage.getItem("navbarToggle") === "true"
  );
  const { logout } = useAppContext();

  const navigate = useNavigate();

  const handleToggleSidebar = () => {
    const _value = !isFixed;
    setIsFixed(_value);
    localStorage.setItem("navbarToggle", _value.toString());
  };

  const handleLogout = () => {
    logout();

    navigate("/login");
  };
  const isExpanded = isHovered || isFixed;
  return (
    <Card className="rounded-none shadow-lg">
      <div
        className={`hidden xl:flex h-screen justify-center ${isFixed ? "sidebar-fixed" : ""
          }`}
        onMouseEnter={() => !isFixed && setIsHovered(true)}
        onMouseLeave={() => !isFixed && setIsHovered(false)}
      >
        <div
          className={`pt-0.5 flex flex-col justify-between overflow-auto transition-all duration-200 ${isExpanded ? "w-64" : "w-16"}`}
          style={{ height: "100vh" }}
        >
          {/* Sidebar Header */}
          <div
            className={`contain-header flex justify-between items-center transition-all duration-200 ${isExpanded ? "h-[96px] mt-4" : "h-fit"}`}
          >
            <div className={`${isExpanded ? "px-8" : "px-4 py-2"}`}>
              <div className={`${isHovered || isFixed ? "hidden" : "block"}`}>
                <img
                  src="/img/logosidebar.png"
                  alt="Decorative Icon"
                  className={`transition-transform duration-300 ${isHovered || isFixed ? "w-96" : "w-12 mt-2"
                    }`}
                />
              </div>
              <div>
                {(isFixed || isHovered) && (
                  <span className="flex justify-center ml-2 whitespace-nowrap">
                    <img
                      src="/img/textNavbar.png"
                      style={{ width: "800px" }}
                      alt="Navbar Text"
                      className="transition-transform duration-300"
                    />
                  </span>
                )}
                {/* Icon Toggle Button */}
                {(isFixed || isHovered) && (
                  <span className="flex justify-center p-1 transition-transform duration-300">
                    <Button
                      isIconOnly
                      onPress={handleToggleSidebar}
                      size="sm"
                      variant="light"
                      className="w-8"
                    >
                      {isFixed ? (
                        <span className="flex items-center space-x-2 text-xs text-custom-redlogin">
                          <p>
                            <PadlockSquare />
                          </p>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-2 text-xs text-green-600">
                          <p>
                            <PadUnlockSquare />
                          </p>
                        </span>
                      )}
                    </Button>
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* Sidebar Header */}
          {/* Menu */}
          {/* อยู่ component MainMenu ข้างล่างใช้ตัวเดียวกับ NavMenu */}
          <div
            className={`flex-1 overflow-auto scrollbar-hide ${isExpanded ? "px-4" : "px-0"}`}
          >
            <MainMenu isShow={isExpanded} />
          </div>
          {/* Sidebar Footer */}
          {isExpanded && (
            <div className="px-4">
              <Divider className="my-4" />
              <div className="flex justify-center text-small h-[64px]">
                <Button
                  className="w-16 mb-4 h-8 bg-custom-redlogin border-custom-redlogin text-white shadow-lg shadow-custom-redlogin-effect"
                  onPress={handleLogout}
                >
                  ออกจากระบบ
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export function MainMenu({ isShow, isNavMenu, onSelectMenu = () => { } }) {
  const currentData = useAppContext();
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState(
    findParentMenu(location.pathname)?.[0]
  );

  function findParentMenu(subMenuPath) {
    return Object.entries(mainMenuItems).find(([key, value]) => {
      if (value.subMenu) {
        return Object.entries(value.subMenu).some(
          ([subKey, subValue]) => subValue.path === subMenuPath
        );
      }
      return null;
    });
  }

  function handleSelectMenu(menu) {
    setSelectedMenu(menu);
    onSelectMenu(menu);
  }
  return (
    <div className="mt-4">
      {Object.entries(mainMenuItems).map(([key, value]) => {
        return (
          <ul key={key} className="w-full">
            <li id={key}>
              {value.subMenu ? (
                <div>
                  <Accordion
                    selectedKeys={
                      !isShow ? [] : !selectedMenu ? [] : [selectedMenu]
                    }
                    onSelectionChange={() => handleSelectMenu(value.text)}
                  >
                    <AccordionItem
                      key={key}
                      title={
                        <div className="rounded-none flex items-center transition-colors duration-200 text-base">
                          <span className="flex items-center justify-center w-12">
                            {value.icon}
                          </span>
                          {isShow && (
                            <span
                              id="font-icon"
                              className="ml-2 whitespace-nowrap"
                            >
                              {value.text}
                            </span>
                          )}
                        </div>
                      }
                    >
                      <div className="ps-3">
                        {Object.entries(value.subMenu).map(
                          ([subKey, subValue]) => {
                            return (
                              <Link
                                to={subValue.path}
                                className={`rounded-none py-3 flex items-center hover:bg-custom-menu-hover transition-colors duration-200 
                                ${location.pathname === subValue.path
                                    ? isNavMenu
                                      ? "text-primary"
                                      : " bg-custom-menu-hover border-r-4 border-custom-menu text-black "
                                    : ""
                                  }`}
                              >
                                <span className="flex items-center justify-center w-12 ml-2">
                                  {subValue.icon}
                                </span>
                                {isShow && (
                                  <span
                                    id="font-icon"
                                    className="ml-2 whitespace-nowrap"
                                  >
                                    {subValue.text}
                                  </span>
                                )}
                              </Link>
                            );
                          }
                        )}
                      </div>
                    </AccordionItem>
                  </Accordion>
                </div>
              ) : currentData.accessCheck.haveAny(value.access) ? (
                <Link
                  onClick={() => handleSelectMenu(value.text)}
                  to={value.path}
                  className={`rounded-none py-3 flex items-center hover:bg-custom-menu-hover transition-colors duration-200 
                    ${location.pathname === value.path
                      ? isNavMenu
                        ? "text-primary"
                        : " bg-custom-menu-hover border-r-4 border-custom-menu text-black "
                      : ""
                    }`}
                >
                  <span className="flex items-center justify-center w-12 ml-2">
                    {value.icon}
                  </span>
                  {isShow && (
                    <span id="font-icon" className="ml-2 whitespace-nowrap">
                      {value.text}
                    </span>
                  )}
                </Link>
              ) : null}
            </li>
          </ul>
        );
      })}
    </div>
  );
}

export default Sidebar;
