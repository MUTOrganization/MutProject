import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ManagementIcon,
  SettingIcon,
  PadUnlockSquare,
  PadlockSquare,
  DashBoardAdsIcon,
  DevIcon,
  DashboardSummaryIcon,
  StatsplatformIcon,
  DashBoardSaleIcon,
  MoneyBagIcon,
  DashboardCEOIcon,
  BusinessCardHandIcon,
  MoneyBeggingIcon,
  ConfirmCommssionIcon,
  ExpenseIcon,
  PhoneTalkIcon,
  OverviewIcon,
  DocumentProductIcon,
  DashBoardNightcoreIcon,
  AwardMedalIcon,
  RankIcon,
  RankingIcon,
  InsightsIcon,
  OKR,
  OKR_Dashboard
} from "./Icons";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  Divider,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { ACCESS } from "../configs/access";
import { useAppContext } from "../contexts/AppContext";

//!!!!!เพิ่มเมนูใหม่ใน Sidebar และ NavMenu ได้ที่นี่
export const mainMenuItems = {
  home: {
    path: "/home",
    text: "หน้าแรก",
    icon: <HomeIcon />,
    access: [],
  },
  DashBoardNightcore: {
    path: "/DashBoardNicecall",
    text: "Nice Call",
    icon: <DashBoardNightcoreIcon />,
    access: [ACCESS.dashboard.dashboardNiceCall],
  },
  DocumentProduct: {
    path: "/DocumentProduct",
    text: "ข้อมูลสินค้า",
    icon: <DocumentProductIcon />,
    access: [ACCESS.document_product.view_document_product],
  },
  Commission: {
    path: "/Commission",
    text: "คอมมิชชัน",
    icon: <DashboardCEOIcon />,
    access: [
      ACCESS.commisson.commissionOwnVeiw,
      ACCESS.commisson.commissionAllVeiw,
      ACCESS.commisson.commissionOwnerAgentView,
    ],
  },
  // DashBoardInsights: {
  //   path: "/Dashboard-Insights",
  //   text: "แดชบอร์ด RFM",
  //   icon: <InsightsIcon />,
  //   access: [ACCESS.dashboard_rfm.dashboard_rfm],
  // },
  // DashBoardCRM: {
  //   path: "/Dashboard-CRM",
  //   text: "แดชบอร์ด CRM",
  //   icon: <MoneyBagIcon />,
  //   access: [ACCESS.dashboard_crm.crm_dashboard],
  // },
  // DashBoardTalkTime: {
  //   path: "/Dashboard-TalkTime",
  //   text: "แดชบอร์ด Talk Time",
  //   icon: <PhoneTalkIcon />,
  //   access: [ACCESS.dashboard_talk_time.dashboard_talk_time],
  // },
  // DashboardOverView: {
  //   path: "/Dashboard-Overview",
  //   text: "แดชบอร์ด ยอดสั่งซื้อ",
  //   icon: <OverviewIcon />,
  //   access: [ACCESS.dashboard_overview.dashboard_overview],
  // },
  // ConfirmCommssion: {
  //   path: "/ConfirmCommission",
  //   text: "ยืนยันค่าคอม",
  //   icon: <ConfirmCommssionIcon />,
  //   access: [ACCESS.commisson.confirmCommission],
  // },
  // DashboardSummary: {
  //   path: "/Dashboard-Summary",
  //   text: "Summary",
  //   icon: <DashboardSummaryIcon />,
  //   access: [ACCESS.dashboard.summary_veiw],
  // },
  // DashBoardSale: {
  //   path: "/Dashboard-Sale",
  //   text: "Dashboar Sale",
  //   icon: <DashBoardSaleIcon />,
  //   access: [ACCESS.dashboard.view_dashboard_sale],
  // },
  // DashBoardAds: {
  //   path: "/Dashboard-Ads",
  //   text: "Dashboard Ads",
  //   icon: <DashBoardAdsIcon />,
  //   access: [ACCESS.dashboard.stat_platform],
  // },
  // DashboardStatsPlatform: {
  //   path: "/Dashboard-StatsPlatform",
  //   text: "StatsPlatform",
  //   icon: <StatsplatformIcon />,
  //   access: [ACCESS.dashboard.stat_platform],
  // },
  ExpenseReport: {
    path: "/ExpenseReport",
    text: "ค่าใช้จ่าย",
    icon: <BusinessCardHandIcon />,
    access: [ACCESS.expenses.expenses_all],
  },
  // HistoryTopup: {
  //   path: "/HistoryTopUp",
  //   text: "เติมเงิน",
  //   icon: <MoneyBeggingIcon />,
  //   access: [ACCESS.topup.topup_own_view],
  // },
  // TransactionHistory: {
  //   path: "/TransactionHistory",
  //   text: "ประวัติการทำธุรกรรม",
  //   icon: <ExpenseIcon />,
  //   access: [ACCESS.TransactionHistory.viewOwner],
  // },
  // AwardDashboard: {
  //   path: "/Award_Dashboard",
  //   text: "AwardDashboard",
  //   icon: <RankingIcon />,
  //   access: [ACCESS.hopeful_hero.Award_Dashboard],
  // },
  // Award: {
  //   path: "/Award",
  //   text: "Award",
  //   icon: <AwardMedalIcon />,
  //   access: [ACCESS.hopeful_hero.Award_View],
  // },
  // OKR: {  
  //   path: "/okr",
  //   text: "My OKR",
  //   icon: <OKR />,
  //   access: [ACCESS.OKR.okr_personalprofile],
  // },
  // OKRDashboard: {
  //   path: "/okr_dashboard",
  //   text: "OKR Dashboard",
  //   icon: <OKR_Dashboard />,
  //   access: [ACCESS.OKR.okr_dashboard],
  // },
  management: {
    path: "/management",
    text: "การจัดการ",
    icon: <ManagementIcon />,
    access: [ACCESS.management.management_all],
  },
  setting: {
    path: "/setting",
    text: "การตั้งค่า",
    icon: <SettingIcon />,
    access: [ACCESS.settings.settings_all],
  },

  //ลองเล่นได้
  // hasSubMenu: {
  //   text: "เมนูแบบมีเมนูย่อย",
  //   icon: <HintIcon />,
  //   subMenu: {
  //     sub1: {
  //       path: "/management", text: "การจัดการ", icon: <ManagementIcon />,
  //       access: []
  //     },
  //     sub2: {
  //       path: "/setting", text: "การตั้งค่า", icon: <SettingIcon />,
  //       access: []
  //     }
  //   }
  // },
  // hasSubMenu2: {
  //   text: "เมนูแบบมีเมนูย่อย2",
  //   icon: <LoginKeyIcon />,
  //   subMenu: {
  //     sub1: {
  //       path: "/HistoryTopUp", text: "เติมเงิน", icon: <MoneyBeggingIcon />,
  //       access: []
  //     },
  //     sub2: {
  //       path: "/TransactionHistory", text: "ประวัติการทำธุรกรรม", icon: <ExpenseIcon />,
  //       access: []
  //     }
  //   }
  // },

  // dev: {
  //   path: "/dev", text: "Dev Hopeful", icon: <DevIcon />,
  //   access: []
  // },
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
        className={`hidden xl:flex h-screen justify-center ${
          isFixed ? "sidebar-fixed" : ""
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
                  className={`transition-transform duration-300 ${
                    isHovered || isFixed ? "w-96" : "w-12 mt-2"
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

export function MainMenu({ isShow, isNavMenu }) {
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
                    onSelectionChange={(keys) =>
                      setSelectedMenu(Array.from(keys)[0])
                    }
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
                                ${
                                  location.pathname === subValue.path
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
                  to={value.path}
                  className={`rounded-none py-3 flex items-center hover:bg-custom-menu-hover transition-colors duration-200 
                    ${
                      location.pathname === value.path
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
