import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Image,
  Button,
  Tooltip,
} from "@nextui-org/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
// กำหนดข้อมูลเมนูพร้อม property access (ถ้ามี)
// เมนูที่ไม่มี access (access: []) จะแสดงให้ทุกคนเห็น

const menuData = [
  { label: "HOME", link: "/content-home", access: [] },
  { label: "CONTENT", link: "/content-hopeful", access: [] },
  { label: "STUDIO", link: "/content-studio", access: [] },
  { label: "CRM CaseReview", link: "/content-caseReview", access: [] },
  { label: "CONTACT US", link: "/content-contact", access: [] },
];

export default function NavbarSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { accessCheck } = useAppContext();
  const isActive = (path) => location.pathname.startsWith(path);
  const closeMenu = () => setIsMenuOpen(false);
  const canAccess = (accessArr) => {
    if (!accessArr || accessArr.length === 0) return true;
    return accessCheck.haveAny(accessArr);
  };

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="full"
      className="z-[100] bg-black "
    >
      {/* Logo (Desktop) */}
      <NavbarContent justify="start" className="hidden lg:flex">
        <NavbarBrand>
          <Image
            src="/img/logoHFContent.png"
            alt="Hopeful Logo"
            width={100}
            className="object-contain mt-3" // ลด padding และ margin
          />
        </NavbarBrand>
      </NavbarContent>

      {/* เมนู (Desktop) */}
      <NavbarContent justify="end" className="hidden lg:flex gap-10 ">
        {menuData.map((item, index) =>
          canAccess(item.access) ? (
            <NavbarItem key={index}>
              <div
                onClick={() => {
                  navigate(item.link);
                }}
                className={
                  "text-white hover:text-[#19A6ED] transition duration-200 cursor-pointer font-normal font-prompt " +
                  (isActive(item.link)
                    ? " text-[#19A6ED] font-medium font-prompt border-b-2 border-[#19A6ED]"
                    : "")
                }
              >
                {item.label}
              </div>
            </NavbarItem>
          ) : null
        )}
        <NavbarItem>
          <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">กลับสู่เมนู</div>
                <div className="text-tiny">ไปหน้าเมนูของสำนักงานใหญ่</div>
              </div>
            }
          >
            <a href="https://hopeful-hq.hopeful.co.th/Home">
              <Button className="bg-[#daeffa]" variant="flat">
                HQ
              </Button>
            </a>
          </Tooltip>
        </NavbarItem>
      </NavbarContent>

      {/* Toggle Button (Mobile) */}
      <NavbarContent justify="center" className="lg:hidden">
        <NavbarMenuToggle
          aria-label="Toggle navigation"
          isSelected={isMenuOpen}
          onPress={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white font-extrabold"
        />
      </NavbarContent>

      {/* Logo (Mobile) */}
      <NavbarContent justify="center" className="lg:hidden pl-10">
        <NavbarBrand>
          <Image
            src="/img/logoHFContent.png"
            alt="Hopeful Logo"
            width={200}
            className="object-contain p-10 mt-3"
          />
        </NavbarBrand>
        <NavbarItem>
          <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">ระบบสมาชิก</div>
                <div className="text-tiny">กำลังจะมาในเร็วๆนี้</div>
              </div>
            }
          >
            <a href="https://hopeful-hq.hopeful.co.th/Home">
              <Button className="bg-[#daeffa]" variant="flat" size="sm">
                HQ
              </Button>
            </a>
          </Tooltip>
        </NavbarItem>
      </NavbarContent>

      {/* เมนู (Mobile) */}
      <NavbarMenu isOpen={isMenuOpen} onClose={closeMenu}>
        {menuData.map((item, index) =>
          canAccess(item.access) ? (
            <NavbarMenuItem key={index} className="w-full" ห>
              <div
                onClick={() => {
                  navigate(item.link);
                  closeMenu();
                }}
              >
                <span
                  className={
                    " hover:text-[#19A6ED] transition duration-200 cursor-pointer font-normal font-prompt " +
                    (isActive(item.link)
                      ? " text-[#19A6ED] font-medium font-prompt border-b-2 border-[#19A6ED]"
                      : "")
                  }
                >
                  {item.label}
                </span>
              </div>
            </NavbarMenuItem>
          ) : null
        )}
      </NavbarMenu>
    </Navbar>
  );
}
