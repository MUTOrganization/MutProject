import React, { useState } from "react";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  User,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
} from "@nextui-org/react";
import { Chip, Card } from "@nextui-org/react";
import { useAppContext } from "../contexts/AppContext";
import NavMenu from "./NavMenu";
import UserProfileAvatar from "./UserProfileAvatar";
import TopupModal from "./TopupModal";
import { LogoutIcon } from './Icons'
import { useNavigate } from "react-router-dom";
import { ACCESS } from "../configs/access";

function Navbar({ title }) {
  const { currentUser, logout } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [openModalTopup, setOpenModalTopup] = useState(false);
  const ImageProfile = currentUser.displayImgUrl;
  const role = currentUser.role;
  const navigate = useNavigate();
  const currentData = useAppContext();

  const getChipColor = (role) => {
    switch (role) {
      case "Staff":
        return "default"; // สีเขียว
      case "Manager":
        return "primary"; // สีน้ำเงิน
      case "Supervisor":
        return "success"; // สีส้ม
      case "Senior":
        return "secondary"; // สีส้ม
      default:
        return "default"; // สีเริ่มต้น (ถ้าไม่มี role ที่กำหนด)
    }
  };


  const handleLogout = () => {
    logout();

    navigate("/login");
  };




  return (
    <>
      <TopupModal open={openModalTopup} onClose={e => setOpenModalTopup(e)} />

      <NextUINavbar
        maxWidth="2xl"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        className="px-4 bg-white py-2 rounded-b-xl shadow-none z-20">
        <NavbarBrand>
          <div className="flex justify-between items-center w-full sm:w-auto gap-4">
            <NavbarMenuToggle
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="xl:hidden mr-2 h-8" />
            <div className="flex gap-4 items-center">
              <p className="font-bold text-inherit lg:text-xl  text-sm">
                {title}
              </p>
              {/* Role Chip */}
              <Chip color={getChipColor(role)} variant="flat" className="sm:text-sm">
                {role}
              </Chip>
            </div>
          </div>
        </NavbarBrand>
        <NavbarMenu className=" rounded-xl shadow-none w-[97%] mx-auto">
          <NavMenu />
        </NavbarMenu>

        <NavbarContent
          as="div"
          justify="end"
          className="w-full sm:flex sm:items-center sm:justify-end"
        >
          <div className="hidden sm:flex flex-col text-end">
            <p className="font-bold">{currentUser.name}</p>
            <p>{currentUser.userName}</p>
          </div>

          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <span className="cursor-pointer">
                <UserProfileAvatar name={currentUser.userName} imageURL={currentUser.displayImgUrl} />
              </span>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem
                isReadOnly
                key="profile-display"
                className="h-14 gap-2"
                id="user-profile-image">
                <div className="flex space-x-2">
                  <UserProfileAvatar name={currentUser.userName} size="sm" imageURL={currentUser.displayImgUrl} />

                  {(() => {
                    if (currentUser.name && currentUser.nickname) {
                      return (
                        <div className="flex flex-col justify-start items-start text-xs">
                          <p>{currentUser.name}</p>
                          <p>{currentUser.nickname}</p>
                        </div>
                      );
                    } else if (currentUser.name || currentUser.nickname) {
                      return (
                        <div className="flex justify-start items-center text-xs">
                          <p>{currentUser.name || currentUser.nickname}</p>
                        </div>
                      );
                    }
                  })()}

                </div>
              </DropdownItem>
              {/* <DropdownItem key="settings" color="primary">
                KPI ของฉัน
              </DropdownItem> */}
              {currentData.accessCheck.haveAny([ACCESS.topup.topup_own_view]) && (
                <DropdownItem key="topUp" color="primary" onPress={() => setOpenModalTopup(true)}>
                  เติมเงิน
                </DropdownItem>
              )}
              {currentData.accessCheck.haveAny([ACCESS.TransactionHistory.viewOwner]) && (
                <DropdownItem key="analytics" color="primary" onPress={() => navigate('/HistoryTopUp')}>
                  ประวัติการทำธุรกรรม
                </DropdownItem>
              )}
              <DropdownItem key="settings" color="danger" startContent={<LogoutIcon />} onPress={handleLogout}>
                ออกจากระบบ
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </NextUINavbar>
    </>
  );
}

export default Navbar;
