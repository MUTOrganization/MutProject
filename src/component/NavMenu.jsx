import React, { useState, useEffect } from "react";
import { Divider, Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { MainMenu } from "./Sidebar";

function NavMenu() {
  const [isHovered, setIsHovered] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isFixed, setIsFixed] = useState(
    Boolean(localStorage.getItem("navbarToggle"))
  );
  const {logout } = useAppContext();

  const navigate = useNavigate();


  const handleToggleSidebar = () => {
    const _value = !isFixed;
    setIsFixed(_value);
    localStorage.setItem("navbarToggle", _value);
  };

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  useEffect(() => {
    // Define the media query
    const mediaQuery = window.matchMedia("(max-width: 600px)");

    // Update state based on the media query match
    setIsSmallScreen(mediaQuery.matches);

    // Define the listener function
    const handleWindowResize = () => {
      setIsSmallScreen(mediaQuery.matches);
    };

    // Add event listener to listen for window resize
    mediaQuery.addEventListener("change", handleWindowResize);

    // Clean up the event listener on component unmount
    return () => mediaQuery.removeEventListener("change", handleWindowResize);
  }, []);
  return (
    <div>
      <MainMenu isShow={true} isNavMenu={true} />
      <div className="sticky bottom-0">
        <Divider className="my-4" />
        <div className="flex justify-center items-center text-small">
          <Button
            className="w-16 mb-4 h-8 bg-custom-redlogin border-custom-redlogin text-white shadow-lg shadow-custom-redlogin-effect"
            onPress={handleLogout}
          >
            ออกจากระบบ
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NavMenu;
